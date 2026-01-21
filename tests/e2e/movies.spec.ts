import { test, expect } from '../support'
import { executeSQL } from '../support/database'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../support/constants'

const data = require('../support/fixtures/movies.json')

test.beforeAll(async () => {
  await executeSQL(`DELETE from movies`)
})

test('should be able to register a new movie', async ({ page }) => {
  const movie = data.create
  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.movies.create(movie)
  await page.popup.haveText(SUCCESS_MESSAGES.MOVIE_ADDED(movie.title))
})

test('should be able to remove a movie', async ({ page, request }) => {
  const movie = data.to_remove
  await request.api.postMovie(movie)

  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.movies.remove(movie.title)
  await page.popup.haveText(SUCCESS_MESSAGES.MOVIE_REMOVED)
})

test('shouldn\'t register if title is already registered', async ({ page, request }) => {
  const movie = data.duplicate
  await request.api.postMovie(movie)

  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.movies.create(movie)
  await page.popup.haveText(ERROR_MESSAGES.DUPLICATE_MOVIE(movie.title))
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page }) => {
  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.movies.goForm()
  await page.movies.submit()
  await page.movies.alertHaveText([
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD
  ])
})

test('should be able to search for term zombie', async ({ page, request }) => {
  const page_local = page
  const request_local = request
  const movies = data.search
  await Promise.all(movies.data.map((m: any) => request_local.api.postMovie(m)))

  await page_local.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page_local.movies.search(movies.input)
  await page_local.movies.tableHave(movies.outputs)
})
