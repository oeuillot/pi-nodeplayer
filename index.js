var express = require('express');
var OMXControl = require('omxcontrol');
var fs = require('fs');

var MOVIES_PATH = "/home/olivier/Films";

var omx = new OMXControl({
	moviesPath: MOVIES_PATH
});

var app = express();
app.use(omx.express);

app.get("/list/:path", function(req, res) {

	var path = MOVIES_PATH + req.path.substring(6);

	if (!fs.existsSync(path)) {
		res.status(404);
		res.end();
		return;
	}

	var hs = {
		'Content-Type': 'application/json',
		'Cache-Control': NO_CACHE_CONTROL
	};
	res.writeHead(200, hs);

	res.write('{ "responseCode": "OK", "list": [');

	fs.readdirSync(path).forEach(function(p) {
		var stats = fs.statSync(p);
		if (!stats) {
			return;
		}

		if (stats.isDirectory()) {
			res.write('/' + p);
			return;
		}

		res.write(p);
	});

	res.write(']}');
	res.end();
});

app.use(express.static(__dirname + '/pages'));

app.listen(8080);