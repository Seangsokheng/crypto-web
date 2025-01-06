import React, { useState } from 'react';
// import './TransactionInterface.css'; // Assume styles are defined here

const TransactionInterface = ({ wallet }) => {
    const [transactionType, setTransactionType] = useState('buy');
    const [symbol, setSymbol] = useState('');
    const [amount, setAmount] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [fees, setFees] = useState(0);
    const [error, setError] = useState('');

    const handleTransaction = async () => {
        // Fetch current price from the backend or API
        // const price = await fetchCurrentPrice(symbol); // Assume this function exists

        // const calculatedFees = calculateFees(amount, price);
        // const cost = amount * price + calculatedFees;

        // Send the transaction request to the backend
        const response = await fetch(`/api/transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: transactionType,
                symbol,
                amount,
                // cost,
                // fees: calculatedFees
            })
        });

        if (response.ok) {
            const data = await response.json();
            // setTotalCost(cost);
            // setFees(calculatedFees);
            setError('');
        } else {
            setError('Transaction failed.');
        }
    };

    return (
        <div className="transaction-interface">
            <h2>{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Cryptocurrency</h2>
            <div className="form-group">
                <label htmlFor="symbol">Coin Symbol:</label>
                <input 
                    type="text" 
                    id="symbol" 
                    className="form-control" 
                    value={symbol} 
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input 
                    type="number" 
                    id="amount" 
                    className="form-control" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value))} 
                />
            </div>
            <button className="btn btn-warning" onClick={handleTransaction}>
                {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
            </button>
            {totalCost > 0 && (
                <div className="transaction-summary">
                    <p>Total Cost: ${totalCost.toFixed(2)}</p>
                    <p>Fees: ${fees.toFixed(2)}</p>
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
};

export default TransactionInterface;
