const crypto = require('crypto-js');
const token = require('jsonwebtoken');

// Pass sha3 encryption salted to user password via the following function
function SHA3hashPassword(secretpass, salt) {
    const concatPass = secretpass + salt;
    return crypto.SHA3(concatPass).toString(crypto.enc.Hex);
}

// Create a salt as an extra measure to the password encryption
function StaticSalty() {
    const staticsalt = '1c9af59c1d8d93b7f26633c706919dac';
    return staticsalt;
}

// Creation of JWT token based on the username, hashed password and salt
function JWTTokenDice(username, secretpass, salt) {
    const hashed_password = SHA3hashPassword(secretpass, salt);
    const jwt = token.sign({ username: username, password: hashed_password }, "The secret key", { expiresIn: '5m'});
    return jwt;
}


module.exports = { SHA3hashPassword, StaticSalty, JWTTokenDice };