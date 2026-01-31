import { test, expect } from '../support'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, SELECTORS, LOGIN_STRINGS } from '../support/constants'

test.describe('Session Management', () => {
  test('Session Persistence Across Navigation @agent', async ({ page }) => {
    // 1. Login to the admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // Expected: User greeting is visible
    const loggedUser = page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 2. Navigate to movies page
    await page.goto('/admin/movies')

    // Expected: User remains logged in on movies page
    await expect(page).toHaveURL('/admin/movies')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 3. Navigate to TV shows page
    await page.tvshows.goTvShows()

    // Expected: User remains logged in on TV shows page
    await expect(page).toHaveURL('/admin/tvshows')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 4. Navigate to leads page
    await page.leads.goLeads()

    // Expected: User remains logged in on leads page
    await expect(page).toHaveURL('/admin/leads')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 5. Navigate back to movies page
    await page.goto('/admin/movies')

    // Expected: User still logged in after multiple navigations
    await expect(page).toHaveURL('/admin/movies')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))
  })

  test('Session Persistence After Page Refresh @agent', async ({ page }) => {
    // 1. Login to the admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // Expected: User greeting is visible
    const loggedUser = page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 2. Navigate to movies page
    await page.goto('/admin/movies')
    await expect(page).toHaveURL('/admin/movies')

    // 3. Refresh the page
    await page.reload()

    // Expected: User is still logged in after refresh
    await expect(page).toHaveURL('/admin/movies')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 4. Navigate to TV shows page
    await page.tvshows.goTvShows()
    await expect(page).toHaveURL('/admin/tvshows')

    // 5. Refresh the page again
    await page.reload()

    // Expected: User is still logged in after second refresh
    await expect(page).toHaveURL('/admin/tvshows')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 6. Verify admin functionality is still accessible (can access form)
    await page.tvshows.goForm()

    // Expected: Register form is accessible
    await expect(page).toHaveURL('/admin/tvshows/register')
    await expect(page.getByLabel('Titulo da série')).toBeVisible()
  })

  test('Browser Back Button After Logout @agent', async ({ page }) => {
    // 1. Login to the admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // Expected: User is logged in
    const loggedUser = page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 2. Navigate to movies page
    await page.goto('/admin/movies')
    await expect(page).toHaveURL('/admin/movies')

    // 3. Navigate to TV shows page
    await page.tvshows.goTvShows()
    await expect(page).toHaveURL('/admin/tvshows')

    // 4. Navigate to leads page
    await page.leads.goLeads()
    await expect(page).toHaveURL('/admin/leads')

    // 5. Logout
    await page.getByText('Sair').click()

    // Expected: User is redirected to landing page
    await expect(page).toHaveURL('/')

    // 6. Press browser back button
    await page.goBack()

    // Expected: User cannot access protected content (redirected to login or landing)
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // 7. Try to navigate back again
    await page.goBack()

    // Expected: Still cannot access protected content
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)

    // 8. Attempt to access movies page directly
    await page.goto('/admin/movies')

    // Expected: Redirected to login or landing page
    await expect(page).toHaveURL(/(\/admin\/login|\/$)/)
  })

  test('Direct URL Access After Login @agent', async ({ page }) => {
    // 1. Login to the admin panel
    await page.login.do(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, 'Admin')

    // Expected: User is logged in
    const loggedUser = page.locator(SELECTORS.LOGGED_USER)
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 2. Navigate directly to leads page via URL
    await page.goto('/admin/leads')

    // Expected: Page loads correctly without requiring re-login
    await expect(page).toHaveURL('/admin/leads')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible()

    // 3. Navigate directly to movies page via URL
    await page.goto('/admin/movies')

    // Expected: Page loads correctly without requiring re-login
    await expect(page).toHaveURL('/admin/movies')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 4. Navigate directly to TV shows page via URL
    await page.goto('/admin/tvshows')

    // Expected: Page loads correctly without requiring re-login
    await expect(page).toHaveURL('/admin/tvshows')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))

    // 5. Navigate directly to movie register form via URL
    await page.goto('/admin/movies/register')

    // Expected: Form loads correctly without requiring re-login
    await expect(page).toHaveURL('/admin/movies/register')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))
    await expect(page.getByLabel('Titulo do filme')).toBeVisible()

    // 6. Navigate directly to TV show register form via URL
    await page.goto('/admin/tvshows/register')

    // Expected: Form loads correctly without requiring re-login
    await expect(page).toHaveURL('/admin/tvshows/register')
    await expect(loggedUser).toHaveText(LOGIN_STRINGS.USERNAME_GREETING('Admin'))
    await expect(page.getByLabel('Titulo da série')).toBeVisible()
  })
})
