var express = require('express');
var omx = require('omxcontrol');

var app = express();
app.use(omx());

