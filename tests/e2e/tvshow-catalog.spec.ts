import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES } from '../support/constants'

const data = require('../support/fixtures/tvshows.json')

test.describe('TV Show Catalog Management', () => {
  test('4.6 Seasons Field – Numeric Validation @agent', async ({ page }) => {
    const tvshow = data.create

    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
    await page.tvshows.goTvShows()
    await page.tvshows.goForm()
    await page.getByLabel('Titulo da série').fill(tvshow.title)
    await page.getByLabel('Sinopse').fill(tvshow.overview)
    await page.getByLabel('Temporadas').fill('ten')
    await page.tvshows.submit()
    await expect(page.locator('.alert').filter({ hasText: ERROR_MESSAGES.NUMBERS_ONLY })).toBeVisible()
  })
})
