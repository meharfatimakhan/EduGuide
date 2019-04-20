var mongoose = require("mongoose");
var User = mongoose.model("User");

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.checkLogin = function requiresLogin(req, res, next) {

    if (req.session && req.session.userId) {
        console.log("Session Active");
        console.log(req.session.userId);
        console.log(req.session.profilePic);
        console.log(req.session);
        next();
    } else {
        console.log("No Session Active");
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        res.redirect("/");
    }

};

module.exports.viewProfile = function (req, res) {
    console.log("Finding profile details", req.params);
    console.log("my profile id" + req.params.profileid)
    if (req.session && req.session.userId) {
      User.findById(req.session.userId).exec(function (err, myProfile) {
        if (!myProfile) {
          sendJSONresponse(res, 404, {
            message: "profileid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }

        res.render('Profile');
        
      });
    } else {
      console.log("No profileid specified");
      sendJSONresponse(res, 404, {
        message: "No profileid in request"
      });
    }
  };

  module.exports.viewProfile = function (req, res) {
    console.log("Finding profile details", req.params);
    console.log("my profile id" + req.params.profileid)
    if (req.params && req.params.profileid) {
      User.findById(req.params.profileid).exec(function (err, myProfile) {
        if (!myProfile) {
          sendJSONresponse(res, 404, {
            message: "profileid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }

        res.render('Profile', {
            username: myProfile.username,
            displayPicture: myProfile.profilePicture,
            universityName: myProfile.universityName,
            departmentName: myProfile.departmentName,
            batch:myProfile.batch,
            rollNumber:myProfile.rollNumber,
            fullName:myProfile.fullName,
            userID:req.session.userId,
          });
        
      });
    } else {
      console.log("No profileid specified");
      sendJSONresponse(res, 404, {
        message: "No profileid in request"
      });
    }
  };