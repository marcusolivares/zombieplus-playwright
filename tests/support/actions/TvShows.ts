import { expect, Page } from '@playwright/test'
import { TvShow } from '../types'
import { SELECTORS } from '../constants'

export class TvShows {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTvShows(): Promise<void> {
    await this.page.locator('a[href$="admin/tvshows"]').click()
  }

  async goForm(): Promise<void> {
    await this.page.locator('a[href$="admin/tvshows/register"]').click()
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cadastrar' }).click()
  }

  async create(tvshow: TvShow): Promise<void> {
    await this.goTvShows()
    await this.goForm()
    await this.page.getByLabel('Titulo da série').fill(tvshow.title)
    await this.page.getByLabel('Sinopse').fill(tvshow.overview)
    await this.page.locator(SELECTORS.COMPANY_SELECT).click()
    await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: tvshow.company }).click()
    await this.page.locator(SELECTORS.YEAR_SELECT).click()
    await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: tvshow.release_year.toString() }).click()
    await this.page.getByLabel('Temporadas').fill(tvshow.season.toString())
    await this.page.locator(SELECTORS.COVER_INPUT).setInputFiles('tests/support/fixtures' + tvshow.cover)

    if (tvshow.featured) {
      await this.page.locator(SELECTORS.FEATURED_SWITCH).click()
    }

    await this.submit()
  }

  async openEditForm(title: string): Promise<void> {
    const tvshowRow = this.page.getByRole('row', { name: title })
    await tvshowRow.locator('[data-testid="edit-button"]').click()
  }

  async edit(tvshow: Partial<TvShow>): Promise<void> {
    if (tvshow.title !== undefined) {
      await this.page.getByLabel('Titulo da série').clear()
      await this.page.getByLabel('Titulo da série').fill(tvshow.title)
    }

    if (tvshow.overview !== undefined) {
      await this.page.getByLabel('Sinopse').clear()
      await this.page.getByLabel('Sinopse').fill(tvshow.overview)
    }

    if (tvshow.company !== undefined) {
      await this.page.locator(SELECTORS.COMPANY_SELECT).click()
      await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: tvshow.company }).click()
    }

    if (tvshow.release_year !== undefined) {
      await this.page.locator(SELECTORS.YEAR_SELECT).click()
      await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: tvshow.release_year.toString() }).click()
    }

    if (tvshow.season !== undefined) {
      await this.page.getByLabel('Temporadas').clear()
      await this.page.getByLabel('Temporadas').fill(tvshow.season.toString())
    }

    if (tvshow.featured !== undefined) {
      const featuredSwitch = this.page.locator(SELECTORS.FEATURED_SWITCH)
      const isFeatured = await this.page.locator('input[name="featured"]').isChecked()

      if (tvshow.featured !== isFeatured) {
        await featuredSwitch.click()
      }
    }
  }

  async saveEdit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Salvar' }).click()
  }

  async cancelEdit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancelar' }).click()
  }

  async search(target: string): Promise<void> {
    await this.goTvShows()
    await this.page.getByPlaceholder('Busque pelo nome').fill(target)
    await this.page.click('.actions button')
    // Wait for search results to load - wait for either table or no results message
    await Promise.race([
      this.page.locator('table').waitFor({ state: 'visible', timeout: 10000 }),
      this.page.getByText('Nenhum registro encontrado!').waitFor({ state: 'visible', timeout: 10000 })
    ])
  }

  async tableHave(content: string | string[]): Promise<void> {
    // Use table locator for order-independent assertions
    const table = this.page.locator('table')
    await expect(table).toBeVisible()

    if (Array.isArray(content)) {
      for (const item of content) {
        await expect(table).toContainText(item, { timeout: 15000 })
      }
      return
    }

    await expect(table).toContainText(content, { timeout: 15000 })
  }

  async alertHaveText(target: string | string[]): Promise<void> {
    await expect(this.page.locator(SELECTORS.ALERT)).toHaveText(target)
  }

  async remove(title: string): Promise<void> {
    await this.goTvShows()
    await this.page.getByRole('row', { name: title }).first().getByRole('button').first().click()
    await this.page.click('.confirm-removal')
  }
}
