const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Fish Pond API is running' });
});

// Import routes (will be created later)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/ponds', require('./routes/ponds'));
// app.use('/api/fish', require('./routes/fish'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
