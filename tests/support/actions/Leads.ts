import { expect, Page } from '@playwright/test'
import { SELECTORS } from '../constants'

export class Leads {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async visit(): Promise<void> {
    await this.page.goto('/')
  }

  async openLeadModal(): Promise<void> {
    await this.page.getByRole('button', { name: /Aperte o play/ }).click()
    await expect(this.page.locator(SELECTORS.MODAL).getByRole('heading')).toHaveText('Fila de espera')
  }

  async submitLeadForm(name: string, email: string): Promise<void> {
    await this.page.getByPlaceholder('Informe seu nome').fill(name)
    await this.page.getByPlaceholder('Informe seu email').fill(email)
    await this.page.locator(SELECTORS.MODAL).getByText('Quero entrar na fila!').click()
  }

  async alertHaveText(target: string | string[]): Promise<void> {
    await expect(this.page.locator(SELECTORS.ALERT)).toHaveText(target)
  }
}
