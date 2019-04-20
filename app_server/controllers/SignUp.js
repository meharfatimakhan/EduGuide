var mongoose = require("mongoose");
var User = mongoose.model("User");
var bcrypt = require('bcryptjs');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.signUp = function (req, res) {
    res.render('SignUp');
}

module.exports.createAccount = function (req, res) {

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
        //console.log('Errors');
        res.render('SignUp',
            {
                errors: errors
            });
    }
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
                if (err) throw err;
                console.log(savedUser);
            });
        })
        req.flash('success', 'You are now successfully registered and can login!');
        res.location('/');
        res.redirect('/');
    }

};

module.exports.validatingUserName = function (req, res) {
    var input = req.param('val');
    console.log("Input is: " + input);

    User.find({ username: input }).exec(function (err, user) {
        console.log("CHECK...");
        if (err) {
            Console.log("Error in getting value!");
            res.json(null);
        } else if (!user || user === undefined || user.length <= 0) {
            //var err = new Error("User not found.");
            //err.status = 401;
            res.json(null);
        }
        else {
            console.log("Finding User: " + user);
            res.json(user);
        }
    })
}