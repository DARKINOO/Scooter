import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const captainIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapController({ pickupCoords, destinationCoords, captainLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = [
      pickupCoords,
      destinationCoords,
      captainLocation && [captainLocation.lat, captainLocation.lng]
    ].filter(point => point && Array.isArray(point) && point.length === 2);

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, pickupCoords, destinationCoords, captainLocation]);

  return null;
}

const LiveTrackingComponent = ({ pickupCoords, destinationCoords, socket, rideId }) => {
  const [captainLocation, setCaptainLocation] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const defaultPosition = [28.6139, 77.2090]; // Delhi coordinates

  useEffect(() => {
    if (!socket || !rideId) return;

    // Listen for captain location updates
    socket.on('captain-location-update', (data) => {
      if (data.rideId === rideId && data.location) {
        setCaptainLocation(data.location);
      }
    });

    // Fetch initial route
    const fetchRoute = async () => {
      if (!pickupCoords || !destinationCoords) return;

      try {
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
        if (data.coordinates) {
          setRoutePath(data.coordinates);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();

    return () => {
      socket.off('captain-location-update');
    };
  }, [socket, rideId, pickupCoords, destinationCoords]);

  return (
    <div className="h-full w-full">
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

        {pickupCoords && (
          <Marker position={pickupCoords}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {destinationCoords && (
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

        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}

        <MapController
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          captainLocation={captainLocation}
        />
      </MapContainer>
    </div>
  );
};

export default LiveTrackingComponent;