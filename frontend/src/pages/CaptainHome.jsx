import React, { useRef, useState } from 'react'
import { data, Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import MapComponent from '../components/MapComponent'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainHome = () => {

  const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
  const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)


  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ ride, setRide ] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)



  useEffect(() => {
    // Verify captain authentication on component mount
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/captain-login');
          return;
        }
  
        // Try to get captain profile to verify token
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.data.captain) {
          localStorage.removeItem('token');
          navigate('/captain-login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/captain-login');
      }
    };
  
    verifyAuth();
  }, []);  

useEffect(() => {
    if (!socket || !captain?._id) return;

    // Join socket room
    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    });

    // Debug logging
    console.log('Captain socket setup:', {
      captainId: captain._id,
      socketId: socket.id,
      socketConnected: socket.connected
    });

    // Handle new ride events
    const handleNewRide = (data) => {
      console.log('New ride received:', data);
      console.log('Pickup coordinates:', data.pickupLocation?.coordinates);
      console.log('Destination coordinates:', data.destinationLocation?.coordinates);
      if (data) {
        setRide(data);
        setRidePopupPanel(true);
        console.log('Setting ride popup panel to true');
      }
    };

    // Register event listener
    socket.on('new-ride', handleNewRide);

    //Uncaught Error: Invalid LatLng object: (undefined, undefined)
    // Location update logic
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            console.log('Updating captain location:', newLocation);
            
            socket.emit('update-location-captain', {
              userId: captain._id,
              location: newLocation
            });
          },
          error => console.error('Geolocation error:', error)
        );
      }
    };

    // Set up location updates
    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation(); // Initial update

    // Cleanup function
    return () => {
      socket.off('new-ride', handleNewRide);
      clearInterval(locationInterval);
    };
  }, [socket, captain]);

  async function confirmRide() {
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to confirm ride with stored token');
      
      if (!token) {
        console.error('No token found - redirecting to login');
        navigate('/captain-login');
        // Redirect to login or show error
        return;
      }
  
      if (!captain || !captain._id) {
        console.error('No captain data found');
        // Redirect to login or show error
        return;
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Ride confirmation successful:', response.data);
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error('Error confirming ride:', error.response?.data);
      if (error.response?.data?.message === 'Invalid account type. Please login as a captain.') {
        // Handle case where user is logged in with wrong account type
        alert('Please login with your captain account');
        localStorage.removeItem('token');
        navigate('/captain-login');
        // Redirect to captain login
      } else {
        alert(error.response?.data?.message || 'Failed to confirm ride');
      }
    }
  }

 
  useGSAP(() => {
    if (ridePopupPanel) {
      console.log('Animating ride popup panel to show');
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(0)',
        duration: 0.5
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(100%)',
        duration: 0.5
      });
    }
  }, [ridePopupPanel]);

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
    <div className='h-screen relative flex flex-col'>
      <div className='fixed p-3 top-0 flex items-center z-10 justify-between w-full'>
      <h1 className='w-10 mb-8 ml-12 text-3xl font-extrabold text-black'>Goसफ़र</h1>
            <Link to='/home' className=' h-10 w-10 bg-black text-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-bold ri-logout-box-r-line"></i>
            </Link>
            </div>
            <div className='h-[60%] relative'>
              <MapComponent
                   pickupCoords={ride ? [ride?.pickupLocation?.coordinates[1], ride?.pickupLocation?.coordinates[0]] : null}
                   destinationCoords={ride ? [ride?.destinationLocation?.coordinates[1], ride?.destinationLocation?.coordinates[0]] : null}
                   ride={ride}
                   showRoute={confirmRidePopupPanel}
              />
                 {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" /> */}

            </div>
            <div className='h-2/5 p-6 bg-white relative z-1'>
              <CaptainDetails/>
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
            {ride && <RidePopUp
          ride={ride}
          setRide={setRide}
          confirmRide={confirmRide}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />}
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed h-[100%] w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                 ride={ride} 
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
  )
}

export default CaptainHome