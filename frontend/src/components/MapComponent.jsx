import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Map updater component
function MapUpdater({ pickupCoords, destinationCoords, routeCoordinates }) {
    const map = useMap();

    useEffect(() => {
        if (pickupCoords && destinationCoords) {
            const bounds = L.latLngBounds([pickupCoords, destinationCoords]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (pickupCoords) {
            map.setView(pickupCoords, 13);
        }
    }, [map, pickupCoords, destinationCoords]);

    return null;
}

function MapComponent({ pickupCoords, destinationCoords, routeCoordinates }) {
    const defaultPosition = [28.6139, 77.2090]; // Delhi coordinates

    return (
        <div className="h-full w-full relative">
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

                {routeCoordinates?.length > 0 && (
                    <Polyline 
                        positions={routeCoordinates}
                        color="blue"
                        weight={3}
                        opacity={0.7}
                    />
                )}

                <MapUpdater 
                    pickupCoords={pickupCoords}
                    destinationCoords={destinationCoords}
                    routeCoordinates={routeCoordinates}
                />
            </MapContainer>
        </div>
    );
}

export default MapComponent;