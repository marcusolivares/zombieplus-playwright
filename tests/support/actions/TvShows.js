const { expect } = require('@playwright/test')
const { SELECTORS, FIXTURES_PATH } = require('../selectors')

class TvShows {

    constructor(page) {
        this.page = page
    }

    async goTvShows() {
        await this.page.locator(SELECTORS.TVSHOWS_LINK).click()
    }

    async goForm() {
        await this.page.locator(SELECTORS.TVSHOWS_REGISTER_LINK).click()
    }

    async submit() {
        await this.page.getByRole('button', {name: SELECTORS.REGISTER_BTN}).click()
    }

    async create(tvshow) {
        await this.goTvShows()
        await this.goForm()
        await this.page.getByLabel(SELECTORS.TVSHOW_TITLE_LABEL).fill(tvshow.title)
        await this.page.getByLabel(SELECTORS.TVSHOW_SYNOPSIS_LABEL).fill(tvshow.overview)
        await this.page.locator(SELECTORS.TVSHOW_COMPANY_SELECT + ' ' + SELECTORS.REACT_SELECT_INDICATOR).click()
        await this.page.locator(SELECTORS.REACT_SELECT_OPTION).filter({hasText: tvshow.company}).click()
        await this.page.locator(SELECTORS.TVSHOW_YEAR_SELECT + ' ' + SELECTORS.REACT_SELECT_INDICATOR).click()
        await this.page.locator(SELECTORS.REACT_SELECT_OPTION).filter({hasText: tvshow.release_year}).click()
        await this.page.getByLabel(SELECTORS.TVSHOW_SEASONS_LABEL).fill(tvshow.season.toString())
        await this.page.locator(SELECTORS.TVSHOW_COVER_INPUT).setInputFiles(FIXTURES_PATH + tvshow.cover)

        if (tvshow.featured) {
            await this.page.locator(SELECTORS.TVSHOW_FEATURED_SWITCH).click()
        }
        
        await this.submit()
    }

    async search(target) {
        await this.goTvShows()
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
        await this.goTvShows()
        await this.page.getByRole(SELECTORS.ROWS, {name: title}).getByRole('button').click()
        await this.page.click(SELECTORS.CONFIRM_REMOVAL_BTN)
    }
}

module.exports = { TvShows }