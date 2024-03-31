
const DICE_MAX = 6;
const DICE_MIN = 1;

function hash() {
    return;
}

function rollDice() {
    return Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1) + DICE_MIN);
}

function generateRandomSecret(size = 20) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}

document.getElementById('roll_dice_button').addEventListener('click', () => {
    let result = rollDice();
    document.getElementById('roll_result').innerText = result;
});