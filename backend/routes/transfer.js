import express from 'express';
const router = express.Router();
import client from '../config/db.js'; // Assuming you have a db setup file

// Transfer Route
router.post('/transfer', async (req, res) => {
    const { senderWalletAddress, receiverWalletAddress, amount, pinCode, coinSymbol } = req.body;
    console.log(req.body);
    try {
        // Fetch sender's wallet details
        const senderResult = await client.query('SELECT id, pin_code FROM wallets WHERE address = $1', [senderWalletAddress]);
        if (senderResult.rows.length === 0) {
            return res.status(404).json({ errorMessage: 'Sender wallet not found' });
        }
        const senderWallet = senderResult.rows[0];

        // Verify PIN code
        if (pinCode !== senderWallet.pin_code) {
            return res.status(403).json({ errorMessage: 'Invalid PIN code' });
        }

        // Fetch receiver's wallet details
        const receiverResult = await client.query('SELECT id FROM wallets WHERE address = $1', [receiverWalletAddress]);
        if (receiverResult.rows.length === 0) {
            return res.status(404).json({ errorMessage: 'Receiver wallet not found' });
        }
        const receiverWallet = receiverResult.rows[0];

        // Fetch coin details and check balance
        const coinResult = await client.query('SELECT id FROM coins WHERE symbol = $1', [coinSymbol]);
        if (coinResult.rows.length === 0) {
            return res.status(404).json({ errorMessage: `Coin ${coinSymbol} not found` });
        }
        const coinId = coinResult.rows[0].id;

        const senderCoinBalanceResult = await client.query('SELECT amount FROM coinhold WHERE wallet_id = $1 AND coin_id = $2', [senderWallet.id, coinId]);
        const senderCoinBalance = senderCoinBalanceResult.rows[0]?.amount || 0;
        if (senderCoinBalance < amount) {
            return res.status(400).json({ errorMessage: 'Insufficient funds' });
        }

        // Perform the transfer in a transaction
        await client.query('BEGIN');

        // Deduct from sender's balance
        await client.query(`
            UPDATE coinhold
            SET amount = amount - $1
            WHERE wallet_id = $2 AND coin_id = $3
        `, [amount, senderWallet.id, coinId]);

        // Add to receiver's balance
        await client.query(`
            INSERT INTO coinhold (wallet_id, coin_id, amount)
            VALUES ($1, $2, $3)
            ON CONFLICT (wallet_id, coin_id) 
            DO UPDATE SET amount = coinhold.amount + EXCLUDED.amount
        `, [receiverWallet.id, coinId, amount]);

        // Log the transfer
        await client.query(`
            INSERT INTO transfers (sender_wallet_id, receiver_wallet_id, coin_id, amount)
            VALUES ($1, $2, $3, $4)
        `, [senderWallet.id, receiverWallet.id, coinId, amount]);

        await client.query('COMMIT');

        res.status(200).send('Transfer successful');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transfer error:', error);
        res.status(500).send('Transfer failed');
    }
});

export default router;
