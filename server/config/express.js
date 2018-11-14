const path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    eventsRouter = require('../routes/events.server.routes'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    flash = require('connect-flash');

module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);
  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended:false}));
  app.use(cookieParser());
  app.use(session({secret: 'secretkey', saveUninitialized: false, resave: false}));


  app.use('/', express.static(__dirname + '/../../client'));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  var User = require('../models/users.server.model');
  passport.use(new LocalStrategy(User.authenticate(),
      function(username, password, done){
      User.findOne({ 'local.username' : username}, function(err, user) {
        if(err) return done(err);
        if(!user) return done(null, false, {message: 'Invalid user!'});
        if(!user.validPassword(password)) return done(null, false, {message: 'Invalid password!'});
        return done(null, user);
      });
  }));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

    /**TODO
  Use the listings router for requests to the api */
  app.use('/api/events', eventsRouter);

    app.route('/register')
        .get(function(req,res) {
            res.sendFile(path.resolve('client/register.html'));
        })
        .post(function(req, res, next) {
            console.log('Registering user...');
            User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err){
                if(err){
                    console.log('Error registering user.', err);
                    return next(err);
                }
                console.log('User \''+req.body.username+'\' successfully registered.');

                //Registration success notification here?

                res.redirect('/');
            });
        });

    app.get('/login', function(req, res){
        res.sendFile(path.resolve('client/login.html'));
    });

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        badRequestMessage: 'Invalid username or password',
        failureFlash: true
    }), function(req, res) {
        res.redirect('/');
    });

    app.get('/checklogin', function(req, res){
      if(req.user)
        res.send(true);
      else
        res.send(false);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


  return app;
};
