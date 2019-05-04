var mongoose = require("mongoose");
var User = mongoose.model("User");
var university = mongoose.model('Universities');
var department = mongoose.model("Departments");
var document = mongoose.model("Documents")

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
  if (req.params && req.params.profileid) {
    User.findById(req.params.profileid).exec(function (err, myProfile) {
      if (!myProfile) {
        sendJSONresponse(res, 404, {
          message: "ProfileID not found!"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      university.find({ _id: myProfile.universityName }).exec(function (err, myUni) {
        console.log("length" + myUni.length)
        if (myUni) {
          department.find({ _id: myProfile.departmentName }).exec(function (err, myDept) {
            console.log("deptlength " + myDept.length)
            if (myDept) {

              document.find({ uploader: req.params.profileid }).exec(function (err, myUploads) {
                var nameOfUni = myUni.map(a => a.universityName);
                var nameOfDept = myDept.map(a => a.departmentName);
                console.log(nameOfUni + " " + nameOfDept);
                res.render('Profile', {
                  username: myProfile.username,
                  displayPicture: "/images/" + myProfile.profilePicture,
                  universityName: nameOfUni,
                  departmentName: nameOfDept,
                  batch: myProfile.batch,
                  rollNumber: myProfile.rollNumber,
                  fullName: myProfile.fullName,
                  userID: req.session.userId,
                  myUps:myUploads
                });
              });
            }

          });
        }
      });
    });
  } else {
    console.log("No Profileid specified");
    sendJSONresponse(res, 404, {
      message: "No Profileid in request"
    });
  }
};