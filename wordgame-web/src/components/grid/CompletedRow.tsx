import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
  guess: string
  isRevealing?: boolean
  word: string
}

export const CompletedRow = ({ guess, isRevealing, word }: Props) => {
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => {
        if (!word) return <Cell />

        if (word[i].includes('_')) {
          return (
            <Cell
              key={i}
              value={letter}
              status={'present'}
              position={i}
              isRevealing={isRevealing}
              isCompleted
            />
          )
        } else {
          return (
            <Cell
              key={i}
              value={letter}
              status={'correct'}
              position={i}
              isRevealing={isRevealing}
              isCompleted
            />
          )
        }
      })}
    </div>
  )
}
