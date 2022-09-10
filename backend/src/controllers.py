import json
import os
from typing import Type
import requests
import pandas as pd
import bs4
from bs4 import BeautifulSoup
import re


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

def calculate_costs(business_type, location): 
    # if regional business, we look at closest regional places that are cost effective
    #   if regional places are exhausted, we look at commercial places.
    
    # if commercial business, we first look at commercial places that are cost effective
    #   if all of those are exhausted, we can then look into regional places.
    pass

def evaporation_rate(time_in_days: int, surface_area_of_body_km_2: int): 
    # https://calculator.agriculture.vic.gov.au/fwcalc/information/determining-the-evaporative-loss-from-a-farm-dam
    CONST_CONVERSION_FACTOR = 0.67
    e_pan = 900 / 180 * time_in_days
    e_net = CONST_CONVERSION_FACTOR * e_pan - rainfall
    e_total = surface_area_of_body_km_2 / 1000 * (e_net)
    return e_total
