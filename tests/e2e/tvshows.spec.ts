import { test, expect } from '../support'
import { executeSQL } from '../support/database'

const data = require('../support/fixtures/tvshows.json')

test.beforeAll(async () => {
  await executeSQL(`DELETE from tvshows`)
})

test('should be able to register a new tv show', async ({ page: anyPage }) => {
  const page = anyPage as any
  const tvshow = data.create
  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.tvshows.create(tvshow)
  await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('should be able to remove a tv show', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const tvshow = data.to_remove
  await request.api.postTvShow(tvshow)

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.tvshows.remove(tvshow.title)
  await page.popup.haveText('Série removida com sucesso.')
})

test('shouldn\'t register if title is already registered', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const tvshow = data.duplicate
  await request.api.postTvShow(tvshow)

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.tvshows.create(tvshow)
  await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('shouldn\'t register if mandatory fields aren\'t filled', async ({ page: anyPage }) => {
  const page = anyPage as any
  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.tvshows.goTvShows()
  await page.tvshows.goForm()
  await page.tvshows.submit()
  await page.tvshows.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório (apenas números)'
  ])
})

test('should be able to search for term zombie', async ({ page: anyPage, request: anyRequest }) => {
  const page = anyPage as any
  const request = anyRequest as any
  const tvshows = data.search
  await Promise.all(tvshows.data.map((t: any) => request.api.postTvShow(t)))

  await page.login.do(process.env.ADMIN_EMAIL || 'admin@zombieplus.com', process.env.ADMIN_PASSWORD || 'pwd123', 'Admin')
  await page.tvshows.search(tvshows.input)
  await page.tvshows.tableHave(tvshows.outputs)
})
