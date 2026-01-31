# Zombie Plus - Comprehensive Test Plan

## Application Overview

Zombie Plus is a streaming platform administration system for managing zombie-themed movies, TV shows, and user leads (waitlist). The application consists of:

- **Public Landing Page:** Allows users to join a waiting queue by providing name and email
- **Admin Portal:** Authenticated area for managing content
  - Movies: CRUD operations, search, featured toggle, cover image upload
  - TV Shows: CRUD operations with seasons field, search, featured toggle
  - Leads: View and delete registered leads from the waitlist

---

## Existing Test Coverage Summary

The current test suite (28 tests) covers:

| Area | Tests | Coverage |
|------|-------|----------|
| Admin Login | 4 | Success, invalid password, invalid email, required fields |
| Leads | 7 | Register, duplicate, validation errors, delete |
| Movies | 5 | Create, delete, duplicate prevention, required fields, search |
| TV Shows | 5 | Create, delete, duplicate prevention, required fields, search |
| Movie Catalog | 1 | Search no results |
| TV Show Catalog | 1 | Seasons numeric validation |
| Non-Functional | 2 | Search performance, route protection |
| UI/UX | 2 | Modal behavior, success messages |

---

## NEW Test Scenarios - Gap Analysis

The following scenarios represent meaningful gaps in the current test coverage.

---

## 1. Authentication and Session Management (NEW)

### 1.1 Admin Logout Functionality
**Seed / Precondition:** User is logged in as Admin

**Steps:**
1. Navigate to admin panel at `/admin/login`
2. Log in with valid admin credentials
3. Verify user is logged in (greeting message visible)
4. Locate and click on logout button or user menu
5. Confirm logout action if prompted

**Expected Results:**
- User is redirected to login page
- Admin greeting message is no longer visible
- Protected routes are no longer accessible without re-authentication

---

### 1.2 Session Persistence After Page Refresh
**Seed / Precondition:** User is logged in as Admin

**Steps:**
1. Log in to admin panel with valid credentials
2. Navigate to Movies section
3. Refresh the browser page using `page.reload()`
4. Check if user remains logged in

**Expected Results:**
- User session persists after page refresh
- User remains on the Movies section
- Admin greeting message remains visible

---

### 1.3 Session Expiry Handling
**Seed / Precondition:** User is logged in as Admin

**Steps:**
1. Log in to admin panel
2. Simulate session expiry by clearing localStorage/sessionStorage tokens via `page.evaluate()`
3. Attempt to perform an action (e.g., create a movie)

**Expected Results:**
- User is redirected to login page
- Appropriate error message is displayed
- No data loss occurs

---

### 1.4 Multiple Browser Tabs Session Sharing
**Seed / Precondition:** User is logged in to admin panel

**Steps:**
1. Log in to admin panel in first tab
2. Open a new browser context/tab
3. Navigate directly to `/admin/movies` in the new tab
4. Verify session is shared (if using shared storage)

**Expected Results:**
- Session behavior is consistent across tabs
- User either has access in both tabs or none

---

## 2. Movie Management - Extended Coverage (NEW)

### 2.1 Edit Existing Movie
**Seed / Precondition:** A movie exists in the catalog (created via API)

**Steps:**
1. Log in to admin panel
2. Navigate to Movies section
3. Locate the existing movie in the table
4. Click edit button/link for that movie (if available)
5. Modify the movie title and synopsis
6. Save changes

**Expected Results:**
- Edit form is pre-populated with existing movie data
- Success message confirms update
- Updated data appears in the movie list

---

### 2.2 Featured Movie Toggle Functionality
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Fill in all required fields
3. Verify the "Featured" switch is OFF by default
4. Toggle the "Featured" switch ON using `SELECTORS.FEATURED_SWITCH`
5. Submit the form
6. Verify movie was created as featured (via API or UI)

**Expected Results:**
- Featured switch toggles between on/off states visually
- Movie is correctly marked as featured when enabled
- Featured status persists after form submission

---

### 2.3 Cover Image Upload - No Image Provided
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Fill in title, synopsis, company, and year
3. Do NOT upload a cover image
4. Toggle featured switch and submit the form

**Expected Results:**
- Validation error appears for missing cover image OR
- Movie is created with a default/placeholder image
- System handles missing image gracefully

