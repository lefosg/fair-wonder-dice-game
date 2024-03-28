// Const variables (with libraries required)
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const database = require('mysql2');
require('dotenv').config();

// Initialization
const app = express();
const certificate = fs.readFileSync('security/FAIRDICE.crt', 'utf8');
const privateKey = fs.readFileSync('security/FAIRDICE.key', 'utf8');
const credentials = { key: privateKey, cert: certificate };

//const vars
const HTTP_PORT = process.env.HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
const DOMAIN = process.env.DOMAIN
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use(express.static('public'));
app.use(express.json());
//print type of request and url in every request, todo: log instead of print
app.use((request, response, next) => {
    console.log(request.method, request.url);
    next();
});

// Redirect HTTP to HTTPS
app.use(function (req, res, next) {
    if (process.env.NODE_ENV != 'development' && !req.secure) {
        return res.redirect("https://" + DOMAIN + ":" + HTTPS_PORT + req.url);
    }
    next();
});

// Game route
const game_route = require('./routes/play_game.js');
app.use('/play', game_route);

// Authentication route
const auth_route = require('./routes/auth.js');
app.use('/auth', auth_route);

// Index api is here, don't make route for it
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


/**
 * DATABASE
  */
// Initialize connection to our database GDPR in Mysql via Nodejs
var mysqlconn = database.createConnection({
    host: DOMAIN,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// process.exit() is utilized to terminate the code in case of failure
mysqlconn.connect(function (error) {
    if (error) {
        console.log("Couldn't connect :(Error: " + error);
        process.exit(1);
    } else {
        console.log("Connected successfully to GDPR Database!!!");

        // Inserting new users into the GDPR Database 
        // The ignore syntax is utilized with insert in order to avoid inserting duplicate values in our GDPR Database
        // Return all the values from the GDPR Database
        var sqlquery1 = `insert ignore into users(firstname, lastname, username, password, id) values('f3312307', 'AsoeSec', 'Kkostakis', 'Pass123', 1)`;
        var sqlquery2 = `insert ignore into users(firstname, lastname, username, password, id) values('Admini', 'Archibald', 'Administrator', 'L$mD0wer1', 2)`;
        var sqlquery3 = `select * from users`;

        // Execute query#1
        mysqlconn.query(sqlquery1, (error, rows) => {
            if (error) {
                console.error('There was an error when executing first query!!!: ' + error.stack);
                process.exit(1);
            }
            else {
                console.log("First User Query");
                console.log(rows);
            }
        });

        // Execute query#2
        mysqlconn.query(sqlquery2, (error, rows2) => {
            if (error) {
                console.error('There was an error when executing second query!!!: ' + error.stack);
                process.exit(1);
            }
            else {
                console.log("Administrator Query");
                console.log(rows2);
            }

            // Execute query#3
            mysqlconn.query(sqlquery3, (error, rows3) => {
                if (error) {
                    console.error('There was an error when executing thrid query!!!: ' + error.stack);
                    process.exit(1);
                }
                else {
                    console.log("Return users from our gdpr database");
                    console.log(rows3);
                }
            });

            // End the connection with our database in mysql
            /*mysqlconn.end(function (error) {
                if (error) {
                    console.error("There was an issue with the closure process" + error.stack);
                    process.exit(1);
                }
                else {
                    console.log("The connection with Mysql has ended successfully!!!");
                }
                process.exit(1);
            }); */
        });

    }
});

// Spin the server
httpServer.listen(HTTP_PORT, () => {
    console.log("HTTP server listening on http://" + DOMAIN + ":" + HTTP_PORT)
});

httpsServer.listen(HTTPS_PORT, () => {
    console.log("HTTPS server listening on https://" + DOMAIN + ":" + HTTPS_PORT)
});
