let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');
let ops = require('./dataOps');
let mongoose = require('mongoose');

module.exports = function (app, passport) {

        //Is the user logged in
        function isLogged(req, res, next) {
                if (req.isAuthenticated()) {
                        next();
                } else res.redirect('/login');
        };

        //Is the user a member of the house
        function isMember(req, res, next) {
                req.user.isMember(req.params.house, (is) => {
                        if (is) next();
                        else res.send({ error: req.user.fname + ' is not a member of ' + req.params.house });
                });
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

        /*
        app.get('/entry.ejs', function (req, res) {
                res.sendFile(__dirname + '/src/static/entry.ejs');
        });*/

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
                User.findOne({ 'email': req.user.email }, function (err, user) {
                        /*
                        user.getHouseNames((names) => {
                                res.send({ houses: names, ids: user.houses });
                        });*/

                        let houseIds = [];
                        for (let i = 0; i < user.houseIds.length; i++) {
                                houseIds[i] = mongoose.Types.ObjectId(user.houseIds[i]);
                        }

                        House.find({
                                '_id': {
                                        $in: houseIds
                                }
                        }, (err, houses) => {
                                if (err) {
                                        console.log(err);
                                        res.send({ error: 'Database error' });
                                }
                                if (!houses) { console.log('No houses'); res.send({ error: 'No houses found' }) }
                                else {
                                        res.send({ houses: houses });
                                }
                        });
                })
        });

        app.get('/json/tasks/:house', isLogged, isMember, function (req, res) {
                House.findOne({ 'name': req.params.house }, (err, house) => {
                        if (err) { console.log(err); res.send({ error: 'Database Error' }) }
                        Task.find({ 'houseId': house._id.toString() }, (err, tasks) => {
                                if (err) { console.log(err); res.send({ error: 'Database Error' }) }
                                else res.send(JSON.stringify(tasks));
                        });
                });
        });



        app.get('/json/members', isLogged, isMember, (req, res) => { //Verify
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

        app.get('/json/completions/:house', isLogged, isMember, (req, res) => {
                House.findOne({ 'name': req.params.house }, (err, house) => {
                        if (err) res.send({ error: 'Database error' })
                        ops.getCompletions(house._id.toString(), req.user, (response) => {
                                res.send(response);
                        });
                });
        });



        //Data submission routes
        app.post('/post/memberadd', isLogged, (req, res) => {
                ops.addMembers(req.body.house, req.user, JSON.parse(req.body.members), (response) => {
                        console.log('post memberadd response: ', response);
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
                ops.addTasks(req.body.house, req.user, JSON.parse(req.body.tasks), (response) => {
                        res.send(JSON.stringify(response));
                });
        });

        app.post('/post/taskcomplete', isLogged, function (req, res) {
                ops.addCompletion(req.body.houseId, req.body.taskId, req.user, req.body.description, (response) => {
                        res.send(JSON.stringify(response));
                });
        });

        app.get('/logout', function (req, res) {
                req.logout();
                res.redirect('/');
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