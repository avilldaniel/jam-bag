import { test as base } from '@playwright/test'
import { ChordsPage } from '../pages/chords.page'

type AppFixtures = {
  chordsPage: ChordsPage
}

export const test = base.extend<AppFixtures>({
  chordsPage: async ({ page }, use) => {
    const chordsPage = new ChordsPage(page)
    await chordsPage.goto()
    await chordsPage.waitForHydration()
    await use(chordsPage)
  },
})

export { expect } from '@playwright/test'
