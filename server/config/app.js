var config = require('./config'),
    mongoose = require('mongoose'),
    express = require('./express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost//loginapp');
//var db = mongoose.connection();﻿

module.exports.start = function() {
  var app = express.init();
  app.listen(process.env.PORT || config.port, function() {
    console.log('App listening on port');
  });
};
