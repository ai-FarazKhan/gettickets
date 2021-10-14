// publisher is going to emit an event to NATS streaming server.

import { Publisher, Subjects, TicketCreatedEvent } from "@gettickets/common";

// Publisher base class that is a generic class, which means we need to put on those brackets and provide the Type of event that we are going to try to emit with this Publisher. So in this Case it is TicketCreatedEvent.
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated; // we have to do both the type annotation and value assignment, the reason that we have both on here is to make sure that we never try to change the value of subject.
}