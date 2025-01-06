import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Modal, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Transaction = ({ walletId, modalType, onClose, refreshWalletData, savingcoin ,balance}) => {
    const [availableCoins, setAvailableCoins] = useState([]);
    const [selectedCoinFrom, setSelectedCoinFrom] = useState(null);
    const [selectedCoinTo, setSelectedCoinTo] = useState(null);
    const [amount, setAmount] = useState(0);
    const [amountTo, setAmountTo] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [pin, setPin] = useState(''); // New state for PIN

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get('/cryptos');
                setAvailableCoins(response.data);
            } catch (error) {
                console.error("Error fetching crypto data: ", error);
            }
        };

        fetchCoins();
    }, []);

    const handleMaxClick = () => {
        if (selectedCoinFrom && selectedCoinFrom.value) {
            const selectedCoinFromAmount = ownedCoinOptions.find(option => option.value === selectedCoinFrom.value)?.amount;
            if (selectedCoinFromAmount) {
                setAmount(parseFloat(selectedCoinFromAmount));
            } else {
                setErrorMessage('Could not find the selected coin amount');
            }
        } else if (selectedCoinTo && selectedCoinTo.value) {
            const selectCoinToPrice = availableCoinOptions.find(option => option.value === selectedCoinTo.value)?.price;
            if(selectCoinToPrice){
                const amountGet = balance / selectCoinToPrice;
                setAmount(parseFloat(amountGet));
            } else {
                setErrorMessage('Could not find the selected coin amount(buy)');
            }
        }
        else{
            setErrorMessage('Please select a coin');
        }
    };  

    useEffect(() => {
        const calculateAmountTo = async () => {
            if (selectedCoinFrom && selectedCoinTo && amount > 0) {
                try {
                    const response = await axios.get('/exchange-rate', {
                        params: {
                            from: selectedCoinFrom.value,
                            to: selectedCoinTo.value,
                            amount,
                        }
                    });
    
                    if (response.status === 200) {
                        const { equivalentAmountTo } = response.data;
                        setAmountTo(equivalentAmountTo);
                        // If you want to display feeAmount or use it in some way, do it here
                    } else {
                        console.error('Unexpected response status:', response.status);
                        setErrorMessage('Error fetching exchange rate.');
                    }
                } catch (error) {
                    console.error('Error fetching exchange rate:', error);
                    if (error.response && error.response.data && error.response.data.errorMessage) {
                        setErrorMessage(error.response.data.errorMessage);
                    } else {
                        setErrorMessage('Error fetching exchange rate. Please try again.');
                    }
                }
            } else {
                setAmountTo(0); // Reset amountTo if conditions are not met
            }
        };
        calculateAmountTo();
    }, [selectedCoinFrom, selectedCoinTo, amount]);
    
    const availableCoinOptions = availableCoins.map(coin => ({
        value: coin.symbol,
        price: coin.lastPrice,
        label: (
            <div className="d-flex align-items-center">
                <img 
                    src={`/img/${coin.symbol.replace('USDT', '').toLowerCase()}.png`} 
                    alt={coin.symbol} 
                    style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                />
                <span style={{ marginRight: '200px' }}>{coin.symbol.replace('USDT', '')}</span>
                <span>${parseFloat(coin.lastPrice).toFixed(2)}</span>
            </div>
        ),
    }));

    const ownedCoinOptions = savingcoin.map(coin => ({
        value: coin.symbol,
        amount: coin.amount,  // Include the amount here
        label: (
            <div className="d-flex align-items-center">
                <img 
                    src={`/img/${coin.symbol.replace('USDT', '').toLowerCase()}.png`} 
                    alt={coin.symbol} 
                    style={{ width: '20px', height: '20px', marginRight: '8px' }} 
                />
                <span style={{ marginRight: '120px' }}>{coin.symbol.replace('USDT', '')}</span>
                <span style={{ marginRight: '120px' }}>${parseFloat(coin.price).toFixed(2)}</span>
                <span>{parseFloat(coin.amount).toFixed(2)}</span>
            </div>
        ),
    }));

    const handleTransaction = async () => {
        if (!pin) {
            setErrorMessage('Please enter your PIN.');
            return;
        }
        if (
            (modalType === 'buy' && !selectedCoinTo) ||
            (modalType === 'sell' && !selectedCoinFrom) ||
            (modalType === 'swap' && (!selectedCoinFrom || !selectedCoinTo))
        ) {
            setErrorMessage('Please select the required coins for the transaction.');
            return;
        }

        let transactionData = {
            type: modalType,
            walletId: walletId,
            amount,
            amountTo,
            pin
        };

        if (modalType === 'buy') {
            transactionData.coin_to = selectedCoinTo.value;
        } else if (modalType === 'sell') {
            transactionData.coin_from = selectedCoinFrom.value;
        } else if (modalType === 'swap') {
            transactionData.coin_from = selectedCoinFrom.value;
            transactionData.coin_to = selectedCoinTo.value;
        }

        try {
            const response = await axios.post('/transaction', transactionData);
            
            if (response.status === 200) {
                // refreshWalletData();
                window.location.reload();  // Reload the page to refresh the data
                onClose();
            } else {
                setErrorMessage('Transaction failed. Please try again.');
            }
            
        } catch (error) {
            // Check if the error response has a message
            if (error.response && error.response.data && error.response.data.errorMessage) {
              setErrorMessage(error.response.data.errorMessage);
            } else {
              // Handle unexpected errors
              setErrorMessage('Error executing transaction. Please try again.');
            }
          }
        };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Cryptocurrency</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {modalType === 'swap' && (
                    <div className="form-group">
                        <label htmlFor="coin-select-from">Swap From:</label>
                        <Select
                            value={ownedCoinOptions.find(option => option.value === selectedCoinFrom?.value)}
                            onChange={option => setSelectedCoinFrom(option)}
                            options={ownedCoinOptions}
                        />
                    </div>
                )}
                <div className="form-group mt-3">
                    <label htmlFor="coin-select-to">
                        {modalType === 'swap' ? 'Swap To:' : modalType === 'sell' ? 'Sell Coin:' : 'Select Coin to Buy:'}
                    </label>
                        <Select
                            value={modalType === 'sell' || modalType === 'swap' 
                                ? ownedCoinOptions.find(option => option.value === (modalType === 'swap' ? selectedCoinTo?.value : selectedCoinFrom?.value))
                                : availableCoinOptions.find(option => option.value === selectedCoinTo?.value)}
                            onChange={option => {
                                if (modalType === 'swap') {
                                    setSelectedCoinTo(option);
                                } else if (modalType === 'sell') {
                                    setSelectedCoinFrom(option);
                                } else {
                                    setSelectedCoinTo(option); // This ensures selectedCoinTo is updated for 'buy'
                                }
                            }}
                            options={modalType === 'sell' ? ownedCoinOptions : availableCoinOptions}
                        />
                </div>
                    <div className="form-group mt-3">
                    <label htmlFor="amount">Amount:</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="number"
                            id="amount"
                            className="form-control mr-2"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            style={{ borderRadius: '4px', marginRight: '8px' }}
                        />
                        <Button
                            className='btn btn-warning btn-sm'
                            onClick={handleMaxClick}
                            style={{ borderRadius: '4px' }}
                        >
                            Max
                        </Button>
                    </div>
                </div>
                {modalType === 'swap' && selectedCoinFrom && selectedCoinTo && amount > 0 && (
                    <div className="form-group mt-3">
                        <label>Equivalent Amount:</label>
                        <div className="form-control">
                            {amountTo.toFixed(6)} {selectedCoinTo.value.replace('USDT', '')}
                        </div>
                    </div>
                )}
                <div className="form-group mt-3">
                    <label htmlFor="pin">PIN:</label>
                    <span className="form-text">  e.g., 1234</span>
                    <input
                        type="password"
                        id="pin"
                        className="form-control"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="warning" onClick={handleTransaction}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Transaction;
