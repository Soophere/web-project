/* =====================================================================
   calculator.js  -  Membership Cost Calculator (calculator.html)
   ---------------------------------------------------------------------
   WHY this page: before joining, members ask "how much will I really
   pay?". This page calculates the full price of a membership for one
   person or a group, with discounts, extra services and VAT.

   THE FORMULA
     1. Membership   = plan price  x  number of people
     2. Discount     = Membership  x  discount rate   (see the rules below)
     3. Personal training (PT) = paid sessions x 8 OMR
                       paid sessions = sessions wanted - free sessions in the plan
                                       (never less than 0)
     4. Towel service = 1 OMR x months x people   (only if ticked)
     5. Subtotal     = Membership - Discount + PT + Towel
     6. Instalment fee = 3% of the Subtotal (only when paying monthly)
     7. VAT          = 5% of (Subtotal + Instalment fee)
     8. TOTAL        = Subtotal + Instalment fee + VAT
     9. Per month    = TOTAL / months,  per person = TOTAL / people

   DISCOUNT RULES (only ONE main discount, checked from the top):
     - age 60 or more                         -> 20% (senior)
     - student AND age 25 or less             -> 15% (student)
     - 3 people or more                       -> 10% (group)
     - otherwise                              ->  0%
     + EXTRA 5% when the plan is 12 months AND there are 2 people or more

   PAYING MONTHLY is only allowed for plans of 6 months or more.
   ===================================================================== */


// ---------- fixed prices (constants) ----------
var PT_PRICE = 8;           // one personal training session, in OMR
var TOWEL_PRICE = 1;        // towel service, OMR per person per month
var VAT_RATE = 0.05;        // VAT in Oman is 5%
var INSTALMENT_RATE = 0.03; // 3% extra when paying monthly


/* ---------- 1. Get the plan details with a SWITCH statement ----------
   returns an object with the price, the months and the free PT sessions */
function getPlan(planCode) {
    var plan = {};
    switch (planCode) {
        case "monthly":
            plan.name = "Monthly";
            plan.price = 20;
            plan.months = 1;
            plan.freePt = 0;
            break;
        case "quarter":
            plan.name = "Quarter";
            plan.price = 55;
            plan.months = 3;
            plan.freePt = 1;
            break;
        case "half":
            plan.name = "Half Year";
            plan.price = 100;
            plan.months = 6;
            plan.freePt = 2;
            break;
        case "yearly":
            plan.name = "Yearly";
            plan.price = 180;
            plan.months = 12;
            plan.freePt = 4;
            break;
        default:
            plan = null;                        // no plan chosen
    }
    return plan;
}


/* ---------- 2. Choose the discount with IF / ELSE IF / ELSE ---------- */
function getDiscount(age, isStudent, people) {
    var result = { rate: 0, reason: "No discount" };

    if (age >= 60) {
        result.rate = 0.20;
        result.reason = "Senior discount (60+)";
    } else if (isStudent && age <= 25) {          // && = both must be true
        result.rate = 0.15;
        result.reason = "Student discount";
    } else if (people >= 3) {
        result.rate = 0.10;
        result.reason = "Group discount (3+ people)";
    } else {
        result.rate = 0;
        result.reason = "No discount";
    }
    return result;
}


/* ---------- 3. Round money to 3 decimals (Omani Rial has 1000 baisa) ---------- */
function money(amount) {
    return amount.toFixed(3) + " OMR";
}


