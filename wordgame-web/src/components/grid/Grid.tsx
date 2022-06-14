import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
  word: string
  done: any
}

export const Grid = ({
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
  word,
  done,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  return (
    <>
      <>
        {guesses.map((guess, i) => (
          <CompletedRow
            key={i}
            guess={guess}
            word={word}
            isRevealing={isRevealing && guesses.length - 1 === i}
          />
        ))}
        {guesses.length < MAX_CHALLENGES && (
          <CurrentRow
            guess={currentGuess}
            className={currentRowClassName}
            word={word}
          />
        )}
        {empties.map((_, i) => (
          <EmptyRow key={i} word={word} />
        ))}
      </>
    </>
  )
}
