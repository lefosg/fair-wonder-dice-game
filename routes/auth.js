require('dotenv').config();

const { Router } = require('express');
const path = require('path');
const mysqlconn = require('../database/db.js');
const { SHA3hashPassword, generateRandomSecret, checkJWTExists, AESEncryptHashedPass, AESDecryptHashedPass, initializeVector, createEncKey } = require('../helper.js');
const inputValidate = require('validator');
const jwt = require('jsonwebtoken');
const { create } = require('domain');

const router = Router();
//const pass_key = process.env.PASSWORD_KEY;
//const salt_key = process.env.SALT_KEY;

//Replies for authentication attempts
const login_true_response = { auth: true, msg: "logged in" };
const login_false_response = { auth: false, msg: "username or password invalid" };
const register_true_response = { auth: true, msg: "registered" };
const register_false_response = { auth: false, msg: "username taken" };
const invalid_uname_format = { auth: false, msg: "!!!Invalid username format!!!" };
const bad_characters = { auth: false, msg: "Username cannot contain symbols like '-' or single quote or double quote!!!" };
const bad_password_length = { auth: false, msg: "Password length must be at least 6" };
const empty_fields = { auth: false, msg: "Fields must not be empty" };


//Endpoints

/**
 * Get the login and register page
 */
router.get('/', checkJWTExists, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/login_register.html'));
});

/**
 * Authenticate user login
 */
router.post('/login', checkJWTExists, (req, res) => {
    //0. get the credentials from the post request
    const { username, password } = req.body;
    console.log("Attempting login with credentials: " + username + " " + password);

    //check for empty fields
    if (username.trim() == "" || password.trim() == "") {
        return res.json(empty_fields);
    }

    // Extra measures to further prevent SQL Injection Attempts like user input sanitization
    if (!inputValidate.isAlphanumeric(username)) {
        return res.json(invalid_uname_format);
    }

    //1. get user from database, with the use of PreparedStatement as a measure against SQL Injection
    mysqlconn.query(`SELECT password, salt, vector, skey FROM users WHERE username=?`, [username], function (err, result, fields) {
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

        //2. Retrieve the encrypted password and the according key, vector from the database for the aforesaid user
        const stored_enc_pass_hash = result[0].password;
        const salted = result[0].salt;
        const vector = result[0].vector;
        const ekey = result[0].skey;

        // 3a. hash & encrypt the password given as user input with the encryption key and vector
        const hashed_password = SHA3hashPassword(password, salted);
        const enc_hash_pass = AESEncryptHashedPass(hashed_password, ekey, vector);

        //3b. check if (1.)encrypted password == (2.)password given by the user
        if (enc_hash_pass == stored_enc_pass_hash) {
            console.log("logging in");
            //res.json(login_true_response);
            //4. generate jwt token
            const token = jwt.sign({ username: username, password: enc_hash_pass }, process.env.JWT_SECRET, { expiresIn: "10s" });
            res.cookie("token", token, {
                // httpOnly: true,
                // secure: true,
                // maxAge: 1000000,
                // signed: true
            });
            res.json(login_true_response);
        } else {
            console.log("failed to log in");
            return res.json(login_false_response);
        }
    });
});

/**
 * Register user / Create new user in db
 */
router.post('/register', checkJWTExists, (req, res) => {
    //0. get the credentials from the post request
    const { first_name, last_name, username, password } = req.body;
    const salty = generateRandomSecret();
    // const enc_salty = AESEncryptHashedPass(salty, salt_key);

    // Initialized Vector AES
    const vector = initializeVector();

    // Encryption Key for AES
    const skey = createEncKey();

    //check for empty fields
    if (first_name.trim() == "" || last_name.trim() == "" || username.trim() == "" || password.trim() == "") {
        return res.json(empty_fields);
    }

    // Extra measures to further prevent SQL Injection Attempts like user input sanitization
    if (!inputValidate.isAlphanumeric(username)) {
        return res.json(bad_characters);
    }

    if (password.length < 6) {
        return res.json(bad_password_length);
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
            const enc_hashed_password = AESEncryptHashedPass(hashed_password, skey, vector);
            //2.b. store the password with the use of Prepared Statement as a measure against SQL Injection
            mysqlconn.query(`INSERT INTO users (firstname, lastname, username, password, vector, skey, salt) 
                    VALUES(?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, username, enc_hashed_password, vector, skey, salty], (err, result, fields) => {

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