/* ---------- 4. The main function: runs when the user presses "Calculate" ---------- */
function calculate(event) {
    event.preventDefault();                       // do not reload the page
    var form = document.getElementById("calcForm");

    // Bootstrap validation: red / green borders on the fields
    form.classList.add("was-validated");
    if (form.checkValidity() == false) {
        document.getElementById("resultCard").classList.add("d-none");
        return;
    }

    // ----- read the user's answers -----
    var plan = getPlan(document.getElementById("cPlan").value);
    var people = Number(document.getElementById("cPeople").value);
    var age = Number(document.getElementById("cAge").value);
    var isStudent = document.getElementById("cStudent").checked;
    var ptWanted = Number(document.getElementById("cPt").value);
    var towel = document.getElementById("cTowel").checked;
    var payMonthly = document.getElementById("payMonthly").checked;

    // ----- step 1: membership for all people -----
    var membership = plan.price * people;

    // ----- step 2: discount -----
    var discount = getDiscount(age, isStudent, people);
    var discountRate = discount.rate;
    var discountReason = discount.reason;

    // extra 5% for a yearly plan with 2 or more people (logical AND)
    if (plan.months == 12 && people >= 2) {
        discountRate = discountRate + 0.05;
        discountReason = discountReason + " + 5% yearly group bonus";
    }
    var discountAmount = membership * discountRate;

    // ----- step 3: personal training -----
    // the plan gives some free sessions (for each person), the rest are paid
    var freeSessions = plan.freePt * people;
    var paidSessions = ptWanted - freeSessions;
    if (paidSessions < 0) {
        paidSessions = 0;                         // cannot pay for less than 0 sessions
    }
    var ptCost = paidSessions * PT_PRICE;

    // ----- step 4: towel service (ternary operator: condition ? yes : no) -----
    var towelCost = towel ? TOWEL_PRICE * plan.months * people : 0;

    // ----- step 5: subtotal -----
    var subtotal = membership - discountAmount + ptCost + towelCost;

    // ----- step 6: paying monthly -----
    var instalmentFee = 0;
    var note = "";
    if (payMonthly && plan.months >= 6) {
        instalmentFee = subtotal * INSTALMENT_RATE;
    } else if (payMonthly && plan.months < 6) {
        // not allowed: we explain why and calculate as "pay in full"
        note = "Monthly payment is only for plans of 6 months or more, so this is calculated as one payment.";
        payMonthly = false;
    }

    // ----- step 7 and 8: VAT and total -----
    var vat = (subtotal + instalmentFee) * VAT_RATE;
    var total = subtotal + instalmentFee + vat;

    // ----- step 9: per month and per person -----
    var perMonth = total / plan.months;
    var perPersonMonth = perMonth / people;

    // ----- show the results in the table -----
    document.getElementById("rPlan").textContent =
        plan.name + " (" + plan.months + " month" + (plan.months > 1 ? "s" : "") + ") x " + people + " person(s)";
    document.getElementById("rMembership").textContent = money(membership);
    document.getElementById("rDiscountName").textContent =
        discountReason + " (" + Math.round(discountRate * 100) + "%)";
    document.getElementById("rDiscount").textContent = "- " + money(discountAmount);
    document.getElementById("rPtName").textContent =
        "Personal training: " + ptWanted + " wanted, " + Math.min(ptWanted, freeSessions) + " free, " + paidSessions + " paid";
    document.getElementById("rPt").textContent = money(ptCost);
    document.getElementById("rTowel").textContent = money(towelCost);
    document.getElementById("rSubtotal").textContent = money(subtotal);
    document.getElementById("rFee").textContent = money(instalmentFee);
    document.getElementById("rVat").textContent = money(vat);
    document.getElementById("rTotal").textContent = money(total);

    // big numbers at the top of the result card
    if (payMonthly) {
        document.getElementById("rBig").textContent = money(perMonth);
        document.getElementById("rBigLabel").textContent = "to pay every month for " + plan.months + " months";
    } else {
        document.getElementById("rBig").textContent = money(total);
        document.getElementById("rBigLabel").textContent = "to pay once at reception";
    }
    document.getElementById("rPerPerson").textContent = money(perPersonMonth);

    // the note (or hide it when there is no note)
    var noteBox = document.getElementById("rNote");
    if (note == "") {
        noteBox.classList.add("d-none");
    } else {
        noteBox.textContent = note;
        noteBox.classList.remove("d-none");
    }

    // a tip, chosen with more conditions (relational and logical operators)
    var tip;
    if (plan.months < 12 && people >= 2) {
        tip = "Tip: as a group, the Yearly plan gives you an extra 5% off.";
    } else if (ptWanted > freeSessions && plan.months < 12) {
        tip = "Tip: longer plans include free personal training sessions.";
    } else if (age < 60 && isStudent == false && people < 3) {
        tip = "Tip: bring 2 friends and get a 10% group discount.";
    } else {
        tip = "Great choice! You already get the best price for your situation.";
    }
    document.getElementById("rTip").textContent = tip;

    // show the result card (it is hidden with d-none at the start)
    var card = document.getElementById("resultCard");
    card.classList.remove("d-none");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
}


/* ---------- 5. Show / hide the student box ----------
   The "I am a student" switch is only useful for people aged 25 or less */
function updateStudentBox() {
    var age = Number(document.getElementById("cAge").value);
    var studentBox = document.getElementById("cStudent");
    if (age > 25) {
        studentBox.checked = false;
        studentBox.disabled = true;
    } else {
        studentBox.disabled = false;
    }
}


/* ---------- 6. Start ---------- */
document.getElementById("calcForm").addEventListener("submit", calculate);
document.getElementById("cAge").addEventListener("input", updateStudentBox);
document.getElementById("calcForm").addEventListener("reset", function () {
    document.getElementById("calcForm").classList.remove("was-validated");
    document.getElementById("resultCard").classList.add("d-none");
    document.getElementById("cStudent").disabled = false;
});
