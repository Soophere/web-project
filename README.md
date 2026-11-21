# Nashaat Gym Website

COMP3700 Project Part III. A website for the Nashaat gym in Al Ansab, Muscat,
styled only with Bootstrap 5 and made interactive with our own JavaScript.

Website: https://nashaat-gym.netlify.app/
GitHub Pages: https://soophere.github.io/web-project/
GitHub: https://github.com/hazza-albadi/web-project

Team (Section 01):
- Sulaiman Nasser (144524)
- Hazza Hamdan Albadi (144644)
- Yazn Khamis Alhajri (145411)

## Pages

- index.html - home page: photo slideshow, links to the new pages, moving welcome banner
- about.html - about us, the facilities and the email link
- plans.html - plans table made with JavaScript, add + search forms, FAQ, registration form
- classes.html - timetable made with JavaScript, add + search forms, booking form
- trainers.html - our trainers and the personal training times
- workout.html - exercise library and the beginner plan
- questionnaire.html - NEW: feedback form with our own JavaScript validation
- calculator.html - NEW: membership cost calculator
- funpage.html - NEW: Gym Memory Match game
- contact.html - contact details, map and the contact form (sends by email)
- dashboard.html - login, workout history, log workout form, progress pop-up

## Files

- bootstrap/ - Bootstrap 5.3.3 and Bootstrap Icons 1.11.3 (local copies, so the site works without internet)
- js/validation.js - Bootstrap validation for the normal forms
- js/plans.js - Plan object, plans array, table, add and search
- js/classes.js - GymClass object, classes array, table, add and search
- js/questionnaire.js - feedback form validation with patterns
- js/calculator.js - membership cost calculator
- js/funpage.js - memory game
- js/banner.js - moving welcome banner with the date and time, welcome toast
- js/workout.js - muscle group filter in the workout library
- js/effects.js - animations, back-to-top button, tooltips, dark / light mode
- images/ - logo, slideshow, trainer, exercise and facility pictures
- docs/ - our Part I report and the page screenshots

There is no CSS file: all the styling uses Bootstrap classes.

## Part III requirements - where to find them

| Requirement | Where |
|---|---|
| Bootstrap grid | every page (container, row, col-*) |
| No custom CSS | no .css file of our own, no style tags, no style attributes |
| Form styling + Bootstrap validation | all forms (form-control, form-select, invalid-feedback, js/validation.js) |
| Interactive components | carousel (index), accordion (plans), modal (questionnaire, dashboard), offcanvas menu (phones), toast (index), tooltips (footer) |
| Responsive navbar | every page, links to all pages |
| Two object types (constructors) | Plan in js/plans.js, GymClass in js/classes.js |
| Two arrays with real data | plans (6 plans), classes (12 classes) |
| Two functions that add rows | addPlanRow + showPlans, addClassRow + showClasses |
| Add form + search form | plans.html and classes.html |
| Questionnaire page | questionnaire.html + js/questionnaire.js |
| Calculator page | calculator.html + js/calculator.js |
| Fun page | funpage.html + js/funpage.js |
| Moving banner with date and time | bottom of index.html, js/banner.js |
| Slideshow (3+ photos, 3 seconds) | top of index.html (4 photos) |

## Extra features (beyond the requirements)

- Dark / light mode button (Bootstrap 5.3 colour modes, the choice is remembered)
- Animations made with JavaScript only: page entrance, scroll reveal, counting numbers, card lift
- Muscle group filter in the workout library
- Search forms are validated too (letters only, price range)
- "Skip to main content" link for keyboard users, and animations stop when the device asks for reduced motion
- Colours follow our Part I identity: teal #0E6B57 / #0B5242 in the header and footer pictures, orange for actions

## Who did what

| Member | Work | % |
|---|---|---|
| Sulaiman Nasser | index (slideshow, banner), about, contact, questionnaire page | 33.3 |
| Hazza Hamdan Albadi | plans and classes (objects, arrays, tables), trainers, calculator, GitHub | 33.3 |
| Yazn Khamis Alhajri | workout, dashboard, fun page, publishing | 33.3 |

## How to open it

Double click index.html. It opens in any browser, no server needed.
