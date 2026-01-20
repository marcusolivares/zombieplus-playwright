import { test, expect } from '../support'
import { faker } from '@faker-js/faker'
import { executeSQL } from '../support/database'
import { ERROR_MESSAGES } from '../support/constants'

test.beforeAll(async () => {
  await executeSQL(`DELETE from leads`)
})

test('should register a lead in the waiting queue', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  await page.popup.haveText(ERROR_MESSAGES.LEAD_SUCCESS)
})

test('should\'nt register if email already is registered', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await request.api.postLead({ name: leadName, email: leadEmail })

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  await page.popup.haveText(ERROR_MESSAGES.DUPLICATE_LEAD)
})

test('shouldn\'t register incorrect email', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Marcus Olivares', 'marcus.com.br')
  await page.leads.alertHaveText(ERROR_MESSAGES.INVALID_EMAIL)
})

test('shouldn\'t register if name is missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', 'marcus@yahoo.com')
  await page.leads.alertHaveText(ERROR_MESSAGES.REQUIRED_FIELD)
})

test('shouldn\'t register if email is missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Marcus Olivares', '')
  await page.leads.alertHaveText(ERROR_MESSAGES.REQUIRED_FIELD)
})

test('shouldn\'t register if name and email are missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')
  await page.leads.alertHaveText([ERROR_MESSAGES.REQUIRED_FIELD, ERROR_MESSAGES.REQUIRED_FIELD])
})
