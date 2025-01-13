const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination, vehicleType } = req.body;

        // Get coordinates
        const pickupCoords = await mapService.getAddressCoordinate(pickup);
        const destinationCoords = await mapService.getAddressCoordinate(destination);

        // Convert string coordinates to numbers and validate
        const pickupLng = parseFloat(pickupCoords.lng);
        const pickupLat = parseFloat(pickupCoords.lat);
        const destLng = parseFloat(destinationCoords.lng);
        const destLat = parseFloat(destinationCoords.lat);

        if (isNaN(pickupLng) || isNaN(pickupLat) || isNaN(destLng) || isNaN(destLat)) {
            return res.status(400).json({ message: 'Invalid coordinates received' });
        }

        // Create initial ride
        const initialRide = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            pickupLocation: {
                type: 'Point',
                coordinates: [pickupLng, pickupLat]
            },
            destinationLocation: {
                type: 'Point',
                coordinates: [destLng, destLat]
            }
        });

        // Find and populate the created ride
        const populatedRide = await rideModel.findById(initialRide._id)
            .populate({
                path: 'user',
                select: 'fullname email socketId'
            });

        // Find nearby captains
        const nearbyCaptains = await mapService.getCaptainsInTheRadius(
            parseFloat(pickupLat),
            parseFloat(pickupLng),
            5  // 5km radius
        );

        console.log(`Found ${nearbyCaptains.length} nearby captains`);

        // Prepare ride data for socket
        const rideData = {
            _id: populatedRide._id,
            user: {
                fullname: {
                    firstname: populatedRide.user.fullname.firstname,
                    lastname: populatedRide.user.fullname.lastname
                },
                email: populatedRide.user.email
            },
            pickup: populatedRide.pickup,
            destination: populatedRide.destination,
            fare: populatedRide.fare,
            status: populatedRide.status,
            pickupLocation: populatedRide.pickupLocation,
            destinationLocation: populatedRide.destinationLocation
        };

        // Notify captains
        nearbyCaptains.forEach(captain => {
            if (captain.socketId && captain.isAvailable) {
                console.log(`Notifying captain ${captain._id} via socket ${captain.socketId}`);
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideData
                });
            }
        });

        return res.status(201).json({
            ride: populatedRide,
            nearbyCaptainsCount: nearbyCaptains.length
        });

    } catch (error) {
        console.error('Create ride error:', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getFare = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { pickup, destination } = req.query;
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
        
    } catch (err) {
        console.error('Get fare error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Debug logging
        console.log('Captain data:', req.captain);
        console.log('Ride ID:', req.body.rideId);

        const { rideId } = req.body;
        
        const ride = await rideService.confirmRide({ 
            rideId, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
        }
        return res.status(200).json(ride);

    } catch (err) {
        console.error('Confirm ride error details:', {
            error: err.message,
            captain: req.captain,
            rideId: req.body.rideId
        });
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rideId, otp } = req.query;
        const ride = await rideService.startRide({ 
            rideId, 
            otp, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });
        }

        return res.status(200).json(ride);

    } catch (err) {
        console.error('Start ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rideId } = req.body;
        const ride = await rideService.endRide({ 
            rideId, 
            captain: req.captain 
        });

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-ended',
                data: ride
            });
        }

        return res.status(200).json(ride);

    } catch (err) {
        console.error('End ride error:', err);
        return res.status(500).json({ message: err.message });
    }
};