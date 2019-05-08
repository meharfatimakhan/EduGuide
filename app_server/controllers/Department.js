var mongoose = require("mongoose");
var dept = mongoose.model("Departments");
var univ = mongoose.model("Universities");


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

module.exports.getDepartment = function (req, res) {
  if (req.params && req.params.universityid) {
    univ.find({ _id: req.params.universityid }).exec(function (err, currentUniv) {
      if (!currentUniv) {
        console.log('No such university found!');
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
          sendJSONresponse(res, 404, {
            code: "404", message: "University not found!", token: req.session.userId
          });
        } else {
          res.render('error', { message: "No university found!", status: 404 });
        }

      } else if (err) {
        console.log(err);
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
          sendJSONresponse(res, 404, {
            code: "404", message: "An error occured!", token: req.session.userId
          });
        } else {
          res.render('error', { message: "An error occured!", status: 404 });
        }
      }
      else{
      var result = currentUniv.map(a => a.departments)
      var uniNamee = currentUniv.map(a => a.universityName)
      var i;
      for (i = 0; i < result.length; i++) {
        dept.find({ _id: result[i] }).exec(function (err, univDept) {
          if (!univDept) {
            console.log('No such department found');
            // if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            //   sendJSONresponse(res, 404, {
            //     code: "404", message: "Department not found!", token: req.session.userId
            //   });
            // } else {
            //   res.render('error', { message: "No department found!", status: 404 });
            // }
          } else if (err) {
            console.log(err);
            // if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            //   sendJSONresponse(res, 404, {
            //     code: "404", message: "An error occured!", token: req.session.userId
            //   });
            // } else {
            //   res.render('error', { message: "An error occured!", status: 404 });
            // }
          }
          if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 200, {
              code: "200", message: "All courses loaded successfully!", token: req.session.userId,
              universityDepartments: univDept,
              uniName: uniNamee,
              uniID: req.params.universityid
            });
          } else {
            res.render("Department", {
              universityDepartments: univDept,
              uniName: uniNamee,
              userID: req.session.userId
            });
          }
        });
      }
    }
    });
  } else {
    console.log("No University Specified");
    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
      sendJSONresponse(res, 404, {
        code: "404", message: "No university specified!", token: req.session.userId
      });
    } else {
      res.render('error', { message: "No university specified!", status: 404 });
    }
  }
};