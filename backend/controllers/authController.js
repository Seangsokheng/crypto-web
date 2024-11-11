import User from '../models/User.js';
import passport from 'passport';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const register = async (req, res) => {
    const { email, password ,conpassword } = req.body;
    console.log(email, password, conpassword);
    if (password.length < 6) {
        return res.status(400).json('Password must be at least 6 characters long' );
    }
    try {
        const checkResult = await User.findByEmail(email);
        console.log(checkResult)
        if(checkResult.rows.length > 0){  
            return res.status(400).json('Email is already registered');
        }else{
            if (password !== conpassword) {
                console.log(password ,"    " ,conpassword);
                return res.status(400).json("Passwords do not match");
            }
            const user = await User.create(email, password);
            req.login(user, (err) => {
            if (err) return res.status(500).json('Failed to log in user' );
            res.status(201).json(user);
        });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Failed to register user');
    }
};

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log("login")
        if (err) return next(err);
        if (!user) return res.status(400).json(info);

        req.login(user, (err) => {
            if (err) return next(err);
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        });
    })(req, res, next);
};

const logout = async (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json( 'Failed to log out user');
        res.json('Logged out successfully');
    });
};

export default { register, login, logout };
