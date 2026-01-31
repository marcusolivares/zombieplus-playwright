import { expect, Page } from '@playwright/test'
import { Movie } from '../types'
import { SELECTORS, ERROR_MESSAGES } from '../constants'

export class Movies {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goToList(): Promise<void> {
    await this.page.goto('/admin/movies')
    await this.page.waitForLoadState('networkidle')
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

  async openEditForm(title: string): Promise<void> {
    const movieRow = this.page.getByRole('row', { name: title })
    await movieRow.locator('[data-testid="edit-button"]').click()
  }

  async edit(movie: Partial<Movie>): Promise<void> {
    if (movie.title !== undefined) {
      await this.page.getByLabel('Titulo do filme').clear()
      await this.page.getByLabel('Titulo do filme').fill(movie.title)
    }

    if (movie.overview !== undefined) {
      await this.page.getByLabel('Sinopse').clear()
      await this.page.getByLabel('Sinopse').fill(movie.overview)
    }

    if (movie.company !== undefined) {
      await this.page.locator(SELECTORS.COMPANY_SELECT).click()
      await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: movie.company }).click()
    }

    if (movie.release_year !== undefined) {
      await this.page.locator(SELECTORS.YEAR_SELECT).click()
      await this.page.locator(SELECTORS.SELECT_OPTION).filter({ hasText: movie.release_year.toString() }).click()
    }

    if (movie.featured !== undefined) {
      const featuredSwitch = this.page.locator(SELECTORS.FEATURED_SWITCH)
      const isFeatured = await this.page.locator('input[name="featured"]').isChecked()

      if (movie.featured !== isFeatured) {
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
    await this.page.getByPlaceholder('Busque pelo nome').fill(target)
    await this.page.click('.actions button')
    // Wait for search results to load - wait for either table or no results message
    await Promise.race([
      this.page.locator('table').waitFor({ state: 'visible', timeout: 10000 }),
      this.page.getByText('Nenhum registro encontrado!').waitFor({ state: 'visible', timeout: 10000 })
    ])
  }

  async tableHave(content: string | string[]): Promise<void> {
    // Row text includes title + overview + metadata and ordering can vary.
    // Assert against the table container to make this order-independent.
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
    // Wait for the movie row to be visible before clicking
    const row = this.page.getByRole('row', { name: title })
    await row.waitFor({ state: 'visible', timeout: 10000 })
    await row.getByRole('button').click()
    await this.page.click('.confirm-removal')
  }
}
