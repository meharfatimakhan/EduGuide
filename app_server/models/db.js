var mongoose = require("mongoose");

//var dbURI = "mongodb://localhost:27017/EduGuide";
var dbURI="mongodb://meharfatima:12345678w@ds211504.mlab.com:11504/eduguide";

if (process.env.NODE_ENV === "production") {
    dbURI="mongodb://meharfatima:12345678w@ds211504.mlab.com:11504/eduguide";
    //mongodb://<dbuser>:<dbpassword>@ds211504.mlab.com:11504/eduguide
}
mongoose.connect(
    dbURI,
    { useNewUrlParser: true }
);

//connecting
// var dbURI= "mongodb://localhost:27017/EduGuide";
// mongoose.connect(dbURI,{useNewUrlParser: true }); 

mongoose.connection.on("connected", function () {
    console.log('Mongoose connected to ' + dbURI);
})

mongoose.connection.on("error", function () {
    console.log('Mongoose connection error ' + console.error());

})

mongoose.connection.on("disconnected", function () {
    console.log('Mongoose disconnected from ' + dbURI);
})


//disconnecting
var gracefulShutdown = function (msg, callback) {

    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through' + msg);
        callback();
    })
}

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, "SIGUSR2");
    })
})

process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    })
})


process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    })
})

require('./Users');
require('./University');
require('./Department');
require('./Course');
require('./Document')