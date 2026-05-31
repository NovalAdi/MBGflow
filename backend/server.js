const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper delay to mimic micro-delay network latency
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Unit Conversion Helper
function convertUnit(value, fromUnit, toUnit, package_capacity, package_unit) {
  const val = Number(value) || 0;
  const f = (fromUnit || '').toLowerCase().trim();
  const t = (toUnit || '').toLowerCase().trim();
  if (f === t) return val;
  
  // Standard metric scale conversions
  if (f === 'kg' && t === 'g') return val * 1000;
  if (f === 'g' && t === 'kg') return val / 1000;
  if (f === 'l' && t === 'ml') return val * 1000;
  if (f === 'ml' && t === 'l') return val / 1000;
  
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim().toLowerCase();
  
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const isFromPkg = (f !== 'kg' && f !== 'g' && f !== 'l' && f !== 'ml');
    const isToPkg = (t !== 'kg' && t !== 'g' && t !== 'l' && t !== 'ml');
    
    if (isFromPkg && !isToPkg) {
      // package type -> standard unit (e.g. jerigen -> L)
      const valInStandardPkgUnit = val * cap;
      return convertUnit(valInStandardPkgUnit, pkgU, t);
    }
    if (!isFromPkg && isToPkg) {
      // standard unit -> package type (e.g. L -> jerigen)
      const valInStandardPkgUnit = convertUnit(val, f, pkgU);
      return valInStandardPkgUnit / cap;
    }
  }
  
  return val;
}

// Single Batch Formatter
function formatSingleBatch(weight_value, unit, package_capacity, package_unit) {
  const val = Number(weight_value) || 0;
  const u = (unit || 'kg').trim();
  
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim();
  
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const totalCapVal = val * cap;
    let capStr = "";
    const pkgULower = pkgU.toLowerCase();
    if (pkgULower === 'kg' && totalCapVal < 1 && totalCapVal > 0) {
      capStr = `${Math.round(totalCapVal * 1000)} g`;
    } else if (pkgULower === 'l' && totalCapVal < 1 && totalCapVal > 0) {
      capStr = `${Math.round(totalCapVal * 1000)} ml`;
    } else {
      capStr = `${parseFloat(totalCapVal.toFixed(2))} ${pkgU}`;
    }
    return `${parseFloat(val.toFixed(2))} ${u} (Total: ${capStr})`;
  }

  const uLower = u.toLowerCase();
  if (val === 0) {
    return `0 ${u}`;
  }
  if (uLower === 'kg' && val < 1) {
    return `${Math.round(val * 1000)} g`;
  }
  if (uLower === 'l' && val < 1) {
    return `${Math.round(val * 1000)} ml`;
  }
  
  const rounded = parseFloat(val.toFixed(2));
  return `${rounded} ${u}`;
}

// Display Unit Determiner
function getDisplayUnit(weight_value, unit, package_capacity, package_unit) {
  const val = Number(weight_value) || 0;
  const u = (unit || 'kg').trim();
  
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim();
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const pkgULower = pkgU.toLowerCase();
    const totalVal = val * cap;
    if (pkgULower === 'kg' && totalVal < 1 && totalVal > 0) return 'g';
    if (pkgULower === 'l' && totalVal < 1 && totalVal > 0) return 'ml';
    return pkgU;
  }
  
  const uLower = u.toLowerCase();
  if (uLower === 'kg' && val < 1 && val > 0) return 'g';
  if (uLower === 'l' && val < 1 && val > 0) return 'ml';
  return u;
}

