/**
 * Routes
 * - PRIVATE ROUTES: only authenticated users can visit
 * - PUBLIC ROUTES: everyone can visit
 */

const express = require('express');
const controller = require('../controllers/controller');
const { authorize_user, isLoggedIn } = require('../controllers/auth.controller')

const router = express.Router();

router.use(isLoggedIn);
router.use(authorize_user); // Middleware for authentication (applied to every private route)
router.get('/', controller.get_secrets_page);
// router.get('/add-secret', controller.get_add_secret_page);
router.get('/get-secrets', controller.get_secrets);
router.post('/delete-secret', controller.delete_secret);
router.post('/add-secret', controller.add_secret);

// router.use((req, res) => {
//     res.redirect('/');
// })

module.exports = router;
