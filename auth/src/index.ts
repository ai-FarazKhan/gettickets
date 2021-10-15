import mongoose, { mongo } from 'mongoose';
import { app } from './app';

const start = async () => {

    console.log('Starting up hey....');

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined !!');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error(err);
    }

    // so if we pass this try catch statement successfuly than its probably time for us to actually start listening for traffic.
    app.listen(3000, () => {
        console.log('Listening to port 3000 !!! yahoooo');
    });
};


start();