// Multi-batch Stock Aggregator
function aggregateStock(itemBatches) {
  if (!itemBatches || itemBatches.length === 0) {
    return { totalWeight: "0 kg", volume: 0 };
  }
  
  let weightSumKg = 0;
  let volumeSumL = 0;
  
  let hasWeights = false;
  let hasVolumes = false;
  
  for (const b of itemBatches) {
    const val = Number(b.weight_value) || 0;
    const u = (b.unit || 'kg').trim();
    const uLower = u.toLowerCase();
    
    const cap = Number(b.package_capacity);
    const pkgUnit = (b.package_unit || '').trim().toLowerCase();
    
    if (!isNaN(cap) && cap > 0 && pkgUnit) {
      const totalPkgVal = val * cap;
      if (pkgUnit === 'kg' || pkgUnit === 'g') {
        hasWeights = true;
        weightSumKg += pkgUnit === 'g' ? totalPkgVal / 1000 : totalPkgVal;
      } else if (pkgUnit === 'l' || pkgUnit === 'ml') {
        hasVolumes = true;
        volumeSumL += pkgUnit === 'ml' ? totalPkgVal / 1000 : totalPkgVal;
      }
    } else {
      if (uLower === 'kg' || uLower === 'g') {
        hasWeights = true;
        weightSumKg += uLower === 'g' ? val / 1000 : val;
      } else if (uLower === 'l' || uLower === 'ml') {
        hasVolumes = true;
        volumeSumL += uLower === 'ml' ? val / 1000 : val;
      } else {
        hasWeights = true;
        weightSumKg += val;
      }
    }
  }
  
  const parts = [];
  let progressVal = 0;
  
  if (hasWeights) {
    if (weightSumKg < 1 && weightSumKg > 0) {
      parts.push(`${Math.round(weightSumKg * 1000)} g`);
    } else {
      parts.push(`${parseFloat(weightSumKg.toFixed(2))} kg`);
    }
    progressVal += weightSumKg;
  }
  
  if (hasVolumes) {
    if (volumeSumL < 1 && volumeSumL > 0) {
      parts.push(`${Math.round(volumeSumL * 1000)} ml`);
    } else {
      parts.push(`${parseFloat(volumeSumL.toFixed(2))} L`);
    }
    progressVal += volumeSumL;
  }
  
  const totalWeight = parts.join(" - ") || "0 kg";
  const volume = Math.min((progressVal / 500) * 100, 100);
  
  return { totalWeight, volume };
}

// 1. POST /api/login
app.post('/api/login', async (req, res) => {
  await delay(150);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM staff WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Kredensial tidak valid: email tidak terdaftar.' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Kata sandi salah. Silakan coba lagi.' });
    }

    const allowedRoles = ['Admin', 'Chef', 'Head Chef'];
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Akses ditolak. Staf dapur dan Perwakilan sekolah tidak diizinkan mengakses website ini.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

