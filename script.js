const colanderForm = document.getElementById("colanderForm");
const beginButton = document.getElementById("begin");
const gotItButton = document.getElementById("got");
const passButton = document.getElementById("pass");
const nextButton = document.getElementById("next");

const team1Span = document.getElementById("team1");
const team2Span = document.getElementById("team2");

let cloned = ['Sam', 'Horse', 'Arsenal', 'Chicago Bulls', 'Hunter S Thompson', 'Akala'];
let colander = ['Sam', 'Horse', 'Arsenal', 'Chicago Bulls', 'Hunter S Thompson', 'Akala'];
let got = [];
let passed = [];
let output = "Ready?";
let begun = false;

let turn = 1;

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
    }
    document.getElementById("display").innerHTML = seconds;
}

nextButton.addEventListener("click", (e) => {
    // Reset timer and display
    seconds = 60;
    document.getElementById("display").innerHTML = seconds;
    output = "Ready?";
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

    if (begun == false) {
        begun = true;
        interval = window.setInterval(timer, 100);
        status = "started";
        document.getElementById("got").innerHTML = "Got It!";
    } else if (colander.length < 1) {
        console.log('No more items')
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

    // Generate new random item from colander
    const random = Math.floor(Math.random() * colander.length);
    output = colander[random];

    output == undefined ? newRound(colander) : document.getElementById("gameMode").innerHTML = output;

    // Overwrite prevRandom value for splice method in else statement
    prevRandom = random;
});

passButton.addEventListener("click", (e) => {
    if (passed.length == 0) {
        passed.push(output);
        console.log(passed);
    } else {
        document.getElementById("pass").classList.add("denied");
        document.getElementById("pass").innerHTML = "X";
        setTimeout(function(){ document.getElementById("pass").classList.remove("denied") }, 1000);
        setTimeout(function(){ document.getElementById("pass").innerHTML = "Pass" }, 1000);
    }
});

function newRound(colander){
    window.clearInterval(interval);
    document.getElementById("gameMode").innerHTML = "Colander is empty. Game paused.";
    // Refill colander array with cloned array contents
    colander = cloned.slice();
    return colander;
}

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