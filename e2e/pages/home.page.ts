import type { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly chordSelectorCard: Locator
  readonly cardTitle: Locator
  readonly cardDescription: Locator
  readonly rootNoteSelector: Locator
  readonly chordSelector: Locator

  constructor(page: Page) {
    this.page = page
    // Scope to the specific Chord Selector card using text content
    this.chordSelectorCard = page.locator('[data-slot="card"]').filter({
      has: page.locator('[data-slot="card-title"]', {
        hasText: 'Chord Selector',
      }),
    })
    // Scope cardTitle and cardDescription to the Chord Selector card
    this.cardTitle = this.chordSelectorCard.locator('[data-slot="card-title"]')
    this.cardDescription = this.chordSelectorCard.locator(
      '[data-slot="card-description"]',
    )
    this.rootNoteSelector = page.locator('[data-slot="root-note-selector"]')
    this.chordSelector = page.locator('[data-slot="chord-selector"]')
  }

  async goto() {
    await this.page.goto('/')
  }

  async waitForHydration() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForLoadState('domcontentloaded')
  }

  // Root Note Selection
  async selectRootNote(note: string) {
    await this.page
      .getByRole('button', { name: `Select ${note} as root note` })
      .click()
  }

  async getSelectedRootNote(): Promise<string | null> {
    const pressedButton = this.rootNoteSelector.locator('[data-pressed]')
    return pressedButton.textContent()
  }

  getRootNoteButton(note: string): Locator {
    return this.page.getByRole('button', {
      name: `Select ${note} as root note`,
    })
  }

  // Chord Category Selection
  async selectChordCategory(category: string) {
    await this.page.getByRole('tab', { name: category }).click()
  }

  getChordCategoryTab(category: string): Locator {
    return this.page.getByRole('tab', { name: category })
  }

  // Chord Type Selection
  async selectChordType(rootNote: string, chordType: string) {
    const fullChordName = `${rootNote}${chordType}`
    await this.page
      .getByRole('radio', { name: `Select ${fullChordName}`, exact: true })
      .click()
  }

  getChordTypeButton(rootNote: string, chordType: string): Locator {
    const fullChordName = `${rootNote}${chordType}`
    return this.page.getByRole('radio', {
      name: `Select ${fullChordName}`,
      exact: true,
    })
  }
}