// 2. GET /api/stats
app.get('/api/stats', async (req, res) => {
  await delay(50);
  try {
    const [kitchenCount] = await db.query('SELECT COUNT(*) as count FROM kitchens');
    const [successfulServings] = await db.query("SELECT SUM(servings) as count FROM production_logs WHERE status = 'Ready'");
    const [currentlyCooking] = await db.query("SELECT COUNT(*) as count FROM production_logs WHERE status = 'Cooking'");
    const [totalActivities] = await db.query('SELECT COUNT(*) as count FROM production_logs');
    const [chefsOnDuty] = await db.query("SELECT COUNT(*) as count FROM staff WHERE role = 'Chef'");

    res.json({
      activeKitchens: kitchenCount[0].count,
      successfulServings: parseInt(successfulServings[0].count || 0),
      currentlyCooking: currentlyCooking[0].count,
      totalDailyActivities: totalActivities[0].count,
      chefsOnDuty: chefsOnDuty[0].count
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error fetching statistics.' });
  }
});

// 3. GET /api/activity
app.get('/api/activity', async (req, res) => {
  await delay(50);
  const { kitchenId } = req.query;
  try {
    let rows;
    if (kitchenId) {
      [rows] = await db.query('SELECT * FROM production_logs WHERE kitchenId = ?', [kitchenId]);
    } else {
      [rows] = await db.query('SELECT * FROM production_logs');
    }
    res.json(rows);
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({ error: 'Server error fetching activity logs.' });
  }
});

// 4. GET /api/production-plans
app.get('/api/production-plans', async (req, res) => {
  await delay(50);
  const { kitchenId } = req.query;
  try {
    let rows;
    if (kitchenId) {
      [rows] = await db.query('SELECT * FROM production_plans WHERE kitchenId = ?', [kitchenId]);
    } else {
      [rows] = await db.query('SELECT * FROM production_plans');
    }
    res.json(rows);
  } catch (error) {
    console.error('Production plans error:', error);
    res.status(500).json({ error: 'Server error fetching plans.' });
  }
});

// 4a. POST /api/production-plans (Transactional insert to both plans and logs)
app.post('/api/production-plans', async (req, res) => {
  await delay(100);
  const { id, day, menu, kitchenId, portions, note } = req.body;
  if (!day || !menu || !kitchenId || !portions) {
    return res.status(400).json({ error: 'Data rencana produksi tidak lengkap.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get kitchen details
    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    if (kitchens.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Kitchen tidak ditemukan.' });
    }
    const kitchen = kitchens[0];

    // 2. Get menu details
    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [menu.toLowerCase()]);
    if (menus.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }
    const menuData = menus[0];

    // 3. Find a chef assigned to this kitchen
    const [chefs] = await connection.query("SELECT name FROM staff WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [kitchenId]);
    const chefName = chefs.length > 0 ? chefs[0].name : '';

    const planId = id || `p${Date.now()}`;

    // 4. Insert into production_plans
    await connection.query(
      'INSERT INTO production_plans (id, day, menuId, menuName, kitchenId, kitchenName, portions, note, status, chefPenanggungJawab) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [planId, day, menuData.id, menuData.name, kitchen.id, kitchen.name, Number(portions), note || '', 'Pending', chefName]
    );

    // 5. Insert into production_logs
    await connection.query(
      'INSERT INTO production_logs (id, kitchenId, kitchen, menu, servings, city, startTime, qaNotes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [planId, kitchen.id, kitchen.name, menuData.name, Number(portions), kitchen.city || 'Jakarta', new Date().toISOString(), note || '', 'Pending']
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      id: planId,
      day,
      menuId: menuData.id,
      menuName: menuData.name,
      kitchenId: kitchen.id,
      kitchenName: kitchen.name,
      portions: Number(portions),
      note: note || '',
      status: 'Pending',
      chefPenanggungJawab: chefName
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Server error creating production plan.' });
  }
});

// 4b. PUT /api/production-plans/:id (Transactional update to both plans and logs)
app.put('/api/production-plans/:id', async (req, res) => {
  await delay(100);
  const { id } = req.params;
  const { day, menu, kitchenId, portions, note } = req.body;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch the existing plan
    const [existing] = await connection.query('SELECT * FROM production_plans WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Rencana produksi tidak ditemukan.' });
    }
    const current = existing[0];

    const mergedDay = day !== undefined ? day : current.day;
    const mergedPortions = portions !== undefined ? Number(portions) : current.portions;
    const mergedNote = note !== undefined ? note : current.note;
    const mergedKitchenId = kitchenId !== undefined ? kitchenId : current.kitchenId;
    const mergedMenuName = menu !== undefined ? menu : current.menuName;

    // 2. Fetch kitchen details
    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [mergedKitchenId]);
    if (kitchens.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Kitchen tidak ditemukan.' });
    }
    const kitchen = kitchens[0];

    // 3. Fetch menu details
    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [mergedMenuName.toLowerCase()]);
    if (menus.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }
    const menuData = menus[0];

    // 4. Update chefPenanggungJawab if kitchen changed
    let chefName = current.chefPenanggungJawab;
    if (mergedKitchenId !== current.kitchenId) {
      const [chefs] = await connection.query("SELECT name FROM staff WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [mergedKitchenId]);
      chefName = chefs.length > 0 ? chefs[0].name : '';
    }

    // 5. Update production_plans
    await connection.query(
      'UPDATE production_plans SET day = ?, menuId = ?, menuName = ?, kitchenId = ?, kitchenName = ?, portions = ?, note = ?, chefPenanggungJawab = ? WHERE id = ?',
      [mergedDay, menuData.id, menuData.name, kitchen.id, kitchen.name, mergedPortions, mergedNote || '', chefName, id]
    );

    // 6. Update production_logs
    await connection.query(
      'UPDATE production_logs SET kitchenId = ?, kitchen = ?, menu = ?, servings = ?, city = ?, qaNotes = ? WHERE id = ?',
      [kitchen.id, kitchen.name, menuData.name, mergedPortions, kitchen.city || 'Jakarta', mergedNote || '', id]
    );

    await connection.commit();
    connection.release();

    res.json({
      id,
      day: mergedDay,
      menuId: menuData.id,
      menuName: menuData.name,
      kitchenId: kitchen.id,
      kitchenName: kitchen.name,
      portions: mergedPortions,
      note: mergedNote || '',
      status: current.status,
      chefPenanggungJawab: chefName
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Server error updating production plan.' });
  }
});

// 4c. DELETE /api/production-plans/:id (Transactional delete from both plans and logs)
app.delete('/api/production-plans/:id', async (req, res) => {
  await delay(100);
  const { id } = req.params;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check if it exists
    const [existing] = await connection.query('SELECT * FROM production_plans WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Rencana produksi tidak ditemukan.' });
    }

    // 2. Delete from both tables
    await connection.query('DELETE FROM production_plans WHERE id = ?', [id]);
    await connection.query('DELETE FROM production_logs WHERE id = ?', [id]);

    await connection.commit();
    connection.release();

    res.json(existing[0]);
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Server error deleting production plan.' });
  }
});

