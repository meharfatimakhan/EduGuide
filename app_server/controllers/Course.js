var mongoose = require("mongoose");
var dept = mongoose.model("Departments");
var univ = mongoose.model("Universities");
var subj = mongoose.model("Courses");

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

module.exports.getCourse = function (req, res) {
    if (req.params && req.params.universityid && req.params.departmentid) {
        univ.find({ _id: req.params.universityid }).exec(function (err, currentUniv) {
            if (!currentUniv) {
                console.log('No such university found!');
                sendJSONresponse(res, 404, {
                    message: "University not found!"
                });
                return;
            } else if (err) {
                //console.log(err);
                //    sendJSONresponse(res, 404, err);
                return;
            }
            // var result = currentUniv.map(a => a.departments)//gives departments in university
            // var i;
            // for (i = 0; i < result.length; i++) {
            dept.find({ _id: req.params.departmentid }).exec(function (err, univDept) {
                if (!univDept) {
                    console.log('no such univ found');
                    sendJSONresponse(res, 404, {
                        message: "Department not found!"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }             
                var result = univDept.map(a => a.courses)//gives courses in department
                var j;
                for (j = 0; j < result.length; j++) {
                    subj.find({ _id: result[j] }).exec(function (err, courseDept) {
                        if (!courseDept) {
                            console.log('no such course found');
                            sendJSONresponse(res, 404, {
                                message: "Course not found!"
                            });
                            return;
                        } else if (err) {
                            console.log(err);
                            sendJSONresponse(res, 404, err);
                            return;
                        }
                        res.render("Course", {
                            universityCourses: courseDept,
                            userID: req.session.userId,
                            uniID: req.params.universityid
                        });

                    })
                }

            });
            //  }

        });

    } else {
        console.log("No University Specified");
        sendJSONresponse(res, 404, {
            message: "No University Specified!"
        });
    }
};