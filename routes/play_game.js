const { Router } = require('express');
const path = require('path');
const { sha3hash } = require('../helper.js');
const { generateRandomSecret, checkJWTForPlay } = require('../helper.js');

const router = Router();

DICE_MAX = 6;
DICE_MIN = 1;

// Internal functions
function rollDice() {
    return Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1) + DICE_MIN);
}

/**
 * Endpoints
 */
// Router has prefix /play, so this endpoint is /play/
router.get('/', checkJWTForPlay, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/play/game.html'));
});



module.exports = router;