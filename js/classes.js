/* =====================================================================
   classes.js  -  Weekly class timetable (classes.html)
   ---------------------------------------------------------------------
   What this file does:
   1. Defines the object type "GymClass" with a constructor function.
   2. Keeps all the classes of the week in an array called "classes"
      (the real timetable from the Part II table).
   3. Shows the array in the empty table using TWO functions:
         addClassRow()  - adds ONE row for ONE class
         showClasses()  - clears the table and calls addClassRow() for
                          every class in a list
   4. Lets the user ADD a new class (form "Add a Class").
   5. Lets the user SEARCH the timetable (form "Search the Timetable").
   6. Fills the drop-down menu of the booking form from the array.
   ===================================================================== */


/* ---------- 1. OBJECT TYPE: GymClass (constructor function) ---------- */
function GymClass(day, time, name, trainer, level, who, placesLeft) {
    this.day = day;                 // "Saturday" ... "Thursday"
    this.time = time;               // start time as text, e.g. "6:00 PM"
    this.name = name;               // name of the class, e.g. "HIIT Burn"
    this.trainer = trainer;         // first name of the trainer
    this.level = level;             // "Beginner", "Intermediate" or "All levels"
    this.who = who;                 // "Men", "Women" or "Mixed"
    this.placesLeft = placesLeft;   // free places (every class has 18 places)
    this.maxPlaces = 18;            // the same for all classes

    // a METHOD: true when there are no places left
    this.isFull = function () {
        return this.placesLeft == 0;
    };
}


/* ---------- 2. ARRAY of GymClass objects (our real timetable) ---------- */
var classes = [
    new GymClass("Saturday", "6:00 AM", "Morning Cardio", "Fatma", "Beginner", "Mixed", 10),
    new GymClass("Saturday", "6:00 PM", "HIIT Burn", "Ahmed", "Intermediate", "Men", 8),
    new GymClass("Saturday", "8:00 PM", "Yoga Flow", "Maryam", "All levels", "Women", 5),
    new GymClass("Sunday", "7:00 AM", "Strength Basics", "Khalid", "Beginner", "Men", 12),
    new GymClass("Sunday", "7:00 PM", "Zumba", "Fatma", "All levels", "Women", 0),
    new GymClass("Monday", "6:00 PM", "Boxing Fitness", "Ahmed", "Intermediate", "Men", 6),
    new GymClass("Monday", "8:00 PM", "Pilates", "Maryam", "Beginner", "Women", 9),
    new GymClass("Tuesday", "6:30 AM", "Core & Stretch", "Khalid", "All levels", "Mixed", 14),
    new GymClass("Tuesday", "7:00 PM", "HIIT Burn", "Ahmed", "Intermediate", "Men", 0),
    new GymClass("Wednesday", "6:00 PM", "Yoga Flow", "Maryam", "All levels", "Women", 7),
    new GymClass("Wednesday", "8:00 PM", "Strength Basics", "Khalid", "Beginner", "Men", 11),
    new GymClass("Thursday", "5:00 PM", "Family Fun Workout", "Fatma", "All levels", "Mixed", 15)
];


/* ---------- 3a. FUNCTION 1: add ONE row to the table ---------- */
function addClassRow(gymClass) {
    var tableBody = document.getElementById("classesBody");
    var row = tableBody.insertRow();          // new <tr>

    // simple text cells
    row.insertCell().textContent = gymClass.day;
    row.insertCell().textContent = gymClass.time;

    var nameCell = row.insertCell();
    nameCell.textContent = gymClass.name;
    nameCell.className = "fw-semibold";

    row.insertCell().textContent = gymClass.trainer;
    row.insertCell().textContent = gymClass.level;

    // "who can join" as a coloured badge, chosen with a switch statement
    var badgeColour;
    switch (gymClass.who) {
        case "Women":
            badgeColour = "text-bg-danger";
            break;
        case "Men":
            badgeColour = "text-bg-primary";
            break;
        default:                                  // "Mixed"
            badgeColour = "text-bg-success";
    }
    row.insertCell().innerHTML = '<span class="badge ' + badgeColour + '">' + gymClass.who + '</span>';

    // places left: red "FULL", orange when 5 or less, green otherwise
    var placesCell = row.insertCell();
    if (gymClass.isFull()) {
        placesCell.innerHTML = '<span class="badge text-bg-dark">FULL</span>';
        row.className = "table-secondary";        // the whole row is grey
    } else if (gymClass.placesLeft <= 5) {
        placesCell.innerHTML = '<span class="badge text-bg-warning">' +
            gymClass.placesLeft + ' / ' + gymClass.maxPlaces + '</span>';
    } else {
        placesCell.innerHTML = '<span class="badge text-bg-success">' +
            gymClass.placesLeft + ' / ' + gymClass.maxPlaces + '</span>';
    }
}


