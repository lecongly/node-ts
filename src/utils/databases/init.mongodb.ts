import { config } from '@/utils/config';
import mongoose from 'mongoose';

const db = mongoose.connect(
    `mongodb+srv://${config.mongoUser}:${config.mongoPassword}${config.mongoPath}`
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Connect to database success ');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('Connect to database error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Disconnect to database');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
export default db;
