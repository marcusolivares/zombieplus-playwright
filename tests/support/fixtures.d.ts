import { Page, APIRequestContext } from '@playwright/test'
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

export {}
