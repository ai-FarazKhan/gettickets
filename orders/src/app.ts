import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gettickets/common';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy', true); // the reason for this is that, traffic is being proxied to our application through ingress inginix.

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// so first we need to disable the encryption on this cookie. Because the JWT itself is already encrypted.
// and i am also gonna require that cookies will only be used if the user is busy in our application over https connection. I will do secure: true.
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);


app.all('*', async (req, res) => {
    throw new NotFoundError();
});


app.use(errorHandler);


export { app };