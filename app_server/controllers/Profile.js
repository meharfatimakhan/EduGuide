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

module.exports.viewProfile = function (req, res) {
  console.log("Finding profile details", req.params);
  console.log("my profile id" + req.params.profileid)
  if (req.params && req.params.profileid) {
    User.findById(req.params.profileid).exec(function (err, myProfile) {
      if (!myProfile) {
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
          sendJSONresponse(res, 404, {
            code: "404", message: "Profile id not found!"
          });
        } else {
          res.render('error', { message: "Profile id not found!", status: 404 });
        }
      } else if (err) {
        console.log(err);
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
          sendJSONresponse(res, 404, {
            code: "404", message: "An error occured!"
          });
        } else {
          res.render('error', { message: "An error occured!", status: 404 });
        }
      }
      university.find({ _id: myProfile.universityName }).exec(function (err, myUni) {
        console.log("length" + myUni.length)
        if (myUni) {
          department.find({ _id: myProfile.departmentName }).exec(function (err, myDept) {
            console.log("deptlength " + myDept.length)
            if (myDept) {

              document.find({ uploader: req.params.profileid }).exec(function (err, myUploads) {
                if (!myUploads) {
                  if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                    sendJSONresponse(res, 404, {
                      code: "404", message: "No such document with such user!"
                    });
                  } else {
                    res.render('error', { message: "No such document with such user!", status: 404 });
                  }
                }
                var nameOfUni = myUni.map(a => a.universityName);
                var nameOfDept = myDept.map(a => a.departmentName);
                console.log(nameOfUni + " " + nameOfDept);
                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                  sendJSONresponse(res, 200, {
                    code: "200", message: "Profile successfully loaded!", token: req.session.userId, username: myProfile.username,
                    displayPicture: "/images/" + myProfile.profilePicture,
                    universityName: nameOfUni,
                    departmentName: nameOfDept,
                    batch: myProfile.batch,
                    rollNumber: myProfile.rollNumber,
                    fullName: myProfile.fullName,
                    userID: req.session.userId,
                    myUps: myUploads
                  });
                } else {
                  res.render('Profile', {
                    username: myProfile.username,
                    displayPicture: "/images/" + myProfile.profilePicture,
                    universityName: nameOfUni,
                    departmentName: nameOfDept,
                    batch: myProfile.batch,
                    rollNumber: myProfile.rollNumber,
                    fullName: myProfile.fullName,
                    userID: req.session.userId,
                    myUps: myUploads
                  });
                }
              });
            }
            else {
              if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                sendJSONresponse(res, 404, {
                  code: "404", message: "User's Department not found!"
                });
              } else {
                res.render('error', { message: "User's department not found!", status: 404 });
              }
            }
          });
        }
        else {
          if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 404, {
              code: "404", message: "User's university not found!"
            });
          } else {
            res.render('error', { message: "User's university not found!", status: 404 });
          }
        }
      });
    });
  } else {
    console.log("No Profileid specified");
    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
      sendJSONresponse(res, 404, {
        code: "404", message: "Profile id not found!"
      });
    } else {
      res.render('error', { message: "Profile id not found!", status: 404 });
    }
  }
};