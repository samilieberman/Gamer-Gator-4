var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/users.server.model');
var passport = require('passport');

module.exports = function(passport) {


    passport.serializeUser(function(user, done){ done(null, user);});

    passport.deserializeUser(function(user, done){ done(null,user);});


    passport.use('local-login', (new LocalStrategy(
        function(username, password, done){
            User.findOne({ username: username.toLowerCase() },
        function(err, user) {
                if(err) {
                    return done(err);
                }

                //If no user was found
                if(!user) {
                    return done(null, false, {message: 'Username not found!'});
                }

                //If user password was wrong
                if(!user.validPassword(password)){
                    return done(null, false, {message: 'Invalid password!'});
                }

                //If everything went well
                return done(null, user);
        })
        }
    )));


};