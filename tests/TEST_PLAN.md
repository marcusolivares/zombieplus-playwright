## ZombiePlus Application – Comprehensive Test Plan

### Application Overview

The ZombiePlus application is a media management and lead-capture platform focused on zombie-themed content. From the existing tests and helpers, the application provides:

- **Public Lead Capture**: Landing page at `/` with a “Aperte o play” call-to-action that opens a “Fila de espera” modal for collecting name and email.
- **Admin Authentication**: Login form at `/admin/login` using environment-configured admin credentials.
- **Movie Catalog Management**: Admin can register, search, and remove movies with fields like title, synopsis, company, year, cover image, and “featured” flag.
- **TV Show Catalog Management**: Admin can register, search, and remove TV shows with similar fields plus a seasons count.
- **Search and Listing**: Search for titles (e.g., “zombie”) in movies and TV shows and validate table contents.
- **Notifications and Validation**: Rich success and error messaging (alerts and SweetAlert popups), field-level validation, and duplicate-entry prevention.

---

## Global Assumptions and Test Basis

- **Environment / Data**
  - Database is reachable and can be reset between test runs (e.g., `DELETE FROM leads/movies/tvshows`).
  - Admin credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) are configured and valid.
  - Test fixtures for movies and TV shows exist and are representative of real content.
- **Browser / Device**
  - Tests are executed on modern desktop browsers (at least Chromium), at 100% zoom, default viewport.
- **Starting State**
  - Unless otherwise noted, each scenario starts from a **fresh browser session** and **empty relevant tables** (leads/movies/tvshows) or with data specifically seeded for that scenario.
- **User Roles**
  - **Anonymous User**: Can access the public landing page and submit leads.
  - **Admin User**: Authenticated via `/admin/login`, can manage movies, TV shows, and leads.

---

## 1. Lead Capture – Waiting Queue

### 1.1 Register Lead with Valid Name and Email

**Seed / Precondition:**
- `leads` table empty (no existing lead with target email).

**Steps:**
1. Navigate to the landing page `/`.
2. Click the “Aperte o play” button.
3. In the “Fila de espera” modal, fill `Nome` with a valid full name (e.g., “Maria da Silva”).
4. Fill `Email` with a valid email (e.g., `maria@example.com`).
5. Click “Quero entrar na fila!”.

**Expected Results:**
- Modal remains visible until submission is processed.
- A success popup appears with text matching `SUCCESS_MESSAGES.LEAD_SUCCESS`.
- No error alerts are shown on the lead form.
- Lead record is stored in `leads` with the given name and email.

---

### 1.2 Prevent Duplicate Lead by Email

**Seed / Precondition:**
- Insert an existing lead behind the scenes with `name = X`, `email = Y` (via API or SQL).
- Browser session starts fresh.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Fill `Nome` with any value (can match or differ from existing).
4. Fill `Email` with the previously registered email `Y`.
5. Click “Quero entrar na fila!”.

**Expected Results:**
- Form submission is processed.
- An error popup appears with text equal to `ERROR_MESSAGES.DUPLICATE_LEAD`.
- No new lead record is created in the database.
- Existing lead with email `Y` remains unchanged.

---

### 1.3 Reject Incorrect Email Format

**Seed / Precondition:**
- `leads` table empty.
- Browser session fresh.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Fill `Nome` with a valid value (e.g., “Marcus Olivares”).
4. Fill `Email` with an invalid email (e.g., `marcus.com.br`).
5. Click “Quero entrar na fila!”.

**Expected Results:**
- Submission does not succeed.
- An alert element (selector `SELECTORS.ALERT`) displays `ERROR_MESSAGES.INVALID_EMAIL`.
- No success popup is shown.
- No lead record is created in the database.

---

### 1.4 Reject Missing Name with Valid Email

**Seed / Precondition:**
- `leads` table empty.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Leave `Nome` empty.
4. Fill `Email` with a valid email (e.g., `marcus@yahoo.com`).
5. Click “Quero entrar na fila!”.

**Expected Results:**
- An alert displays `ERROR_MESSAGES.REQUIRED_FIELD`.
- No success popup is shown.
- No lead record is created.

---

### 1.5 Reject Missing Email with Valid Name

