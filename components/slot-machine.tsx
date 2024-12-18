'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const symbols = [
  '/cat.png',
  '/dog.png',
  '/fox.png',
  '/rabbit.png',
  '/tiger.png',
  '/bonus.png'
]

interface SlotMachineProps {
  onWin: (multiplier: number) => void
  isSpinning: boolean
  spinSoundPath: string
  winSoundPath: string
  loseSoundPath: string
  updateBalance: (symbol: string, newBalance: string) => void
  selectedCrypto: {
    symbol: string
    balance: string
  }
  turboMode: boolean
  setAutoSpin: (value: boolean) => void;
  convertFiatToCrypto: (amount: number, symbol: string) => string; // Changed from number to string
  displayFiat: boolean; // Added prop
}

export function SlotMachine({ onWin, isSpinning, spinSoundPath, winSoundPath, loseSoundPath, updateBalance, selectedCrypto, turboMode, setAutoSpin, convertFiatToCrypto, displayFiat }: SlotMachineProps) {
  const [reels, setReels] = useState([0, 0, 0])
  const [spinning, setSpinning] = useState([false, false, false])
  const [spinningSymbols, setSpinningSymbols] = useState([0, 0, 0])
  const [result, setResult] = useState<'win' | 'lose' | null>(null)
  const [winningCombination, setWinningCombination] = useState<number[]>([])
  const [multiplier, setMultiplier] = useState(0)
  const [bonusMode, setBonusMode] = useState(false)
  const [bonusSpinsLeft, setBonusSpinsLeft] = useState(0)
  const [bonusWinTotal, setBonusWinTotal] = useState(0)
  const [retrigger, setRetrigger] = useState(false)
  const spinSound = useRef<HTMLAudioElement | null>(null)
  const winSound = useRef<HTMLAudioElement | null>(null)
  const loseSound = useRef<HTMLAudioElement | null>(null)
  const bonusSound = useRef<HTMLAudioElement | null>(null)
  const [particles, setParticles] = useState<{ x: number; y: number; color: string }[]>([])

  useEffect(() => {
    spinSound.current = new Audio(spinSoundPath)
    winSound.current = new Audio(winSoundPath)
    loseSound.current = new Audio(loseSoundPath)
    bonusSound.current = new Audio('/sounds/bonus.mp3')

    spinSound.current.load()
    winSound.current.load()
    loseSound.current.load()
    bonusSound.current.load()

    return () => {
      if (spinSound.current) spinSound.current.pause()
      if (winSound.current) winSound.current.pause()
      if (loseSound.current) loseSound.current.pause()
      if (bonusSound.current) bonusSound.current.pause()
    }
  }, [spinSoundPath, winSoundPath, loseSoundPath])

  useEffect(() => {
    if (isSpinning) {
      spin()
    }
  }, [isSpinning])

  useEffect(() => {
    if (bonusMode && bonusSpinsLeft > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        spin(true);
      }, turboMode ? 500 : 1000);
      return () => clearTimeout(timer);
    }
  }, [bonusMode, bonusSpinsLeft, turboMode, isSpinning]);

  const spin = (isBonus = false) => {
    if (spinSound.current) {
      spinSound.current.currentTime = 0
      spinSound.current.playbackRate = turboMode ? 1.5 : 1
      spinSound.current.play().catch(error => console.error("Error playing spin sound:", error))
    }

    setSpinning([true, true, true])
    setResult(null)
    setParticles([])
    setWinningCombination([])
    setMultiplier(0)
    setRetrigger(false)

    const spinInterval = setInterval(() => {
      setSpinningSymbols(prev => prev.map(() => Math.floor(Math.random() * symbols.length)))
    }, turboMode ? 50 : 100)

    const newReels = generateReels()

    setTimeout(() => {
      clearInterval(spinInterval)
      setSpinning([false, false, false])
      setReels(newReels)

      const winResult = checkWin(newReels)
      if (winResult.isWin) {
        const multiplier = getMultiplier(newReels, winResult.combination)
        setMultiplier(multiplier)
        if (isBonus) {
          setBonusWinTotal(prev => prev + multiplier)
        } else {
          onWin(multiplier)
        }
        setResult('win')
        setWinningCombination(winResult.combination)
        if (winSound.current) {
          winSound.current.currentTime = 0
          winSound.current.playbackRate = turboMode ? 1.5 : 1
          winSound.current.play().catch(error => console.error("Error playing win sound:", error))
        }
        createParticles()
      } else {
        setResult('lose')
        if (loseSound.current) {
          loseSound.current.currentTime = 0
          loseSound.current.playbackRate = turboMode ? 1.5 : 1
          loseSound.current.play().catch(error => console.error("Error playing lose sound:", error))
        }
      }

      if (newReels[0] === 5 && newReels[1] === 5 && newReels[2] === 5) {
        if (bonusMode) {
          setRetrigger(true)
          setBonusSpinsLeft(prev => prev + 10)
        } else {
          setBonusMode(true)
          setBonusSpinsLeft(10)
          setBonusWinTotal(0)
          setAutoSpin(false);
        }
        if (bonusSound.current) {
          bonusSound.current.currentTime = 0
          bonusSound.current.playbackRate = turboMode ? 1.5 : 1
          bonusSound.current.play().catch(error => console.error("Error playing bonus sound:", error))
        }
      }

      if (isBonus) {
        setBonusSpinsLeft(prev => prev - 1)
        if (winResult.isWin) {
          setBonusWinTotal(prev => prev + multiplier)
        }
        if (bonusSpinsLeft === 1 && !retrigger) {
          setBonusMode(false)
          // Update the balance with the total bonus win at the end of free spins
          const currentBalance = parseFloat(selectedCrypto.balance);
          const bonusWinAmount = displayFiat
            ? parseFloat(convertFiatToCrypto(bonusWinTotal, selectedCrypto.symbol))
            : bonusWinTotal;
          const newBalance = (currentBalance + bonusWinAmount).toFixed(8);
          updateBalance(selectedCrypto.symbol, newBalance);
          onWin(bonusWinTotal)
          setBonusWinTotal(0)
        }
      }
    }, turboMode ? 1000 : 2000)
  }

  const generateReels = (): number[] => {
    const random = Math.random()
    if (random < 0.01) {
      // 1% chance for jackpot (all cats)
      return [0, 0, 0]
    } else if (random < 0.03) {
      // 2% chance for all symbols to match (except cats)
      const symbol = Math.floor(Math.random() * 4) + 1
      return [symbol, symbol, symbol]
    } else if (random < 0.15) {
      // 12% chance for two adjacent symbols to match
      const symbol = Math.floor(Math.random() * 5)
      const differentSymbol = (symbol + 1 + Math.floor(Math.random() * 4)) % 5
      if (Math.random() < 0.5) {
        return [symbol, symbol, differentSymbol]
      } else {
        return [differentSymbol, symbol, symbol]
      }
    } else if (random < 0.25) {
      // 10% chance for a special combination
      return [0, 1, 2]
    } else if (random < 0.30) {
      // 5% chance for bonus symbols
      return [5, 5, 5]
    } else if (random < 0.5) {
      // 20% chance for other winning combinations
      let reels
      do {
        reels = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
      } while (!checkWin(reels).isWin)
      return reels
    } else {
      // 50% chance for a losing combination
      let reels
      do {
        reels = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
      } while (checkWin(reels).isWin)
      return reels
    }
  }

  const checkWin = (reels: number[]): { isWin: boolean; combination: number[] } => {
    // All symbols match
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      return { isWin: true, combination: [0, 1, 2] }
    }
    // Two adjacent symbols match
    if (reels[0] === reels[1]) {
      return { isWin: true, combination: [0, 1] }
    }
    if (reels[1] === reels[2]) {
      return { isWin: true, combination: [1, 2] }
    }
    // Special combination: [0, 1, 2] in any order
    const sortedReels = [...reels].sort()
    if (JSON.stringify(sortedReels) === JSON.stringify([0, 1, 2])) {
      return { isWin: true, combination: [0, 1, 2] }
    }
    // Any cat symbol
    if (reels.includes(0)) {
      return { isWin: true, combination: [reels.indexOf(0)] }
    }
    return { isWin: false, combination: [] }
  }

  const getMultiplier = (reels: number[], combination: number[]): number => {
    if (reels[0] === 0 && reels[1] === 0 && reels[2] === 0) {
      return 100 // Jackpot for all cats
    }
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      return reels[0] === 5 ? 50 : 20 // 50x for bonus, 20x for others
    }
    if (combination.length === 2) {
      return reels[combination[0]] === 0 ? 5 : 3 // Two adjacent symbols match
    }
    if (JSON.stringify([...reels].sort()) === JSON.stringify([0, 1, 2])) {
      return 10 // Special combination
    }
    if (combination.length === 1 && reels[combination[0]] === 0) {
      return 2 // Single cat symbol
    }
    return 1 // Should never reach here, but just in case
  }

  const createParticles = () => {
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        color: ['#FFD700', '#FFA500', '#FF4500', '#8A2BE2', '#4B0082'][Math.floor(Math.random() * 5)]
      })
    }
    setParticles(newParticles)
  }

  const getBackgroundColor = () => {
    if (bonusMode) return 'rgba(255, 215, 0, 0.2)'
    if (result === 'win') return 'rgba(0, 255, 0, 0.15)'
    if (result === 'lose') return 'rgba(255, 0, 0, 0.15)'
    return 'rgba(128, 0, 128, 0.1)'
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-between p-4 pt-6 pb-8 rounded-xl relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        minHeight: bonusMode ? '320px' : '280px', 
        height: bonusMode ? '320px' : '280px',
        backgroundColor: getBackgroundColor(),
        boxShadow: bonusMode
          ? '0 0 30px rgba(255, 215, 0, 0.5)'
          : result === 'win'
          ? '0 0 30px rgba(0, 255, 0, 0.3)'
          : result === 'lose'
          ? '0 0 30px rgba(255, 0, 0, 0.3)'
          : '0 0 20px rgba(128, 0, 128, 0.3)'
      }}
      animate={{
        backgroundColor: getBackgroundColor(),
      }}
      transition={{ duration: 0.5 }}
    >
      {bonusMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 right-0 bg-yellow-500 text-black py-2 text-center font-bold z-20"
        >
          {retrigger ? 'retrigger! ' : ''}bonus mode: {bonusSpinsLeft} free spins left!
        </motion.div>
      )}
      <div className={`flex flex-col items-center justify-between space-y-4 ${bonusMode ? 'pt-10' : ''}`}>
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 relative z-10">
          {reels.map((reel, index) => (
            <motion.div
              key={index}
              className={`w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-purple-900/50 rounded-lg overflow-hidden ${
                winningCombination.includes(index) ? 'relative' : ''
              }`}
              animate={spinning[index] ? { y: [0, -10, 0] } : {}}
              transition={spinning[index] ? { repeat: Infinity, duration: turboMode ? 0.1 : 0.2 } : {}}
            >
              <AnimatePresence mode="wait">
              <motion.div
  key={spinning[index] ? spinningSymbols[index] : reel}
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -50, opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className={spinning[index] ? "blur-sm" : ""}
>
  <Image
    src={`https://cheshirecat.dev/cdn-cgi/image/width=150,height=150,format=webp,quality=85/${symbols[spinning[index] ? spinningSymbols[index] : reel]}`}
    alt={`Slot symbol ${spinning[index] ? spinningSymbols[index] : reel}`}
    className="w-36 h-36 object-contain"
    />
</motion.div>

              </AnimatePresence>
              {winningCombination.includes(index) && (
                <motion.div
                  className="absolute inset-0 bg-yellow-400 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: turboMode ? 0.5 : 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {(result || bonusMode) ? (
            <motion.div
              key={result || 'bonus'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-2 absolute bottom-4 left-0 right-0"
            >
              {result && (
                <motion.div
                  className={`
                    text-4xl font-bold flex justify-center items-center
                    ${result === 'win'
                      ? 'text-green-400'
                      : 'text-red-400'}
                  `}
                  animate={{ 
                    filter: [
                      'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))',
                      'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))',
                      'drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))',
                    ]
                  }}
                  transition={{ duration: turboMode ? 0.75 : 1.5, repeat: Infinity }}
                >
                  {result === 'win' ? (
                    <span className="text-5xl">🎉</span>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 15s1.5 -2 4 -2 4 2 4 2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  )}
                </motion.div>
              )}
              {result === 'win' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-bold text-purple-300 tracking-wide"
                >
                  {multiplier}x multi!
                </motion.div>
              )}
              {result === 'lose' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-bold text-red-400 tracking-wide"
                >
                  you suck
                </motion.div>
              )}
              {bonusMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-lg font-bold text-yellow-300 tracking-wide"
                >
                  total bonus win: {bonusWinTotal}x
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-2 absolute bottom-4 left-0 right-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <div className="text-lg font-bold text-purple-300 tracking-wide">
                u know u want to
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {result === 'win' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {particles.map((particle, index) => (
                <motion.div
                  key={index}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: particle.color }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    opacity: 0,
                  }}
                  transition={{ duration: turboMode ? 0.75 : 1.5, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

