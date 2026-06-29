const { Hono } = require('hono');
const { cors } = require('hono/cors');
const db = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const kitchenRoutes = require('./src/routes/kitchenRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const productionRoutes = require('./src/routes/productionRoutes');
const statsRoutes = require('./src/routes/statsRoutes');

const app = new Hono();

// CORS Middleware
app.use('*', cors());

let dbInitialized = false;

// Middleware to set database binding and initialize D1 SQLite tables & seeds on demand
app.use('*', async (c, next) => {
  db.initDb(c.env.DB);
  
  if (!dbInitialized) {
    try {
      await db.initializeDatabase();
      dbInitialized = true;
    } catch (e) {
      console.error("Cloudflare D1 database initialization failed:", e);
    }
  }
  
  await next();
});

// Default status route
app.get('/', (c) => c.text('MBGflow Cloudflare Workers Backend is active.'));

// Mount routes
app.route('/api/kitchens', kitchenRoutes);
app.route('/api', authRoutes);
app.route('/api', inventoryRoutes);
app.route('/api', productionRoutes);
app.route('/api', statsRoutes);

export default app;
