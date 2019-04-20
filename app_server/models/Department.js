var mongoose = require("mongoose");


var departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  code: { type: String, required: true },
  courses: { type: [String] },
  picture: { type: String },
  university: { type: String }
});

var department = mongoose.model("Departments", departmentSchema);
module.exports = department;