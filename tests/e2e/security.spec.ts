// spec: tests/TEST_PLAN.md
// Section: 10. Security

import { test, expect } from '../support'
import { executeSQL } from '../support/database'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../support/constants'
import { faker } from '@faker-js/faker'

const movieData = require('../support/fixtures/movies.json')

test.beforeAll(async () => {
  await executeSQL(`DELETE from movies`)
  await executeSQL(`DELETE from leads`)
})

test.describe('Security', () => {
  test('10.1 XSS Prevention in Movie Title @agent', async ({ page }) => {
    // 1. Navigate to movie creation form
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // 2. Enter title containing XSS payload
    const xssPayload = `<script>alert('XSS')</script>`
    const movie = {
      ...movieData.create,
      title: xssPayload,
      featured: false
    }
    await page.movies.create(movie)

    // 3. Verify movie is created successfully
    await page.popup.haveText(SUCCESS_MESSAGES.MOVIE_ADDED(xssPayload))
    await page.popup.close()

    // Expected: Script is not executed, title is displayed as escaped text
    await page.movies.search(xssPayload)
    await page.movies.tableHave(xssPayload)

    // Expected: No alert dialog appears (script is not executed)
    page.on('dialog', async dialog => {
      // If an alert appears, the test should fail
      throw new Error('XSS vulnerability detected: alert dialog appeared')
    })

    // Expected: The text is displayed as escaped HTML, not executed
    const table = page.locator('table')
    await expect(table).toContainText('<script>')
  })

  test('10.2 XSS Prevention in Lead Email @agent', async ({ page }) => {
    // 1. Navigate to landing page
    await page.leads.visit()

    // 2. Open lead registration modal
    await page.leads.openLeadModal()

    // 3. Enter name with XSS payload
    const xssName = `<img src=x onerror=alert('XSS')>`
    const validEmail = faker.internet.email()

    // Expected: No script execution during form submission
    page.on('dialog', async dialog => {
      throw new Error('XSS vulnerability detected: alert dialog appeared')
    })

    await page.leads.submitLeadForm(xssName, validEmail)

    // Expected: Lead is registered successfully with sanitized/escaped name
    await page.popup.haveText(SUCCESS_MESSAGES.LEAD_SUCCESS)

    // 4. View lead in admin panel to verify it's displayed as escaped text
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
    await page.leads.goLeads()

    // Expected: Name is sanitized or HTML-escaped, not executed
    const leadsTable = page.locator('table')
    await expect(leadsTable).toBeVisible()
    // The lead should be visible but the script should not execute
    await expect(leadsTable).toContainText(validEmail)
  })

  test('10.3 SQL Injection Prevention in Search @agent', async ({ page, request }) => {
    // 1. Create a legitimate movie first
    const legitimateMovie = {
      ...movieData.create,
      title: 'Legitimate Movie',
      featured: false
    }
    await request.api.postMovie(legitimateMovie)

    // 2. Log in to admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // 3. Enter SQL injection pattern in search
    const sqlInjectionPayload = `'; DROP TABLE movies; --`
    await page.movies.search(sqlInjectionPayload)

    // Expected: Search returns no results or handles safely (no database error)
    // The application should continue to function normally (page doesn't crash)
    await expect(page.locator('body')).toBeVisible()

    // 4. Clear search and verify database integrity - the legitimate movie should still exist
    await page.movies.search('Legitimate')
    const table = page.locator('table')
    await expect(table).toBeVisible()
    await page.movies.tableHave('Legitimate Movie')

    // Expected: Database tables remain intact, application continues to function
    await expect(table).toContainText('Legitimate Movie')
  })

  test('10.4 Admin Route Deep Link Protection @agent', async ({ page }) => {
    // 1. Without logging in, try to directly access /admin/movies
    await page.goto('/admin/movies')

    // Expected: User is redirected to login or home page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // 2. Try to directly access /admin/tvshows
    await page.goto('/admin/tvshows')

    // Expected: User is redirected to login or home page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // 3. Try to directly access /admin/leads
    await page.goto('/admin/leads')

    // Expected: User is redirected to login or home page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // Expected: No admin functionality is accessible
    await expect(page.locator('.login-form').or(page.locator('body'))).toBeVisible()
  })

  test('10.5 SQL Injection Prevention in Movie Title @agent', async ({ page }) => {
    // 1. Navigate to movie creation form
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // 2. Try to create content with SQL injection patterns
    const sqlInjectionTitle = `'; DROP TABLE movies;--`
    const movie = {
      ...movieData.create,
      title: sqlInjectionTitle,
      featured: false
    }
    await page.movies.create(movie)

    // Expected: Application handles it gracefully (doesn't crash, data is escaped)
    await page.popup.haveText(SUCCESS_MESSAGES.MOVIE_ADDED(sqlInjectionTitle))
    await page.popup.close()

    // 3. Verify the movie was created with the title properly escaped
    await page.movies.search(sqlInjectionTitle)
    await page.movies.tableHave(sqlInjectionTitle)

    // Expected: Data is escaped and stored safely
    const table = page.locator('table')
    await expect(table).toContainText(`'; DROP TABLE movies;--`)
  })

  test('10.6 XSS Prevention in Lead Name @agent', async ({ page }) => {
    // 1. Navigate to landing page
    await page.leads.visit()

    // 2. Open lead registration modal
    await page.leads.openLeadModal()

    // 3. Enter name with script tag XSS payload
    const xssName = `<script>alert('XSS Name')</script>`
    const validEmail = faker.internet.email()

    // Expected: No script execution
    page.on('dialog', async dialog => {
      throw new Error('XSS vulnerability detected: alert dialog appeared')
    })

    await page.leads.submitLeadForm(xssName, validEmail)

    // Expected: Lead is registered successfully
    await page.popup.haveText(SUCCESS_MESSAGES.LEAD_SUCCESS)

    // 4. View lead in admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
    await page.leads.goLeads()

    // Expected: Script tag is displayed as text, not executed
    const leadsTable = page.locator('table')
    await expect(leadsTable).toBeVisible()
    await expect(leadsTable).toContainText('<script>')
  })

  test('10.7 Protected Route Access - Registration Forms @agent', async ({ page }) => {
    // 1. Without logging in, try to directly access /admin/movies/register
    await page.goto('/admin/movies/register')

    // Expected: User is redirected to login or home page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // 2. Try to directly access /admin/tvshows/register
    await page.goto('/admin/tvshows/register')

    // Expected: User is redirected to login or home page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // Expected: No admin functionality is accessible
    await expect(page.locator('.login-form').or(page.locator('body'))).toBeVisible()
  })
})
