import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    // find all the tickets that dont have a corresponding order
    const tickets = await Ticket.find({
        orderId: undefined
    });

    res.send(tickets);
});

export { router as indexTicketRouter };