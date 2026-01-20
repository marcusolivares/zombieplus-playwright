import { test, expect } from '../support'
import { executeSQL } from '../support/database'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES } from '../support/constants'

const data = require('../support/fixtures/tvshows.json')

test.beforeAll(async () => {
  await executeSQL(`DELETE from tvshows`)
})

test('should be able to register a new tv show', async ({ page }) => {
  const tvshow = data.create
  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.tvshows.create(tvshow)
  await page.popup.haveText(ERROR_MESSAGES.TVSHOW_ADDED(tvshow.title))
})

test('should be able to remove a tv show', async ({ page, request }) => {
  const tvshow = data.to_remove
  await request.api.postTvShow(tvshow)

  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.tvshows.remove(tvshow.title)
  await page.popup.haveText(ERROR_MESSAGES.TVSHOW_REMOVED)
})

test('shouldn\'t register if title is already registered', async ({ page, request }) => {
  const tvshow = data.duplicate
  await request.api.postTvShow(tvshow)

  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.tvshows.create(tvshow)
  await page.popup.haveText(ERROR_MESSAGES.DUPLICATE_MOVIE(tvshow.title))
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page }) => {
  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.tvshows.goTvShows()
  await page.tvshows.goForm()
  await page.tvshows.submit()
  await page.tvshows.alertHaveText([
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.REQUIRED_FIELD,
    ERROR_MESSAGES.NUMBERS_ONLY
  ])
})

test('should be able to search for term zombie', async ({ page, request }) => {
  const tvshows = data.search
  await Promise.all(tvshows.data.map((t: any) => request.api.postTvShow(t)))

  await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
  await page.tvshows.search(tvshows.input)
  await page.tvshows.tableHave(tvshows.outputs)
})
