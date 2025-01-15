const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const jwt = require('jsonwebtoken');

function initializeSocket(server) {
   const io = socketIo(server, {
        cors: {
            origin: [
                "http://localhost:5173", 
                "http://127.0.0.1:5173",
                "https://9vrc9sd2-5173.inc1.devtunnels.ms",
                "http://9vrc9sd2-5173.inc1.devtunnels.ms",
                'https://gosafar.vercel.app',
                'https://gosafar-git-main-yash-jains-projects-4d3bfc06.vercel.app',
                'https://gosafar-68htry3aq-yash-jains-projects-4d3bfc06.vercel.app'
            ],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["Authorization"]
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        upgradeTimeout: 30000,
        agent: false,
        //rejectUnauthorized: false // Only use during development
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                throw new Error('Authentication token missing');
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userType = decoded.type;
            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    global.io = io;

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}, User ID: ${socket.userId}, Type: ${socket.userType}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                if (!userId || !userType) {
                    throw new Error('Invalid join data');
                }

                // Join both userId room and socket.id room
                socket.join([userId, socket.id]);
                
                // Update socket ID in database based on user type
                const Model = userType === 'captain' ? captainModel : userModel;
                await Model.findByIdAndUpdate(userId, { socketId: socket.id });

                console.log(`${userType} ${userId} joined rooms: ${userId}, ${socket.id}`);
                socket.emit('joined', { message: 'Successfully joined' });
            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            // Clean up socket ID from database
            if (socket.userType === 'captain') {
                await captainModel.findByIdAndUpdate(socket.userId, { 
                    socketId: null,
                    isAvailable: false 
                });
            } else {
                await userModel.findByIdAndUpdate(socket.userId, { socketId: null });
            }
        });
    });

    return io;
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!socketId || !messageObject) {
        console.error('Invalid message data:', { socketId, messageObject });
        return;
    }

    if (!global.io) {
        console.error('Socket.io not initialized');
        return;
    }

    try {
        // Send to both socket.id and user room
        global.io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`Message sent to ${socketId}:`, messageObject);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


module.exports = { initializeSocket, sendMessageToSocketId };