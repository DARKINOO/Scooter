// services/maps.service.js
const axios = require('axios');
const captainModel = require('../models/captain.model');

// Add rate limiting helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.getAddressCoordinate = async (address) => {
    // Add delay for Nominatim rate limiting
    await delay(1000);
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'GoSafar_App'
            }
        });
        
        if (response.data && response.data.length > 0) {
            return {
                ltd: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const originCoords = await this.getAddressCoordinate(origin);
    const destCoords = await this.getAddressCoordinate(destination);
    
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}?overview=false`;
    
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
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    await delay(1000); // Rate limiting
    
    if (!input) {
        throw new Error('query is required');
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'GoSafar_App'
            }
        });
        
        if (response.data) {
            return response.data.map(place => ({
                description: place.display_name,
                coordinates: {
                    ltd: parseFloat(place.lat),
                    lng: parseFloat(place.lon)
                }
            }));
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km
    const captains = await captainModel.find({
        'location.coordinates': {
            $geoWithin: {
                $centerSphere: [[lng, ltd], radius / 6371]
            }
        }
    });
    return captains;
}