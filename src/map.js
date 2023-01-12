import {
  SkeletonText,
} from '@chakra-ui/react'

import { DirectionsRenderer, useJsApiLoader, GoogleMap } from '@react-google-maps/api';

import React from 'react'

import { useState, useEffect } from 'react'


const defaultLocation = { lat: 40.756795, lng: -74.954298 };
const REACT_APP_GOOGLE_MAPS_API_KEY = "AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ"
const Map = (props) => {
  const [directions, setDirections] = useState(null);

  const {setDistance , setDuration , routes} = props;

  console.log(routes);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  // eslint-disable-next-line no-undef
  const travelMode = google.maps.TravelMode.DRIVING;

  useEffect(() => {

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const routesCopy = routes.map((route) => {
      return {
        location: { lat: route.lat, lng: route.lag },
        stopover: true
      }
    })
    // eslint-disable-next-line no-undef
    const origin = routesCopy.length === 1 ? new google.maps.LatLng(routesCopy[0].location.lat, routesCopy[0].location.lng) : routesCopy.shift().location
    // eslint-disable-next-line no-undef
    const destination = routesCopy.length === 1 ? new google.maps.LatLng(routesCopy[0].location.lat, routesCopy[0].location.lng) : routesCopy.pop().location
    const waypoints = routesCopy


    // here is the function for multiple routes:
    directionsService.route(
      {
        origin,
        destination,
        travelMode,
        waypoints
      },
      (result, status) => {
        // eslint-disable-next-line no-undef
        if (status === google.maps.DirectionsStatus.OK) {
          
          setDirections(result);
          console.log(result.routes);
          let sum = 0;
          let time = 0;
          for(let i  = 0; i < result.routes[0].legs.length; i++ ) {
             sum += result.routes[0].legs[i].distance.value;
            
          }

          setDistance(sum/1000)
         
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  });

  if (!isLoaded) {
    return <SkeletonText />
  }
  return (
    <div>
      <GoogleMap
        center={defaultLocation}
        zoom={15}
        mapContainerStyle={{ height: "55vh", width: "100%" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directions !== null && (
          <DirectionsRenderer directions={directions} />
        )}
      </GoogleMap>
    </div>
  );

}

export default Map
