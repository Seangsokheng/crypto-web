import createWallet from '../models/wallet.js';
import crypto from 'crypto';
import bip39 from 'bip39';
// Create Wallet
const wallet = {

    generateMnemonic : (req, res) => {
    const mnemonic = bip39.generateMnemonic();
    res.json(mnemonic);
    },

    verifyMnemonic : (req, res) => {
      console.log("this is verify");
      console.log(req.body);
      const { selectedWords, mnemonic, userInput } = req.body;
      const isValid = selectedWords.every(index => {
          const mnemonicWord = mnemonic[index];  // Correct the index
          const userWord = userInput[index];         // No need to adjust index for userInput
          console.log(mnemonicWord ,"and ", userWord)
          return mnemonicWord === userWord;          // Compare mnemonic word with user input
      });
      if (isValid) {
          res.json({ success: true });
      } else {
          res.json({ 
              success: false,
              message: "Verification failed. Please try again.",
              resetUserInput: {}
           });
      }
    },
    createWallet : async (req, res) => {
      const { mnemonic, pin } = req.body;
      const userId = req.user.id;
      try {
          const address = crypto.randomBytes(20).toString('hex');
          const result = await createWallet(userId, address, mnemonic, pin);
          res.json(result.rows[0]);
      } catch (error) {
          console.error('Error creating wallet:', error);
          res.status(500).json({ error: 'Failed to create wallet' });
      }
    },
    viewWallet : async (req, res) => {
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
    },
}
export default wallet;