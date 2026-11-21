/* =====================================================================
   workout.js  -  Muscle group filter (workout.html)
   ---------------------------------------------------------------------
   The workout library shows 6 exercises. Each card has an attribute
   data-muscle="legs", "chest", "back", "core", "shoulders" or "arms".
   The 7 buttons above the cards call filterExercises():

   1. We read the group from the button (data-filter).
   2. We loop over every card:
        - the card belongs to the group (or the group is "all") -> show it
        - the card belongs to another group                     -> hide it
   3. Bootstrap class "d-none" = display none, so the hidden cards take
      no space and the grid moves the other cards up.
   4. We update the small line "Showing 3 of 6 exercises".
   5. We colour the button that was pressed green and the others white.
   ===================================================================== */

function filterExercises(group, pressedButton) {
    var cards = document.querySelectorAll("#exerciseList [data-muscle]");
    var shown = 0;                                   // how many cards stay visible

    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var cardGroup = card.getAttribute("data-muscle");

        if (group == "all" || cardGroup == group) {
            card.classList.remove("d-none");
            // js/effects.js hides the cards with "opacity-0" until they scroll
            // into view; a card that was hidden by this filter never scrolled,
            // so we make sure it is visible when we show it again
            card.classList.remove("opacity-0");
            shown++;
        } else {
            card.classList.add("d-none");
        }
    }

    // the counter under the buttons
    document.getElementById("filterCount").textContent =
        "Showing " + shown + " of " + cards.length + " exercises";

    // the pressed button becomes green (btn-success) and the others go back
    // to the white "outline" style
    var buttons = document.querySelectorAll("#filterButtons button");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("btn-success");
        buttons[j].classList.add("btn-outline-success");
    }
    pressedButton.classList.remove("btn-outline-success");
    pressedButton.classList.add("btn-success");
}


/* ---------- connect the 7 buttons to the function above ---------- */
var filterButtons = document.querySelectorAll("#filterButtons button");

for (var k = 0; k < filterButtons.length; k++) {
    filterButtons[k].addEventListener("click", function (event) {
        var group = event.currentTarget.getAttribute("data-filter");
        filterExercises(group, event.currentTarget);
    });
}
