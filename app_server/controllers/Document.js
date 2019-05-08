var mongoose = require("mongoose");
var dept = mongoose.model("Departments");
var univ = mongoose.model("Universities");
var subj = mongoose.model("Courses");
var docs = mongoose.model("Documents");
var User = mongoose.model("User");

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

module.exports.getDocument = function (req, res) {
    if (req.params && req.params.universityid && req.params.departmentid && req.params.courseid) {
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
                    console.log('No such department found!');
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        sendJSONresponse(res, 404, {
                            code: "404", message: "Department not found!", token: req.session.userId
                        });
                    } else {
                        res.render('error', { message: "No department found!", status: 404 });
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
                subj.find({ _id: req.params.courseid }).exec(function (err, courseDept) {
                    if (!courseDept) {
                        console.log('No such course found!');
                        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            sendJSONresponse(res, 404, {
                                code: "404", message: "Course not found!", token: req.session.userId
                            });
                        } else {
                            res.render('error', { message: "No course found!", status: 404 });
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
                    var result = courseDept.map(a => a.documents)//gives documents in course
                    var j;
                    for (j = 0; j < result.length; j++) {
                        docs.find({ _id: result[j] }).exec(function (err, myDocs) {
                            if (!myDocs) {
                                console.log('No such document found!');
                                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                    sendJSONresponse(res, 404, {
                                        code: "404", message: "Document not found!", token: req.session.userId
                                    });
                                } else {
                                    res.render('error', { message: "No document found!", status: 404 });
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
                            var uploader = myDocs.map(a => a.uploader);
                            User.find({ _id: uploader }).exec(function (err, uploaderDetails) {
                                if (!uploaderDetails) {
                                    console.log('No such user found!');
                                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                        sendJSONresponse(res, 404, {
                                            code: "404", message: "User not found!", token: req.session.userId
                                        });
                                    } else {
                                        res.render('error', { message: "User not found!", status: 404 });
                                    }
                                    return;
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
                                var uploaderName = uploaderDetails.map(a => a.username);
                                var departName = univDept.map(a => a.departmentName)
                                var univName = currentUniv.map(a => a.universityName)
                                var cName = courseDept.map(a => a.courseName);
                                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                    sendJSONresponse(res, 200, {
                                        code: "200", message: "All documents loaded successfully!", token: req.session.userId,
                                        documents: myDocs,
                                        deptName: departName,
                                        uniName: univName,
                                        courseName: cName,
                                        name: uploaderName,
                                        departmentid: req.params.departmentid,
                                        courseid: req.params.courseid,
                                        uniID: req.params.universityid
                                    });
                                }
                                else {
                                    res.render("Document", {
                                        documents: myDocs,
                                        userID: req.session.userId,
                                        deptName: departName,
                                        uniName: univName,
                                        courseName: cName,
                                        name: uploaderName,
                                        departmentid: req.params.departmentid,
                                        courseid: req.params.courseid,
                                        uniID: req.params.universityid
                                    });
                                }
                            });
                        
                        })
                    }
                    }
                })
            }
            });
        }
        });
    } else {
        console.log("No University/Department/Course Specified");
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 404, {
                message: "No University/Department/Course Specified!", token: req.session.userId
            });
        }
        else {
            res.render('error', { message: "No University/Department/Course Specified!", status: 404 });
        }
    }
}


