import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import axios from 'axios'
import MapComponent from '../components/MapComponent'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash/debounce'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [ fare, setFare ] = useState({})
  const vehiclePanelRef = useRef(null)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [distanceTime, setDistanceTime] = useState(null)
  const [pickupCoords, setPickupCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)

  const navigate = useNavigate()

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id })
  }, [user])

  socket.on('ride-confirmed', ride => {
    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
  })

  socket.on('ride-started', ride => {
    console.log("ride")
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
  })

  const fetchPickupSuggestions = async (input) => {
    if (input.length < 3) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setPickupSuggestions(response.data)
    } catch (error) {
      console.error('Error fetching pickup suggestions:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('Request data:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
    }
  }

  const fetchDestinationSuggestions = async (input) => {
    if (input.length < 3) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationSuggestions(response.data)
    } catch (error) {
      console.error('Error fetching destination suggestions:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('Request data:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
    }
  }

  const debouncedFetchPickupSuggestions = debounce(fetchPickupSuggestions, 1000)
  const debouncedFetchDestinationSuggestions = debounce(fetchDestinationSuggestions, 1000)

  const handlePickupChange = (e) => {
    setPickup(e.target.value)
    debouncedFetchPickupSuggestions(e.target.value)
  }

  const handleDestinationChange = (e) => {
    setDestination(e.target.value)
    debouncedFetchDestinationSuggestions(e.target.value)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    await findTrip()
  }

  useGSAP(function () {
    if (panelOpen) {
      gsap.to('.find-trip-container', {
        translateY: '15%',
        duration: 0.5
      })
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24,
        opacity: 1,
        zIndex: 20
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1
      })
      gsap.to('.map-container', {
        scale: 0.95,
        opacity: 0.8,
        zIndex: 0
      })
    } else {
      gsap.to('.find-trip-container', {
        translateY: '0%',
        duration: 0.5
      })
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0,
        opacity: 0
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0
      })
      gsap.to('.map-container', {
        scale: 1,
        opacity: 1,
        zIndex: 10
      })
    }
  }, [panelOpen])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [vehicleFound])

  useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0%)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [waitingForDriver])

  async function findTrip() {
    setVehiclePanel(true)
    setPanelOpen(false)
    // setVehicleFound(false)

    try {
      const fareResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      //setFareDetails(fareResponse.data)
      setFare(fareResponse.data)

      const distanceTimeResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
        params: { origin: pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDistanceTime(distanceTimeResponse.data)

      const pickupCoordsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address: pickup },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setPickupCoords(pickupCoordsResponse.data)

      const destinationCoordsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address: destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDestinationCoords(destinationCoordsResponse.data)

      const routeResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
        params: { origin: pickup, destination },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setRouteCoordinates(routeResponse.data.coordinates)
    } catch (error) {
      console.error('Error fetching trip details:', error)
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('Request data:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
    }
  }

async function createRide() {
  try {
      // Validate pickup and destination coordinates before creating ride
      const pickupRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: pickup },
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      
      const destinationRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
          params: { address: destination },
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      const coordinates = {
          pickup: {
              type: "Point",
              coordinates: [pickupRes.data.lng, pickupRes.data.ltd]
          },
          destination: {
              type: "Point",
              coordinates: [destinationRes.data.lng, destinationRes.data.ltd]
          }
      };

      const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/create`,
          {
              pickup,
              destination,
              vehicleType,
              coordinates // Include coordinates in the request
          },
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error('Create ride error:', error);
      throw error;
  }
}

  return (
    <div className='h-screen relative overflow-hidden'>
      <h1 className='w-14 absolute mb-8 m-4 ml-40 z-20 text-3xl font-bold text-black'>Goसफ़र</h1>
      <div className='h-[70%] z-10 relative map-container transition-all duration-300'>
        <MapComponent 
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          routeCoordinates={routeCoordinates}
        />
      </div>
      <div className='flex flex-col justify-end h-screen absolute top-0 w-full find-trip-container transition-all duration-300'>
        <div className='h-[30%] bg-white p-6 pt-4 relative'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl font-semibold'>Find a Trip</h4>

          <form onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[37%] left-10 bg-yellow-500 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] mb-4 px-12 py-2 mt-3 text-lg rounded-lg w-full' type="text"
              placeholder='Add pickup location ' />

            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={handleDestinationChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full' type="text" placeholder='Enter your destination' />
            <button
              type="submit"
              className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
              Find Trip
            </button>
          </form>
        </div>
        <div ref={panelRef} className='bg-white h-0'>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div ref={vehiclePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-slate-100">
        <VehiclePanel
          selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
          fare={fare}
          distanceTime={distanceTime}
        />
      </div>
      <div ref={confirmRidePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
        <ConfirmRide
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          vehicleType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare}
        />
      </div>
      <div ref={vehicleFoundRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
        <LookingForDriver
          vehicleType={vehicleType}
          createRide={createRide}
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare}
        />
      </div>
      <div ref={waitingForDriverRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
        <WaitingForDriver
        ride={ride} 
        fare={fare}
        setVehicleFound={setVehicleFound}
         waitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}

export default Home