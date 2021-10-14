import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@gettickets/common';
import { User } from '../models/user';

// body is function thats gonna check the body of the incomming request.
// whenever we run validationResult its going to inspect the request and pull out any information that is appended to request during validtion request.
// import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

// req, res ke argument se phele hamain body middleware lagana hai. trim() method sanitize karta hai, make sure karta hai ke spaces na hoon password main
router.post('/api/users/signup',
    [body('email').isEmail().withMessage('Email must be valid'), body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be in between 4 and 20 characters !!')], validateRequest,
    async (req: Request, res: Response) => {

        // const errors = validationResult(req);
        // // we now check if any errors actually present. so if errors object is not empty, then we need to handle the error that just occured.
        // if (!errors.isEmpty()) {
        //     // ab yeh achi location hai, to somehow take the errors that were produce, and then send them back to the user early, before its executing anything else inside this function.
        //     // return res.status(400).send(errors.array());
        //     // throw new Error('Invalid Email or password'); // its going to be automatically picked up by that error handler middleware, that we just created. where we can do some processing on it.
        //     throw new RequestValidationError(errors.array());
        // }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email is in use already !!');
        }

        const user = User.build({ email, password });
        await user.save();

        // Genrating JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!); // this ! means ke hum typescript ko bata rhai hain ke JWT_KEY defined hai 100%


        // Now Storing JWT on session object.
        // req.session.jwt = userJwt; issay error aiga. 
        // sahi tariqa yeh hai
        req.session = {
            jwt: userJwt
        };

        // so we generated our token, we set it to the session. Now the cookie session library is gonna take this object, serialize it, and then sends it back to the users browser.

        res.status(201).send(user);

    });

export { router as signupRouter };