import { Listener } from "./base-listener";
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";


export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);

        console.log(data.id);
        console.log(data.price);
        console.log(data.title);

        msg.ack();
    };
}