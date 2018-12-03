var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Create your schema */
var eventSchema = new Schema({
  title: {
    type: String, 
    required: true
  }, 
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  longitude: Number,
  latitude: Number,
  location: String,
  creatorUsername: String,
  description: String,
  participantUsernames: [String],
  game: String,
  tags: String,
  fee: Number,
  stick: {
      type: Boolean,
      default: true,
  },

  created_at: Date,
  updated_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
eventSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Event = mongoose.model('Event', eventSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Event;
