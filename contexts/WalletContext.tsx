import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { exchangeRates } from '@/utils/exchangeRates';

export interface CryptoBalance {
  symbol: string;
  name: string;
  balance: string;
}

interface WalletState {
  selectedCrypto: CryptoBalance;
  balances: CryptoBalance[];
  displayFiat: boolean;
  hasAddedInitialTip: boolean;
}

type WalletAction =
  | { type: 'SET_SELECTED_CRYPTO'; payload: CryptoBalance }
  | { type: 'UPDATE_BALANCE'; payload: { symbol: string; newBalance: string } }
  | { type: 'SET_DISPLAY_FIAT'; payload: boolean }
  | { type: 'ADD_TIP'; payload: { symbol: string; amount: string } }
  | { type: 'SET_HAS_ADDED_INITIAL_TIP'; payload: boolean }
  | { type: 'SET_BALANCES'; payload: CryptoBalance[] };

const initialBalances: CryptoBalance[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: '0' },
  { symbol: 'ETH', name: 'Ethereum', balance: '0' },
  { symbol: 'LTC', name: 'Litecoin', balance: '0' },
  { symbol: 'TRX', name: 'TRON', balance: '0' },
  { symbol: 'XRP', name: 'Ripple', balance: '0' },
  { symbol: 'USDT', name: 'Tether', balance: '0' },
  { symbol: 'USDC', name: 'USD Coin', balance: '0' },
];

const initialState: WalletState = {
  selectedCrypto: initialBalances[1],
  balances: initialBalances,
  displayFiat: false,
  hasAddedInitialTip: false,
};

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_SELECTED_CRYPTO':
      return { ...state, selectedCrypto: action.payload };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        balances: state.balances.map(crypto =>
          crypto.symbol === action.payload.symbol
            ? { ...crypto, balance: action.payload.newBalance }
            : crypto
        ),
        selectedCrypto:
          state.selectedCrypto.symbol === action.payload.symbol
            ? { ...state.selectedCrypto, balance: action.payload.newBalance }
            : state.selectedCrypto,
      };
    case 'SET_DISPLAY_FIAT':
      return { ...state, displayFiat: action.payload };
    case 'SET_BALANCES':
      return {
        ...state,
        balances: action.payload,
        selectedCrypto: state.selectedCrypto.symbol === action.payload.find(c => c.symbol === state.selectedCrypto.symbol)?.symbol
          ? action.payload.find(c => c.symbol === state.selectedCrypto.symbol) || state.selectedCrypto
          : state.selectedCrypto
      };
    case 'SET_HAS_ADDED_INITIAL_TIP':
      return { ...state, hasAddedInitialTip: action.payload };
    default:
      return state;
  }
}

interface WalletContextType extends WalletState {
  setSelectedCrypto: (crypto: CryptoBalance) => void;
  updateBalance: (symbol: string, newBalance: string) => void;
  setDisplayFiat: (display: boolean) => void;
  addRandomTip: () => Promise<{ fiatAmount: string; cryptoAmount: string; symbol: string } | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const setSelectedCrypto = (crypto: CryptoBalance) => {
    dispatch({ type: 'SET_SELECTED_CRYPTO', payload: crypto });
  };

  const updateBalance = (symbol: string, newBalance: string) => {
    dispatch({ type: 'UPDATE_BALANCE', payload: { symbol, newBalance } });
  };

  const setDisplayFiat = (display: boolean) => {
    dispatch({ type: 'SET_DISPLAY_FIAT', payload: display });
  };

  const addRandomTip = useCallback(async () => {
    if (state.hasAddedInitialTip) {
      return null;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const randomAmountUSD = (Math.random() * (100 - 20) + 20).toFixed(2);

    // 🔥 Filter out BTC and ETH from eligible cryptos
    const eligibleCryptos = state.balances.filter(crypto => crypto.symbol !== 'BTC' && crypto.symbol !== 'ETH');
    
    // 🚨 Fail-safe check
    if (eligibleCryptos.length === 0) {
      console.warn('No eligible cryptos found for the random tip.');
      return null;
    }

    // 🎲 Randomly select a crypto from the filtered list
    const randomIndex = Math.floor(Math.random() * eligibleCryptos.length);
    const randomCrypto = eligibleCryptos[randomIndex];

    // 💸 Calculate crypto amount
    const cryptoAmount = (parseFloat(randomAmountUSD) / exchangeRates[randomCrypto.symbol]).toFixed(8);

    // 🦾 Update balances for the selected crypto
    const updatedBalances = state.balances.map(crypto => 
      crypto.symbol === randomCrypto.symbol
        ? { ...crypto, balance: (parseFloat(crypto.balance) + parseFloat(cryptoAmount)).toFixed(8) }
        : crypto
    );

    // 🗂️ Update state
    dispatch({ type: 'SET_BALANCES', payload: updatedBalances });
    dispatch({ type: 'SET_HAS_ADDED_INITIAL_TIP', payload: true });

    return { 
      fiatAmount: randomAmountUSD, 
      cryptoAmount, 
      symbol: randomCrypto.symbol 
    };
  }, [state]);

  return (
    <WalletContext.Provider value={{
      ...state,
      setSelectedCrypto,
      updateBalance,
      setDisplayFiat,
      addRandomTip,
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
