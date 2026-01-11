const { test } = require ('../support')


test('should login as administrator', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()
})

test('shouldn\'t login with incorrect password', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', 'asfdasf')
    const message = 'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.'
    await page.toast.containText(message)
})

test('shouldn\'t login with incorrect email', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('marcus.com.br', 'pwd123')
    await page.login.alertHaveText('Email incorreto')
})

test('shouldn\'t login if email is missing', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', 'pwd123')
    await page.login.alertHaveText('Campo obrigatório')
})

test('shouldn\'t login if password is missing', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('admin@zombieplus.com', '')
    await page.login.alertHaveText('Campo obrigatório')
})

test('shouldn\'t login if no field is filled', async ({ page }) => {
    await page.login.visit()
    await page.login.submit('', '')
    await page.login.alertHaveText(['Campo obrigatório','Campo obrigatório'])
})