**Seed / Precondition:**
- `leads` table empty.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Fill `Nome` with a valid name (e.g., “Marcus Olivares”).
4. Leave `Email` empty.
5. Click “Quero entrar na fila!`.

**Expected Results:**
- An alert displays `ERROR_MESSAGES.REQUIRED_FIELD`.
- No success popup is shown.
- No lead record is created.

---

### 1.6 Reject Missing Name and Email

**Seed / Precondition:**
- `leads` table empty.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Leave both `Nome` and `Email` empty.
4. Click “Quero entrar na fila!”.

**Expected Results:**
- The alert area shows two required-field messages (e.g., array of `ERROR_MESSAGES.REQUIRED_FIELD`).
- No success popup is shown.
- No lead record is created.

---

### 1.7 Delete Lead from Admin Leads Queue

**Seed / Precondition:**
- A lead exists in `leads` with a known `name` and `email`.
  - Either create via UI (valid lead submission) or via API/SQL.

**Steps:**
1. As admin, log in with valid credentials.
2. Navigate to the admin leads page (e.g., via `a[href$="admin/leads"]`).
3. Locate the table row containing `Nome: <leadName> Email:` for the seeded lead.
4. Click the delete button in that row.
5. Confirm the removal (click element matching `SELECTORS.CONFIRM_REMOVAL`).

**Expected Results:**
- A SweetAlert popup appears with:
  - Title including “Tudo certo!”.
  - Message containing “Lead removido com sucesso.”.
- The deleted lead no longer appears in the leads table.
- Lead record is removed from the `leads` table.

---

## 2. Admin Login and Authentication

### 2.1 Successful Admin Login

**Seed / Precondition:**
- Valid admin credentials configured via environment variables.
- User is logged out.

**Steps:**
1. Navigate to `/admin/login`.
2. Verify the login form is visible (`SELECTORS.LOGIN_FORM`).
3. Fill `E-mail` with the admin email.
4. Fill `Senha` with the admin password.
5. Click the “Entrar” button.

**Expected Results:**
- User is redirected to the admin dashboard or landing area.
- The element matching `SELECTORS.LOGGED_USER` shows `LOGIN_STRINGS.USERNAME_GREETING('Admin')` (or correct username).
- No error alerts are shown.

---

### 2.2 Invalid Password

**Seed / Precondition:**
- Valid admin email; user logged out.

**Steps:**
1. Navigate to `/admin/login`.
2. Fill `E-mail` with valid admin email.
3. Fill `Senha` with an incorrect password.
4. Click “Entrar”.

**Expected Results:**
- Login fails; user remains on login page.
- An alert (e.g., `span[class$=alert]`) displays an appropriate error message (e.g., invalid credentials).
- `SELECTORS.LOGGED_USER` is not visible / does not show a logged-in greeting.

---

### 2.3 Invalid Email Format

**Seed / Precondition:**
- User logged out.

**Steps:**
1. Navigate to `/admin/login`.
2. Fill `E-mail` with an invalid email (e.g., `admin`).
3. Fill `Senha` with any value.
4. Click “Entrar”.

**Expected Results:**
- Client-side or server-side validation prevents successful login.
- An error alert appears describing invalid email format or general login failure.
- User remains unauthenticated.

---

### 2.4 Required Fields Validation

**Seed / Precondition:**
- User logged out.

**Steps:**
1. Navigate to `/admin/login`.
2. Leave both `E-mail` and `Senha` blank.
3. Click “Entrar”.

**Expected Results:**
- Validation errors appear for both fields (either inline or in an alert).
- No authentication occurs.
- User remains on login page.

---

## 3. Movie Catalog Management

### 3.1 Register New Movie (Happy Path)

**Seed / Precondition:**
- `movies` table empty (or at least no movie with the new title).
- Valid admin credentials.

**Steps:**
1. Log in as admin.
2. From admin area, navigate to the movie registration form (link ending with `register`).
3. Fill “Titulo do filme” with a unique title (e.g., from fixture `data.create.title`).
4. Fill “Sinopse” with movie overview.
5. Select company via the company dropdown (`SELECTORS.COMPANY_SELECT`).
6. Select release year via the year dropdown (`SELECTORS.YEAR_SELECT`).
7. Upload a cover image using the cover input (`SELECTORS.COVER_INPUT`), pointing to a valid fixture path.
8. Optionally toggle the “featured” switch (`SELECTORS.FEATURED_SWITCH`) according to fixture.
9. Click “Cadastrar”.

**Expected Results:**
- A success popup appears with text equal to `SUCCESS_MESSAGES.MOVIE_ADDED(title)`.
- New movie appears in the movie list (if navigated to listing).
- Entry exists in `movies` table with correct field values, including `featured` flag.

---

### 3.2 Remove Existing Movie

**Seed / Precondition:**
- Insert a movie via API/SQL using fixture `data.to_remove`.

**Steps:**
1. Log in as admin.
2. Navigate to the movies listing page.
3. Locate the row with the movie title specified in the fixture.
4. Click the delete button in that row.
5. Confirm the removal (click `.confirm-removal`).

**Expected Results:**
- A success popup appears with `SUCCESS_MESSAGES.MOVIE_REMOVED`.
- The movie row disappears from the listing.
- Movie is removed from the `movies` table.

---

### 3.3 Prevent Duplicate Movie Title

**Seed / Precondition:**
- Insert a movie using fixture `data.duplicate` via API/SQL (existing title).

**Steps:**
1. Log in as admin.
2. Navigate to the movie registration form.
3. Fill the form using the same `data.duplicate` fields (title, synopsis, company, year, cover).
4. Click “Cadastrar”.

**Expected Results:**
- No new movie record is created.
- An error popup appears matching `ERROR_MESSAGES.DUPLICATE_MOVIE(movie.title)`.
- The original movie remains unchanged in the database.

---

### 3.4 Mandatory Fields Validation

**Seed / Precondition:**
- Admin authenticated.

**Steps:**
1. Log in as admin.
2. Navigate to the movie registration form.
3. Leave all mandatory fields empty: title, synopsis, company, year, cover (and do not toggle featured).
4. Click “Cadastrar”.

**Expected Results:**
- No movie is saved.
- Alert area (`SELECTORS.ALERT`) shows an array of required-field messages:
  - Four entries of `ERROR_MESSAGES.REQUIRED_FIELD` (for the four mandatory inputs).
- No success popup appears.

---

### 3.5 Search Movies – Term “zombie” Returns Matches

**Seed / Precondition:**
- Insert a set of movies via API/SQL based on `data.search.data` (multiple titles containing “zombie” in different positions/variants).

**Steps:**
1. Log in as admin.
2. Navigate to the movie search/list page.
3. In the search input (“Busque pelo nome”), type the value from `data.search.input` (e.g., “zombie”).
4. Click the search button in `.actions button`.
5. Wait for network to idle and at least one row to be visible.

**Expected Results:**
- Table rows include all expected titles from `data.search.outputs`.
- `tableHave` assertion passes for all expected outputs.
- No irrelevant results appear that do not match the search term.

---

### 3.6 Search Movies – No Results Case

**Seed / Precondition:**
- Movies table contains entries that do not match the term (or is empty).

**Steps:**
1. Log in as admin.
2. Navigate to the movie search/list page.
3. Type a term with no corresponding titles (e.g., a random string).
4. Trigger the search.

**Expected Results:**
- Table either shows an empty state or a “no results” message.
- No existing movie titles are shown in the results.
- No errors or crashes occur.

---

## 4. TV Show Catalog Management

### 4.1 Register New TV Show (Happy Path)

**Seed / Precondition:**
- `tvshows` table empty (or no show with the new title).

**Steps:**
1. Log in as admin.
2. Navigate to the TV shows admin section (`a[href$="admin/tvshows"]`).
3. From there, click link to registration form (`a[href$="admin/tvshows/register"]`).
4. Fill “Titulo da série” with a unique title from fixture `data.create.title`.
5. Fill “Sinopse” with a valid overview.
6. Select company via the company dropdown.
7. Select release year via the year dropdown.
8. Fill “Temporadas” with a valid integer number (e.g., `tvshow.season`).
9. Upload a cover image from fixtures.
10. Optionally toggle “featured” according to fixture.
11. Click “Cadastrar”.

**Expected Results:**
- A success popup appears with `SUCCESS_MESSAGES.TVSHOW_ADDED(tvshow.title)`.
- New TV show appears in the TV shows list.
- Record is stored correctly in `tvshows` table, including seasons and featured flag.

---

### 4.2 Remove Existing TV Show

**Seed / Precondition:**
- Insert a TV show via API/SQL using fixture `data.to_remove`.

**Steps:**
1. Log in as admin.
2. Navigate to the TV shows admin list (`goTvShows`).
3. Find the row with the seeded tv show title.
4. Click the delete button for that row.
5. Confirm removal via `.confirm-removal`.

**Expected Results:**
- A success popup appears with `SUCCESS_MESSAGES.TVSHOW_REMOVED`.
- The TV show disappears from the table.
- Record is removed from `tvshows` table.

---

### 4.3 Prevent Duplicate TV Show Title

**Seed / Precondition:**
- Insert a TV show using fixture `data.duplicate`.

**Steps:**
1. Log in as admin.
2. Navigate to the TV show registration form.
3. Fill the form with the same fields as `data.duplicate`.
4. Click “Cadastrar”.

**Expected Results:**
- No new TV show is created.
- An error popup appears using `ERROR_MESSAGES.DUPLICATE_MOVIE(tvshow.title)` (shared message format).
- Original TV show record is unchanged.

---

### 4.4 TV Show Mandatory Fields Validation

**Seed / Precondition:**
- Admin authenticated.

**Steps:**
1. Log in as admin.
2. Navigate to the TV shows admin section, then to the registration form.
3. Leave all mandatory fields empty (title, synopsis, company, year, seasons, cover).
4. Click “Cadastrar”.

**Expected Results:**
- An alert area shows:
  - Four entries of `ERROR_MESSAGES.REQUIRED_FIELD`.
  - One entry of `ERROR_MESSAGES.NUMBERS_ONLY` for the “Temporadas” field.
- No success popup appears.
- No TV show record is created.

---

### 4.5 Search TV Shows – Term “zombie” Returns Matches

**Seed / Precondition:**
- Insert TV shows via API/SQL based on `data.search.data` (multiple zombie-related shows).

**Steps:**
1. Log in as admin.
2. Navigate to the TV shows admin list (`goTvShows`).
3. In the search field (“Busque pelo nome”), type `data.search.input` (e.g., “zombie”).
4. Click the search button in `.actions button`.
5. Wait for network idle and at least one row to be visible.

**Expected Results:**
- Table rows contain all expected titles from `data.search.outputs`.
- No unexpected titles are present.
- Search is responsive and does not hang or error.

---

### 4.6 Seasons Field – Numeric Validation

**Seed / Precondition:**
- Admin authenticated.

**Steps:**
1. Navigate to the TV show registration form.
2. Fill all fields correctly except “Temporadas”.
3. In “Temporadas”, enter a non-numeric value (e.g., `ten`, `1a`).
4. Click “Cadastrar”.

**Expected Results:**
- Submission fails.
- Alert area for validation displays `ERROR_MESSAGES.NUMBERS_ONLY`.
- No TV show is created.

---

## 5. Cross-Cutting UI and UX Scenarios

### 5.1 Modal Behavior for Lead Form

**Seed / Precondition:**
- Landing page reachable; `leads` table state irrelevant.

**Steps:**
1. Navigate to `/`.
2. Click “Aperte o play”.
3. Observe modal header text (“Fila de espera”).
4. Attempt to close the modal via any available control (close button, “X”, overlay click if supported).

**Expected Results:**
- Modal appears with correct title and layout.
- Focus is trapped within the modal for keyboard users.
- Closing action returns user to landing page state without reloading or leaving the site.
- Subsequent re-open works correctly and fields are reset.

---

### 5.2 Error and Success Message Localization/Copy

**Seed / Precondition:**
- Various success and error conditions reproducible (as in scenarios above).

**Steps:**
1. Trigger each defined error and success condition:
   - Lead success.
   - Duplicate lead.
   - Duplicate movie.
   - Required-field alerts.
   - Numbers-only alert for seasons.
   - Movie/TV show added/removed.
2. Capture the on-screen text for each.

**Expected Results:**
- Text matches the strings defined in `ERROR_MESSAGES` and `SUCCESS_MESSAGES`.
- Language and tone are consistent (Portuguese, formal/consistent style).
- No truncation or overlapping UI issues.

---

## 6. Non-Functional and Technical Scenarios

### 6.1 Basic Performance – Search Responsiveness

**Seed / Precondition:**
- Sufficient number of movies/TV shows seeded to simulate a realistic catalog.

**Steps:**
1. Log in as admin.
2. Perform a series of searches for movies and TV shows with different terms.
3. Measure time from clicking search to first visible row appearing.

**Expected Results:**
- Search results appear within an acceptable time (e.g., < 2 seconds under normal conditions).
- UI remains responsive, with no long freezes.
- No console errors related to search.

---

### 6.2 Basic Security – Admin Routes Not Accessible Without Login

**Seed / Precondition:**
- User logged out.

**Steps:**
1. Directly navigate to `/admin/leads`.
2. Directly navigate to `/admin/tvshows`.
3. Directly navigate to movie registration or TV show registration URLs.

**Expected Results:**
- Application redirects to `/admin/login` or shows an access denied message.
- No admin content is visible without authentication.

