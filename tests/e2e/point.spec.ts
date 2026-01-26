import { test, expect } from '../support'
import { faker } from '@faker-js/faker'
import { executeSQL } from '../support/database'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../support/constants'


test('should complete the Point form', async ({ page }) => {
  await page.point.visit()
  await page.point.fillPointForms()
})

