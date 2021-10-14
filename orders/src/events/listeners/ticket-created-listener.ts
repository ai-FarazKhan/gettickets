import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@gettickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// The reason we are listening for this TicketCreatedEvent inside our order service, is so we can take the information about this ticket that we just created, and save it in a local tickets collection. This is a classic example of Data replication between services. We are saving this information about the ticket, so that the Order service needs to know the details about the ticket, It does not have to synchronous communication over to the ticket service, to learn about the different tickets that are available.

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName; // when two orders services to this channel and created a subscription, they join a queue group called orders-service, By been a member of this queue group, that ensure that anytime that event comes to this channel, this event is only going to be sent to one of the members inside this queue group. So the entire idea behind this is make sure that we not have our different services all independently processing the copy of an event at the same time. So instead the queue group make sure that this event is only going to be sent to either Order Service A or Order Service B.

    // now this data property coming to this onMessage() is: we created an interface to describe all the different events that are going to be flowing throughout our application. In this case that interface we created was the TicketCreatedEvent interface. So data was describing the different pieces of data that was gonna be contained inside this event.
    // on message function, we reference the event type interface and then we're saying off that interface, take a look at the data property. And that's going to be the type of this data argument right here.
    // and in the end what is msg ? This is an object coming from node-nats-streaming library, The message thing is something that tells us about the underline data coming from the node-nats-streaming server. Jab hum Message pe control+click karaingain toh iski defination pe chalay jaingain. Wahan aik method hoga ack() ke name se, that what right now we really care about. We call ack() when we have successfully processed the message or an event, and that is the signal to node-nats-streaming server that we have processed this event and it does not havet to worry about trying to send another copy of our service again. So after we successfuly processed an event inside of our different listeners, we always gonna finish up by calling ack().
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id, title, price
        });
        await ticket.save();

        // remember when we ack() message, that tells nats-streaming-server that we have processed this thing and we are good to go.
        msg.ack();
    }
}