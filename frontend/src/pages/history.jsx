import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const History = ()=>{
    const { walletId } = useParams();
    const [transactionHistory, setTransactionHistory] = useState([]); // Initialize as empty arrays
    const [transferHistory, setTransferHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    console.log(loading)
    useEffect(() => {
        if(walletId) { // Check if walletId is valid
            const fetchHistory = async () => {
                try {
                    const response = await axios.get(`/history/${walletId}`);
                    console.log(response);
                    const { transactions = [], transfers = [] } = response.data; // Fallback to empty arrays
                    setTransactionHistory(transactions);
                    setTransferHistory(transfers);
                } catch (error) {
                    console.error("Error fetching transaction history", error);
                }finally {
                    setLoading(false); // Stop loading once the fetch is done
                }
            };
            fetchHistory();
        }
    }, [walletId]);
    console.log(transactionHistory)

    return (
            <div className="container my-4">
            <h2 className="text-center mb-4 text-warning">Transaction History</h2>
            
                <div className="history-section mb-5">
                    <h3 className="text-warning">Transfers</h3>
                    {transferHistory.length > 0 ? (
                        transferHistory.map(transfer => (
                            <div key={transfer.id} className="card bg-secondary text-light p-3 mb-3">
                                <p><strong>{transfer.transfer_type}:</strong> {transfer.amount} {transfer.coin}</p>
                                <p>
                                    <strong>{transfer.transfer_type === 'Sent' ? 'To' : 'From'}:</strong> 
                                    {transfer.transfer_type === 'Sent' ? transfer.receiver_address : transfer.sender_address}
                                </p>
                                <p><strong>On:</strong> {new Date(transfer.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-secondary d-flex justify-content-between align-items-center p-3">
                            <p className="mb-0 text-muted">No transaction history available.</p>
                            <i className="bi bi-exclamation-circle ms-2 text-muted"></i>
                        </div>
                    )}
                </div>
            
                <div className="history-section">
                    <h3 className="text-warning">Buy/Sell/Swap Transactions</h3>
                    {transactionHistory.length > 0 ? (
                        transactionHistory.map(transaction => (
                            <div key={transaction.id} className="card bg-secondary text-light p-3 mb-3">
                                <p><strong>{transaction.type}:</strong> {transaction.amount_from} {transaction.coin_from} to {transaction.amount_to} {transaction.coin_to}</p>
                                <p><strong>Fee:</strong> {transaction.fee}</p>
                                <p><strong>On:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <div className="alert alert-secondary d-flex justify-content-between align-items-center p-3">
                            <p className="mb-0 text-muted">No transaction history available.</p>
                            <i className="bi bi-exclamation-circle ms-2 text-muted"></i>
                        </div>
                    )}
                </div>
            
    </div>

    );
    

}
export default History;