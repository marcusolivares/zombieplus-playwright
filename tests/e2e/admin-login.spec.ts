import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES } from '../support/constants'

test.describe('Admin Login and Authentication', () => {
  test('2.1 Successful Admin Login @agent', async ({ page }) => {
    await page.login.visit()
    await page.login.submit(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD)
    await page.login.isLoggedIn('Admin')
  })

  test('2.2 Invalid Password @agent', async ({ page }) => {
    await page.login.visit()
    await page.login.submit(DEFAULT_ADMIN_EMAIL, 'wrongpassword')
    await expect(page.locator('.login-form')).toBeVisible()
  })

  test('2.3 Invalid Email Format @agent', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin', 'anypassword')
    await expect(page.locator('.login-form')).toBeVisible()
  })

  test('2.4 Required Fields Validation @agent', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')
    await page.login.alertHaveText([ERROR_MESSAGES.REQUIRED_FIELD, ERROR_MESSAGES.REQUIRED_FIELD])
  })
})
