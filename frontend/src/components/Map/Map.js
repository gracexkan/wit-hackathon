import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import google from "@googlemaps/react-wrapper";
import Places from "./Places";
import { styled } from "@mui/system";
import redPin from "../../assets/red_pin.png";
import bluePin from "../../assets/blue_pin.png";
import silverBluePin from "../../assets/silver_blue_pin.png";
import { Button, Modal, Card } from 'antd';

import "./map.css";

const Container = styled("div")`
  width: 100%;
  display: flex;
  gap: 15px;
  text-align: center;
  padding: 25px;
`;

const StyledCard = styled(Card)`
  width: 180px;
  marginLeft: 20px;
  marginTop: ${({ props }) => (props.currSelected === "Currently Selected" ? "30px" : "0px")};
`;

const MapBox = styled("div")`
  width: 100%;
  height: 92.5%;
`;

const allDams = [
  {
    name: "Blowering Dam",
    lat: -35.62,
    lng: 148.30,
    type: "regional",
  },
  {
    name: "Brogo Dam",
    lat: -36.49,
    lng: 149.74,
    type: "regional",
  },
  {
    name: "Burrendong Dam",
    lat: -32.67,
    lng: 149.11,
    type: "regional",
  },
  {
    name: "Burrinjuck Dam",
    lat: -35.00,
    lng: 148.58,
    type: "regional",
  },
  {
    name: "Carcoar Dam",
    lat: -33.62,
    lng: 149.18,
    type: "regional",
  },
  {
    name: "Chaffey Dam",
    lat: -31.35,
    lng: 151.12,
    type: "regional",
  },
  {
    name: "Copeton Dam",
    lat: -29.90,
    lng: 150.92,
    type: "regional",
  },
  {
    name: "Glenbawn Dam",
    lat: -32.09,
    lng: 150.99,
    type: "regional",
  },
  {
    name: "Glennies Creek Dam",
    lat: -32.36,
    lng: 151.25,
    type: "regional",
  },
  {
    name: "Hume Dam",
    lat: -36.11,
    lng: 147.03,
    type: "regional",
  },
  {
    name: "Keepit Dam",
    lat: -30.87,
    lng: 150.50,
    type: "regional",
  },
  {
    name: "Lake Wyangala",
    lat: -33.98,
    lng: 148.95,
    type: "regional",
  },
  {
    name: "Lostock Dam",
    lat: -32.33,
    lng: 151.45,
    type: "regional",
  },
  {
    name: "Menindee Lakes",
    lat: -32.30,
    lng: 142.20,
    type: "regional",
  },
  {
    name: "Pindari Dam",
    lat: -29.40,
    lng: 151.26,
    type: "regional",
  },
  {
    name: "Split Rock Dam",
    lat: -30.55,
    lng: 150.69,
    type: "regional",
  },
  {
    name: "Toonumbar Dam",
    lat: -28.62,
    lng: 152.80,
    type: "regional",
  },
  {
    name: "Windamere Dam",
    lat: -32.73,
    lng: 149.77,
    type: "regional",
  },
  {
    name: "Warragamba Dam",
    lat: -33.88,
    lng: 150.60,
    type: "sydney",
  },
  {
    name: "Woronora Dam",
    lat: -34.11,
    lng: 150.94,
    type: "sydney",
  },
  {
    name: "Avon Dam",
    lat: -34.35,
    lng: 150.63,
    type: "sydney",
  },
  {
    name: "Cataract Dam",
    lat: -34.27,
    lng: 150.80,
    type: "sydney",
  },
  {
    name: "Cordeaux Dam",
    lat: -34.34,
    lng: 150.75,
    type: "sydney",
  },
  {
    name: "Nepean Dam",
    lat: -34.33,
    lng: 150.61,
    type: "sydney",
  },
  {
    name: "Prospect Dam",
    lat: -33.82,
    lng: 150.89,
    type: "sydney",
  },
  {
    name: "Wingecarribee Reservoir",
    lat: -34.56,
    lng: 150.50,
    type: "sydney",
  },
  {
    name: "Fitzroy Falls Reservoir",
    lat: -34.64,
    lng: 150.50,
    type: "sydney",
  },
  {
    name: "Tallowa Dam",
    lat: -34.77,
    lng: 150.31,
    type: "sydney",
  },
  {
    name: "Blue Mountains Dams",
    lat: -33.70,
    lng: 150.30,
    type: "sydney",
  }
];

