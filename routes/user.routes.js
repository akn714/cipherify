/**
 * Routes
 * - PRIVATE ROUTES: only authenticated users can visit
 * - PUBLIC ROUTES: everyone can visit
 */

const express = require('express');
const controller = require('../controllers/controller');
const { authorize_user } = require('../controllers/auth.controller')

const router = express.Router();

router.use(authorize_user); // Middleware for authentication (applied to every private route)
router.get('/', controller.get_secrets_page);

// router.use((req, res) => {
//     res.redirect('/');
// })

module.exports = router;
