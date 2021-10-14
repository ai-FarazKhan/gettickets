import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

// jest.mock('../../nats-wrapper'); // wehenever these tests are executed, jest will going to see that we are going to mock that file. So rather than actually imorting the real file, Jest is going to redirect that import and get what file trying to import nats-wrapper, our implementation we wrote out in __mocks__ 

it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});
    console.log(response.status);
    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: '',
        price: 10
    }).expect(400);

    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        price: 10
    }).expect(400);

});


it('returns an error if an invalid price is provided', async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: 'adadad12e',
        price: -10
    }).expect(400);

    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title: 'adadsda'
    }).expect(400);

});


it('creates a ticket with valid inputs', async () => {

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'adadada';

    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title,
        price: 20
    }).expect(201);

    tickets = await Ticket.find();
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
});


it('publishes and event', async () => {
    const title = 'adadada';

    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
        title,
        price: 20
    }).expect(201);

    // console.log(natsWrapper);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});