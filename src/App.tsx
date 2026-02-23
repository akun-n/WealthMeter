import { useEffect, useState } from 'react'
import './App.css'

const NORMAL_SPEED = 0.5
const BOOST_SPEED = 4
const MAX_VALUE = 9000

function App() {
  const [value, setValue] = useState(0)
  const [isBoosting, setIsBoosting] = useState(false)
  const [boostTick, setBoostTick] = useState(0)

  const currentSpeed = isBoosting ? BOOST_SPEED : NORMAL_SPEED

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue((prev) => {
        const next = prev + currentSpeed
        return next > MAX_VALUE ? MAX_VALUE : next
      })
      setBoostTick((t) => t + 1)
    }, 50)

    return () => clearInterval(intervalId)
  }, [currentSpeed])

  useEffect(() => {
    if (!isBoosting) return

    const timeoutId = setTimeout(() => {
      setIsBoosting(false)
    }, 8000)

    return () => clearTimeout(timeoutId)
  }, [isBoosting])

  const handleBoost = () => {
    if (isBoosting) return
    setIsBoosting(true)
  }

  const basePercentage = Math.min(value / MAX_VALUE, 1) + 0.05

  let displayPercentage = basePercentage

  if (isBoosting) {
    const swingCenter = 0.92
    const swingAmplitude = 0.03
    const oscillation = Math.sin(boostTick / 4)
    displayPercentage = Math.min(
      1,
      Math.max(0, swingCenter + swingAmplitude * oscillation),
    )
  }

  const angle = -90 + 180 * displayPercentage

  return (
    <div className="app">
      <h1 className="title">Wealth Meter</h1>
      <div className="number-display">{value.toFixed(1)}</div>

      <div className="speedometer">
        <div className="speedometer-arc">
          <div className="speedometer-fill" />
          <div className="speedometer-cover" />
          <div
            className="needle"
            style={{ transform: `rotate(${angle}deg)` }}
          />
        </div>
        <div className="gauge-labels">
          <span>Low</span>
          <span>Medium</span>
          <span>Max</span>
        </div>
      </div>

      <button
        className="boost-button"
        onClick={handleBoost}
        disabled={isBoosting}
      >
        {isBoosting ? 'Boost in progress…' : 'Boost for 8 seconds'}
      </button>

      <p className="status-text">
        {isBoosting
          ? 'Boost active: faster growth and near-full meter.'
          : 'Normal growth speed.'}
      </p>
    </div>
  )
}

export default App
