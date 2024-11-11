import initializePassport from "../config/passport.js";
import passport from "passport";
// Middleware to ensure the user is authenticated
initializePassport(passport);
const ensureAuthenticated = (req, res, next) => {
    console.log('Authenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};
export default ensureAuthenticated;