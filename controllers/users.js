const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

signToken = user => {
    return JWT.sign({
        iss: 'CodeWorkr',
        sub: user.id,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day a head
    }, JWT_SECRET);
}

module.exports = {
    signUp: async (req, res, next) => {
        const { email, password } = req.value.body;
        // Email & pasword
        // req.value.body
        //console.log('contents of req.value.body', req.value.body);
       // console.log('UsersController.signUp() called!');

       // check if there is a user with the same email
       const foundUser = await User.findOne({ 'local.email': email });
       if (foundUser) {
           return res.status(403).json({ error: 'Email is already in use' });
       }

        // Create a new User
        const newUser = new User({
            method: 'local',
            local: {
                email: email,
             password: password
            }
         });
        await newUser.save();

        // Generate the token
        const token = signToken(newUser);

         //Respond with token
         res.status(200).json({ token: token });
       
    },

    signIn: async (req, res, next) => {
        // Generatetoken
        // console.log('UsersController.signIn() called!');
        //console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
        console.log('Successfully login!');
    },

    googleOAuth: async (req, res, next) => {
        //Generate token
        // console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    facebookOAuth: async (req, res, next) => {
        // console.log('Got here');
        // console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    githubOAuth: async ( req, res, next) => {
        console.log('Got here!');
        console.log('req.user', req.user);
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    secret: async (req, res, next) => {
        // console.log('UsersController.secret() called!');
        console.log('I managed to get here1');
        res.json({ secret: "resource" });
    }
}