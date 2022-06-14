import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  guess: string
  className: string
  word: string
}

export const CurrentRow = ({ guess, className, word }: Props) => {
  const splitGuess = unicodeSplit(guess)
  const emptyCells = Array.from(Array(word.length - splitGuess.length))
  const classes = `flex justify-center mb-1 ${className}`

  return (
    <div className={classes}>
      {splitGuess.map((letter, i) => {
        if (word && !word[i].includes('_')) {
          return (
            <Cell
              key={i}
              value={
                word[i].length === 3
                  ? word[i][1].toUpperCase()
                  : word[i][2].toUpperCase()
              }
              status={'correct'}
            />
          )
        }
        return <Cell key={i} value={letter} />
      })}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
