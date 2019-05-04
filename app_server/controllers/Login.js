var mongoose = require("mongoose");
var User = mongoose.model("User");

var sendJSONresponse = function (res, status, content) {
  res.status(status)
  res.json(content)
  return;
};

module.exports.loginCredentials = function (req, res) {
  res.render('Login');
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
        sendJSONresponse(res, 401, {
          code: "401", message: "Wrong username or password."
        });
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
      //  res.json({ username: 'Flavio' })
        req.flash('Success!', 'You can login!');
        // req.params.userName=req.session.userName;
        console.log("Logger's name: " + req.session.userName)
        //sendJSONresponse(res, 200, user);
        res.location('/university');
        res.redirect('/university');
      }
    });

  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    //res.json("All fields required.")

    res.redirect("/");
    //sendJSONresponse(res, 400, { code: "400", message: "All fields required." });
  }
};

module.exports.logout = function (req, res) {
  if (req.session) {
    console.log("Destroying session " + req.session.userId + " and " + req.session.userName);
    // delete session object
    req.session.destroy();
    res.locals.user = undefined;
    res.redirect("/");
  }
};