// 5. GET /api/kitchens
app.get('/api/kitchens', async (req, res) => {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT * FROM kitchens');
    res.json(rows);
  } catch (error) {
    console.error('Kitchens list error:', error);
    res.status(500).json({ error: 'Server error fetching kitchens list.' });
  }
});

// 6. GET /api/inventory
app.get('/api/inventory', async (req, res) => {
  await delay(50);
  try {
    // Select all inventory items
    const [items] = await db.query('SELECT * FROM inventory');
    const [batches] = await db.query('SELECT * FROM inventory_batches');

    const formattedInventory = items.map(item => {
      const itemBatches = batches.filter(b => b.inventoryId === item.id).map(b => {
        const formattedWeight = formatSingleBatch(b.weight_value, b.unit, b.package_capacity, b.package_unit);
        return {
          id: b.id,
          kitchenId: b.kitchenId,
          container: b.container,
          weight_value: Number(b.weight_value),
          unit: b.unit,
          weight: formattedWeight,
          package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
          package_unit: b.package_unit,
          expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : ''
        };
      });
      return {
        id: item.id,
        name: item.name,
        batches: itemBatches
      };
    });

    res.json(formattedInventory);
  } catch (error) {
    console.error('Inventory list error:', error);
    res.status(500).json({ error: 'Server error fetching inventory.' });
  }
});

// 7. GET /api/menus
app.get('/api/menus', async (req, res) => {
  await delay(50);
  try {
    const [menus] = await db.query('SELECT * FROM menus');
    const [ingredients] = await db.query('SELECT * FROM ingredients');

    const formattedMenus = menus.map(menu => {
      const menuIngredients = ingredients.filter(ing => ing.menuId === menu.id).map(ing => ({
        name: ing.name,
        perPortion: parseFloat(ing.perPortion),
        unit: ing.unit
      }));
      return {
        id: menu.id,
        name: menu.name,
        ingredients: menuIngredients
      };
    });

    res.json(formattedMenus);
  } catch (error) {
    console.error('Menus list error:', error);
    res.status(500).json({ error: 'Server error fetching menus.' });
  }
});

// 8. GET /api/staff
app.get('/api/staff', async (req, res) => {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT * FROM staff');
    res.json(rows);
  } catch (error) {
    console.error('Staff list error:', error);
    res.status(500).json({ error: 'Server error fetching staff.' });
  }
});

// 9. POST /api/kitchens
app.post('/api/kitchens', async (req, res) => {
  await delay(100);
  const { name, address, capacity, city } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Kitchen name is required.' });
  }
  const id = `k${Date.now()}`;
  const newKitchen = {
    id,
    name,
    address: address || '',
    capacity: Number(capacity) || 0,
    city: city || 'Unknown'
  };

  try {
    await db.query(
      'INSERT INTO kitchens (id, name, address, capacity, city) VALUES (?, ?, ?, ?, ?)',
      [newKitchen.id, newKitchen.name, newKitchen.address, newKitchen.capacity, newKitchen.city]
    );
    res.status(201).json(newKitchen);
  } catch (error) {
    console.error('Create kitchen error:', error);
    res.status(500).json({ error: 'Server error creating kitchen.' });
  }
});

