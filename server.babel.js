/*-------------IMPORTS-------------*/
var fs = require('fs');
var express = require('express');
var app = express();

var port = process.env.port || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var schedule = require('node-schedule');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var path = require('path');


import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

/*--------------MODELS--------------*/
let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');

/*-------------DATABASE-------------*/
let myMongo = require('./config/mongo');
let connectDB = () => {
  mongoose.connect(myMongo.url, myMongo.settings, (err) => {
    if (err) {
      console.log(err);
      console.log('Failed to connect to database, retrying in 10 seconds...');
      setTimeout(connectDB, 10000);
    }
  });
}
connectDB();

/*----------CERTIFICATION-----------*/

let privateKey = fs.readFileSync('sslcert/localhost.key', 'utf8');
let certificate = fs.readFileSync('sslcert/localhost.crt', 'utf8');
let credentials = { key: privateKey, cert: certificate };

let httpsServer = require('https').createServer(credentials, app);
let httpServer = require('http').createServer(app);

/*----------EXPRESS SETUP-----------*/
require('./passport')(passport);

//Log data to the server
app.use((req, res, next) => {
  let date = new Date();
  let line = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' (' + date.getHours() + ':' + date.getMinutes()
    + ") " + (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress) + ' ' + req.originalUrl + '\n';
  fs.appendFile('log.txt', line, function (err) {
    if (err) console.log(err);
  });
  next();
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

var expressSession = session(require('./config/session'));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/static');

require('./routes')(app, passport);
app.use(express.static(__dirname + '/public/'));



let clean_users = () => {
  User.find({ mail_valid: { $ne: 'True' } }, (err, users) => {
    let date = new Date();
    for (let i = 0; i < users.length; i++) {
      if ((date.getTime() - users[i].sign_time) > 604800000) {
        console.log('Removing user ' + users[i].email);
        users[i].remove();

      }
    }
  });
};

//Delete accounts who have not verified for a week, check every day at midnight
clean_users();
var j = schedule.scheduleJob('0 0 0 * * *', function () {
  clean_users();
});


httpServer.listen(port);
//httpsServer.listen(8000);
console.log('Listening at port ' + port + '.');
