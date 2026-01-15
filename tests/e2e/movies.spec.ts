import { test, expect } from '../support'
import { executeSQL } from '../support/database'

const data = require('../support/fixtures/movies.json')

test.beforeAll(async () => {
  await executeSQL(`DELETE from movies`)
})

test('should be able to register a new movie', async ({ page: anyPage }) => {
  const page = anyPage as any
  const movie = data.create
  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.movies.create(movie)
  await page.popup.haveText(`O filme '${movie.title}' foi adicionado ao catálogo.`)
})

test('should be able to remove a movie', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const movie = data.to_remove
  await request.api.postMovie(movie)

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.movies.remove(movie.title)
  await page.popup.haveText('Filme removido com sucesso.')
})

test('shouldn\'t register if title is already registered', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const movie = data.duplicate
  await request.api.postMovie(movie)

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.movies.create(movie)
  await page.popup.haveText(`O título '${movie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page: anyPage }) => {
  const page = anyPage as any
  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.movies.goForm()
  await page.movies.submit()
  await page.movies.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório'
  ])
})

test('should be able to search for term zombie', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const movies = data.search
  await Promise.all(movies.data.map((m: any) => request.api.postMovie(m)))

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.movies.search(movies.input)
  await page.movies.tableHave(movies.outputs)
})