// 10. PUT /api/kitchens/:id
app.put('/api/kitchens/:id', async (req, res) => {
  await delay(100);
  const { id } = req.params;
  const { name, address, capacity, city } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM kitchens WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found.' });
    }

    const current = rows[0];
    const updated = {
      name: name || current.name,
      address: address || current.address,
      capacity: capacity !== undefined ? Number(capacity) : current.capacity,
      city: city || current.city
    };

    await db.query(
      'UPDATE kitchens SET name = ?, address = ?, capacity = ?, city = ? WHERE id = ?',
      [updated.name, updated.address, updated.capacity, updated.city, id]
    );

    res.json({ id, ...updated });
  } catch (error) {
    console.error('Update kitchen error:', error);
    res.status(500).json({ error: 'Server error updating kitchen.' });
  }
});

// 11. DELETE /api/kitchens/:id
app.delete('/api/kitchens/:id', async (req, res) => {
  await delay(100);
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM kitchens WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found.' });
    }

    await db.query('DELETE FROM kitchens WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Delete kitchen error:', error);
    res.status(500).json({ error: 'Server error deleting kitchen.' });
  }
});

// 12. GET /api/kitchens/:id/detail
app.get('/api/kitchens/:id/detail', async (req, res) => {
  await delay(100);
  const { id } = req.params;

  try {
    const [kitchens] = await db.query('SELECT * FROM kitchens WHERE id = ?', [id]);
    if (kitchens.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found.' });
    }

    const kitchen = kitchens[0];

    const [activeProductions] = await db.query('SELECT * FROM production_logs WHERE kitchenId = ?', [id]);
    const [staffList] = await db.query("SELECT * FROM staff WHERE kitchenId = ? AND role IN ('Admin', 'Chef', 'Head Chef', 'Staff')", [id]);

    const [inventoryItems] = await db.query('SELECT * FROM inventory');
    const [batches] = await db.query('SELECT * FROM inventory_batches WHERE kitchenId = ?', [id]);

    const kitchenInventory = inventoryItems.map(item => {
      const dbBatches = batches.filter(b => b.inventoryId === item.id);
      if (dbBatches.length === 0) return null;

      const itemBatches = dbBatches.map(b => {
        const formattedWeight = formatSingleBatch(b.weight_value, b.unit, b.package_capacity, b.package_unit);
        return {
          id: b.id,
          kitchenId: b.kitchenId,
          container: b.container,
          weight_value: Number(b.weight_value),
          unit: b.unit,
          weight: formattedWeight,
          package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
          package_unit: b.package_unit,
          expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : ''
        };
      });

      const { totalWeight, volume } = aggregateStock(itemBatches);

      return {
        id: item.id,
        name: item.name,
        volume: volume,
        totalWeight: totalWeight,
        batches: itemBatches
      };
    }).filter(Boolean);

    res.json({
      ...kitchen,
      staff: staffList,
      shifts: [
        { type: 'Pagi', time: '06:00 - 14:00', staffCount: 6, avatars: ['https://i.pravatar.cc/150?u=a1', 'https://i.pravatar.cc/150?u=a2'] },
        { type: 'Sore', time: '14:00 - 22:00', staffCount: 4, avatars: ['https://i.pravatar.cc/150?u=a3'] }
      ],
      stock: kitchenInventory,
      activeProductions
    });
  } catch (error) {
    console.error('Kitchen detail error:', error);
    res.status(500).json({ error: 'Server error fetching kitchen detail.' });
  }
});

// 12a. GET /api/stock-requests
app.get('/api/stock-requests', async (req, res) => {
  await delay(50);
  const { kitchenId } = req.query;
  try {
    let rows;
    if (kitchenId) {
      [rows] = await db.query('SELECT * FROM stock_requests WHERE kitchenId = ? ORDER BY createdAt DESC', [kitchenId]);
    } else {
      [rows] = await db.query('SELECT * FROM stock_requests ORDER BY createdAt DESC');
    }
    res.json(rows);
  } catch (error) {
    console.error('Fetch stock requests error:', error);
    res.status(500).json({ error: 'Server error fetching stock requests.' });
  }
});

