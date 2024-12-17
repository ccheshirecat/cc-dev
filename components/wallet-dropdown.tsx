'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, WalletIcon } from 'lucide-react'
import Image from 'next/image'
import { getCryptoIcon } from '@/utils/getCryptoIcon'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface CryptoBalance {
  symbol: string
  name: string
  balance: string
}

interface WalletDropdownProps {
  selectedCrypto: CryptoBalance
  onSelectCrypto: (crypto: CryptoBalance) => void
  onNotification: (message: string, type: 'success' | 'error') => void
}

export function WalletDropdown({ selectedCrypto, onSelectCrypto, onNotification }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showZeroBalances, setShowZeroBalances] = useState(true)
  const [displayFiat, setDisplayFiat] = useState(false)
  const [balances, setBalances] = useState<CryptoBalance[]>([
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.00' },
    { symbol: 'ETH', name: 'Ethereum', balance: '0.00' },
    { symbol: 'LTC', name: 'Litecoin', balance: '0.00' },
    { symbol: 'TRX', name: 'TRON', balance: '0.00' },
    { symbol: 'XRP', name: 'Ripple', balance: '0.01' },
    { symbol: 'USDT', name: 'Tether', balance: '0.00' },
    { symbol: 'USDC', name: 'USD Coin', balance: '0.00' },
  ])

  useEffect(() => {
    const timer = setTimeout(() => {
      const randomAmount = (Math.random() * (500 - 50) + 50).toFixed(2)
      const randomCrypto = balances[Math.floor(Math.random() * balances.length)]
      
      onNotification(`@cheshirecat tipped you $${randomAmount} in ${randomCrypto.symbol}`, 'success')

      setBalances(prevBalances => 
        prevBalances.map(crypto => 
          crypto.symbol === randomCrypto.symbol
            ? { ...crypto, balance: (parseFloat(crypto.balance) + parseFloat(randomAmount)).toFixed(2) }
            : crypto
        )
      )

      if (selectedCrypto.symbol === randomCrypto.symbol) {
        onSelectCrypto({
          ...selectedCrypto,
          balance: (parseFloat(selectedCrypto.balance) + parseFloat(randomAmount)).toFixed(2)
        })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleCryptoSelect = (crypto: CryptoBalance) => {
    onSelectCrypto(crypto)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-gray-200 text-sm py-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={getCryptoIcon(selectedCrypto.symbol)}
            alt={selectedCrypto.symbol}
            width={16}
            height={16}
            className="mr-2"
          />
          ${selectedCrypto.balance}
          <span className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </Button>
        <Button className="bg-purple-900 hover:bg-purple-800 text-purple-100">
          <WalletIcon className="w-5 h-5 mr-2" />
          Wallet
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 z-50"
          >
            <Card className="bg-gray-900 border-gray-800 p-2 shadow-xl">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search"
                  className="pl-8 py-1 text-xs bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
                />
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {balances.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-1.5 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleCryptoSelect(crypto)}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={getCryptoIcon(crypto.symbol)}
                        alt={crypto.name}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      <span className="text-gray-300 text-xs">{crypto.symbol}</span>
                    </div>
                    <span className="text-gray-400 text-xs">${crypto.balance}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-2 border-t border-gray-800 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Display in Fiat</span>
                  <Switch
                    checked={displayFiat}
                    onCheckedChange={setDisplayFiat}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Hide zero balances</span>
                  <Switch
                    checked={showZeroBalances}
                    onCheckedChange={setShowZeroBalances}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

