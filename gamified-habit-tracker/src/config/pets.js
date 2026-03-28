/**
 * Pet registry.
 *
 * To add a new pet:
 * 1. Drop its sprite sheet into /public/pets/<id>/
 * 2. Add a new entry here following the same shape.
 *
 * Sprite sheet layout:
 *   - 2×2 grid, each frame square (frameSize × frameSize px)
 *   - Top-left  (col 0, row 0) → thirsty
 *   - Top-right (col 1, row 0) → neutral
 *   - Bottom-left  (col 0, row 1) → happy
 *   - Bottom-right (col 1, row 1) → thriving
 */

export const PETS = {
  cat: {
    id: 'cat',
    name: 'Cat',
    sprite: '/pets/cat/cat.png',
    // Full sprite sheet dimensions
    sheetWidth:  1024,
    sheetHeight: 1536,
    // Grid layout
    cols: 2,
    rows: 2,
    // Derived per-frame size (sheetWidth/cols × sheetHeight/rows) = 512 × 768
    moodFrames: {
      thirsty:  { col: 0, row: 0 },
      neutral:  { col: 1, row: 0 },
      happy:    { col: 0, row: 1 },
      thriving: { col: 1, row: 1 },
    },
  },

  // ── Add future pets below ──
  // dog: {
  //   id: 'dog',
  //   name: 'Dog',
  //   sprite: '/pets/dog/dog.png',
  //   sheetWidth:  1024,
  //   sheetHeight: 1536,
  //   cols: 2,
  //   rows: 2,
  //   moodFrames: {
  //     thirsty:  { col: 0, row: 0 },
  //     neutral:  { col: 1, row: 0 },
  //     happy:    { col: 0, row: 1 },
  //     thriving: { col: 1, row: 1 },
  //   },
  // },
}

export const DEFAULT_PET = 'cat'
