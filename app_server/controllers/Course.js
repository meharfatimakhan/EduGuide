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

module.exports.getCourse = function (req, res) {
    if (req.params && req.params.universityid && req.params.departmentid) {
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
                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                    sendJSONresponse(res, 404, {
                        code: "404", message: "An error occured!", token: req.session.userId
                    });
                } else {
                    res.render('error', { message: "An error occured!", status: 404 });
                }
            }
            else{
            dept.find({ _id: req.params.departmentid }).exec(function (err, univDept) {
                if (!univDept) {
                    console.log('no such department found');
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        sendJSONresponse(res, 404, {
                            code: "404", message: "Department not found!", token: req.session.userId
                        });
                    } else {
                        res.render('error', { message: "No department found!", status: 404 });
                    }
                } else if (err) {
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        sendJSONresponse(res, 404, {
                            code: "404", message: "An error occured!", token: req.session.userId
                        });
                    } else {
                        res.render('error', { message: "An error occured!", status: 404 });
                    }
                }
                else{
                var result = univDept.map(a => a.courses)//gives courses in department
                var j;
                for (j = 0; j < result.length; j++) {
                    subj.find({ _id: result[j] }).exec(function (err, courseDept) {
                        if (!courseDept) {
                            console.log('no such course found');
                            // if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            //     sendJSONresponse(res, 404, {
                            //         code: "404", message: "Course not found!", token: req.session.userId
                            //     });
                            // } else {
                            //     res.render('error', { message: "No course found!", status: 404 });
                            // }
                        } else if (err) {
                            console.log(err);
                            // if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            //     sendJSONresponse(res, 404, {
                            //         code: "404", message: "An error occured!", token: req.session.userId
                            //     });
                            // } else {
                            //     res.render('error', { message: "An error occured!", status: 404 });
                            // }
                        }
                        var departName = univDept.map(a => a.departmentName)
                        var univName = currentUniv.map(a => a.universityName)
                        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            sendJSONresponse(res, 200, {
                                code: "200", message: "All courses loaded successfully!", token: req.session.userId,
                                universityCourses:courseDept,
                                deptName:departName,
                                uniName:univName,
                                uniID:req.params.universityid
                            });
                        } else {
                            res.render("Course", {
                                universityCourses: courseDept,
                                userID: req.session.userId,
                                deptName: departName,
                                uniName: univName,
                                uniID: req.params.universityid
                            });
                        }
                    })
                }
            }
            });
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