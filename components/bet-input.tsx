'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCryptoIcon } from '@/utils/getCryptoIcon'
import { useWallet } from '@/contexts/WalletContext'
import { exchangeRates } from '@/utils/exchangeRates'
import { Zap, PlayCircle, Pause } from 'lucide-react'

interface BetInputProps {
  selectedCrypto: {
    symbol: string
    name: string
    balance: string
  }
  onBetChange: (amount: number) => void
  onPlay: (betAmount: number) => void
  isSpinning: boolean
  turboMode: boolean
  onTurboToggle: () => void
  onNotification: (message: string, type: 'success' | 'error') => void
  autoSpin: boolean
  onAutoSpinToggle: () => void
}

const MAX_BET_USD = 10;

export function BetInput({
  selectedCrypto,
  onBetChange,
  onPlay,
  isSpinning,
  turboMode,
  onTurboToggle,
  onNotification,
  autoSpin,
  onAutoSpinToggle
}: BetInputProps) {
  const [amount, setAmount] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { displayFiat } = useWallet()

  const getMaxBet = () => {
    const rate = exchangeRates[selectedCrypto.symbol] || 1
    return displayFiat ? MAX_BET_USD : MAX_BET_USD / rate
  }

  const handleAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^\d.]/g, '')
    const parts = sanitizedValue.split('.')
    let newValue = parts[0]
    if (parts.length > 1) {
      newValue += '.' + parts[1].slice(0, 8) // 8 decimal places
    }

    setAmount(newValue)
    setIsInvalid(false)

    const numericAmount = parseFloat(newValue)
    if (!isNaN(numericAmount)) {
      const rate = exchangeRates[selectedCrypto.symbol] || 1
      const cryptoAmount = displayFiat ? numericAmount / rate : numericAmount
      onBetChange(cryptoAmount)
    } else {
      onBetChange(0)
    }
  }

  const handleBet = () => {
    const betAmount = parseFloat(amount)
    if (betAmount > 0) {
      const rate = exchangeRates[selectedCrypto.symbol] || 1
      const cryptoAmount = displayFiat ? betAmount / rate : betAmount
      if (cryptoAmount > getMaxBet()) {
        setIsInvalid(true)
        onNotification(
          `maximum bet is ${
            displayFiat
              ? `$${MAX_BET_USD.toFixed(2)}`
              : `${getMaxBet().toFixed(8)} ${selectedCrypto.symbol}`
          }`,
          'error'
        )
      } else {
        setIsInvalid(false)
        onPlay(cryptoAmount)
      }
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [displayFiat])

  return (
    <div className="w-full max-w-md mx-auto space-y-4 relative z-20">
      <div className="flex items-center justify-between text-sm">
        <div className="text-purple-300">bet amount</div>
        <div className="text-purple-400">
          balance:{' '}
          {displayFiat
            ? `$${(parseFloat(selectedCrypto.balance) * (exchangeRates[selectedCrypto.symbol] || 1)).toFixed(2)}`
            : `${parseFloat(selectedCrypto.balance).toFixed(8)} ${selectedCrypto.symbol}`}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {selectedCrypto.symbol && (
            <Image
              src={getCryptoIcon(selectedCrypto.symbol)} 
              alt={selectedCrypto.symbol}
              width={20}
              height={20}
              unoptimized
              className="z-20"
              onError={() =>
                console.error(
                  `Failed to load icon for ${selectedCrypto.symbol}: ${getCryptoIcon(selectedCrypto.symbol)}`
                )
              }
            />
          )}
          {displayFiat && <span className="text-white text-base sm:text-lg">$</span>}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className={`w-full pl-14 pr-24 py-4 sm:py-6 bg-purple-900/30 text-white text-base sm:text-lg ${
            isInvalid ? 'border-red-500' : 'border-purple-700/50'
          }`}
          placeholder="say bye to $"
          inputMode="decimal"
        />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          size="lg"
          className="flex-grow h-16 bg-purple-600/80 hover:bg-purple-500/90 text-white rounded-xl disabled:bg-purple-500/90 disabled:opacity-50"
          onClick={handleBet}
          disabled={isSpinning || autoSpin}
        >
          {isSpinning ? 'spinning...' : autoSpin ? 'autospin on' : 'bet'}
        </Button>

        <Button
          size="lg"
          className={`w-16 h-16 flex items-center justify-center rounded-xl p-4 transition-all duration-300
            ${autoSpin
              ? 'bg-purple-600/80 text-white opacity-60 cursor-not-allowed'
              : 'bg-purple-600/80 hover:bg-purple-500/90 text-white'
            }`}
          onClick={onAutoSpinToggle}
        >
          {autoSpin ? <Pause className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
        </Button>

        <Button
          size="lg"
          className={`w-16 h-16 flex items-center justify-center rounded-xl p-4 transition-all duration-300
            ${turboMode
              ? 'bg-purple-600/80 text-white opacity-60 cursor-not-allowed'
              : 'bg-purple-600/80 hover:bg-purple-500/90 text-white'
            }`}
          onClick={onTurboToggle}
        >
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
