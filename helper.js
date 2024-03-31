const crypto = require('crypto-js');
const crypto1 = require('crypto');
const jwt = require('jsonwebtoken');

// Pass sha3 encryption salted to user password via the following function
function SHA3hashPassword(secretpass, salt) {
    const concatPass = secretpass + salt;
    return crypto.SHA3(concatPass).toString(crypto.enc.Hex);
}

// Create a random salt as an extra measure to the password encryption
function generateRandomSecret(size = 32) {
    return crypto1
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}

// Encryption process for password 
function AESEncryptHashedPass(hashed_secret, skey) {
    return crypto.AES.encrypt(hashed_secret, skey).toString(crypto.enc.Utf8);
}

// Decryption Process for password
function AESDecryptHashedPass(cipher_secret, skey) {
    const helper = crypto.AES.decrypt(cipher_secret, skey);
    const originText = helper.toString(crypto.enc.Utf8);
    return originText;
}

//
function checkJWTForPlay(req, res, next) {
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/auth")
    }
}

function checkJWTExists(req, res, next) {
    const token = req.cookies.token;
    if (token != undefined) {
        return res.redirect("/play");
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect("/play");
    } catch (err) {
        //console.log(err);
        next();
    }
}

module.exports = {
    SHA3hashPassword,
    generateRandomSecret,
    AESEncryptHashedPass,
    AESDecryptHashedPass,
    checkJWTForPlay,
    checkJWTExists
};