import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Initializing socket with token:', token ? 'Present' : 'Missing');

        // Create socket instance
        const socketInstance = io(`${import.meta.env.VITE_BASE_URL}`, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
            autoConnect: false, // Don't connect automatically
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token: token
            },
            timeout: 60000
        });

        // Debug connection process
        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', {
                message: error.message,
                description: error.description,
                type: error.type
            });
        });

        socketInstance.on('connect', () => {
            console.log('Socket connected successfully:', {
                id: socketInstance.id,
                connected: socketInstance.connected,
                viteBaseUrl: import.meta.env.VITE_BASE_URL
            });
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
        });

        // Connect after setting up listeners
        socketInstance.connect();
        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket connection');
                socketInstance.disconnect();
            }
        };
    }, []); // Empty dependency array - only run once

    // Debug render
    console.log('SocketContext render:', {
        socketExists: !!socket,
        socketConnected: socket?.connected,
        socketId: socket?.id
    });

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;