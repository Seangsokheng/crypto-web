import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import CoinChart from '../componets/CoinChart.jsx';
import './CoinDetails.css';

const CoinDetails = () => {
    const { symbol } = useParams();
    const [coinData, setCoinData] = useState({});
    const [period, setPeriod] = useState('1day');
    const [loading, setLoading] = useState(true);
    const { state } = useLocation();
    const { price, changePercent24h, logo } = state;
    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                const response = await axios.get(`/coin/${symbol}/${period}`);
                setCoinData(response.data);
            } catch (error) {
                console.error('Error fetching coin data:', error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchCoinData();
    }, [symbol, period]);

    const chartData = {
      labels: coinData?.coinData?.map(data => {
        const date = new Date(data.openTime); // Parsing ISO string to Date object
        
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }),
      datasets: [
            {
                label: `Price over ${period}`,
                data: coinData?.coinData?.map(data => data.closePrice),
                borderColor: '#f0b90b',
                backgroundColor: 'rgba(240, 185, 11, 0.2)',
                borderWidth: 2,
                fill: true,
            }
        ],
        
    };
    // console.log(chartData.labels);
    

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="coin-details-container">
            <div className="coin-info">
                <h2>{symbol} Price Chart</h2>
                <img src={logo} alt={`${symbol} logo`} className="coin-logo" />
                <p className="coin-price">${price} <span className={`price-change ${changePercent24h >= 0 ? 'positive' : 'negative'}`}>{changePercent24h}%</span></p>
                <div className="period-selector">
                    <button onClick={() => setPeriod('1day')}>1 Day</button>
                    <button onClick={() => setPeriod('7days')}>7 Days</button>
                    <button onClick={() => setPeriod('30days')}>30 Days</button>
                    <button onClick={() => setPeriod('3months')}>3 Months</button>
                </div>
            </div>
            <div className="chart-container">
                {coinData.coinData && <CoinChart chartData={chartData} period={period} />}
            </div>
        </div>
    );
};

export default CoinDetails;
