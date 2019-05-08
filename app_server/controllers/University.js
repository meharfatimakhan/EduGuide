var mongoose = require("mongoose");
var university = mongoose.model('Universities');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.checkLogin = function requiresLogin(req, res, next) {

    if (req.session && req.session.userId) {
        console.log("Session Active");
        console.log(req.session.userId);
        console.log(req.session.profilePic);
        next();
    } else {
        console.log("No Session Active");
        var err = new Error("You must be logged in to view this page.");
        err.status = 600;
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 600, {
                code: "600", message: "You must be logged in to view this page!"
            });
        } else {
            res.redirect("/");
        }
    }
};

module.exports.getUniversity = function (req, res) {
    university.find().exec(function (err, allUniversities) {
        console.log("length" + allUniversities.length)
        if (allUniversities) {
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                sendJSONresponse(res, 200, {
                    code: "200", message: "All Universities in Databases!", token: req.session.userId, universities: allUniversities
                });
            } else {
                res.render('University',
                    {
                        saarayUnis: allUniversities,
                        userID: req.session.userId
                    }
                );
            }
        }
        else {
            console.log(err);
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                sendJSONresponse(res, 404, {
                    code: "404", message: "No university found!"
                });
            } else {
                res.render('error', { message: "No university found!", status: 404 });
            }
        }
    });
}