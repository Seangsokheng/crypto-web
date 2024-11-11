import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const users = await User.findByEmail(email);
            console.log(users)
            const user = users.rows[0];
            console.log(user)
            if (!user) {
                return done(null, false,  'Incorrect email.' );
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false,  'Incorrect password.' );
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
