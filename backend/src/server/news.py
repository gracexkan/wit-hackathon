# list of dicts: categories title, description, 
# get random articles
# then for each random article, query for 2 more similar articles like that article
# then for each articles give relevant information (title, description, )

# query based on category / location

import json
from newsapi import NewsApiClient
import requests

# track what articles they've been reading -> information from frontend
def get_api_key():
    with open("news.json") as f:
        data = json.load(f)

    return data["api_key"]

def get_base_url():
    with open("news.json") as f:
        data = json.load(f)
    
    return data["base_url"]

def get_everything(query_string):
    return requests.get(f"https://newsapi.org/v2/everything?apiKey={get_api_key()}{query_string}").json()

def get_latest_news(category, search=None, country=None):
    """ 
        Gets the latest news for a particular search, catergory or location
    """
    
    api_key = get_api_key()

    categories = {'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'}
    countries = {'ae,ar,at,au,be,bg,br,ca,ch,cn,co,cu,cz,de,eg,fr,gb,gr,hk,hu,id,ie,il,in,it,jp,kr,lt,lv,ma,mx,my,ng,nl,no,nz,ph,pl,pt,ro,rs,ru,sa,se,sg,si,sk,th,tr,tw,ua,us,ve,za'}

    # Initialise
    newsapi = NewsApiClient(api_key=api_key)
    
    query = ""
    
    if search:
        query += f"&q={search}"
    articles = get_everything()

    if not category or not country:
        # category = 'business,entertainment,general,health,science,sports,technology'
        # /v2/everything
        if search:
            articles = newsapi.get_everything(q=search,
                                                language='en',
                                                sort_by='relevancy')
        else:
            articles = newsapi.get_everything(language='en',
                                                sort_by='relevancy')
    else:
        # /v2/top-headlines
        if search:
            articles = newsapi.get_top_headlines(q=search,
                                                    category=category,
                                                    language='en',
                                                    country=country)
        else:
            articles = newsapi.get_top_headlines(category=category,
                                                    language='en',
                                                    country=country)

    return articles

if __name__ == "__main__":
    print(get_latest_news('business', 'bitcoin', 'au'))
