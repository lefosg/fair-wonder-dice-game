const { Router } = require('express');
const path = require('path');
const mysqlconn = require('../database/db.js');
const { sha3hash } = require('../helper.js');

const router = Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/login_register.html'));
});

/**
 * Authenticate user login
 */
router.post('/login', (req, res) => {
    //0. get the credentials from the post request
    const { username, password } = req.body;
    console.log("Attempting login with credentials: " + username + " " + password);

    mysqlconn.connect((err) => {
        if (err) throw err;
        //1. get user from database, TODOTODOTODOTODO: PREPARED STATEMENT + CHECK FOR SQL INJECTION IN HERE
        mysqlconn.query(`SELECT password FROM users WHERE username='${username}'`, function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            //if no records where returned, the given username does not exist
            if (result.length == 0) {
                res.json({ status: "username or password is invalid" });
                return;
            }
            let stored_pass_hash = result[0].password;
            //2. hash the given password
            let password_hash = sha3hash(password);
            console.log(password_hash);
            console.log(stored_pass_hash);
            //3. decrypt result.password that was retrieved from database

            //4. check if (2.)hashed password == (3.)decrypted password
            if (password_hash == stored_pass_hash) {
                console.log("logging in");
                res.json({ "status": 'successfully authenticated' });
            } else {
                console.log("failed to log in");
                res.json({ "status": "username or password is invalid" });
            }
            //5. if true, log in (todo: jwt token)
        });
    });
});

/**
 * Register user / Create new user in db
 */
router.post('/register', (req, res) => {
    //0. get the credentials from the post request
    const { first_name, last_name, username, password, confirmed_password } = req.body;

    //1. check if user already in db, if exists, throw error
    //2. if not exists, 
});

module.exports = router;