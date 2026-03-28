/**
 * Pet registry.
 *
 * To add a new pet:
 * 1. Drop its sprite sheet into /public/pets/<id>/<id>.png
 * 2. Add a new entry below following the same shape.
 *
 * Sprite sheet layout (2×2 grid, 1024×1536 total):
 *   Top-left  (col 0, row 0) → thirsty
 *   Top-right (col 1, row 0) → neutral
 *   Bottom-left  (col 0, row 1) → happy
 *   Bottom-right (col 1, row 1) → thriving
 */

const SHEET = {
  sheetWidth:  1024,
  sheetHeight: 1024,
  cols: 2,
  rows: 2,
  moodFrames: {
    thirsty:  { col: 0, row: 0 },
    neutral:  { col: 1, row: 0 },
    happy:    { col: 0, row: 1 },
    thriving: { col: 1, row: 1 },
  },
}

export const PETS = {
  cat: {
    id:   'cat',
    name: 'Cat',
    icon: '🐱',
    sprite: '/pets/cat/cat.png',
    ...SHEET,
  },
  dog: {
    id:   'dog',
    name: 'Dog',
    icon: '🐶',
    sprite: '/pets/dog/Dog.png',
    ...SHEET,
  },
  panda: {
    id:   'panda',
    name: 'Panda',
    icon: '🐼',
    sprite: '/pets/panda/Panda.png',
    ...SHEET,
  },
  bird: {
    id:   'bird',
    name: 'Bird',
    icon: '🐦',
    sprite: '/pets/bird/Bird.png',
    ...SHEET,
  },
}

export const DEFAULT_PET = 'cat'