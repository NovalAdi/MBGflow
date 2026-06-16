const mysql = require('mysql2/promise');
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

  // 3. Drop all tables for a clean reset
  await resetDatabase();

  // 4. Create tables
  await createTables();

  // 5. Seed tables with comprehensive demo data
  await seedDatabase();
}

async function resetDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    const tables = [
      'notifications',
      'stock_verifications',
      'wastage_records',
      'stock_requests',
      'production_logs',
      'production_plans',
      'ingredients',
      'inventory_batches',
      'inventory',
      'users',
      'menus',
      'kitchens'
    ];
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS \`${table}\`;`);
    }
    // Also drop legacy 'staff' table if it exists
    await connection.query('DROP TABLE IF EXISTS `staff`;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('All tables dropped successfully (clean reset).');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  try {
    // Kitchens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS kitchens (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        capacity INT,
        city VARCHAR(100),
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL,
        maps_url TEXT NULL
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
        name VARCHAR(255) NOT NULL UNIQUE,
        logistics_sku VARCHAR(100) NULL,
        base_unit VARCHAR(20) NOT NULL DEFAULT 'kg',
        has_packaging TINYINT(1) DEFAULT 0,
        packaging_name VARCHAR(50) NULL,
        packaging_capacity DECIMAL(10, 4) NULL
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
        qty_packed INT NOT NULL DEFAULT 0,
        qty_loose DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
        unit VARCHAR(50) NOT NULL DEFAULT 'kg',
        package_capacity DECIMAL(10, 4) NULL,
        package_unit VARCHAR(50) NULL,
        expiry DATE NOT NULL,
        FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
      );
    `);

    // Users table (formerly 'staff')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
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
        kitchenId VARCHAR(50) NOT NULL,
        portions INT NOT NULL,
        note TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        userId VARCHAR(50),
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
        FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Production logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS production_logs (
        id VARCHAR(50) PRIMARY KEY,
        kitchenId VARCHAR(50),
        menuId VARCHAR(50) NOT NULL,
        servings INT NOT NULL,
        startTime VARCHAR(100),
        endTime VARCHAR(100),
        qaNotes TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
        FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
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
        supplierKitchenId VARCHAR(50) NULL,
        note TEXT NULL,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
        FOREIGN KEY (supplierKitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
      );
    `);

    // Wastage records table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wastage_records (
        id VARCHAR(50) PRIMARY KEY,
        kitchenId VARCHAR(50) NOT NULL,
        inventoryId VARCHAR(50) NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        unit VARCHAR(20) NOT NULL DEFAULT 'kg',
        reason VARCHAR(255) NOT NULL,
        cost INT NOT NULL,
        date VARCHAR(50) NOT NULL,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
        FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE
      );
    `);

    // Notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        kitchenId VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        isRead TINYINT(1) DEFAULT 0,
        createdAt VARCHAR(100) NOT NULL,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
      );
    `);

    // Stock verifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stock_verifications (
        id VARCHAR(50) PRIMARY KEY,
        kitchenId VARCHAR(50) NOT NULL,
        verifiedAt VARCHAR(100) NOT NULL,
        verifiedBy VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
      );
    `);

    console.log('Database tables created successfully.');
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
    console.log('Seeding database with comprehensive demo data...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

    // =========================================================================
    // 1. KITCHENS
    // =========================================================================
    const kitchens = [
      { id: 'k1', name: 'Dapur Pusat Jakarta', address: 'Grogol, Jakarta Barat', capacity: 5000, city: 'Jakarta', latitude: -6.1668, longitude: 106.7865, maps_url: 'https://www.google.com/maps/place/Grogol,+West+Jakarta+City,+Jakarta/@-6.1668,106.7865,15z' },
      { id: 'k2', name: 'Dapur Satelit Tangerang', address: 'BSD, Tangerang Selatan', capacity: 2500, city: 'Tangerang', latitude: -6.3024, longitude: 106.6522, maps_url: 'https://www.google.com/maps/place/BSD+City/@-6.3024,106.6522,15z' },
      { id: 'k3', name: 'Production Hub Bandung', address: 'Dago, Bandung', capacity: 3000, city: 'Bandung', latitude: -6.8915, longitude: 107.6106, maps_url: 'https://www.google.com/maps/place/Dago,+Bandung+City,+West+Java/@-6.8915,107.6106,15z' },
    ];
    for (const k of kitchens) {
      await connection.query(
        'INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [k.id, k.name, k.address, k.capacity, k.city, k.latitude, k.longitude, k.maps_url]
      );
    }
    console.log(`  ✓ ${kitchens.length} kitchens seeded`);

    // =========================================================================
    // 2. MENUS & INGREDIENTS
    // =========================================================================
    const menus = [
      {
        id: 'menu-1', name: 'Ayam Goreng Gurih',
        ingredients: [
          { name: 'Ayam Negri', perPortion: 0.25, unit: 'kg' },
          { name: 'Minyak Goreng', perPortion: 0.05, unit: 'L' },
          { name: 'Bumbu Kuning', perPortion: 0.02, unit: 'kg' },
        ],
      },
      {
        id: 'menu-2', name: 'Ayam Bakar Madu',
        ingredients: [
          { name: 'Ayam Negri', perPortion: 0.25, unit: 'kg' },
          { name: 'Kecap Manis', perPortion: 0.03, unit: 'L' },
          { name: 'Minyak Goreng', perPortion: 0.01, unit: 'L' },
        ],
      },
      {
        id: 'menu-3', name: 'Ikan Gurame Goreng',
        ingredients: [
          { name: 'Ikan Gurame', perPortion: 0.4, unit: 'kg' },
          { name: 'Minyak Goreng', perPortion: 0.05, unit: 'L' },
          { name: 'Bumbu Ikan', perPortion: 0.02, unit: 'kg' },
        ],
      },
      {
        id: 'menu-4', name: 'Ikan Gurame Bakar',
        ingredients: [
          { name: 'Ikan Gurame', perPortion: 0.4, unit: 'kg' },
          { name: 'Kecap Manis', perPortion: 0.05, unit: 'L' },
          { name: 'Sambal Kecap', perPortion: 0.02, unit: 'kg' },
        ],
      },
      {
        id: 'menu-5', name: 'Bebek Goreng Spesial',
        ingredients: [
          { name: 'Daging Bebek', perPortion: 0.3, unit: 'kg' },
          { name: 'Minyak Goreng', perPortion: 0.06, unit: 'L' },
          { name: 'Bumbu Bebek', perPortion: 0.03, unit: 'kg' },
        ],
      },
      {
        id: 'menu-6', name: 'Bebek Bakar Kecap',
        ingredients: [
          { name: 'Daging Bebek', perPortion: 0.3, unit: 'kg' },
          { name: 'Madu & Kecap', perPortion: 0.04, unit: 'L' },
          { name: 'Bumbu Bakar', perPortion: 0.02, unit: 'kg' },
        ],
      },
    ];
    for (const menu of menus) {
      await connection.query(
        'INSERT INTO menus (id, name) VALUES (?, ?)',
        [menu.id, menu.name]
      );
      for (const ing of menu.ingredients) {
        await connection.query(
          'INSERT INTO ingredients (menuId, name, perPortion, unit) VALUES (?, ?, ?, ?)',
          [menu.id, ing.name, ing.perPortion, ing.unit]
        );
      }
    }
    console.log(`  ✓ ${menus.length} menus with ingredients seeded`);

    // =========================================================================
    // 3. INVENTORY & INVENTORY BATCHES
    // =========================================================================
    const inventory = [
      {
        id: 'mat-1', name: 'Ayam Negri', logistics_sku: 'SKU-AYM-01', base_unit: 'kg', has_packaging: 1, packaging_name: 'Karton', packaging_capacity: 25,
        batches: [
          { id: 'b1', kitchenId: 'k1', container: 'Karton', qty_packed: 6, qty_loose: 0.0, unit: 'karton', weight: '6 karton', expiry: '2025-08-10', package_capacity: 25, package_unit: 'kg' },
          { id: 'b2a', kitchenId: 'k2', container: 'Karton', qty_packed: 8, qty_loose: 0.0, unit: 'karton', weight: '8 karton', expiry: '2025-08-15', package_capacity: 25, package_unit: 'kg' },
          { id: 'b2b', kitchenId: 'k3', container: 'Karton', qty_packed: 5, qty_loose: 0.0, unit: 'karton', weight: '5 karton', expiry: '2025-07-20', package_capacity: 25, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-2', name: 'Minyak Goreng', logistics_sku: 'SKU-MNG-02', base_unit: 'L', has_packaging: 1, packaging_name: 'Jerigen', packaging_capacity: 20,
        batches: [
          { id: 'b3', kitchenId: 'k1', container: 'Jerigen', qty_packed: 5, qty_loose: 0.0, unit: 'jerigen', weight: '5 jerigen', expiry: '2025-12-10', package_capacity: 20, package_unit: 'L' },
          { id: 'b4', kitchenId: 'k2', container: 'Jerigen', qty_packed: 4, qty_loose: 0.0, unit: 'jerigen', weight: '4 jerigen', expiry: '2025-12-15', package_capacity: 20, package_unit: 'L' },
          { id: 'b5', kitchenId: 'k3', container: 'Jerigen', qty_packed: 6, qty_loose: 0.0, unit: 'jerigen', weight: '6 jerigen', expiry: '2025-12-20', package_capacity: 20, package_unit: 'L' },
        ],
      },
      {
        id: 'mat-3', name: 'Bumbu Kuning', logistics_sku: 'SKU-BMK-03', base_unit: 'kg', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b6', kitchenId: 'k1', container: 'Box', qty_packed: 4, qty_loose: 0.0, unit: 'box', weight: '4 box', expiry: '2025-07-01', package_capacity: 10, package_unit: 'kg' },
          { id: 'b6a', kitchenId: 'k3', container: 'Box', qty_packed: 2, qty_loose: 0.0, unit: 'box', weight: '2 box', expiry: '2025-07-10', package_capacity: 10, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-4', name: 'Kecap Manis', logistics_sku: 'SKU-KCP-04', base_unit: 'L', has_packaging: 1, packaging_name: 'Jerigen', packaging_capacity: 5,
        batches: [
          { id: 'b7', kitchenId: 'k1', container: 'Jerigen', qty_packed: 3, qty_loose: 0.0, unit: 'jerigen', weight: '3 jerigen', expiry: '2026-01-01', package_capacity: 5, package_unit: 'L' },
          { id: 'b7_refill', kitchenId: 'k1', container: 'Kemasan Refill', qty_packed: 10, qty_loose: 0.0, unit: 'kemasan refill', weight: '10 kemasan refill', expiry: '2026-01-05', package_capacity: 1, package_unit: 'L' },
          { id: 'b8', kitchenId: 'k2', container: 'Jerigen', qty_packed: 2, qty_loose: 0.0, unit: 'jerigen', weight: '2 jerigen', expiry: '2025-11-20', package_capacity: 20, package_unit: 'L' },
        ],
      },
      {
        id: 'mat-5', name: 'Ikan Gurame', logistics_sku: 'SKU-IKN-05', base_unit: 'kg', has_packaging: 1, packaging_name: 'Karton', packaging_capacity: 25,
        batches: [
          { id: 'b9', kitchenId: 'k2', container: 'Karton', qty_packed: 12, qty_loose: 0.0, unit: 'karton', weight: '12 karton', expiry: '2025-07-15', package_capacity: 25, package_unit: 'kg' },
          { id: 'b9a', kitchenId: 'k3', container: 'Karton', qty_packed: 4, qty_loose: 0.0, unit: 'karton', weight: '4 karton', expiry: '2025-07-25', package_capacity: 25, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-6', name: 'Bumbu Ikan', logistics_sku: 'SKU-BMI-06', base_unit: 'kg', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b10', kitchenId: 'k2', container: 'Box', qty_packed: 3, qty_loose: 0.0, unit: 'box', weight: '3 box', expiry: '2025-08-10', package_capacity: 10, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-7', name: 'Sambal Kecap', logistics_sku: 'SKU-SBC-07', base_unit: 'kg', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b11', kitchenId: 'k2', container: 'Box', qty_packed: 2, qty_loose: 0.0, unit: 'box', weight: '2 box', expiry: '2025-07-30', package_capacity: 10, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-8', name: 'Daging Bebek', logistics_sku: 'SKU-BBK-08', base_unit: 'kg', has_packaging: 1, packaging_name: 'Karton', packaging_capacity: 25,
        batches: [
          { id: 'b12', kitchenId: 'k3', container: 'Karton', qty_packed: 16, qty_loose: 0.0, unit: 'karton', weight: '16 karton', expiry: '2025-07-18', package_capacity: 25, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-9', name: 'Bumbu Bebek', logistics_sku: 'SKU-BMB-09', base_unit: 'kg', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b13', kitchenId: 'k3', container: 'Box', qty_packed: 5, qty_loose: 0.0, unit: 'box', weight: '5 box', expiry: '2025-09-01', package_capacity: 10, package_unit: 'kg' },
        ],
      },
      {
        id: 'mat-10', name: 'Madu & Kecap', logistics_sku: 'SKU-MNK-10', base_unit: 'L', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b14', kitchenId: 'k3', container: 'Box', qty_packed: 4, qty_loose: 0.0, unit: 'box', weight: '4 box', expiry: '2025-10-15', package_capacity: 10, package_unit: 'L' },
        ],
      },
      {
        id: 'mat-11', name: 'Bumbu Bakar', logistics_sku: 'SKU-BBB-11', base_unit: 'kg', has_packaging: 1, packaging_name: 'Box', packaging_capacity: 10,
        batches: [
          { id: 'b15', kitchenId: 'k1', container: 'Box', qty_packed: 2, qty_loose: 0.0, unit: 'box', weight: '2 box', expiry: '2025-08-20', package_capacity: 10, package_unit: 'kg' },
          { id: 'b15a', kitchenId: 'k3', container: 'Box', qty_packed: 3, qty_loose: 0.0, unit: 'box', weight: '3 box', expiry: '2025-08-20', package_capacity: 10, package_unit: 'kg' },
        ],
      },
    ];
    let batchCount = 0;
    for (const item of inventory) {
      await connection.query(
        'INSERT INTO inventory (id, name, logistics_sku, base_unit, has_packaging, packaging_name, packaging_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.id, item.name, item.logistics_sku, item.base_unit, item.has_packaging, item.packaging_name, item.packaging_capacity]
      );
      for (const batch of item.batches) {
        await connection.query(
          'INSERT INTO inventory_batches (id, inventoryId, kitchenId, container, weight, qty_packed, qty_loose, unit, expiry, package_capacity, package_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [batch.id, item.id, batch.kitchenId, batch.container, batch.weight, batch.qty_packed, batch.qty_loose, batch.unit, batch.expiry, batch.package_capacity, batch.package_unit]
        );
        batchCount++;
      }
    }
    console.log(`  ✓ ${inventory.length} inventory items with ${batchCount} batches seeded`);

    // =========================================================================
    // 4. USERS (formerly 'staff', with bcrypt password hashing)
    // =========================================================================
    const usersList = [
      { id: 's1', name: 'Noval Admin', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=noval', kitchenId: 'k1', email: 'novaladiperasetya@gmail.com', password: 'password' },
      { id: 's2', name: 'Andi Jakarta', role: 'Chef', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=andi', kitchenId: 'k1', email: 'chef.jakarta@mbg.com', password: 'password' },
      { id: 's3', name: 'Budi Tangerang', role: 'Chef', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=budi', kitchenId: 'k2', email: 'chef.tangerang@mbg.com', password: 'password' },
      { id: 's4', name: 'Citra Bandung', role: 'Chef', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=citra', kitchenId: 'k3', email: 'chef.bandung@mbg.com', password: 'password' },
      { id: 's5', name: 'Admin MBG', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=admin', kitchenId: 'k1', email: 'admin@mbg.com', password: 'password' },
      { id: 's6', name: 'Chef Utomo', role: 'Chef', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=chefutama', kitchenId: 'k1', email: 'chef@mbg.com', password: 'password' },
      { id: 's_k1_1', name: 'Siti Rahma', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=siti', kitchenId: 'k1', email: 'siti.rahma@mbg.com', password: 'password' },
      { id: 's_k1_2', name: 'Rian Hidayat', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=rian', kitchenId: 'k1', email: 'rian.hidayat@mbg.com', password: 'password' },
      { id: 's_k1_3', name: 'Dedi Kurniawan', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=dedi', kitchenId: 'k1', email: 'dedi.kurniawan@mbg.com', password: 'password' },
      { id: 's_k2_1', name: 'Agus Pratama', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=agus', kitchenId: 'k2', email: 'agus.pratama@mbg.com', password: 'password' },
      { id: 's_k2_2', name: 'Siska Wijaya', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=siska', kitchenId: 'k2', email: 'siska.wijaya@mbg.com', password: 'password' },
      { id: 's_k2_3', name: 'Lina Marlina', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=lina', kitchenId: 'k2', email: 'lina.marlina@mbg.com', password: 'password' },
      { id: 's_k3_1', name: 'Eko Prasetyo', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=eko', kitchenId: 'k3', email: 'eko.prasetyo@mbg.com', password: 'password' },
      { id: 's_k3_2', name: 'Yudi Hermawan', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=yudi', kitchenId: 'k3', email: 'yudi.hermawan@mbg.com', password: 'password' },
      { id: 's_k3_3', name: 'Dewi Lestari', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=dewi', kitchenId: 'k3', email: 'dewi.lestari@mbg.com', password: 'password' },
      { id: 's_test_admin', name: 'Admin Test', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=s_test_admin', kitchenId: null, email: 'admin.test@mbg.com', password: 'password' },
      { id: 's_test_chef', name: 'Head Chef Test', role: 'Head Chef', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=s_test_chef', kitchenId: null, email: 'chef.test@mbg.com', password: 'password' },
      { id: 's_test_staff', name: 'Staff Test', role: 'Staff', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=s_test_staff', kitchenId: null, email: 'staff.test@mbg.com', password: 'password' },
    ];
    for (const user of usersList) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await connection.query(
        'INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.name, user.role, user.status, user.avatar, user.kitchenId, user.email, hashedPassword]
      );
    }
    console.log(`  ✓ ${usersList.length} users seeded (passwords hashed)`);

    // =========================================================================
    // 5. PRODUCTION PLANS & PRODUCTION LOGS
    // =========================================================================
    const productionPlans = [
      { id: 'plan-1', day: 'Senin', menuId: 'menu-1', kitchenId: 'k1', portions: 400, note: 'Gunakan Batch b1', status: 'Ready', userId: 's2' },
      { id: 'plan-2', day: 'Senin', menuId: 'menu-3', kitchenId: 'k2', portions: 200, note: 'Gunakan batch b9', status: 'Cooking', userId: 's3' },
      { id: 'plan-3', day: 'Selasa', menuId: 'menu-2', kitchenId: 'k1', portions: 300, note: '', status: 'Preparing', userId: 's2' },
      { id: 'plan-4', day: 'Selasa', menuId: 'menu-4', kitchenId: 'k2', portions: 150, note: '', status: 'Pending', userId: 's3' },
      { id: 'plan-5', day: 'Rabu', menuId: 'menu-5', kitchenId: 'k3', portions: 350, note: 'Gunakan batch b12', status: 'Pending', userId: 's4' },
      { id: 'plan-6', day: 'Rabu', menuId: 'menu-6', kitchenId: 'k3', portions: 200, note: '', status: 'Pending', userId: 's4' },
      { id: 'plan-7', day: 'Kamis', menuId: 'menu-1', kitchenId: 'k2', portions: 250, note: 'Batch b2a', status: 'Pending', userId: 's3' },
      { id: 'plan-8', day: 'Kamis', menuId: 'menu-5', kitchenId: 'k1', portions: 180, note: '', status: 'Pending', userId: 's6' },
      { id: 'plan-9', day: 'Jumat', menuId: 'menu-3', kitchenId: 'k3', portions: 300, note: 'Batch b9a', status: 'Pending', userId: 's4' },
      { id: 'plan-10', day: 'Jumat', menuId: 'menu-2', kitchenId: 'k2', portions: 220, note: '', status: 'Pending', userId: 's3' },
    ];
    for (const plan of productionPlans) {
      await connection.query(
        'INSERT INTO production_plans (id, day, menuId, kitchenId, portions, note, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [plan.id, plan.day, plan.menuId, plan.kitchenId, plan.portions, plan.note, plan.status, plan.userId]
      );

      // Create matching production log
      const logStatus = plan.status === 'NotStarted' ? 'Pending' : plan.status;
      let startTime = null;
      let endTime = null;
      if (plan.status === 'Cooking') {
        startTime = new Date().toISOString();
      } else if (plan.status === 'Ready') {
        startTime = new Date(Date.now() - 86400000).toISOString();
        endTime = new Date(Date.now() - 82800000).toISOString(); // ~1 hour after start
      }

      await connection.query(
        'INSERT INTO production_logs (id, kitchenId, menuId, servings, startTime, endTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [plan.id, plan.kitchenId, plan.menuId, plan.portions, startTime, endTime, plan.note, logStatus]
      );
    }
    console.log(`  ✓ ${productionPlans.length} production plans & logs seeded`);

    // =========================================================================
    // 6. STOCK REQUESTS
    // =========================================================================
    const now = new Date();
    const stockRequests = [
      { id: 'sr-1', material: 'Ayam Negri', amount: '10 karton', urgency: 'High', status: 'Approved', createdAt: new Date(now - 86400000 * 5).toISOString(), kitchenId: 'k1', supplierKitchenId: null, note: 'Disetujui, kirim besok pagi' },
      { id: 'sr-2', material: 'Minyak Goreng', amount: '5 jerigen', urgency: 'Medium', status: 'Pending', createdAt: new Date(now - 86400000 * 3).toISOString(), kitchenId: 'k2', supplierKitchenId: null, note: null },
      { id: 'sr-3', material: 'Ikan Gurame', amount: '8 karton', urgency: 'High', status: 'Pending', createdAt: new Date(now - 86400000 * 2).toISOString(), kitchenId: 'k2', supplierKitchenId: null, note: null },
      { id: 'sr-4', material: 'Bumbu Kuning', amount: '3 box', urgency: 'Low', status: 'Approved', createdAt: new Date(now - 86400000 * 7).toISOString(), kitchenId: 'k1', supplierKitchenId: 'k3', note: 'Transfer antar dapur disetujui' },
      { id: 'sr-5', material: 'Daging Bebek', amount: '12 karton', urgency: 'High', status: 'Rejected', createdAt: new Date(now - 86400000 * 4).toISOString(), kitchenId: 'k3', supplierKitchenId: null, note: 'Supplier belum tersedia, coba minggu depan' },
      { id: 'sr-6', material: 'Kecap Manis', amount: '4 jerigen', urgency: 'Medium', status: 'Pending', createdAt: new Date(now - 86400000 * 1).toISOString(), kitchenId: 'k1', supplierKitchenId: null, note: null },
      { id: 'sr-7', material: 'Bumbu Bebek', amount: '2 box', urgency: 'Low', status: 'Approved', createdAt: new Date(now - 86400000 * 6).toISOString(), kitchenId: 'k3', supplierKitchenId: 'k1', note: 'Kirim dari Jakarta' },
      { id: 'sr-8', material: 'Sambal Kecap', amount: '1 box', urgency: 'Medium', status: 'Pending', createdAt: new Date(now - 86400000 * 1).toISOString(), kitchenId: 'k2', supplierKitchenId: null, note: null },
    ];
    for (const sr of stockRequests) {
      await connection.query(
        'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [sr.id, sr.material, sr.amount, sr.urgency, sr.status, sr.createdAt, sr.kitchenId, sr.supplierKitchenId, sr.note]
      );
    }
    console.log(`  ✓ ${stockRequests.length} stock requests seeded`);

    // =========================================================================
    // 7. WASTAGE RECORDS
    // =========================================================================
    const wastageRecords = [
      { id: 'W-1001', kitchenId: 'k1', inventoryId: 'mat-1', weight: 2.5, unit: 'kg', reason: 'Kadaluarsa', cost: 87500, date: '2025-06-01' },
      { id: 'W-1002', kitchenId: 'k1', inventoryId: 'mat-2', weight: 1.0, unit: 'L', reason: 'Tumpah', cost: 35000, date: '2025-06-02' },
      { id: 'W-1003', kitchenId: 'k2', inventoryId: 'mat-5', weight: 3.2, unit: 'kg', reason: 'Busuk', cost: 112000, date: '2025-06-01' },
      { id: 'W-1004', kitchenId: 'k2', inventoryId: 'mat-6', weight: 0.5, unit: 'kg', reason: 'Kadaluarsa', cost: 17500, date: '2025-06-03' },
      { id: 'W-1005', kitchenId: 'k3', inventoryId: 'mat-8', weight: 4.0, unit: 'kg', reason: 'Freezer Rusak', cost: 140000, date: '2025-05-28' },
      { id: 'W-1006', kitchenId: 'k3', inventoryId: 'mat-9', weight: 1.0, unit: 'kg', reason: 'Packaging Rusak', cost: 35000, date: '2025-05-30' },
      { id: 'W-1007', kitchenId: 'k1', inventoryId: 'mat-3', weight: 0.8, unit: 'kg', reason: 'Kadaluarsa', cost: 28000, date: '2025-06-04' },
      { id: 'W-1008', kitchenId: 'k2', inventoryId: 'mat-4', weight: 1.5, unit: 'L', reason: 'Tumpah', cost: 52500, date: '2025-06-05' },
      { id: 'W-1009', kitchenId: 'k3', inventoryId: 'mat-10', weight: 0.5, unit: 'L', reason: 'Kadaluarsa', cost: 17500, date: '2025-06-03' },
      { id: 'W-1010', kitchenId: 'k1', inventoryId: 'mat-1', weight: 1.8, unit: 'kg', reason: 'Sisa Produksi', cost: 63000, date: '2025-06-06' },
    ];
    for (const w of wastageRecords) {
      await connection.query(
        'INSERT INTO wastage_records (id, kitchenId, inventoryId, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [w.id, w.kitchenId, w.inventoryId, w.weight, w.unit, w.reason, w.cost, w.date]
      );
    }
    console.log(`  ✓ ${wastageRecords.length} wastage records seeded`);

    // =========================================================================
    // 8. NOTIFICATIONS
    // =========================================================================
    const notifications = [
      { id: 'ntf-1', kitchenId: 'k1', message: 'Dapur Pusat Jakarta memiliki sisa stok Ayam Negri yang kritis. Harap perhatikan!', isRead: 0, createdAt: new Date().toISOString() },
      { id: 'ntf-2', kitchenId: 'k2', message: 'Peringatan: Rencana produksi Ikan Gurame Bakar (150 porsi) pada hari Selasa kekurangan bahan: Ikan Gurame (kurang 40.0 kg).', isRead: 0, createdAt: new Date().toISOString() },
      { id: 'ntf-3', kitchenId: 'k3', message: 'Peringatan: Rencana produksi Bebek Goreng Spesial (350 porsi) pada hari Rabu kekurangan bahan: Daging Bebek (kurang 105.0 kg).', isRead: 0, createdAt: new Date().toISOString() }
    ];
    for (const n of notifications) {
      await connection.query(
        'INSERT INTO notifications (id, kitchenId, message, isRead, createdAt) VALUES (?, ?, ?, ?, ?)',
        [n.id, n.kitchenId, n.message, n.isRead, n.createdAt]
      );
    }
    console.log(`  ✓ ${notifications.length} notifications seeded`);

    // =========================================================================
    // 9. STOCK VERIFICATIONS
    // =========================================================================
    const stockVerifications = [
      {
        id: 'v-1001',
        kitchenId: 'k1',
        verifiedAt: new Date(Date.now() - 86400000).toISOString(),
        verifiedBy: 'Chef Andi Jakarta',
        details: JSON.stringify([
          { batchId: 'b1', qty_packed: 5, qty_loose: 12.5 },
          { batchId: 'b3', qty_packed: 4, qty_loose: 8.0 }
        ])
      },
      {
        id: 'v-1002',
        kitchenId: 'k2',
        verifiedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        verifiedBy: 'Chef Budi Tangerang',
        details: JSON.stringify([
          { batchId: 'b2a', qty_packed: 7, qty_loose: 5.0 },
          { batchId: 'b4', qty_packed: 3, qty_loose: 15.0 },
          { batchId: 'b9', qty_packed: 10, qty_loose: 2.0 }
        ])
      },
      {
        id: 'v-1003',
        kitchenId: 'k2',
        verifiedAt: new Date().toISOString(), // Verified today
        verifiedBy: 'Chef Budi Tangerang',
        details: JSON.stringify([
          { batchId: 'b2a', qty_packed: 7, qty_loose: 5.0 },
          { batchId: 'b4', qty_packed: 3, qty_loose: 15.0 }
        ])
      }
    ];
    for (const sv of stockVerifications) {
      await connection.query(
        'INSERT INTO stock_verifications (id, kitchenId, verifiedAt, verifiedBy, details) VALUES (?, ?, ?, ?, ?)',
        [sv.id, sv.kitchenId, sv.verifiedAt, sv.verifiedBy, sv.details]
      );
    }
    console.log(`  ✓ ${stockVerifications.length} stock verifications seeded`);

    // =========================================================================
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database seeded successfully with comprehensive demo data!');
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
