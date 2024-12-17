'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, WalletIcon } from 'lucide-react'
import Image from 'next/image'
import { getCryptoIcon } from '@/utils/getCryptoIcon'
import { CryptoBalance } from '@/contexts/WalletContext';

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useWallet } from '@/contexts/WalletContext'
import { exchangeRates } from '@/utils/exchangeRates'

interface WalletDropdownProps {
  onNotification: (message: string, type: 'success' | 'error') => void
  isMobile: boolean;
}

export function WalletDropdown({ onNotification, isMobile }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showZeroBalances, setShowZeroBalances] = useState(true)
  const { selectedCrypto, setSelectedCrypto, balances, displayFiat, setDisplayFiat } = useWallet()
  const [filteredBalances, setFilteredBalances] = useState(balances)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const updateFilteredBalances = useCallback(() => {
    let filtered = balances
    if (!showZeroBalances) {
      filtered = filtered.filter(crypto => 
        parseFloat(crypto.balance) > 0 || crypto.symbol === selectedCrypto.symbol
      )
    }
    if (searchTerm) {
      filtered = filtered.filter(crypto => 
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredBalances(filtered)
  }, [balances, showZeroBalances, searchTerm, selectedCrypto]);

  useEffect(() => {
    updateFilteredBalances();
  }, [updateFilteredBalances]);

  useEffect(() => {
    if (isOpen) {
      updateFilteredBalances();
    }
  }, [isOpen, updateFilteredBalances]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCryptoSelect = (crypto: CryptoBalance) => {
    const updatedCrypto = balances.find(b => b.symbol === crypto.symbol) || crypto;
    setSelectedCrypto(updatedCrypto);
    setIsOpen(false);
  };

  const formatBalance = (balance: string, symbol: string, forceDisplayFiat: boolean = false) => {
    const numericBalance = parseFloat(balance);
    if (displayFiat || forceDisplayFiat) {
      const rate = exchangeRates[symbol] || 0;
      const fiatValue = numericBalance * rate;
      return `$${fiatValue.toFixed(2)}`;
    }
    return `${numericBalance.toFixed(2)} ${symbol}`;
  };

  return (
    <div className={`relative ${isMobile ? 'flex justify-end' : 'w-full'}`} ref={dropdownRef}>
      <div className="flex items-center justify-center gap-2 w-full">
        <Button
          variant="outline"
          className="bg-purple-900/80 border-purple-700/50 text-purple-100 hover:bg-purple-800/90 hover:text-purple-200 text-sm py-1 px-3 w-auto justify-between backdrop-blur-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Image
              src={getCryptoIcon(selectedCrypto.symbol)}
              alt={selectedCrypto.symbol}
              width={16}
              height={16}
              className="mr-2"
            />
            <span className="font-mono">
              {formatBalance(selectedCrypto.balance, selectedCrypto.symbol)}
            </span>
          </div>
          <span className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </Button>
        {!isMobile && (
          <Button className="bg-purple-900/80 hover:bg-purple-800/90 text-purple-100 backdrop-blur-sm">
            <WalletIcon className="w-5 h-5 mr-2" />
            Wallet
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute mt-2 z-50 ${
              isMobile 
                ? 'right-0 w-[280px]' 
                : 'left-1/2 -translate-x-1/2 w-64'
            }`}
            style={{
              top: isMobile ? 'auto' : '100%',
              transform: isMobile ? 'none' : 'translateX(-50%)',
              left: isMobile ? 'auto' : '50%'
            }}
          >
            <Card className="bg-purple-900/80 border-purple-700/50 p-2 shadow-xl backdrop-blur-sm">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-purple-300" />
                <Input
                  placeholder="Search"
                  className="pl-8 py-1 text-xs bg-purple-800/50 border-purple-600/50 text-purple-100 placeholder-purple-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateFilteredBalances();
                  }}
                />
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredBalances.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-1.5 hover:bg-purple-800/50 rounded-lg transition-colors cursor-pointer"
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
                      <span className="text-purple-200 text-xs">{crypto.symbol}</span>
                    </div>
                    <span className="text-purple-300 text-xs font-mono">
                      {formatBalance(crypto.balance, crypto.symbol, displayFiat)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-2 border-t border-purple-700/50 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-xs">Display in Fiat</span>
                  <Switch
                    checked={displayFiat}
                    onCheckedChange={setDisplayFiat}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-xs">Hide zero balances</span>
                  <Switch
                    checked={!showZeroBalances}
                    onCheckedChange={(checked) => {
                      setShowZeroBalances(!checked);
                      updateFilteredBalances();
                    }}
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

