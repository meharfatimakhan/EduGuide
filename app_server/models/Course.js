var mongoose = require("mongoose");


var courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  code: { type: String, required: true },
  department: { type: String },
  university: { type: String },
  quizzes: { type: [String] },
  assignments: { type: [String] },
  pastPapers: { type: [String] },
  picture: { type: String },
});

var course = mongoose.model("Courses", courseSchema);
module.exports = course;