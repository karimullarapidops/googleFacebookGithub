const express = require('express');
const router =  require('express-promise-router')();
// const router = express.Router;
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
//const passportGoogle = passport.authenticate('googleToken', { session: false });

router.route('/signup')
    .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);

router.route('/oauth/google')
    .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth); 

router.route('/oauth/facebook')
    .post(passport.authenticate('facebookToken', { session: false }), UsersController.facebookOAuth);  
    
router.route('/oauth/github')
    .post(passport.authenticate('github', { session: false }), UsersController.githubOAuth);    
    
router.route('/secret')
    .get(passportJWT, UsersController.secret);
    
module.exports = router;    
     