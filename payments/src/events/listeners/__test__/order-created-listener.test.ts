import {OrderCreatedEvent, OrderStatus} from '@awrtickets/common';
import {Message} from 'node-nats-streaming';
import {Order} from '../../../models/order';
import {natsWrapper} from '../../../nats-wrapper';
import mongoose from 'mongoose';
import {OrderCreatedListener} from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asfasdf',
    userId: 'asdfasdf',
    status: OrderStatus.Created,
    ticket: {
      id: 'asfasdf',
      price: 10
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {listener, data, msg};
};

it('replicates the order info', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
