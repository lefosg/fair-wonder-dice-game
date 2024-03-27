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
const database = require('mysql2');


//Redirect HTTP to HTTPS
app.use(function (req, res, next) {
    if (process.env.NODE_ENV != 'development' && !req.secure) {
        return res.redirect("https://" + DOMAIN + ":" + HTTPS_PORT + req.url);
    }
    next();
});
// Initialize connection to our database GDPR in Mysql via Nodejs



var mysqlconn = database.createConnection({
    host: "localhost",
    user: "root",
    password: "Pas$w0rd446500!!@@##",
    database: "GDPR",
    port: 3306
});

mysqlconn.connect(function (error) {
    if (error) {
        console.log("Couldn't connect :(Error: " + error);
    } else {
        console.log("Connected successfully to GDPR Database!!!");

        var testquery = 'select * from users';

        mysqlconn.query(testquery, (error, rows) => {
            if (error) throw error;
            console.log(rows);
        });
    }
});


// End the connection with our database in mysql
/* mysqlconn.end(function(error) {
    if (error) {
        console.error("There was an issue with the closure process" + error.stack);
        return;
    }

    console.log("The connection with Mysql has ended successfully!!!");
}) */




//Spin the server
httpServer.listen(HTTP_PORT, () => {
    console.log("HTTP server listening on https://" + DOMAIN + ":" + HTTP_PORT)
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log("HTTPS server listening on https://" + DOMAIN + ":" + HTTPS_PORT)
});


