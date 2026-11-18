---
name: zombieplus-conventions
description: ZombiePlus E2E test conventions - support-layer imports, page-object fixtures, constants, data setup/cleanup, locator and assertion rules. Use when writing, editing, healing or reviewing any Playwright test or page object in this repo.
user-invocable: false
---

# ZombiePlus test conventions

## Imports

```ts
import { test, expect } from '../support'                 // never from '@playwright/test' in specs
import { executeSQL } from '../support/database'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES, SUCCESS_MESSAGES, SELECTORS, LOGIN_STRINGS } from '../support/constants'
import { Movie, TvShow, Lead } from '../support/types'
import { faker } from '@faker-js/faker'
const data = require('../support/fixtures/movies.json')  // or tvshows.json
```

## Page-object fixtures (`tests/support/actions/`)

Use these before writing raw locators. Read the class if you need details.

| Fixture | Methods |
|---------|---------|
| `page.login` | `visit()`, `submit(email, pwd)`, `do(email, pwd, username)` (visit + submit + assert logged in), `isLoggedIn(username)`, `alertHaveText(text)` |
| `page.movies` | `goToList()`, `goForm()`, `create(movie)`, `submit()`, `openEditForm(title)`, `edit(partial)`, `saveEdit()`, `cancelEdit()`, `search(term)`, `tableHave(content)`, `alertHaveText(text)`, `remove(title)` |
| `page.tvshows` | `goTvShows()`, `goForm()`, `create(tvshow)`, `submit()`, `openEditForm(title)`, `edit(partial)`, `saveEdit()`, `cancelEdit()`, `search(term)`, `tableHave(content)`, `alertHaveText(text)`, `remove(title)` |
| `page.leads` | `visit()`, `goLeads()`, `openLeadModal()`, `submitLeadForm(name, email)`, `alertHaveText(text)`, `deleteLead(name)` |
| `page.popup` | `haveText(message)`, `close()` |
| `request.api` | Pre-authenticated. `postMovie(movie)`, `postTvShow(tvshow)`, `postLead(lead)`, `getCompanyIdByName(name)` |

Admin login: `await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')`.

If a test needs a new interaction, add a method to the page object instead of inlining locators in the spec.

## Test data

- The database is shared and tests run on one worker. Each test owns its data: reset with `executeSQL('DELETE from movies')` (or `tvshows`, `leads`) in `test.beforeEach`, then seed what it needs through `request.api`.
- Movie/TV show data comes from `tests/support/fixtures/*.json`, keyed by scenario: `create`, `duplicate`, `to_remove`, `search`, `to_edit`, `edited_*`, `for_featured_toggle`, `edge_case_*`. Add a new key instead of mutating one another test uses.
- Leads use `faker` for unique names and emails.
- For eventual DB state use `await expect(async () => { ... }).toPass({ timeout: 5000 })`, never a sleep.
- Never depend on test order or on data another test created.

## Messages and selectors

- UI copy is Portuguese. Use `ERROR_MESSAGES`, `SUCCESS_MESSAGES` (some are functions of the title, e.g. `SUCCESS_MESSAGES.MOVIE_ADDED(title)`) and `LOGIN_STRINGS` instead of string literals.
- Stable CSS hooks live in `SELECTORS` (`POPUP`, `ALERT`, `MODAL`, `LOGIN_FORM`, react-select indicators, ...). Reuse them; don't re-type the CSS.

## Locators and assertions

- Locator priority: page-object method > `getByRole` / `getByLabel` / `getByPlaceholder` / `getByText` > `SELECTORS` entry > new CSS (last resort, and add it to `SELECTORS`).
- Use web-first assertions (`await expect(locator).toHaveText(...)`, `toBeVisible()`, ...) or the page-object assertion methods (`popup.haveText`, `*.alertHaveText`, `*.tableHave`, `login.isLoggedIn`).
- Every test must assert an outcome the plan expects. Navigating without asserting is not a test.
- Forbidden: `page.waitForTimeout`, `waitForLoadState('networkidle')`, `test.only`, try/catch around assertions, `if (await x.isVisible())` branches that skip assertions, discouraged or deprecated APIs (`page.click(selector)`, `page.fill(selector)`, `page.$`, `page.waitForSelector`) - use locators.

## Tags and structure

- Specs live in `tests/e2e/`. Group with `test.describe` matching the plan section.
- Agent-generated tests: append `@agent` to the title and start the file with `// spec: <plan path>` and `// seed: tests/seed.spec.ts`.
- `test.fixme()` is only for confirmed app regressions and needs a comment stating expected vs actual behaviour.
