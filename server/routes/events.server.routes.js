/* Dependencies */
var path = require('path');
var express = require('express');
var router = express.Router();
var events = require('../controllers/events.server.controller.js');
var users = require('../controllers/users.server.controller.js');
var User = require('../models/users.server.model.js');
var passport = require('passport');

/* 
  These method calls are responsible for routing requests to the correct request handler.
  Take note that it is possible for different controller functions to handle requests to the same route.
 */
router.route('/')
  .get(events.list)
  .post(events.create);

/*
  The ':' specifies a URL parameter. 
 */
router.route('/:eventId')
  .get(events.read)
  .put(events.update)
  .delete(events.delete);


/*
  The 'router.param' method allows us to specify middleware we would like to use to handle 
  requests with a parameter.

  Say we make an example request to '/events/566372f4d11de3498e2941c9'

  The request handler will first find the specific listing using this 'listingsById' 
  middleware function by doing a lookup to ID '566372f4d11de3498e2941c9' in the Mongo database, 
  and bind this listing to the request object.

  It will then pass control to the routing function specified above, where it will either 
  get, update, or delete that specific event (depending on the HTTP verb specified)
 */
router.param('eventId', events.eventByID);

module.exports = router;