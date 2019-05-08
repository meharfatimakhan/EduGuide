var mongoose = require("mongoose");
var User = mongoose.model("User");
var university = mongoose.model('Universities');
var dept = mongoose.model("Departments");
var bcrypt = require('bcryptjs');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    return res.json(content);
};

module.exports.signUp = function (req, res) {
    university.find().exec(function (err, allUniversities) {
        console.log("length" + allUniversities.length)
        if (allUniversities) {
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {

                return res.json({ status: "200", type: true, message: "Sign Up page rendered!" });
            }
            else {
                res.render('SignUp',
                    {
                        saarayUnis: allUniversities
                    }
                );
            }
        }
        else {
            console.log(err);
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                return res.json({ status: "404", type: false, message: "Universities for selection not found!" });
            } else {
                res.render('error', { message: "Universities for selection not found!", status: 404 });
            }
        }
    });
}

module.exports.createAccount = function (req, res) {

    if (req.body.username && req.body.password && req.body.confirmPassword && req.body.universityName && req.body.rollNumber && req.body.departmentName && req.body.fullName && req.body.batch) {
        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

        var fullName = req.body.fullName;
        var departmentName = req.body.departmentName;
        var universityName = req.body.universityName;
        var rollNumber = req.body.rollNumber;
        var batch = req.body.batch;
        var profilePicture;


        console.log("Username:" + " " + username);
        console.log("Password:" + " " + password);
        console.log("Confirm Password:" + " " + confirmPassword);
        console.log("Full Name:" + " " + fullName);
        console.log("University Name:" + " " + universityName)
        console.log("Department Name:" + " " + departmentName)
        console.log("Roll Number:" + " " + rollNumber);
        console.log("Batch:" + " " + batch);
        console.log("Profile Picture:" + " " + req.file);


        if (req.file) {
            console.log('Uploading file..');
            profilePicture = req.file.filename;
        }
        else {
            console.log('No file uploaded..');
            profilePicture = "blankProfile.png";
        }
        req.checkBody('username', 'Username field is required.').notEmpty();
        req.checkBody('fullName', 'Full Name field is required.').notEmpty();
        req.checkBody('universityName', 'University Name field is required.').notEmpty();
        req.checkBody('departmentName', 'Department Name field is required.').notEmpty();
        req.checkBody('rollNumber', 'Roll Number field is required.').notEmpty();
        req.checkBody('batch', 'Batch field is required').notEmpty();
        req.checkBody('password', 'Password field is required.').notEmpty();
        req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);
        req.checkBody('password', 'Password must be atleast 5 characters long!').isLength({ min: 5, max: 25 });

        var errors = req.validationErrors();
        if (errors) {
            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                res.json({ status: "404", type: false, errors: errors });

            }
            else {
                res.render('SignUp', { error: errors });

            }

        }
        else {
            User.find({ username: req.body.username }).exec(function (err, userr) {
                // User.find({ universityName: req.body.universityName, batch: req.body.batch, rollNumber: req.body.rollNumber }).exec(function (err, userr) {
                if (userr.username===req.body.username) {
                    if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {

                        return res.json({ status: "300", type: false, message: "User exists!" });
                    }
                    else {
                        return res.render('error', { message: "User exists!", status: 300 });

                    }
                }

                // else if (userr) {
                //     if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                //         return res.json({ status: "301", type: false, message: "Same batch and roll number exists for the selected university!" });
                //     }
                //     else {
                //         res.render('error', { message: "Same batch and roll number exists for the selected university!", code: "301" })
                //     }
                // }
                else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = password;
                    newUser.fullName = fullName;
                    newUser.universityName = universityName;
                    newUser.profilePicture = profilePicture;
                    newUser.departmentName = departmentName;
                    newUser.rollNumber = rollNumber;
                    newUser.batch = batch;

                    console.log("NEWUSER AFTER SIGNUP: " + newUser);

                    bcrypt.hash(newUser.password, 10, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        console.log("Encrypted Password: " + hash);
                        newUser.password = hash;
                        newUser.save(function (err, savedUser) {
                            if (err) {
                                if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                    return res.json({ status: "401", type: false, message: "User exists!" });
                                }
                                else {
                                    return res.render('error', { message: "Error in saving.", status: 401 });
                                }

                            }

                            console.log(savedUser);
                            if (req.header('user-agent') == 'PostmanRuntime/7.11.0') {
                                return res.json({ status: "200", type: true, message: "Successfully saved user!", token: savedUser._id });

                            }
                            else {
                                req.flash('success', 'You are now successfully registered and can login!');
                                res.location('/');
                                res.redirect('/');
                            }

                        });

                    })
                }
                //  })
            })

        }

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

module.exports.validatingUserName = function (req, res) {
    var input = req.param('val');
    console.log("Input is: " + input);

    User.find({ username: input }).exec(function (err, user) {
        console.log("CHECK...");
        if (err) {
            console.log("Error in getting value!");
            res.json(null);
            return;
        } else if (!user || user === undefined || user.length <= 0) {
            //var err = new Error("User not found.");
            //err.status = 401;
            console.log("Not found! Take it!")
            res.json(null);
            return;
        }
        console.log("Finding User: " + user);
        res.json(user);

    })


}

module.exports.displayDept = function (req, res) {
    console.log(req.session.userName);
    dept.find({ departmentName: req.params.deptName }).exec(function (err, myDept) {
        if (err) {
            console.log("Error in getting value");
            res.json(null);
            return;
        } else if (!myDept) {
            var err = new Error("Dept not found.");
            err.status = 401;
            res.json("Department not found");
            return;
        }
        else {
            console.log("Finding department" + myDept);
            res.json(myDept);
        }
    })
}

module.exports.getDepartment = function (req, res) {
    var selecteduni = req.params.uniID;
    console.log(selecteduni + "Selected University")
    dept.find({ university: selecteduni }).exec(function (err, myDept) {
        if (err) {
            console.log("Error in getting value");
            res.json(null);
            return;
        } else if (!myDept) {
            var err = new Error("Dept not found.");
            err.status = 401;
            res.json("Department not found");
            return;
        }
        else {
            console.log("Finding department: " + myDept);
            res.json(myDept);
        }
    });
}

