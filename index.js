var express = require('express');
var OMXControl = require('omxcontrol');
var fs = require('fs');

var NO_CACHE_CONTROL = "no-cache, private, no-store, must-revalidate, max-stale=0, max-age=1,post-check=0, pre-check=0";

var MOVIES_PATH = "/home/olivier/Films";

var omx = new OMXControl({
	moviesPath: MOVIES_PATH
});

var app = express();
app.use(omx.express);

app.set('view engine', 'ejs');

app.get("/list/*", function(req, res) {

	var path = MOVIES_PATH + decodeURIComponent(req.path.substring(5));

	console.log("Path=" + path);

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

	var buf = '{ "returnCode": "OK", "list": [';

	var first = true;

	fs.readdirSync(path).forEach(function(p) {
		var stats;
		try {
			stats = fs.statSync(path + '/' + p);
		} catch (x) {
			console.error(x);
			return;
		}
		if (!stats) {
			return;
		}

		if (first) {
			first = false;
		} else {
			buf += ',';
		}

		if (stats.isDirectory()) {
			buf += '"/' + p + '"';
			return;
		}

		buf += '"' + p + '"';
	});
	buf += ']}';

	res.write(buf);
	res.end();
});

app.get("/index.html", function(req, res) {
	res.render('index.html', {
		hostname: 'moi'
	});
});

app.use(express.static(__dirname + '/pages'));

app.listen(8080);

console.log("Server is ready !");