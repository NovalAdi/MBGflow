const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let pool;

async function initializeDatabase() {
  let connection;
  try {
    // 1. First connection without database name to ensure DB exists
    connection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || 'mbgflow';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' ensured.`);
  } catch (error) {
    console.error('Failed to create or verify database:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }

  // 2. Create the connection pool with database name
  pool = mysql.createPool({
    ...dbConfig,
    database: process.env.DB_NAME || 'mbgflow',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // 3. Create tables if they don't exist
  await createTables();

  // 4. Seed tables if they are empty
  await seedDatabase();
}

async function createTables() {
  const connection = await pool.getConnection();
  try {
    // Enable foreign keys
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Kitchens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kitchens (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        capacity INT,
        city VARCHAR(100),
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL
      );
    `);

    // Menus table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // Ingredients table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menuId VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        perPortion DECIMAL(10, 4) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
      );
    `);

    // Inventory items (materials) table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    // Inventory batches table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_batches (
        id VARCHAR(50) PRIMARY KEY,
        inventoryId VARCHAR(50) NOT NULL,
        kitchenId VARCHAR(50) NOT NULL,
        container VARCHAR(255),
        weight VARCHAR(50) NOT NULL,
        weight_value DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
        unit VARCHAR(50) NOT NULL DEFAULT 'kg',
        package_capacity DECIMAL(10, 4) NULL,
        package_unit VARCHAR(50) NULL,
        expiry DATE NOT NULL,
        FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
      );
    `);

    // Ensure columns exist (migrations)
    try {
      await connection.query("ALTER TABLE inventory_batches ADD COLUMN weight_value DECIMAL(10,4) NOT NULL DEFAULT 0.0000;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE inventory_batches ADD COLUMN unit VARCHAR(50) NOT NULL DEFAULT 'kg';");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE inventory_batches ADD COLUMN package_capacity DECIMAL(10,4) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE inventory_batches ADD COLUMN package_unit VARCHAR(50) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE stock_requests ADD COLUMN kitchenId VARCHAR(50) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE stock_requests ADD COLUMN kitchenName VARCHAR(255) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE kitchens ADD COLUMN latitude DECIMAL(10, 8) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE kitchens ADD COLUMN longitude DECIMAL(11, 8) NULL;");
    } catch (e) {}
    try {
      await connection.query("UPDATE kitchens SET latitude = -6.1668, longitude = 106.7865 WHERE id = 'k1' AND latitude IS NULL;");
      await connection.query("UPDATE kitchens SET latitude = -6.3024, longitude = 106.6522 WHERE id = 'k2' AND latitude IS NULL;");
      await connection.query("UPDATE kitchens SET latitude = -6.8915, longitude = 107.6106 WHERE id = 'k3' AND latitude IS NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE stock_requests ADD COLUMN supplierKitchenId VARCHAR(50) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE stock_requests ADD COLUMN supplierKitchenName VARCHAR(255) NULL;");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE stock_requests ADD COLUMN adminNotes TEXT NULL;");
    } catch (e) {}

    // Migration: populate weight_value and unit from existing weight strings if they are 0
    const [rowsToMigrate] = await connection.query("SELECT id, weight FROM inventory_batches WHERE weight_value = 0.0000");
    for (const row of rowsToMigrate) {
      const val = parseFloat(row.weight) || 0;
      const unit = row.weight.replace(/[0-9.\s]+/g, '') || 'kg';
      await connection.query(
        "UPDATE inventory_batches SET weight_value = ?, unit = ? WHERE id = ?",
        [val, unit, row.id]
      );
    }

    // Staff table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        avatar VARCHAR(255),
        kitchenId VARCHAR(50),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL DEFAULT 'password',
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
      );
    `);

    // Production plans table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS production_plans (
        id VARCHAR(50) PRIMARY KEY,
        day VARCHAR(20) NOT NULL,
        menuId VARCHAR(50) NOT NULL,
        menuName VARCHAR(255) NOT NULL,
        kitchenId VARCHAR(50) NOT NULL,
        kitchenName VARCHAR(255) NOT NULL,
        portions INT NOT NULL,
        note TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        chefPenanggungJawab VARCHAR(255),
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
        FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
      );
    `);

    // Production logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS production_logs (
        id VARCHAR(50) PRIMARY KEY,
        kitchenId VARCHAR(50),
        kitchen VARCHAR(255) NOT NULL,
        menu VARCHAR(255) NOT NULL,
        servings INT NOT NULL,
        city VARCHAR(100),
        startTime VARCHAR(100),
        qaNotes TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
      );
    `);

    // Stock requests table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stock_requests (
        id VARCHAR(50) PRIMARY KEY,
        material VARCHAR(255) NOT NULL,
        amount VARCHAR(50) NOT NULL,
        urgency VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        createdAt VARCHAR(100) NOT NULL,
        kitchenId VARCHAR(50) NULL,
        kitchenName VARCHAR(255) NULL,
        supplierKitchenId VARCHAR(50) NULL,
        supplierKitchenName VARCHAR(255) NULL,
        adminNotes TEXT NULL
      );
    `);

    // Wastage records table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wastage_records (
        id VARCHAR(50) PRIMARY KEY,
        kitchen VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        material VARCHAR(255) NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        unit VARCHAR(20) NOT NULL DEFAULT 'kg',
        reason VARCHAR(255) NOT NULL,
        cost INT NOT NULL,
        date VARCHAR(50) NOT NULL
      );
    `);

    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database tables verified/created successfully.');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function seedDatabase() {
  const connection = await pool.getConnection();
  try {
    const [kitchenRows] = await connection.query('SELECT COUNT(*) as count FROM kitchens');
    if (kitchenRows[0].count > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    console.log('Seeding initial database data with hashed passwords...');
    const initialDataPath = path.join(__dirname, '..', '..', 'initial_data.json');
    if (!fs.existsSync(initialDataPath)) {
      console.warn('initial_data.json not found in backend directory. Seeding skipped.');
      return;
    }

    const rawData = fs.readFileSync(initialDataPath, 'utf8');
    const data = JSON.parse(rawData);

    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 1. Seed Kitchens
    for (const kitchen of data.kitchens) {
      await connection.query(
        'INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          kitchen.id,
          kitchen.name,
          kitchen.address,
          kitchen.capacity,
          kitchen.city,
          kitchen.latitude !== undefined ? kitchen.latitude : null,
          kitchen.longitude !== undefined ? kitchen.longitude : null
        ]
      );
    }

    // 2. Seed Menus and Ingredients
    for (const menu of data.menus) {
      await connection.query(
        'INSERT INTO menus (id, name) VALUES (?, ?)',
        [menu.id, menu.name]
      );
      for (const ingredient of menu.ingredients) {
        await connection.query(
          'INSERT INTO ingredients (menuId, name, perPortion, unit) VALUES (?, ?, ?, ?)',
          [menu.id, ingredient.name, ingredient.perPortion, ingredient.unit]
        );
      }
    }

    // 3. Seed Inventory and Inventory Batches
    for (const item of data.inventory) {
      await connection.query(
        'INSERT INTO inventory (id, name) VALUES (?, ?)',
        [item.id, item.name]
      );
      for (const batch of item.batches) {
        const weight_value = batch.weight_value !== undefined ? batch.weight_value : parseFloat(batch.weight) || 0;
        const unit = batch.unit || batch.weight.replace(/[0-9.\s]+/g, '') || 'kg';
        const weightStr = batch.weight || `${weight_value} ${unit}`;
        const package_capacity = batch.package_capacity !== undefined ? batch.package_capacity : null;
        const package_unit = batch.package_unit || null;
        await connection.query(
          'INSERT INTO inventory_batches (id, inventoryId, kitchenId, container, weight, weight_value, unit, expiry, package_capacity, package_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [batch.id, item.id, batch.kitchenId, batch.container, weightStr, weight_value, unit, batch.expiry, package_capacity, package_unit]
        );
      }
    }

    // 4. Seed Staff (with bcrypt password hashing)
    for (const staff of data.staff) {
      const plainPassword = staff.password || 'password';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      await connection.query(
        'INSERT INTO staff (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          staff.id,
          staff.name,
          staff.role,
          staff.status || 'Active',
          staff.avatar || '',
          staff.kitchenId || null,
          staff.email,
          hashedPassword
        ]
      );
    }

    // 5. Seed Production Plans
    for (const plan of data.productionPlans) {
      await connection.query(
        'INSERT INTO production_plans (id, day, menuId, menuName, kitchenId, kitchenName, portions, note, status, chefPenanggungJawab) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          plan.id,
          plan.day,
          plan.menuId,
          plan.menuName,
          plan.kitchenId,
          plan.kitchenName,
          plan.portions,
          plan.note || '',
          plan.status || 'Pending',
          plan.chefPenanggungJawab || ''
        ]
      );
    }

    // 6. Seed default production logs
    for (const plan of data.productionPlans) {
      const city = plan.kitchenName.includes('Jakarta')
        ? 'Jakarta'
        : plan.kitchenName.includes('Tangerang')
        ? 'Tangerang'
        : 'Bandung';

      await connection.query(
        'INSERT INTO production_logs (id, kitchenId, kitchen, menu, servings, city, startTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          plan.id,
          plan.kitchenId,
          plan.kitchenName,
          plan.menuName,
          plan.portions,
          city,
          new Date().toISOString(),
          plan.note || '',
          plan.status === 'NotStarted' ? 'Pending' : plan.status || 'Pending'
        ]
      );
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database seeded successfully with hashed passwords.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  initializeDatabase,
  query: (sql, params) => pool.query(sql, params),
  get pool() { return pool; }
};
