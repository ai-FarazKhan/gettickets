// this is where we are going to define our mongoose user model.

import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface UserAttributes {
    // so these are the attributes that are required to create a new user.
    email: string;
    password: string;
}

// An interface that describes the properties that a User Model has.
// i wanna take all the properties of mongoose.model interface, and add those to this new one that that we are creating. And i wanna add some new properties on top of that.
// this interface describes what the entire collection of Users looks like, or atleast method associated with the User model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attributes: UserAttributes): UserDoc;
}


// An interface that describes the what properties that a single user have.
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        // so we are only attempt to hash the password if it has been modified.
        // even if we just creating a user for the very first time isModified password will return true.

        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

// so this is how create a custom function in builtin model.
userSchema.statics.build = (attributes: UserAttributes) => {
    return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


// toh agar hum User.build karaingain toh typescript ko phir bhi nhin pata hoga ke what statics.build means.
// to change this, we gonna create an other interface.
// now those error goes away.
// User.build({
//     email: 'hello',
//     password: 'adhhdad'
// });



// typescript have no idea what arguments are been passed to this contructor, thats the problem when we start working with typescript and mongoose. The whole reason that we are using typescript so that we can check the stuff like this.
// to solve this i am going to create an interface at the top. and the function buildUser()
// new User({
//     email:'adsd',
//     password:'sdadsa',
//     contact: ''
// });


// anytime we want to create a new user, we are going to call this function, instead of calling new User.
// just putting this extra step, to just to get typescript involved in creating a new user.
// const buildUser = (attributes: UserAttributes) => {
//     return new User(attributes);
// };

// ab jaisa ke uper jab hum new User se bana rhai new user, toh typescript us main involve nhin thi.
// ab typescript involve hojaigi, jab bhi new user banaiga toh hum new User ke bajai, buildUser function use karaingain.
// toh ab hum agar koi extra cheez/ ya typing main spelling mistake add karaingain toh typescript hamain help karegi.
// buildUser({
//     email:'asdad',
//     password: '1213',
// });


// so anytime we wanna create a user or wanna work with user, now we have to import 2 different things from this file.
// That is not super convinient. Bhalay yeh approach work kar rhi hai, lekin kuch aisa karna hai, ke hamain sirf aik hi cheez export karni paray.

// ab hamain thora aur improve karna hai, karna yeh hai ke jab bhi hum user banain, toh sirf User.build likhain bas.
// the nice thing about this approach is that we dont have to export a thing from this file.
// mongoose.model se phele static method banaingain.


export { User };