//require our mongoose file with config
var mongoose = require('../libs/mongoose');

var crypto = require('crypto');

var Schema = mongoose.Schema;


//return value in lower case, useful for email
function toLower(v) {
    return v.toLowerCase();
}

//custom user schema
var user = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        first: {
            type: String,
            require: true
        },
        last: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        set: toLower
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
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
});

// Secure Hash Algorithm 1(sha1) used encrypt password
user.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

// Password virtual
user.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random().toString().slice(2);
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });


user.methods.checkPassword = function() {
    return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', user);