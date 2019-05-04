var mongoose = require("mongoose");
var bcrypt = require("bcrypt");


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String
  },
  universityName: {
    type: String
  },
  departmentName: {
    type: String
  },
  rollNumber: {
    type: String
  },
  batch: {
    type: String
  },
  profilePicture: {
    type: String
  },
  savedDocuments: { type: [String] }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
  console.log(username);
  console.log(password);
  User.findOne({ username: username }).exec(function (err, user) {
    if (err) {
      console.log("Error in authentication!");
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found!");
      err.status = 401;
      return callback(err);
    }

    console.log(user.password);
    console.log(password);
    bcrypt.compare(password, user.password, function (err, result) {
      console.log(result);
      if (result === true) {
        return callback(null, user);
      } else {
        console.log("WRONG PASSWORD!");
        return callback();
      }
    });
  });
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
