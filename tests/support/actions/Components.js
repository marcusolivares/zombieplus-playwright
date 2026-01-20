const { expect } = require('@playwright/test')
const { SELECTORS } = require('../selectors')

class Popup {

    constructor(page) {
        this.page = page
    }

    async haveText(message) {
        const element = this.page.locator(SELECTORS.POPUP_CONTAINER)
        await expect(element).toHaveText(message)
    }
}

module.exports = { Popup }