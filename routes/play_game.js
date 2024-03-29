const { Router } = require('express');
const path = require('path');
const { SHA3 } = require('sha3');
const Crypto = require('crypto')

const router = Router();
const h = new SHA3(256);

DICE_MAX = 7;
DICE_MIN = 1;

// Internal functions
function hash(input) {
    return h.update(input).digest('hex');
}

function rollDice() {
    return Math.floor(Math.random() * (DICE_MAX - DICE_MIN) + DICE_MIN);
}

function generateRandomSecret(size = 20) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}

/**
 * Endpoints
 */
// Router has prefix /play, so this endpoint is /play/
router.get('/', (req, res) => {
    console.log(hash('1'));
    console.log(hash('1'));
    console.log(hash('2'));
    console.log(hash('3'));
    console.log(hash('4'));
    console.log(hash('5'));
    res.sendFile(path.join(__dirname, '../public/play/play.html'));
});



module.exports = router;