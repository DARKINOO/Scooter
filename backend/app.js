const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

connectToDb();

// Rate limiter for map APIs
const rateLimit = require('express-rate-limit');
const mapLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 1
});

app.use(cors());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://gosafar.vercel.app/','https://gosafar-git-main-yash-jains-projects-4d3bfc06.vercel.app/','https://gosafar-68htry3aq-yash-jains-projects-4d3bfc06.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.get('/', (req, res)=> {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapLimiter, mapRoutes);
app.use('/rides', rideRoutes);

module.exports = app;