const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function(coords) {
                // Handle null/undefined cases
                if (!coords || !Array.isArray(coords)) {
                    return false;
                }

                // Ensure we have exactly 2 coordinates
                if (coords.length !== 2) {
                    return false;
                }

                // Parse coordinates safely
                const [lng, lat] = coords.map(coord => {
                    if (typeof coord === 'string') {
                        return parseFloat(coord);
                    }
                    return coord;
                });

                // Validate both coordinates are numbers and in valid ranges
                return !isNaN(lng) && !isNaN(lat) &&
                       lng >= -180 && lng <= 180 &&
                       lat >= -90 && lat <= 90;
            },
            message: 'Invalid coordinates. Must be [longitude, latitude] pair with valid ranges'
        }
    }
});


const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    pickupLocation: {
        type: pointSchema,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    destinationLocation: {
        type: pointSchema,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, // in seconds

    distance: {
        type: Number,
    }, // in meters

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required: true,
    },
})

module.exports = mongoose.model('ride', rideSchema);