import { unicodeSplit } from './words'

export type CharStatus = 'absent' | 'present' | 'correct'

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, i) => {
      // color logic
      return (charObj[letter] = 'present')
    })
  })

  return charObj
}

export const getGuessStatuses = (guess: string): CharStatus[] => {
  const splitGuess = unicodeSplit(guess)
  //const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((letter, i) => {
    statuses[i] = 'absent'
    //solutionCharsTaken[i] = true
    return
  })

  return statuses
}
