var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res) {
  res.send('respond with a resource');
});*/
var User = require('../models/user').User;

router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/*router.get('/:username', function(req, res, next) {
    User.findOne({
        username: req.params.username
    }, function(err, users) {
        if (err) return next(err);
        res.json(users);
    });
});*/

module.exports = router;