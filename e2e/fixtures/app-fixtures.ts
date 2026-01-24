import { test as base } from '@playwright/test'
import { HomePage } from '../pages/home.page'

type AppFixtures = {
  homePage: HomePage
}

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await homePage.goto()
    await homePage.waitForHydration()
    await use(homePage)
  },
})

export { expect } from '@playwright/test'
