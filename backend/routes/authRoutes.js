import express from'express';
import auth from '../controllers/authController.js';
const router = express.Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

export default router;
