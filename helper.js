const crypto = require('crypto-js');
const crypto1 = require('crypto');
const token = require('jsonwebtoken');

// Pass sha3 encryption salted to user password via the following function
function SHA3hashPassword(secretpass, salt) {
    const concatPass = secretpass + salt;
    return crypto.SHA3(concatPass).toString(crypto.enc.Hex);
}

// Creation of JWT token based on the username, hashed password and salt
function JWTTokenDice(username, secretpass, salt) {
    const hashed_password = SHA3hashPassword(secretpass, salt);
    const jwt = token.sign({ username: username, password: hashed_password }, "The secret key", { expiresIn: '5m'});
    return jwt;
}

// Create a random salt as an extra measure to the password encryption
function generateRandomSecret(size=32) {
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

module.exports = { SHA3hashPassword, JWTTokenDice, generateRandomSecret, AESEncryptHashedPass, AESDecryptHashedPass };