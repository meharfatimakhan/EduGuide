var mongoose = require("mongoose");
var User = mongoose.model("User");
var document = mongoose.model("Documents")
var dept = mongoose.model("Departments");
var univ = mongoose.model("Universities");
var subj = mongoose.model("Courses");
mongoose.set('useFindAndModify', false)

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
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 600, {
                code: "600", message: "You must be logged in to view this page!"
            });
        } else {
            res.redirect("/");
        }
    }
};

module.exports.uploadPage = function (req, res) {
    univ.find({ _id: req.session.universityName }).exec(function (err, allUnis) {
        if (allUnis) {
            dept.find({ _id: req.session.departmentName }).exec(function (err, allDepts) {
                if (allDepts) {
                    subj.find({ department: req.session.departmentName }).exec(function (err, myCourse) {
                        if (myCourse) {
                            var nameOfUni = allUnis.map(a => a.universityName);
                            var nameOfDept = allDepts.map(a => a.departmentName);
                            console.log(nameOfUni + " " + nameOfDept)
                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                sendJSONresponse(res, 200, {
                                    code: "200", message: "Page successfully rendered!", token: req.session.userId,
                                    uploader: req.session.userName,
                                    universityName: nameOfUni,
                                    departmentName: nameOfDept,
                                    saarayCourse: myCourse,
                                    userID: req.session.userId
                                });
                            }
                            else {
                                res.render('Upload', {
                                    uploader: req.session.userName,
                                    universityName: nameOfUni,
                                    departmentName: nameOfDept,
                                    saarayCourse: myCourse,
                                    userID: req.session.userId
                                });
                            }
                        }
                        else {
                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                sendJSONresponse(res, 404, {
                                    code: "404", message: "Course of user not found!"
                                });
                            } else {
                                res.render('error', { message: "Course of user not found!", status: 404 });
                            }
                        }
                    });
                }
                else {
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        sendJSONresponse(res, 404, {
                            code: "404", message: "Department of user not found!"
                        });
                    } else {
                        res.render('error', { message: "Department of user not found!", status: 404 });
                    }
                }
            });
        }
        else {
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                sendJSONresponse(res, 404, {
                    code: "404", message: "University of user not found!"
                });
            } else {
                res.render('error', { message: "University of user not found!", status: 404 });
            }
        }
    });
}

module.exports.docCreate = function (req, res) {
    if (req.body.type && req.body.documentName && req.file.filename) {
        document.create(
            {
                documentName: req.body.documentName,
                path: req.file.filename,
                type: req.body.type,
                uploader: req.session.userId,
                university: req.session.universityName,
                department: req.session.departmentName,
                course: req.body.courseName
            },
            function (err, created) {
                if (err) {
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        sendJSONresponse(res, 404, {
                            code: "404", message: "An error occured while creating the document!"
                        });
                    } else {
                        res.render('error', { message: "An error occured while creating the document!", status: 404 });
                    }
                } else {
                    console.log("Created Document: " + created);
                    console.log("cCOurse" + created.course)
                    console.log("cID" + created._id)

                    subj.findByIdAndUpdate(created.course, {
                        $push: { documents: created._id }
                    },
                        { upsert: true },
                        function (err, updatedCourse) {
                            if (err) {
                                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                    sendJSONresponse(res, 500, {
                                        code: "500", message: "An error occured while inserting the document in user!"
                                    });
                                } else {
                                    res.render('error', { message: "An error occured while inserting the document in user!", status: 500 });
                                }
                            }
                            else if (!updatedCourse){
                                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                    sendJSONresponse(res, 404, {
                                        code: "404", message: "Couldnt create the document!"
                                    });
                                } else {
                                    res.render('error', { message: "Couldnt create the document!", status: 404 });
                                }
                            }
                            else{
                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                sendJSONresponse(res, 200, {
                                    code: "200", message: "Updated course!", token: req.session.userId, createdDocument: created,
                                    course: updatedCourse
                                });
                            } else {
                                res.redirect("/profile/" + req.session.userId);
                            }
                        }
                        }

                    );

                }
            }
        );
    }
    else {
        var err = new Error("All fields required.");
        err.status = 400;
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            return res.json({ status: "400", type: true, message: "All Fields Required!" });
        }
        res.end();
    }
};


module.exports.getCourse = function (req, res) {
    var selecteddept = req.params.deptID;
    console.log(selecteddept + "Selected Department")
    subj.find({ department: selecteddept }).exec(function (err, myCourse) {
        if (err) {
            console.log("Error in getting value");
            res.json(null);
            return;
        } else if (!myCourse) {
            var err = new Error("Course not found.");
            err.status = 401;
            res.json("Course not found!")
            return;
        }
        else {
            console.log("Finding course: " + myCourse);
            res.json(myCourse);
        }
    })
};