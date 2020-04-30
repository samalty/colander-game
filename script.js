const colanderForm = document.getElementById("colanderForm");
const beginButton = document.getElementById("begin");
const gotItButton = document.getElementById("got");
const passButton = document.getElementById("pass");
const nextButton = document.getElementById("next");
const nextRoundButton = document.getElementById("nextRound");

const team1Span = document.getElementById("team1");
const team2Span = document.getElementById("team2");

const roundSpan = document.getElementById("round");

let cloned = ['Sam', 'Horse', 'Arsenal', 'Chicago Bulls', 'Hunter S Thompson', 'Akala'];
let colander = ['Sam', 'Horse', 'Arsenal', 'Chicago Bulls', 'Hunter S Thompson', 'Akala'];
let got = [];
let passed = [];
let rounds = ['Round 1: Articulate', 'Round 2: Charades', 'Round 3: Articulate (2 words)', 'Round 4: Charades (with blanket)']
let output = "Ready?";
let begun = false;

// Var to determine whose turn it is
let turn = 1;
// Add active class to team1 by default
document.getElementById("team1div").classList.add("active");

// Var to determine what round it is
let round = 0;

let team1Score = 0;
let team2Score = 0;

// Var for initial stopwatch value
let seconds = 60;

// Var to hold setInterval function
let interval = null;

// Var to hold stopwatch status
let status = "stopped";

colanderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var input = document.forms["colanderForm"]["input"].value;
    colander.push(input);
    cloned.push(input);
    console.log(colander);
    // Reset form input in browser
    colanderForm.reset();
    return colander;
});

beginButton.addEventListener("click", (e) => {
    //document.getElementById("fillColander").style.display="none";
    console.log(colander);
    document.getElementById("fillColander").classList.add("disappear");
    document.getElementById("scores").classList.remove("disappear");
    document.getElementById("round").classList.remove("disappear");
    document.getElementById("gameMode").classList.remove("disappear");
    document.getElementById("display").classList.remove("disappear");
    document.getElementById("buttons").classList.remove("disappear");
});

function timer(){
    seconds--;
    if (seconds  === 0) {
        window.clearInterval(interval);
        status = "stopped";
        seconds = "Time's up! Next player's turn.";
        turn++;
        //document.getElementById("next").classList.add("visible");
        gotItButton.disabled = true;
        passButton.disabled = true;
        nextButton.disabled = false;
        // Push passed contents back into colander at end of turn
        passed.length > 0 ? colander.push(passed.pop()) : colander = colander;
    }

    // Alternate CSS classes to indicate active team
    switch (turn % 2 != 0) {
        case (true):
            document.getElementById("team1div").classList.add("active");
            document.getElementById("team2div").classList.remove("active");
            break;
        case (false):
            document.getElementById("team2div").classList.add("active");
            document.getElementById("team1div").classList.remove("active");
    }
    
    document.getElementById("display").innerHTML = seconds;
}

nextButton.addEventListener("click", (e) => {
    // Reset timer and display
    seconds = 60;
    document.getElementById("display").innerHTML = seconds;
    output = "Ready?";
    document.getElementById("gameMode").innerHTML = output;
    document.getElementById("got").innerHTML = "Go!";

    // Change button status for next player
    gotItButton.disabled = false;
    passButton.disabled = false;
    begun = false;
    nextButton.disabled = true;
});

// Val to retain previous colander array value for splicing after button click
let prevRandom = 0;

gotItButton.addEventListener("click", (e) => {
    passButton.disabled = false;

    if (begun == false) {
        begun = true;
        interval = window.setInterval(timer, 1000);
        status = "started";
        document.getElementById("got").innerHTML = "Got It!";
    } else if (colander.length < 1) {
        passed.length = 0 ? window.clearInterval(interval) : colander.push(passed[0]);    
    } else {
        // Remove item from colander into team collection
        colander.splice(prevRandom, 1);
        got.push(output);
        console.log(colander);
        console.log(got);

        // Update team score
        turn % 2 != 0 ? team1Score++ : team2Score++;
        team1Span.innerHTML = team1Score;
        team2Span.innerHTML = team2Score;
    }

    const random = randomise(colander);
    // Return new colander output from randomise function
    output = random[0];
    // Overwrite prevRandom value for splice method in else statement
    prevRandom = random[1];
});

passButton.addEventListener("click", (e) => {
    if (passed.length == 0) {
        colander.splice(prevRandom, 1);
        passed.push(output);
        console.log(passed);
    } else {
        document.getElementById("pass").classList.add("denied");
        document.getElementById("pass").innerHTML = "X";
        setTimeout(function(){ document.getElementById("pass").classList.remove("denied") }, 1000);
        setTimeout(function(){ document.getElementById("pass").innerHTML = "Pass" }, 1000);
    }

    const random = randomise(colander);
    // Return new colander output from randomise function
    output = random[0];
    // Overwrite prevRandom value for splice method in else statement
    prevRandom = random[1];
});

function randomise(colander){
    // Generate new random item from colander
    const random = Math.floor(Math.random() * colander.length);
    var output = colander[random];

    // Initiate new round if colander and passed arrays are empty
    if (colander.length == 0 && passed.length == 0) {
        newRound(colander);
    } else if (colander.length == 0) {
        colander.push(passed.pop());
        output = colander[0];
        document.getElementById("gameMode").innerHTML = output;
    } else document.getElementById("gameMode").innerHTML = output;

    //output == undefined ?  newRound(colander) : document.getElementById("gameMode").innerHTML = output;
    return [output, random];
}

function newRound(colander){
    gotItButton.disabled = true;
    passButton.disabled = true;
    nextButton.disabled = true;
    nextRoundButton.disabled = false;
    window.clearInterval(interval);
    if (round < rounds.length-1) {
        document.getElementById("gameMode").innerHTML = "Colander is empty. You have " + seconds + " seconds remaining. Click the 'next round' button to resume.";
    } else {
        switch (true) {
            case (team1Score > team2Score):
                document.getElementById("gameMode").innerHTML = "Game over. Team A wins!";
                break;
            case (team1Score < team2Score):
                document.getElementById("gameMode").innerHTML = "Game over. Team B wins!";
                break;
            case (team1Score == team2Score):
                document.getElementById("gameMode").innerHTML = "Game over. It's a draw!";
                break;
        }
    }
    return colander;
}

nextRoundButton.addEventListener("click", (e) => {
    // Refill colander array with cloned array contents and empty got array
    colander = cloned.slice();
    got = [];
    // Update round
    round++;
    document.getElementById("round").innerHTML = rounds[round];
    // Reset gotItButton and begun status to enable gotItButton functionality
    gotItButton.disabled = false;
    begun = false;
    document.getElementById("got").innerHTML = "Go!";
    document.getElementById("gameMode").innerHTML = "Ready?";
    nextRoundButton.disabled = true;
});

function startStop(){
    if (status === "stopped") {
        // Start
        interval = window.setInterval(timer, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        status = "started";
    } else {
        // Stop
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        status = "stopped";
    }
}

// Reset function

function reset(){
    window.clearInterval(interval);
    seconds = 60;
    document.getElementById("display").innerHTML = seconds;
    document.getElementById("startStop").innerHTML = "Start";
}

// 'How to play' accordion

var accordion = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function() {
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}