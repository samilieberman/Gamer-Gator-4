var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    eventsRouter = require('../routes/events.server.routes'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash');

module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  app.use(express.static(__dirname + '/../../client'));

  //enable request logging for development debugging
  app.use(morgan('dev'));


  //Passport stuff

  require(path.resolve('./server/config/passport'))(passport);

  app.use(session({secret: 'secretkey', saveUninitialized: true, resave: true}));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());


  //body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));


  //Authentication routes
  require(path.resolve('./server/routes/users.server.routes.js'))(app, passport);

  app.use('/api/events', eventsRouter);

  return app;
};
