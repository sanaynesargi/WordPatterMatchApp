import { GameStats } from '../../lib/localStorage'
import { Progress } from './Progress'

type Props = {
  gameStats: GameStats
  numberOfGuessesMade: number
}

export const Histogram = ({ gameStats, numberOfGuessesMade }: Props) => {
  const winDistribution = gameStats.winDistribution
  const maxValue = Math.max(...winDistribution)

  return (
    <div className="columns-1 justify-left m-2 text-sm dark:text-white">
      {winDistribution.map((value, i) => {
        if (i === 7) {
          return <> </>
        }
        return (
          <Progress
            key={i}
            index={i - 1}
            currentDayStatRow={numberOfGuessesMade === i}
            size={90 * (value / maxValue)}
            label={String(value)}
          />
        )
      })}
    </div>
  )
}
