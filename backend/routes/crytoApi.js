import express from 'express';
import cryptoData from '../controllers/cryptoController.js';
const router = express.Router();

router.get('/cryptos', cryptoData)

export default router;