---

### 2.4 Company Dropdown - All Options Available
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Click on the Company dropdown (`SELECTORS.COMPANY_SELECT`)
3. Count and verify all company options are displayed
4. Select each company option and verify selection is applied

**Expected Results:**
- Dropdown opens and displays all available companies
- Expected companies: Paramount Pictures, Columbia Pictures, Universal Pictures, Sony Pictures, Fox Entertainment, Netflix
- Selection persists in the form

---

### 2.5 Release Year Dropdown - Range Validation
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Click on the Release Year dropdown (`SELECTORS.YEAR_SELECT`)
3. Verify year options are available
4. Check minimum and maximum year values
5. Select oldest and newest years and verify

**Expected Results:**
- Dropdown opens and displays available years
- Years include a reasonable historical range
- Both boundary years can be selected

---

### 2.6 Movie Title with Special Characters
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Enter title with special characters: `Test Movie: Part 2 - The 'Sequel' & More (2024)`
3. Fill in other required fields with valid data
4. Submit the form
5. Search for the created movie using the special character title

**Expected Results:**
- Movie is created successfully with special characters
- Special characters are displayed correctly in the list
- Search works correctly with special characters

---

### 2.7 Movie Title Maximum Length Boundary
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Generate a title with 256 characters
3. Enter the long title in the title field
4. Fill other required fields
5. Submit the form

**Expected Results:**
- Title field enforces max length validation
- Either truncates input, shows validation error, or accepts the value
- Database constraints are respected

---

### 2.8 Movie Synopsis with Line Breaks
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Enter a synopsis with multiple paragraphs/line breaks
3. Fill other required fields
4. Submit the form
5. View the movie details

**Expected Results:**
- Line breaks are preserved or handled consistently
- Synopsis displays correctly in the UI
- No data corruption occurs

---

### 2.9 Cancel Movie Creation Navigation
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie registration form
2. Fill in some fields with data
3. Click back button or navigate to Movies list without submitting
4. Return to movie creation form

**Expected Results:**
- Navigation away from form is possible
- No movie is created
- Form is reset upon return

---

### 2.10 Search Movies - Case Insensitivity
**Seed / Precondition:** Movies exist with titles in various cases

**Steps:**
1. Create movies with titles: "ZOMBIE ATTACK", "zombie attack", "Zombie Attack"
2. Log in and navigate to Movies section
3. Search for "zombie"
4. Search for "ZOMBIE"
5. Search for "ZoMbIe"

**Expected Results:**
- All variations return the same results
- Search is case-insensitive
- All matching movies appear in results

---

### 2.11 Search Movies - Clear Search Results
**Seed / Precondition:** User has performed a search with results

**Steps:**
1. Log in and navigate to Movies section
2. Search for "zombie" and verify results
3. Clear the search input field
4. Click search or press Enter
5. Observe results

**Expected Results:**
- Clearing search shows all movies
- Search can be reset to show full list
- No stale results remain

---

## 3. TV Show Management - Extended Coverage (NEW)

### 3.1 Edit Existing TV Show
**Seed / Precondition:** A TV show exists in the catalog (created via API)

**Steps:**
1. Log in to admin panel
2. Navigate to TV Shows section
3. Locate the existing TV show in the table
4. Click edit button for that TV show (if available)
5. Modify the title and number of seasons
6. Save changes

**Expected Results:**
- Edit form is pre-populated with existing TV show data
- Success message confirms update
- Updated data appears in the TV show list

---

### 3.2 Seasons Field - Zero Value
**Seed / Precondition:** User is logged in, on TV show creation form

**Steps:**
1. Navigate to TV show registration form
2. Fill in all required fields
3. Enter "0" in the Seasons field
4. Submit the form

**Expected Results:**
- Zero seasons is either accepted or shows appropriate validation error
- System handles edge case gracefully
- Clear feedback is provided to user

---

### 3.3 Seasons Field - Negative Value
**Seed / Precondition:** User is logged in, on TV show creation form

**Steps:**
1. Navigate to TV show registration form
2. Fill in all required fields
3. Enter "-5" in the Seasons field
4. Submit the form

**Expected Results:**
- Negative value is rejected
- Appropriate validation error is displayed
- Form is not submitted

---

