import { expect, Page } from '@playwright/test'
import { Movie } from '../types'
import { SELECTORS, ERROR_MESSAGES } from '../constants'

export class Movies {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goForm(): Promise<void> {
    await this.page.locator('a[href$="register"]').click()
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cadastrar' }).click()
  }

  async create(movie: Movie): Promise<void> {
    await this.goForm()
    await this.page.getByLabel('Titulo do filme').fill(movie.title)
    await this.page.getByLabel('Sinopse').fill(movie.overview)
    await this.page.locator(SELECTORS.COMPANY_SELECT).click()
    await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: movie.company }).click()
    await this.page.locator(SELECTORS.YEAR_SELECT).click()
    await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: movie.release_year.toString() }).click()
    await this.page.locator(SELECTORS.COVER_INPUT).setInputFiles('tests/support/fixtures' + movie.cover)

    if (movie.featured) {
      await this.page.locator(SELECTORS.FEATURED_SWITCH).click()
    }

    await this.submit()
  }

  async search(target: string): Promise<void> {
    await this.page.getByPlaceholder('Busque pelo nome').fill(target)
    await this.page.click('.actions button')
    // Wait for search results to load
    await this.page.waitForLoadState('networkidle')
    await this.page.getByRole('row').first().waitFor({ state: 'visible' })
  }

  async tableHave(content: string | string[]): Promise<void> {
    const rows = this.page.getByRole('row')
    await expect(rows).toContainText(content)
  }

  async alertHaveText(target: string | string[]): Promise<void> {
    await expect(this.page.locator(SELECTORS.ALERT)).toHaveText(target)
  }

  async remove(title: string): Promise<void> {
    await this.page.getByRole('row', { name: title }).getByRole('button').click()
    await this.page.click('.confirm-removal')
  }
}
