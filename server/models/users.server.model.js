/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

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

  generalUser: {
    type: Boolean,
    default: true
  },
  eventManager: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);


/* Export the model to make it avaiable to other parts of your Node application */
module.exports = User;
