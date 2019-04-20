var mongoose = require("mongoose");
var User = mongoose.model("User");

var bcrypt = require('bcryptjs');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.edit = function (req, res) {

    res.render('EditProfile', {
        displayPicture: "/images/" + req.session.profilePic,
        currentUser: req.session.userName,
        currentUniversity: req.session.universityName,
        currentName: req.session.fullName,
        currentDepartment: req.session.departmentName,
        currentRollNumber: req.session.rollNumber,
        currentBatch: req.session.batch,
        userID: req.session.userId
    })
}

module.exports.updateProfile = function (req, res) {
    if (!req.session.userId && !req.session) {
        sendJSONresponse(res, 404, {
            message: "Not found, userId is required"
        });
        return;
    }
    User.findById(req.session.userId)
        .exec(function (err, user) {
            if (!user) {
                sendJSONresponse(res, 404, {
                    message: "userid not found"
                });
                return;
            } else if (err) {
                sendJSONresponse(res, 400, err);
                return;
            }
            user.fullName = req.body.fullName;
            console.log(req.body.password1 + "password");
            user.rollNumber = req.body.rollNumber;
            user.universityName = req.body.universityName;
            user.batch = req.body.batch;
            user.departmentName = req.body.departmentName;
            //user.profilePicture = req.file.filename;
            console.log("fsd" + user)
            console.log(req.body.password1 + "asdfghj");

            //user.profilePicture = req.file.filename;
            req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);
            // req.session.profilePic = req.file.filename;


            if (req.file) {
                console.log('Uploading file..');
                user.profilePicture = req.file.filename;
                req.session.profilePic = req.file.filename;
            }
            else {
                user.profilePicture = req.session.profilePic;
            }

            var errors = req.validationErrors();
            if (errors) {
                //console.log('Errors');
                res.render('EditProfile',
                    {
                        errors: errors
                    });
            }
            else {
                if (req.body.password1.length > 0) {
                    user.password = req.body.password1;
                    bcrypt.hash(user.password, 10, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        console.log("encrypted=" + hash);
                        user.password = hash;

                        user.save(function (err, user) {
                            if (err) {

                                sendJSONresponse(res, 404, err);
                            } else {
                                req.session.universityName = user.universityName;
                                req.session.departmentName = user.departmentName;
                                req.session.rollNumber = user.rollNumber;
                                req.session.batch = user.batch;
                                req.session.fullName = user.fullName;
                                res.render("EditProfile", {
                                    displayPicture: "/images/" + user.profilePicture,
                                    currentUser: req.session.userName,
                                    currentName: req.body.fullName,
                                    currentDepartment: req.body.departmentName,
                                    currentRollNumber: req.body.rollNumber,
                                    currentUniversity: req.body.universityName,
                                    currentBatch: req.body.batch,
                                    userID: req.session.userId
                                });
                                //sendJSONresponse(res, 200, user);
                            }
                        });
                    })
                }
                else {
                    user.save(function (err, user) {
                        if (err) {

                            sendJSONresponse(res, 404, err);
                        } else {
                            req.session.universityName = user.universityName;
                            req.session.departmentName = user.departmentName;
                            req.session.rollNumber = user.rollNumber;
                            req.session.batch = user.batch;
                            req.session.fullName = user.fullName;
                            res.render("EditProfile", {
                                displayPicture: "/images/" + user.profilePicture,
                                currentUser: req.session.userName,
                                currentName: req.body.fullName,
                                currentDepartment: req.body.departmentName,
                                currentUniversity: req.body.universityName,
                                currentRollNumber: req.body.rollNumber,
                                currentBatch: req.body.batch,
                                userID: req.session.userId
                            });
                            //sendJSONresponse(res, 200, user);
                        }
                    });
                }

            }
        });

}

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

