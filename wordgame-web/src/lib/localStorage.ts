import { CountdownTimeDelta } from 'react-countdown'

const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'
const timeKey = 'timePassed'
const wordKey = 'currentWords'

type StoredGameState = {
  guesses: string[]
  solution: string
}

export const clearGuesses = () => {
  localStorage.removeItem(gameStateKey)
}

export const saveIndexToLocalStorage = (index: number) => {
  localStorage.setItem(wordKey, JSON.stringify({ day: index }))
}

export const loadIndexFromLocalStorage = () => {
  const state = localStorage.getItem(wordKey)
  return state ? JSON.parse(state) : null
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const saveTimeToLocalStorage = (time: CountdownTimeDelta) => {
  localStorage.setItem(timeKey, JSON.stringify(time))
}

export const removeTimeFromLocalStorage = () => {
  localStorage.removeItem(timeKey)
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

export const loadTimeFromLocalStorage = () => {
  const state = localStorage.getItem(timeKey)
  return state ? (JSON.parse(state) as CountdownTimeDelta) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  score?: number
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
