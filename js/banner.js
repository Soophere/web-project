/* =====================================================================
   banner.js  -  Moving welcome banner at the bottom of index.html
   ---------------------------------------------------------------------
   1. Every second, we write a new message with today's date and the
      current time, e.g.
      "Welcome to the Nashaat Gym website! Today is Saturday, 21 November 2026,
       and the time is 6:05:12 PM"
   2. Every 20 milliseconds, we move the text 2 pixels to the LEFT.
      When the text has gone out on the left side, it starts again
      from the right side. This makes it move from right to left.
   3. When the mouse is over the banner, it stops so it can be read.
   ===================================================================== */

var bannerText = document.getElementById("welcomeText");   // the moving <p>
var bannerBox = document.getElementById("welcomeBanner");  // the box around it
var position = bannerBox.offsetWidth;   // start at the right edge of the box
var paused = false;                     // true while the mouse is over the banner


/* ---------- 1. Write the message with the date and time ---------- */
function updateMessage() {
    var now = new Date();               // the date and time right now

    // date in words, e.g. "Saturday, 21 November 2026"
    var dateText = now.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    // time with seconds, e.g. "6:05:12 PM"
    var timeText = now.toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit"
    });

    bannerText.textContent = "Welcome to the Nashaat Gym website! Today is " + dateText +
                             ", and the time is " + timeText + ". Move • Track • Improve";
}


/* ---------- 2. Move the text a little to the left ---------- */
function moveBanner() {
    if (paused) {
        return;                          // do not move while the mouse is over it
    }

    position = position - 2;             // 2 pixels to the left

    // offsetWidth = the width of the text in pixels.
    // When the whole text is out on the left, start again at the right edge.
    if (position < -bannerText.offsetWidth) {
        position = bannerBox.offsetWidth;
    }

    // translateX moves the text sideways without changing the page layout
    bannerText.style.transform = "translateX(" + position + "px)";
}


/* ---------- 3. Stop on mouse over, continue on mouse out ---------- */
bannerBox.addEventListener("mouseover", function () {
    paused = true;
});
bannerBox.addEventListener("mouseout", function () {
    paused = false;
});


/* ---------- 4. Start the two timers ---------- */
updateMessage();                         // show the message straight away
setInterval(updateMessage, 1000);        // then update the time every second
setInterval(moveBanner, 20);             // and move the text 50 times a second


/* ---------- 5. A Bootstrap TOAST (small pop-up) after 2 seconds ----------
   It tells visitors about the new calculator page. */
setTimeout(function () {
    var toast = new bootstrap.Toast(document.getElementById("welcomeToast"));
    toast.show();
}, 2000);
