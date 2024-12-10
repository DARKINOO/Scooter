const mongoose = require('mongoose');


function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.error('Failed to connect to DB:', err.message);
        console.error('Connection string used:', process.env.DB_CONNECT);
    });
}

module.exports = connectToDb;