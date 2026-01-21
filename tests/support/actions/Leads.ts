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

  async goLeads(): Promise<void> {
    await this.page.locator('a[href$="admin/leads"]').click()
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

  async deleteLead(name: string): Promise<void> {
    await this.page.getByRole('row', { name: `Nome: ${name} Email:` }).getByRole('button').click()
    await this.page.locator(SELECTORS.CONFIRM_REMOVAL).click()
    await expect(this.page.locator('.swal2-popup .swal2-title')).toContainText('Tudo certo!');
    await expect(this.page.locator('.swal2-html-container')).toContainText('Lead removido com sucesso.');
  }
}
