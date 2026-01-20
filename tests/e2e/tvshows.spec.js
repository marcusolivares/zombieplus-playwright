const { test, expect } = require('../support')
const data = require('../support/fixtures/tvshows.json')
const { executeSQL } = require('../support/database')
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME, TVSHOW_MESSAGES } = require('../support/constants')

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)
})

test('should be able to register a new tv show', async ({ page }) => {
    const tvshow = data.create
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.tvshows.create(tvshow)
    await page.popup.haveText(TVSHOW_MESSAGES.CREATED(tvshow.title))
})

test('should be able to remove a tv show', async ({ page, request }) => {
    const tvshow = data.to_remove
    await request.api.postTvShow(tvshow)

    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText(TVSHOW_MESSAGES.REMOVED)
})

test('shouldn\'t register if title is already registered', async ({ page, request }) => {
    const tvshow = data.duplicate
    await request.api.postTvShow(tvshow)

    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.tvshows.create(tvshow)
    await page.popup.haveText(TVSHOW_MESSAGES.DUPLICATE_TITLE(tvshow.title))
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page }) => {
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.tvshows.goTvShows()
    await page.tvshows.goForm()
    await page.tvshows.submit()
    await page.tvshows.alertHaveText(TVSHOW_MESSAGES.REQUIRED_FIELDS)
})

test('should be able to search for term zombie', async ({ page, request }) => {
    const tvshows = data.search
    await Promise.all(tvshows.data.map(t => request.api.postTvShow(t)))
    
    await page.login.do(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME)
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})