### 3.4 Seasons Field - Decimal Value
**Seed / Precondition:** User is logged in, on TV show creation form

**Steps:**
1. Navigate to TV show registration form
2. Fill in all required fields
3. Enter "5.5" in the Seasons field
4. Submit the form

**Expected Results:**
- Decimal value is either truncated to integer or rejected
- Appropriate handling of non-integer input
- Clear feedback to user

---

### 3.5 Seasons Field - Very Large Value
**Seed / Precondition:** User is logged in, on TV show creation form

**Steps:**
1. Navigate to TV show registration form
2. Fill in all required fields
3. Enter "999999" in the Seasons field
4. Submit the form

**Expected Results:**
- System handles large values appropriately
- Either accepts with validation or shows error for unrealistic values
- No server errors or crashes

---

### 3.6 TV Show Search - Partial Match
**Seed / Precondition:** TV shows exist with similar titles

**Steps:**
1. Create TV shows: "Walking Dead", "Fear the Walking Dead", "Walking Tall"
2. Log in to admin panel
3. Navigate to TV Shows section
4. Search for "Walking"
5. Observe results

**Expected Results:**
- All TV shows containing "Walking" in title are displayed
- Search is case-insensitive
- Results are accurate

---

### 3.7 TV Show Search - No Results
**Seed / Precondition:** User is logged in, TV shows exist in catalog

**Steps:**
1. Navigate to TV Shows section
2. Search for "nonexistenttvshow12345"
3. Observe results

**Expected Results:**
- No results are displayed
- Empty state message or indication is shown
- No errors occur

---

## 4. Lead Management - Extended Coverage (NEW)

### 4.1 Lead Deletion Confirmation Cancel
**Seed / Precondition:** A lead exists in the system

**Steps:**
1. Log in to admin panel
2. Navigate to Leads section
3. Click delete button for a lead
4. When confirmation dialog appears (`.confirm-removal`), look for cancel option
5. Cancel the deletion if possible, or press Escape

**Expected Results:**
- Deletion can be cancelled
- Lead remains in the list
- No data is deleted

---

### 4.2 Multiple Leads Sequential Deletion
**Seed / Precondition:** Multiple leads exist in the system (3+)

**Steps:**
1. Create 3 leads via API with unique emails
2. Log in to admin panel
3. Navigate to Leads section
4. Delete the first lead and confirm
5. Immediately delete the second lead and confirm
6. Verify both deletions completed

**Expected Results:**
- Both leads are deleted successfully
- No race conditions or errors occur
- Success messages appear for each deletion
- Remaining lead is still visible

---

### 4.3 Lead Email with Plus Sign
**Seed / Precondition:** User is on the landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Enter name: "Test User"
4. Enter email: "test+alias@example.com"
5. Submit the form

**Expected Results:**
- Email with plus sign is accepted as valid
- Lead is registered successfully
- Success message appears

---

### 4.4 Lead Name with Unicode Characters
**Seed / Precondition:** User is on the landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Enter name with accents: "Jose Maria de Oliveira"
4. Enter valid email
5. Submit the form
6. Log in as admin and view lead in admin panel

**Expected Results:**
- Unicode characters in name are accepted
- Lead is registered successfully
- Name is displayed correctly in admin panel

---

### 4.5 Lead Email with Subdomain
**Seed / Precondition:** User is on the landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Enter name: "Test User"
4. Enter email: "test@mail.subdomain.example.com"
5. Submit the form

**Expected Results:**
- Complex email format is accepted
- Lead is registered successfully

---

### 4.6 Lead Form - Maximum Name Length
**Seed / Precondition:** User is on the landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Enter a very long name (200+ characters)
4. Enter valid email
5. Submit the form

**Expected Results:**
- Name field has max length validation or accepts long names
- System handles gracefully without errors

---

### 4.7 Lead Form Reset on Modal Close
**Seed / Precondition:** User is on the landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Enter partial data (name only)
4. Close the modal without submitting (click X or outside)
5. Reopen the modal

**Expected Results:**
- Form fields are cleared when modal reopens
- Previous input is not persisted

---

## 5. Navigation and UI (NEW)

### 5.1 Admin Panel Navigation - Movies to TV Shows
**Seed / Precondition:** User is logged in to admin panel

