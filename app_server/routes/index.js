var express = require('express');
var multer = require('multer');
var path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });


var router = express.Router();

var ctrlLogin = require("../controllers/Login");
var ctrlSignUp = require("../controllers/SignUp");
var ctrlUniversity = require("../controllers/University");
var ctrlDepartment = require("../controllers/Department");
var ctrlCourse = require("../controllers/Course");
var ctrlEditProfile = require("../controllers/EditProfile");
var ctrlProfile = require("../controllers/Profile");
var ctrlUpload = require("../controllers/Upload");
var ctrlDocument=require("../controllers/Document");

router.get("/", ctrlLogin.loginCredentials);
router.post("/", ctrlLogin.doLogIn);
router.get("/logout", ctrlLogin.logout);

router.get("/signup", ctrlSignUp.signUp);
router.post("/signup", upload.single('profilePicture'), ctrlSignUp.createAccount);
router.get("/uniName/:uniID/deptName", ctrlSignUp.getDepartment); 
router.get("/checkUser", ctrlSignUp.validatingUserName);

router.get("/university", ctrlUniversity.checkLogin, ctrlUniversity.getUniversity);
router.get("/university/:universityid/department", ctrlDepartment.checkLogin, ctrlDepartment.getDepartment);
router.get("/university/:universityid/department/:departmentid/course", ctrlCourse.checkLogin, ctrlCourse.getCourse);
router.get("/university/:universityid/department/:departmentid/course/:courseid/documents",ctrlDocument.checkLogin,ctrlDocument.getDocument);
router.get("/document/:documentID",ctrlDocument.checkLogin,ctrlDocument.getDocumentDetail);
router.post("/document/:documentID",ctrlDocument.checkLogin,ctrlDocument.saveDocument);
router.get("/saved",ctrlDocument.checkLogin,ctrlDocument.getSavedDocument)

router.get("/upload",ctrlUpload.checkLogin,ctrlUpload.uploadPage);
router.post("/upload",upload.single('docPicture'),ctrlUpload.docCreate);
router.get("/departName/:deptID/courseName", ctrlUpload.getCourse);

router.get("/profile/:profileid", ctrlProfile.checkLogin, ctrlProfile.viewProfile);
router.get("/edit", ctrlEditProfile.checkLogin, ctrlEditProfile.edit);
router.put("/edit", upload.single('profilePicture'), ctrlEditProfile.updateProfile);
router.put("/edit?_method=put", upload.single('profilePicture'), ctrlEditProfile.updateProfile);
router.get("/uniNamee/:uniID/deptName", ctrlEditProfile.getDepartment); 

module.exports = router;