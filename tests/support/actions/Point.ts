import { expect, Page } from '@playwright/test'
import { SELECTORS } from '../constants'

export class Point {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async visit(): Promise<void> {
    await this.page.goto('/')
  }

  async fillPointForms(): Promise<void> {
    await this.fillAddressStep()
    await this.fillPersonalInfoStep()
    await this.clickViewOfferButton()
    await this.fillFinancialInfoStep()
    await this.selectCreditScore()
    await this.skipAndValidateOffer()
  }

  private async fillAddressStep(): Promise<void> {
    await this.page.getByRole('combobox', { name: "What’s your home address?"}).fill("778 Colorado Ave, Palo Alto, CA 94303")
    await this.page.getByRole('button', { name: /See if my home qualifies/i }).click()
    await this.page.getByRole('button', { name: /^Continue$/i }).click()
  }

  private async fillPersonalInfoStep(): Promise<void> {
    await this.page.getByRole('textbox', { name: 'First name' }).fill("Marcus")
    await this.page.getByRole('textbox', { name: 'Last name' }).fill("Olivares")
    await this.page.getByRole('textbox', { name: 'Email address' }).fill("testgroup@point.com")
    await this.page.getByRole('textbox', { name: 'Phone number' }).fill("(650) 446-4315")
  }

  private async clickViewOfferButton(): Promise<void> {
    await this.page.getByRole('button', { name: /View my offer/i }).click()
  }

  private async fillFinancialInfoStep(): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Your mortgage balance' }).fill('100000')
    await this.page.getByRole('button', { name: /^Continue$/i }).click()
  }

  private async selectCreditScore(): Promise<void> {
    await this.page.getByRole('radio', { name: /Excellent/i }).click()
    await this.page.getByRole('button', { name: /^Continue$/i }).click()
  }

  private async skipAndValidateOffer(): Promise<void> {
    await this.page.getByRole('button', { name: /^Skip$/i }).click()
    await this.validateOfferAmount()
  }

  private async validateOfferAmount(): Promise<void> {
    const h1Text = await this.page.getByRole('heading', { level: 1 }).textContent()
    const numberMatch = h1Text?.match(/\$([0-9,]+)/)
    const number = numberMatch ? parseInt(numberMatch[1].replace(/,/g, '')) : 0
    expect(number).toBeGreaterThan(0)
  }

}