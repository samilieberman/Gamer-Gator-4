var express = require('express');
var router = require('express').Router();
var path = require('path');
var User = require('../models/users.server.model.js');
var passport = require('passport');

module.exports = function(app, passport) {

    app.get('/register', function (req, res) {
        res.sendFile(path.resolve('client/register.html'));
    });

    app.post('/register', function (req, res, next) {
        console.log('Registering new user...');

        User.findOne({
            username: req.body.username
        }, function(err, user){
            if(user) { res.json(null); return;}
            else {

                var newUser = new User();

                newUser.username = req.body.username.toLowerCase();
                newUser.password = newUser.generateHash(req.body.password);

                newUser.save(function(err, user){
                    req.login(user, function(err) {
                        if (err) {
                            return next(err);
                        }
                        res.json(user);
                    });
                });
            }
        });
    });

    app.get('/login', function (req, res) {
        res.sendFile(path.resolve('client/login.html'));
    });

    app.post('/login', passport.authenticate('local-login', {passReqToCallback: true}), function (req, res) {
        res.json(req.user);
    });

    app.get('/loggedin', function (req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/logout', function (req, res) {
        req.logout();
        res.send(200);
    });
};