var mongoose = require("mongoose");
var university = mongoose.model('Universities');

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

module.exports.check = function (req, res) {
    res.render("restlist");
    university.find().exec(function (err, loc) {
        if (loc.length == 0) {
            // sendJSONresponse(res, 404, {
            //   message: "locations not found"
            // });
            // return;
            university.create(
                [
                    {
                        _id: "1",
                        universityName: "FAST-NUCES",
                        departments: ["111", "112"],
                        picture: "FAST.jpg",
                        location: "Lahore, Pakistan"
                    },
                    {
                        _id: "2",
                        universityName: "LUMS",
                        departments: ["211"],
                        picture: "LUMS.jpg",
                        location: "Lahore, Pakistan"
                    },
                    {
                        _id: "3",
                        universityName: "PUNJAB UNIVERSITY",
                        departments: ["311"],
                        picture: "PU.jpg",
                        location: "Lahore, Pakistan"
                    },
                    {
                        _id: "4",
                        universityName: "LAHORE SCHOOL OF ECONOMICS",
                        departments: ["411"],
                        picture: "LSE.jpg",
                        location: "Lahore, Pakistan"
                    }
                ],
                function (error, locs) {
                    if (error) {
                        sendJSONresponse(res, 400, err);
                    } else {
                        locations = locs;
                        sendJSONresponse(res, 200, locations);
                    }
                }
            );
        } else if (locations) sendJSONresponse(res, 200, locations);
        else if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
        }
    });
};

module.exports.viewAll = function (req, res) {
    university.find().exec(function (err, allUniversities) {
        console.log("length"+allUniversities.length)
        // if (allUniversities.length == 0) {
        //     university.create(
        //         [
        //             {
        //                universityName: "FAST-NUCES",
        //                 departments: ["111", "112"],
        //                 picture: "FAST.jpg",
        //                 location: "Lahore, Pakistan"
        //             },
        //             {
                       
        //                 universityName: "LUMS",
        //                 departments: ["211"],
        //                 picture: "LUMS.jpg",
        //                 location: "Lahore, Pakistan"
        //             },
        //             {
                        
        //                 universityName: "PUNJAB UNIVERSITY",
        //                 departments: ["311"],
        //                 picture: "PU.jpg",
        //                 location: "Lahore, Pakistan"
        //             },
        //             {
        //                 universityName: "LAHORE SCHOOL OF ECONOMICS",
        //                 departments: ["411"],
        //                 picture: "LSE.jpg",
        //                 location: "Lahore, Pakistan"
        //             }
        //         ]
          //  );
            if (allUniversities) {
                res.render('University',

                    {
                        saarayUnis: allUniversities,
                        userID: req.session.userId
                    }
                );

            }
            else {
                console.log(err);
                sendJSONresponse(res, 404, err);
                return;
            }
        }
    );
}