/* =====================================================================
   effects.js  -  Small animations used on every page
   ---------------------------------------------------------------------
   All the styling on the website comes from Bootstrap, so the small
   movements are made with JavaScript instead of CSS. The site uses:

   1. Page entrance : the title area slides up softly when the page opens
   2. Scroll reveal : cards, tables and titles fade in when you scroll to them
   3. Count up      : numbers like "12" count from 0 up to 12
   4. Hover lift    : cards move up a little when the mouse is over them
   5. Back to top   : a round button appears after you scroll down
   6. Tooltips      : small labels on the footer icons (Bootstrap tooltips)
   7. Dark mode     : the moon / sun button switches Bootstrap's dark colours

   element.animate(steps, options) is the "Web Animations" function that
   is built into every modern browser. It moves or fades an element
   without any CSS file.

   If the user turned on "reduce motion" in their phone or computer
   settings, we skip the animations (some people feel sick with movement).
   ===================================================================== */

// true when the user asked their device for less movement
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- helper: fade an element in while it moves up ----------
   delay = how many milliseconds to wait before starting            */
function fadeUp(element, delay) {
    element.animate(
        [
            { opacity: 0, transform: "translateY(24px)" },   // start: invisible, 24px lower
            { opacity: 1, transform: "translateY(0)" }       // end: visible, normal place
        ],
        { duration: 600, delay: delay, easing: "ease-out", fill: "both" }
    );
}


/* ---------- 1. PAGE ENTRANCE ----------
   Every element marked with data-enter has children that appear one
   after the other (0 ms, 120 ms, 240 ms ...).                       */
function pageEntrance() {
    var groups = document.querySelectorAll("[data-enter]");
    for (var g = 0; g < groups.length; g++) {
        var children = groups[g].children;
        for (var i = 0; i < children.length; i++) {
            fadeUp(children[i], 120 * i);
        }
    }
}


/* ---------- 2. SCROLL REVEAL ----------
   IntersectionObserver tells us when an element comes onto the screen.
   We hide the elements first, and show each one when it is reached.  */
function scrollReveal() {
    // the things we want to reveal (not inside the menu, the hero or pop-ups)
    var list = document.querySelectorAll("main .card, main h2, main .table-responsive, main .alert, main .accordion");
    var items = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].closest(".modal") == null && list[i].closest(".card .card") == null) {
            items.push(list[i]);
        }
    }

    // if the browser is very old, do nothing (everything stays visible)
    if (!("IntersectionObserver" in window)) {
        return;
    }

    var watcher = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                var el = entries[i].target;
                // it was hidden with the Bootstrap class "opacity-0"; show it again first
                el.classList.remove("opacity-0");
                // cards next to each other start a little later (a "wave")
                var delay = Number(el.getAttribute("data-delay")) || 0;
                fadeUp(el, delay);
                watcher.unobserve(el);            // animate only once
            }
        }
    }, { threshold: 0.12 });

    for (var j = 0; j < items.length; j++) {
        items[j].classList.add("opacity-0");      // hidden until it is reached
        // position in its row: 0, 1, 2, 3 -> 0, 90, 180, 270 ms
        var column = items[j].closest("[class*='col-']");
        if (column != null && column.parentElement != null) {
            var index = Array.prototype.indexOf.call(column.parentElement.children, column);
            items[j].setAttribute("data-delay", (index % 4) * 90);
        }
        watcher.observe(items[j]);
    }
}


/* ---------- 3. COUNT UP ----------
   <span data-count="180">180</span> counts 0 -> 180 in about 1.2 seconds */
function countUp(element) {
    var target = Number(element.getAttribute("data-count"));
    var suffix = element.getAttribute("data-suffix") || "";   // e.g. "%"
    var start = null;
    var duration = 1200;

    function step(time) {
        if (start == null) {
            start = time;
        }
        var progress = Math.min((time - start) / duration, 1);   // 0 ... 1
        var eased = 1 - Math.pow(1 - progress, 3);                // fast first, slow at the end
        element.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);                          // next frame
        }
    }
    requestAnimationFrame(step);
}

function startCounters() {
    var numbers = document.querySelectorAll("[data-count]");
    for (var i = 0; i < numbers.length; i++) {
        countUp(numbers[i]);
    }
}


/* ---------- 4. HOVER LIFT ----------
   Cards that are links or have h-100 move up 6px when the mouse is over them */
function hoverLift() {
    var cards = document.querySelectorAll("main .card.h-100");
    for (var i = 0; i < cards.length; i++) {
        // forms do not move (it would be strange while typing)
        if (cards[i].querySelector("form") != null || cards[i].tagName == "FORM") {
            continue;
        }
        cards[i].addEventListener("mouseenter", function () {
            this.animate([{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }],
                         { duration: 200, fill: "forwards", easing: "ease-out" });
            this.classList.add("shadow");            // a bigger shadow (Bootstrap class)
        });
        cards[i].addEventListener("mouseleave", function () {
            this.animate([{ transform: "translateY(-6px)" }, { transform: "translateY(0)" }],
                         { duration: 200, fill: "forwards", easing: "ease-out" });
            this.classList.remove("shadow");
        });
    }
}


/* ---------- 5. BACK TO TOP BUTTON ---------- */
function backToTop() {
    var button = document.getElementById("toTop");
    if (button == null) {
        return;
    }
    // show the button only after 400px of scrolling (d-none = hidden)
    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            button.classList.remove("d-none");
        } else {
            button.classList.add("d-none");
        }
    });
    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ---------- 6. BOOTSTRAP TOOLTIPS ----------
   Bootstrap tooltips must be switched on with JavaScript.            */
function startTooltips() {
    var list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    for (var i = 0; i < list.length; i++) {
        new bootstrap.Tooltip(list[i]);
    }
}


/* ---------- 7. DARK / LIGHT MODE ----------
   Bootstrap 5.3 has two colour modes. Writing data-bs-theme="dark" on the
   <html> tag changes every Bootstrap colour to the dark version.
   We remember the choice in localStorage, so the next page opens the same way
   (the small script in the <head> reads it before the page is drawn).     */
function themeButton() {
    var button = document.getElementById("themeToggle");
    if (button == null) {
        return;
    }
    var html = document.documentElement;          // the <html> tag

    // show a sun in dark mode (click = go light) and a moon in light mode
    function updateIcon() {
        var dark = html.getAttribute("data-bs-theme") == "dark";
        button.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }

    button.addEventListener("click", function () {
        var newTheme = (html.getAttribute("data-bs-theme") == "dark") ? "light" : "dark";
        html.setAttribute("data-bs-theme", newTheme);
        try {
            localStorage.setItem("nashaatTheme", newTheme);
        } catch (error) {
            // storage is blocked (private window): the choice works only on this page
        }
        updateIcon();
    });
    updateIcon();
}


/* ---------- Start everything ---------- */
themeButton();
startTooltips();
backToTop();
if (reduceMotion == false) {
    pageEntrance();
    scrollReveal();
    startCounters();
    hoverLift();
}
