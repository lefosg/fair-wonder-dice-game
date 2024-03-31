const crypto = require('crypto-js');

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

module.exports = { SHA3hashPassword, StaticSalty };