// 12b. GET /api/chef/dashboard/:kitchenId
app.get('/api/chef/dashboard/:kitchenId', async (req, res) => {
  await delay(100);
  const { kitchenId } = req.params;
  
  try {
    // 1. Fetch kitchen details
    const [kitchenRows] = await db.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    if (kitchenRows.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found' });
    }
    const kitchen = kitchenRows[0];
    
    // 2. Fetch staff members
    const [staff] = await db.query("SELECT * FROM staff WHERE kitchenId = ? AND role IN ('Chef', 'Head Chef', 'Staff')", [kitchenId]);
    
    // 3. Fetch today's production logs
    const [todayPlans] = await db.query('SELECT * FROM production_logs WHERE kitchenId = ?', [kitchenId]);
    
    // Calculate Today's Stats
    let totalPortions = 0;
    let completedPortions = 0;
    let activeCookingCount = 0;
    
    for (const plan of todayPlans) {
      totalPortions += plan.servings || 0;
      if (plan.status === 'Ready') {
        completedPortions += plan.servings || 0;
      } else if (plan.status === 'Cooking') {
        activeCookingCount++;
      }
    }
    
    // 4. Fetch critical stock (low stock or expiring soon)
    const [batches] = await db.query(
      `SELECT b.*, i.name as materialName 
       FROM inventory_batches b 
       JOIN inventory i ON b.inventoryId = i.id 
       WHERE b.kitchenId = ?`, 
      [kitchenId]
    );
    
    const criticalStock = [];
    const now = new Date();
    
    for (const b of batches) {
      const expiryDate = new Date(b.expiry);
      const diffTime = expiryDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const val = Number(b.weight_value) || 0;
      const isLow = val <= 2; // critically low if 2 or fewer containers/units
      const isExpiringSoon = diffDays <= 30; // within 30 days
      
      if (isLow || isExpiringSoon) {
        criticalStock.push({
          id: b.id,
          material: b.materialName,
          container: b.container,
          weight_value: val,
          unit: b.unit,
          weight: formatSingleBatch(b.weight_value, b.unit, b.package_capacity, b.package_unit),
          package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
          package_unit: b.package_unit,
          expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : '',
          isLow,
          isExpiringSoon,
          daysToExpiry: diffDays
        });
      }
    }
    
    // 5. Fetch recent stock requests
    const [recentRequests] = await db.query(
      'SELECT * FROM stock_requests WHERE kitchenId = ? ORDER BY createdAt DESC LIMIT 5',
      [kitchenId]
    );
    
    res.json({
      kitchenName: kitchen.name,
      city: kitchen.city,
      todayStats: {
        totalPortions,
        completedPortions,
        activeCookingCount,
        efficiency: "94%", 
        wastageRate: "1.4%" 
      },
      todayMenu: todayPlans.map(plan => ({
        id: plan.id,
        menu: plan.menu,
        servings: plan.servings,
        status: plan.status,
        startTime: plan.startTime
      })),
      staff,
      criticalStock,
      recentRequests
    });
  } catch (error) {
    console.error('Chef dashboard API error:', error);
    res.status(500).json({ error: 'Server error compiling chef dashboard data.' });
  }
});


// 13. POST /api/stock-requests
app.post('/api/stock-requests', async (req, res) => {
  await delay(100);
  const { material, amount, urgency, kitchenId, kitchenName } = req.body;
  const newRequest = {
    id: Date.now().toString(),
    material,
    amount,
    urgency,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    kitchenId: kitchenId || null,
    kitchenName: kitchenName || null
  };

  try {
    await db.query(
      'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, kitchenName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.kitchenName]
    );
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Stock request error:', error);
    res.status(500).json({ error: 'Server error placing stock request.' });
  }
});

