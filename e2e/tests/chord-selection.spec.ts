import { expect, test } from '../fixtures/app-fixtures'

test.describe('Chord Selector', () => {
  test('displays chord selector with default C maj7 selection', async ({
    chordsPage,
  }) => {
    // Verify UI components are visible
    await expect(chordsPage.cardTitle).toBeVisible()
    await expect(chordsPage.rootNoteSelector).toBeVisible()
    await expect(chordsPage.chordSelector).toBeVisible()

    // Verify default selection
    const rootNoteButton = chordsPage.getRootNoteButton('C')
    await expect(rootNoteButton).toHaveAttribute('data-pressed')

    const chordButton = chordsPage.getChordTypeButton('C', 'maj7')
    await expect(chordButton).toHaveAttribute('aria-checked', 'true')
  })

  test('can select different root notes (natural, sharp, enharmonic)', async ({
    chordsPage,
  }) => {
    // Test representative sample: natural, sharp, and last note
    const testNotes = ['D', 'F#', 'B']

    for (const note of testNotes) {
      await chordsPage.selectRootNote(note)
      const button = chordsPage.getRootNoteButton(note)
      await expect(button).toHaveAttribute('data-pressed')
    }
  })

  test('root note change updates chord button labels', async ({
    chordsPage,
  }) => {
    await chordsPage.selectRootNote('G')
    const gMaj7Button = chordsPage.getChordTypeButton('G', 'maj7')
    await expect(gMaj7Button).toContainText('Gmaj7')
  })

  test('can navigate chord categories and select chords', async ({
    chordsPage,
  }) => {
    // Switch to Minor category
    await chordsPage.selectChordCategory('Minor')
    await expect(chordsPage.getChordCategoryTab('Minor')).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // Verify minor chords are available
    const m7Button = chordsPage.getChordTypeButton('C', 'm7')
    await expect(m7Button).toBeVisible()

    // Select a minor chord
    await chordsPage.selectChordType('C', 'm7')
    await expect(m7Button).toHaveAttribute('aria-checked', 'true')
  })

  test('complete flow: select root, category, and chord type', async ({
    chordsPage,
  }) => {
    await chordsPage.selectRootNote('A')
    await chordsPage.selectChordCategory('Dominant')
    await chordsPage.selectChordType('A', '7')

    const chordButton = chordsPage.getChordTypeButton('A', '7')
    await expect(chordButton).toHaveAttribute('aria-checked', 'true')
  })

  test('keyboard navigation works for root note selector', async ({
    chordsPage,
  }) => {
    const firstNote = chordsPage.getRootNoteButton('C')
    await firstNote.focus()

    await chordsPage.page.keyboard.press('ArrowRight')
    const nextNote = chordsPage.getRootNoteButton('C#')
    await expect(nextNote).toBeFocused()
  })
})
