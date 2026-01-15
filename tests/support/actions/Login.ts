import { expect, Page } from '@playwright/test'

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

    const loginForm = this.page.locator('.login-form')
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
    const loggedUser = this.page.locator('.logged-user')
    await expect(loggedUser).toHaveText(`Olá, ${username}`)
  }
}