// 14. POST /api/stock-requests/batch
app.post('/api/stock-requests/batch', async (req, res) => {
  await delay(100);
  const { requests, kitchenId, kitchenName } = req.body;
  if (!requests || !Array.isArray(requests)) {
    return res.status(400).json({ error: 'Invalid requests format.' });
  }

  try {
    const newRequests = [];
    for (let i = 0; i < requests.length; i++) {
      const reqItem = requests[i];
      const newRequest = {
        id: (Date.now() + i).toString(),
        material: reqItem.material,
        amount: reqItem.amount,
        urgency: reqItem.urgency,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        kitchenId: reqItem.kitchenId || kitchenId || null,
        kitchenName: reqItem.kitchenName || kitchenName || null
      };
      await db.query(
        'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, kitchenName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.kitchenName]
      );
      newRequests.push(newRequest);
    }
    res.status(201).json(newRequests);
  } catch (error) {
    console.error('Stock request batch error:', error);
    res.status(500).json({ error: 'Server error placing batch stock request.' });
  }
});

// 15. POST /api/production-logs/finish
app.post('/api/production-logs/finish', async (req, res) => {
  await delay(100);
  const { productionId } = req.body;

  try {
    await db.query("UPDATE production_logs SET status = 'Ready' WHERE id = ?", [productionId]);
    await db.query("UPDATE production_plans SET status = 'Ready' WHERE id = ?", [productionId]);

    res.json({ success: true, handoverId: `H-${Date.now()}` });
  } catch (error) {
    console.error('Finish task error:', error);
    res.status(500).json({ error: 'Server error completing task.' });
  }
});

// 16. POST /api/production-logs/start (SCM FEFO Stock Consumption)
app.post('/api/production-logs/start', async (req, res) => {
  await delay(100);
  const { id } = req.body;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch the production log task
    const [tasks] = await connection.query('SELECT * FROM production_logs WHERE id = ?', [id]);
    if (tasks.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Task not found.' });
    }

    const plan = tasks[0];
    const startTime = new Date().toISOString();

    // Update status in log and plan tables
    await connection.query("UPDATE production_logs SET status = 'Cooking', startTime = ? WHERE id = ?", [startTime, id]);
    await connection.query("UPDATE production_plans SET status = 'Cooking' WHERE id = ?", [id]);

    // 2. Fetch the corresponding menu and its ingredients
    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [plan.menu.toLowerCase()]);
    if (menus.length > 0) {
      const menu = menus[0];
      const [ingredients] = await connection.query('SELECT * FROM ingredients WHERE menuId = ?', [menu.id]);

      // 3. Perform FEFO stock consumption for each ingredient
      for (const ing of ingredients) {
        const totalNeeded = Number(ing.perPortion) * plan.servings;
        let remainingNeeded = totalNeeded;

        // Find matches in inventory (materials)
        const [invItems] = await connection.query('SELECT * FROM inventory WHERE LOWER(name) = ?', [ing.name.toLowerCase()]);
        if (invItems.length > 0) {
          const invItem = invItems[0];
          
          // Get batches for this kitchen sorted by expiry ascending (FEFO)
          const [batches] = await connection.query(
            'SELECT * FROM inventory_batches WHERE inventoryId = ? AND kitchenId = ? ORDER BY expiry ASC',
            [invItem.id, plan.kitchenId]
          );

          for (const batch of batches) {
            if (remainingNeeded <= 0) break;

            const currentWeightValue = Number(batch.weight_value) || 0;
            const batchUnit = batch.unit || 'kg';
            const cap = Number(batch.package_capacity);
            const pkgUnit = (batch.package_unit || '').trim();

            if (currentWeightValue > 0) {
              const neededInBatchUnit = convertUnit(remainingNeeded, ing.unit, batchUnit, cap, pkgUnit);
              
              if (currentWeightValue >= neededInBatchUnit) {
                const newWeightValue = currentWeightValue - neededInBatchUnit;
                const formattedWeight = formatSingleBatch(newWeightValue, batchUnit, cap, pkgUnit);
                await connection.query(
                  'UPDATE inventory_batches SET weight_value = ?, weight = ? WHERE id = ?',
                  [newWeightValue, formattedWeight, batch.id]
                );
                remainingNeeded = 0;
              } else {
                const consumedInIngredientUnit = convertUnit(currentWeightValue, batchUnit, ing.unit, cap, pkgUnit);
                remainingNeeded = Math.max(0, remainingNeeded - consumedInIngredientUnit);
                const formattedWeight = formatSingleBatch(0, batchUnit, cap, pkgUnit);
                await connection.query(
                  'UPDATE inventory_batches SET weight_value = 0, weight = ? WHERE id = ?',
                  [formattedWeight, batch.id]
                );
              }
            }
          }
        }
      }
    }

    await connection.commit();
    connection.release();

    res.json({ ...plan, status: 'Cooking', startTime });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Start task error:', error);
    res.status(500).json({ error: 'Server error starting cooking task.' });
  }
});

