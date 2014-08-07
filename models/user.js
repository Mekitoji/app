// load the things we need
var mongoose = require('../libs/mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

  local: {
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    group: {
      type: String,
      default: "user"
    },
    created: {
      type: Date,
      default: Date.now
    },
    username: {
      first: {
        type: String,
        require: true
      },
      last: {
        type: String,
        require: true
      }
    }
  }

});

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);