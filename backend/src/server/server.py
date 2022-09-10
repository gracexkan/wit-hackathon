from flask import Flask, request
from flask_cors import CORS
from history import History
from datetime import datetime
from sentiment import content_score
from statistics import avg_score, most_common_author, most_common_source, read_bias_ratio
import json
import requests
import os

APP = Flask(__name__)
CORS(APP)

with open("news.json") as f:
    news = json.load(f)

@APP.route("/", methods=["GET"])
def root():
    """ default route """

    return "<h1 style='font-family: Arial'; font-size: 60px;'>Welcome to Uplift's backend API!</h1>"

@APP.route('/news', methods=["GET"])
def get_news():
    """ Get general news for a particular topic """

    search = request.args.get("search")
    response = requests.get(f"{news['base_url']}/v2/everything?apiKey={news['api_key']}&q={search}").json()
    article_list = response['articles'][:15]
    for item in article_list:
        item['score'] = content_score(item['title'], item['description'], item['content'])
    
    return {'articles': article_list}

@APP.route('/news/headlines', methods=["GET"])
def get_news_headlines():
    """ Get the top headlines for a particular topic, category and/or country """

    search = request.args.get("search")
    category = request.args.get("category")
    country = request.args.get("country")
    query_string = ""
    
    if search:
        query_string += f"&q={search}"
    if category:
        query_string += f"&category={category}"
    if country:
        query_string += f"&country={country}"
    # print(f"{query_string=}")
    response = requests.get(f"{news['base_url']}/v2/top-headlines?apiKey={news['api_key']}{query_string}").json()
    article_list = response['articles'][:15]
    for item in article_list:
        item['score'] = content_score(item['title'], item['description'], item['content'])
    
    return {'articles': article_list}

@APP.route('/history/add', methods=["POST"])
def history_add():
    """ 
        Add details for an article read by the user with uuid 
        
        Parameters:
            - uuid
            - title
            - author
            - description
            - content
            - source
    """

    history = History("database.json")
    body = request.json
    score = content_score(body['title'], body['description'], body['content'])

    now = datetime.now()
    time_added = now.strftime("%H:%M:%S")

    return history.add(body["uuid"], body["title"], body["source"], score, body["author"], time_added)

@APP.route('/history', methods=["GET"])
def history():
    """ get a list of articles for all articles already read by the user with uuid  """

    uuid = request.args.get("uuid")
    history = History("database.json")
    return {
        "history": history.visited(uuid)
    }

@APP.route('/stats', methods=["GET"])
def stats():
    """ give statistics based on user history """
    uuid = request.args.get("uuid")

    return {
        "avg_score": avg_score(uuid),
        "most_common_author": most_common_author(uuid),
        "most_common_source": most_common_source(uuid),
        "bias_ratio": read_bias_ratio(uuid)
    }


if __name__ == "__main__":
    APP.run(host="0.0.0.0", debug=True, port=8080)
