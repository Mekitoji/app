module.exports = function(app) {
    app.get('/outdated', function(req, res) {
        if (req.user) {
            res.render('outdated.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        } else {
            res.render('outdated.ejs', {
                user: {
                    local: {
                        username: {
                            first: 'Login or ',
                            last: 'signup'
                        },
                        group: 'Guest'
                    }
                }
            });
        }
    });
};