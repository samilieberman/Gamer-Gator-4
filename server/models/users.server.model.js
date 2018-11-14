/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

/* Create your schema */
var UserSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  registeredEvents: [String],
  ownedEvents: [String],

  generalUser: Boolean,
  eventManager: Boolean,
  admin: Boolean,
});

UserSchema.plugin(passportLocalMongoose);


/* Export the model to make it avaiable to other parts of your Node application */
module.exports = mongoose.model('User', UserSchema);
