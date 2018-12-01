//var localStrategy = require('passport-local').Strategy;
//This file holds any configuration variables we may need
//'config.js' is ignored by git to protect sensitive information, such as your database's username and password
//copy this file's contents to another file 'config.js' and store your MongoLab uri there

module.exports={
    db: {
      //uri: 'mongodb://admin:passw0rd@ds033037.mlab.com:33037/gamergatorusers', //place the URI of your mongo database here.
      uri: 'mongodb://CEN3031:CEN3031TA@ds137862.mlab.com:37862/gamergator4',
    },
    port: 8080
  };
