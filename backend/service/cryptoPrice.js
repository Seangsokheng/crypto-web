import axios from 'axios';
import coin from '../models/coins.js';
async function getCurrentPrices() {
    const coins = (await coin.getCoins()).rows;
    const symbols = coins.map(coin => `"${coin.symbol}"`).join(',');
    const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbols=[${symbols}]`;
  
    try {
      const response = await axios.get(binanceUrl);
      return response.data.reduce((acc, coin) => {
        acc[coin.symbol] = parseFloat(coin.price);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching prices from Binance:', error);
      throw new Error('Could not fetch prices');
    }
  }

export default getCurrentPrices;