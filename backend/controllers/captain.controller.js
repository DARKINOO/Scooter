const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');
const Captain = require('../models/captain.model');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.updateLocation = async (req, res) => {
    try {
        // Get location data from request
        const { lat, lng } = req.body;
        
        // Validate location data
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid location coordinates. Latitude and longitude must be numbers.'
            });
        }

        // Get captain ID from auth middleware
        const captainId = req.captain._id;

        // Update captain's location
        const updatedCaptain = await Captain.findByIdAndUpdate(
            captainId,
            {
                location: {
                    type: 'Point',
                    coordinates: [lng, lat] // MongoDB uses [longitude, latitude] order
                }
            },
            { new: true } // Return updated document
        );

        if (!updatedCaptain) {
            return res.status(404).json({
                success: false,
                message: 'Captain not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: {
                location: updatedCaptain.location
            }
        });

    } catch (error) {
        console.error('Error updating captain location:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message
        });
    }
};

// module.exports = {
//     updateLocation
// };

module.exports.getCaptainDetails = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.user._id);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        res.status(200).json(captain);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}