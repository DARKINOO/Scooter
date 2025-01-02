import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const CaptainHome = () => {

  const [ ridePopupPanel, setRidePopupPanel ] = useState(true)
  const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)


  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)

  useGSAP(function () {
    if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
            transform: 'translateY(0)'
        })
    } else {
        gsap.to(ridePopupPanelRef.current, {
            transform: 'translateY(100%)'
        })
    }
}, [ ridePopupPanel ])

useGSAP(function () {
  if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(0)'
      })
  } else {
      gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(100%)'
      })
  }
}, [ confirmRidePopupPanel ])
  
  return (
    <div className='h-screen'>
      <div className='fixed p-3 top-0 flex items-center justify-between w-full'>
      <h1 className='w-10 mb-8 text-3xl font-bold text-black'>Goसफ़र</h1>
            <Link to='/home' className=' h-10 w-10 bg-black text-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-bold ri-logout-box-r-line"></i>
            </Link>
            </div>
            <div className='h-1/2'>
                 <img className='h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" />

            </div>
            <div className='h-2/5 p-6'>
              <CaptainDetails/>
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed h-[100%] w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
  )
}

export default CaptainHome