import request from 'supertest'; // supertest is a thing that allows us to fake our request to the express application.
import { app } from '../../app';


it('returns a 201 on successful signup', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'ai.farazalikhan@gmail.com',
        password: 'pakistan'
    })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'adada',
        password: 'pakistan'
    })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app).post('/api/users/signup').send({
        email: 'adada',
        password: 'a'
    })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    return request(app).post('/api/users/signup').send({})
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'abc@abc.com',
            password: 'pakistan'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'abc@abc.com',
            password: 'pakistan'
        })
        .expect(400);
});


it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'abc@abc.com',
            password: 'pakistan'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});