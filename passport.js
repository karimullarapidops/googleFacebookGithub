const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./config/index');
const User = require('./models/user');

// JSON Web token strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);

        // If user doesnot exists handle it
        if (!user) {
            return done(null, false);
        }

        // otherwise, return the user
        done(null, user); 
    } catch (error) {
       done(error, false); 
    }
}));

// Google OAUTH Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    //  clientID: '799345234601-k9ct2a3kgm44441jg96fifb1rhn3tlpi.apps.googleusercontent.com',
    //  clientSecret: '0clmAtv3UKlLRdznNHPv2YU_'
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Should have full user profile over here
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('profile', profile);
    
        // Check whether this current user exists in our db
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
            console.log('User already exists in our DB');
            return done(null, existingUser);
        }

        console.log('User doesnot exists, we are craeting new one exists in our DB');
    
        // If new Account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
    
        await newUser.save();
        done(null, newUser);  
    } catch (error) {
       done(error, false, error.message); 
    }
}));

// facebook staregy
passport.use('facebookToken', new FacebookTokenStrategy({
    // clientID: '2286438978281149',
    // clientSecret: '8eb85cc6b1def4fc2337f2c40f2f5b84'
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
     console.log('profile', profile);
     console.log('accessToken', accessToken);
     console.log('refreshToken', refreshToken);   
    } catch (error) {
        done(error, false, error.message);
    }
}));


// Local staregy
passport.use(new localStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // console.log('email', email);
            // Find the user given the email
    const user = await User.findOne({ "local.email": email });

    // If not, handle it
    if(!user) {
        return done(null, false);
    }

    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);

    // console.log('isMatch', isMatch);

    // If not handle it
    if (!isMatch) {
        return done(null, false);
    }

    // Otherwise return the user
    done(null, user);
    } catch (error) {
       done(error, false) 
    }
}));
