let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');

module.exports = function(app, passport){


//Is the user logged in
function isLogged(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else res.redirect('/login');
};

//Is the user a member of the house
function isMember(req, res, next){
    if (req.user.isMember(req.body.house)){
        next();
    } else res.send({error: req.user.fname + ' is not a member of ' + req.body.house});
};

//Page routes

app.get('/', function(req, res, next) {
        if (req.isAuthenticated())
                res.sendFile(__dirname + '/public/index.html');
        else
                res.redirect('/login');
});

app.get('/bundle.js', function(req, res, next) {
        if (req.isAuthenticated()) 
                res.sendFile(__dirname + '/public/bundle.js');
        else
                res.redirect('/login');
});



/*
app.get('/socket.io.js', function(req, res, next) {
        if (req.isAuthenticated()) 
                res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js');
        else
                res.redirect('/login');
});

app.get('/socket.io.js.map', function(req, res, next) {
        if (req.isAuthenticated()) 
                res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js.map');
        else
                res.redirect('/login');
});*/

app.get('/entry.js', function(req, res){
        res.sendFile(__dirname + '/src/static/entry.js');
});

app.get('/login', function(req, res, next) {
        res.render('entry', { message: req.flash('loginMessage') });
});


//JSON request routes
app.get('/json/user', isLogged, function (req, res){
        console.log(req.user);
        res.send(
                {email: req.user.email,
                 fname: req.user.fname,
                 lname: req.user.lname});
});

app.get('/json/getuser/:email', isLogged, function(req, res){
        User.findOne({'email' : req.params.email}, (err, user)=>{
                if (err)
                        res.send({error: 'Error'});
                if (!user)
                        res.send({error: 'User ' + req.params.email + ' does not exist.'});
                else if (req.params.email == req.user.email)
                        res.send({error: 'Current user is that user'})
                else
                        res.send({error: false,
                                fname: user.fname,
                                lname: user.lname});
                        
        });
});

app.get('/json/houses', isLogged, function (req, res){
                res.send({houses: req.user.houses});
});

app.get('/json/tasks', isLogged, isMember, function(req, res){ //UNTESTED
    Task.find({'house' : req.body.house}, (err, docs)=>{
        if (err) console.log(err);
        else res.send(docs);
    });
});



app.get('/json/members', isLogged, isMember, (req, res)=>{ //UNTESTED
    User.find({'houses' : req.body.house}, (err, docs)=>{
        if (err) console.log(err);
        else if (docs){
            let response = [];
            foreach(doc in docs)
            response.push({fname: doc.fname, lname: doc.lname})
            res.send(response);
        } else res.send({error: 'No members found'});
    });
});



//Data submission routes
app.post('/post/memberadd', (req, res)=>{ //UNTESTED req.body = house, newEmail
        if (req.isAuthenticated()){
                if (req.user.isMember(req.body.house))
                {
                        House.findOne({'admin': req.user.email, 'name': req.body.house}, (err, house)=>{
                                if (err) console.log(err);
                                if (house){
                                        User.findOne({'email': req.body.newEmail}, (err, user)=>{
                                                if (err) console.log(err);
                                                if (user){
                                                        if (user.isMember(req.body.house))
                                                                res.send('User is a member of that house already');
                                                        else
                                                                user.addHouse(req.body.house);
                                                } else res.send('New user not found');
                                        });
                                } else res.send('You are not the administrator');
                        });
                } else console.log('Not a member of the house');
        } else res.redirect('/login');
});

app.post('/post/housecreate', function (req, res){
        if (req.isAuthenticated())
                House.findOne({ 'name' :  req.body.name }, function(err, house) {
                        if (err) console.log(err);
                        if (house) {
                                console.log('House already exists');
                        } else {
                                var newHouse    = new House();
                                newHouse.name   = req.body.name;
                                newHouse.admin  = req.user.email;
                                newHouse.save(function(err) {
                                        if (err) throw err;
                                });
                                req.user.addHouse(req.body.name);
                        }
                });    
        else
                res.redirect('/login');
});

//req.body = tasks[{name, description, difficulty}], house
app.post('/post/newtask', function(req, res){ //UNTESTED
        if (req.isAuthenticated) {
                if (req.user.isMember(req.body.house)){
                        foreach(task in req.body.tasks)
                        Task.findOne({'name' : task.name, 'house' : req.body.house}, (err, task)=>{
                                if  (err) console.log(err);
                                else if (task) console.log('Task ' + req.body.name + ' already exists at ' + req.body.house);
                                else {
                                        var newTask             = new Task();
                                        newTask.name            = task.name;
                                        newTask.house           = req.body.house;
                                        newTask.description     = task.description;
                                        newTask.difficulty      = task.difficulty;
                                        newTask.save(function(err){
                                                if (err) throw err;
                                        });
                                }
                        });
                } else console.log('User ' + req.user.name + ' is not a member of ' + req.body.house);
        } else res.reditect('/login');
});

app.post('/post/signup',passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));

/*
app.post('/post/test', (req, res, next)=>{
});*/

app.post('/post/login',passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the home section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
}));
};