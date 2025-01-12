const userModel = require('../models/user.model');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async(req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ]; 
    if(!token){
        return res.status(401).json({ message: 'unauthorized' });
    }
    
    const isBlackListed = await blacklistTokenModel.findOne({ token: token });

    if(isBlackListed){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;
        return next();
    }
    catch (err){
        return res.status(401).json({ message: 'Unauthorized'});
    }
}

module.exports.authCaptain = async(req, res, next) => {
    try {
        console.log('Authorization Header:', req.headers.authorization);
        
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log('Extracted token:', token ? 'exists' : 'not found');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded);
        
        if (!decoded._id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        // Try to find captain first
        const captain = await captainModel.findById(decoded._id);
        console.log('Found captain:', captain ? 'yes' : 'no', 'ID:', decoded._id);
        
        // If no captain found, check if it's a user token
        if (!captain) {
            const user = await userModel.findById(decoded._id);
            if (user) {
                console.log('Found user instead of captain - incorrect token type');
                return res.status(401).json({ 
                    message: 'Invalid account type. Please login as a captain.' 
                });
            }
            return res.status(401).json({ message: 'Captain not found' });
        }

        // Log captain details
        console.log('Captain details:', {
            id: captain._id,
            status: captain.status,
            hasSocketId: !!captain.socketId
        });

        if (captain.status !== 'active') {
            return res.status(401).json({ message: 'Captain account is not active' });
        }

        req.captain = captain;
        return next();
    } catch (err) {
        console.error('Captain authentication error:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: 'Authentication error' });
    }
};