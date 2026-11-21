/* =====================================================================
   questionnaire.js  -  Feedback form validation (questionnaire.html)
   ---------------------------------------------------------------------
   We check the form with our OWN rules (regular expressions = patterns).
   Every rule is different:

     Field             Rule
     ---------------   -------------------------------------------------
     Full name         2 to 4 words, letters only (English or Arabic)
     Email             name@domain.ext  (ext = 2 or more letters)
     Phone             Omani mobile: 8 digits starting with 7 or 9,
                       "+968" or "00968" in front is allowed
     Membership no.    optional, but if written: NSH- and 4 digits
     Visit date        a real date, not in the future, not before 2024
     Rating            one of the 5 radio buttons must be chosen
     Liked             at least ONE checkbox must be ticked
     Comment           15 to 500 characters and NO web links

   How it works:
   - Each field has its own "check" function. It returns an error
     message (text) when the value is wrong, or "" when it is correct.
   - showResult() colours the field red (is-invalid) or green (is-valid)
     using Bootstrap classes and writes the message under the field.
   - The fields are checked while the user types (event "input"), and
     all of them again when the user presses "Send Feedback".
   - If everything is correct, a Bootstrap modal (pop-up window) shows a
     thank-you message with a short summary of the answers.
   ===================================================================== */


/* ---------- 1. The patterns (regular expressions) ----------
   ^ = start of the text, $ = end of the text
   [ ] = one of these characters, { } = how many times, ? = optional,
   + = one or more times, \d = a digit (0-9)                           */

// one word = letters only. A-Z, a-z and the Arabic letters (ء-ي)
// the name = one word, then 1 to 3 more words with ONE space before each
var namePattern = /^[A-Za-zء-ي]{2,}( [A-Za-zء-ي]{2,}){1,3}$/;

// letters/digits/dots before the @, a domain, a dot, then 2+ letters
var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// optional +968 or 00968, then 7 or 9, then exactly 7 more digits
var phonePattern = /^(\+968|00968)?[79]\d{7}$/;

// the letters NSH, a dash, then exactly 4 digits (e.g. NSH-1024)
var memberPattern = /^NSH-\d{4}$/;

// a web link: http:// or https:// or www. (we do NOT allow links in comments)
var linkPattern = /(https?:\/\/|www\.)/i;


/* ---------- 2. One check function for each field ---------- */

function checkName() {
    var value = document.getElementById("fbName").value.trim();
    if (value == "") {
        return "Please write your name.";
    }
    if (namePattern.test(value) == false) {
        return "Write 2 to 4 words using letters only, e.g. Salim Al Habsi.";
    }
    return "";                                   // "" = no error
}

function checkEmail() {
    var value = document.getElementById("fbEmail").value.trim();
    if (value == "") {
        return "Please write your email.";
    }
    if (emailPattern.test(value) == false) {
        return "This email is not correct. Example: salim@gmail.com";
    }
    return "";
}

function checkPhone() {
    // remove spaces first, so "9123 4567" is also accepted
    var value = document.getElementById("fbPhone").value.replace(/\s/g, "");
    if (value == "") {
        return "Please write your phone number.";
    }
    if (phonePattern.test(value) == false) {
        return "Use an Omani mobile number: 8 digits starting with 7 or 9 (you can add +968).";
    }
    return "";
}

function checkMember() {
    var value = document.getElementById("fbMember").value.trim().toUpperCase();
    // this field is OPTIONAL: an empty value is correct
    if (value == "") {
        return "";
    }
    if (memberPattern.test(value) == false) {
        return "The membership number looks like NSH-1024 (NSH, a dash and 4 digits).";
    }
    return "";
}

function checkDate() {
    var value = document.getElementById("fbDate").value;      // "2026-11-20" or ""
    if (value == "") {
        return "Please choose the date of your last visit.";
    }
    var visit = new Date(value);
    var today = new Date();
    var first = new Date("2024-01-01");                      // the gym opened in 2024
    if (visit > today) {
        return "The date cannot be in the future.";
    }
    if (visit < first) {
        return "The date cannot be before 2024.";
    }
    return "";
}

function checkRating() {
    // querySelector finds the radio button that is checked (or null if none)
    var chosen = document.querySelector('input[name="rating"]:checked');
    if (chosen == null) {
        return "Please choose a rating from 1 to 5.";
    }
    return "";
}

function checkLiked() {
    // count how many checkboxes with name="liked" are ticked
    var ticked = document.querySelectorAll('input[name="liked"]:checked');
    if (ticked.length == 0) {
        return "Please tick at least one thing you liked.";
    }
    return "";
}

function checkComment() {
    var value = document.getElementById("fbComment").value.trim();
    if (value.length < 15) {
        return "Please write at least 15 characters (you wrote " + value.length + ").";
    }
    if (value.length > 500) {
        return "Please write 500 characters or less.";
    }
    if (linkPattern.test(value)) {
        return "Please do not add web links in the comment.";
    }
    return "";
}


/* ---------- 3. showResult(): colour a field and write the message ----------
   fieldId   = id of the input (or of the group of radio buttons / checkboxes)
   messageId = id of the <div class="invalid-feedback"> under the field
   message   = the text from a check function ("" = correct)              */
