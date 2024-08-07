const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/partner', require('./routes/partnerRoutes'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));