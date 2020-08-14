import Queue from 'bull';
import {OrderCreatedListener} from '../events/listeners/order-created-listener';
import {ExpirationCompletePublisher} from '../events/publishers/expiration-complete-publisher';
import {natsWrapper} from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>(
  'order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  },
});

expirationQueue.process(async (job) => {
  console.log('I want to publish an expiration:complete event for orderId', job.data.orderId);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export {expirationQueue}