**Steps:**
1. Log in to admin panel
2. Verify Movies section is displayed (default)
3. Click on TV Shows navigation link (`a[href$="admin/tvshows"]`)
4. Verify TV Shows page loads
5. Click back to Movies section

**Expected Results:**
- Navigation between sections is smooth
- Correct section content is displayed
- Active navigation item is highlighted
- No page reload necessary

---

### 5.2 Admin Panel Navigation - Movies to Leads
**Seed / Precondition:** User is logged in to admin panel

**Steps:**
1. Log in to admin panel
2. Click on Leads navigation link (`a[href$="admin/leads"]`)
3. Verify Leads page loads with lead list
4. Navigate back to Movies

**Expected Results:**
- Navigation to Leads section works
- Lead list is displayed
- Return navigation works

---

### 5.3 Admin Panel - Direct URL Access When Logged In
**Seed / Precondition:** User is logged in to admin panel

**Steps:**
1. Log in to admin panel
2. Directly navigate to `/admin/tvshows/register`
3. Verify the TV show registration form is displayed
4. Directly navigate to `/admin/leads`
5. Verify leads list is displayed

**Expected Results:**
- Direct URL access works for authenticated users
- Correct page content is displayed
- Session is maintained

---

### 5.4 Empty State - Movies List
**Seed / Precondition:** Database has no movies

**Steps:**
1. Execute SQL: `DELETE FROM movies`
2. Log in to admin panel
3. Navigate to Movies section
4. Observe the empty list state

**Expected Results:**
- Empty state message is displayed or table shows no rows
- "Add Movie" action/link is still accessible
- No errors or broken UI elements

---

### 5.5 Empty State - TV Shows List
**Seed / Precondition:** Database has no TV shows

**Steps:**
1. Execute SQL: `DELETE FROM tvshows`
2. Log in to admin panel
3. Navigate to TV Shows section
4. Observe the empty list state

**Expected Results:**
- Empty state message is displayed
- "Add TV Show" action is still accessible
- No errors or broken UI

---

### 5.6 Empty State - Leads List
**Seed / Precondition:** Database has no leads

**Steps:**
1. Execute SQL: `DELETE FROM leads`
2. Log in to admin panel
3. Navigate to Leads section
4. Observe the empty list state

**Expected Results:**
- Empty state message or empty table is displayed
- No errors or broken UI

---

## 6. Landing Page (NEW)

### 6.1 Landing Page Initial Load
**Seed / Precondition:** None

**Steps:**
1. Navigate to the root URL (`/`)
2. Observe page elements
3. Verify all visual elements load

**Expected Results:**
- Landing page loads successfully within 3 seconds
- Hero section with call-to-action is visible
- "Aperte o play" button is visible and clickable
- No console errors

---

### 6.2 Landing Page - Modal Escape Key Close
**Seed / Precondition:** User is on landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Press Escape key
4. Observe modal behavior

**Expected Results:**
- Modal closes when Escape key is pressed OR
- Modal remains open (design decision - document expected behavior)
- No errors occur

---

### 6.3 Landing Page - Modal Click Outside Close
**Seed / Precondition:** User is on landing page

**Steps:**
1. Navigate to landing page
2. Open the lead registration modal
3. Click outside the modal area (on the overlay/backdrop)
4. Observe modal behavior

**Expected Results:**
- Modal closes when clicking outside OR
- Modal remains open (design decision)
- Behavior is consistent and documented

---

### 6.4 Landing Page - Keyboard Navigation
**Seed / Precondition:** User is on landing page

**Steps:**
1. Navigate to landing page
2. Use Tab key to navigate through focusable elements
3. Press Enter on "Aperte o play" button
4. Use Tab to navigate form fields in modal
5. Verify form can be submitted via keyboard (Enter on button)

**Expected Results:**
- All interactive elements are keyboard accessible
- Focus order is logical
- Form can be fully operated via keyboard

---

## 7. Data Integrity and Persistence (NEW)

### 7.1 Movie Data Persistence Verification
**Seed / Precondition:** None

**Steps:**
1. Log in and create a new movie with unique title via UI
2. Log out
3. Close browser completely
4. Reopen browser and log in again
5. Search for the created movie

**Expected Results:**
- Movie persists in the database
- Movie appears in search results
- All movie data fields are intact

