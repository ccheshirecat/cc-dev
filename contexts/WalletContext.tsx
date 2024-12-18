'use client';

import React, { createContext, useContext, useCallback, ReactNode, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { selectedCryptoState, balancesState, displayFiatState, hasAddedInitialTipState } from '@/atoms/WalletAtoms';
import { exchangeRates } from '@/utils/exchangeRates';

export interface CryptoBalance {
  symbol: string;
  name: string;
  balance: string;
}

interface WalletContextType {
  selectedCrypto: CryptoBalance;
  balances: CryptoBalance[];
  displayFiat: boolean;
  hasAddedInitialTip: boolean;
  setSelectedCrypto: (crypto: CryptoBalance) => void;
  updateBalance: (symbol: string, newBalance: string) => void;
  setDisplayFiat: (display: boolean) => void;
  addRandomTip: () => Promise<{ fiatAmount: string; cryptoAmount: string; symbol: string } | null>;
  convertFiatToCrypto: (fiatAmount: number, cryptoSymbol: string) => string;
  convertCryptoToFiat: (cryptoAmount: number, cryptoSymbol: string) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCrypto, setSelectedCrypto] = useRecoilState(selectedCryptoState);
  const [balances, setBalances] = useRecoilState(balancesState);
  const [displayFiat, setDisplayFiat] = useRecoilState(displayFiatState);
  const [hasAddedInitialTip, setHasAddedInitialTip] = useRecoilState(hasAddedInitialTipState);

  const updateBalance = useCallback((symbol: string, newBalance: string) => {
    setBalances((prevBalances) => 
      prevBalances.map((crypto) => 
        crypto.symbol === symbol ? { ...crypto, balance: newBalance } : crypto
      )
    );
    if (selectedCrypto.symbol === symbol) {
      setSelectedCrypto((prevSelected) => ({ ...prevSelected, balance: newBalance }));
    }
  }, [setBalances, selectedCrypto.symbol, setSelectedCrypto]);

  const addRandomTip = useCallback(async () => {
    if (hasAddedInitialTip) {
      console.log('Initial tip already added');
      return null;
    }

    // Add a 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomAmountUSD = Math.floor(Math.random() * (100 - 20) + 20).toFixed(2);
    
    // Select a random crypto (excluding BTC and ETH for larger amounts)
    const eligibleCryptos = ['TRX', 'XRP', 'LTC'];
    const randomCrypto = eligibleCryptos[Math.floor(Math.random() * eligibleCryptos.length)];
    
    // Convert USD amount to crypto
    const cryptoAmount = (parseFloat(randomAmountUSD) / exchangeRates[randomCrypto]).toFixed(8);

    // Update only the balance of the tipped cryptocurrency
    setBalances((prevBalances) => 
      prevBalances.map((crypto) => 
        crypto.symbol === randomCrypto
          ? { ...crypto, balance: (parseFloat(crypto.balance) + parseFloat(cryptoAmount)).toFixed(8) }
          : crypto
      )
    );

    setHasAddedInitialTip(true);

    console.log(`Added initial tip: ${cryptoAmount} ${randomCrypto}`);

    return {
      fiatAmount: randomAmountUSD,
      cryptoAmount,
      symbol: randomCrypto
    };
  }, [hasAddedInitialTip, setBalances, setHasAddedInitialTip]);

  const convertFiatToCrypto = useCallback((fiatAmount: number, cryptoSymbol: string): string => {
    return (fiatAmount / exchangeRates[cryptoSymbol]).toFixed(8);
  }, []);

  const convertCryptoToFiat = useCallback((cryptoAmount: number, cryptoSymbol: string): string => {
    return (cryptoAmount * exchangeRates[cryptoSymbol]).toFixed(2);
  }, []);


  return (
    <WalletContext.Provider value={{
      selectedCrypto,
      balances,
      displayFiat,
      hasAddedInitialTip,
      setSelectedCrypto,
      updateBalance,
      setDisplayFiat,
      addRandomTip,
      convertFiatToCrypto,
      convertCryptoToFiat,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

