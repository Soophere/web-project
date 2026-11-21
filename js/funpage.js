/* =====================================================================
   funpage.js  -  "Gym Memory Match" game (funpage.html)
   ---------------------------------------------------------------------
   The game: 12 cards lie face down. 6 cards show a PICTURE of an
   exercise and 6 cards show its NAME and the muscle it trains.
   Click two cards to turn them over. If the picture and the name belong
   to the same exercise, they stay open (a match). If not, they turn
   back. Find all 6 pairs with as few moves as possible.

   Dynamic HTML used:
   - all 12 cards are CREATED with JavaScript (createElement)
   - cards CHANGE their content and Bootstrap classes when clicked
   - the timer, moves, progress bar and tips are UPDATED live
   ===================================================================== */


/* ---------- 1. The exercises (each one makes 2 cards) ---------- */
var exercises = [
    { id: 1, name: "Squat", muscle: "Legs", picture: "images/exercises/ex-squat.svg",
      tip: "Squats train the biggest muscles in your body: the legs and the glutes." },
    { id: 2, name: "Push-up", muscle: "Chest", picture: "images/exercises/ex-pushup.svg",
      tip: "Push-ups need no equipment. Start on your knees if they are too hard." },
    { id: 3, name: "Dumbbell Row", muscle: "Back", picture: "images/exercises/ex-row.svg",
      tip: "Rows make your back stronger and help you sit and stand straight." },
    { id: 4, name: "Plank", muscle: "Core", picture: "images/exercises/ex-plank.svg",
      tip: "A strong core protects your lower back. Start with 20 seconds." },
    { id: 5, name: "Shoulder Press", muscle: "Shoulders", picture: "images/exercises/ex-press.svg",
      tip: "Keep your back against the bench when you press weights above your head." },
    { id: 6, name: "Biceps Curl", muscle: "Arms", picture: "images/exercises/ex-curl.svg",
      tip: "Lift slowly and do not swing your body: slow lifting trains the muscle better." }
];


/* ---------- 2. Game variables (the "state" of the game) ---------- */
var deck = [];            // the 12 cards in their shuffled order
var firstCard = null;     // the number (index) of the first open card, or null
var secondCard = null;    // the number of the second open card, or null
var locked = false;       // true while two wrong cards are being shown
var moves = 0;            // one move = turning over two cards
var pairsFound = 0;
var seconds = 0;
var timer = null;         // the setInterval() timer, null when stopped


/* ---------- 3. Make the 12 cards ----------
   For every exercise we add a "picture" card and a "name" card.     */
function makeDeck() {
    var cards = [];
    for (var i = 0; i < exercises.length; i++) {
        cards.push({ pairId: exercises[i].id, kind: "picture", exercise: exercises[i], open: false, matched: false });
        cards.push({ pairId: exercises[i].id, kind: "name", exercise: exercises[i], open: false, matched: false });
    }
    return cards;
}


/* ---------- 4. Shuffle (mix) the cards ----------
   We go from the last card to the first and swap each card with a
   random card before it (or with itself). Every order is possible.  */
function shuffle(cards) {
    for (var i = cards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));   // a random number from 0 to i
        var temp = cards[i];                            // swap card i and card j
        cards[i] = cards[j];
        cards[j] = temp;
    }
    return cards;
}


/* ---------- 5. Draw the board (create the HTML of the cards) ---------- */
function drawBoard() {
    var board = document.getElementById("board");
    board.innerHTML = "";                               // remove the old cards

    for (var i = 0; i < deck.length; i++) {
        // a Bootstrap column: 3 cards per row on phones, 4 on tablets, 6 on computers
        var col = document.createElement("div");
        col.className = "col-4 col-md-3 col-lg-2";

        // the card is a <button>, so it also works with the keyboard
        var button = document.createElement("button");
        button.type = "button";
        button.id = "card" + i;
        button.setAttribute("data-index", i);           // remember which card it is
        button.addEventListener("click", cardClicked);

        // the Bootstrap "ratio ratio-1x1" box keeps every card square
        var square = document.createElement("div");
        square.className = "ratio ratio-1x1";
        square.appendChild(button);

        col.appendChild(square);
        board.appendChild(col);
        drawCard(i);                                    // fill the card's content
    }
}


/* ---------- 6. Draw ONE card (face down, open or matched) ---------- */
function drawCard(index) {
    var card = deck[index];
    var button = document.getElementById("card" + index);
    var base = "btn rounded-4 w-100 h-100 p-2 d-flex flex-column align-items-center justify-content-center shadow-sm ";

    if (card.open == false && card.matched == false) {
        // FACE DOWN: green card with the logo and a question mark
        button.className = base + "btn-success bg-gradient";
        button.innerHTML = '<img src="images/logo.svg" alt="" width="40" height="40" class="mb-1" />' +
                           '<span class="fs-4 fw-bold">?</span>';
        button.setAttribute("aria-label", "Hidden card " + (index + 1));
    } else {
        // FACE UP: white card (or light green when it is matched)
        if (card.matched) {
            button.className = base + "btn-light border border-3 border-success bg-success-subtle";
        } else {
            button.className = base + "btn-light border border-3 border-warning";
        }

        if (card.kind == "picture") {
            button.innerHTML = '<img src="' + card.exercise.picture + '" alt="' +
                               card.exercise.name + '" class="img-fluid rounded" />';
        } else {
            button.innerHTML = '<span class="fw-bold text-success">' + card.exercise.name + '</span>' +
                               '<span class="badge text-bg-warning mt-1">' + card.exercise.muscle + '</span>';
        }
        button.setAttribute("aria-label", card.exercise.name + " (" + card.kind + ")");
    }
}


