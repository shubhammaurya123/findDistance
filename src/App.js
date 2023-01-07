import {
  Input,
  SkeletonText,
} from '@chakra-ui/react'
import logo from './logo.png'
import './App.css'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'

import { MdControlPoint } from "react-icons/md";
import { useRef, useState } from 'react'



const REACT_APP_GOOGLE_MAPS_API_KEY = "AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ"
const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [orgine, setOrgine] = useState('')
  const [end, setEnd] = useState('')
  const [istrue, setTrue] = useState(false)
  const [Allitem, setAllItem] = useState([])
  const [item, setItem] = useState(<Autocomplete className="InputStyle">
    <Input type='text' placeholder='Stop' style={{ backgroundColor: "white" }} />
  </Autocomplete>);



  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    setEnd(destiantionRef.current.value)
    setOrgine(originRef.current.value)
    setTrue(true);
  }
  function AddStop() {
    console.log("hi addStope")

    setAllItem(...Allitem, item);

  }

  return (

    <div className="App">
      <div className='Nav'>
        <img src={logo} alt='logo' className='logoStyle' />
      </div>

      <div className='Container'>
        <div className='caltext'> lets calculate distances from google map </div>

        <div className='split-part'>

          <div className='left-part'>
            Origin


            <Autocomplete className="InputStyle">
              <Input type='text' placeholder='Origin' ref={originRef} style={{ backgroundColor: "white" }} />
            </Autocomplete>

            <div> Stop</div>

            {
              Allitem
            }

            <button className='btn-style' onClick={AddStop}> <MdControlPoint className='addItem' /> <span>Add another stop </span></button>
            <div className='container-item'>
              Destination
              <div className='buttondis'>
                <Autocomplete className="InputStyle">
                  <Input
                    type='text'
                    placeholder='Destination'
                    ref={destiantionRef}
                    style={{ backgroundColor: "white" }}
                  />
                </Autocomplete>

                <button type='submit' className='button-style' onClick={calculateRoute}>
                  Calculate
                </button>
              </div>
            </div>

            <div className='Distance-duration'>
              <div className='Item-style' >
                <span>Distance</span>
                <span className='Item'>{distance}</span>
              </div>
              <div className='Item-style' >
                <span>Duration</span>
                <span className='Item'>{duration}</span>
              </div>

            </div>
            {
              istrue &&
              <div className='text-Item' >
                The distance between  <span className='highlight'> {orgine} </span>  and<span className='highlight'>{end}</span>  the selected route is <span className='highlight'> {distance} </span> and duration is  <span className='highlight'> {duration} </span>.
              </div>
            }

          </div>
          <div className='right-part'>

            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: '80%', height: '60%' }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={map => setMap(map)}
            >
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>

          </div>
        </div>
      </div>
    </div>
  )
}

export default App
