const { Router } = require('express');
const path = require('path');
const mysqlconn = require('../database/db.js');
const { SHA3hashPassword } = require('../helper.js');
const { StaticSalty } = require('../helper.js');
const { JWTTokenDice } = require('../helper.js');
const inputValidate = require('validator');

const router = Router();

const login_true_response = { auth: true, msg: "logged in" };
const login_false_response = { auth: false, msg: "username or password invalid" };
const register_true_response = { auth: true, msg: "registered" };
const register_false_response = { auth: false, msg: "username taken" };
const invalid_uname_format = { auth: false, msg: "!!!Invalid username format!!!" };
const bad_characters = { auth: false, msg: "Username cannot contain symbols like '-' or single quote or double quote!!!" };

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

    // Extra measures to further prevent SQL Injection Attempts like user input sanitization
    if (!inputValidate.isAlphanumeric(username)) {
        return res.json(invalid_uname_format);
    }

    //1. get user from database, with the use of PreparedStatement as a measure against SQL Injection
    mysqlconn.query(`SELECT password FROM users WHERE username=?`, [username], function (err, result, fields) {
        if (err) {
            console.error("There was an error in fetching the user from the database:", err);
            return res.json({ msg: "Error in fetching user from database!!!" });
        }
        // console.log(result);
        //if no records where returned, the given username does not exist
        if (result.length == 0) {
            res.json(login_false_response);
            return;
        }

        //2. Retrieve the hashed password and the according salt from the database for the aforesaid user
        const stored_pass_hash = result[0].password;
        const dbhashed = Buffer.from(stored_pass_hash, 'binary').toString('utf8'); // Utilized to convert the varbinary type in MySQL to binary and then to string
        const salted = StaticSalty();

        //3. hash the given password with the salt
        const hashedPassword = SHA3hashPassword(password, salted);

        //3. check if (1.)hashed password == (2.)password given by the user
        if (hashedPassword == dbhashed) {
            console.log("logging in");
            //res.json(login_true_response);
            res.redirect("/play");
        } else {
            console.log("failed to log in");
            res.json(login_false_response);
        }
        //4. if true, log in (todo: jwt token)
        if (hashedPassword == dbhashed) {
            const generatedToken = JWTTokenDice(username, password, salted);
            console.log(generatedToken);
        }
    });
});

/**
 * Register user / Create new user in db
 */
router.post('/register', (req, res) => {
    //0. get the credentials from the post request
    const { first_name, last_name, username, password } = req.body;
    const salty = StaticSalty();

    // Extra measures to further prevent SQL Injection Attempts like user input sanitization
    if (!inputValidate.isAlphanumeric(username)) {
        return res.json(bad_characters);
    }

    //1. check if user already in db, if exists, throw error (Prepared Statements)
    mysqlconn.query(`SELECT * FROM users WHERE username=?`, [username], (err, result, fields) => {
        if (err) throw err;
        //if the result array has one (or more?) elements, the username exists
        if (result.length > 0) {
            return res.json(register_false_response);
        } else {
            //2. if not exists, insert user into db
            //2.a. hash and encrypt the password
            const hashed_password = SHA3hashPassword(password, salty);
            //2.b. store the password with the use of Prepared Statement as a measure against SQL Injection
            mysqlconn.query(`INSERT INTO users (firstname, lastname, username, password, salt) 
                    VALUES(?, ?, ?, ?, ?)`, [first_name, last_name, username, hashed_password, salty], (err, result, fields) => {

                if (err) {
                    console.error("There was an error in registering user:", err);
                    return res.json(register_false_response);
                }
                console.log("The user was registered successfully!!!");
                return res.json(register_true_response);
            });
        }
    });
});

module.exports = router;