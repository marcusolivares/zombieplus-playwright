const { expect } = require('@playwright/test');
const { SELECTORS } = require('../selectors')

class Leads {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('/');
    }

    async openLeadModal() {
        await this.page.getByRole('button', {name: SELECTORS.PLAY_BTN}).click();
        await expect(this.page.getByTestId(SELECTORS.MODAL).getByRole(SELECTORS.MODAL_HEADING)).toHaveText('Fila de espera')
    }

    async submitLeadForm(name, email) {
        await this.page.getByPlaceholder(SELECTORS.NAME_PLACEHOLDER).fill(name)
        await this.page.getByPlaceholder(SELECTORS.LEAD_EMAIL_PLACEHOLDER).fill(email)
        await this.page.getByTestId(SELECTORS.MODAL).getByText(SELECTORS.MODAL_TEXT).click()
    }
    
    async alertHaveText(target) {
        await expect(this.page.locator(SELECTORS.ALERT)).toHaveText(target)
    }
}

module.exports = { Leads }