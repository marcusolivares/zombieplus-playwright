import { test as base, expect } from '@playwright/test'

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

const test = base.extend({
  page: async ({ page }, use) => {
    const context: any = page

    context.leads = new Leads(page)
    context.login = new Login(page)
    context.movies = new Movies(page)
    context.popup = new Popup(page)
    context.tvshows = new TvShows(page)

    await use(context)
  },
  request: async ({ request }, use) => {
    const context: any = request

    context.api = new Api(request)

    await context.api.setToken()

    await use(context)
  }
})

export { test, expect }
