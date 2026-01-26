import { test as base, expect, Page, APIRequestContext } from '@playwright/test'

import { Leads } from './actions/Leads'
import { Login } from './actions/Login'
import { Movies } from './actions/Movies'
import { Popup } from './actions/Components'
import { TvShows } from './actions/TvShows'
import { Point } from './actions/Point'

import { Api } from './api'

declare global {
  namespace PlaywrightTest {
    interface Page {
      leads: Leads
      login: Login
      movies: Movies
      popup: Popup
      tvshows: TvShows
      point: Point
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
  point: Point
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
    ;(page as PageWithFixtures).point = new Point(page)

    await use(page)
  },
  request: async ({ request }, use) => {
    ;(request as RequestWithApi).api = new Api(request)
    await (request as RequestWithApi).api.setToken()
    await use(request)
  }
})

export { test, expect }
