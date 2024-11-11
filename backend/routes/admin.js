// Routes: /routes/admin.js
import express from 'express';
const router = express.Router();
import db from '../config/db.js'; // Assume db is your database connection
import adminAuth from '../middleware/authAdmin.js';
import User from '../models/User.js';
// Middleware for admin authentication
router.use(adminAuth);

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await db.query(
            `SELECT u.id,username,u.created_at,role,email,image,w.usdt_balance 
            as money from users u left join wallets w on w.user_id = u.id;`);
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Update user wallet
router.post('/wallet/update', async (req, res) => {
    const { userId, newBalance } = req.body;

    try {
        // Check if the user has a wallet
        const walletCheck = await db.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
        console.log(walletCheck.rows.length);
        if (walletCheck.rows.length === 0) {
            // If no wallet exists, return an error message
            return res.status(400).json({ error: 'User does not have a wallet account' });
        }

        // If wallet exists, proceed with the update
        await db.query('UPDATE wallets SET usdt_balance = usdt_balance + $1 WHERE user_id = $2', [newBalance, userId]);

        res.json({ message: 'Wallet updated successfully' });
    } catch (error) {
        console.error('Error updating wallet:', error);
        res.status(500).json({ error: 'Error updating wallet' });
    }
});


// View earnings from transactions (total fees earned)
router.get('/earnings', async (req, res) => {
    try {
        const earnings = await db.query('SELECT SUM(fee) AS total_earnings FROM transactions');
        res.json(earnings.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching earnings' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteUser(userId);  // Delete the user
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, role } = req.body;
        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update email and role
        const updatedEmail = email || user.rows[0].email;
        const updatedRole = role || user.rows[0].role;

        //Update the user in the database
        const updateQuery = `
            UPDATE users 
            SET email = $1, role = $2 
            WHERE id = $3 
            RETURNING *`;
        const updatedUser = await db.query(updateQuery, [updatedEmail, updatedRole, userId]);

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

export default router;
