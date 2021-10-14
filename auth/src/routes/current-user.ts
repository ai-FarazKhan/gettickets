import express from 'express';
// import jwt from 'jsonwebtoken';
import { currentUser } from '@gettickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    // if (!req.session || !req.session.jwt) {
    //     return res.send({ currentUser: null });
    // }
    // this above if statement is 100% equivalent to this below if statement, humnay bas statement ko short kiya hai
    // if (!req.session?.jwt) {
    //     return res.send({ currentUser: null });
    // }
    // try {
    //     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    //     res.send({ currentUser: payload });
    // }
    // catch (err) {
    //     res.send({ currentUser: null });
    // }


    // all we really that need is to take the information of that currentUser property on a request object.
    res.send({ currentUser: req.currentUser || null }); // remember, current user will going to be the actuall json payload.
});

export { router as currentUserRouter };