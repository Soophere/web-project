/* =====================================================================
   plans.js  -  Membership plans table (plans.html)
   ---------------------------------------------------------------------
   What this file does:
   1. Defines the object type "Plan" with a constructor function.
   2. Keeps all our plans in an array called "plans" (the real prices
      from the Part II table).
   3. Shows the array in the empty table using TWO functions:
         addPlanRow()  - adds ONE row for ONE plan
         showPlans()   - clears the table and calls addPlanRow() for
                         every plan in a list
   4. Lets the user ADD a new plan (form "Add a Plan").
   5. Lets the user SEARCH the plans (form "Search Plans").
   6. Checks that the two passwords in the registration form are the same.
   ===================================================================== */


/* ---------- 1. OBJECT TYPE: Plan (constructor function) ----------
   "new Plan(...)" creates a new object with these properties.
   this.xxx = the property of the new object.                         */
function Plan(category, name, months, price, classes, ptSessions) {
    this.category = category;       // "Standard", "Student" or "Visitor"
    this.name = name;               // name of the plan, e.g. "Monthly"
    this.months = months;           // how long the plan is (0 = one day only)
    this.price = price;             // price in Omani Rial (OMR)
    this.classes = classes;         // true = group classes are included
    this.ptSessions = ptSessions;   // free personal training sessions

    // a METHOD (a function inside the object): the length as text
    this.durationText = function () {
        if (this.months == 0) {
            return "1 day";
        } else if (this.months == 1) {
            return "1 month";
        } else {
            return this.months + " months";
        }
    };

    // a METHOD: the price for one month (rounded to 2 decimals)
    this.pricePerMonth = function () {
        if (this.months == 0) {
            return "-";                               // a day pass has no monthly price
        }
        return (this.price / this.months).toFixed(2);
    };
}


/* ---------- 2. ARRAY of Plan objects (our real plans) ---------- */
var plans = [
    new Plan("Standard", "Monthly", 1, 20, true, 0),
    new Plan("Standard", "Quarter", 3, 55, true, 1),
    new Plan("Standard", "Half Year", 6, 100, true, 2),
    new Plan("Standard", "Yearly", 12, 180, true, 4),
    new Plan("Student", "Student Monthly", 1, 15, true, 0),
    new Plan("Visitor", "Day Pass", 0, 3, false, 0)
];


/* ---------- 3a. FUNCTION 1: add ONE row to the table ----------
   plan   = one Plan object
   number = the row number shown in the first column               */
function addPlanRow(plan, number) {
    // the <tbody> of the empty table in plans.html
    var tableBody = document.getElementById("plansBody");

    // insertRow() adds a new <tr> at the end of the table body
    var row = tableBody.insertRow();

    // insertCell() adds a new <td> to the row; we fill each one with text
    row.insertCell().textContent = number;
    row.insertCell().textContent = plan.category;

    // the plan name is bold: we make a <strong> element and put it in the cell
    var nameCell = row.insertCell();
    var bold = document.createElement("strong");
    bold.textContent = plan.name;
    nameCell.appendChild(bold);

    row.insertCell().textContent = plan.durationText();

    // price in orange-brown (Bootstrap class "text-warning-emphasis")
    var priceCell = row.insertCell();
    priceCell.textContent = plan.price.toFixed(2);
    priceCell.className = "fw-bold text-warning-emphasis";

    row.insertCell().textContent = plan.pricePerMonth();

    // group classes: a green "Yes" badge or a grey "No" badge
    var classesCell = row.insertCell();
    if (plan.classes == true) {
        classesCell.innerHTML = '<span class="badge text-bg-success">Yes</span>';
    } else {
        classesCell.innerHTML = '<span class="badge text-bg-secondary">No</span>';
    }

    // personal training: "-" when there are no free sessions
    if (plan.ptSessions == 0) {
        row.insertCell().textContent = "-";
    } else {
        row.insertCell().textContent = plan.ptSessions + " session(s)";
    }
}


/* ---------- 3b. FUNCTION 2: show a whole list of plans ----------
   list = an array of Plan objects (all plans, or only search results) */
function showPlans(list) {
    var tableBody = document.getElementById("plansBody");

    // remove the old rows first, so rows are not shown twice
    tableBody.innerHTML = "";

    // nothing found: show one row with a message across all 8 columns
    if (list.length == 0) {
        var row = tableBody.insertRow();
        var cell = row.insertCell();
        cell.colSpan = 8;
        cell.className = "text-center text-danger py-3";
        cell.textContent = "No plans match your search.";
    }

    // a for loop: call addPlanRow() for every plan in the list
    for (var i = 0; i < list.length; i++) {
        addPlanRow(list[i], i + 1);
    }

    // update the small counter under the table
    document.getElementById("planCount").textContent =
        "Showing " + list.length + " of " + plans.length + " plans";
}


