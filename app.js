// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const log = require('./logger');
const { COOKIES } = require('./utility/util');

// Load environment variables
dotenv.config();

const app = express();

// Mini apps
const user_routes = require('./routes/user.routes');
const auth_routes = require('./routes/auth.routes');

// Middleware for authentication
const { isLoggedIn } = require('./controllers/auth.controller');

// Middlewares
// app.use(
//     cors({
//         origin: 'http://localhost:8080',
//         credentials: true,
//     })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(log); // logging method and url of all incomming request
// app.set('views', path.join(__dirname, 'views')); // Set views directory

// Routes for mini apps
app.use('/api/user', user_routes);
app.use('/api/auth', auth_routes);

// Route for unauthorized users
app.get('/unauthorized', (req, res) => {
    // Clear authentication cookies and redirect to login page
    res.clearCookie(COOKIES.LOGIN);
    res.clearCookie(COOKIES.ROLE);
    res.status(401).sendFile(path.join(__dirname, '/views/html/unauthorized.html'));
});

console.log('[+] Bypassed middleware14')

// app.use((req, res) => {
    
// })


app.use(express.static(__dirname + '/views'));

// Home route
app.get('*', (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, '/views/index.html'));
    } catch (error) {
        console.error('[-] Error in home route:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
});

// Handle 404 errors
// app.use((req, res) => {
//     return res.status(404).sendFile(path.join(__dirname, '/views/html/404.html'));
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[+] App running on http://localhost:${PORT}`);
});
