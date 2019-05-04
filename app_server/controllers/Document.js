var mongoose = require("mongoose");
var dept = mongoose.model("Departments");
var univ = mongoose.model("Universities");
var subj = mongoose.model("Courses");
var docs = mongoose.model("Documents");
var User = mongoose.model("User");


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

module.exports.getDocument = function (req, res) {
    if (req.params && req.params.universityid && req.params.departmentid && req.params.courseid) {
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
            dept.find({ _id: req.params.departmentid }).exec(function (err, univDept) {
                if (!univDept) {
                    console.log('No such department found!');
                    sendJSONresponse(res, 404, {
                        message: "Department not found!"
                    });
                    return;
                } else if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                    return;
                }
                subj.find({ _id: req.params.courseid }).exec(function (err, courseDept) {
                    if (!courseDept) {
                        console.log('No such course found!');
                        sendJSONresponse(res, 404, {
                            message: "Course not found!"
                        });
                        return;
                    } else if (err) {
                        console.log(err);
                        sendJSONresponse(res, 404, err);
                        return;
                    }
                    var result = courseDept.map(a => a.documents)//gives documents in course
                    var j;
                    for (j = 0; j < result.length; j++) {
                        docs.find({ _id: result[j] }).exec(function (err, myDocs) {
                            if (!myDocs) {
                                console.log('No such document found!');
                                sendJSONresponse(res, 404, {
                                    message: "Document not found!"
                                });
                                return;
                            } else if (err) {
                                console.log(err);
                                sendJSONresponse(res, 404, err);
                                return;
                            }
                            res.render("Document", {
                                documents: myDocs,
                                userID: req.session.userId,
                                departmentid: req.params.departmentid,
                                courseid: req.params.courseid,
                                uniID: req.params.universityid
                            });
                        })
                    }
                })
            });
        });
    } else {
        console.log("No University/Department/Course Specified");
        sendJSONresponse(res, 404, {
            message: "No University/Department/Course Specified!"
        });
    }
};

module.exports.getDocumentDetail = function (req, res) {
    if (req.params && req.params.documentID) {
        docs.findById(req.params.documentID).exec(function (err, myDoc) {
            if (!myDoc) {
                sendJSONresponse(res, 404, {
                    message: "DocumentID not found!"
                });
                return;
            } else if (err) {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
            univ.find({ _id: myDoc.university }).exec(function (err, myUni) {
                console.log("length" + myUni.length)
                if (myUni) {
                    dept.find({ _id: myDoc.department }).exec(function (err, myDept) {
                        console.log("deptlength " + myDept.length)
                        if (myDept) {
                            subj.find({ _id: myDoc.course }).exec(function (err, myCourse) {
                                if (myCourse) {
                                    User.find({ _id: myDoc.uploader }).exec(function (err, uploaderUser) {
                                        var nameOfUni = myUni.map(a => a.universityName);
                                        var nameOfDept = myDept.map(a => a.departmentName);
                                        var nameOfCourse = myCourse.map(a => a.courseName);
                                        var userName = uploaderUser.map(a => a.username);
                                        console.log(nameOfUni + " " + nameOfDept);
                                        res.render('DocumentDetail', {
                                            uploader: userName,
                                            uploaderID: myDoc.uploader,
                                            documentName: myDoc.documentName,
                                            type: myDoc.type,
                                            courseName: nameOfCourse,
                                            path: "/images/" + myDoc.path,
                                            universityName: nameOfUni,
                                            departmentName: nameOfDept,
                                            userID: req.session.userId
                                        });
                                    });
                                }
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
}