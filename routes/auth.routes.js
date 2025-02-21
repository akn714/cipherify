/**
 * AUTH ROUTES:
 * GET /login
 * GET /signup
 * GET /logout
 * 
 * POST /login
 * POST /signup
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const Model = require("../models/model");

const router = express.Router();


// auth routes
router.get('/verify', async (req, res) => {
    console.log("Entered /api/auth/verify");

    try {
        let token = req.cookies?.login || req.headers.authorization?.split(" ")[1];
        console.log('token:', token)
        if (!token) return res.json({ authenticated: false });

        let id = authController.is_user_authentic(token);
        if (!id) return res.json({ authenticated: false });

        let user = await Model.findById(id);
        if (user) return res.json({ authenticated: true });

        return res.json({ authenticated: false });
    } catch (error) {
        console.log('[-] Authorization error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/logout', authController.logout);
router.use(authController.isLoggedIn);
// router.get('/signup', authController.get_signup_page);
// router.get('/login', authController.get_login_page);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use((req, res)=>{
    res.redirect('/');
})

module.exports = router

