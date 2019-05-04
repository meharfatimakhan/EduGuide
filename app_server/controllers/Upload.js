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
        err.status = 401;
        res.redirect("/");
    }
};

module.exports.uploadPage = function (req, res) {
    univ.find({ _id: req.session.universityName }).exec(function (err, allUnis) {
        dept.find({ _id: req.session.departmentName }).exec(function (err, allDepts) {
            subj.find({ department: req.session.departmentName }).exec(function (err, myCourse) {
                var nameOfUni = allUnis.map(a => a.universityName);
                var nameOfDept = allDepts.map(a => a.departmentName);
                console.log(nameOfUni + " " + nameOfDept)
                res.render('Upload', {
                    uploader: req.session.userName,
                    universityName: nameOfUni,
                    departmentName: nameOfDept,
                    saarayCourse: myCourse,
                    userID: req.session.userId
                });
            });
        });
    });
}

module.exports.docCreate = function (req, res) {
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
                console.log(err);
                return;
            } else {
                console.log("Created Document: " + created);
                console.log("cCOurse" + created.course)
                console.log("cID"+created._id)

                subj.findByIdAndUpdate(created.course, {
                    $push: { documents: created._id }
                },
                    { upsert: true },
                    function (err, updatedCourse) {
                        if (err) return res.status(500).send(err);
                        console.log("updated course: "+ updatedCourse)
                    }

                );
                res.redirect("/profile/" + req.session.userId);
            }
        }
    );
};
  

module.exports.getCourse = function (req, res) {
    var selecteddept = req.params.deptID;
    console.log(selecteddept + "Selected Department")
    subj.find({ department: selecteddept }).exec(function (err, myCourse) {
        if (err) {
            console.log("Error in getting value");
            return;
        } else if (!myCourse) {
            var err = new Error("Course not found.");
            err.status = 401;
            return;
        }
        else {
            console.log("Finding course: " + myCourse);
            res.json(myCourse);
        }
    })
};