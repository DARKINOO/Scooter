// MapComponent.jsx
import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { SocketContext } from '../context/SocketContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Custom marker for captain
const captainIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function MapUpdater({ pickupCoords, destinationCoords, captainLocation }) {
    const map = useMap();

    useEffect(() => {
        try {
            const points = [
                pickupCoords,
                destinationCoords,
                captainLocation && [captainLocation.lat, captainLocation.lng]
            ].filter(point => point && Array.isArray(point) && point.length === 2 && 
                !isNaN(point[0]) && !isNaN(point[1]));

            if (points.length > 0) {
                const bounds = L.latLngBounds(points);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } catch (error) {
            console.error('Error in MapUpdater:', error);
        }
    }, [map, pickupCoords, destinationCoords, captainLocation]);

    return null;
}

function MapComponent({ pickupCoords, destinationCoords, ride, showRoute = false }) {
    const [routePath, setRoutePath] = useState([]);
    const [captainLocation, setCaptainLocation] = useState(null);
    const [error, setError] = useState(null);
    const { socket } = useContext(SocketContext);
    const defaultPosition = [28.6139, 77.2090]; // Delhi coordinates

    // Log props for debugging
    useEffect(() => {
        console.log('MapComponent Props:', {
            pickupCoords,
            destinationCoords,
            ride,
            showRoute
        });
    }, [pickupCoords, destinationCoords, ride, showRoute]);

    // Handle captain location updates
    useEffect(() => {
        if (socket && ride?.status) {
            console.log('Setting up socket listener for captain location');
            
            socket.on('captain-location-update', (data) => {
                console.log('Received captain location:', data);
                if (data.location) {
                    setCaptainLocation(data.location);
                }
            });

            return () => {
                console.log('Cleaning up socket listener');
                socket.off('captain-location-update');
            };
        }
    }, [socket, ride]);

    // Fetch route when coordinates change
    useEffect(() => {
        async function fetchRoute() {
            if (!pickupCoords || !destinationCoords || !showRoute) {
                console.log('Skipping route fetch - missing required data');
                return;
            }

            try {
                console.log('Fetching route for coordinates:', {
                    pickup: pickupCoords.join(','),
                    destination: destinationCoords.join(',')
                });

                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/maps/get-route?` +
                    `origin=${pickupCoords.join(',')}&` +
                    `destination=${destinationCoords.join(',')}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const data = await response.json();
                console.log('Route data received:', data);

                if (data.coordinates) {
                    setRoutePath(data.coordinates);
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        }

        fetchRoute();
    }, [pickupCoords, destinationCoords, showRoute]);

    if (error) {
        console.error('MapComponent error:', error);
    }

    return (
        <div className="h-full w-full relative">
            {error && (
                <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 px-4 py-2 z-50">
                    Error: {error}
                </div>
            )}
            
            <MapContainer 
                center={defaultPosition}
                zoom={13} 
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {pickupCoords && Array.isArray(pickupCoords) && pickupCoords.length === 2 && (
                    <Marker position={pickupCoords}>
                        <Popup>Pickup Location</Popup>
                    </Marker>
                )}

                {destinationCoords && Array.isArray(destinationCoords) && destinationCoords.length === 2 && (
                    <Marker position={destinationCoords}>
                        <Popup>Destination</Popup>
                    </Marker>
                )}

                {captainLocation && (
                    <Marker 
                        position={[captainLocation.lat, captainLocation.lng]} 
                        icon={captainIcon}
                    >
                        <Popup>Captain's Location</Popup>
                    </Marker>
                )}

                {showRoute && routePath.length > 0 && (
                    <Polyline
                        positions={routePath}
                        color="blue"
                        weight={3}
                        opacity={0.7}
                    />
                )}

                <MapUpdater
                    pickupCoords={pickupCoords}
                    destinationCoords={destinationCoords}
                    captainLocation={captainLocation}
                />
            </MapContainer>
        </div>
    );
}

export default MapComponent;