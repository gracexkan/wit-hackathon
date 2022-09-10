# source env/bin/activate
# python3 server.py
# pip3 install flask
from flask import Flask, request
from flask_cors import CORS
import json
from controllers import scrape_greater_syd_dams_data, status_check, scrape_regional_dams_data


app = Flask(__name__)
CORS(app)
data_store = []

@app.route("/hc", methods=['GET'])
def health_check():
    return status_check()



@app.route("/scrape/regional", methods=['GET'])
def get_regional_dams_data():
    return scrape_regional_dams_data()

@app.route("/scrape/greatersyd", methods=['GET'])
def get_greater_syd_dams_data():
    return scrape_greater_syd_dams_data()

def db_clear():
    global data_store
    data_store.clear()



@app.route("/names", methods=['GET'])
def list_names():
    global data_store
    list_names = {
        'names': data_store
    }
    return json.dumps(list_names)


@app.route("/names/clear", methods=['DELETE'])
def clear_db():
    db_clear()
    return json.dumps({})


@app.route("/names/remove", methods=['DELETE'])
def remove_name():
    global data_store
    print(data_store)
    data_store = list(filter(lambda x: x not in request.get_json()[
        'name'], data_store))
    print(data_store)
    return json.dumps({})


if __name__ == "__main__":
    app.run(port=5000)
    print("App is running!")
    # Do not change the port address!