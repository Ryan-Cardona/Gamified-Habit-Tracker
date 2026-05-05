/**
 * Pet registry.
 *
 * To add a new pet:
 * 1. Drop 4 images into /public/pets/<id>/
 *    named: <id>Thirsty.png, <id>Neutral.png, <id>Happy.png, <id>Thriving.png
 * 2. Add a new entry below following the same shape.
 */

export const PETS = {
  cat: {
    id:          'cat',
    name:        'Cat',
    icon:        '🐱',
    unlockLevel: 1,
    moodImages: {
      thirsty:  '/pets/cat/catThirsty.png',
      neutral:  '/pets/cat/catNeutral.png',
      happy:    '/pets/cat/catHappy.png',
      thriving: '/pets/cat/catThriving.png',
    },
  },
  dog: {
    id:          'dog',
    name:        'Dog',
    icon:        '🐶',
    unlockLevel: 2,
    moodImages: {
      thirsty:  '/pets/dog/dogThirsty.png',
      neutral:  '/pets/dog/dogNeutral.png',
      happy:    '/pets/dog/dogHappy.png',
      thriving: '/pets/dog/dogThriving.png',
    },
  },
  panda: {
    id:          'panda',
    name:        'Panda',
    icon:        '🐼',
    unlockLevel: 4,
    moodImages: {
      thirsty:  '/pets/panda/pandaThirsty.png',
      neutral:  '/pets/panda/pandaNeutral.png',
      happy:    '/pets/panda/pandaHappy.png',
      thriving: '/pets/panda/pandaThriving.png',
    },
  },
  bird: {
    id:          'bird',
    name:        'Bird',
    icon:        '🐦',
    unlockLevel: 5,
    moodImages: {
      thirsty:  '/pets/bird/birdThirsty.png',
      neutral:  '/pets/bird/birdNeutral.png',
      happy:    '/pets/bird/birdHappy.png',
      thriving: '/pets/bird/birdThriving.png',
    },
  },
  dinosaur: {
    id:           'dinosaur',
    name:         'Dinosaur',
    icon:         '🦕',
    unlockStreak: 3,
    moodImages: {
      thirsty:  '/pets/dinosaur/dinosaurThirsty.png',
      neutral:  '/pets/dinosaur/dinosaurNeutral.png',
      happy:    '/pets/dinosaur/dinosaurHappy.png',
      thriving: '/pets/dinosaur/dinosaurThriving.png',
    },
  },
}

export const DEFAULT_PET = 'cat'

/** Returns true if the user has met this pet's unlock condition. */
export function isPetUnlocked(pet, { userLevel, userStreak }) {
  if (pet.unlockLevel  != null) return userLevel  >= pet.unlockLevel
  if (pet.unlockStreak != null) return userStreak >= pet.unlockStreak
  return true
}