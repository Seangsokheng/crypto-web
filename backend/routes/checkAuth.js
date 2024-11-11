// Add this route in your auth routes
import express from 'express';
const router = express.Router();
import User from "../models/User.js"
// Endpoint to check if the user is authenticated (used by the frontend)
router.get('/check',async (req, res) => {
    
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        res.json({ isAuthenticated: true, role: user.role });
    } else {
        res.json({ isAuthenticated: false });
    }
});

export default router;
