const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// When deployed to Netlify, the function path might be /.netlify/functions/server
// We can use a router for /api
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Fish Pond API is running' });
});

// Import routes (will be created later)
// router.use('/auth', require('./routes/auth'));
// router.use('/ponds', require('./routes/ponds'));
// router.use('/fish', require('./routes/fish'));

// Use the router with a base path for Netlify Functions or local development
app.use('/api', router);

// Also add a fallback for direct hits to the root of the function or local server
app.get('/', (req, res) => {
  res.json({ message: 'Fish Pond API is running at /api' });
});

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the handler for Netlify Functions
module.exports.handler = serverless(app);
