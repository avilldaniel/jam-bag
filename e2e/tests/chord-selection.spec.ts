import { expect, test } from '../fixtures/app-fixtures'

test.describe('Chord Selector', () => {
  test('displays the chord selector card on page load', async ({
    homePage,
  }) => {
    await expect(homePage.cardTitle).toBeVisible()
    await expect(homePage.cardDescription).toBeVisible()
    await expect(homePage.rootNoteSelector).toBeVisible()
    await expect(homePage.chordSelector).toBeVisible()
  })

  test('has default selection of C and maj7', async ({ homePage }) => {
    await test.step('Check default root note is C', async () => {
      const rootNoteButton = homePage.getRootNoteButton('C')
      await expect(rootNoteButton).toHaveAttribute('data-pressed')
    })

    await test.step('Check default chord is maj7', async () => {
      const chordButton = homePage.getChordTypeButton('C', 'maj7')
      await expect(chordButton).toHaveAttribute('aria-checked', 'true')
    })
  })
})

test.describe('Root Note Selection', () => {
  test('can select all 12 chromatic notes', async ({ homePage }) => {
    const notes = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]

    for (const note of notes) {
      await test.step(`Select ${note}`, async () => {
        await homePage.selectRootNote(note)
        const rootNoteButton = homePage.getRootNoteButton(note)
        await expect(rootNoteButton).toHaveAttribute('data-pressed')
      })
    }
  })

  test('updates chord buttons when root note changes', async ({ homePage }) => {
    await test.step('Select D as root note', async () => {
      await homePage.selectRootNote('D')
    })

    await test.step('Verify chord buttons show D root note', async () => {
      // The chord buttons should now display D instead of C
      const dMaj7Button = homePage.getChordTypeButton('D', 'maj7')
      await expect(dMaj7Button).toBeVisible()
      await expect(dMaj7Button).toContainText('Dmaj7')
    })
  })
})

test.describe('Chord Category Tabs', () => {
  const categories = ['Major', 'Minor', 'Dominant', 'Dim/Aug', 'Sus/Power']

  test('can navigate between all chord categories', async ({ homePage }) => {
    for (const category of categories) {
      await test.step(`Select ${category} category`, async () => {
        await homePage.selectChordCategory(category)
        const tab = homePage.getChordCategoryTab(category)
        await expect(tab).toHaveAttribute('aria-selected', 'true')
      })
    }
  })

  test('Minor category shows minor chord options', async ({ homePage }) => {
    await test.step('Switch to Minor category', async () => {
      await homePage.selectChordCategory('Minor')
      const tab = homePage.getChordCategoryTab('Minor')
      await expect(tab).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('Check minor chord buttons are visible', async () => {
      const minorChordButton = homePage.getChordTypeButton('C', 'm')
      await expect(minorChordButton).toBeVisible()

      const minor7Button = homePage.getChordTypeButton('C', 'm7')
      await expect(minor7Button).toBeVisible()
    })
  })

  test('Dominant category shows dominant chord options', async ({
    homePage,
  }) => {
    await test.step('Switch to Dominant category', async () => {
      await homePage.selectChordCategory('Dominant')
      const tab = homePage.getChordCategoryTab('Dominant')
      await expect(tab).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('Check dominant chord buttons are visible', async () => {
      const dom7Button = homePage.getChordTypeButton('C', '7')
      await expect(dom7Button).toBeVisible()

      const dom9Button = homePage.getChordTypeButton('C', '9')
      await expect(dom9Button).toBeVisible()
    })
  })
})

test.describe('Complete User Flow', () => {
  test('user can create a chord selection from scratch', async ({
    homePage,
  }) => {
    await test.step('Select G as root note', async () => {
      await homePage.selectRootNote('G')
      const rootNoteButton = homePage.getRootNoteButton('G')
      await expect(rootNoteButton).toHaveAttribute('data-pressed')
    })

    await test.step('Switch to Minor category', async () => {
      await homePage.selectChordCategory('Minor')
      const tab = homePage.getChordCategoryTab('Minor')
      await expect(tab).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('Select m7 chord', async () => {
      await homePage.selectChordType('G', 'm7')
      const chordButton = homePage.getChordTypeButton('G', 'm7')
      await expect(chordButton).toHaveAttribute('aria-checked', 'true')
    })
  })

  test('keyboard navigation works for root note selector', async ({
    homePage,
  }) => {
    await test.step('Focus on root note selector', async () => {
      const firstNote = homePage.getRootNoteButton('C')
      await firstNote.focus()
    })

    await test.step('Navigate with arrow keys', async () => {
      await homePage.page.keyboard.press('ArrowRight')
      const nextNote = homePage.getRootNoteButton('C#')
      await expect(nextNote).toBeFocused()
    })
  })
})