// 17. POST /api/wastage
app.post('/api/wastage', async (req, res) => {
  await delay(100);
  const { batchId, kitchenId, materialName, weight, reason } = req.body;
  if (!batchId || !kitchenId || !materialName || weight === undefined) {
    return res.status(400).json({ error: 'Data wastage tidak lengkap.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Decrement batch weight
    const [batches] = await connection.query(
      'SELECT * FROM inventory_batches WHERE id = ? AND kitchenId = ?',
      [batchId, kitchenId]
    );

    let displayUnit = 'kg';
    let newWeightValue = 0;
    let standardQty = Number(weight);

    if (batches.length > 0) {
      const batch = batches[0];
      const currentWeightValue = Number(batch.weight_value) || 0;
      const dbUnit = batch.unit || 'kg';
      const cap = Number(batch.package_capacity);
      const pkgUnit = (batch.package_unit || '').trim();
      
      displayUnit = getDisplayUnit(currentWeightValue, dbUnit, cap, pkgUnit);
      const discardedInDbUnit = convertUnit(Number(weight), displayUnit, dbUnit, cap, pkgUnit);
      
      newWeightValue = Math.max(0, currentWeightValue - discardedInDbUnit);
      const formattedWeight = formatSingleBatch(newWeightValue, dbUnit, cap, pkgUnit);
      
      await connection.query(
        'UPDATE inventory_batches SET weight_value = ?, weight = ? WHERE id = ?',
        [newWeightValue, formattedWeight, batchId]
      );

      if (!isNaN(cap) && cap > 0 && pkgUnit) {
        standardQty = convertUnit(Number(weight), displayUnit, pkgUnit, cap, pkgUnit);
      } else {
        const isWeightUnit = (dbUnit.toLowerCase() === 'kg' || dbUnit.toLowerCase() === 'g');
        const isVolumeUnit = (dbUnit.toLowerCase() === 'l' || dbUnit.toLowerCase() === 'ml');
        if (isWeightUnit) {
          standardQty = convertUnit(Number(weight), displayUnit, 'kg');
        } else if (isVolumeUnit) {
          standardQty = convertUnit(Number(weight), displayUnit, 'L');
        }
      }
    }

    // 2. Fetch kitchen details to build logs
    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    const kName = kitchens.length > 0 ? kitchens[0].name : 'Dapur Umum';
    const city = kitchens.length > 0 ? kitchens[0].city : 'Jakarta';

    const newWastageRecord = {
      id: `W-${Date.now()}`,
      kitchen: kName,
      city: city,
      material: materialName,
      weight: Number(weight),
      unit: displayUnit,
      reason: reason || 'Busuk',
      cost: Math.round(standardQty * 35000), // IDR 35,000 per kg/L average
      date: new Date().toISOString().split('T')[0]
    };

    // 3. Save wastage record
    await connection.query(
      'INSERT INTO wastage_records (id, kitchen, city, material, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newWastageRecord.id,
        newWastageRecord.kitchen,
        newWastageRecord.city,
        newWastageRecord.material,
        newWastageRecord.weight,
        newWastageRecord.unit,
        newWastageRecord.reason,
        newWastageRecord.cost,
        newWastageRecord.date
      ]
    );

    await connection.commit();
    connection.release();

    res.status(201).json(newWastageRecord);
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Wastage reporting error:', error);
    res.status(500).json({ error: 'Server error reporting wastage.' });
  }
});

// 18. GET /api/wastage
app.get('/api/wastage', async (req, res) => {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT * FROM wastage_records ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Wastage logs error:', error);
    res.status(500).json({ error: 'Server error fetching wastage logs.' });
  }
});

// Start Express Server
db.initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database connection. Server not started:', err);
});
