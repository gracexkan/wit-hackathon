from distutils.command.build_ext import build_ext
from heapq import merge
from itertools import accumulate
import json
import os
import queue
from typing import Type
import requests
import pandas as pd
import bs4
from bs4 import BeautifulSoup
import re
import pandas as pd
from geopy.distance import geodesic as GD
from datetime import datetime, timedelta
THRESH_VAL = 0.6
MIN_COST = 2.3
MAX_COST = 3.8
BASE_URL: str = "https://www.waternsw.com.au/supply/"
REGIONAL_URL: str = f'{BASE_URL}regional-nsw/dam-levels/'
GREATER_SYD_URL: str = f'{BASE_URL}Greater-Sydney/greater-sydneys-dam-levels/'

def strip_html(data):
    if data is not None:
        p = re.compile(r'<.*?>')
        return p.sub('', str(data))

def _scrape_dams_data(url: str):
    try: 
        page = requests.get(url.strip())
        soup = BeautifulSoup(page.content, "html.parser")
        res = soup.find(id="tabs-2")
        dam_data = res.find_all("tr")
        queried_dam_l = []
        for d in dam_data:
            
            dam = { "dam_name" : strip_html(d.find("b")),
            "data_recorded" : strip_html(d.find("span", class_="recorded-date")),
            "dam_storage_cap" : strip_html(d.find("td", class_="storage-capacity")),
            "dam_current_level" : strip_html(d.find("td", class_="current-level")),
            "dam_percent_full" : strip_html(d.find("td", class_="percent-full")),
            "dam_net_change" : strip_html(d.find("td", class_="net-change"))}
            
            if dam["dam_name"] is not None:
                queried_dam_l.append(dam)
        return queried_dam_l
    except TypeError: 
        return

def scrape_regional_dams_data():
    return _scrape_dams_data(REGIONAL_URL)

def scrape_greater_syd_dams_data():
    page = requests.get(GREATER_SYD_URL.strip())
    soup = BeautifulSoup(page.content, "html.parser")
    dam_data = soup.find(id="dams")
    queried_dam_l = []
    for d in dam_data.find_all('div'):
        if strip_html(d.find("div", class_="dam-name")) is not None:
            
            dam = { "dam_name" : strip_html(d.find("div", class_="dam-name")),
                "data_recorded" : strip_html(d.find("div", class_="curr-date")),
                "dam_storage_cap" : strip_html(d.find("div", class_="curr-cap-ml")).replace(",",""),
                "dam_current_level" : strip_html(d.find("div", class_="curr-ml")).replace(",",""),
                "dam_percent_full" : strip_html(d.find("div", class_="curr-pc")).replace("%",""),
                "dam_net_change" : strip_html(d.find("div", class_="lw-pc-change"))}
            queried_dam_l.append(dam)
    return queried_dam_l


def status_check(): 
    return "Backend for GRASS is alive!"


def get_dam_obj(): 
    with open("./src/dams.json") as f:
        data = json.load(f)
        return data

def get_regional_dams_obj(): 
    return get_dam_obj()["regional"]
    
def get_greater_syd_dam_obj(): 
    return get_dam_obj()["greater_sydney"]

def set_dams_obj(data): 
    with open("./src/dams.json", "w") as f:
        f.write(json.dumps(data))


def remove_user(client_name):
    data = get_dam_obj()
    for obj in data["regional"]:
        if client_name in obj['clients']:
            obj['clients'].remove(client_name)
    for obj in data["greater-sydney"]:
        if client_name in obj['clients']:
            obj['clients'].remove(client_name)
    set_dams_obj(data)


def edit_user_preference(client_name, dam_name):
    data = get_dam_obj()
    for obj in data["regional"]:
        if obj['name'] == dam_name:
            obj['clients'].append(client_name)
    for obj in data["greater_sydney"]:
        if obj['name'] == dam_name:
            obj['clients'].append(client_name)
    set_dams_obj(data)


def get_dam_cost_payout(curr_level, storage_cap): 
    return MIN_COST if (curr_level / storage_cap) > THRESH_VAL else MAX_COST

