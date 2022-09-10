from distutils.command.build_ext import build_ext
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
    return get_dam_obj["regional"]
    
def get_greater_syd_dam_obj(): 
    return get_dam_obj["greater-sydney"]

def set_dams_obj(data): 
    with open("./src/dams.json") as f:
        json.dump(data, f)


def remove_user(client_name):
    data = get_dam_obj()
    for obj in data["regional"]:
        if client_name in obj['clients']:
            obj['clients'].pop(client_name)
    for obj in data["greater-sydney"]:
        if client_name in obj['clients']:
            obj['clients'].pop(client_name)
    set_dams_obj(data)


def edit_user_preference(client_name, dam_name):
    data = get_dam_obj()
    for obj in data["regional"]:
        if obj['dam_name'] == dam_name:
            obj['clients'].add(client_name)
    for obj in data["greater-sydney"]:
        if obj['dam_name'] == dam_name:
            obj['clients'].add(client_name)
    set_dams_obj(data)


def calculate_costs(client_name, business_type, location): 
    if business_type == "regional":
        with open("./src/dams.json") as f:
            data = json.load(f)
            print(data)
    # if regional business, we look at closest regional places that are cost effective
    #   if regional places are exhausted, we look at commercial places.

    # if commercial business, we first look at commercial places that are cost effective
    #   if all of those are exhausted, we can then look into regional places.
    pass



def evaporation_rate(time_in_days: int, surface_area_of_body_km_2: int): 
    # https://calculator.agriculture.vic.gov.au/fwcalc/information/determining-the-evaporative-loss-from-a-farm-dam
    CONST_CONVERSION_FACTOR = 0.67
    nod=time_in_days
    df=pd.read_csv('./src/forecast.csv')
    print(df)
    current_date=datetime.today().strftime('%Y-%m-%d')
    next_date = (datetime.now() + timedelta(days=int(nod))).strftime('%Y-%m-%d')
  
    # query = "SELECT sum(yhat1) FROM {} where ds between '{}'   and '{}' ".format(df, current_date,next_date) 
    # x = sqldf.run(query).values.tolist()
    # print(x)
    e_pan = 900 / 180 * time_in_days
    e_net = CONST_CONVERSION_FACTOR * e_pan - 2
    e_total = surface_area_of_body_km_2 / 1000 * (e_net)
    return e_total
