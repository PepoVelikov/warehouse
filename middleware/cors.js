const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

// Middleware
app.use(cors()); // Използвай cors
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Маршрути
app.use('/api/purchase', require('./routes/purchaseRoutes'));

// Други маршрути
// app.use('/api/your-route', yourRouteHandler);

// Слушай на порт
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
