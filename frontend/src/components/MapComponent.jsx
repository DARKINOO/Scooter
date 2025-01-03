// MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

//Fix for default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });

function MapComponent() {
    const position = [28.6139, 77.2090]; // Delhi coordinates

    return (
        <div className="h-full w-full relative">
            <MapContainer 
                center={position} 
                zoom={13} 
                className="h-full w-full"
                zIndex={0} // Ensure map stays below other elements
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Your location
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default MapComponent;