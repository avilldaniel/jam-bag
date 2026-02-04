import { expect, test } from '../fixtures/app-fixtures'

test.describe('Theme Toggle', () => {
  test('header and theme toggle are visible on page load', async ({
    chordsPage,
  }) => {
    await test.step('Verify header is visible', async () => {
      await expect(chordsPage.header).toBeVisible()
    })

    await test.step('Verify theme toggle button is visible', async () => {
      await expect(chordsPage.themeToggle).toBeVisible()
    })
  })

  test('theme toggle has accessible label', async ({ chordsPage }) => {
    await test.step('Verify toggle has aria-label', async () => {
      await expect(chordsPage.themeToggle).toHaveAttribute(
        'aria-label',
        /Switch to (light|dark) mode/,
      )
    })
  })

  test('can toggle between light and dark mode', async ({ chordsPage }) => {
    await test.step('Check initial theme state', async () => {
      // Initial state depends on system preference or stored preference
      // Just verify we can read the state
      const isDark = await chordsPage.isDarkMode()
      expect(typeof isDark).toBe('boolean')
    })

    await test.step('Toggle theme to dark mode', async () => {
      const initialIsDark = await chordsPage.isDarkMode()
      await chordsPage.toggleTheme()

      // After toggling, the theme should be opposite
      const newIsDark = await chordsPage.isDarkMode()
      expect(newIsDark).toBe(!initialIsDark)
    })

    await test.step('Toggle theme back to original', async () => {
      const currentIsDark = await chordsPage.isDarkMode()
      await chordsPage.toggleTheme()

      const finalIsDark = await chordsPage.isDarkMode()
      expect(finalIsDark).toBe(!currentIsDark)
    })
  })

  test('theme preference persists after page reload', async ({
    chordsPage,
  }) => {
    await test.step('Set to dark mode', async () => {
      // First ensure we're in light mode
      if (await chordsPage.isDarkMode()) {
        await chordsPage.toggleTheme()
      }
      expect(await chordsPage.isDarkMode()).toBe(false)

      // Now toggle to dark mode
      await chordsPage.toggleTheme()
      expect(await chordsPage.isDarkMode()).toBe(true)
    })

    await test.step('Reload page and verify dark mode persists', async () => {
      await chordsPage.page.reload()
      await chordsPage.waitForHydration()

      // Give time for theme to be applied from localStorage
      await chordsPage.page.waitForTimeout(100)

      expect(await chordsPage.isDarkMode()).toBe(true)
    })
  })
})
