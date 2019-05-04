var mongoose = require("mongoose");


var documentSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String },
  uploader: { type: String },
  university: { type: String },
  department: { type: String },
  course: { type: String }
});

var document = mongoose.model("Documents", documentSchema);
module.exports = document;