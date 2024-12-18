'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCryptoIcon } from '@/utils/getCryptoIcon'
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
  displayFiat: boolean
  convertFiatToCrypto: (amount: number, symbol: string) => string
  convertCryptoToFiat: (amount: number, symbol: string) => string
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
  onAutoSpinToggle,
  displayFiat,
  convertFiatToCrypto,
  convertCryptoToFiat
}: BetInputProps) {
  const [amount, setAmount] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const getMaxBet = () => {
    return displayFiat ? MAX_BET_USD : parseFloat(convertFiatToCrypto(MAX_BET_USD, selectedCrypto.symbol))
  }

  const handleAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^\d.]/g, '')
    const parts = sanitizedValue.split('.')
    let newValue = parts[0]
    if (parts.length > 1) {
      newValue += '.' + parts[1].slice(0, displayFiat ? 2 : 8)
    }

    setAmount(newValue)
    setIsInvalid(false)

    const numericAmount = parseFloat(newValue)
    if (!isNaN(numericAmount)) {
      onBetChange(numericAmount)
    } else {
      onBetChange(0)
    }
  }

  const handleBet = () => {
    const betAmount = parseFloat(amount)
    if (betAmount > 0) {
      const maxBet = getMaxBet()
      if (betAmount > maxBet) {
        setIsInvalid(true)
        onNotification(
          `Maximum bet is ${
            displayFiat
              ? `$${MAX_BET_USD.toFixed(2)}`
              : `${maxBet.toFixed(8)} ${selectedCrypto.symbol}`
          }`,
          'error'
        )
      } else {
        const cryptoAmount = displayFiat ? parseFloat(convertFiatToCrypto(betAmount, selectedCrypto.symbol)) : betAmount
        if (cryptoAmount > parseFloat(selectedCrypto.balance)) {
          setIsInvalid(true)
          onNotification(
            `Insufficient balance. You have ${
              displayFiat
                ? `$${convertCryptoToFiat(parseFloat(selectedCrypto.balance), selectedCrypto.symbol)}`
                : `${selectedCrypto.balance} ${selectedCrypto.symbol}`
            }`,
            'error'
          )
        } else {
          setIsInvalid(false)
          onPlay(displayFiat ? betAmount : cryptoAmount)
        }
      }
    }
  }

  const handleDoubleBet = () => {
    const newAmount = (parseFloat(amount) * 2).toString();
    handleAmountChange(newAmount);
  };

  const handleHalfBet = () => {
    const newAmount = (parseFloat(amount) / 2).toString();
    handleAmountChange(newAmount);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [displayFiat])

  const formatBalance = (balance: string) => {
    const numericBalance = parseFloat(balance);
    return displayFiat
      ? `$${convertCryptoToFiat(numericBalance, selectedCrypto.symbol)}`
      : `${numericBalance.toFixed(8)} ${selectedCrypto.symbol}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 relative z-20">
      <div className="flex items-center justify-between text-sm">
        <div className="text-purple-300">bet amount</div>
        <div className="text-purple-400">
          balance: {formatBalance(selectedCrypto.balance)}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {selectedCrypto.symbol && (
            <Image
  src={`https://cheshirecat.dev/cdn-cgi/image/width=20,height=20,format=webp,quality=85/${getCryptoIcon(selectedCrypto.symbol)}`}
  alt={selectedCrypto.symbol}
  width={20}
  height={20}
  className="z-20"
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
          placeholder={`say bye to ${displayFiat ? 'USD' : selectedCrypto.symbol}`}
          inputMode="decimal"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
            onClick={handleHalfBet}
          >
            1/2
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
            onClick={handleDoubleBet}
          >
            2x
          </Button>
        </div>
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

