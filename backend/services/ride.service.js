const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;


}
module.exports.getFare = getFare;

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // Get coordinates
    const pickupCoords = await mapService.getAddressCoordinate(pickup);
    const destinationCoords = await mapService.getAddressCoordinate(destination);

    if (!pickupCoords || !destinationCoords) {
        throw new Error('Failed to get location coordinates');
    }

    // Calculate fare
    const fare = await getFare(pickup, destination);

    // Create ride with proper location data
    // Note: Changed from ltd/lng to lat/lon to match the expected format
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        pickupLocation: {
            type: 'Point',
            coordinates: [parseFloat(pickupCoords.lon), parseFloat(pickupCoords.lat)]
        },
        destinationLocation: {
            type: 'Point',
            coordinates: [parseFloat(destinationCoords.lon), parseFloat(destinationCoords.lat)]
        },
        otp: getOtp(6),
        fare: fare[vehicleType],
        vehicleType
    });

    return ride;
};

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    // Validate required parameters
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    if (!captain || !captain._id) {
        throw new Error('Valid captain data is required');
    }

    // First check if the ride exists and is in a valid state
    const existingRide = await rideModel.findOne({
        _id: rideId,
        status: 'pending' // Only allow confirming pending rides
    });

    if (!existingRide) {
        throw new Error('Ride not found or not in pending state');
    }

    // Update the ride with captain info and change status
    const updatedRide = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            status: 'pending' // Extra check to prevent race conditions
        },
        {
            status: 'accepted',
            captain: captain._id
        },
        { new: true } // Return updated document
    );

    if (!updatedRide) {
        throw new Error('Failed to update ride status');
    }

    // Populate user and captain details
    const populatedRide = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!populatedRide) {
        throw new Error('Failed to retrieve updated ride details');
    }

    return populatedRide;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}


