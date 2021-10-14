import express from 'express';
import 'express-async-errors';

import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@gettickets/common';

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

// app.all('*', async () => {
//     throw new NotFoundError();
// }); 
// is code ko theek karnay ke liye yeh karna hoga
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });
// ab bajai hum next() ko samjhain ke yeh internally kaisai kaam kar rha hai, hum aik package download karlaingain.
// jiska name express-async-errors hai
app.all('*', async (req, res) => {
    throw new NotFoundError();
});


app.use(errorHandler);


export { app };