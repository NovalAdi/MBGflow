const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const kitchenRoutes = require('./src/routes/kitchenRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const productionRoutes = require('./src/routes/productionRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', authRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', productionRoutes);
app.use('/api', statsRoutes);
app.use('/api/kitchens', kitchenRoutes); // Kitchens has specific subroutes prefix /api/kitchens

// Start Express Server
db.initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database connection. Server not started:', err);
});
