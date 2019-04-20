var mongoose = require("mongoose");


var universitySchema = new mongoose.Schema({
  universityName: { type: String, required: true },
  departments: { type: [String] },
  picture: { type: String },
  location: { type: String }
});


var university = mongoose.model("Universities", universitySchema);
module.exports = university;