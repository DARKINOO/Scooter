import React, { useRef, useState } from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import MapComponent from '../components/MapComponent'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
 
  const [panelOpen, setPanelOpen] = useState(false)
  const vehiclePanelRef = useRef(null)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
  const [ vehicleFound, setVehicleFound ] = useState(false)
  const [ waitingForDriver, setWaitingForDriver ] = useState(false)

  const submitHandler = (e)=>{
     e.preventDefault()
  }
  
  useGSAP(function(){
    if(panelOpen){
      gsap.to('.find-trip-container', {
        translateY: '15%',
        duration: 0.5
      })
    gsap.to(panelRef.current,{
      height:'70%',
      padding: 24,
      opacity:1,
      zIndex: 20
    })
    gsap.to(panelCloseRef.current,{
      opacity:1
    })
    gsap.to('.map-container', {
      scale: 0.95,
      opacity: 0.8,
      zIndex: 0
    })
   }else{
    gsap.to('.find-trip-container', {
      translateY: '0%',
      duration: 0.5
    })
    gsap.to(panelRef.current,{
      height:'0%',
      padding:0,
      opacity:0
    })
    gsap.to(panelCloseRef.current,{
      opacity:0
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
}, [ vehiclePanel ])

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
}, [ confirmRidePanel ])

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
}, [ vehicleFound ])
  
useGSAP(function () {
  if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(0)'
      })
  } else {
      gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(100%)'
      })
  }
}, [ waitingForDriver ])


  return (
    <div className='h-screen relative overflow-hidden'>
      <h1 className='w-14 absolute mb-8 m-4 ml-40 z-20 text-3xl font-bold text-black'>Goसफ़र</h1>
      <div className='h-[70%] z-10 relative map-container transition-all duration-300'>
       <MapComponent/>
      </div>
      <div className='flex flex-col justify-end h-screen
       absolute top-0 w-full find-trip-container transition-all duration-300'>
        <div className='h-[30%] bg-white p-6 pt-4 relative'>
          <h5 ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false)
          }} className='absolute opacity-0 right-6 top-6 text-2xl'>
          <i className="ri-arrow-down-wide-line"></i>
          </h5>
        <h4 className='text-2xl font-semibold'>Find a Trip</h4>
        <form onSubmit={(e)=>{
          submitHandler(e)
        }}>
          <div className="line absolute h-16 w-1 top-[37%] left-10 bg-yellow-500 rounded-full"></div>
          <input
          onClick={()=>{
            setPanelOpen(true)
          }}
          value={pickup} 
          onChange={(e)=>{
            setPickup(e.target.value)
          }}
          className='bg-[#eee] mb-4 px-12 py-2 mt-3 text-lg rounded-lg w-full' type="text"
          placeholder='Add pickup location ' />

          <input
           onClick={()=>{
            setPanelOpen(true)
          }}
           value={destination}
           onChange={(e)=>{
            setDestination(e.target.value)
          }}
           className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full' type="text" placeholder='Enter your destination' />
        </form>
       </div>
       <div ref={panelRef} className='bg-white h-0'>
            <LocationSearchPanel  setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} />
       </div>
      </div>
      <div ref={vehiclePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-slate-100">
        <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>
      <div ref={confirmRidePanelRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
      <ConfirmRide
       setConfirmRidePanel={setConfirmRidePanel} 
       setVehicleFound={setVehicleFound}  />
      </div>
      <div ref={vehicleFoundRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
        <LookingForDriver  setVehicleFound={setVehicleFound}/>
      </div>
      <div ref={waitingForDriverRef} className="fixed w-full z-20 bottom-0 translate-y-full px-3 py-10 pt-14 bg-white">
        <WaitingForDriver waitingForDriver={waitingForDriver} />
      </div>
    </div>
  )
}

export default Home