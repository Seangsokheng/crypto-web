import express from 'express';
const router = express.Router();
import client from '../config/db.js'; // Assuming you have a db setup file
import getCurrentPrices from '../service/cryptoPrice.js';
// Transaction Route
router.post('/transaction', async (req, res) => {
    const {type, walletId, amount ,amountTo, pin : pinCode, coin_from, coin_to } = req.body;
    try {
        console.log(amountTo)
        const walletResult = await client.query('SELECT pin_code,usdt_balance FROM wallets WHERE id = $1', [walletId]);
        if (walletResult.rows.length === 0) {
            throw new Error('Wallet not found');
        }
        const storedPinCode = walletResult.rows[0].pin_code;
        if (pinCode !== storedPinCode) {
            return res.status(403).json({ errorMessage: 'Invalid PIN code' });
        }
        const balance = walletResult.rows[0].usdt_balance;
        console.log(req.body)
        // Get coinFromId
        let coinFromId = null;
        if(coin_from){
            const coinFromResult = await client.query('SELECT id FROM coins WHERE symbol = $1', [coin_from]);
            if (coinFromResult.rows.length === 0) {
                throw new Error(`Coin with symbol ${coin_from} not found`);
            }
            coinFromId = coinFromResult.rows[0].id;
        }
        // Get coinToId (if applicable)
        let coinToId = null;
        if (coin_to) {
            const coinToResult = await client.query('SELECT id FROM coins WHERE symbol = $1', [coin_to]);
            if (coinToResult.rows.length === 0) {
                throw new Error(`Coin with symbol ${coin_to} not found`);
            }
            coinToId = coinToResult.rows[0].id;
        }
        
        await client.query('BEGIN');
    
        const prices = await getCurrentPrices();
        console.log(type, walletId, amount ,amountTo, coinFromId, coinToId)
        const fee = calculateFee(amount, amountTo);

        // Function to calculate transaction fees (this could be a flat fee or a percentage)
        function calculateFee(amountFrom, amountTo) {
            const feeRate = 0.001; // Example: 0.1% fee
            return Math.max(amountFrom * feeRate, amountTo * feeRate);
        }
  
        if (type === 'buy') {
            const usdtRequired = amount * prices[coin_to];
            if(balance > usdtRequired){

                const feeAmount = usdtRequired * fee;
                console.log(usdtRequired)
                console.log(coinToId)
                await client.query(`
                UPDATE wallets
                SET usdt_balance = usdt_balance - $1
                WHERE id = $2 AND usdt_balance >= $3
                `, [usdtRequired + feeAmount, walletId, usdtRequired + feeAmount]);
        
                await client.query(`
                INSERT INTO coinhold (wallet_id, coin_id, amount)
                VALUES ($1, $2, $3)
                ON CONFLICT (wallet_id, coin_id) 
                DO UPDATE SET amount = coinhold.amount + EXCLUDED.amount
                `, [walletId, coinToId, amount]);
            }else{
                return res.status(400).json({ errorMessage: 'Insufficient funds' });
            }
        } else if (type === 'sell') {
            const usdtGained = amount * prices[coin_from];
            const feeAmount = usdtGained * fee;
        
            // Ensure the user has enough of the coin to sell
            const coinHoldResult = await client.query(`
                SELECT amount FROM coinhold WHERE wallet_id = $1 AND coin_id = $2
            `, [walletId, coinFromId]);
        
            if (coinHoldResult.rows.length === 0 || coinHoldResult.rows[0].amount < amount) {
                return res.status(400).json({ errorMessage: 'Insufficient coin balance' });
            }
        
            await client.query(`
                UPDATE coinhold
                SET amount = amount - $1
                WHERE wallet_id = $2 AND coin_id = $3 AND amount >= $4
            `, [amount, walletId, coinFromId, amount]);
        
            await client.query(`
                UPDATE wallets
                SET usdt_balance = usdt_balance + $1
                WHERE id = $2
            `, [usdtGained - feeAmount, walletId]);
        }
        else if (type === 'swap') {
            const equivalentAmountTo = amountTo;
            const feeAmount = fee;
        
            const coinHoldResult = await client.query(`
                SELECT amount FROM coinhold WHERE wallet_id = $1 AND coin_id = $2
            `, [walletId, coinFromId]);
        
            if (coinHoldResult.rows.length === 0 || coinHoldResult.rows[0].amount < amount) {
                return res.status(400).json({ errorMessage: 'Insufficient coin balance' });
            }
        
            const finalAmountTo = equivalentAmountTo - feeAmount;
        
            if (finalAmountTo <= 0) {
                throw new Error('Fee exceeds the equivalent amount, leading to a negative value');
            }
        
            await client.query(`
                UPDATE coinhold
                SET amount = amount - $1
                WHERE wallet_id = $2 AND coin_id = $3 AND amount >= $4
            `, [amount, walletId, coinFromId, amount]);
        
            await client.query(`
                INSERT INTO coinhold (wallet_id, coin_id, amount)
                VALUES ($1, $2, $3)
                ON CONFLICT (wallet_id, coin_id) 
                DO UPDATE SET amount = coinhold.amount + EXCLUDED.amount
            `, [walletId, coinToId, finalAmountTo]);
        }   
    
        await client.query(`
            INSERT INTO transactions (wallet_id, coin_from_id, coin_to_id, type, amount_from, amount_to, fee)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [walletId, coinFromId, coinToId, type, amount, amountTo, fee]);
    
        await client.query('COMMIT');
        res.status(200).send('Transaction successful');
        } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).send('Transaction failed');
        } 
        // finally {
        //   client.release();
        // }
    });
    router.get('/exchange-rate', async (req, res) => {
        const { from, to, amount } = req.query;
    
        if (!from || !to || !amount) {
            return res.status(400).json({ errorMessage: 'Missing required parameters.' });
        }
    
        try {
            const prices = await getCurrentPrices();
            const usdtFrom = amount * prices[from];
            const equivalentAmountTo = usdtFrom / prices[to];
    
            res.json({ equivalentAmountTo });
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            res.status(500).json({ errorMessage: 'Internal server error.' });
        }
    });
    

export default router;
