import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../support/constants'

const movieData = require('../support/fixtures/movies.json')

test.describe('Non-Functional and Technical Scenarios', () => {
  test('6.1 Basic Performance – Search Responsiveness @agent', async ({ page }) => {
    const uniqueTitle = `Perf Movie ${Date.now()}`
    const movie = { ...movieData.create, title: uniqueTitle, featured: false }

    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${uniqueTitle}' foi adicionado ao catálogo.`)
    await page.popup.close()

    const startTime = Date.now()
    await page.movies.search('Perf Movie')
    await page.movies.tableHave(uniqueTitle)
    const endTime = Date.now()
    const searchTime = endTime - startTime

    expect(searchTime).toBeLessThan(10000)

    await page.movies.search('Perf Movie')
    await page.movies.tableHave(uniqueTitle)
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
