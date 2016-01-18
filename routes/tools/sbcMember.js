var sbcMember = require('../../models/sbcMember');
var routesFunction = require('../../libs/routesFunction');

module.exports = function(app) {
  app.get('/tools/sbcmember', routesFunction.checkPermission, function(req, res) {
    res.render('members.ejs', {
      user: req.user
    });
  });

  app.get('/tools/sbcmember/getall', function(req, res) {
    sbcMember.all(function(err, data) {
      if(err) return res.send(err).status(500);
      return res.json(data).status(200);
    });
  });

  app.post('/tools/sbcmember', function(req, res) {
    var name = req.body.name;
    var mail = req.body.mail;
    sbcMember.add(name, mail, function(err, members) {
      if(err) {
        console.error(err);
        return res.json(err).status(500);
      }
      console.log(members);
      res.status(200).end();
    });
  });


  app.delete('/tools/sbcmember/:id', function(req, res) {
    var id = req.params.id;

    sbcMember.findByIdAndRemove(id, function(err) {
      if(err) return res.send(err).status(500);
      return res.send().status(200);
    });

  });

  app.put('/tools/sbcmember/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var mail = req.body.mail;
    sbcMember.findByIdAndUpdate(id, {
      name: name,
      mail: mail
    }, function(err) {
      if(err) return res.send(err).status(500);
      return res.send().status(200);
    })
  });

}
