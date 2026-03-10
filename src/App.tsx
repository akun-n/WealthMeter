import { useEffect, useState } from 'react'
import './App.css'

const NORMAL_SPEED = 0.5
const BOOST_SPEED = 30
const MAX_VALUE = 9000

function App() {
  const [value, setValue] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isDecaying, setIsDecaying] = useState(false)
  const [isBoosting, setIsBoosting] = useState(false)
  const [boostTick, setBoostTick] = useState(0)
  const [coinBurstId, setCoinBurstId] = useState(0)

  const currentSpeed = isBoosting ? BOOST_SPEED : NORMAL_SPEED

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setValue((prev) => {
        const delta = isDecaying ? -currentSpeed : currentSpeed
        const next = prev + delta
        if (next > MAX_VALUE) return MAX_VALUE
        if (next < 0) return 0
        return next
      })
      setBoostTick((t) => t + 1)
    }, 50)

    return () => clearInterval(intervalId)
  }, [currentSpeed, isRunning, isDecaying])

  useEffect(() => {
    if (!isBoosting) return

    const timeoutId = setTimeout(() => {
      setIsBoosting(false)
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [isBoosting])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' || event.key === 'S') {
        setIsRunning((running) => !running)
      }

      if (event.key === 'd' || event.key === 'D') {
        setIsDecaying((decaying) => !decaying)
      }

      if (event.key === 'r' || event.key === 'R') {
        setValue(0)
        setIsBoosting(false)
        setBoostTick(0)
        setIsRunning(false)
        setIsDecaying(false)
      }

      if (event.key === 'b' || event.key === 'B') {
        setCoinBurstId((id) => id + 1)
        if (!isBoosting) {
          setIsBoosting(true)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isBoosting])

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
      <div className="main-meter">
        <div className="number-display">{`$${value.toFixed(1)}`}</div>
        <div className="speedometer">
          <div className="speedometer-arc">
            <div className="speedometer-fill" />
            <div className="speedometer-mask" />
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
      </div>

      <p className="status-text">
        {isBoosting
          ? 'Boost active: faster growth and near-full meter.'
          : 'Normal growth speed.'}
      </p>

      {coinBurstId > 0 && <CoinBurst key={coinBurstId} />}
    </div>
  )
}

type CoinSide = 'top' | 'right' | 'bottom' | 'left'

function CoinBurst() {
  const coins = Array.from({ length: 40 }, (_, index) => {
    const side: CoinSide = ['top', 'right', 'bottom', 'left'][index % 4] as CoinSide
    const offset = Math.random() * 100
    const delay = Math.random() * 0.8
    const duration = 2 + Math.random() * 1.5
    const size = 14 + Math.random() * 10

    const style: React.CSSProperties = {
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      width: `${size}px`,
      height: `${size}px`,
    }

    if (side === 'top') {
      style.top = '-10%'
      style.left = `${offset}%`
    } else if (side === 'bottom') {
      style.bottom = '-10%'
      style.left = `${offset}%`
    } else if (side === 'left') {
      style.left = '-10%'
      style.top = `${offset}%`
    } else {
      style.right = '-10%'
      style.top = `${offset}%`
    }

    return { side, style, key: `${side}-${index}` }
  })

  return (
    <div className="coin-layer">
      {coins.map((coin) => (
        <div
          key={coin.key}
          className={`coin coin--${coin.side}`}
          style={coin.style}
        />
      ))}
    </div>
  )
}

export default App
