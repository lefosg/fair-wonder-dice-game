const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

//Initialization
const app = express();
const certificate = fs.readFileSync('security/FAIRDICE.crt', 'utf8');
const privateKey = fs.readFileSync('security/FAIRDICE.key', 'utf8');
const credentials = { key: privateKey, cert: certificate };

//const vars
const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;
const DOMAIN = "localhost"
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


//Redirect HTTP to HTTPS
app.use(function (req, res, next) {
    if (process.env.NODE_ENV != 'development' && !req.secure) {
        return res.redirect("https://" + DOMAIN + ":" + HTTPS_PORT + req.url);
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});



//Spin the server
httpServer.listen(HTTP_PORT, () => {
    console.log("HTTP server listening on https://" + DOMAIN + ":" + HTTP_PORT)
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log("HTTPS server listening on https://" + DOMAIN + ":" + HTTPS_PORT)
});