import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

// this job right here in the argument is not our actual data instead its our object that wraps up our data, and have the information about the job itself, information such as the date when it was actually created etc.
expirationQueue.process(async (job) => {
    // console.log('i want to publish an expiration:complete event for orderId', job.data.orderId);

    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });
});


export { expirationQueue };