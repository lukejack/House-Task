var LocalStrategy = require('passport-local').Strategy;
var randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const mail_config = require('./config/mail_verif.js');

// load up the user model
var User = require('./models/user');

// expose this function to our app using module.exports
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local
module.exports = function (passport) {

    function mailValid(mail) {
        //From http://www.w3resource.com/javascript/form/email-validation.php#
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true);
        }
        return (false);
    }

    function passwordValid(pass) {
        if (pass.length >= 8) {
            return true;
        }
        return false;
    }

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                if (!mailValid(email)) {
                    return done(null, false, req.flash('loginMessage', 'Your email does not meet the requirements'));
                }

                if (!passwordValid(password)) {
                    return done(null, false, req.flash('loginMessage', 'Your password does not meet the requirements'));
                }

                if (!((req.body.fname && (req.body.fname != '')) && (req.body.lname && (req.body.lname != '')))) {
                    return done(null, false, req.flash('loginMessage', 'You must enter a first and last name'));
                }

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'email': email }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        let date = new Date();

                        // set the user's local credentials
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.fname = req.body.fname;
                        newUser.lname = req.body.lname;

                        //Email verification properties
                        newUser.sign_time = date.getTime();
                        let verif_token = randomstring.generate({ length: 20, charset: 'alphabetic' });
                        newUser.mail_valid = verif_token;
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: mail_config
                        });

                        //Email verification link
                        let mailOptions = {
                            from: '"House-Task" <' + mail_config.user + '>', // sender address
                            to: email, // list of receivers
                            subject: 'House-Task Email Verification', // Subject line
                            text: 'Thank you for signing up to House-Task! Please click the link below to confirm your registration:\nhttp://http://82.25.22.122/verif/' + verif_token // plain text body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                        });

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            //Tell them to check their email
                            return done(null, false, req.flash('loginMessage', 'Please click the email verification link'));
                        });
                    }

                });

            });

        }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password.')); // create the loginMessage and save it to session as flashdata

                if (user.mail_valid === 'True')
                    return done(null, user);
                else
                    return done(null, false, req.flash('loginMessage', 'You need to click the verification link in the email we sent you'));
            });

        }));

};