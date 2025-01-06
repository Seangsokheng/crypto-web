import React, { useState, useEffect } from 'react';
import WalletDetails from '../componets/WalletManagement/WalletDetails';
import CreateWallet from '../componets/WalletManagement/CreateWallet';
import axios from 'axios';

const WalletPage = () => {
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        // Fetch wallet from backend
        const fetchWallet = async () => {
            try {
                const response = await axios.get('/wallet/view');
                if (response.data && response.data.id) {
                    setWallet(response.data); // Set the wallet object
                }
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };
        fetchWallet();
    }, []);
    console.log("this is wallet",wallet)

    return (
        <div>
            {wallet ? (
                <WalletDetails wallet={wallet} />
            ) : (
                <CreateWallet />
            )}
        </div>
    );
};

export default WalletPage;
