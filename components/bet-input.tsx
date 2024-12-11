'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCryptoIcon } from '@/utils/getCryptoIcon'
import Plinko from './plinko'

interface BetInputProps {
  selectedCrypto: {
    symbol: string
    name: string
    balance: string
  }
  onBetChange: (amount: number) => void
  onPlay: () => void
}

export function BetInput({ selectedCrypto, onBetChange, onPlay }: BetInputProps) {
  const [amount, setAmount] = useState('0.00')
  const [isPlaying, setIsPlaying] = useState(false)

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    const filtered = value.replace(/[^0-9.]/g, '')
    // Ensure only one decimal point
    const parts = filtered.split('.')
    if (parts.length > 2) return
    if (parts[1]?.length > 2) return
    setAmount(filtered)
    onBetChange(parseFloat(filtered))
  }

  const handleHalf = () => {
    const current = parseFloat(amount)
    setAmount((current / 2).toFixed(2))
    onBetChange(current / 2)
  }

  const handleDouble = () => {
    const current = parseFloat(amount)
    setAmount((current * 2).toFixed(2))
    onBetChange(current * 2)
  }

  const handleBet = () => {
    setIsPlaying(true) // Start the game when the bet is made
    onPlay() // Trigger any additional logic needed onPlay
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto space-y-4 relative z-20">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-300">
            Bet Amount
          </div>
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                  src={getCryptoIcon(selectedCrypto.symbol)}
                  alt={selectedCrypto.symbol}
                  width={20}
                  height={20}
                />
              </div>
              <Input
                type="text"
                value={`$${amount}`}
                onChange={(e) => handleAmountChange(e.target.value.replace('$', ''))}
                className="w-full pl-10 pr-24 py-6 bg-gray-900 border-gray-800 text-white text-lg"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleHalf}
                  className="h-8 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  ½
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDouble}
                  className="h-8 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  2x
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button 
          size="lg"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium rounded-xl"
          onClick={handleBet}
        >
          Bet
        </Button>
      </div>
      {isPlaying && <Plinko betAmount={parseFloat(amount)} onPlay={handleBet} />}
    </>
  )
}