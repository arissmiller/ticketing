import {Ticket} from '../ticket';

it('implements optimistic conccurrency control', async () => {
  //create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  //save ticket to database
  await ticket.save();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //make 2 seperate changes to tickets we fetched
  firstInstance!.set({price: 10});
  secondInstance!.set({price: 15});
  //save first fetched ticket
  await firstInstance!.save();
  //save the second fetched ticketand expect an error
  try {
    await secondInstance!.save();
  }catch(err) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
})
