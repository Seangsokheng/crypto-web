import axios from 'axios';
const getCryptos = async (symbols) => {
    console.log(symbols);
    const binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`;
    const binanceResponse = await axios.get(binanceUrl);
    return binanceResponse.data; // Return the data
};


export default getCryptos;
