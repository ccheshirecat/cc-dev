// Import Axios for API requests
import axios from 'axios';

// Default exchange rates used as a fallback
export const exchangeRates: { [key: string]: number } = {
  BTC: 30000,
  ETH: 2000,
  LTC: 100,
  TRX: 0.07,
  XRP: 0.5,
  USDT: 1,
  USDC: 1,
};

// Supported currency symbols
export const supportedCurrencies = ['BTC', 'ETH', 'LTC', 'TRX', 'XRP', 'USDT', 'USDC'];

(async function initializeExchangeRates() {
  try {
    const realTimeRates = await getRealTimeExchangeRates();
    Object.assign(exchangeRates, realTimeRates);
  } catch (error) {
    console.error('Failed to initialize real-time exchange rates:', error);
  }
})();

/**
 * Fetches real-time exchange rates for the supported currencies from a public API (CoinGecko in this case).
 * @returns {Promise<{ [key: string]: number }>} A promise that resolves to an object containing the real-time exchange rates.
 */
export async function getRealTimeExchangeRates(): Promise<{ [key: string]: number }> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,litecoin,tron,ripple,tether,usd-coin',
        vs_currencies: 'usd',
      },
    });

    const apiRates = response.data;

    // Map API response to match the keys in our supportedCurrencies array
    const mappedRates: { [key: string]: number } = {
      BTC: apiRates.bitcoin?.usd ?? exchangeRates.BTC,
      ETH: apiRates.ethereum?.usd ?? exchangeRates.ETH,
      LTC: apiRates.litecoin?.usd ?? exchangeRates.LTC,
      TRX: apiRates.tron?.usd ?? exchangeRates.TRX,
      XRP: apiRates.ripple?.usd ?? exchangeRates.XRP,
      USDT: apiRates.tether?.usd ?? exchangeRates.USDT,
      USDC: apiRates["usd-coin"]?.usd ?? exchangeRates.USDC,
    };

    return mappedRates;
  } catch (error) {
    console.error('Failed to fetch real-time exchange rates:', error);
    // Return the default exchange rates if the API call fails
    return { ...exchangeRates };
  }
}

/**
 * Utility function to get the rate for a specific currency.
 * @param {string} currency - The currency symbol (e.g., 'BTC', 'ETH').
 * @returns {number} The current exchange rate for the specified currency.
 */
export function getRateForCurrency(currency: string): number {
  if (!supportedCurrencies.includes(currency)) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return exchangeRates[currency];
} 

/**
 * Periodically refresh the exchange rates in the background (optional feature).
 * This can be used to keep rates updated without requiring manual calls.
 * @param {number} intervalMs - The interval in milliseconds to refresh rates (default: 5 minutes).
 */
export function startAutoRefreshExchangeRates(intervalMs: number = 300000): void {
  setInterval(async () => {
    try {
      const realTimeRates = await getRealTimeExchangeRates();
      Object.assign(exchangeRates, realTimeRates);
      console.log('Exchange rates updated at', new Date().toISOString());
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    }
  }, intervalMs);
} 

// Example usage to fetch and log real-time rates (optional, can be removed in production)
// getRealTimeExchangeRates().then(rates => console.log('Real-time exchange rates:', rates));

// Optionally start automatic refresh every 5 minutes (can be removed or commented out if not needed)
// startAutoRefreshExchangeRates();
