import { expect, Page } from '@playwright/test'
import { SELECTORS } from '../constants'

export class Popup {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async haveText(message: string | string[]): Promise<void> {
    const element = this.page.locator(SELECTORS.POPUP)
    // Wait for the popup to be visible before checking its text
    await element.waitFor({ state: 'visible', timeout: 10000 })
    await expect(element).toHaveText(message)
  }

  async close(): Promise<void> {
    // SweetAlert2 confirm button
    const confirm = this.page.locator('.swal2-confirm')
    const popup = this.page.locator(SELECTORS.POPUP)

    if (await confirm.count()) {
      await confirm.first().click()
      // Wait for the popup to be hidden
      await popup.waitFor({ state: 'hidden', timeout: 5000 })
    }
  }
}
