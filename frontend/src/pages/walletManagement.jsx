import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const WalletManagement = () => {
    const [walletUpdate, setWalletUpdate] = useState({ userId: '', newBalance: '' });
    
    const updateWallet = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/wallet/update', walletUpdate);
            alert(response.data.message); // Success message from backend
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                // Display the error message from the backend
                alert(`Error: ${error.response.data.error}`);
            } else {
                // Handle generic error if no specific error message is sent
                alert('Error updating wallet');
            }
        }
    };

    return (
        
        <div className="container mt-4">
            <li className="nav-item mb-3">
                    <Link className="nav-link text-light" to="/admin">
                        <i className="fas fa-arrow-left me-2"></i>Back to Home
                    </Link>
            </li>
    <div className="card shadow-sm">
        <div className="card-header bg-warning text-white">
            <h1 className="mb-0">Wallet Management</h1>
        </div>
        <div className="card-body">
            <form onSubmit={updateWallet}>
                <div className="mb-3">
                    <label htmlFor="userId" className="form-label">User ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="userId"
                        value={walletUpdate.userId}
                        onChange={(e) => setWalletUpdate({ ...walletUpdate, userId: e.target.value })}
                        placeholder="Enter User ID"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newBalance" className="form-label">New Balance</label>
                    <input
                        type="text"
                        className="form-control"
                        id="newBalance"
                        value={walletUpdate.newBalance}
                        onChange={(e) => setWalletUpdate({ ...walletUpdate, newBalance: e.target.value })}
                        placeholder="Enter New Balance"
                    />
                </div>
                <button type="submit" className="btn btn-warning w-100">Update Wallet</button>
            </form>
        </div>
    </div>
</div>

    );
};

export default WalletManagement;
