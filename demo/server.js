var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;

    if (path.match(/\/validate/)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ valid: false }));
    } else if (!path || path == '/' || path == '/index') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(fs.readFileSync('./demo.html'));
    } else if (path == '/RemoteValidator.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.write(fs.readFileSync('./RemoteValidator.js'));
    } else {
        res.writeHead(404);
    }

    res.end();
}).listen(5000);