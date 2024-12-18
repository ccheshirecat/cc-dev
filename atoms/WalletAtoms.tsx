import { atom } from 'recoil';
import { CryptoBalance } from '@/contexts/WalletContext';

// Initial balances for supported cryptocurrencies
const initialBalances: CryptoBalance[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: '0.00' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00' },
  { symbol: 'USDT', name: 'Tether', balance: '0.00' },
  { symbol: 'USDC', name: 'USD Coin', balance: '0.00' },
  { symbol: 'XRP', name: 'Ripple', balance: '0.00' },
  { symbol: 'LTC', name: 'Litecoin', balance: '0.00' },
  { symbol: 'TRX', name: 'TRON', balance: '0.00' },
];

export const selectedCryptoState = atom<CryptoBalance>({
  key: 'selectedCryptoState',
  default: { symbol: 'ETH', name: 'Ethereum', balance: '0.00' },
});

export const balancesState = atom<CryptoBalance[]>({
  key: 'balancesState',
  default: initialBalances,
});

export const displayFiatState = atom<boolean>({
  key: 'displayFiatState',
  default: false,
});

export const hasAddedInitialTipState = atom<boolean>({
  key: 'hasAddedInitialTipState',
  default: false,
});