function showResult(fieldId, messageId, message) {
    var field = document.getElementById(fieldId);
    var box = document.getElementById(messageId);

    if (message == "") {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");         // green border
        box.textContent = "";
        return true;
    } else {
        field.classList.remove("is-valid");
        field.classList.add("is-invalid");       // red border + shows the message
        box.textContent = message;
        return false;
    }
}


/* ---------- 4. A list of all the fields, so we can loop over them ----------
   each item: [ id of the field, id of the message box, its check function ] */
var allChecks = [
    ["fbName", "nameError", checkName],
    ["fbEmail", "emailError", checkEmail],
    ["fbPhone", "phoneError", checkPhone],
    ["fbMember", "memberError", checkMember],
    ["fbDate", "dateError", checkDate],
    ["ratingGroup", "ratingError", checkRating],
    ["likedGroup", "likedError", checkLiked],
    ["fbComment", "commentError", checkComment]
];

// checks ONE item of the list above
function checkOne(item) {
    var message = item[2]();                     // call the check function
    return showResult(item[0], item[1], message);
}


/* ---------- 5. Check while the user types ----------
   For every field we listen for "input" (typing) and "change" (clicking).
   We use a function that returns a function, so each listener remembers
   its own item from the list.                                            */
function makeListener(item) {
    return function () {
        checkOne(item);
    };
}

for (var i = 0; i < allChecks.length; i++) {
    var element = document.getElementById(allChecks[i][0]);
    element.addEventListener("input", makeListener(allChecks[i]));
    element.addEventListener("change", makeListener(allChecks[i]));
}


/* ---------- 6. Live counters (dynamic text) ---------- */

// the slider value is written next to the slider
document.getElementById("fbRecommend").addEventListener("input", function () {
    document.getElementById("recommendValue").textContent = this.value;
});

// how many characters are in the comment box
document.getElementById("fbComment").addEventListener("input", function () {
    document.getElementById("charCount").textContent = this.value.length + " / 500";
});


/* ---------- 7. Submit: check ALL fields ---------- */
function sendFeedback(event) {
    event.preventDefault();                      // we do not reload the page

    var allOk = true;
    var firstWrong = null;

    for (var i = 0; i < allChecks.length; i++) {
        var ok = checkOne(allChecks[i]);
        if (ok == false) {
            allOk = false;
            if (firstWrong == null) {
                firstWrong = allChecks[i][0];    // remember the first wrong field
            }
        }
    }

    if (allOk == false) {
        // scroll to the first wrong field so the user can fix it
        document.getElementById(firstWrong).scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById("formError").classList.remove("d-none");   // show the red alert
        return;
    }
    document.getElementById("formError").classList.add("d-none");          // hide the red alert

    // ----- everything is correct: build the summary for the pop-up -----
    var name = document.getElementById("fbName").value.trim();
    var rating = Number(document.querySelector('input[name="rating"]:checked').value);
    var visits = document.getElementById("fbVisits").value;
    var recommend = document.getElementById("fbRecommend").value;

    // make the list of the ticked checkboxes, e.g. "Trainers, Classes"
    var ticked = document.querySelectorAll('input[name="liked"]:checked');
    var likedList = [];
    for (var j = 0; j < ticked.length; j++) {
        likedList.push(ticked[j].value);
    }

    // a different thank-you message depending on the rating (if / else if / else)
    var reply;
    if (rating >= 4) {
        reply = "We are very happy you enjoy Nashaat!";
    } else if (rating == 3) {
        reply = "Thank you. We will work to make your visits even better.";
    } else {
        reply = "We are sorry. The manager will read your comment and contact you.";
    }

    // "★" is a full star and "☆" an empty star; repeat() repeats the text
    var stars = "★".repeat(rating) + "☆".repeat(5 - rating);

    document.getElementById("modalName").textContent = name.split(" ")[0];
    document.getElementById("modalReply").textContent = reply;
    document.getElementById("modalStars").textContent = stars;
    document.getElementById("modalVisits").textContent = visits;
    document.getElementById("modalLiked").textContent = likedList.join(", ");
    document.getElementById("modalRecommend").textContent = recommend + " / 10";

    // open the Bootstrap modal with JavaScript
    var popup = new bootstrap.Modal(document.getElementById("thanksModal"));
    popup.show();

    // clear the form and the green / red colours
    clearColours();
    document.getElementById("feedbackForm").reset();
    document.getElementById("recommendValue").textContent = "8";
    document.getElementById("charCount").textContent = "0 / 500";
}

// remove the green and red colours from all fields
function clearColours() {
    for (var i = 0; i < allChecks.length; i++) {
        var field = document.getElementById(allChecks[i][0]);
        field.classList.remove("is-valid");
        field.classList.remove("is-invalid");
    }
    document.getElementById("formError").classList.add("d-none");
}


/* ---------- 8. Connect the form ---------- */
document.getElementById("feedbackForm").addEventListener("submit", sendFeedback);
document.getElementById("feedbackForm").addEventListener("reset", clearColours);

// the date field cannot go past today: we set its "max" to today's date
// (the date field needs the format YYYY-MM-DD, e.g. 2026-11-21)
var now = new Date();
var month = String(now.getMonth() + 1).padStart(2, "0");   // months start at 0, so +1
var day = String(now.getDate()).padStart(2, "0");          // "5" becomes "05"
document.getElementById("fbDate").max = now.getFullYear() + "-" + month + "-" + day;
