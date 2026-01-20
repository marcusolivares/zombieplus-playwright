const { test } = require ('../support')
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME, LOGIN_MESSAGES } = require('../support/constants')


test('should login as administrator', async ({ page }) => {
    await page.login.visit()
    await page.login.submit(ADMIN_EMAIL, ADMIN_PASSWORD)
    await page.login.isLoggedIn(ADMIN_USERNAME)
})

test('shouldn\'t login with incorrect password', async ({ page }) => {
    await page.login.visit()
    await page.login.submit(ADMIN_EMAIL, 'asfdasf')
    await page.popup.haveText(LOGIN_MESSAGES.INVALID_CREDENTIALS)
})

test('shouldn\'t login with incorrect email', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('marcus.com.br', ADMIN_PASSWORD)
    await page.login.alertHaveText(LOGIN_MESSAGES.INVALID_EMAIL)
})

test('shouldn\'t login if email is missing', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', ADMIN_PASSWORD)
    await page.login.alertHaveText(LOGIN_MESSAGES.REQUIRED_FIELD)
})

test('shouldn\'t login if password is missing', async ({ page }) => {
    await page.login.visit()
    await page.login.submit(ADMIN_EMAIL, '')
    await page.login.alertHaveText(LOGIN_MESSAGES.REQUIRED_FIELD)
})

test('shouldn\'t login if no field is filled', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')
    await page.login.alertHaveText([LOGIN_MESSAGES.REQUIRED_FIELD, LOGIN_MESSAGES.REQUIRED_FIELD])
})