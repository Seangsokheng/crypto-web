import React, { useState , useEffect} from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
const TransferForm = () => {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [coin, setCoin] = useState('');
    const [OwnCoins , setOwnCoins] = useState([])
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const [wallet, setWallet] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        // Fetch wallet from backend
        const fetchWallet = async () => {
            try {
                const response = await axios.get('/wallet/view');
                console.log(response.data);
                if (response.data && response.data.id) {
                    setWallet(response.data); // Set the wallet object
                }
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };
        fetchWallet();
    }, []);

    console.log("this is wallet", wallet);

    useEffect(() => {
        // Ensure wallet is defined before fetching coin data
        if (wallet) {
            const fetchCoinData = async () => {
                try {
                    const response = await axios.get(`/wallet/${wallet.id}/coins`);
                    setOwnCoins(response.data.coins);
                } catch (error) {
                    console.error('Error fetching coin data:', error);
                }
            };
            fetchCoinData();
        }
    }, [wallet]);
    
    console.log(receiverAddress)
    console.log(coin)
    const walletAddress = wallet?.address || '';
    console.log("wallet address",walletAddress)
    
    const handleTransfer = async () => {
        if (!wallet) {
            setMessage('Wallet not loaded yet. Please try again.');
            return;
        }
        try {
            console.log(amount);
            console.log(pin)
            const response = await axios.post('/transfer', {
                senderWalletAddress: walletAddress,
                receiverWalletAddress: receiverAddress,
                coinSymbol: coin,
                amount,
                pinCode: pin
            });
            setMessage(response.data);
            toast.success('Transfer successful!', {
                position: 'top-right'
            });
            // Navigate to the wallet page after 2 seconds
            setTimeout(() => {
                navigate('/wallet');
            }, 3000);
        } catch (error) {
            setMessage(error.response.data.errorMessage || 'Transfer failed');
            toast.error('Transfer failed!', {
                position: 'top-right'
            });
        }
    };

    const ownedCoinOptions = OwnCoins.map(coin => ({
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

    return (
        <div className="container mt-4">
            <div className="card p-4" style={{ borderColor: '#F0B90B' }}>
                <h3 className="text-center" style={{ color: '#F0B90B' }}>Transfer Coins</h3>
                <div className="form-group">
                    <label htmlFor="receiver-address" style={{ color: '#F0B90B' }}>Receiver's Wallet Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="receiver-address"
                        placeholder="Receiver's Wallet Address"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="coin-select" style={{ color: '#F0B90B' }}>Select Coin:</label>
                    <Select
                        id="coin-select"
                        value={ownedCoinOptions.find(option => option.value === coin)}
                        onChange={(option) => setCoin(option.value)}
                        options={ownedCoinOptions}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: '#F0B90B',
                                boxShadow: 'none'
                            }),
                            option: (base) => ({
                                ...base,
                                color: '#333',
                            }),
                        }}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="amount" style={{ color: '#F0B90B' }}>Amount:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="amount"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="pin" style={{ color: '#F0B90B' }}>PIN:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="pin"
                        placeholder="PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                </div>
                <button
                    className="btn btn-block mt-4"
                    style={{ backgroundColor: '#F0B90B', color: '#000' }}
                    onClick={handleTransfer}
                >
                    Transfer
                </button>
                {message && <p className="mt-3 text-center" style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            </div>
            <ToastContainer />
        </div>
    );
};

export default TransferForm;
