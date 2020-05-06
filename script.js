const colanderForm = document.getElementById("colanderForm");
const settingsForm = document.getElementById("settingsForm");
const beginButton = document.getElementById("begin");
const gotItButton = document.getElementById("got");
const passButton = document.getElementById("pass");
const nextButton = document.getElementById("next");
const nextRoundButton = document.getElementById("nextRound");
const resetButton = document.getElementById("home");

const team1Span = document.getElementById("team1");
const team2Span = document.getElementById("team2");

const roundSpan = document.getElementById("round");

let cloned = [];
let colander = [];
let got = [];
let passed = [];
let rounds = ['Round 1: Articulate', 'Round 2: Charades', 'Round 3: Articulate V2', 'Round 4: Charades V2'];
let output = "Ready?";
let begun = false;

// Var to determine whose turn it is
let turn = 1;
// Add active class to team1 by default
document.getElementById("team1div").classList.add("active");

// Var to determine what round it is (set as 0 for use with rounds array)
let round = 0;

// Default value may be overwritten in settingsForm event listener
let roundsNum = 3;

let team1Score = 0;
let team2Score = 0;

// Default value may be overwritten in settingsForm event listener
let seconds = 60;

// Var to hold setInterval function
let interval = null;

// Var to hold stopwatch status
let status = "stopped";

// Grouped elements for JS conditional CSS calls throughout script
const homeScreen = document.getElementsByClassName("homeScreen");
const gameScreen = document.getElementsByClassName("gameScreen");
const gotPassNext = document.getElementsByClassName("gpn");

colanderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var input = document.forms["colanderForm"]["input"].value;
    // If input isn't blank, push to colander and cloned
    input ? colander.push(input): "";
    input ? cloned.push(input): "";
    // Reset form input in browser
    colanderForm.reset();
    return colander;
});

settingsForm.addEventListener("submit", (e) => {
    if (colander.length < 18) {
        e.preventDefault();
        alert("There must be at least 18 items in the colander in order to play. You currently have " + colander.length + " items.");
    } else {
        e.preventDefault();
        // Establish rounds and time limit
        roundsNum = document.querySelector('input[name="roundsNum"]:checked').value;
        seconds = document.querySelector('input[name="turnTime"]:checked').value;
        // Hide home screen elements and show game screen elements
        for (var i = 0; i < homeScreen.length; i++) homeScreen[i].classList.add("disappear");
        for (var i = 0; i < gameScreen.length; i++) gameScreen[i].classList.remove("disappear");
        // Enable and disable buttons
        document.getElementById("got").classList.add("activeBtn");
        passButton.disabled = true;
        nextButton.disabled = true;
        // Display time limit as selected in settings form
        document.getElementById("display").innerHTML = seconds;
        document.getElementById("display").classList.add("output");
    }
});

function timer(){
    seconds--;
    document.getElementById("display").classList.add("output");
    seconds <= 10 && seconds >= 0 ? document.getElementById("display").classList.add("runningOut"): "";
    if (seconds  === 0) {
        document.getElementById("display").classList.remove("runningOut");
        document.getElementById("gameMode").classList.add("disappear");
        window.clearInterval(interval);
        status = "stopped";
        seconds = "Time's up! Next player's turn.";
        turn++;
        gotItButton.disabled = true;
        passButton.disabled = true;
        nextButton.disabled = false;
        document.getElementById("got").classList.remove("activeBtn");
        document.getElementById("pass").classList.remove("activeBtn");
        document.getElementById("next").classList.add("activeBtn");
        // Push passed contents back into colander at end of turn
        passed.length > 0 ? colander.push(passed.pop()) : "";
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
            break;
    }
    
    document.getElementById("display").innerHTML = seconds;
}

nextButton.addEventListener("click", (e) => {
    // Reset timer and display
    seconds = document.querySelector('input[name="turnTime"]:checked').value;
    document.getElementById("display").innerHTML = seconds;
    output = "Ready?";
    document.getElementById("gameMode").classList.remove("disappear");
    document.getElementById("gameMode").innerHTML = output;
    document.getElementById("got").innerHTML = "Go!";

    // Change button status for next player
    gotItButton.disabled = false;
    document.getElementById("got").classList.add("activeBtn");
    nextButton.disabled = true;
    document.getElementById("next").classList.remove("activeBtn");
    begun = false;
});

// Val to retain previous colander array value for splicing after button click
let prevRandom = 0;

gotItButton.addEventListener("click", (e) => {
    if (begun == false) {
        begun = true;
        interval = window.setInterval(timer, 100);
        status = "started";
        document.getElementById("got").innerHTML = "Got It!";
        // Enable pass button
        passButton.disabled = false;
        document.getElementById("pass").classList.add("activeBtn");
    } else if (colander.length < 1) {
        passed.length = 0 ? window.clearInterval(interval) : colander.push(passed[0]);    
    } else {
        // Remove item from colander into got array
        colander.splice(prevRandom, 1);
        got.push(output);

        // Update team score
        turn % 2 != 0 ? team1Score++ : team2Score++;
        team1Span.innerHTML = team1Score;
        team2Span.innerHTML = team2Score;
    }

    // Return new colander output from randomise function
    const random = randomise(colander);
    output = random[0];
    // Overwrite prevRandom value for splice method in else statement
    prevRandom = random[1];
    // Add CSS to output
    document.getElementById("gameMode").classList.add("output");
});

passButton.addEventListener("click", (e) => {
    switch (passed.length == 0) {
        case (true):
            // Shift passed item into passed array
            passed.push(colander.splice(prevRandom, 1));
            // Disable pass button
            document.getElementById("pass").classList.remove("activeBtn");
            // Return new colander output from randomise function
            const random = randomise(colander);
            output = random[0];
            // Overwrite prevRandom value for splice method in else statement
            prevRandom = random[1];
            break;
        case (false):
            document.getElementById("pass").innerHTML = "X";
            setTimeout(function(){ document.getElementById("pass").innerHTML = "Pass" }, 2000);
            break;
    }
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

    return [output, random];
}

function newRound(colander){
    // Hide home screen elements
    for (var i = 0; i < gotPassNext.length; i++) gotPassNext[i].classList.add("disappear");
    window.clearInterval(interval);
    if (round < roundsNum-1) {
        document.getElementById("gameMode").innerHTML = "Colander is empty. You have " + seconds + " seconds remaining. Click 'next round' to resume.";
        document.getElementById("display").classList.add("disappear");
        document.getElementById("nextRound").classList.remove("disappear");
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
        document.getElementById("display").classList.add("disappear");
        document.getElementById("home").classList.remove("disappear");
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
    // Reset display for next round
    for (var i = 0; i < gotPassNext.length; i++) gotPassNext[i].classList.remove("disappear");
    document.getElementById("got").innerHTML = "Go!";
    document.getElementById("gameMode").innerHTML = "Ready?";
    document.getElementById("nextRound").classList.add("disappear");
    document.getElementById("display").classList.remove("disappear");
    // Set CSS styles for updated round display
    document.getElementById("round").classList.add("roundText");
    document.getElementById("pass").classList.remove("activeBtn");
});

resetButton.addEventListener("click", (e) => {
    // Reload page to reset settings
    location.reload();
});

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