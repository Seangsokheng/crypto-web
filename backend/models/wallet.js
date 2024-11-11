import db from '../config/db.js';

const createWallet = async (userId, address, mnemonic, pin) => {
  const result = await db.query(
    `INSERT INTO wallets (user_id, address, mnemonic_words, pin_code) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, address, mnemonic, pin]
  );
    return result;
  };

export default createWallet;