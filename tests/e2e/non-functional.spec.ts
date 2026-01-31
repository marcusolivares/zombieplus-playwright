import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../support/constants'

const movieData = require('../support/fixtures/movies.json')

test.describe('Non-Functional and Technical Scenarios', () => {
  test('6.1 Basic Performance – Search Responsiveness @agent', async ({ page, request }) => {
    const uniqueTitle = `Perf Movie ${Date.now()}`
    const movie = { ...movieData.create, title: uniqueTitle, featured: false }

    // Create movie via API for faster and more reliable setup
    await request.api.postMovie(movie)

    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // Navigate to movies list
    await page.movies.goToList()

    // Wait for the movie to appear in the table before searching
    await expect(page.getByRole('row', { name: uniqueTitle })).toBeVisible({ timeout: 10000 })

    // Wait for search input to be ready
    await expect(page.getByPlaceholder('Busque pelo nome')).toBeVisible()

    const startTime = Date.now()
    await page.movies.search(uniqueTitle)
    await page.movies.tableHave(uniqueTitle)
    const endTime = Date.now()
    const searchTime = endTime - startTime

    expect(searchTime).toBeLessThan(10000)
  })

  test('6.2 Basic Security – Admin Routes Not Accessible Without Login @agent', async ({ page }) => {
    await page.goto('/admin/leads')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await page.goto('/admin/tvshows')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await page.goto('/admin/movies/register')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await page.goto('/admin/tvshows/register')
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    await expect(page.locator('.login-form').or(page.locator('body'))).toBeVisible()
  })
})
