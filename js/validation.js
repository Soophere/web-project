/* =====================================================================
   validation.js  -  Bootstrap form validation for the normal forms
   ---------------------------------------------------------------------
   Used on: plans.html, classes.html, contact.html, dashboard.html

   How it works:
   1. Every form that should be checked has the class "needs-validation"
      and the attribute "novalidate" (this stops the browser's own
      pop-up messages, so Bootstrap can show its own messages).
   2. When the user presses Submit, the function checkForm() runs.
   3. checkForm() asks the browser if all the rules written in the HTML
      are OK (required, type="email", min, max, pattern ...).
   4. If something is wrong, we stop the form from being sent.
   5. We add the class "was-validated" to the form. Bootstrap then
      colours every field: green = correct, red = wrong, and shows the
      text inside <div class="invalid-feedback"> under the wrong fields.
   ===================================================================== */

// Step 1: get a list of all the forms that need checking on this page
var formsToCheck = document.querySelectorAll(".needs-validation");

// Step 2: give every form the same submit function
for (var i = 0; i < formsToCheck.length; i++) {
    formsToCheck[i].addEventListener("submit", checkForm);
}

// Step 3: this function runs when a form is submitted
function checkForm(event) {
    var form = event.target;          // the form that was submitted

    // checkValidity() returns true only if ALL fields follow their rules
    if (form.checkValidity() == false) {
        event.preventDefault();       // do not send the form
        event.stopPropagation();      // do not let other code react to this submit

        // move the cursor to the first wrong field, so the user sees it
        var firstWrong = form.querySelector(":invalid");
        if (firstWrong != null) {
            firstWrong.focus();
        }
    }

    // Step 4: tell Bootstrap to show the green / red colours and messages
    form.classList.add("was-validated");
}

// Step 5: when the user presses a Reset (Clear) button,
// remove the colours as well, so the form looks new again
for (var j = 0; j < formsToCheck.length; j++) {
    formsToCheck[j].addEventListener("reset", function (event) {
        event.target.classList.remove("was-validated");
    });
}
