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
        err.status = 401;
        res.redirect("/");
    }
};

module.exports.getDepartment = function (req, res) {
    if (req.params && req.params.universityid) {
      univ.find({ _id: req.params.universityid}).exec(function (err, currentUniv) {
        if (!currentUniv) {
          console.log('No such university found!');
          sendJSONresponse(res, 404, {
            message: "University not found!"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        var result=currentUniv.map(a => a.departments)
        var i;
        for (i = 0; i < result.length; i++) {
        dept.find({ _id: result[i] }).exec(function (err, univDept) {
          if (!univDept) {
            console.log('no such department found');
            sendJSONresponse(res, 404, {
              message: "univ not found"
            });
            return;
          } else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          res.render("Department", {
              universityDepartments:univDept,
              userID:req.session.userId
            }
      );

          });}
        });
    } else {
      console.log("No University Specified");
      sendJSONresponse(res, 404, {
        message: "No University Specified!"
      });
    }
  };