---

### 7.2 Lead Registration and Admin View Consistency
**Seed / Precondition:** None

**Steps:**
1. Register a new lead with specific name and email via landing page
2. Verify success message
3. Log in to admin panel
4. Navigate to Leads section
5. Find the newly registered lead

**Expected Results:**
- Lead appears in admin panel
- Name and email match exactly what was submitted
- No data transformation or loss

---

### 7.3 API Data Matches UI Display
**Seed / Precondition:** Valid admin credentials

**Steps:**
1. Create a movie via API with specific field values
2. Log in to admin panel
3. Find the movie in the list
4. Compare displayed data with API-sent data

**Expected Results:**
- All fields match exactly
- No data transformation errors
- Cover image path is resolved correctly

---

## 8. Error Handling (NEW)

### 8.1 Network Error During Form Submission
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie creation form
2. Fill in all required fields
3. Use `page.route()` to simulate network failure on the API endpoint
4. Submit the form
5. Restore network and retry

**Expected Results:**
- Appropriate error message is displayed
- Form data is preserved for retry
- User can retry submission
- No duplicate entries created

---

### 8.2 Invalid Session Token API Response
**Seed / Precondition:** User is logged in

**Steps:**
1. Log in to admin panel
2. Use `page.evaluate()` to corrupt the session token in storage
3. Attempt to create a movie

**Expected Results:**
- Request fails with authentication error
- User is redirected to login
- Error message is user-friendly

---

## 9. Accessibility (NEW)

### 9.1 Form Labels Association
**Seed / Precondition:** User is on movie creation form

**Steps:**
1. Navigate to movie creation form
2. Click on each form label
3. Verify clicking label focuses the associated input
4. Use accessibility audit tool

**Expected Results:**
- All form fields have associated labels
- Labels are properly connected to inputs via `for` attribute or nesting
- Form is screen reader accessible

---

### 9.2 Focus Management in Modal
**Seed / Precondition:** User is on landing page

**Steps:**
1. Navigate to landing page
2. Tab to "Aperte o play" button and press Enter
3. Verify focus moves to modal
4. Tab through modal elements
5. Close modal and verify focus returns

**Expected Results:**
- Focus is trapped within modal while open
- Tab cycle stays within modal
- Focus returns to trigger element on close

---

### 9.3 Error Message Accessibility
**Seed / Precondition:** User is on movie creation form

**Steps:**
1. Navigate to movie creation form
2. Submit empty form to trigger validation errors
3. Check if error messages are announced to screen readers
4. Verify errors have appropriate ARIA attributes

**Expected Results:**
- Error messages have `role="alert"` or similar
- Errors are announced to assistive technology
- Visual error indicators are present

---

## 10. Security (NEW)

### 10.1 XSS Prevention in Movie Title
**Seed / Precondition:** User is logged in

**Steps:**
1. Navigate to movie creation form
2. Enter title: `<script>alert('XSS')</script>`
3. Fill other required fields
4. Submit the form
5. View the movie in the list

**Expected Results:**
- Script is not executed
- Title is displayed as escaped text
- No XSS vulnerability

---

### 10.2 XSS Prevention in Lead Name
**Seed / Precondition:** User is on landing page

**Steps:**
1. Navigate to landing page
2. Open lead registration modal
3. Enter name: `<img src=x onerror=alert('XSS')>`
4. Enter valid email
5. Submit the form
6. View lead in admin panel

**Expected Results:**
- Malicious content is not executed
- Name is sanitized or HTML-escaped
- No XSS vulnerability

---

### 10.3 SQL Injection Prevention in Search
**Seed / Precondition:** User is logged in

**Steps:**
1. Navigate to movie search
2. Enter search term: `'; DROP TABLE movies; --`
3. Execute search
4. Verify database integrity

**Expected Results:**
- Search returns no results or handles safely
- Database tables remain intact
- Application continues to function

---

### 10.4 Admin Route Deep Link Protection
**Seed / Precondition:** User is NOT logged in

**Steps:**
1. Directly navigate to `/admin/movies/register`
2. Directly navigate to `/admin/tvshows/register`
3. Directly navigate to `/admin/leads/some-id`

**Expected Results:**
- All routes redirect to login
- No admin functionality is accessible
- URL patterns don't expose sensitive information

