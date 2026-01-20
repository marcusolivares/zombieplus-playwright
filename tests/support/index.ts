import { test as base, expect, Page, APIRequestContext } from '@playwright/test'

import { Leads } from './actions/Leads'
import { Login } from './actions/Login'
import { Movies } from './actions/Movies'
import { Popup } from './actions/Components'
import { TvShows } from './actions/TvShows'

import { Api } from './api'

declare global {
  namespace PlaywrightTest {
    interface Page {
      leads: Leads
      login: Login
      movies: Movies
      popup: Popup
      tvshows: TvShows
    }
    interface APIRequestContext {
      api: Api
    }
  }
}

type TestFixtures = {
  page: Page & {
    leads: Leads
    login: Login
    movies: Movies
    popup: Popup
    tvshows: TvShows
  }
  request: APIRequestContext & {
    api: Api
  }
}

const test = base.extend<TestFixtures>({
  page: async ({ page }, use) => {
    ;(page as any).leads = new Leads(page)
    ;(page as any).login = new Login(page)
    ;(page as any).movies = new Movies(page)
    ;(page as any).popup = new Popup(page)
    ;(page as any).tvshows = new TvShows(page)

    await use(page)
  },
  request: async ({ request }, use) => {
    ;(request as any).api = new Api(request)
    await (request as any).api.setToken()
    await use(request)
  }
})

export { test, expect }
