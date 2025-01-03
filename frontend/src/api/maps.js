// frontend/src/api/maps.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const searchLocation = async (query) => {
    const response = await axios.get(`${API_URL}/maps/get-suggestions`, {
        params: { input: query },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const getRouteInfo = async (origin, destination) => {
    const response = await axios.get(`${API_URL}/maps/get-distance-time`, {
        params: { origin, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};