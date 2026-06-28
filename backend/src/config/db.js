const bcrypt = require('bcryptjs');

let currentDb = null;

const initDb = (d1Database) => {
  currentDb = d1Database;
};

const query = async (sql, params = []) => {
  if (!currentDb) {
    throw new Error("Database connection not initialized. Check if initDb was called.");
  }

  // Normalize parameters to an array
  const formattedParams = Array.isArray(params) ? params : (params !== undefined ? [params] : []);

  // Check if it's a select query
  const isSelect = sql.trim().toLowerCase().startsWith('select');

  try {
    if (isSelect) {
      const res = await currentDb.prepare(sql).bind(...formattedParams).all();
      return [res.results || [], null];
    } else {
      const res = await currentDb.prepare(sql).bind(...formattedParams).run();
      return [res, null];
    }
  } catch (error) {
    console.error("Database query execution error:", error, "SQL:", sql, "Params:", formattedParams);
    throw error;
  }
};

async function initializeDatabase() {
  if (!currentDb) return;

  try {
    // 1. Create tables if they do not exist
    await createTables();

    // 2. Check if database is already seeded (by checking users count)
    const { results } = await currentDb.prepare('SELECT COUNT(*) as count FROM users').all();
    const count = results[0]?.count || 0;

    if (count === 0) {
      console.log('Database is empty. Seeding comprehensive demo data...');
      await seedDatabase();
    } else {
      console.log('Database already initialized. Checking for missing driver accounts...');
      const { results: driverResults } = await currentDb.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'Driver'").all();
      const driverCount = driverResults[0]?.count || 0;
      if (driverCount === 0) {
        console.log('Driver accounts are missing. Seeding drivers...');
        await seedDriversOnly();
      } else {
        console.log('Driver accounts already exist. Skipping driver seeding.');
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

async function createTables() {
  // SQLite doesn't require foreign key checks to be disabled for table creation, 
  // but we enforce standard CREATE TABLE scripts.
  
  // Kitchens table
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS kitchens (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      capacity INTEGER,
      city TEXT,
      latitude REAL NULL,
      longitude REAL NULL,
      maps_url TEXT NULL
    );
  `).run();

  // Menus table
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS menus (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `).run();

  // Ingredients table
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menuId TEXT NOT NULL,
      name TEXT NOT NULL,
      perPortion REAL NOT NULL,
      unit TEXT NOT NULL,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
    );
  `).run();

  // Inventory items
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      logistics_sku TEXT NULL,
      base_unit TEXT NOT NULL DEFAULT 'kg',
      has_packaging INTEGER DEFAULT 0,
      packaging_name TEXT NULL,
      packaging_capacity REAL NULL
    );
  `).run();

  // Inventory batches
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS inventory_batches (
      id TEXT PRIMARY KEY,
      inventoryId TEXT NOT NULL,
      kitchenId TEXT NOT NULL,
      container TEXT,
      weight TEXT NOT NULL,
      qty_packed INTEGER NOT NULL DEFAULT 0,
      qty_loose REAL NOT NULL DEFAULT 0.0000,
      unit TEXT NOT NULL DEFAULT 'kg',
      package_capacity REAL NULL,
      package_unit TEXT NULL,
      expiry TEXT NOT NULL,
      FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();

  // Users table
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      avatar TEXT,
      kitchenId TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL DEFAULT 'password',
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
    );
  `).run();

  // Production plans
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS production_plans (
      id TEXT PRIMARY KEY,
      day TEXT NOT NULL,
      menuId TEXT NOT NULL,
      kitchenId TEXT NOT NULL,
      portions INTEGER NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      userId TEXT,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    );
  `).run();

  // Production logs
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS production_logs (
      id TEXT PRIMARY KEY,
      kitchenId TEXT,
      menuId TEXT NOT NULL,
      servings INTEGER NOT NULL,
      startTime TEXT,
      endTime TEXT,
      qaNotes TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
      FOREIGN KEY (menuId) REFERENCES menus(id) ON DELETE CASCADE
    );
  `).run();

  // Stock requests
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS stock_requests (
      id TEXT PRIMARY KEY,
      material TEXT NOT NULL,
      amount TEXT NOT NULL,
      urgency TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      createdAt TEXT NOT NULL,
      kitchenId TEXT NULL,
      supplierKitchenId TEXT NULL,
      note TEXT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE SET NULL,
      FOREIGN KEY (supplierKitchenId) REFERENCES kitchens(id) ON DELETE SET NULL
    );
  `).run();

  // Wastage records
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS wastage_records (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      inventoryId TEXT NOT NULL,
      weight REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'kg',
      reason TEXT NOT NULL,
      cost INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE,
      FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE
    );
  `).run();

  // Notifications
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();

  // Stock verifications
  await currentDb.prepare(`
    CREATE TABLE IF NOT EXISTS stock_verifications (
      id TEXT PRIMARY KEY,
      kitchenId TEXT NOT NULL,
      verifiedAt TEXT NOT NULL,
      verifiedBy TEXT NOT NULL,
      details TEXT NOT NULL,
      FOREIGN KEY (kitchenId) REFERENCES kitchens(id) ON DELETE CASCADE
    );
  `).run();

  console.log('SQLite tables initialized successfully.');
}

async function seedDatabase() {
  try {
    // 1. Kitchens
    const kitchens = [
      { id: 'k1', name: 'Dapur Pusat Jakarta', address: 'Grogol, Jakarta Barat', capacity: 5000, city: 'Jakarta', latitude: -6.1668, longitude: 106.7865, maps_url: 'https://www.google.com/maps/place/Grogol,+West+Jakarta+City,+Jakarta/@-6.1668,106.7865,15z' },
      { id: 'k2', name: 'Dapur Satelit Tangerang', address: 'BSD, Tangerang Selatan', capacity: 2500, city: 'Tangerang', latitude: -6.3024, longitude: 106.6522, maps_url: 'https://www.google.com/maps/place/BSD+City/@-6.3024,106.6522,15z' },
      { id: 'k3', name: 'Production Hub Bandung', address: 'Dago, Bandung', capacity: 3000, city: 'Bandung', latitude: -6.8915, longitude: 107.6106, maps_url: 'https://www.google.com/maps/place/Dago,+Bandung+City,+West+Java/@-6.8915,107.6106,15z' },
    ];
    for (const k of kitchens) {
      await currentDb.prepare(
        'INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(k.id, k.name, k.address, k.capacity, k.city, k.latitude, k.longitude, k.maps_url).run();
    }

    // 2. Menus & Ingredients
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
      await currentDb.prepare('INSERT INTO menus (id, name) VALUES (?, ?)').bind(menu.id, menu.name).run();
      for (const ing of menu.ingredients) {
        await currentDb.prepare(
          'INSERT INTO ingredients (menuId, name, perPortion, unit) VALUES (?, ?, ?, ?)'
        ).bind(menu.id, ing.name, ing.perPortion, ing.unit).run();
      }
    }

    // 3. Inventory & Batches
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
    for (const item of inventory) {
      await currentDb.prepare(
        'INSERT INTO inventory (id, name, logistics_sku, base_unit, has_packaging, packaging_name, packaging_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(item.id, item.name, item.logistics_sku, item.base_unit, item.has_packaging, item.packaging_name, item.packaging_capacity).run();
      for (const batch of item.batches) {
        await currentDb.prepare(
          'INSERT INTO inventory_batches (id, inventoryId, kitchenId, container, weight, qty_packed, qty_loose, unit, expiry, package_capacity, package_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(batch.id, item.id, batch.kitchenId, batch.container, batch.weight, batch.qty_packed, batch.qty_loose, batch.unit, batch.expiry, batch.package_capacity, batch.package_unit).run();
      }
    }

    // 4. Users
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
      { id: 'd_k1_1', name: 'Driver Jakarta', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_jakarta', kitchenId: 'k1', email: 'driver.jakarta@mbg.com', password: 'password' },
      { id: 'd_k2_1', name: 'Driver Tangerang', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_tangerang', kitchenId: 'k2', email: 'driver.tangerang@mbg.com', password: 'password' },
      { id: 'd_k3_1', name: 'Driver Bandung', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_bandung', kitchenId: 'k3', email: 'driver.bandung@mbg.com', password: 'password' },
    ];
    for (const user of usersList) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await currentDb.prepare(
        'INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(user.id, user.name, user.role, user.status, user.avatar, user.kitchenId, user.email, hashedPassword).run();
    }

    // 5. Production Plans & Logs
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
      await currentDb.prepare(
        'INSERT INTO production_plans (id, day, menuId, kitchenId, portions, note, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(plan.id, plan.day, plan.menuId, plan.kitchenId, plan.portions, plan.note, plan.status, plan.userId).run();

      const logStatus = plan.status === 'NotStarted' ? 'Pending' : plan.status;
      let startTime = null;
      let endTime = null;
      if (plan.status === 'Cooking') {
        startTime = new Date().toISOString();
      } else if (plan.status === 'Ready') {
        startTime = new Date(Date.now() - 86400000).toISOString();
        endTime = new Date(Date.now() - 82800000).toISOString();
      }

      await currentDb.prepare(
        'INSERT INTO production_logs (id, kitchenId, menuId, servings, startTime, endTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(plan.id, plan.kitchenId, plan.menuId, plan.portions, startTime, endTime, plan.note, logStatus).run();
    }

    // 6. Stock Requests
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
      await currentDb.prepare(
        'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(sr.id, sr.material, sr.amount, sr.urgency, sr.status, sr.createdAt, sr.kitchenId, sr.supplierKitchenId, sr.note).run();
    }

    // 7. Wastage Records
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
      await currentDb.prepare(
        'INSERT INTO wastage_records (id, kitchenId, inventoryId, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(w.id, w.kitchenId, w.inventoryId, w.weight, w.unit, w.reason, w.cost, w.date).run();
    }

    // 8. Notifications
    const notifications = [
      { id: 'ntf-1', kitchenId: 'k1', message: 'Dapur Pusat Jakarta memiliki sisa stok Ayam Negri yang kritis. Harap perhatikan!', isRead: 0, createdAt: new Date().toISOString() },
      { id: 'ntf-2', kitchenId: 'k2', message: 'Peringatan: Rencana produksi Ikan Gurame Bakar (150 porsi) pada hari Selasa kekurangan bahan: Ikan Gurame (kurang 40.0 kg).', isRead: 0, createdAt: new Date().toISOString() },
      { id: 'ntf-3', kitchenId: 'k3', message: 'Peringatan: Rencana produksi Bebek Goreng Spesial (350 porsi) pada hari Rabu kekurangan bahan: Daging Bebek (kurang 105.0 kg).', isRead: 0, createdAt: new Date().toISOString() }
    ];
    for (const n of notifications) {
      await currentDb.prepare(
        'INSERT INTO notifications (id, kitchenId, message, isRead, createdAt) VALUES (?, ?, ?, ?, ?)'
      ).bind(n.id, n.kitchenId, n.message, n.isRead, n.createdAt).run();
    }

    // 9. Stock Verifications
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
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Chef Budi Tangerang',
        details: JSON.stringify([
          { batchId: 'b2a', qty_packed: 7, qty_loose: 5.0 },
          { batchId: 'b4', qty_packed: 3, qty_loose: 15.0 }
        ])
      }
    ];
    for (const sv of stockVerifications) {
      await currentDb.prepare(
        'INSERT INTO stock_verifications (id, kitchenId, verifiedAt, verifiedBy, details) VALUES (?, ?, ?, ?, ?)'
      ).bind(sv.id, sv.kitchenId, sv.verifiedAt, sv.verifiedBy, sv.details).run();
    }

    console.log('SQLite database seeded successfully.');
  } catch (error) {
    console.error('Error seeding SQLite database:', error);
    throw error;
  }
}

async function seedDriversOnly() {
  try {
    const drivers = [
      { id: 'd_k1_1', name: 'Driver Jakarta', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_jakarta', kitchenId: 'k1', email: 'driver.jakarta@mbg.com', password: 'password' },
      { id: 'd_k2_1', name: 'Driver Tangerang', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_tangerang', kitchenId: 'k2', email: 'driver.tangerang@mbg.com', password: 'password' },
      { id: 'd_k3_1', name: 'Driver Bandung', role: 'Driver', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=driver_bandung', kitchenId: 'k3', email: 'driver.bandung@mbg.com', password: 'password' }
    ];
    for (const user of drivers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await currentDb.prepare(
        'INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(user.id, user.name, user.role, user.status, user.avatar, user.kitchenId, user.email, hashedPassword).run();
    }
    console.log('Driver accounts seeded successfully.');
  } catch (error) {
    console.error('Error seeding driver accounts:', error);
    throw error;
  }
}

const mockConnection = {
  beginTransaction: async () => {},
  commit: async () => {},
  rollback: async () => {},
  release: () => {},
  query: (sql, params) => query(sql, params),
};

const mockPool = {
  getConnection: async () => mockConnection,
};

module.exports = {
  initDb,
  query,
  initializeDatabase,
  pool: mockPool
};
