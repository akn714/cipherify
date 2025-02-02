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

const router = express.Router();


// auth routes
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

