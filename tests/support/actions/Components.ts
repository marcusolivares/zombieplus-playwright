import { expect, Page } from '@playwright/test'

export class Popup {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async haveText(message: string | string[]): Promise<void> {
    const element = this.page.locator('.swal2-html-container')
    await expect(element).toHaveText(message)
  }
}
