/* =====================================================================
   funpage.js  -  Gym Memory Match game (funpage.html)
   ---------------------------------------------------------------------
   What this file does:
   1. Holds the gym information in an array: 6 exercises and the muscle
      group that each one trains.
   2. Builds a deck of 12 cards: one "Exercise" card and one "Muscle"
      card for every pair, then shuffles the deck so the game is random.
   3. Draws the 12 cards inside the empty <div id="board"> with
      document.createElement(), so the whole board is made by JavaScript.
   4. Runs the game: two cards open, the same pair stays open, different
      cards close again after 0.9 second.
   5. Counts the moves, the time and the free peeks, and remembers the
      best game in localStorage (so it is still there after a refresh).
   6. Shows a Bootstrap MODAL when all 6 pairs are found.
   ===================================================================== */


/* ---------- 1. The gym information used by the game ----------
   Each pair = one exercise + the muscle group that it trains.      */
var pairs = [
    { exercise: "Bodyweight Squat", muscle: "Legs" },
    { exercise: "Push-up", muscle: "Chest" },
    { exercise: "Dumbbell Row", muscle: "Back" },
    { exercise: "Plank", muscle: "Core" },
    { exercise: "Shoulder Press", muscle: "Shoulders" },
    { exercise: "Biceps Curl", muscle: "Arms" }
];

var TOTAL_PAIRS = pairs.length;          // 6 pairs -> 12 cards


/* ---------- 2. The state of the game (the variables that change) ----------
   deck       : the 12 cards, each one is an object
   firstCard  : position of the first open card (null = no card open)
   secondCard : position of the second open card
   locked     : true while two cards are being compared, so the player
                cannot open a third card in that short moment
   moves      : how many times the player opened two cards
   matched    : how many pairs are already found
   seconds    : the game clock                                             */
var deck = [];
var firstCard = null;
var secondCard = null;
var locked = false;
var moves = 0;
var matched = 0;
var seconds = 0;
var timerId = null;
var peeksLeft = 3;

// the classes that every card button wears (Bootstrap only, no CSS file)
var CARD_BASE = "btn w-100 h-100 py-3 px-1 rounded-4 border-0 shadow-sm";


/* ---------- 3. Make the deck and shuffle it ----------
   Fisher-Yates shuffle: we walk from the last card to the first one and
   swap it with a random card that comes before it. After that every
   card has the same chance to be in every position.                */
function buildDeck() {
    deck = [];

    for (var i = 0; i < pairs.length; i++) {
        // the exercise card and the muscle card share the same pairId,
        // that is how we know later that they belong together
        deck.push({ pairId: i, kind: "Exercise", title: pairs[i].exercise, open: false, matched: false });
        deck.push({ pairId: i, kind: "Muscle", title: pairs[i].muscle, open: false, matched: false });
    }

    for (var j = deck.length - 1; j > 0; j--) {
        var random = Math.floor(Math.random() * (j + 1));      // 0 ... j
        var help = deck[j];
        deck[j] = deck[random];
        deck[random] = help;
    }
}


/* ---------- 4. Draw the board ----------
   We create one <div class="col"> and one <button> for every card.
   The buttons are empty (they only show "?" at the start), and we keep
   the position of the card in the data-index attribute.            */
function drawBoard() {
    var board = document.getElementById("board");
    board.innerHTML = "";                             // remove the old cards

    for (var i = 0; i < deck.length; i++) {
        var column = document.createElement("div");
        column.className = "col-4 col-md-3";

        var button = document.createElement("button");
        button.type = "button";
        button.className = CARD_BASE + " bg-success text-white";
        button.setAttribute("data-index", i);         // the position in the deck
        button.setAttribute("aria-label", "Card " + (i + 1));
        button.addEventListener("click", cardClicked);

        column.appendChild(button);
        board.appendChild(column);
    }

    drawAllCards();
}


/* ---------- 5. Paint the cards ----------
   One card can look in three ways:
   closed  = green with a "?"   (this is what the player sees at the start)
   open    = light with the text (the player turned it)
   matched = orange             (the pair is found, the card stays open)   */

// paints ONE card, index = position in the deck
function drawCard(index) {
    var board = document.getElementById("board");
    var button = board.querySelector('[data-index="' + index + '"]');
    var card = deck[index];

    if (card.matched == true) {
        button.className = CARD_BASE + " bg-warning text-dark";
        button.innerHTML = cardFace(card);
    } else if (card.open == true) {
        button.className = CARD_BASE + " bg-body border border-success border-2 text-success";
        button.innerHTML = cardFace(card);
    } else {
        button.className = CARD_BASE + " bg-success text-white";
        button.innerHTML = '<span class="fs-2 fw-bold lh-1 d-block">?</span>';
    }
}

// paints every card (used when the board is first drawn)
function drawAllCards() {
    for (var i = 0; i < deck.length; i++) {
        drawCard(i);
    }
}

// the text side of a card: a small badge (Exercise / Muscle) and the name
function cardFace(card) {
    return '<span class="badge text-bg-dark rounded-pill d-block mb-2 mx-auto">' + card.kind + '</span>' +
           '<span class="d-block fw-bold small lh-sm">' + card.title + '</span>';
}


