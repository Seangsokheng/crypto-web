import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import initializePassport from './config/passport.js';
import crytoApi from './routes/crytoApi.js';
import authCheck from './routes/checkAuth.js';
import db from './config/db.js';
import pgSession from 'connect-pg-simple';
import User from './routes/CRUDUser.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import coinDetail from './routes/coinDetail.js';
import wallet from './routes/walletRoutes.js';
import Transaction from './routes/transaction.js';
import Transfer from './routes/transfer.js';
import History from './routes/history.js';
import Admin from './routes/admin.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 5000 ;
dotenv.config();

const app = express();

initializePassport(passport);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

app.use(session({
    store: new (pgSession(session))({
        pool: db, // Connection pool from your db.js file
        tableName: 'session', // Session table in your PostgreSQL
        pruneSessionInterval: 60 * 60 * 24 // Interval to prune expired sessions (in seconds)
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Session data:', req.session);
    next();
});

// Set storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/uploads'); // Save files to "uploads" directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
    }
});

const upload = multer({ storage: storage });


app.use('/api/auth', authRoutes);
app.use('/api',crytoApi);
app.use('/api/auth',authCheck);
app.use('/api/auth',upload.single('photo'),User);
app.use('/api',coinDetail);
app.use('/api/wallet',wallet);
app.use('/api',Transaction);
app.use('/api',Transfer);
app.use('/api',History);
app.use('/api/admin',Admin);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
