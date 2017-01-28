/*-------------IMPORTS-------------*/
var express = require('express');
var app = express();
var port = process.env.port || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

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
mongoose.connect(require('./config/mongo'));
require('./passport')(passport);

/*----------EXPRESS SETUP-----------*/
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session(require('./config/session')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app, passport);

app.listen(port);
console.log('Listening at port ' + port + '.');