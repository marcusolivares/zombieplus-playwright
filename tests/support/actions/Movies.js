const { expect } = require('@playwright/test')
const { SELECTORS, FIXTURES_PATH } = require('../selectors')

class Movies {

    constructor(page) {
        this.page = page
    }

    async goForm() {
        await this.page.locator(SELECTORS.MOVIES_REGISTER_LINK).click()
    }

    async submit() {
        await this.page.getByRole('button', {name: SELECTORS.REGISTER_BTN}).click()
    }

    async create(movie) {
        await this.goForm()
        await this.page.getByLabel(SELECTORS.MOVIE_TITLE_LABEL).fill(movie.title)
        await this.page.getByLabel(SELECTORS.MOVIE_SYNOPSIS_LABEL).fill(movie.overview)
        await this.page.locator(SELECTORS.MOVIE_COMPANY_SELECT + ' ' + SELECTORS.REACT_SELECT_INDICATOR).click()
        await this.page.locator(SELECTORS.REACT_SELECT_OPTION).filter({hasText: movie.company}).click()
        await this.page.locator(SELECTORS.MOVIE_YEAR_SELECT + ' ' + SELECTORS.REACT_SELECT_INDICATOR).click()
        await this.page.locator(SELECTORS.REACT_SELECT_OPTION).filter({hasText: movie.release_year}).click()
        await this.page.locator(SELECTORS.MOVIE_COVER_INPUT).setInputFiles(FIXTURES_PATH + movie.cover)

        if (movie.featured) {
            await this.page.locator(SELECTORS.MOVIE_FEATURED_SWITCH).click()
        }
        
        await this.submit()
    }

    async search(target) {
        await this.page.getByPlaceholder(SELECTORS.SEARCH_INPUT).fill(target)
        await this.page.click('.actions button')
        // Wait for search results to load
        await this.page.waitForLoadState('networkidle')
        await this.page.getByRole(SELECTORS.ROWS).first().waitFor({ state: 'visible' })
    }

    async tableHave(content) {
        const rows = this.page.getByRole(SELECTORS.ROWS)
        await expect(rows).toContainText(content)
    }

    async alertHaveText(target) {
        await expect(this.page.locator(SELECTORS.ALERT)).toHaveText(target)
    }

    async remove(title) {
        await this.page.getByRole(SELECTORS.ROWS, {name: title}).getByRole('button').click()
        await this.page.click(SELECTORS.CONFIRM_REMOVAL_BTN)
    }
}

module.exports = { Movies }