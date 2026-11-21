/* =====================================================================
   workout.js  -  Muscle group filter (workout.html)
   ---------------------------------------------------------------------
   Every exercise column has data-group="Legs" (or Chest, Back ...).
   Every filter button has data-group too. When a button is clicked:
     1. the clicked button becomes green (btn-success), the others white
     2. columns of other groups are hidden with the Bootstrap class d-none
     3. the visible cards fade in with a small animation
     4. the counter shows how many exercises are visible
   ===================================================================== */

var filterButtons = document.querySelectorAll("#filterButtons button");
var exerciseColumns = document.querySelectorAll("[data-group].col-md-6");

function filterExercises(group) {
    // 1. colour the buttons
    for (var i = 0; i < filterButtons.length; i++) {
        var isChosen = filterButtons[i].getAttribute("data-group") == group;
        filterButtons[i].classList.toggle("btn-success", isChosen);          // add OR remove
        filterButtons[i].classList.toggle("btn-outline-success", !isChosen);
        filterButtons[i].setAttribute("aria-pressed", isChosen);
    }

    // 2 + 3. show or hide the exercise columns
    var shown = 0;
    for (var j = 0; j < exerciseColumns.length; j++) {
        var column = exerciseColumns[j];
        if (group == "All" || column.getAttribute("data-group") == group) {
            column.classList.remove("d-none");
            shown++;
            // fade in (element.animate is built into the browser, no CSS needed)
            column.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "scale(1)" }],
                           { duration: 350, easing: "ease-out" });
        } else {
            column.classList.add("d-none");
        }
    }

    // 4. the counter, e.g. "1 exercise" or "6 exercises"
    document.getElementById("filterCount").textContent = shown + (shown == 1 ? " exercise" : " exercises");
}

// connect every button
for (var k = 0; k < filterButtons.length; k++) {
    filterButtons[k].addEventListener("click", function () {
        filterExercises(this.getAttribute("data-group"));
    });
}

// the links in the beginner plan table jump to a card: show all cards first,
// so the card the user wants is never hidden
var planLinks = document.querySelectorAll('table a[href^="#"]');
for (var m = 0; m < planLinks.length; m++) {
    planLinks[m].addEventListener("click", function () {
        filterExercises("All");
    });
}
