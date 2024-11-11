import express from 'express';
import getCoinData from '../controllers/coinDetail.js';

const router = express.Router();

// Route to get individual coin data
router.get('/coin/:symbol/:period', getCoinData);

export default router;
