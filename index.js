var express = require('express');
var OMXControl = require('omxcontrol');

var omx = new OMXControl({

});

var app = express();
app.use(omx.express);