export default function Map({ darkMode }) {
  
  // Latitude and Longitude
  const [office, setOffice] = useState();
  const [directions, setDirections] = useState();
  const [currSelected, setCurrSelected] = useState('Currently Selected');
  const [information, setInformation] = useState({});
  const [finishedLoading, setFinishedLoading] = useState(false);
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: -33.0, lng: 147.0 }), []);
  const options = useMemo(
    () => ({
      // get mapId manually via the Google Maps Platform
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const dams = useMemo(() => allDams, [center]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // whenever the center changes, generate houses again

  const fetchDirections = (dam) => {
    // no office, just return
    if (!office) return;

    // calculate directions from position to office
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: dam,
        destination: office,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          console.log(result)
          console.log(google)
        }
      }
    );
  };

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "http://localhost:5000");
    myHeaders.append("Access-Control-Allow-Methods", "POST");
    myHeaders.append("Content-Type", "Authorization");

    let raw = JSON.stringify({
      "business_type": "regional",
      "lat": -33.98,
      "lng": 148.95
    });
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:5000/optimaldam", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }, [currSelected]);

  return (
    <MapBox>
      <Places setOffice={(position) => {
        // pan to your selected office
        setOffice(position);
        mapRef.current?.panTo(position);
      }} />
      <GoogleMap
        zoom={6}
        center={center}
        mapContainerClassName="map-container"
        options={options}
        onLoad={onLoad}
      >
        <>
          {currSelected !== "Currently Selected" && <Button type="primary" style={{ marginTop: "5px" }} onClick={showModal}>
            View Selected Details
          </Button>}
          <Modal title={currSelected + " Water Source Details"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {console.log(information)}
            <p>{information.surface}</p>
            <p>{information.lat}</p>
            <p>{information.lng}</p>
            <p>{information.dam_current_level}</p>
            <p>{information.dam_storage_cap}</p>
            <p>{information.data_recorded}</p>
            <p>{information.cost_incurred}</p>
          </Modal>
          <StyledCard theme={{ currSelected: currSelected }} title="Legend" size="small">
            <div style={{ display: "flex", flexDirection: "row", gap: "5px", justifyText: "left"}}>
              <img src={redPin} style={{width: "20px", height: "20px"}} />
              <p style={{ fontSize: "11px" }}>Currently Selected Office</p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px", justifyText: "left" }}>
              <img src={bluePin} style={{width: "20px", height: "20px"}} />
              <p style={{ fontSize: "11px" }}>Greater Sydney Water Source</p>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px", justifyText: "left" }}>
              <img src={silverBluePin} style={{width: "20px", height: "20px"}} />
              <p style={{ fontSize: "11px" }}>Regional Water Source</p>
            </div>
          </StyledCard>
        </>
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "#1976D2",
                strokeWeight: 5,
              },
            }}
          />
        )}

        {office && (
          <>
            <Marker
              position={office}
            icon={redPin}
            title={"Your Selected Office"}
          />
            <MarkerClusterer>
              {(clusterer) =>
                dams.map((dam) => (
                  <Marker
                    key={dam.lat + dam.lng}
                    position={{ lat: dam.lat, lng: dam.lng }}
                    title={dam.name}
                    icon={dam.type !== "regional" ? bluePin : silverBluePin}
                    clusterer={clusterer}
                    onClick={() => {
                      setCurrSelected(dam.name)
                      fetchDirections({lat: dam.lat, lng: dam.lng});
                    }}
                  />
                ))
              }
            </MarkerClusterer>

            <Circle center={office} radius={15000} options={closeOptions} />
            <Circle center={office} radius={30000} options={middleOptions} />
            <Circle center={office} radius={45000} options={farOptions} />
          </>
        )}
      </GoogleMap>
    </MapBox>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
