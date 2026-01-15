import { expect, Page } from '@playwright/test'

interface TvShow {
  title: string
  overview: string
  company: string
  release_year: number
  featured: boolean
  season: number
  cover: string
}

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
    await this.page.locator('#select_company_id .react-select__indicator').click()
    await this.page.locator('.react-select__option').filter({ hasText: tvshow.company }).click()
    await this.page.locator('#select_year .react-select__indicator').click()
    await this.page.locator('.react-select__option').filter({ hasText: tvshow.release_year.toString() }).click()
    await this.page.getByLabel('Temporadas').fill(tvshow.season.toString())
    await this.page.locator('input[name=cover]').setInputFiles('tests/support/fixtures' + tvshow.cover)

    if (tvshow.featured) {
      await this.page.locator('.featured .react-switch').click()
    }

    await this.submit()
  }

  async search(target: string): Promise<void> {
    await this.goTvShows()
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
    await expect(this.page.locator('.alert')).toHaveText(target)
  }

  async remove(title: string): Promise<void> {
    await this.goTvShows()
    await this.page.getByRole('row', { name: title }).getByRole('button').click()
    await this.page.click('.confirm-removal')
  }
}
