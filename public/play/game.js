const dice = document.getElementById('dice-btn');

function dicegame(){
    //Dice 1
    var randomDice =Math.floor((Math.random()*6)+1);
    var diceLocation ="img/"+"Dice-"+randomDice+".png";
    var img1 = document.querySelectorAll("img")[0];
    img1.setAttribute("src",diceLocation);


    //Dice2
    var randomDice2 =Math.floor((Math.random()*6)+1);
    var diceLocation2 ="img/"+"Dice-"+randomDice2+".png";
    var img2 = document.querySelectorAll("img")[1];
    img2.setAttribute("src",diceLocation2);

    if (randomDice > randomDice2){
        document.querySelector("h1").innerHTML="🏅🎲 Player 1 Win!";
    }
    else if (randomDice < randomDice2){
        document.querySelector("h1").innerHTML="Player 2 Win! 🏅🎲 ";
    }
    else if (randomDice = randomDice2){
        document.querySelector("h1").innerHTML="🏅🎲 Match Draw! 🎲🏅";
    }
        else{
            document.querySelector("h1").innerHTML="Something Error...";
        }

        //button text change
        dice.innerHTML="Play Again!";
}