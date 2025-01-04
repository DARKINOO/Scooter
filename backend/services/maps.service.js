const axios = require('axios');
const captainModel = require('../models/captain.model');

// Add rate limiting helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.getAddressCoordinate = async (address) => {
    // Add delay for Nominatim rate limiting
    await delay(1000);
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
        const response = await axios.get(url);
        if (response.data.length === 0) {
            throw new Error('Coordinates not found');
        }
        return response.data[0];
    } catch (error) {
        throw new Error('Error fetching coordinates');
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const originCoords = await this.getAddressCoordinate(origin);
    const destCoords = await this.getAddressCoordinate(destination);
    
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;
    
    try {
        const response = await axios.get(url);
       
        if (response.data && response.data.routes && response.data.routes[0]) {
            const route = response.data.routes[0];
            return {
                distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: route.distance // in meters
                },
                duration: {
                    text: `${Math.round(route.duration / 60)} mins`,
                    value: route.duration // in seconds
                }
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (error) {
        throw new Error('Error fetching distance and time');
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    await delay(1000); // Rate limiting
    
    if (!input) {
        throw new Error('Input is required');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`;
    
    try {
        const response = await axios.get(url);
        if (response.data.length === 0) {
            throw new Error('Suggestions not found');
        }
        return response.data.map(item => ({
            description: item.display_name,
            lat: item.lat,
            lon: item.lon
        }));
    } catch (error) {
        throw new Error('Error fetching suggestions');
    }
};

module.exports.getRoute = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const originCoords = await this.getAddressCoordinate(origin);
    const destCoords = await this.getAddressCoordinate(destination);
    
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=geojson`;
    
    try {
        const response = await axios.get(url);
        if (response.data.routes.length === 0) {
            throw new Error('Route not found');
        }
        return response.data.routes[0].geometry.coordinates;
    } catch (error) {
        throw new Error('Error fetching route');
    }
};

module.exports.getCaptainsInTheRadius = async (lat, lon, radius) => {
    // Implementation for fetching captains in the radius
};