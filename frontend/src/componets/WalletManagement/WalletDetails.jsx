import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Transaction from '../transaction';
import { useNavigate } from "react-router-dom";

const WalletDetails = ({ wallet }) => {
    const [coins, setCoins] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [hideValues, setHideValues] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [availableCoins, setAvailableCoins] = useState([]);
    const [balance, setBalance] = useState(0); // or useState(null)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Loading state
    useEffect(() => {
        let interval;
        // Ensure wallet is defined before fetching
        if (wallet) {
            // Fetch coin data for the wallet
            const fetchCoinData = async () => {
                try {
                    const response = await axios.get(`/wallet/${wallet.id}/coins`);
                    setCoins(response.data.coins);
                    setTotalValue(response.data.totalValue);
                    setBalance(response.data.usdtBalance || 0);
                } catch (error) {
                    console.error('Error fetching coin data:', error);
                } finally {
                    setLoading(false); // Stop loading once the fetch is done
                }
            };
            fetchCoinData();
            interval = setInterval(fetchCoinData, 10000); // Fetch every 10 seconds
        }
        return () => clearInterval(interval); // Cleanup on unmount
    }, [wallet]);

    const toggleHideValues = () => {
        setHideValues(!hideValues);
    };

    const fetchAvailableCoins = async () => {
        try {
            const response = await axios.get('/cryptos');
            setAvailableCoins(response.data);
        } catch (error) {
            console.error("Error fetching crypto data: ", error);
        }
    }

    useEffect(() => {
        fetchAvailableCoins();
    }, []);

    const handleGoTransfer = ()=>{
        navigate('/wallet/transfer');
    }
    // const onTransactionComplete = () => {
    //     // Refetch the coin data and total value after a transaction
    //     // fetchCoinData();
    // };

    return (
        <div className="container my-4">
            {loading ? (
                <div className="loading-spinner">
                    {/* You can add an animated spinner */}
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
            <div className="wallet-details card bg-dark text-warning p-3">
                <h3 className="d-flex justify-content-between align-items-center mb-3">
                    {wallet.name} - 
                    <span className="wallet-address">
                        {wallet.address.length > 15 ? `${wallet.address.slice(0, 15)}...` : wallet.address}
                    </span>
                    <button
                        className="btn btn-outline-warning btn-sm ms-2"
                        onClick={() => navigator.clipboard.writeText(wallet.address)}
                    >
                        Copy
                    </button>
                    <button className="btn btn-outline-warning ms-auto d-flex align-items-center" onClick={() => navigate(`/history/${wallet.id}`)}>
                        <i className="bi bi-clock-history me-2"></i>History
                    </button>
                </h3>
                <div className="total-value d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Total Value: {hideValues ? '***' : `$${totalValue.toFixed(2)}`}</p>
                    <button className="btn btn-warning btn-sm" onClick={handleGoTransfer} > Transfer </button>
                    
                    <button className="btn btn-warning btn-sm" onClick={toggleHideValues}>
                        {hideValues ? 'Show' : 'Hide'}
                    </button>
                </div>
                <div className="coins-list">
                        <div key={balance} className="coin-item d-flex justify-content-between align-items-center bg-secondary text-light p-2 mb-2 rounded">
                            <img src="./img/usdt.png" alt="USDT" style={{ width: '30px', height: '30px' }} />
                            <div className="ms-2 flex-grow-1 p-2 ">
                                <p className="mb-0">Amount: {hideValues ? '***' : balance !== null ? `$${parseFloat(balance).toFixed(2)}` : '$0.00' }</p>
                            </div>
                        </div>
                    {coins.map(coin => (
                        <div key={coin.symbol} className="coin-item d-flex justify-content-between align-items-center bg-secondary text-light p-2 mb-2 rounded">
                            <img src={coin.logoUrl} alt={coin.symbol} style={{ width: '30px', height: '30px' }} />
                            <div className="ms-2 flex-grow-1">
                                <p className="mb-1">{coin.symbol}: {hideValues ? '***' : `$${coin.price}`}</p>
                                <p className={`mb-1 ${coin.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                    Change: {hideValues ? '***' : `${coin.changePercent}%`}
                                </p>
                                {/* <p className="mb-0">Amount: {hideValues ? '***' : coin.amount}</p> */}
                            </div>
                            <div>
                                <div> <p className="mb-0" style={{ fontWeight: 'bolder' }}>{hideValues ? '***' : coin.amount}</p></div>
                                {hideValues ? '***' : `$${parseFloat(coin.price * coin.amount).toFixed(2)}`}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="wallet-actions d-flex justify-content-between mt-3">
                    <button className="btn btn-outline-warning" onClick={() => setModalType('buy')}>Buy</button>
                    <button className="btn btn-outline-warning" onClick={() => setModalType('sell')}>Sell</button>
                    <button className="btn btn-outline-warning" onClick={() => setModalType('swap')}>Swap</button>
                </div>
            </div>
        )}
            {modalType && (
                <Transaction
                    modalType={modalType}
                    walletId={wallet.id}
                    availableCoins={availableCoins}
                    onClose={() => setModalType(null)}
                    // onTransactionComplete={onTransactionComplete}
                    savingcoin={coins}
                    balance = {balance}
                />
            )}
        
        </div>
    );
};

export default WalletDetails;
