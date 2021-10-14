import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    // Create an instance of ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '123'
    });

    // Save the ticket to the database.
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);


    // make two separate changes to the tickets we fetched.
    firstInstance!.set({ price: 20 });
    secondInstance!.set({ price: 30 });


    // save the first fetched ticket
    await firstInstance!.save();


    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version bumber on multiple saves.', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});