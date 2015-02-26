var express = require('express');
var OMXPlayer = require('omxplayer');
var fs = require('fs');
var os = require('os');
var commander = require('commander');

var NO_CACHE_CONTROL = "no-cache, private, no-store, must-revalidate, max-stale=0, max-age=1,post-check=0, pre-check=0";

OMXPlayer.fillCommanderOptions(commander);

commander.option("--moviesBasePath", "Movies base path");

commander.parse(process.argv);

var omx = new OMXPlayer(commander);

var app = express();

app.use(omx.express);

app.set('view engine', 'ejs');

app.get("/list/*", function(req, res) {

	var path = commander.moviesBasePath + decodeURIComponent(req.path.substring(6));

	console.log("List path=" + path);

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
	res.render('index.ejs', {
		hostname: os.hostname()
	});
});

app.get("/", function(req, res) {
	res.redirect("/index.html");
});

app.use(express.static(__dirname + '/pages'));

app.listen(8080);

console.log("Server is ready !");