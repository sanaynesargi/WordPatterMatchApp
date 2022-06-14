import { Cell } from './Cell'

interface Props {
  word: string
}

export const EmptyRow = ({ word }: Props) => {
  const emptyCells = Array.from(Array(word.length))

  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => {
        if (!word) {
          return <Cell />
        }

        if (!word[i].includes('_')) {
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
        return <Cell key={i} value={''} />
      })}
    </div>
  )
}