/* ---------- 7. What happens when a card is clicked ---------- */
function cardClicked() {
    var index = Number(this.getAttribute("data-index"));
    var card = deck[index];

    // ignore the click if: the game is waiting, or the card is already open / matched
    if (locked || card.open || card.matched) {
        return;
    }

    // start the timer at the very first click
    if (timer == null) {
        timer = setInterval(tick, 1000);                // call tick() every 1000 ms = 1 second
    }

    // turn the card over
    card.open = true;
    drawCard(index);

    if (firstCard == null) {
        firstCard = index;                              // this is the first card of the move
        return;
    }

    // this is the second card: one move is finished
    secondCard = index;
    moves++;
    updateScore();
    checkPair();
}


/* ---------- 8. Check if the two open cards are a pair ---------- */
function checkPair() {
    var a = deck[firstCard];
    var b = deck[secondCard];

    if (a.pairId == b.pairId) {
        // A MATCH: both cards stay open and turn light green
        a.matched = true;
        b.matched = true;
        a.open = false;
        b.open = false;
        drawCard(firstCard);
        drawCard(secondCard);
        pairsFound++;
        showTip(a.exercise);
        firstCard = null;
        secondCard = null;
        updateScore();

        if (pairsFound == exercises.length) {
            gameWon();
        }
    } else {
        // NOT A MATCH: wait 0.9 seconds so the player can see them, then turn them back
        locked = true;
        setTimeout(function () {
            deck[firstCard].open = false;
            deck[secondCard].open = false;
            drawCard(firstCard);
            drawCard(secondCard);
            firstCard = null;
            secondCard = null;
            locked = false;
        }, 900);
    }
}


/* ---------- 9. Timer, score and progress bar ---------- */
function tick() {
    seconds++;
    document.getElementById("time").textContent = formatTime(seconds);
}

// 75 seconds -> "1:15"
function formatTime(totalSeconds) {
    var min = Math.floor(totalSeconds / 60);
    var sec = totalSeconds % 60;                        // % = the remainder
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ":" + sec;
}

function updateScore() {
    document.getElementById("moves").textContent = moves;
    document.getElementById("pairs").textContent = pairsFound + " / " + exercises.length;

    // the progress bar: percent of pairs found
    var percent = Math.round(pairsFound / exercises.length * 100);
    var bar = document.getElementById("progressBar");
    bar.style.width = percent + "%";                    // changed by JavaScript while playing
    bar.textContent = percent + "%";
    document.getElementById("progressBox").setAttribute("aria-valuenow", percent);
}


/* ---------- 10. Show a fitness tip after every match ---------- */
function showTip(exercise) {
    var box = document.getElementById("tipBox");
    box.className = "alert alert-success mt-3 mb-0";
    box.innerHTML = "<strong>Match! " + exercise.name + " &ndash; " + exercise.muscle + ".</strong> " + exercise.tip;
}


/* ---------- 11. The end of the game ---------- */
function gameWon() {
    clearInterval(timer);                               // stop the timer
    timer = null;

    // stars depend on the number of moves (6 is the best possible)
    var stars;
    if (moves <= 9) {
        stars = 3;
    } else if (moves <= 14) {
        stars = 2;
    } else {
        stars = 1;
    }

    // best score is saved in the browser (localStorage); try/catch because
    // some browsers block it (for example in private windows)
    var best = null;
    try {
        best = localStorage.getItem("nashaatBestMoves");
        if (best == null || moves < Number(best)) {
            localStorage.setItem("nashaatBestMoves", moves);
            best = moves;
        }
    } catch (error) {
        best = null;
    }

    var message = "You found all " + exercises.length + " pairs in " + moves +
                  " moves and " + formatTime(seconds) + ". " +
                  "⭐".repeat(stars);                 // a star emoji, repeated
    if (best != null) {
        message = message + " Your best: " + best + " moves.";
    }

    document.getElementById("winText").textContent = message;
    document.getElementById("winBox").classList.remove("d-none");
    showBest();
}

function showBest() {
    var best = null;
    try {
        best = localStorage.getItem("nashaatBestMoves");
    } catch (error) {
        best = null;
    }
    document.getElementById("best").textContent = (best == null) ? "-" : best;
}


/* ---------- 12. Start a new game ---------- */
function newGame() {
    clearInterval(timer);
    timer = null;
    deck = shuffle(makeDeck());
    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    pairsFound = 0;
    seconds = 0;

    document.getElementById("time").textContent = "0:00";
    document.getElementById("winBox").classList.add("d-none");
    document.getElementById("tipBox").className = "alert alert-light border mt-3 mb-0";
    document.getElementById("tipBox").textContent = "Find a pair to read a fitness tip here.";

    updateScore();
    drawBoard();
    showBest();
}


/* ---------- 13. Start ---------- */
document.getElementById("newGameBtn").addEventListener("click", newGame);
document.getElementById("playAgainBtn").addEventListener("click", newGame);
newGame();
