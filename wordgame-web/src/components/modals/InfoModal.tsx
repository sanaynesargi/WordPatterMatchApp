import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess words that follow the letter pattern. The goal is to guess 6 words
        that match. You can move to the next row once you've typed in a valid
        guess.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell />
        <Cell />
        <Cell />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="I"
          status="correct"
        />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="N"
          status="correct"
        />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="G"
          status="correct"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
        The letter sequence is _ _ i n g, so you have to find a word that
        matches it
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell
          value="R"
          status="present"
          isRevealing={true}
          isCompleted={true}
        />
        <Cell
          value="O"
          status="present"
          isRevealing={true}
          isCompleted={true}
        />
        <Cell
          value="W"
          status="present"
          isRevealing={true}
          isCompleted={true}
        />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="I"
          status="correct"
        />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="N"
          status="correct"
        />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="G"
          status="correct"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
        When you have guessed a word that matches the sequence, the letters that
        you typed in will appear yellow, while the required letters will appear
        green.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
        Once you have entered a correct guess, the next row will be blank. If
        you have completed every row, then you have won. <br />
        <u>
          <strong className="text-lg">But, you only have 2 minutes.</strong>
        </u>
      </p>

      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        Word Pattern Match by <b>Sanay Nesargi</b>
      </p>
    </BaseModal>
  )
}
