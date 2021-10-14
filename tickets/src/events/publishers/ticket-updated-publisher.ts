import { Publisher, Subjects, TicketUpdatedEvent } from "@gettickets/common";

// Publisher base class that is a generic class, which means we need to put on those brackets and provide the Type of event that we are going to try to emit with this Publisher. So in this Case it is TicketUpdatedEvent.
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated; // we have to do both the type annotation and value assignment, the reason that we have both on here is to make sure that we never try to change the value of subject.
}