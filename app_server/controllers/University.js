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
        err.status = 401;
        res.redirect("/");
    }

};

module.exports.getUniversity = function (req, res) {
    university.find().exec(function (err, allUniversities) {
        console.log("length"+allUniversities.length)
            if (allUniversities) {
                res.render('University',
                    {
                        saarayUnis: allUniversities,
                        userID: req.session.userId
                    }
                );
            }
            else {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
        }
    );
}