module.exports.getDocumentDetail = function (req, res) {
    if (req.params && req.params.documentID) {
        docs.findById(req.params.documentID).exec(function (err, myDoc) {
            if (!myDoc) {
                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                    sendJSONresponse(res, 404, {
                        code: "404", message: "Document not found!", token: req.session.userId
                    });
                } else {
                    res.render('error', { message: "No document found!", status: 404 });
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
            else {
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
                                            console.log("mydoc saving.." + myDoc._id)
                                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                                sendJSONresponse(res, 200, {
                                                    code: "200", message: "Document detail loaded!", token: req.session.userId,
                                                    uploader: userName,
                                                    uploaderID: myDoc.uploader,
                                                    documentName: myDoc.documentName,
                                                    type: myDoc.type,
                                                    docID: myDoc._id,
                                                    courseName: nameOfCourse,
                                                    path: "/images/" + myDoc.path,
                                                    universityName: nameOfUni,
                                                    departmentName: nameOfDept
                                                });
                                            } else {
                                                res.render('DocumentDetail', {
                                                    uploader: userName,
                                                    uploaderID: myDoc.uploader,
                                                    documentName: myDoc.documentName,
                                                    type: myDoc.type,
                                                    docID: myDoc._id,
                                                    courseName: nameOfCourse,
                                                    path: "/images/" + myDoc.path,
                                                    universityName: nameOfUni,
                                                    departmentName: nameOfDept,
                                                    userID: req.session.userId
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {
        console.log("No documentid specified");
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 404, {
                code: "404",
                message: "Document not found!", token: req.session.userId
            });
        }
        else {
            res.render('error', { message: "Document not found!", status: 404 });
        }
    }
}

module.exports.saveDocument = function (req, res) {
    console.log("Finding document details", req.params);
    console.log("my document id" + req.params.documentID)
    if (req.params && req.params.documentID) {
        docs.find({ _id: req.params.documentID }).exec(function (err, doc) {
            if (!doc) {
                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                    sendJSONresponse(res, 404, {
                        code: "404", message: "Document not found!", token: req.session.userId
                    });
                } else {
                    res.render('error', { message: "Document not found!", status: 404 });
                }
            }
            else {
                User.findByIdAndUpdate(req.session.userId, {
                    $push: { savedDocuments: req.params.documentID }
                },
                    { upsert: true },
                    function (err, location) {
                        if (err) {
                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                sendJSONresponse(res, 500, {
                                    code: "500", message: "Error in saving!", token: req.session.userId
                                });
                            } else {
                                res.render('error', { message: "Error in saving!", status: 500 });
                            }
                        }
                        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            sendJSONresponse(res, 200, {
                                code: "200", message: "Document saved!", token: req.session.userId, document: req.params.documentID
                            });
                        } else {
                            res.redirect("/saved");
                        }
                    }

                );
            }
        });
    }
    else {
        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
            sendJSONresponse(res, 404, {
                code: "404", message: "Saving Doc Failed!", token: req.session.userId
            });
        }
        else {
            res.render('error', { message: "Saving Doc Failed!", status: 404 });
        }
    }
};

module.exports.getSavedDocument = function (req, res) {
    User.find({ _id: req.session.userId }).exec(function (err, me) {
        if (me) {
            var result = me.map(a => a.savedDocuments)//gives saved documents of users
            console.log(result);
            var j;
            for (j = 0; j < result.length; j++) {
                console.log(result[j]);
                docs.find({ _id: result[j] }).exec(function (err, docDetails) {
                    console.log("show det" + docDetails)
                    if (!docDetails) {
                        console.log('No document found!');
                        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            sendJSONresponse(res, 404, {
                                code: "404",
                                message: "Documents not found!"
                            });
                        }
                        else {
                            res.render('error', { message: "Document not found!", status: 404 });
                        }
                    } else if (err) {
                        console.log(err);
                        // if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                        //     sendJSONresponse(res, 404, {
                        //         code: "404",
                        //         message: "An error occured!", token: req.session.userId
                        //     });
                        // }
                        // else {
                        //     res.render('error', { message: "An error occured!", status: 404 });
                        // }
                    }
                    else {
                        console.log(docDetails)

                        if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                            sendJSONresponse(res, 200, {
                                code: "200", message: "Document loaded successfully!", token: req.session.userId,
                                saved: docDetails
                            });
                        }
                        else {
                            res.render('SavedDocuments', {
                                saved: docDetails,
                                userID: req.session.userId,
                            });
                        }
                    }
                });
            }
        }
    });
};