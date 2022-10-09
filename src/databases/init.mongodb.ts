import mongoose from 'mongoose';

const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
const db = mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Mongodb connected to db');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log(
            'Mongoose default connection disconnected through app termination'
        );
        process.exit(0);
    });
});
export default db;
