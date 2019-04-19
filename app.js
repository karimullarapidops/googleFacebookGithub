const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://googleauth:googleauth34@ds135796.mlab.com:35796/googleauthtest', { useNewUrlParser: true });

const app  = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));

// Start the server

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`server listening at ${port}`);

// mongodb://localhost/APIAuthentication
//facebookId: 2286438978281149
// Appsecret:8eb85cc6b1def4fc2337f2c40f2f5b84
// accesstokenfacebook: EAAgfgQ8ZA3r0BAKqQ3pG5xEgbDa6QcfAZBkp4ZCB3pDEeKZCzdXdRam7k1YsbjXMC0Ic7vZCvtWUh0tbDKZACqkGZCTd7WsrSZBHeXNI3NyvCZC46EPiuPIYelUVgQpZCHOs3bEEecUgARjqgZA4JbsepGdcc8VYMMI6kIghPveMmGOhwZDZD

//github
//clientID: 9209c31795a07e74f272
//Client Secret: c412de760df14a194c334eaad35e1cb9f41ab399

 