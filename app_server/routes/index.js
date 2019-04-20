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
var ctrlUniversity=require("../controllers/University");
var ctrlDepartment=require("../controllers/Department");
var ctrlCourse=require("../controllers/Course");
var ctrlEditProfile=require("../controllers/EditProfile");
var ctrlProfile=require("../controllers/Profile");

router.get("/", ctrlLogin.loginCredentials);
router.post("/", ctrlLogin.doLogIn);
router.get("/logout", ctrlLogin.logout);

router.get("/signup", ctrlSignUp.signUp);
router.post("/signup", upload.single('profilePicture'), ctrlSignUp.createAccount);

router.get("/university",ctrlUniversity.viewAll,ctrlUniversity.checkLogin);

router.get("/university/:universityid/department",ctrlDepartment.getDepartment,ctrlDepartment.checkLogin);

router.get("/university/:universityid/department/:departmentid/course",ctrlCourse.getCourse,ctrlCourse.checkLogin);

router.get("/profile/:profileid",ctrlProfile.viewProfile,ctrlProfile.checkLogin);

router.get("/edit", ctrlEditProfile.edit,ctrlEditProfile.checkLogin);
router.put("/edit", upload.single('profilePicture'), ctrlEditProfile.updateProfile);
router.put("/edit?_method=put", upload.single('profilePicture'), ctrlEditProfile.updateProfile);

module.exports = router;