/* ---------- 3b. FUNCTION 2: show a whole list of classes ---------- */
function showClasses(list) {
    var tableBody = document.getElementById("classesBody");
    tableBody.innerHTML = "";                     // remove the old rows

    if (list.length == 0) {
        var row = tableBody.insertRow();
        var cell = row.insertCell();
        cell.colSpan = 7;
        cell.className = "text-center text-danger py-3";
        cell.textContent = "No classes match your search.";
    }

    // count the full classes while we add the rows
    var fullCount = 0;
    for (var i = 0; i < list.length; i++) {
        addClassRow(list[i]);
        if (list[i].isFull()) {
            fullCount++;
        }
    }

    // update the footer of the table
    document.getElementById("classCount").textContent = "Classes shown: " + list.length;
    document.getElementById("fullCount").textContent = "Full classes: " + fullCount;
}


/* ---------- 4. ADD a new class from the form ---------- */
function addNewClass(event) {
    event.preventDefault();
    var form = event.target;

    form.classList.add("was-validated");          // Bootstrap colours
    if (form.checkValidity() == false) {
        return;
    }

    // the time field gives "18:30"; we change it to "6:30 PM" like the other rows
    var time24 = document.getElementById("addTime").value;
    var parts = time24.split(":");                // ["18", "30"]
    var hour = Number(parts[0]);
    var minutes = parts[1];
    var ampm = "AM";
    if (hour >= 12) {
        ampm = "PM";
    }
    if (hour > 12) {
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    var time12 = hour + ":" + minutes + " " + ampm;

    // the checked radio button for "who can join"
    var who = document.querySelector('input[name="addWho"]:checked').value;

    var newClass = new GymClass(
        document.getElementById("addDay").value,
        time12,
        document.getElementById("addName").value.trim(),
        document.getElementById("addTrainer").value,
        document.getElementById("addLevel").value,
        who,
        Number(document.getElementById("addPlaces").value)
    );

    classes.push(newClass);                       // add to the end of the array
    showClasses(classes);                         // show the updated table
    fillBookingMenu();                            // the new class can be booked too

    showMessage("addMessage", "\"" + newClass.name + "\" on " + newClass.day +
                " was added to the timetable.", "success");
    form.reset();
    form.classList.remove("was-validated");
}


/* ---------- 5. SEARCH the timetable ---------- */
function searchClasses(event) {
    event.preventDefault();

    // Bootstrap validation for the search form too (e.g. letters only, a sensible price)
    var form = event.target;
    form.classList.add("was-validated");
    if (form.checkValidity() == false) {
        return;                           // show the red message and stop
    }

    var day = document.getElementById("searchDay").value;               // "" = any day
    var text = document.getElementById("searchText").value.trim().toLowerCase();
    var onlyFree = document.getElementById("searchFree").checked;

    var results = [];
    for (var i = 0; i < classes.length; i++) {
        var c = classes[i];

        var dayOk = (day == "") || (c.day == day);
        // the text can be part of the class name OR the trainer name (|| = OR)
        var textOk = (text == "") ||
                     c.name.toLowerCase().indexOf(text) >= 0 ||
                     c.trainer.toLowerCase().indexOf(text) >= 0;
        var freeOk = (onlyFree == false) || (c.isFull() == false);

        if (dayOk && textOk && freeOk) {
            results.push(c);
        }
    }
    showClasses(results);
}

function clearSearch() {
    document.getElementById("searchForm").reset();
    document.getElementById("searchForm").classList.remove("was-validated");
    showClasses(classes);
}


/* ---------- 6. fill the drop-down menu of the booking form ----------
   Only classes that are NOT full can be booked.                     */
function fillBookingMenu() {
    var menu = document.getElementById("bookClass");
    menu.innerHTML = '<option value="">Choose a class...</option>';

    for (var i = 0; i < classes.length; i++) {
        if (classes[i].isFull() == false) {
            var option = document.createElement("option");
            option.value = classes[i].day + " " + classes[i].time + " - " + classes[i].name;
            option.textContent = classes[i].day + " " + classes[i].time + " - " +
                                 classes[i].name + " (" + classes[i].who + ")";
            menu.appendChild(option);
        }
    }
}


/* ---------- helper: show a Bootstrap alert ---------- */
function showMessage(boxId, text, type) {
    var box = document.getElementById(boxId);
    box.className = "alert alert-" + type + " mt-3 mb-0";
    box.textContent = text;
}


/* ---------- 7. Start ---------- */
document.getElementById("addClassForm").addEventListener("submit", addNewClass);
document.getElementById("searchForm").addEventListener("submit", searchClasses);
document.getElementById("showAllBtn").addEventListener("click", clearSearch);

showClasses(classes);
fillBookingMenu();
