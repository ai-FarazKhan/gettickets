import { MongoMemoryServer } from 'mongodb-memory-server';  // this going to start a copy of a mongodb in memory 
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

// we refer to beforeAll as a hook function. what ever we pass inside here that function is going to run beforeAll of our tests starts to be executed.
beforeAll(async () => {
    process.env.JWT_KEY = 'abcd';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    // now we gonna tell mongoose to connect to this in memory server.
    await mongoose.connect(mongoUri);
});


beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections(); // this gonna gives us all the different collections that exists.

    // reseting all our data between each test that we run
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});



global.signin = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'abc@abc.com',

    };

    // Now take this payload and Create the JWT! 
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Now take this token and Build session object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data.
    return [`express:sess=${base64}`];

};