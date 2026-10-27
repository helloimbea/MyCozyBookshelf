# My Cozy Bookshelf — Project Plan

> This document is the project's source of truth. Before implementing anything,
> the AI must read this plan and follow the decisions described here. If a question
> is not answered here, ask before making something up.

## 1. Context

- The project was born as **"ajuda.me"**: a small self-help bookstore built with plain HTML and JavaScript.
- It is now being rewritten as a **fullstack** project: **Java Spring Boot** (backend) + **React** (frontend).
- **The core idea changed: IT IS NO LONGER A BOOKSTORE.**
- The name is now **"My Cozy Bookshelf"** (never use "ajuda.me" anywhere).

## 2. The new proposal

My Cozy Bookshelf is a **private bookshelf**: each user adds the books they have read
and writes the **reflections** each one left them with.

- It is personal and private: each user only sees their own books and reflections.
- The books are displayed **like a real shelf**, as if they were actually standing on a bookcase.
- The tone is warm, calm and intimate, like a reading nook.

### What no longer exists (do not implement)

- Shopping cart, prices, checkout, payment
- Promotions, discounts, "% OFF" badges, new-release banners
- Sales catalog / store window

## 3. Language

- **Everything in the repository is in English**: code, identifiers, comments, file names, routes, commit messages, README and this plan.
- **The site is in three languages: English, Spanish and Portuguese (Brazil).**
  - All UI text lives in `frontend/src/i18n/` (`messages.en.ts` is the reference; `messages.es.ts` and `messages.pt.ts` must have the same keys, which TypeScript checks).
  - New UI text must be added to the three files at once. Never hard-code visible text in components.
  - The starting language comes from the browser (English when it isn't Spanish or Portuguese). The person switches it on the globe button in the header (or in the side menu on mobile), and the choice is saved.
  - Dates and lists are formatted with `Intl` in the current language. API errors are codes (`AppError`) translated on screen.
  - The demo data, the reflection prompts and the genre names exist in the three languages.
- Every language keeps the same voice: **lowercase, warm, like a conversation**.

## 4. Visual identity

### Mascot
- The **chameleon** remains the main visual identity (logo in the header and big illustration on the login/sign-up screens).
- File: `frontend/src/assets/chameleon.png` (original in `AI Guide/Assets/camaleao.png`).

### Color palette
Keep the original palette. **Only the background color and specific details may change.**
Mint blue, green and brown are mandatory.

| Role                                | Color (approx., taken from the references) |
|-------------------------------------|--------------------------------------------|
| Mint blue (header)                  | `#8BF5D7`                                  |
| Blue (login/sign-up background)     | `#6ADCE4`                                  |
| Green (buttons / inputs)            | `#91EBC8`, `#A0D6B2`                       |
| Light mint green (cards)            | `#D3F4ED`, `#C0FFF1`                       |
| Brown (card frames)                 | `#B4A588`                                  |
| Brown (text / titles)               | `#756456`                                  |
| Header text (dark green)            | `#56756C`                                  |
| Beige (home background, header border) | `#E9E1D4`, `#D9D5A3`                    |

> The values above are a base; fine tone adjustments are allowed as long as the palette stays recognizable.

### Demo mode
- For visitors (e.g. portfolio), the **"see the demo"** button (on the home page and on login) opens a sample shelf with a "visitor" user, books with covers, reflections, books being read and a pinned reflection, in the current language.
- The demo shelf is rebuilt from scratch every time and shows a strip saying it is a demo, with a "create my shelf" button.
- The books live in `frontend/src/services/demoData.ts` and the covers in `frontend/public/demo/` (smaller versions of the images in `AI Guide/Assets/`). Titles match the Brazilian editions on the covers; summaries, tags, genres and reflections exist in the three languages. Summaries and reflections are original texts, not quotes from the books.

### Dark theme
- The site has a **light and a dark theme**. It starts with the system theme and the user switches it on the sun/moon button in the header; the choice is saved.
- Dark is a "reading nook at night": warm dark brown backgrounds, dark mint header, and **mint, green and brown stay as the identity** (green buttons, mint highlight text, brown bookcase wood and footer).
- Colors are CSS variables in `frontend/src/index.css` (`:root` and `:root[data-theme='dark']`). New screens and components must use these variables, never fixed colors, to work in both themes.
- Book covers (including the placeholder) keep the same colors in both themes.

### Plants
- Keep a few decorative plants (hanging pots and little pots), like in the original project.
- Files: `frontend/src/assets/hanging-plant.png` and `frontend/src/assets/potted-plant.png` (originals in `AI Guide/Assets/plantar.png` and `plantar2.png`).

### Typography
- **Quicksand** font (Google Fonts) — see `AI Guide/Assets/font.css`.
- Lowercase texts with an affectionate tone, like the original ("hi friend, so good to have you back!").

### Project voice: every book has a lesson
The core idea of the identity is that **every book teaches something**, not only self-help or psychology ones.
The site should inspire the user to look for lessons in novels, fantasy, classics and so on.

Guiding phrases (use sparingly, in a few chosen places, never on every screen):

| English | Portuguese | Spanish | Where |
|---|---|---|---|
| every book has a lesson | todo livro tem um aprendizado | todo libro tiene una enseñanza | home title for logged-out visitors and empty shelf message |
| there is something to learn from every book | temos algo a aprender com todos os livros | tenemos algo que aprender de todos los libros | footer |
| write down what you learned | escreva aqui o que você aprendeu | escribe aquí lo que aprendiste | subtitle of a book's reflections section |
| you don't need to finish the book to reflect | não precisa terminar o livro pra refletir | no hace falta terminar el libro para reflexionar | hint when marking a book as *reading* and on a book being read |

Where the idea shows up in practice:
- **Inspiring questions in the reflection field** (`frontend/src/utils/prompts.ts` + `prompts` in the i18n files): they change with the book's genre (fiction, non-fiction or general, recognized in the three languages) and the **"give me an idea"** button draws another one. E.g. for fiction, "which character taught you something?".
- **Empty states**: an empty shelf and a book without reflections invite the person to think about what the book taught them.
- **The chameleon**: it changes color depending on where it is and "picks up a little of the color of every book it reads", meaning every book leaves something in it. This sentence shows up with the mascot on the home page.
- **Demo mode**: fiction books show reflections with lessons, not only feelings.

### Style
- **Everything rounded and cute** (very rounded corners on cards, buttons, inputs, books).
- **Simple and minimalist**, no excess, nothing extra.
- **Flat**: avoid heavy gradients, strong shadows and flashy effects (soft shadows are fine).

## 5. Screens

The visual references of the original project are in `AI Guide/References/`
(`home.png`, `login.png`, `signin.png`).

Routes: `/` (home), `/login`, `/signup`, `/shelf`, `/add`, `/book/:id`.

### Header (every screen)
- **Keep it like the original**: mint blue background, chameleon + name on the left, links on the right, beige bottom border.
- The name is "my cozy bookshelf".
- **No shopping cart button.**
- Navigation buttons: `home`, `my shelf`, `add book`, `login` (or `log out` when logged in), the **language** globe button and the theme button.
- On mobile: only the logo, the theme button and a hamburger button that opens a side menu with the options (and the language choice at the bottom).

### Home
- **No promotions** and no carousel of books for sale.
- It is **customizable**: the user pins a reflection to the home page, either:
  - picking one of their existing reflections as a favorite, **or**
  - writing a new reflection just to pin there.
- Keep the original mood: light background, decorative plants, rounded central card.
- The pinned reflection is the home page's **main card**. Right below it, smaller, is the **"shelf memories"** carousel:
  - shows the user's other reflections (never the pinned one), newest first, with the book's cover and title; clicking opens the book;
  - changes on its own, slowly (every ~8 s, with a soft fade) and pauses on hover, on keyboard focus or when the system asks for "reduced motion";
  - has arrows and dots to navigate (above 8 reflections, a "3 / 17" counter instead of dots);
  - only shows up when there are 2 or more reflections to show.

### Login
- **Almost the same as the original** (`login.png`): big chameleon on the left, brown-framed card on the right.
- Only the adjustments needed to improve visual quality (alignment, spacing, "create account" link styled with the palette instead of the browser's default blue, etc.).

### Sign-up (create account)
- **Almost the same as the original** (`signin.png`): same fields (name, email, password with at least 8 characters, confirm password).
- Same rule: only adjustments to improve visual quality.

### Add book
- Form to add a book the user has read (or is reading).
- Adding must be quick: only what is required needs to be filled in right away. Optional fields can be filled in when adding or added/edited later.
- **Automatic book search**: while the user types the title, suggestions show up ("is it one of these?"). Picking one fills in title, author, cover, page count and genre (in the current language). The summary is **not** filled in, because it should be written in the user's own words.
  - Source: **Google Books** first; if it fails or finds nothing, **Open Library** (`frontend/src/services/bookSearch.ts`).
  - Optional Google key in `VITE_GOOGLE_BOOKS_API_KEY` (`frontend/.env.local`, see `.env.example`). It works without a key, but Google splits the quota by IP.
  - The search is only a helper: it can be ignored and everything filled in by hand.

| Field         | Required when adding? | Notes                                            |
|---------------|-----------------------|--------------------------------------------------|
| Title         | **yes**               | the only required field                          |
| Cover         | no                    | image (URL or upload); no cover → placeholder    |
| Author        | no                    |                                                  |
| Summary       | no                    | short text about the book                        |
| Reflection    | no                    | what the user felt/learned from the book         |
| Page count    | no                    | positive whole number                            |
| Genre         | no                    |                                                  |
| Tags          | no                    | several per book, created freely                 |
| Stars         | no                    | rating from 1 to 5                               |
| Reading       | starts as "read"      | "reading" or "read", always visible in the form |

**Placeholder cover:** when a book has no cover, the site shows a cute default cover
in the project's style (flat, rounded, in the palette colors, with a little leaf detail)
with the book title written on it. The placeholder is generated in the frontend, and in the
database the cover stays empty. As soon as the user adds a cover, it replaces the placeholder.

### Library / my shelf
- Shows all the user's books **as if they were on a real shelf** (books side by side on wooden shelves, in the site's cute/flat style).
- The user can **search books by title** and **filter by genre, tags or reading status** (ignoring case and accents). Only the matching books stay on the shelf.
- Clicking a book lets the user see/edit that book's reflections and complete or edit the optional fields (author, summary, pages, genre, tags, stars).
- Books being read have a **bookmark ribbon** on the cover. The header shows how many are "reading now".

### Reading in progress and final reflection
- **You don't need to finish a book to reflect on it.** When adding, the user picks **reading** or **read**, and can take notes while reading.
- Every reflection accepts an optional **page**: the page where the person stopped or the one that made them think about it. It shows as "p. 87" on the reflection and in the home carousel.
- On a book being read, the status **reading** and an **"i finished it"** button show up. It opens a small window (pop-up) with the chameleon asking for the book's **final reflection**, with its own questions ("what did this book teach you, from beginning to end?").
  - The final reflection is optional: the person can "finish without reflection" and write it later. Cancelling or pressing Esc does not finish the reading.
  - When finished, the book becomes **read on <date>**, and the final reflection is highlighted in the list.
- When editing a book, it can go back to "reading", and the finish date is cleared.

## 6. MVP

MVP scope (that's all for now):

1. User sign-up and login
2. New header (no cart, more buttons)
3. Add book (only the title is required; the other fields are optional)
4. Library with a shelf look (with title search and genre, tag and status filters)
5. Customized home page with the pinned reflection

Anything outside this list comes later — do not implement it without an explicit request.

## 7. Tech stack

| Folder      | Stack                                                                    |
|-------------|--------------------------------------------------------------------------|
| `backend/`  | Java 21, Spring Boot 4.1, Spring Data JPA, MySQL, Flyway, Actuator, Lombok |
| `frontend/` | React + Vite + TypeScript, React Router, own i18n (no extra libraries)   |

- The database schema is versioned with Flyway (`backend/src/main/resources/db/migration`); Hibernate runs in `validate` mode.
- Never edit a migration that may already have been applied (Flyway checks their checksum); create a new one instead.
- Vite forwards `/api/*` to the backend at `localhost:8080`.

### Data model (draft)
- **User**: name, email, password (hash).
- **Book**: belongs to a user.
  - Required: title, date added (automatic).
  - Optional (nullable): cover (URL or upload), author, summary, page count, genre, stars (1–5).
  - Tags: many-to-many relationship (a book has several tags; tags belong to the user).
- **Reflection**: belongs to a book; text, date, page (optional) and whether it is the final reflection.
- **Book reading**: status `reading`/`read` (books without a status count as read) and finish date.
- **Reflection pinned to home**: a reference to an existing reflection **or** a free text written just for the home page.

## 8. Rules for the AI

- Always follow this plan; if a request goes against the plan, say so before doing it.
- Never bring back store elements (cart, price, promotion).
- Never use the name "ajuda.me".
- Respect the palette, the chameleon, the plants and the rounded, cute, minimalist and flat style.
- Code, comments, file names, commits and docs in English.
- UI text only through the i18n files, always in the three languages, lowercase and warm.
