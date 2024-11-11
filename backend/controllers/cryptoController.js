import coin from '../models/coins.js';
import callData from '../service/cryptoApi.js';

const cryptoData = async (req, res) => {
  try {
    const coins = (await coin.getCoins()).rows;
    const symbols = coins.map(coin => `"${coin.symbol}"`).join(',');
    const formattedSymbols = `[${symbols}]`; // Format as JSON array string

    const cryptos = await callData(formattedSymbols);
    res.json(cryptos);
  } catch (error) {
    console.error('Error fetching data from Binance:', error);
    res.status(500).send('Server Error');
  }
};

export default cryptoData;
