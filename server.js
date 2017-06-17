var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var helpers = require('./helpers');

var app = express();

var http = require('http').createServer(app);

// Setup and middleware
app.set('view engine' , 'ejs')
  .set('views' , path.join(__dirname, 'views'))
  .use(express.static('static'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(compression({threshold: 0, filter: () => true}))
  .use(session({ secret: 'zoGeheim', resave: false, saveUninitialized: false}))

app.use(function (req, res, next) {
  res.locals.h = helpers;
  next();
})

// My Routes
app.use('/', require('./routes/index'));

http.listen(process.env.PORT, function (){
    console.log('server is running on: ' + process.env.PORT);
});
