import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListner } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // anytime when we tries to close/disconnect the client/running server we going to do a console log.
    stan.on('close', () => {
        console.log('NATS connection closed.');
        process.exit();
    });

    new TicketCreatedListner(stan).listen();
});

// i am gonna add in 2 handlers to watch for any single time someone tries to close down this process.
// these both below are watching for interupt signals or terminate signals.
// these are signals that are sent to this process anytime that ts-node dev tries to restart our program or anytime you hit ctrl+c in your terminal.
// so whenever this happen we then going to close down our client first.
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


