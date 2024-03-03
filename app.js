var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var fs = require('fs')
var path = require('path')
var statisticlRouter = require('./src/routes/statistic');
const logger = require('./src/utils/logger');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
global.__basedir = __dirname;

const errorHandler = (err, req, res, next) => {

  logger.error(`${err.status || 500} - ${err}  ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error: 'error happened'})
};

app.use('/statistic', statisticlRouter, errorHandler);

app.get('/', function (req, res) {
    res.send('Hello World');
 })
  
app.listen(process.env.PORT || 3005);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
