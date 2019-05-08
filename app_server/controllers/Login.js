var mongoose = require("mongoose");
var User = mongoose.model("User");
var universityDatabase = mongoose.model('Universities');

var sendJSONresponse = function (res, status, content) {
  res.status(status)
  res.json(content)
  return;
};

module.exports.loginCredentials = function (req, res) {
  console.log(JSON.stringify(req.headers));
  // "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0"
  if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
    sendJSONresponse(res, 200, {
      code: "200", message: "Log in page loaded!"
    });
  } else {
    res.render('Login');
  }
};

module.exports.loginCheck = function (req, res) {
  req.flash('success', 'You are now logged in!')
  res.redirect('/university');
};

module.exports.doLogIn = function (req, res) {

  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error("Wrong username or password.");
        err.status = 401;
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
          sendJSONresponse(res, 401, {
            code: "401", message: "Wrong username or password."
          });
        } else {
          res.render('error', { message: "Wrong username or password.", status: 401 });
        }
      } else {

        console.log(user);
        console.log(user.username);

        req.session.userId = user._id;
        req.session.userName = user.username;

        var UID = req.session.userId;
        module.exports = UID;

        var UNAME = req.session.userName;
        module.exports = UNAME;

        req.session.profilePic = user.profilePicture
        var UDP = req.session.profilePic;
        console.log("User session picture assigned: " + req.session.profilePic);
        module.exports = UDP;

        req.session.universityName = user.universityName;
        req.session.fullName = user.fullName;
        req.session.departmentName = user.departmentName;
        req.session.rollNumber = user.rollNumber;
        req.session.batch = user.batch;

        console.log("User session id assigned: " + req.session.userId);
        req.flash('Success!', 'You can login!');
        console.log("Logger's name: " + req.session.userName);

        universityDatabase.find().exec(function (err, allUniversities) {
          console.log("length" + allUniversities.length)
          if (allUniversities) {
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
              sendJSONresponse(res, 200, {
                code: "200", message: "Logged in.", token: req.session.userId, universities: allUniversities
              });
            } else {
              res.location('/university');
              res.redirect('/university');
            }
          }
          else {
            console.log(err);
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
              sendJSONresponse(res, 200, {
                code: "404", message: "Universities not found!"
              });
            } else {
              res.render('error', { message: "University not found!.", status: 404 });
              return;
            }
          }
        });
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
      sendJSONresponse(res, 400, {
        code: "400", message: "All Fields Required!"
      });
    } else {
      res.redirect("/");
      return;
    }
  }
};

module.exports.logout = function (req, res) {
  if (req.session) {
    console.log("Destroying session " + req.session.userId + " and " + req.session.userName);
    req.session.destroy(); // delete session object
    res.locals.user = undefined;
    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
      sendJSONresponse(res, 200, {
        code: "200", message: "Logged Out!"
      });
    } else {
      res.redirect("/");
      return;
    }
  }
};
