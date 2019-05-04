var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon=require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var session=require('express-session');
var passport=require('passport');
var expressValidator = require('express-validator');
var LocalStrategy=require('passport-local').Strategy;
var multer=require('multer');
var upload=multer({dest:'./public/images'});
var flash=require('connect-flash');
var bcrypt=require('bcryptjs');
var request = require('request');
var db= require("./app_server/models/db");
var MongoStore = require("connect-mongo")(session);
var methodOverride = require('method-override');


//var db=require('./app_server/models/db');
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
//var routesApi = require("./app_api/routes/index");

var app = express();
app.use(expressValidator());
// view engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'pug');

app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride());


app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    resave:true
    //  store: new MongoStore({
    //    mongooseConnection: db
    //  })
  })
 );
app.use("/", function(req, res, next) {
  if (req.session.userId) {
    res.locals.user = req.session.userId;
    res.locals.userName = req.session.userName;
    res.locals.profilePic=req.session.profilePic;
    res.locals.fullName=req.session.fullName;
    res.locals.universityName=req.session.universityName;
    res.locals.departmentName=req.session.departmentName;
    req.session.batch=req.session.batch;
    req.session.rollNumber=req.session.rollNumber;
  }
  next();
});


app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/signUp', usersRouter);
//app.use("/api", routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;