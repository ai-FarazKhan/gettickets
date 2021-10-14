import { Listener, OrderCreatedEvent, Subjects } from "@gettickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); // this will gonna gives us time in milliseconds. So this should gives us the difference between this timeout at some point in the future or the expires at time, And the current time write now.
        console.log('Waiting this many milliseconds to process the job.', delay);

        await expirationQueue.add({
            orderId: data.id
        },
            {
                delay,
            }
        );
        msg.ack();
    }
}