var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var crontab = require('./cron');

var routinesRoute = require('./routes/routines');
var categoriesRoute = require('./routes/categories');

var settings = require('./config/settings');

var app = express();

var mongoHost = process.env.MONGO_HOST || settings.database.host;

mongoose.connect('mongodb://'+mongoHost+':'+settings.database.port+'/'+settings.database.dbName);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routinesRoute);
app.use('/api', categoriesRoute);

app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(settings.appPort);
console.log("App listening on port "+settings.appPort);
