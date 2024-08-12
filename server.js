const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.use('/api/dashboard', (req, res) => {
  res.json({ message : 'Welcome to the Dashboard' })
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/partner', require('./routes/partnerRoutes'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));