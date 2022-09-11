# source env/bin/activate
# python3 server.py
# pip3 install flask
from http import client
from flask import Flask, request
from flask_cors import CORS
import json
from controllers import get_most_effective_alloc, get_dam_information, get_dam_obj, edit_user_preference,\
                         remove_user, scrape_greater_syd_dams_data, status_check,\
                             scrape_regional_dams_data, get_regional_dams_obj,\
                                 get_greater_syd_dam_obj


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


@app.route("/damsdb", methods=['GET'])
def list_names():
    return json.dumps(get_dam_obj())


@app.route("/rdamsdb", methods=['GET'])
def list_rg_names():
    return json.dumps(get_regional_dams_obj())

@app.route("/gsdamsdb", methods=['GET'])
def list_gs_names():
    return json.dumps(get_greater_syd_dam_obj())


# Important for frontend

@app.route("/client", methods=['DELETE'])
def clear_from_db():
    request_data = request.get_json()
    client_name = request_data['client']
    remove_user(client_name)
    return json.dumps({})

@app.route("/client", methods=['POST'])
def add_user_to_service():
    request_data = request.get_json()
    client_name = request_data['client']
    dam_name = request_data['dam_name']
    edit_user_preference(client_name, dam_name)
    return json.dumps({})


@app.route("/dam", methods=['GET'])
def get_data_for_dam():
    request_data = request.args.get("name")
    return json.dumps(get_dam_information(request_data.strip("%20")))

@app.route("/optimaldam", methods=['POST'])
def optimal_assignment():
    request_data = request.get_json()
    return json.dumps(get_most_effective_alloc(request_data['business_type'], request_data['lat'], request_data['lng']))


if __name__ == "__main__":
    app.run(port=5000)
    print("App is running!")
    # Do not change the port address!