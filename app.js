var express = require('express');

// create a new express server
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ 'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

//MongoDB
var mongoUrl;

mongoUrl = "localhost:27017/referraldb";
mongoose.connect(mongoUrl);//connecting to the database

app.use(morgan('dev')); // log every request to the console

// ROUTES FOR API==============================
app.use('',require('./routes/customer-api'));
app.listen(3000, function () {
  console.log('Server started on port 3000!')
})

