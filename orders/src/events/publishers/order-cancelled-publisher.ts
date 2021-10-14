import { Publisher, Subjects, OrderCancelledEvent } from "@gettickets/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}