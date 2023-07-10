var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

mongoose.connect("mongodb://127.0.0.1/mydb_test");

let listSchema = mongoose.Schema({
  text: String
})

let List = mongoose.model("elements", listSchema);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post("/list", (req, res) => {
  let text = req.body.text;
  List.create({text:text},)
      .then((doc) => {
        res.json({id:doc._id})
      })
})

app.get("/list", (req, res) => {
    List.find()
        .then((elements) => {
            res.json({elements:elements})
        })
})

app.put("/list", (req, res) => {
    let id = req.body.id;
    let text = req.body.text;
    List.updateOne({_id:id}, {text:text}).exec();
    res.send();
})

app.delete("/list", (req, res) => {
    let id = req.body.id;
    List.deleteOne({_id:id}).exec();
    res.send();
})

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
