// load the things we need
var mongoose = require('../libs/mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  localStorage: {
    name: {
      first: {
        type: String,
        required: true
      },
      last: {
        type: String,
        required: true
      }
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    group: {
      type: String,
      default: "user"
    },
    created: {
      type: Date,
      default: Date.now
    }
  }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);