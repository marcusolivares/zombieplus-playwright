const { test, expect } = require('../support')
const data = require('../support/fixtures/movies.json')
const { executeSQL } = require('../support/database')

test.beforeAll(async () => {
    await executeSQL(`DELETE from movies`)
})

test('should be able to register a new movie', async ({ page }) => {
    const movie = data.create
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('should be able to remove a movie', async ({ page, request }) => {
    const movie = data.to_remove
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    //td[text()='A Noite dos Mortos-Vivos']/..//button -> xpath alternative, for reference
    await page.movies.remove(movie.title)
    await page.popup.haveText('Filme removido com sucesso.')
})

test('shouldn\'t register if title is already registered', async ({ page, request }) => {
    const movie = data.duplicate
    await request.api.postMovie(movie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.create(movie)
    await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.goForm()
    await page.movies.submit()
    await page.movies.alertHaveText([
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório', 
        'Campo obrigatório'
    ])
})

test('should be able to search for term zombie', async ({ page, request }) => {
    const movies = data.search
    await Promise.all(movies.data.map(m => request.api.postMovie(m)))
    
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.movies.search(movies.input)
    await page.movies.tableHave(movies.outputs)
})