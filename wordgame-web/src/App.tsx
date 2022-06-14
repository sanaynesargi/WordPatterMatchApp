import { useState, useEffect } from 'react'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { SettingsModal } from './components/modals/SettingsModal'

// ADD NEW DAY

import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import {
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  GAME_LOST_INFO_DELAY,
  WELCOME_INFO_MODAL_MS,
  TIME,
} from './constants/settings'
import {
  //   solution,
  unicodeLength,
} from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  getStoredIsHighContrastMode,
  saveTimeToLocalStorage,
  loadTimeFromLocalStorage,
  loadIndexFromLocalStorage,
  saveIndexToLocalStorage,
  clearGuesses,
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import Countdown, { CountdownTimeDelta } from 'react-countdown'

let START = Date.now()
let DURATION = TIME

function App() {
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [timerDone, setTimerDone] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [currentGuess, setCurrentGuess] = useState('')
  const [formattedWord, setFormattedWord] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [words, setWords] = useState([''])
  const [score, setScore] = useState(0)
  const [isGameLost] = useState(false)
  const [MAX_WORD_LENGTH, setMAX_WORD_LENGTH] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    setScore(loaded ? loaded.guesses.length : 0)
    return loaded?.guesses ?? []
  })

  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage()) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }

    START = Date.now()
    const loadedTime = loadTimeFromLocalStorage()
    console.log(loadedTime)
    if (loadedTime) {
      DURATION = (60 * loadedTime.minutes + loadedTime.seconds) * 1000
    }
  }, [])

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const loadedIndex = loadIndexFromLocalStorage()
    const requestOptions = {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    }
    fetch(
      //'https://uxajtk91jk.execute-api.us-east-1.amazonaws.com/dev/words',
      'http://localhost:8080/words',
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res, MAX_WORD_LENGTH)
        setWords(res.words)
        setMAX_WORD_LENGTH(res.word.length)

        if (!words) return
        if (res?.day !== loadedIndex?.day) {
          console.log(res.day === loadedIndex?.day)
          setIsGameWon(false)
          setTimerDone(false)
          clearGuesses()
          setGuesses([])
          setScore(0)
          // saveTimeToLocalStorage({
          //   minutes: 2,
          // } as CountdownTimeDelta)
          DURATION = TIME
        } else {
          const loadedTime = loadTimeFromLocalStorage()
          if (loadedTime?.completed) {
            setTimerDone(true)
          } else {
            setTimerDone(false)
          }
        }
        saveIndexToLocalStorage(res.day)
        setLoaded(true)
        setFormattedWord(res.word)
      })
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    let solution: string = 'anc'
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH
      setTimerDone(true)
      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
      setCurrentGuess('')
      const currentTime = loadTimeFromLocalStorage()
      saveTimeToLocalStorage({
        ...currentTime,
        seconds: 0,
        completed: true,
      } as CountdownTimeDelta)
      setGuesses([])
      clearGuesses()
      setScore(0)
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, GAME_LOST_INFO_DELAY)
    }
  }, [isGameWon, isGameLost, showSuccessAlert, MAX_WORD_LENGTH])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)

      if (currentGuess.length === 0) return

      let parsedGuessValue = formattedWord[currentGuess.length - 1]
      parsedGuessValue =
        parsedGuessValue[parsedGuessValue.length === 3 ? 1 : 2].toUpperCase()

      if (
        parsedGuessValue !== '_' &&
        parsedGuessValue !== currentGuess[currentGuess.length - 1]
      ) {
        // console.log(
        //   parsedGuessValue,
        //   currentGuess,
        //   currentGuess.replace(
        //     currentGuess[currentGuess.length - 1],
        //     parsedGuessValue
        //   )
        // )
        setCurrentGuess(
          currentGuess.replace(
            currentGuess[currentGuess.length - 1],
            parsedGuessValue
          ) + value
        )
      }
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }
    //console.log(guessCount, guesses, currentGuess, guesses[guessCount - 1])

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (guesses.includes(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert('Duplicate Word', {
        onClose: clearCurrentRowClass,
      })
    }

    if (words && words.includes(currentGuess.toLowerCase()) === false) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    setIsRevealing(true)
    setScore(score + 1)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH)

    const winningWord = score === 5

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, 6))
        return setIsGameWon(true)
      }
    }
  }

  //console.log(words, formattedWord)
  //console.log(score, timerDone)

  return (
    <div className="h-screen flex flex-col">
      {loaded ? (
        <>
          <Navbar
            setIsInfoModalOpen={(value) => {
              setIsInfoModalOpen(value)
            }}
            setIsStatsModalOpen={setIsStatsModalOpen}
            setIsSettingsModalOpen={setIsSettingsModalOpen}
          />
          <div className="pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow">
            <div className="pb-6 grow">
              <Grid
                guesses={guesses}
                word={formattedWord}
                currentGuess={currentGuess}
                isRevealing={isRevealing}
                currentRowClassName={currentRowClass}
                done={setTimerDone}
              />
              <div className="flex justify-center">
                {!timerDone ? (
                  <Countdown
                    date={START + DURATION}
                    daysInHours
                    zeroPadTime={2}
                    className={'timer mt-10'}
                    onComplete={() => {
                      setTimerDone(true)
                      setIsGameWon(true)
                      addStatsForCompletedGame(stats, score)
                    }}
                    onTick={(time) => {
                      if (isInfoModalOpen) {
                        return
                      }
                      saveTimeToLocalStorage(time)
                    }}
                  ></Countdown>
                ) : (
                  <h1 className={'timer done mt-10'}>DONE</h1>
                )}
              </div>
              <div className="flex justify-center flex-col">
                <h1 className={'score flex justify-center'}>
                  {'Score: ' + score.toString()}
                </h1>
              </div>
            </div>
            <Keyboard
              onChar={!timerDone ? onChar : () => {}}
              onDelete={!timerDone ? onDelete : () => {}}
              onEnter={!timerDone ? onEnter : () => {}}
              guesses={[]}
              word={formattedWord}
              isRevealing={isRevealing}
            />
            <InfoModal
              isOpen={isInfoModalOpen}
              handleClose={() => setIsInfoModalOpen(false)}
            />
            <StatsModal
              isOpen={isStatsModalOpen}
              handleClose={() => setIsStatsModalOpen(false)}
              guesses={guesses}
              gameStats={stats}
              isGameLost={isGameLost}
              isGameWon={isGameWon}
              handleShareToClipboard={() =>
                showSuccessAlert(GAME_COPIED_MESSAGE)
              }
              isHardMode={false}
              isDarkMode={isDarkMode}
              isHighContrastMode={isHighContrastMode}
              numberOfGuessesMade={score}
            />
            <SettingsModal
              isOpen={isSettingsModalOpen}
              handleClose={() => setIsSettingsModalOpen(false)}
              isHardMode={false}
              handleHardMode={() => {}}
              isDarkMode={isDarkMode}
              handleDarkMode={handleDarkMode}
              isHighContrastMode={isHighContrastMode}
              handleHighContrastMode={handleHighContrastMode}
            />
            <AlertContainer />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default App
