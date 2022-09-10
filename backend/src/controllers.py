from distutils.command.build_ext import build_ext
from itertools import accumulate
import json
import os
from typing import Type
import requests
import pandas as pd
import bs4
from bs4 import BeautifulSoup
import re
import pandas as pd
import sqldf

from datetime import datetime, timedelta

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
                "dam_storage_cap" : strip_html(d.find("div", class_="curr-cap-ml")),
                "dam_current_level" : strip_html(d.find("div", class_="curr-ml")),
                "dam_percent_full" : strip_html(d.find("div", class_="curr-pc")),
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
    return get_dam_obj()["greater-sydney"]

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
    for obj in data["greater-sydney"]:
        if obj['name'] == dam_name:
            obj['clients'].append(client_name)
    set_dams_obj(data)


def get_dam_information(dam_name):
    response = { 
        "name" : dam_name,
        "surface": 0,
        "lat": 0,
        "long": 0,
        "dam_current_level": 0,
        "dam_storage_cap": 0,
        "data_recorded": 0,
    }
    for obj in scrape_regional_dams_data():
        if obj['dam_name'] == dam_name:
            response['dam_current_level'] = int(obj['dam_current_level'])
            response['dam_storage_cap'] = int(obj['dam_storage_cap'])
            response['data_recorded'] = obj['data_recorded']
            for read_file in get_regional_dams_obj(): 
                if read_file['name'] == dam_name:
                    response['surface'] = int(read_file['surface'])
                    response['lat'] = float(read_file['lat'])
                    response['lng'] = float(read_file['lng'])

    for obj in scrape_greater_syd_dams_data():
        if obj['dam_name'] == dam_name:
            print(obj['dam_current_level'])
            response['dam_current_level'] = int(obj['dam_current_level'])
            response['dam_storage_cap'] = int(obj['dam_storage_cap'])
            response['data_recorded'] = obj['data_recorded']
            for read_file in get_greater_syd_dam_obj(): 
                if read_file['name'] == dam_name:
                    response['surface'] = int(read_file['surface'])
                    response['lat'] = float(read_file['lat'])
                    response['lng'] = float(read_file['lng'])
    return response

    
def get_most_effective_alloc(client_name, business_type, location): 
    if business_type == "regional":
        with open("./src/dams.json") as f:

            data = json.load(f)
            evaporation_rate(7, data)
    # if regional business, we look at closest regional places that are cost effective
    #   if regional places are exhausted, we look at commercial places.

    # if commercial business, we first look at commercial places that are cost effective
    #   if all of those are exhausted, we can then look into regional places.
    pass




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

