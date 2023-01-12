import { Input, SkeletonText } from "@chakra-ui/react";
import logo from "./logo.png";
import "./App.css";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { MdControlPoint } from "react-icons/md";
import { useRef, useState, useEffect } from "react";

import Map from "./map";

const REACT_APP_GOOGLE_MAPS_API_KEY = "AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ";
const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [orgine, setOrgine] = useState("");
  const [end, setEnd] = useState("");
  const [istrue, setTrue] = useState(false);
  const [Allitem, setAllItem] = useState([]);
  const [item, setItem] = useState({ value: "" });

  const [Latlag, setLatlag] = useState([]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  const CalculateLatLag = async () => {
    let arr = [];
    let demoarry = [];
    for (let i = 0; i < Allitem.length; i++) {
      demoarry.push(Allitem[i]);
    }

    demoarry.push({ value: destiantionRef.current.value });
    setOrgine(originRef.current.value);
    setEnd(destiantionRef.current.value);
    demoarry.unshift({ value: originRef.current.value });
    console.log(demoarry, "hi");

    for (let i = 0; i < demoarry.length; i++) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${demoarry[i].value}&key=AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ`
      );
      const data = await response.json();
      let lat = data.results[0].geometry.location.lat;
      let lag = data.results[0].geometry.location.lng;
      arr.push({ lat: lat, lag: lag });
    }
    setLatlag(arr);
    console.log({ Latlag });
  };

  async function calculateRoute() {
    CalculateLatLag();
    setTrue(true);
  }
  function AddStop() {
    setAllItem([...Allitem, item]);
  }

  const handleInput = (e, index) => {
    let _allItem = [...Allitem];
    _allItem[index] = { value: e.target.value };
    setAllItem(_allItem);
  };
  console.log({ Allitem });

  return (
    <div className="App">
      <div className="Nav">
        <img src={logo} alt="logo" className="logoStyle" />
      </div>
      <div className="Container">
        <div className="caltext">
          {" "}
          lets calculate distances from google map{" "}
        </div>

        <div className="split-part">
          <div className="left-part">
            <div className="left">
              Origin
              <Input
                type="text"
                className="InputStyle"
                placeholder="Origin"
                ref={originRef}
                style={{ backgroundColor: "white" }}
              />
              <div> Stop</div>
              <div className="group">
                {Allitem.map((item, index) => {
                  return (
                    <Input
                      type="text"
                      className="InputStyle"
                      placeholder="Stop"
                      style={{ backgroundColor: "white" }}
                      value={item.value}
                      id="autocomplete"
                      onChange={(e) => handleInput(e, index)}
                    />
                  );
                })}
              </div>
              <button className="btn-style" onClick={AddStop}>
                {" "}
                <MdControlPoint className="addItem" />{" "}
                <span>Add another stop </span>
              </button>
              Destination
              <Input
                type="text"
                className="InputStyle"
                placeholder="Destination"
                style={{ backgroundColor: "white" }}
                ref={destiantionRef}
              />
              <div className="Distance-duration">
                <div className="Item-style">
                  <span>Distance</span>
                  <span className="Item">
                    {distance ? <> {distance} Km</> : ""}{" "}
                  </span>
                </div>
                <div className="Item-style">
                  <span>Duration</span>
                  <span className="Item">{duration}</span>
                </div>
              </div>
              {istrue && (
                <div className="text-Item">
                  The distance between{" "}
                  <span className="highlight"> {orgine} </span> to
                  <span className="highlight">{end}</span> the selected route is{" "}
                  <span className="highlight"> {distance} km </span> and
                  duration is <span className="highlight"> {duration} </span>.
                </div>
              )}
            </div>
            <div className="right">
              <button
                type="submit"
                className="button-style"
                onClick={calculateRoute}
              >
                Calculate
              </button>
            </div>
          </div>
          <div className="right-part">
            {Latlag.length > 0 && istrue ? (
              <Map
                setDistance={setDistance}
                setDuration={setDuration}
                routes={Latlag}
              />
            ) : (
              <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={(map) => setMap(map)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
