import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../context/SocketContext';
import LiveTrackingComponent from '../components/LiveTrackingComponent'


const CaptainRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        if (ride?.status === 'accepted') {
          // Set up continuous location tracking
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              // Emit location update through socket
              socket.emit('update-captain-location', {
                rideId: ride._id,
                location: location
              });
            },
            (error) => console.error('Geolocation error:', error),
            { 
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
      
          return () => navigator.geolocation.clearWatch(watchId);
        }
      }, [ride?.status, socket]);


    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])


    return (
        <div className='h-screen relative flex flex-col'>

            <div className='fixed p-6 top-0 flex items-center z-10 justify-between w-screen'>
            <h1 className='w-10 mb-8 ml-12 text-3xl font-bold text-black'>Goसफ़र</h1>
                <Link to='/captain-home' className='  h-10 w-10 bg-black text-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-bold ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-[75%] relative'>
            <LiveTrackingComponent
           pickupCoords={ride ? [ride?.pickupLocation?.coordinates[1], ride?.pickupLocation?.coordinates[0]] : null}
          destinationCoords={ride ? [ride?.destinationLocation?.coordinates[1], ride?.destinationLocation?.coordinates[0]] : null}
        socket={socket}
          rideId={ride?._id}
            />
                 {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" /> */}

            </div>

            <div className='h-[25%] p-6  flex items-center justify-between relative bg-yellow-400 pt-0'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{'4 Km away'}</h4>
                <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef}  className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                {/* <LiveTracking /> */}
            </div>

        </div>
    )
}

export default CaptainRiding