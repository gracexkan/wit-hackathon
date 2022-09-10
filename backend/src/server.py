# source env/bin/activate
# python3 server.py
# pip3 install flask
from flask import Flask, request
from flask_cors import CORS
import json
from controllers import scrape_greater_syd_dams_data, status_check, scrape_regional_dams_data, get_regional_dams_obj, get_greater_syd_dam_obj, evaporation_rate


app = Flask(__name__)
CORS(app)
data_store = []

@app.route("/hc", methods=['GET'])
def health_check():
    return evaporation_rate(7, 21)

@app.route("/scrape/regional", methods=['GET'])
def get_regional_dams_data():
    return scrape_regional_dams_data()

@app.route("/scrape/greatersyd", methods=['GET'])
def get_greater_syd_dams_data():
    return scrape_greater_syd_dams_data()

def db_clear():
    global data_store
    data_store.clear()



@app.route("/dams", methods=['GET'])
def list_names():
    return json.dumps(get_greater_syd_dam_obj() + get_regional_dams_obj())


@app.route("/rdams", methods=['GET'])
def list_rg_names():
    return json.dumps(get_regional_dams_obj())

@app.route("/gsdams", methods=['GET'])
def list_gs_names():
    return json.dumps(get_greater_syd_dam_obj())

@app.route("/client", methods=['DELETE'])
def clear_from_db():
    request_data = request.get_json()
    client_name = request_data['client']
    return json.dumps({})

# @app.route("/user", methods=['UPDATE'])
# def add_user_to_service:
#     pass
#     # return json.dumps({})




if __name__ == "__main__":
    app.run(port=5000)
    print("App is running!")
    # Do not change the port address!