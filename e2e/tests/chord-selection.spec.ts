import { expect, test } from '../fixtures/app-fixtures'

test.describe('Chord Selector', () => {
  test('displays chord selector with default C maj7 selection', async ({
    homePage,
  }) => {
    // Verify UI components are visible
    await expect(homePage.cardTitle).toBeVisible()
    await expect(homePage.rootNoteSelector).toBeVisible()
    await expect(homePage.chordSelector).toBeVisible()

    // Verify default selection
    const rootNoteButton = homePage.getRootNoteButton('C')
    await expect(rootNoteButton).toHaveAttribute('data-pressed')

    const chordButton = homePage.getChordTypeButton('C', 'maj7')
    await expect(chordButton).toHaveAttribute('aria-checked', 'true')
  })

  test('can select different root notes (natural, sharp, enharmonic)', async ({
    homePage,
  }) => {
    // Test representative sample: natural, sharp, and last note
    const testNotes = ['D', 'F#', 'B']

    for (const note of testNotes) {
      await homePage.selectRootNote(note)
      const button = homePage.getRootNoteButton(note)
      await expect(button).toHaveAttribute('data-pressed')
    }
  })

  test('root note change updates chord button labels', async ({ homePage }) => {
    await homePage.selectRootNote('G')
    const gMaj7Button = homePage.getChordTypeButton('G', 'maj7')
    await expect(gMaj7Button).toContainText('Gmaj7')
  })

  test('can navigate chord categories and select chords', async ({
    homePage,
  }) => {
    // Switch to Minor category
    await homePage.selectChordCategory('Minor')
    await expect(homePage.getChordCategoryTab('Minor')).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // Verify minor chords are available
    const m7Button = homePage.getChordTypeButton('C', 'm7')
    await expect(m7Button).toBeVisible()

    // Select a minor chord
    await homePage.selectChordType('C', 'm7')
    await expect(m7Button).toHaveAttribute('aria-checked', 'true')
  })

  test('complete flow: select root, category, and chord type', async ({
    homePage,
  }) => {
    await homePage.selectRootNote('A')
    await homePage.selectChordCategory('Dominant')
    await homePage.selectChordType('A', '7')

    const chordButton = homePage.getChordTypeButton('A', '7')
    await expect(chordButton).toHaveAttribute('aria-checked', 'true')
  })

  test('keyboard navigation works for root note selector', async ({
    homePage,
  }) => {
    const firstNote = homePage.getRootNoteButton('C')
    await firstNote.focus()

    await homePage.page.keyboard.press('ArrowRight')
    const nextNote = homePage.getRootNoteButton('C#')
    await expect(nextNote).toBeFocused()
  })
})
