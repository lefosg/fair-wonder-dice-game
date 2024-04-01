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

const dice = document.getElementById('dice-btn');

function dicegame() {
    //Dice 1
    var randomDice = rollDice();
    var diceLocation = "img/" + "Dice-" + randomDice + ".png";
    var img1 = document.querySelectorAll("img")[0];
    img1.setAttribute("src", diceLocation);


    //Dice2
    var randomDice2 = rollDice();
    var diceLocation2 = "img/" + "Dice-" + randomDice2 + ".png";
    var img2 = document.querySelectorAll("img")[1];
    img2.setAttribute("src", diceLocation2);

    if (randomDice > randomDice2) {
        document.querySelector("h1").innerHTML = "🏅🎲 Player 1 Win!";
    }
    else if (randomDice < randomDice2) {
        document.querySelector("h1").innerHTML = "Player 2 Win! 🏅🎲 ";
    }
    else if (randomDice = randomDice2) {
        document.querySelector("h1").innerHTML = "🏅🎲 Match Draw! 🎲🏅";
    }
    else {
        document.querySelector("h1").innerHTML = "Something Error...";
    }

    //button text change
    dice.innerHTML = "Play Again!";
}

function logout() {
    fetch(window.location.origin + '/auth/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(resp => resp.json())
        .then(resp => {
            alert(resp.msg);
            if (resp.logout == true) {
                window.location.href = window.location.origin + "/auth"
            }
        })
        .catch(err => console.log(err));
}

