import { expect, Page } from '@playwright/test'
import { SELECTORS } from '../constants'

export class Popup {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async haveText(message: string | string[]): Promise<void> {
    const element = this.page.locator(SELECTORS.POPUP)
    await expect(element).toHaveText(message)
  }
}
