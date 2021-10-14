import { Publisher, OrderCreatedEvent, Subjects } from "@gettickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}