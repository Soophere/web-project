/* =====================================================================
   dashboard.js  -  My Account page (dashboard.html)
   ---------------------------------------------------------------------
   What this file does:
   1. Keeps the workouts of the member in an array of objects, so the
      progress pop-up can use the numbers.
   2. Updates the small "7 / 10" badge when the energy slider moves.
   3. Shows a welcome message when the login form is correct.
   4. Adds a new row to "My Recent Workouts" when the member logs a
      workout, and updates the total minutes in the footer of the table.
   5. Builds the green progress bars inside the Bootstrap modal every
      time the member opens it.

   The red / green fields are Bootstrap's own validation, which is
   switched on in js/validation.js (the class "needs-validation").
   ===================================================================== */


/* ---------- 1. The workouts of the member (newest first) ---------- */
var workouts = [
    { date: "18 Oct 2026", type: "Strength", minutes: 50, weight: "82.0" },
    { date: "16 Oct 2026", type: "Group class", minutes: 45, weight: "-" },
    { date: "14 Oct 2026", type: "Cardio", minutes: 30, weight: "82.4" },
    { date: "12 Oct 2026", type: "Strength", minutes: 55, weight: "-" },
    { date: "10 Oct 2026", type: "Core & Stretch", minutes: 40, weight: "82.9" }
];


/* ---------- 2. The energy slider shows its value next to the label ---------- */
var moodSlider = document.getElementById("logMood");

moodSlider.addEventListener("input", function () {
    document.getElementById("moodValue").textContent = this.value + " / 10";
});


/* ---------- 3. LOGIN ----------
   The form is checked first (js/validation.js and the HTML rules).
   A real website would send the email and the password to a server;
   this is a student project, so we only show a welcome message.      */
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var form = event.target;

    if (form.checkValidity() == false) {
        return;                        // stay on the page, Bootstrap shows the red fields
    }

    var email = document.getElementById("loginEmail").value;
    var box = document.getElementById("loginMessage");
    box.className = "alert border-0 rounded-4 alert-success mt-3 mb-0";
    box.textContent = "Welcome back! You are logged in as " + email +
                      ". Your membership is active until 11 November 2026.";
});


/* ---------- 4. LOG A WORKOUT ---------- */

// 2026-11-21 -> "21 Nov 2026" (the format used in the table)
function prettyDate(value) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var parts = value.split("-");      // ["2026", "11", "21"]
    var day = Number(parts[2]);
    var month = months[Number(parts[1]) - 1];
    return day + " " + month + " " + parts[0];
}

// adds one line at the TOP of the tbody, so the newest workout is first
function addRowToTable(workout) {
    var body = document.getElementById("workoutBody");
    var row = body.insertRow(0);       // 0 = insert before the first row

    row.insertCell().textContent = workout.date;
    row.insertCell().textContent = workout.type;
    row.insertCell().textContent = workout.minutes;
    row.insertCell().textContent = workout.weight;
}

// writes the total minutes in the <tfoot> of the table
function updateTotal() {
    var total = 0;
    for (var i = 0; i < workouts.length; i++) {
        total = total + workouts[i].minutes;
    }
    document.querySelector("#workoutTable tfoot td").textContent = "Total time";
    document.querySelectorAll("#workoutTable tfoot td")[1].textContent = total + " min";
}

document.getElementById("logForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var form = event.target;

    if (form.checkValidity() == false) {
        return;                        // Bootstrap shows the red fields, nothing is added
    }

    // read the values from the form
    var dateValue = document.getElementById("logDate").value;      // "2026-11-21"
    var type = document.getElementById("logType").value;
    var minutes = Number(document.getElementById("logMinutes").value);
    var weightValue = document.getElementById("logWeight").value;  // "" when empty

    // create one object and put it in the array
    var workout = {
        date: prettyDate(dateValue),
        type: type,
        minutes: minutes,
        weight: (weightValue == "") ? "-" : Number(weightValue).toFixed(1)
    };
    workouts.unshift(workout);         // unshift = add at the beginning

    addRowToTable(workout);
    updateTotal();

    // a green message under the buttons
    var box = document.getElementById("logMessage");
    box.className = "alert border-0 rounded-4 alert-success mt-3 mb-0";
    box.textContent = "Saved: " + workout.type + " for " + workout.minutes +
                      " minutes on " + workout.date + ". The table and the progress pop-up are updated.";

    // clear the form and the colours
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById("moodValue").textContent = "7 / 10";
});

// the Clear button also hides the green message
document.getElementById("resetLog").addEventListener("click", function () {
    document.getElementById("logMessage").classList.add("d-none");
});


/* ---------- 5. THE PROGRESS POP-UP ----------
   Bootstrap needs a width for every progress bar. Instead of writing a
   style attribute we pick one of Bootstrap's width classes:
   60 minutes or more -> w-100, 45 or more -> w-75, 30 or more -> w-50,
   anything smaller -> w-25.                                          */
function widthClass(minutes) {
    if (minutes >= 60) {
        return "w-100";
    } else if (minutes >= 45) {
        return "w-75";
    } else if (minutes >= 30) {
        return "w-50";
    } else {
        return "w-25";
    }
}

function buildProgress() {
    var box = document.getElementById("progressBars");
    box.innerHTML = "";                // remove the bars of the last opening

    var total = 0;
    var best = workouts[0];

    // the array is newest first, so we walk backwards to draw the oldest first
    for (var i = workouts.length - 1; i >= 0; i--) {
        var workout = workouts[i];
        total = total + workout.minutes;

        if (workout.minutes > best.minutes) {
            best = workout;
        }

        // one block = the date and the type, then the green bar
        var block = document.createElement("div");

        var title = document.createElement("div");
        title.className = "d-flex justify-content-between small fw-semibold mb-1";
        title.innerHTML = '<span>' + workout.date + ' &middot; ' + workout.type + '</span>' +
                          '<span>' + workout.minutes + ' min</span>';

        var track = document.createElement("div");
        track.className = "progress";
        track.setAttribute("role", "progressbar");
        track.setAttribute("aria-label", workout.type + " on " + workout.date);
        track.setAttribute("aria-valuenow", workout.minutes);
        track.setAttribute("aria-valuemin", "0");
        track.setAttribute("aria-valuemax", "60");

        var bar = document.createElement("div");
        bar.className = "progress-bar bg-success " + widthClass(workout.minutes);
        bar.textContent = workout.minutes;

        track.appendChild(bar);
        block.appendChild(title);
        block.appendChild(track);
        box.appendChild(block);
    }

    document.getElementById("progressTotal").textContent = total + " minutes in total";
    document.getElementById("progressCount").textContent = workouts.length + " workouts";
    document.getElementById("progressBest").textContent = best.minutes + " minutes (" + best.type + ")";
}

// Bootstrap fires "show.bs.modal" every time the pop-up is opened
var progressModal = document.getElementById("progressModal");
progressModal.addEventListener("show.bs.modal", buildProgress);


/* ---------- 6. Start: today's date in the date field ---------- */
var today = new Date();
var month = String(today.getMonth() + 1).padStart(2, "0");   // months start at 0
var day = String(today.getDate()).padStart(2, "0");
document.getElementById("logDate").value = today.getFullYear() + "-" + month + "-" + day;

// the date cannot be in the future
document.getElementById("logDate").max = today.getFullYear() + "-" + month + "-" + day;

updateTotal();
