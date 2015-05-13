var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var log = require('./log')(module);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.engine('.html', require('ejs').renderFile);
app.engine('.html', ejs.__express);
app.set('view engine', 'html');//app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));//app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index')(app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        log.debug('%s %d %s', req.method, res.statusCode, req.url);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.use(function noCache(req, res, next){
	log.debug('%s %d %s', req.method, res.statusCode, req.url);
	res.header("Cache-Control","no-cache, no-store, must-revalidate");	
	res.header("Pragma","no-cache");
	res.header("Expires",0);
	next();
});

module.exports = app;
