const { Router } = require('express');
const path = require('path');
const { sha3hash } = require('../helper.js');

const router = Router();

DICE_MAX = 7;
DICE_MIN = 1;

// Internal functions
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
    res.sendFile(path.join(__dirname, '../public/play/play.html'));
});



module.exports = router;