const crypto = require('crypto-js');

// Pass sha3 encryption salted to user password via the following function
function SHA3hashPassword(secretpass, salt) {
    return crypto.SHA3(secretpass + salt).toString(crypto.enc.Hex);
}

// Create a random salt as an extra measure to the password encryption
function RandomSalty() {
    return crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
}

function sha3hash(input) {
    return crypto.SHA3(input).toString(crypto.enc.Hex);
}

module.exports = { SHA3hashPassword, RandomSalty, sha3hash };