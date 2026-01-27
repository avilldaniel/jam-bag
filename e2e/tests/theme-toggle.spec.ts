import { expect, test } from '../fixtures/app-fixtures'

test.describe('Theme Toggle', () => {
  test('header and theme toggle are visible on page load', async ({
    homePage,
  }) => {
    await test.step('Verify header is visible', async () => {
      await expect(homePage.header).toBeVisible()
    })

    await test.step('Verify theme toggle button is visible', async () => {
      await expect(homePage.themeToggle).toBeVisible()
    })
  })

  test('theme toggle has accessible label', async ({ homePage }) => {
    await test.step('Verify toggle has aria-label', async () => {
      await expect(homePage.themeToggle).toHaveAttribute(
        'aria-label',
        /Switch to (light|dark) mode/,
      )
    })
  })

  test('can toggle between light and dark mode', async ({ homePage }) => {
    await test.step('Check initial theme state', async () => {
      // Initial state depends on system preference or stored preference
      // Just verify we can read the state
      const isDark = await homePage.isDarkMode()
      expect(typeof isDark).toBe('boolean')
    })

    await test.step('Toggle theme to dark mode', async () => {
      const initialIsDark = await homePage.isDarkMode()
      await homePage.toggleTheme()

      // After toggling, the theme should be opposite
      const newIsDark = await homePage.isDarkMode()
      expect(newIsDark).toBe(!initialIsDark)
    })

    await test.step('Toggle theme back to original', async () => {
      const currentIsDark = await homePage.isDarkMode()
      await homePage.toggleTheme()

      const finalIsDark = await homePage.isDarkMode()
      expect(finalIsDark).toBe(!currentIsDark)
    })
  })

  test('theme preference persists after page reload', async ({ homePage }) => {
    await test.step('Set to dark mode', async () => {
      // First ensure we're in light mode
      if (await homePage.isDarkMode()) {
        await homePage.toggleTheme()
      }
      expect(await homePage.isDarkMode()).toBe(false)

      // Now toggle to dark mode
      await homePage.toggleTheme()
      expect(await homePage.isDarkMode()).toBe(true)
    })

    await test.step('Reload page and verify dark mode persists', async () => {
      await homePage.page.reload()
      await homePage.waitForHydration()

      // Give time for theme to be applied from localStorage
      await homePage.page.waitForTimeout(100)

      expect(await homePage.isDarkMode()).toBe(true)
    })
  })
})
