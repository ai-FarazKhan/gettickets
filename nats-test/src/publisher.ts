import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
// when then use this library to create a client, a client is what actually going to connect to our nats streaming server, and try to exchange some information with it.
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});  // hum stan ko client bhi keh saktay hain.


// now we going to wait for stan/client to successfully connect to our nats streaming server.
// so after the client successfully connects to the nats streaming server, its going to emit the connect event. So we gonna listen for the connect event.
stan.on('connect', async () => {
    console.log('Publisher connected to NATS Streaming server');

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        });
    } catch (err) {
        console.log(err);
    }

    // this is will be the information that we want to share.
    // We can only share strings or essentially raw data, we cannot share directly plain javascript object. In order to share this, or send this to NATS streaming server, we first have to convert it to the JSON which is a plain string. So essentially all of our data before we send it to NATS streaming server. We just have to convert it to JSON.
    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // // now we call stan publish function, the publish function is how actually we publish data. When we call publish we gonna pass it the name of the channel, or the subject we wanna publish this information to, and also we pass the data we want to share as well.
    // // first argument main subject/channel ka name aiga, ke hamain kisse share karna hai. Second argument data lagain gain jo hamain share karna hai. Third argument aik callback function hai, this function is going to be invoked after we published this data.
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published');
    // });

});