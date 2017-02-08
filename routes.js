let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');
let ops = require('./dataOps');

module.exports = function (app, passport) {

        //Is the user logged in
        function isLogged(req, res, next) {
                if (req.isAuthenticated()) {
                        next();
                } else res.redirect('/login');
        };

        //Is the user a member of the house
        function isMember(req, res, next) {
                if (req.user.isMember(req.body.house)) {
                        next();
                } else res.send({ error: req.user.fname + ' is not a member of ' + req.body.house });
        };

        //Page routes

        app.get('/', function (req, res, next) {
                if (req.isAuthenticated())
                        res.sendFile(__dirname + '/public/index.html');
                else
                        res.redirect('/login');
        });

        app.get('/bundle.js', function (req, res, next) {
                if (req.isAuthenticated())
                        res.sendFile(__dirname + '/public/bundle.js');
                else
                        res.redirect('/login');
        });

        app.get('/entry.js', function (req, res) {
                res.sendFile(__dirname + '/src/static/entry.js');
        });

        app.get('/login', function (req, res, next) {
                res.render('entry', { message: req.flash('loginMessage') });
        });


        //JSON request routes
        app.get('/json/user', isLogged, function (req, res) {
                res.send(
                        {
                                email: req.user.email,
                                fname: req.user.fname,
                                lname: req.user.lname
                        });
        });

        // Email => Error, First Name, Last Name
        app.get('/json/getuser/:email', isLogged, function (req, res) {
                User.findOne({ 'email': req.params.email }, (err, user) => {
                        if (err)
                                res.send({ error: 'Database Error' });
                        if (!user)
                                res.send({ error: 'User ' + req.params.email + ' does not exist.' });
                        else if (req.params.email == req.user.email)
                                res.send({ error: 'Current user is that user' })
                        else
                                res.send({
                                        error: false,
                                        fname: user.fname,
                                        lname: user.lname
                                });

                });
        });

        // House Name => House Exists?
        app.get('/json/gethouse/:name', isLogged, function (req, res) {
                House.findOne({ 'name': decodeURI(req.params.name) }, (err, house) => {
                        if (err)
                                res.send({ error: 'Database Error' });
                        if (house)
                                res.send({ exists: true });
                        else
                                res.send({ exists: false });
                });
        });

        app.get('/json/houses', isLogged, function (req, res) {
                res.send({ houses: req.user.houses });
        });

        app.get('/json/tasks', isLogged, isMember, function (req, res) { //UNTESTED
                Task.find({ 'house': req.body.house }, (err, docs) => {
                        if (err) console.log(err);
                        else res.send(docs);
                });
        });



        app.get('/json/members', isLogged, isMember, (req, res) => { //UNTESTED
                User.find({ 'houses': req.body.house }, (err, docs) => {
                        if (err) console.log(err);
                        else if (docs) {
                                let response = [];
                                foreach(doc in docs)
                                response.push({ fname: doc.fname, lname: doc.lname })
                                res.send(response);
                        } else res.send({ error: 'No members found' });
                });
        });



        //Data submission routes
        app.post('/post/memberadd', isLogged, (req, res) => {
                ops.addMembers(req.body.house, req.user, JSON.parse(req.body.members), (response) => {
                        res.send(JSON.stringify(response));
                });
        });

        app.post('/post/housecreate', isLogged, function (req, res) {
                ops.createHouse(req.body.house, req.user, (response) => {
                        res.send(JSON.stringify(response));
                });
        });

        //req.body = tasks[{name, description, difficulty}], house
        app.post('/post/taskadd', isLogged, function (req, res) {
                ops.addTasks(req.body.house, req.user, JSON.parse(req.body.tasks), (response)=>{
                        res.send(JSON.stringify(response));
                });
        });

        app.post('/post/signup', passport.authenticate('local-signup', {
                successRedirect: '/', // redirect to the secure profile section
                failureRedirect: '/login', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
        }));

        app.post('/post/login', passport.authenticate('local-login', {
                successRedirect: '/', // redirect to the home section
                failureRedirect: '/login', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
        }));
};