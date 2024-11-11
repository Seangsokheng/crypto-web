import express from 'express';
import db from '../config/db.js';
import ensureAuthenticated from '../middleware/authMiddleware.js';
import wallet from '../controllers/walletController.js';
import axios from 'axios';
import callData from '../service/cryptoApi.js';
const router = express.Router();

// Generate mnemonic words for wallet creation
router.get('/generate-mnemonic', ensureAuthenticated, wallet.generateMnemonic);
// Verify selected mnemonic words
router.post('/verify-mnemonic', ensureAuthenticated, wallet.verifyMnemonic);
// Create a new wallet
router.post('/', ensureAuthenticated, wallet.createWallet);
// Get all wallets for the authenticated user
router.get('/view', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;

    try {
        console.log("Fetching wallet for user:", userId);
        const walletResult = await db.query(
            `SELECT * FROM wallets WHERE user_id = $1 LIMIT 1`,
            [userId]
        );
        const wallet = walletResult.rows[0];

        if (!wallet) {
            return res.status(404).json({ error: 'No wallet found' });
        }
        res.json(wallet);
    } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }
});
router.get('/:walletId/coins', async (req, res) => {
    const walletId = req.params.walletId;

    try {
        console.log("this is working ?",walletId)
        // Fetch coins from your database
        const coinsResult = await db.query(
            `SELECT c.symbol, ch.amount
                FROM coinHold ch
                JOIN coins c ON ch.coin_id = c.id
                WHERE ch.wallet_id = $1`,
            [walletId]
        );

        const coins = coinsResult.rows;
        // Fetch price data from Binance API for each coin
        const symbol = coins.map(coin => `"${coin.symbol}"`).join(',');
        const formattedSymbols = `[${symbol}]`;
        const binanceData = await callData(formattedSymbols);
        

        const enrichedCoins = coins.map(coin => {
            const binanceInfo = binanceData.find(data => data.symbol === coin.symbol);
            return {
                ...coin,
                price: parseFloat(binanceInfo.lastPrice).toFixed(2), // Use parseFloat directly
                logoUrl: `/img/${coin.symbol.replace('USDT', '').toLowerCase()}.png`, // Adjust the logo URL as needed
                changePercent: parseFloat(binanceInfo.priceChangePercent).toFixed(2) // Use parseFloat directly
            };
        });
        
        const usdtResult = await db.query(`select * from wallets where id = $1`,[walletId]);
        const usdtBalance = usdtResult.rows[0]?.usdt_balance || 0;
        // Calculate total value
        const totalCoinValue = enrichedCoins.reduce((sum, coin) => sum + coin.price * coin.amount, 0);
        const totalValue = totalCoinValue + parseFloat(usdtBalance);
        res.json({ coins: enrichedCoins, totalValue, usdtBalance });
    } catch (error) {
        console.error('Error fetching coins:', error);
        res.status(500).json({ error: 'Failed to fetch coins' });
    }
});


export default router;
