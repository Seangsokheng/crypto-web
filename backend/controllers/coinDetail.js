import axios from 'axios';

const getCoinData = async (req, res) => {
    try {
        const { symbol, period } = req.params;
        let interval;

        switch (period) {
            case '1day':
                interval = '1d';
                break;
            case '7days':
                interval = '1w';
                break;
            case '30days':
                interval = '1M';
                break;
            case '3months':
                interval = '3M';
                break;
            default:
                return res.status(400).json({ error: 'Invalid period' });
        }
        console.log(`this is symol and interval ${symbol} ,${interval} `);

        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;

        const response = await axios.get(url);
        const coinData = response.data.map(item => ({
            openTime: new Date(item[0]), // Convert to Date object
            openPrice: item[1],
            highPrice: item[2],
            lowPrice: item[3],
            closePrice: item[4],
            volume: item[5],
            closeTime: new Date(item[6]), // Convert to Date object
        }));
        res.json({ symbol, period, coinData });
    } catch (error) {
        console.error('Error fetching coin data:', error);
        res.status(500).json({ error: 'Error fetching coin data' });
    }
};
export default getCoinData;