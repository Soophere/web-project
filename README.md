# Nashaat Gym Website - COMP3700 Project Part II

Static website (HTML + CSS only, no JavaScript) for the Nashaat gym.
Open `index.html` in a browser to start.

Team (Section 01): Sulaiman Nasser (144524), Hazza Hamdan Albadi (144644), Yazn Khamis Alhajri (145411)

## Folder structure

```
nashaat-fitness/
  index.html            Home page (menu to all pages)
  about.html            About Us + EMAIL LINK (mailto)
  contact.html          Contact Us + form that sends to an email (mailto)
  plans.html            Table 1 (plans) + Form 1 (registration)
  classes.html          Table 2 (timetable) + Form 2 (class booking)
  trainers.html         Trainer cards + Table 3 (personal training times)
  workout.html          Exercise library + Table 4 (beginner plan)
  dashboard.html        Form 3 (login) + Form 4 (log workout) + Table 5 (history)
  css/
    style.css           EXTERNAL style sheet used by all pages
  images/
    logo.svg            Logo (header + browser tab icon)
    banner.svg          Home page banner
    trainers/           Trainer photos
    exercises/          Workout library pictures
    facilities/         Gym pictures for the About page
  docs/
    part1-proposal.pdf  Our Part I report
    screenshots/        Put the page screenshots for the Part II report here
  README.md             This file
  .gitignore            Files git must not upload
```

The HTML pages stay in the main folder because GitHub Pages and most free hosts
look for `index.html` there.

## Who works on what

| Member | Pages |
|---|---|
| Sulaiman Nasser | index, about, contact, css/style.css (header, menu, footer) |
| Hazza Albadi | plans, classes, trainers (tables), GitHub setup |
| Yazn Alhajri | workout, dashboard (forms), publishing on InfinityFree |

Each person commits their **own** changes, often (small commits are better than one big one).

## GitHub setup (do once)

1. **Hazza:** on github.com create a new repository called `nashaat-fitness`.
   Do NOT tick "Add a README" (we already have one).
   Make it **Public** so GitHub Pages is free (private needs GitHub Pro / Student Pack).
2. Open **GitHub Desktop** -> File -> *Add local repository* -> choose this folder.
   (The folder is already a git repository.)
3. Write a summary like `Part II: first version of the website` -> **Commit to main** -> **Publish repository**.
4. On github.com: Settings -> Collaborators -> add **Sulaiman**, **Yazn** and the instructor **ahmadSQU**.
5. **Sulaiman and Yazn:** accept the invitation email, then in GitHub Desktop:
   File -> *Clone repository* -> `nashaat-fitness`.

## Daily work (everyone)

1. **Fetch / Pull origin** before you start (get your teammates' changes).
2. Edit your pages.
3. Write a clear summary, e.g. `Add booking form to classes page` -> **Commit to main**.
4. **Push origin**.

Tip: do not edit the same file as a teammate at the same time. The header, menu and
footer are on every page, so agree who changes them.

## Publishing

- **GitHub Pages:** repository Settings -> Pages -> Source: *Deploy from a branch* ->
  Branch `main`, folder `/ (root)` -> Save. The site appears at
  `https://<username>.github.io/nashaat-fitness/` after 1-2 minutes.
- **InfinityFree:** upload everything except `docs/` into the `htdocs` folder using the
  online File Manager (or FileZilla).

Put both links in the report.

## Where each requirement is (use this for the report)

**3 types of CSS**
- External: `css/style.css`, linked in the `<head>` of every page
- Internal: the `<style>` block in the `<head>` of every page
- Inline: `style="..."` e.g. index.html map box, plans.html "Not included" cell, form titles

**7 selectors (from the slides)**
- Simple: `body`, `h1, h2`, `p`, `ul, ol` (style.css section 2)
- Class: `p.note`, `p.intro`, `span.badge`, `table.data` (sections 7 and 8)
- Generic: `.card`, `.button`, `.center`, `.highlight` (section 6)
- id: `#header`, `#menu`, `#main`, `#footer`, `#banner`
- Universal: `*` (section 1)
- Contextual: `#menu a`, `#header img`, `table.data th`, `#footer .row div`
- Pseudo classes: `a:link`, `a:visited`, `a:hover`, `a:active`, `a:focus`, `input:focus`, `tr:hover`

**7 property categories (2+ each)**
- Fonts: font-family, font-size, font-weight, font-style, letter-spacing
- Lists: list-style-type, list-style-position
- Alignment: text-align, text-indent, float
- Color: color, opacity
- Background: background-color, background-image, background-repeat, background-position
- Margin: margin, margin-top, margin-bottom, margin-left
- Border: border, border-radius, border-collapse, border-spacing

**Link events**: `#menu a:link / :visited / :hover / :active / :focus` in style.css section 4.

**Tables** (5 tables, all with colspan/rowspan, thead/tbody/tfoot, caption,
border, cellspacing, cellpadding, colours): plans, classes, trainers, workout, dashboard
(+ a small team table in about.html).

**Forms**
- Contact form -> `mailto:` (contact.html)
- Registration, Class booking, Login, Log workout -> `https://httpbin.org/get`
- Controls used: text, password, email, tel, date, number, range, radio,
  checkbox, select (drop-down), select multiple size="3", textarea, hidden,
  submit, reset, input type="button", button tag, fieldset, legend, label.

**Responsive**: viewport meta tag on every page + `@media (max-width: 768px)` in style.css section 11.

## Before submitting
- Replace `info@nashaat.om` and the phone number with real ones (search all files).
- Replace the SVG pictures in `images/` with real photos (small JPG files) and update `src`.
- Keep the whole folder under 100 MB.
