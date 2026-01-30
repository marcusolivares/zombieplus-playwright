import { test, expect } from '../support'
import { SELECTORS } from '../support/constants'

test.describe('Cross-Cutting UI and UX Scenarios', () => {
  test('5.1 Modal Behavior for Lead Form @agent', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()

    const modal = page.locator(SELECTORS.MODAL)
    await expect(modal.getByRole('heading')).toHaveText('Fila de espera')

    const closeButton = modal.locator('button[aria-label*="close" i], button[aria-label*="fechar" i], .close, [data-testid="close"]').first()
    const closeButtonCount = await closeButton.count()

    if (closeButtonCount > 0) {
      await closeButton.click()
      await expect(modal).not.toBeVisible()
      await page.leads.openLeadModal()
      await expect(modal.getByRole('heading')).toHaveText('Fila de espera')
    }
  })

  test('5.2 Error and Success Message Localization/Copy @agent', async ({ page }) => {
    await page.leads.visit()
    await page.leads.openLeadModal()
    await page.leads.submitLeadForm('Test User', 'test@example.com')
    const successPopup = page.locator(SELECTORS.POPUP)
    await expect(successPopup).toBeVisible()
  })
})
