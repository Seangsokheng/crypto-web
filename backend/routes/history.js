import db from "../config/db.js";
import express from 'express';
const router = express.Router();
// Assuming you're using Express
router.get('/history/:walletId', async (req, res) => {
    const { walletId } = req.params;
    console.log(walletId)
    try {
        // Fetch transactions
        const transactions = await db.query(`
            SELECT t.id, t.wallet_id, cf.symbol AS coin_from, ct.symbol AS coin_to, t.type, t.amount_from, 
            t.amount_to, t.fee, t.created_at
            FROM transactions t
            LEFT JOIN coins cf ON t.coin_from_id = cf.id
            LEFT JOIN coins ct ON t.coin_to_id = ct.id
            WHERE t.wallet_id = $1
            ORDER BY t.created_at DESC;
        `, [walletId]);

        // Fetch transfers
        const transfers = await db.query(`
            SELECT tr.id, tr.sender_wallet_id, tr.receiver_wallet_id, c.symbol AS coin, tr.amount, 
            tr.created_at,
                CASE 
                    WHEN tr.sender_wallet_id = $1 THEN 'Sent'
                    ELSE 'Received'
                END AS transfer_type,
                w_sender.address AS sender_address,
                w_receiver.address AS receiver_address
            FROM transfers tr
            JOIN coins c ON tr.coin_id = c.id
            JOIN wallets w_sender ON tr.sender_wallet_id = w_sender.id
            JOIN wallets w_receiver ON tr.receiver_wallet_id = w_receiver.id
            WHERE tr.sender_wallet_id = $1 OR tr.receiver_wallet_id = $1
            ORDER BY tr.created_at DESC;
        `, [walletId]);

        res.json({ transactions: transactions.rows, transfers: transfers.rows });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
export default router;


