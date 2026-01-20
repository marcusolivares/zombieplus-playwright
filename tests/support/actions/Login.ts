import { expect, Page } from '@playwright/test'
import { SELECTORS, LOGIN_STRINGS } from '../constants'

export class Login {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async do(email: string, password: string, username: string): Promise<void> {
    await this.visit()
    await this.submit(email, password)
    await this.isLoggedIn(username)
  }

  async visit(): Promise<void> {
    await this.page.goto('/admin/login')

    const loginForm = this.page.locator(SELECTORS.LOGIN_FORM)
    await expect(loginForm).toBeVisible()
  }

  async submit(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('E-mail').fill(email)
    await this.page.getByPlaceholder('Senha').fill(password)
    await this.page.getByText('Entrar').click()
  }

  async alertHaveText(text: string | string[]): Promise<void> {
    const alert = this.page.locator('span[class$=alert]')
    await expect(alert).toHaveText(text)
  }

  async isLoggedIn(username: string): Promise<void> {
    const loggedUser = this.page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING(username))
  }
}
