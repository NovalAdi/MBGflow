const db = require('../config/db');
const { formatSingleBatch } = require('../utils/formatters');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function checkVerificationStatus(req, res) {
  await delay(50);
  const { kitchenId } = req.query;
  if (!kitchenId) {
    return res.status(400).json({ error: 'kitchenId is required.' });
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const [rows] = await db.query(
      'SELECT * FROM stock_verifications WHERE kitchenId = ? AND verifiedAt LIKE ? LIMIT 1',
      [kitchenId, `${todayStr}%`]
    );

    res.json({ verified: rows.length > 0 });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ error: 'Server error checking verification status.' });
  }
}

async function getLastCookedMenu(req, res) {
  await delay(50);
  const { kitchenId } = req.query;
  if (!kitchenId) {
    return res.status(400).json({ error: 'kitchenId is required.' });
  }

  try {
    // 1. Get the last completed production log for this kitchen
    const [logs] = await db.query(
      "SELECT * FROM production_logs WHERE kitchenId = ? AND status = 'Ready' ORDER BY startTime DESC LIMIT 1",
      [kitchenId]
    );

    let lastMenu = null;
    let detailedIngredientNames = [];

    if (logs.length > 0) {
      lastMenu = logs[0].menu;
      // Find the menu to get its ingredients
      const [menus] = await db.query('SELECT id FROM menus WHERE LOWER(name) = ?', [lastMenu.toLowerCase()]);
      if (menus.length > 0) {
        const [ingredients] = await db.query('SELECT name FROM ingredients WHERE menuId = ?', [menus[0].id]);
        detailedIngredientNames = ingredients.map(ing => ing.name.toLowerCase());
      }
    }

    // 2. Fetch all inventory batches in this kitchen
    // We join with inventory to get the material name
    const [batches] = await db.query(
      `SELECT b.*, i.name as materialName, i.has_packaging, i.packaging_name, i.packaging_capacity
       FROM inventory_batches b
       JOIN inventory i ON b.inventoryId = i.id
       WHERE b.kitchenId = ?`,
      [kitchenId]
    );

    const detailedIngredients = [];
    const otherIngredients = [];

    for (const b of batches) {
      const isDetailed = detailedIngredientNames.includes(b.materialName.toLowerCase());
      const formattedBatch = {
        batchId: b.id,
        materialName: b.materialName,
        container: b.container,
        qty_packed: Number(b.qty_packed) || 0,
        qty_loose: Number(b.qty_loose) || 0,
        unit: b.unit,
        package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
        package_unit: b.package_unit,
        expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : ''
      };

      if (isDetailed) {
        detailedIngredients.push(formattedBatch);
      } else {
        otherIngredients.push(formattedBatch);
      }
    }

    res.json({
      lastMenu,
      detailedIngredients,
      otherIngredients
    });
  } catch (error) {
    console.error('Get last cooked menu error:', error);
    res.status(500).json({ error: 'Server error retrieving verification items.' });
  }
}

async function submitVerification(req, res) {
  await delay(100);
  const { kitchenId, verifiedBy, items } = req.body;

  if (!kitchenId || !verifiedBy || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Verification data is incomplete.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert verification log
    const verificationId = `v-${Date.now()}`;
    const verifiedAt = new Date().toISOString();
    await connection.query(
      'INSERT INTO stock_verifications (id, kitchenId, verifiedAt, verifiedBy, details) VALUES (?, ?, ?, ?, ?)',
      [verificationId, kitchenId, verifiedAt, verifiedBy, JSON.stringify(items)]
    );

    // 2. Adjust inventory batches
    for (const item of items) {
      const { batchId, qty_packed, qty_loose } = item;

      // Fetch the batch first to get metadata for formatting
      const [batches] = await connection.query(
        'SELECT * FROM inventory_batches WHERE id = ? AND kitchenId = ?',
        [batchId, kitchenId]
      );

      if (batches.length > 0) {
        const b = batches[0];
        const cap = b.package_capacity !== null ? Number(b.package_capacity) : null;
        const qPacked = qty_packed !== undefined ? Number(qty_packed) : Number(b.qty_packed);
        const qLoose = qty_loose !== undefined ? Number(qty_loose) : Number(b.qty_loose);

        const formattedWeight = formatSingleBatch(qPacked, qLoose, b.container, cap, b.package_unit);

        await connection.query(
          'UPDATE inventory_batches SET qty_packed = ?, qty_loose = ?, weight = ? WHERE id = ? AND kitchenId = ?',
          [qPacked, qLoose, formattedWeight, batchId, kitchenId]
        );
      }
    }

    await connection.commit();
    connection.release();

    res.status(201).json({ success: true, verificationId });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Submit verification error:', error);
    res.status(500).json({ error: 'Server error submitting stock verification.' });
  }
}

module.exports = {
  checkVerificationStatus,
  getLastCookedMenu,
  submitVerification
};
