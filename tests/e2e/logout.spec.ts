// spec: tests/TEST_PLAN.md
// Section: 1. Authentication and Session Management

import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, SELECTORS } from '../support/constants'

test.describe('Authentication and Session Management', () => {
  test('1.1 Admin Logout Functionality @agent', async ({ page }) => {
    // 1. Navigate to admin panel and log in with valid admin credentials
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // 2. Verify user is logged in (greeting message visible)
    const loggedUser = page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText('Olá, Admin')

    // 3. Locate and click on logout button
    await page.getByText('Sair').click()

    // Expected: User is redirected to landing page
    await expect(page).toHaveURL('/')

    // Expected: Admin greeting message is no longer visible
    await expect(loggedUser).not.toBeVisible()

    // Expected: Protected routes are no longer accessible without re-authentication
    await page.goto('/admin/movies')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await page.goto('/admin/tvshows')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await page.goto('/admin/leads')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)
  })
})
