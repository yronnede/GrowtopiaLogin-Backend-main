const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');

// Basic configuration
const PORT = 5000;
const ENVIRONMENT = 'development';

// Security middleware setup
app.use(helmet());
app.use(cookieParser());

// Request parsing
app.use(bodyParser.urlencoded({ extended: false, limit: '10kb' }));
app.use(bodyParser.json({ limit: '10kb' }));

// Compression
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many requests, please try again later'
        });
    }
});

// CSRF protection
const csrfProtection = csrf({ 
    cookie: {
        httpOnly: true,
        secure: ENVIRONMENT === 'production',
        sameSite: 'strict'
    }
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: ENVIRONMENT === 'production' ? '7d' : '0'
}));

// Logging
app.use(morgan(ENVIRONMENT === 'development' ? 'dev' : 'combined'));

// Routes
app.get('/', csrfProtection, (req, res) => {
    res.render('login', {
        csrfToken: req.csrfToken(),
        pageTitle: 'Growtopia Player Support - Login'
    });
});

app.post('/player/growid/login/validate', apiLimiter, (req, res) => {
    try {
        const { growId, password, _token } = req.body;
        
        // Validate inputs
        if (!growId || !password || !_token) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        if (growId.length < 4 || password.length < 4) {
            return res.status(400).json({
                status: 'error',
                message: 'GrowID and Password must be at least 4 characters'
            });
        }

        // In a real application, you would:
        // 1. Validate the CSRF token
        // 2. Authenticate against database
        // 3. Create a proper session token
        
        const responseData = {
            status: 'success',
            message: 'Account validated successfully',
            token: `_token=${_token}&growId=${encodeURIComponent(growId)}&password=${encodeURIComponent(password)}`,
            url: '',
            accountType: 'growtopia',
            accountAge: 2
        };

        res.json(responseData);
    } catch (error) {
        console.error('Login validation error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

app.get('/player/register', csrfProtection, (req, res) => {
    res.render('register', {
        csrfToken: req.csrfToken(),
        pageTitle: 'Growtopia Player Support - Register'
    });
});

app.get('/player/validate/close', (req, res) => {
    res.send('Window closed successfully');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid CSRF token'
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    });
});

// Server startup
app.listen(PORT, () => {
    console.log(`Server running in ${ENVIRONMENT} mode on port ${PORT}`);
    
    if (ENVIRONMENT === 'development') {
        console.log(`Access the app at: http://localhost:${PORT}`);
    }
});

// Enable HTTPS in production (uncomment when you have SSL certificates)
/*
if (ENVIRONMENT === 'production') {
    const https = require('https');
    const fs = require('fs');
    
    const options = {
        key: fs.readFileSync('/path/to/privkey.pem'),
        cert: fs.readFileSync('/path/to/fullchain.pem')
    };

    https.createServer(options, app).listen(443, () => {
        console.log('HTTPS server running on port 443');
    });
}
*/