def dam_info_reducer(dam_elem, dam_location_type): 
    response = { 
        "name" : dam_elem['name'],
        "surface": 0,
        "lat": 0,
        "lng": 0,
        "dam_current_level": 0,
        "dam_storage_cap": 0,
        "data_recorded": 0,
        "cost_incurred": 0
    }
    iterator_obj = scrape_regional_dams_data() if dam_location_type == "regional" else scrape_greater_syd_dams_data()
    for obj in iterator_obj:
        if obj['dam_name'] == dam_elem['name']:
            response['dam_current_level'] = int(obj['dam_current_level'])
            response['dam_storage_cap'] = int(obj['dam_storage_cap'])
            response['data_recorded'] = obj['data_recorded']
            response['surface'] = int(dam_elem['surface'])
            response['lat'] = float(dam_elem['lat'])
            response['lng'] = float(dam_elem['lng'])
            get_dam_cost_payout(curr_level=response['dam_current_level'], storage_cap=response['dam_storage_cap'])
            response['cost_incurred'] = get_dam_cost_payout(curr_level=response['dam_current_level'], storage_cap=response['dam_storage_cap'])
            
            return response
    return None


def get_dam_information(dam_elem, dam_location_type):
    response1 = dam_info_reducer(dam_elem, dam_location_type="regional")
    response2 = dam_info_reducer(dam_elem, dam_location_type="greater_sydney")
    return response1 if response2 is None else response2

def evaporation_rate(time_in_days: int, surface_area_of_body_km_2: int): 
    # https://calculator.agriculture.vic.gov.au/fwcalc/information/determining-the-evaporative-loss-from-a-farm-dam
    CONST_CONVERSION_FACTOR = 0.67
    date_l = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(time_in_days)]
    # Get data persisted from trained ml model
    with open("./src/forecast.json") as f:
        data = json.load(f)
        accumulate_rainfall = 0
        for x in data:
            if x['ds'] in date_l:
                accumulate_rainfall += float(x['yhat1'])
    e_pan = 900 / 180 * time_in_days
    e_net = CONST_CONVERSION_FACTOR * e_pan - accumulate_rainfall
    e_total = surface_area_of_body_km_2 / 1000 * (e_net)
    return e_total


def get_ml_predicted_capacity(curr_cap, max_cap, surface_area_km_2):
    er = evaporation_rate(7, surface_area_km_2)
    return get_dam_cost_payout(curr_cap - er, max_cap)
     
def haversines_dist(lat1, lon1, lat2, lon2):
    return GD((lat1, lon1), (lat2, lon2)).km

def get_most_effective_alloc(business_type, lat, lng): 
    # Get the most effective allocation of water to the client
    regional_ranked = []
    greater_sydney_ranked = []
    with open("./src/dams.json") as f:
        data = json.load(f)
        for elem in data["regional"]:
            regional_ranked.append(get_dam_information(elem, "regional"))
        for elem in data["greater_sydney"]:
            greater_sydney_ranked.append(get_dam_information(elem, "greater_sydney"))

    # # stored information based on which region comes out of the json file
    
    # sorted(regional_ranked, key = lambda reservoir: haversines_dist(lat, lng, reservoir["lat"], reservoir["lng"]))
    # sorted(greater_sydney_ranked, key = lambda reservoir: haversines_dist(lat, lng, reservoir["lat"], reservoir["lng"]))
    # # sorted by distance already
    # selected_reservoir = None

    # # Look at business type now:
    if business_type == "regional":
        # Regionals get the advantage of the closest reservoirs first.
        merged_ranked = regional_ranked + greater_sydney_ranked
        if None in merged_ranked:
            merged_ranked.remove(None)
        merged_ranked = sorted(merged_ranked, key = lambda reservoir:  haversines_dist(lat, lng, reservoir["lat"], reservoir["lng"]) 
        )

        
        # There could be the edge case that the closest reservoir is in the greater sydney region,
        # in that case the user will be prompted to take this.

        for info in merged_ranked:
            if get_ml_predicted_capacity(info["dam_current_level"], info["dam_storage_cap"], info["surface"] ) == MIN_COST:
                return info 
            else: 
                # This incurred max cost 
                selected_reservoir = info
        # If we get here, then we have checked by distance and min cost. 
        # Now we rank by closest reservoir that has most remaining capacity in the next projected days. 
        # This is the most effective allocation of water to the client.
        merged_ranked = sorted(merged_ranked, key = lambda reservoir: reservoir["dam_current_level"] / reservoir["dam_storage_cap"])
        return merged_ranked[0]

    elif business_type == "greater_sydney":
        for info in greater_sydney_ranked:
            if get_ml_predicted_capacity(info["dam_current_level"], info["dam_storage_cap"], info["surface"]) == MIN_COST:
                return info 
            else: 
                # This incurred max cost 
                selected_reservoir = info
        merged_ranked = sorted(greater_sydney_ranked, key = lambda reservoir: reservoir["dam_current_level"] / reservoir["dam_storage_cap"])
        return greater_sydney_ranked[0]
    