/* ---------- 6. What happens when the player presses a card ---------- */
function cardClicked(event) {
    var index = Number(event.currentTarget.getAttribute("data-index"));
    var card = deck[index];

    // ignore the press when we are busy comparing two cards,
    // or when this card is already open or already matched
    if (locked == true || card.open == true || card.matched == true) {
        return;
    }

    // the clock starts with the very first card
    if (firstCard == null && secondCard == null) {
        startTimer();
    }

    card.open = true;                 // turn the card
    drawCard(index);

    // first card of the pair
    if (firstCard == null) {
        firstCard = index;
        say("Now turn a second card.", "info");
        return;
    }

    // second card: compare the two
    secondCard = index;
    moves++;
    document.getElementById("movesCount").textContent = moves;
    locked = true;                    // stop the player for a moment

    if (deck[firstCard].pairId == deck[secondCard].pairId) {
        // SAME PAIR: keep both cards open and orange
        deck[firstCard].matched = true;
        deck[secondCard].matched = true;
        matched++;

        drawCard(firstCard);
        drawCard(secondCard);
        updateBadge();

        var found = deck[firstCard].title + " - " + deck[secondCard].title;
        say("Good match! " + found + ".", "success");

        firstCard = null;
        secondCard = null;
        locked = false;

        if (matched == TOTAL_PAIRS) {
            winGame();
        }
    } else {
        // NOT THE SAME: show both for a moment, then close them again
        say("Not the same pair. They close again.", "warning");

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


/* ---------- 7. The clock ---------- */
function startTimer() {
    if (timerId != null) {
        return;                       // already running
    }
    timerId = setInterval(function () {
        seconds++;
        document.getElementById("timeCount").textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

// 75 -> "1:15"
function formatTime(total) {
    var minutes = Math.floor(total / 60);
    var rest = total % 60;
    if (rest < 10) {
        rest = "0" + rest;
    }
    return minutes + ":" + rest;
}


/* ---------- 8. The small messages and the pair counter ---------- */
function say(text, type) {
    var box = document.getElementById("gameMessage");
    box.className = "alert border-0 shadow-sm rounded-4 alert-" + type + " mt-4 mb-0";
    box.textContent = text;
}

function updateBadge() {
    document.getElementById("matchedBadge").textContent = matched + " / " + TOTAL_PAIRS + " pairs";
}


/* ---------- 9. Peek: show the whole board for two seconds ---------- */
function peek() {
    // no peeks left, or the player is in the middle of comparing two cards
    if (peeksLeft <= 0 || locked == true) {
        return;
    }

    peeksLeft--;
    document.getElementById("peekCount").textContent = peeksLeft;
    if (peeksLeft == 0) {
        document.getElementById("peekBtn").disabled = true;
    }

    locked = true;
    var shown = [];                   // the cards that we opened for the peek

    for (var i = 0; i < deck.length; i++) {
        if (deck[i].open == false && deck[i].matched == false) {
            deck[i].open = true;
            shown.push(i);
            drawCard(i);
        }
    }

    say("Remember the cards...", "info");

    setTimeout(function () {
        for (var j = 0; j < shown.length; j++) {
            deck[shown[j]].open = false;
            drawCard(shown[j]);
        }
        locked = false;
        say("The cards are closed again. " + peeksLeft + " peek(s) left.", "info");
    }, 2000);
}


/* ---------- 10. The best game (localStorage) ----------
   A result is better when it needs fewer moves; if the moves are the
   same, the faster game is the better one.
   try / catch is needed because some browsers block localStorage.  */
function readBest() {
    try {
        var text = localStorage.getItem("nashaatMemoryBest");
        if (text == null) {
            return null;
        }
        return JSON.parse(text);       // { moves: 12, seconds: 45 }
    } catch (error) {
        return null;
    }
}

function saveBest(result) {
    try {
        localStorage.setItem("nashaatMemoryBest", JSON.stringify(result));
    } catch (error) {
        // storage blocked: the best score just does not stay after a refresh
    }
}

function showBest() {
    var best = readBest();
    var box = document.getElementById("bestScore");
    if (best == null) {
        box.textContent = "no game finished yet";
    } else {
        box.textContent = best.moves + " moves in " + formatTime(best.seconds);
    }
}


/* ---------- 11. The player found all 6 pairs ---------- */
function winGame() {
    stopTimer();

    // 6 moves is a perfect game; more moves = fewer stars
    var stars = 3;
    if (moves > 10) {
        stars = 2;
    }
    if (moves > 14) {
        stars = 1;
    }

    // ★ filled star, ☆ empty star (repeat() writes the character n times)
    document.getElementById("winStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    document.getElementById("winText").textContent = "You found all " + TOTAL_PAIRS + " pairs!";
    document.getElementById("winDetails").textContent =
        "Moves: " + moves + "   |   Time: " + formatTime(seconds) + "   |   Peeks used: " + (3 - peeksLeft);

    // is this the best game so far?
    var best = readBest();
    var isBest = (best == null) || (moves < best.moves) || (moves == best.moves && seconds < best.seconds);
    document.getElementById("winBest").classList.toggle("d-none", isBest == false);

    if (isBest == true) {
        saveBest({ moves: moves, seconds: seconds });
        showBest();
    }

    say("All pairs found in " + moves + " moves!", "success");

    // open the Bootstrap modal (the pop-up window at the end of the page)
    new bootstrap.Modal(document.getElementById("winModal")).show();
}


/* ---------- 12. A new game ---------- */
function newGame() {
    stopTimer();

    firstCard = null;
    secondCard = null;
    locked = false;
    moves = 0;
    matched = 0;
    seconds = 0;
    peeksLeft = 3;

    document.getElementById("movesCount").textContent = "0";
    document.getElementById("timeCount").textContent = "0:00";
    document.getElementById("peekCount").textContent = "3";
    document.getElementById("peekBtn").disabled = false;

    updateBadge();
    showBest();
    buildDeck();
    drawBoard();
    say("Press any card to start. The timer starts with your first card.", "info");
}


/* ---------- 13. Start the page ---------- */
document.getElementById("restartBtn").addEventListener("click", newGame);
document.getElementById("peekBtn").addEventListener("click", peek);
document.getElementById("playAgainBtn").addEventListener("click", newGame);

newGame();                            // build the first deck when the page opens
