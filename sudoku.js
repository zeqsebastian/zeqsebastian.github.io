var numSelected = null;
var tileSelected = null;
var errors = 0;
var timeLeft = 300;
var timerInterval;
var game;
var test = false;
var gameBoards = [];
var solutionBoards = [];
var timerElement;
var board1 = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

var solution1 = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

// Funktion zum Rotieren eines Boards (90 Grad im Uhrzeigersinn)
function rotate(board1) {
    const size = board1.length;
    const rotated = Array.from({ length: size }, () => "");

    for (let i = 0; i < size; i++) {
        for (let j = size - 1; j >= 0; j--) {
            rotated[i] += board1[j][i];
        }
    }
    return rotated;
}

// Originale Boards hinzufügen
gameBoards.push(board1);
solutionBoards.push(solution1);

// Rotationen hinzufügen
let rotatedGame = board1;
let rotatedSolution = solution1;
for (let i = 0; i < 3; i++) {
    rotatedGame = rotate(rotatedGame);
    rotatedSolution = rotate(rotatedSolution);
    gameBoards.push(rotatedGame);
    solutionBoards.push(rotatedSolution);
}

// Zufällige Auswahl einer der 4 Varianten
const randomIndex = Math.floor(Math.random() * 4);
var board = gameBoards[randomIndex];
var solution = solutionBoards[randomIndex];

window.onload = function() {
    timerElement = document.getElementById("timer");
    timerElement.innerText = "5:00"; // Timer von Anfang an anzeigen
    document.getElementById("errors").innerText = "0/5 Fehlern";
    setGame();
    game = true;
};

function setGame() {
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    let boardElement = document.getElementById("board");
    boardElement.style.width = "90vw";
    boardElement.style.height = "90vw";
    boardElement.style.maxWidth = "450px";
    boardElement.style.maxHeight = "450px";
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            boardElement.append(tile);
        }
    }
}

function selectNumber(){
    if(game){
        if (numSelected != null) {
            numSelected.classList.remove("number-selected");
        }
        numSelected = this;
        numSelected.classList.add("number-selected");
    }
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        if(errors >= 5){
            clearInterval(timerInterval);
            alert("Zu viele Fehler");
            return;
        }
        if(timeLeft <= 0 && test != false){
            return;
        }
        
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        
        if (!timerInterval) {
            startTimer();
        }
        
        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            checkWin();
        } else {
            errors += 1;
            document.getElementById("errors").innerText = `${errors}/5 Fehlern`;
        }
    }
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(function() {
        test = true;

        if (timeLeft > 0) {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            alert("Zeit abgelaufen! Versuche es erneut.");
        }
    }, 1000);
}

function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            if (tile.innerText !== solution[r][c]) {
                return;
            }
        }
    }

    if (timeLeft > 0) {
        document.getElementById("success-message").style.display = "block";
        clearInterval(timerInterval);
    }
}