/* ---------- 4. ADD a new plan from the form ---------- */
function addNewPlan(event) {
    event.preventDefault();               // do not reload the page
    var form = event.target;

    // Bootstrap validation: show red / green fields if something is wrong
    form.classList.add("was-validated");
    if (form.checkValidity() == false) {
        return;                           // stop here, the user must fix the form
    }

    // read the values from the form fields
    var category = document.getElementById("newCategory").value;
    var name = document.getElementById("newName").value.trim();
    var months = Number(document.getElementById("newMonths").value);
    var price = Number(document.getElementById("newPrice").value);
    var classes = document.getElementById("newClasses").checked;
    var pt = Number(document.getElementById("newPt").value);

    // create a NEW Plan object and add it to the END of the array
    var newPlan = new Plan(category, name, months, price, classes, pt);
    plans.push(newPlan);

    // show the updated array in the table (uses the two functions)
    showPlans(plans);

    // show a green message, then clear the form
    showMessage("addMessage", "The plan \"" + name + "\" was added to the table.", "success");
    form.reset();
    form.classList.remove("was-validated");
}


/* ---------- 5. SEARCH the plans ---------- */
function searchPlans(event) {
    event.preventDefault();

    // Bootstrap validation for the search form too (e.g. letters only, a sensible price)
    var form = event.target;
    form.classList.add("was-validated");
    if (form.checkValidity() == false) {
        return;                           // show the red message and stop
    }

    // what the user typed (small letters, so "YEAR" also finds "Yearly")
    var text = document.getElementById("searchText").value.trim().toLowerCase();
    var maxPrice = document.getElementById("searchMaxPrice").value;   // "" when empty
    var onlyClasses = document.getElementById("searchClasses").checked;

    var results = [];                     // the plans that match will go here

    for (var i = 0; i < plans.length; i++) {
        var p = plans[i];

        // rule 1: the name or the category contains the text (or no text typed)
        var textOk = (text == "") ||
                     p.name.toLowerCase().indexOf(text) >= 0 ||
                     p.category.toLowerCase().indexOf(text) >= 0;

        // rule 2: the price is not higher than the maximum (or no maximum typed)
        var priceOk = (maxPrice == "") || (p.price <= Number(maxPrice));

        // rule 3: if the box is ticked, the plan must include group classes
        var classesOk = (onlyClasses == false) || (p.classes == true);

        // the plan is added only if ALL three rules are true (&& = AND)
        if (textOk && priceOk && classesOk) {
            results.push(p);
        }
    }

    showPlans(results);
}

// "Show all" button: clear the search and show the full array again
function clearSearch() {
    document.getElementById("searchForm").reset();
    document.getElementById("searchForm").classList.remove("was-validated");
    showPlans(plans);
}


/* ---------- helper: show a Bootstrap alert message ----------
   boxId = id of the empty <div> where the message goes
   type  = "success" (green) or "danger" (red)                      */
function showMessage(boxId, text, type) {
    var box = document.getElementById(boxId);
    box.className = "alert alert-" + type + " mt-3 mb-0";
    box.textContent = text;
}


/* ---------- 6. Registration form: the two passwords must match ---------- */
function checkPasswords() {
    var pass1 = document.getElementById("regPass");
    var pass2 = document.getElementById("regPass2");

    // setCustomValidity("text") marks the field as WRONG for Bootstrap;
    // setCustomValidity("") marks it as correct again
    if (pass2.value != "" && pass1.value != pass2.value) {
        pass2.setCustomValidity("The passwords are not the same.");
        return false;
    } else {
        pass2.setCustomValidity("");
        return true;
    }
}

// "Check Passwords" button: tell the user the result in a message
function passwordButton() {
    if (document.getElementById("regPass").value == "") {
        showMessage("passMessage", "Please type a password first.", "danger");
    } else if (checkPasswords() == true && document.getElementById("regPass2").value != "") {
        showMessage("passMessage", "Good, the two passwords are the same.", "success");
    } else {
        showMessage("passMessage", "The two passwords are not the same, or the second one is empty.", "danger");
    }
}


/* ---------- 7. Start: connect the forms to the functions ---------- */
document.getElementById("addPlanForm").addEventListener("submit", addNewPlan);
document.getElementById("searchForm").addEventListener("submit", searchPlans);
document.getElementById("showAllBtn").addEventListener("click", clearSearch);
document.getElementById("regPass").addEventListener("input", checkPasswords);
document.getElementById("regPass2").addEventListener("input", checkPasswords);
document.getElementById("checkPassBtn").addEventListener("click", passwordButton);

// fill the table for the first time when the page opens
showPlans(plans);
