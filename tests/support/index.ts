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

type PageWithFixtures = Page & {
  leads: Leads
  login: Login
  movies: Movies
  popup: Popup
  tvshows: TvShows
}

type RequestWithApi = APIRequestContext & {
  api: Api
}

type TestFixtures = {
  page: PageWithFixtures
  request: RequestWithApi
}

const test = base.extend<TestFixtures>({
  page: async ({ page }, use) => {
    ;(page as PageWithFixtures).leads = new Leads(page)
    ;(page as PageWithFixtures).login = new Login(page)
    ;(page as PageWithFixtures).movies = new Movies(page)
    ;(page as PageWithFixtures).popup = new Popup(page)
    ;(page as PageWithFixtures).tvshows = new TvShows(page)

    await use(page)
  },
  request: async ({ request }, use) => {
    ;(request as RequestWithApi).api = new Api(request)
    await (request as RequestWithApi).api.setToken()
    await use(request)
  }
})

export { test, expect }