---

## 11. Performance (NEW)

### 11.1 Large Dataset - Movies List Load Time
**Seed / Precondition:** 50+ movies exist in database

**Steps:**
1. Seed 50 movies via API in `beforeAll`
2. Log in to admin panel
3. Measure time from navigation to Movies until table is fully rendered
4. Scroll through the list

**Expected Results:**
- Page loads within 3 seconds
- Scrolling is smooth (60fps)
- No browser memory warnings

---

### 11.2 Rapid Consecutive Searches
**Seed / Precondition:** Movies exist in database

**Steps:**
1. Log in to admin panel
2. Rapidly type in search field: "z", "zo", "zom", "zomb", "zombie"
3. Observe search behavior

**Expected Results:**
- Search debounces or handles rapid input gracefully
- No race conditions in results
- Final results match "zombie" search term

---

### 11.3 Image Upload - Large File Handling
**Seed / Precondition:** User is logged in, on movie creation form

**Steps:**
1. Navigate to movie creation form
2. Fill required fields
3. Attempt to upload a large image (5MB+)
4. Observe upload behavior

**Expected Results:**
- Upload progress is indicated (if supported)
- System either accepts or rejects with clear size error
- No browser hang or timeout

---

## Test Data Requirements

### Movies Fixture Data Additions
```json
{
  "special_chars": {
    "title": "Zombie: Part 2 - The 'Sequel' & More (2024)",
    "overview": "A test movie with special characters",
    "company": "Universal Pictures",
    "release_year": 2024,
    "featured": false,
    "cover": "/covers/movies/wwz.png"
  },
  "long_title": {
    "title": "[256 character string]",
    "overview": "Testing maximum length",
    "company": "Netflix",
    "release_year": 2024,
    "featured": false,
    "cover": "/covers/movies/wwz.png"
  }
}
```

### TV Shows Fixture Data Additions
```json
{
  "edge_cases": {
    "zero_seasons": { "season": 0 },
    "negative_seasons": { "season": -5 },
    "decimal_seasons": { "season": 5.5 },
    "large_seasons": { "season": 999999 }
  }
}
```

### Leads Fixture Data Additions
```json
{
  "plus_email": {
    "name": "Test User",
    "email": "test+alias@example.com"
  },
  "unicode_name": {
    "name": "Jose Maria de Oliveira",
    "email": "jose@example.com"
  },
  "long_name": {
    "name": "[200 character string]",
    "email": "longname@example.com"
  }
}
```

---

## Environment Setup Notes

- Database: PostgreSQL at `localhost:5432`
- Database name: `zombieplus`
- Admin credentials: `admin@zombieplus.com` / `pwd123`
- Base URL: `http://localhost:3000`
- API URL: `http://localhost:3333`

---

## Test Execution Priority

### P0 - Critical (Must have for release)
- 1.1 Admin Logout Functionality
- 2.1 Edit Existing Movie
- 3.1 Edit Existing TV Show
- 10.1-10.3 Security Tests (XSS, SQL Injection)
- 8.1 Network Error Handling

### P1 - High (Should have)
- 1.2 Session Persistence
- 2.2 Featured Movie Toggle
- 2.3 Cover Image - No Image Provided
- 3.2-3.5 Seasons Field Edge Cases
- 4.1 Lead Deletion Confirmation Cancel
- 5.1-5.3 Navigation Tests
- 10.4 Admin Route Deep Link Protection

### P2 - Medium (Nice to have)
- 2.4-2.5 Dropdown Selection Tests
- 2.6-2.8 Field Boundary Tests
- 4.3-4.6 Lead Edge Cases
- 6.1-6.4 Landing Page Tests
- 9.1-9.3 Accessibility Tests

### P3 - Low (Future consideration)
- 11.1-11.3 Performance Tests
- 1.4 Multiple Browser Tabs
- 7.1-7.3 Data Persistence Verification

---

## Implementation Notes

- Use existing page objects from `tests/support/actions/`
- Leverage constants from `tests/support/constants.ts`
- Use API helpers from `tests/support/api/index.ts` for test data setup
- Use `executeSQL()` from `tests/support/database.ts` for database cleanup
- Follow existing naming conventions with `@agent` tag for new tests
