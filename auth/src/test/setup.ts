import { MongoMemoryServer } from 'mongodb-memory-server';  // this going to start a copy of a mongodb in memory 
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';


declare global {
    var signin: () => Promise<string[]>;
}

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



global.signin = async () => {
    const email = 'test@test.com';
    const password = 'pakistan';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};