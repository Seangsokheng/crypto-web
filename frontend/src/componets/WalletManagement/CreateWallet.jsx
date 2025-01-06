import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const CreateWallet = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [mnemonic, setMnemonic] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [userInput, setUserInput] = useState({});
    const [pin, setPin] = useState('');

    const generateMnemonic = async () => {
        try {
            const response = await axios.get('/wallet/generate-mnemonic');
            setMnemonic(response.data.split(' '));
            setStep(2);
        } catch (error) {
            console.error('Error generating mnemonic:', error);
        }
    };

    const randomizeWords = () => {
        const indices = [];
        while (indices.length < 2) {
            const index = Math.floor(Math.random() * 12);
            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        setSelectedWords(indices);
    };

    const verifyMnemonic = async () => {
        try {
            const response = await axios.post('/wallet/verify-mnemonic', { selectedWords, mnemonic, userInput });
            console.log(response);
            if (response.data.success) {
                setStep(4);
            } else {
                alert('Mnemonic verification failed. Please try again.');
                setUserInput(response.data.resetUserInput);
                setStep(1);
            }
        } catch (error) {
            console.error('Error verifying mnemonic:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/wallet', { mnemonic: mnemonic.join(' '), pin });
            alert('Wallet created successfully!');
            navigate("/wallet");
            console.log(response);
        } catch (error) {
            console.error('Error creating wallet:', error);
        }
    };
    console.log(pin);

    return (
        <div className="container my-4">
    {step === 1 && (
        <button className="btn btn-warning btn-lg w-100" onClick={generateMnemonic}>
            Create Wallet
        </button>
    )}

    {step === 2 && (
        <div className="card bg-dark text-warning">
            <div className="card-header">
                <h2>Mnemonic Phrase</h2>
            </div>
            <div className="card-body">
                <div className="row">
                    {mnemonic.map((word, index) => (
                        <div key={index} className="col-6">
                            <p className="mb-2">{index + 1}: {word}</p>
                        </div>
                    ))}
                </div>
                <button 
                    className="btn btn-warning mt-3" 
                    onClick={() => { randomizeWords(); setStep(3); }}
                >
                    Continue
                </button>
            </div>
        </div>
    )}

    {step === 3 && selectedWords.length > 0 && (
        <div className="card bg-dark text-warning">
            <div className="card-header">
                <h2>Verify Mnemonic</h2>
            </div>
            <div className="card-body">
                <div className="form-group mb-3">
                    <label>Word #{selectedWords[0] + 1}:</label>
                    <input 
                        type="text" 
                        className="form-control bg-dark text-warning border-warning"
                        onChange={(e) => setUserInput({ ...userInput, [selectedWords[0]]: e.target.value })}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Word #{selectedWords[1] + 1}:</label>
                    <input 
                        type="text" 
                        className="form-control bg-dark text-warning border-warning"
                        onChange={(e) => setUserInput({ ...userInput, [selectedWords[1]]: e.target.value })}
                    />
                </div>
                <button 
                    className="btn btn-warning w-100" 
                    onClick={verifyMnemonic}
                >
                    Verify
                </button>
            </div>
        </div>
    )}

    {step === 4 && (
        <div className="card bg-dark text-warning">
            <div className="card-header">
                <h2>Set Wallet Pin</h2>
            </div>
            <div className="card-body">
                <input
                    type="password"
                    className="form-control bg-dark text-warning border-warning mb-3"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                />
                <button 
                    className="btn btn-warning w-100" 
                    onClick={handleSubmit}
                >
                    Create Wallet
                </button>
            </div>
        </div>
    )}
</div>

    );
};

export default CreateWallet;
