import { expect, test } from '../fixtures/app-fixtures'

test.describe('Chord Inversions', () => {
  test('displays inversions card with correct count for maj7 chord', async ({
    chordsPage,
  }) => {
    // Default selection is Cmaj7 (4 notes = 3 inversions)
    await expect(chordsPage.chordInversionsCard).toBeVisible()
    await expect(chordsPage.chordInversions).toBeVisible()

    const inversionCount = await chordsPage.getInversionCount()
    expect(inversionCount).toBe(3) // maj7 has 4 notes, so 3 inversions
  })

  test('displays correct slash notation for inversions', async ({
    chordsPage,
  }) => {
    // Cmaj7 inversions: /E (1st), /G (2nd), /B (3rd)
    await expect(chordsPage.getInversionSlashNotation(1)).toContainText(
      'Cmaj7/E',
    )
    await expect(chordsPage.getInversionSlashNotation(2)).toContainText(
      'Cmaj7/G',
    )
    await expect(chordsPage.getInversionSlashNotation(3)).toContainText(
      'Cmaj7/B',
    )
  })

  test('inversions update when chord changes', async ({ chordsPage }) => {
    // Change to D major triad (3 notes = 2 inversions)
    await chordsPage.selectRootNote('D')
    await chordsPage.selectChordType('D', 'maj')

    const inversionCount = await chordsPage.getInversionCount()
    expect(inversionCount).toBe(2) // triad has 3 notes, so 2 inversions

    // Verify slash notation updates
    await expect(chordsPage.getInversionSlashNotation(1)).toContainText(
      'Dmaj/F#',
    )
    await expect(chordsPage.getInversionSlashNotation(2)).toContainText(
      'Dmaj/A',
    )
  })

  test('each inversion row has interactive compact keyboard', async ({
    chordsPage,
  }) => {
    // Verify keyboards are present for each inversion
    for (let i = 1; i <= 3; i++) {
      const keyboard = chordsPage.getInversionPianoKeyboard(i)
      await expect(keyboard).toBeVisible()

      // Verify it's the compact size by checking for compact key
      const compactKey = keyboard.locator('[data-slot="piano-key"]').first()
      await expect(compactKey).toBeVisible()
    }
  })

  test('inversion play buttons are present', async ({ chordsPage }) => {
    for (let i = 1; i <= 3; i++) {
      const playButton = chordsPage.getInversionPlayChordButton(i)
      await expect(playButton).toBeVisible()
    }
  })

  test('power chord shows no inversions message', async ({ chordsPage }) => {
    // Select power chord (2 notes = 1 inversion only)
    await chordsPage.selectChordCategory('Sus/Power')
    await chordsPage.selectChordType('C', '5')

    // Power chord (5) has only 2 notes, so 1 inversion
    const inversionCount = await chordsPage.getInversionCount()
    expect(inversionCount).toBe(1)
  })
})
