
/* Dependencies */
var mongoose = require('mongoose'), 
    Event = require('../models/events.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial 
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var event = new Event(req.body);
  console.log(JSON.stringify(req.body));

  /* Then save the listing */
  event.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err); 
    } else {
      res.json(event);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.event);
};

/* Update a listing */
exports.update = function(req, res) {
  var event = req.event;

  /** TODO **/
  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
    // changing the articles properties
    event.name = req.body.name;
    event.address = req.body.address;
    event.eventTime = req.body.eventTime;

      event.save(function(err){
        if(err){
          console.log(err);
          res.status(400).send(err); // changing status to 404 and sending error message
        }
        else{
          //res.status(200).send(listing); // sending listing to be saved
          res.json(event);
        }
      });
};

/* Delete a listing */
exports.delete = function(req, res) {
  var event = req.event;

  /** TODO **/
  /* Remove the article */

  event.remove(function(err){ // finds the specific event that user wants to remove
    if(err){
      res.status(400).send(err); // sends error and error code
    }
    res.status(200);
    res.end(); // end response w/o data
  })
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  /** TODO **/
  /* Your code here */
  Event.find({}, function(err, event){
    if (err){
      res.status(400).send(err); // changing status to 404 and sending error message
    }
    res.status(200);
    res.json(event); // response with event in JSON format
  }).sort({eventTime:1}); // 1 is for ascending order
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.eventByID = function(req, res, next, id) {
  Event.findById(id).exec(function(err, event) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.event = event; // bind it to the request object as the property 'event'
      next();
    }
  });
};