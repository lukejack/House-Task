/*-------------IMPORTS-------------*/
var express = require('express');
var app = express();
var server = require('http').Server(app);
//var io = require('socket.io')(server);
var port = process.env.port || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var passportSocketIo = require("passport.socketio");

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

/*--------------MODELS--------------*/
let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');
let myMongo = require('./config/mongo');
mongoose.connect(myMongo.url, myMongo.settings);
//var mongoStore = require('express-mongoose-store')(session, mongoose);
require('./passport')(passport);

/*----------EXPRESS SETUP-----------*/
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var expressSession = session(require('./config/session'));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/static');

require('./routes')(app, passport);
app.use(express.static(__dirname + '/public/'));

/*
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express 
  key:          'express.sid',       // the name of the cookie where express/connect stores its session_id 
  secret:       '7Xmxjr62DGBR9qDGbaY7lDhFzz3iZV',    // the session_secret to parse the cookie 
  store:        mongoStore        // we NEED to use a sessionstore. no memorystore please 
}));*/


/*
io.on('connection', function(socket){
  console.log('a user connected');
});*/

server.listen(port);
console.log('Listening at port ' + port + '.');