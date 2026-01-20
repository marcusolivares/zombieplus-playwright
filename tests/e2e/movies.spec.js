const { test, expect } = require('../support')
const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME, MOVIE_MESSAGES } = require('../support/constants')

test.beforeAll(async () => {
    await executeSQL(`DELETE from movies`)
})

test('should be able to register a new movie', async ({ page }) => {
    const movie = data.create
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.movies.create(movie)
    await page.popup.haveText(MOVIE_MESSAGES.CREATED(movie.title))
})

test('should be able to remove a movie', async ({ page, request }) => {
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    //td[text()='A Noite dos Mortos-Vivos']/..//button -> xpath alternative, for reference
    await page.movies.remove(movie.title)
    await page.popup.haveText(MOVIE_MESSAGES.REMOVED)
})

test('shouldn\'t register if title is already registered', async ({ page, request }) => {
    const movie = data.duplicate
    await request.api.postMovie(movie)

    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.movies.create(movie)
    await page.popup.haveText(MOVIE_MESSAGES.DUPLICATE_TITLE(movie.title))
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page }) => {
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText(MOVIE_MESSAGES.REQUIRED_FIELDS)
})

test('should be able to search for term zombie', async ({ page, request }) => {
    const movies = data.search
    await Promise.all(movies.data.map(m => request.api.postMovie(m)))
    
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.movies.search(movies.input)
    await page.movies.tableHave(movies.outputs)
})