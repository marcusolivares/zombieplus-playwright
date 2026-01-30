import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../support/constants'

test.describe('Movie Catalog Management', () => {
  test('3.6 Search Movies – No Results Case @agent', async ({ page }) => {
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')
    await page.movies.search('nonexistentmovietitle12345')
    await expect(page.locator('body')).not.toContainText([
      'Guerra Mundial Z',
      'Zumbilândia',
      'Orgulho e Preconceito e Zumbis',
      'Meu Namorado é um Zumbi'
    ])
  })
})
