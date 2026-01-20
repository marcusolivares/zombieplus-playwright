const { test, expect } = require ('../support')
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')
const { LEAD_MESSAGES } = require('../support/constants')

test.beforeAll(async () => {
    await executeSQL(`DELETE from leads`)
})

test('should register a lead in the waiting queue', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  await page.popup.haveText(LEAD_MESSAGES.SUCCESS)
});

test('should\'nt register if email already is registered', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.api.postLead(leadName, leadEmail)
  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  await page.popup.haveText(LEAD_MESSAGES.DUPLICATE_EMAIL)
});

test('shouldn\'t register incorrect email', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Marcus Olivares', 'marcus.com.br')
  await page.leads.alertHaveText('Email incorreto')
});LEAD_MESSAGES.INVALID_EMAIL

test('shouldn\'t register if name is missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', 'marcus@yahoo.com')
  await page.leads.alertHaveText(LEAD_MESSAGES.REQUIRED_FIELD)
});

test('shouldn\'t register if email is missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Marcus Olivares', '')
  await page.leads.alertHaveText(LEAD_MESSAGES.REQUIRED_FIELD)
});

test('shouldn\'t register if name and email are missing', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')
  await page.leads.alertHaveText([LEAD_MESSAGES.REQUIRED_FIELD, LEAD_MESSAGES.REQUIRED_FIELD])
});