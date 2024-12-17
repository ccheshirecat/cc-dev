'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const symbols = [
  '/cat.svg',
  '/dog.svg',
  '/fox.svg'
]

interface SlotMachineProps {
  onWin: (multiplier: number) => void
  isSpinning: boolean
  spinSoundPath: string
  winSoundPath: string
  loseSoundPath: string
}

export function SlotMachine({ onWin, isSpinning, spinSoundPath, winSoundPath, loseSoundPath }: SlotMachineProps) {
  const [reels, setReels] = useState([0, 0, 0]) // Start with cats
  const spinSound = useRef<HTMLAudioElement | null>(null)
  const winSound = useRef<HTMLAudioElement | null>(null)
  const loseSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    spinSound.current = new Audio(spinSoundPath)
    winSound.current = new Audio(winSoundPath)
    loseSound.current = new Audio(loseSoundPath)

    // Preload the audio files
    spinSound.current.load()
    winSound.current.load()
    loseSound.current.load()

    return () => {
      if (spinSound.current) spinSound.current.pause()
      if (winSound.current) winSound.current.pause()
      if (loseSound.current) loseSound.current.pause()
    }
  }, [spinSoundPath, winSoundPath, loseSoundPath])

  useEffect(() => {
    if (isSpinning) {
      spin()
    }
  }, [isSpinning])

  const spin = () => {
    if (spinSound.current) {
      spinSound.current.currentTime = 0
      spinSound.current.play().catch(error => console.error("Error playing spin sound:", error))
    }

    const newReels = reels.map(() => Math.floor(Math.random() * symbols.length))
    
    setTimeout(() => {
      setReels(newReels)

      // Check for win
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        const multiplier = (newReels[0] === 0 ? 10 : newReels[0] === 1 ? 5 : 3) // 10x for three Cats, 5x for three Dogs, 3x for three Foxes
        onWin(multiplier)
        if (winSound.current) {
          winSound.current.currentTime = 0
          winSound.current.play().catch(error => console.error("Error playing win sound:", error))
        }
      } else {
        // Play lose sound if no win
        if (loseSound.current) {
          loseSound.current.currentTime = 0
          loseSound.current.play().catch(error => console.error("Error playing lose sound:", error))
        }
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center items-center space-x-4 sm:space-x-6">
        {reels.map((reel, index) => (
          <motion.div
            key={index}
            className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center"
            animate={isSpinning ? { y: [0, -20, 0], transition: { repeat: Infinity, duration: 0.2 } } : {}}
          >
            <Image
              src={symbols[reel]}
              alt={`Slot symbol ${reel}`}
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

