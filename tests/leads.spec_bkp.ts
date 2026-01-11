import { test, expect } from '@playwright/test';

test('should register a lead in the waiting queue', async ({ page }) => {
  // visit
  await page.goto('http://localhost:3000/');

  // openLeadModal
  await page.getByRole('button', {name: /Aperte o play/}).click();

  // fill by id
  // await page.locator('#name').fill('Marcus Olivares')

  // locator variations
  // await page.locator('input[name=name]').fill('Marcus Olivares')
  // await page.locator('input[placeholder="Informe seu nome"]').fill('Marcus Olivares')

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  // submitLeadForm
  await page.getByPlaceholder('Informe seu nome').fill('Marcus Olivares')
  await page.getByPlaceholder('Informe seu email').fill('marcus@yahoo.com')

  await page.getByTestId('modal').getByText('Quero entrar na fila!').click()

  // below it's a way to get the html from the popup
  // await page.getByText('seus dados conosco').click()
  // const content = await page.content()
  // console.log(content)

  // toastHaveText
  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  await expect(page.locator('.toast')).toHaveText(message)

  await expect(page.locator('.toast')).toBeHidden({timeout: 5000})

});

test('shouldn\'t register incorrect email', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', {name: /Aperte o play/}).click();

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.getByPlaceholder('Informe seu nome').fill('Marcus Olivares')

  await page.getByPlaceholder('Informe seu email').fill('marcus.com.br')

  await page.getByTestId('modal').getByText('Quero entrar na fila!').click()

  await expect(page.locator('.alert')).toHaveText('Email incorreto')

});

test('shouldn\'t register if name is missing', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', {name: /Aperte o play/}).click();

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.getByPlaceholder('Informe seu email').fill('marcus@yahoo.com')

  await page.getByTestId('modal').getByText('Quero entrar na fila!').click()

  await expect(page.locator('.alert')).toHaveText('Campo obrigatório')

});

test('shouldn\'t register if name and email are missing', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', {name: /Aperte o play/}).click();

  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText('Fila de espera')

  await page.getByTestId('modal').getByText('Quero entrar na fila!').click()

  await expect(page.locator('.alert')).toHaveText(['Campo obrigatório', 'Campo obrigatório'])

});