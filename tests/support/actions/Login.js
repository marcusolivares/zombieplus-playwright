const { expect } = require('@playwright/test')
const { SELECTORS } = require('../selectors')

class Login {

    constructor(page) {
        this.page = page
    }

    async do(email, password, username) {
        await this.visit()
        await this.submit(email, password)
        await this.isLoggedIn(username)
    }

    async visit() {
        await this.page.goto('/admin/login');

        const loginForm = this.page.locator(SELECTORS.LOGIN_FORM)
        await expect(loginForm).toBeVisible()
    }

    async submit(email, password) {
        await this.page.getByPlaceholder(SELECTORS.EMAIL_INPUT).fill(email)
        await this.page.getByPlaceholder(SELECTORS.PASSWORD_INPUT).fill(password)
        await this.page.getByText(SELECTORS.LOGIN_BTN).click()
    }

    async alertHaveText(text) {
        const alert = this.page.locator('span[class$=alert]')
        await expect(alert).toHaveText(text)
    }

    async isLoggedIn(username) {
        // old strategy before we had a logged in message. leaving for reference
        // await this.page.waitForLoadState('networkidle')
        // await expect(this.page).toHaveURL(/.*admin/)
        const loggedUser = this.page.locator(SELECTORS.LOGGED_USER)
        await expect(loggedUser).toHaveText(`Olá, ${username}`)
    }
}

module.exports = { Login }