const db = require('../config/db');
const { formatSingleBatch } = require('../utils/formatters');
const { convertUnit, getDisplayUnit, aggregateStock } = require('../utils/unitConverter');

const formatDate = (val) => {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'string') return val.split('T')[0];
  return String(val);
};

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function getInventory(req, res) {
  await delay(50);
  try {
    const [items] = await db.query('SELECT * FROM inventory');
    const [batches] = await db.query('SELECT * FROM inventory_batches');

    const formattedInventory = items.map(item => {
      const itemBatches = batches.filter(b => b.inventoryId === item.id).map(b => {
        const qtyPacked = Number(b.qty_packed) || 0;
        const qtyLoose = Number(b.qty_loose) || 0;
        const cap = b.package_capacity !== null ? Number(b.package_capacity) : null;
        const totalVal = (cap !== null && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;
        const formattedWeight = formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit);
        return {
          id: b.id,
          kitchenId: b.kitchenId,
          container: b.container,
          qty_packed: qtyPacked,
          qty_loose: qtyLoose,
          weight_value: totalVal,
          unit: b.unit,
          weight: formattedWeight,
          package_capacity: cap,
          package_unit: b.package_unit,
          expiry: formatDate(b.expiry)
        };
      });
      return {
        id: item.id,
        name: item.name,
        logistics_sku: item.logistics_sku,
        base_unit: item.base_unit,
        has_packaging: item.has_packaging,
        packaging_name: item.packaging_name,
        packaging_capacity: item.packaging_capacity !== null ? Number(item.packaging_capacity) : null,
        batches: itemBatches
      };
    });

    res.json(formattedInventory);
  } catch (error) {
    console.error('Inventory list error:', error);
    res.status(500).json({ error: 'Server error fetching inventory.' });
  }
}

async function getStockRequests(req, res) {
  await delay(50);
  const { kitchenId } = req.query;
  try {
    let rows;
    if (kitchenId) {
      [rows] = await db.query(
        `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
         FROM stock_requests sr
         LEFT JOIN kitchens k ON sr.kitchenId = k.id
         LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
         WHERE sr.kitchenId = ?
         ORDER BY sr.createdAt DESC`,
        [kitchenId]
      );
    } else {
      [rows] = await db.query(
        `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
         FROM stock_requests sr
         LEFT JOIN kitchens k ON sr.kitchenId = k.id
         LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
         ORDER BY sr.createdAt DESC`
      );
    }
    // Map 'note' to 'adminNotes' for frontend backward compatibility
    const mapped = rows.map(r => ({
      ...r,
      adminNotes: r.note
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Fetch stock requests error:', error);
    res.status(500).json({ error: 'Server error fetching stock requests.' });
  }
}

async function createStockRequest(req, res) {
  await delay(100);
  const { material, amount, urgency, kitchenId, kitchenName, supplierKitchenId, supplierKitchenName } = req.body;
  const newRequest = {
    id: Date.now().toString(),
    material,
    amount,
    urgency,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    kitchenId: kitchenId || null,
    supplierKitchenId: supplierKitchenId || null,
    note: null
  };

  try {
    await db.query(
      'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.supplierKitchenId, newRequest.note]
    );

    // Fetch kitchen names for response
    let responseKitchenName = kitchenName || null;
    let responseSupplierName = supplierKitchenName || null;
    if (newRequest.kitchenId && !responseKitchenName) {
      const [k] = await db.query('SELECT name FROM kitchens WHERE id = ?', [newRequest.kitchenId]);
      if (k.length > 0) responseKitchenName = k[0].name;
    }
    if (newRequest.supplierKitchenId && !responseSupplierName) {
      const [sk] = await db.query('SELECT name FROM kitchens WHERE id = ?', [newRequest.supplierKitchenId]);
      if (sk.length > 0) responseSupplierName = sk[0].name;
    }

    res.status(201).json({
      ...newRequest,
      kitchenName: responseKitchenName,
      supplierKitchenName: responseSupplierName,
      adminNotes: newRequest.note
    });
  } catch (error) {
    console.error('Stock request error:', error);
    res.status(500).json({ error: 'Server error placing stock request.' });
  }
}

async function createStockRequestBatch(req, res) {
  await delay(100);
  const { requests, kitchenId, kitchenName } = req.body;
  if (!requests || !Array.isArray(requests)) {
    return res.status(400).json({ error: 'Invalid requests format.' });
  }

  try {
    const newRequests = [];
    // Fetch kitchen name if not provided
    let resolvedKitchenName = kitchenName || null;
    if (kitchenId && !resolvedKitchenName) {
      const [k] = await db.query('SELECT name FROM kitchens WHERE id = ?', [kitchenId]);
      if (k.length > 0) resolvedKitchenName = k[0].name;
    }

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
        supplierKitchenId: reqItem.supplierKitchenId || null,
        note: null
      };
      await db.query(
        'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, supplierKitchenId, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.supplierKitchenId, newRequest.note]
      );

      // Resolve supplier name
      let supplierName = reqItem.supplierKitchenName || null;
      if (newRequest.supplierKitchenId && !supplierName) {
        const [sk] = await db.query('SELECT name FROM kitchens WHERE id = ?', [newRequest.supplierKitchenId]);
        if (sk.length > 0) supplierName = sk[0].name;
      }

      newRequests.push({
        ...newRequest,
        kitchenName: resolvedKitchenName,
        supplierKitchenName: supplierName,
        adminNotes: newRequest.note
      });
    }
    res.status(201).json(newRequests);
  } catch (error) {
    console.error('Stock request batch error:', error);
    res.status(500).json({ error: 'Server error placing batch stock request.' });
  }
}

async function reportWastage(req, res) {
  await delay(100);
  const { batchId, kitchenId, materialName, weight, reason } = req.body;
  if (!batchId || !kitchenId || !materialName || weight === undefined) {
    return res.status(400).json({ error: 'Data wastage tidak lengkap.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    const [batches] = await connection.query(
      'SELECT * FROM inventory_batches WHERE id = ? AND kitchenId = ?',
      [batchId, kitchenId]
    );

    let displayUnit = 'kg';
    let newQtyPacked = 0;
    let newQtyLoose = 0;
    let standardQty = Number(weight);
    let inventoryId = null;

    if (batches.length > 0) {
      const batch = batches[0];
      inventoryId = batch.inventoryId;
      const qtyPacked = Number(batch.qty_packed) || 0;
      const qtyLoose = Number(batch.qty_loose) || 0;
      const dbUnit = batch.unit || 'kg';
      const cap = Number(batch.package_capacity);
      const pkgUnit = (batch.package_unit || '').trim();
      
      const currentTotal = (!isNaN(cap) && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;
      displayUnit = getDisplayUnit(currentTotal, dbUnit, cap, pkgUnit);
      
      const discardedInStandardUnit = convertUnit(Number(weight), displayUnit, pkgUnit || dbUnit, cap, pkgUnit);
      if (discardedInStandardUnit > currentTotal) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: 'Jumlah wastage melebihi stok yang tersedia (Stok tidak cukup).' });
      }
      const newTotal = Math.max(0, currentTotal - discardedInStandardUnit);
      
      if (!isNaN(cap) && cap > 0) {
        newQtyPacked = Math.floor(newTotal / cap);
        newQtyLoose = Number((newTotal % cap).toFixed(4));
      } else {
        newQtyPacked = 0;
        newQtyLoose = Number(newTotal.toFixed(4));
      }
      
      const formattedWeight = formatSingleBatch(newQtyPacked, newQtyLoose, batch.container, cap, pkgUnit);
      
      await connection.query(
        'UPDATE inventory_batches SET qty_packed = ?, qty_loose = ?, weight = ? WHERE id = ?',
        [newQtyPacked, newQtyLoose, formattedWeight, batchId]
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
    } else {
      // Try to find inventoryId from materialName
      const [invItems] = await connection.query('SELECT id FROM inventory WHERE LOWER(name) = ?', [materialName.toLowerCase()]);
      if (invItems.length > 0) {
        inventoryId = invItems[0].id;
      }
    }

    // If we still don't have an inventoryId, look it up
    if (!inventoryId) {
      const [invItems] = await connection.query('SELECT id FROM inventory WHERE LOWER(name) = ?', [materialName.toLowerCase()]);
      if (invItems.length > 0) {
        inventoryId = invItems[0].id;
      } else {
        // Cannot create wastage record without a valid inventoryId FK
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: 'Bahan baku tidak ditemukan di inventory.' });
      }
    }

    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    const kName = kitchens.length > 0 ? kitchens[0].name : 'Dapur Umum';
    const city = kitchens.length > 0 ? kitchens[0].city : 'Jakarta';

    const newWastageRecord = {
      id: `W-${Date.now()}`,
      kitchenId: kitchenId,
      inventoryId: inventoryId,
      weight: Number(weight),
      unit: displayUnit,
      reason: reason || 'Busuk',
      cost: Math.round(standardQty * 35000),
      date: new Date().toISOString().split('T')[0]
    };

    await connection.query(
      'INSERT INTO wastage_records (id, kitchenId, inventoryId, weight, unit, reason, cost, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newWastageRecord.id,
        newWastageRecord.kitchenId,
        newWastageRecord.inventoryId,
        newWastageRecord.weight,
        newWastageRecord.unit,
        newWastageRecord.reason,
        newWastageRecord.cost,
        newWastageRecord.date
      ]
    );

    await connection.commit();
    connection.release();

    // Return response with kitchen/material names for frontend compatibility
    res.status(201).json({
      ...newWastageRecord,
      kitchen: kName,
      city: city,
      material: materialName
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Wastage reporting error:', error);
    res.status(500).json({ error: 'Server error reporting wastage.' });
  }
}

async function getWastage(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query(
      `SELECT wr.*, k.name as kitchen, k.city, i.name as material
       FROM wastage_records wr
       JOIN kitchens k ON wr.kitchenId = k.id
       JOIN inventory i ON wr.inventoryId = i.id
       ORDER BY wr.id DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Wastage logs error:', error);
    res.status(500).json({ error: 'Server error fetching wastage logs.' });
  }
}

async function getChefDashboardData(req, res) {
  await delay(100);
  const { kitchenId } = req.params;
  
  try {
    const [kitchenRows] = await db.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    if (kitchenRows.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found' });
    }
    const kitchen = kitchenRows[0];
    
    const [users] = await db.query("SELECT * FROM users WHERE kitchenId = ? AND role IN ('Chef', 'Head Chef', 'Staff')", [kitchenId]);

    // Production logs with menu name via JOIN
    const [todayPlans] = await db.query(
      `SELECT pl.*, m.name as menu
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       WHERE pl.kitchenId = ?`,
      [kitchenId]
    );
    
    let totalPortions = 0;
    let completedPortions = 0;
    let activeCookingCount = 0;
    
    for (const plan of todayPlans) {
      totalPortions += plan.servings || 0;
      if (plan.status === 'Ready' || plan.status === 'Done') {
        completedPortions += plan.servings || 0;
      } else if (plan.status === 'Cooking') {
        activeCookingCount++;
      }
    }
    
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
      
      const qtyPacked = Number(b.qty_packed) || 0;
      const qtyLoose = Number(b.qty_loose) || 0;
      const cap = Number(b.package_capacity);
      const val = (!isNaN(cap) && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;
      const isLow = val <= 2;
      const isExpiringSoon = diffDays <= 30;
      
      if (isLow || isExpiringSoon) {
        criticalStock.push({
          id: b.id,
          material: b.materialName,
          container: b.container,
          qty_packed: qtyPacked,
          qty_loose: qtyLoose,
          weight_value: val,
          unit: b.unit,
          weight: formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit),
          package_capacity: b.package_capacity !== null ? Number(b.package_capacity) : null,
          package_unit: b.package_unit,
          expiry: formatDate(b.expiry),
          isLow,
          isExpiringSoon,
          daysToExpiry: diffDays
        });
      }
    }
    
    const [recentRequests] = await db.query(
      `SELECT sr.*, k.name as kitchenName, sk.name as supplierKitchenName
       FROM stock_requests sr
       LEFT JOIN kitchens k ON sr.kitchenId = k.id
       LEFT JOIN kitchens sk ON sr.supplierKitchenId = sk.id
       WHERE sr.kitchenId = ?
       ORDER BY sr.createdAt DESC LIMIT 5`,
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
      staff: users,
      criticalStock,
      recentRequests
    });
  } catch (error) {
    console.error('Chef dashboard API error:', error);
    res.status(500).json({ error: 'Server error compiling chef dashboard data.' });
  }
}

async function getMaterialAvailability(req, res) {
  await delay(50);
  const { material } = req.query;
  if (!material) {
    return res.status(400).json({ error: 'Material name is required.' });
  }
  
  try {
    const [items] = await db.query('SELECT * FROM inventory WHERE LOWER(name) = ?', [material.toLowerCase()]);
    if (items.length === 0) {
      return res.json([]);
    }
    const itemId = items[0].id;
    
    const [batches] = await db.query(
      `SELECT b.*, k.name as kitchenName, k.city, k.latitude, k.longitude 
       FROM inventory_batches b
       JOIN kitchens k ON b.kitchenId = k.id
       WHERE b.inventoryId = ?`,
      [itemId]
    );
    
    const aggregated = {};
    for (const b of batches) {
      const qtyPacked = Number(b.qty_packed) || 0;
      const qtyLoose = Number(b.qty_loose) || 0;
      const cap = Number(b.package_capacity);
      const val = (!isNaN(cap) && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;

      if (!aggregated[b.kitchenId]) {
        aggregated[b.kitchenId] = {
          kitchenId: b.kitchenId,
          kitchenName: b.kitchenName,
          city: b.city,
          latitude: b.latitude ? Number(b.latitude) : null,
          longitude: b.longitude ? Number(b.longitude) : null,
          totalWeightValue: 0,
          unit: b.unit,
          package_capacity: b.package_capacity,
          package_unit: b.package_unit,
          batches: []
        };
      }
      aggregated[b.kitchenId].totalWeightValue += val;
      
      const formattedWeight = formatSingleBatch(qtyPacked, qtyLoose, b.container, cap, b.package_unit);
      aggregated[b.kitchenId].batches.push({
        id: b.id,
        container: b.container,
        qty_packed: qtyPacked,
        qty_loose: qtyLoose,
        unit: b.unit,
        weight: formattedWeight,
        expiry: formatDate(b.expiry)
      });
    }
    
    const aggregatedList = Object.values(aggregated).map((k) => {
      const baseUnit = k.unit || 'kg';
      const cap = Number(k.package_capacity);
      const pkgUnit = k.package_unit || '';
      // pass total as qty_loose (packed = 0) to formattedTotal
      const formattedTotal = formatSingleBatch(0, k.totalWeightValue, baseUnit, cap, pkgUnit);
      return {
        ...k,
        totalWeight: formattedTotal
      };
    });
    
    res.json(aggregatedList);
  } catch (error) {
    console.error('Material availability error:', error);
    res.status(500).json({ error: 'Server error checking material availability.' });
  }
}

async function updateStockRequestStatus(req, res) {
  await delay(100);
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }
  
  try {
    const [rows] = await db.query('SELECT * FROM stock_requests WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Stock request not found.' });
    }
    const requestItem = rows[0];
    if (requestItem.status !== 'Pending') {
      return res.status(400).json({ error: 'Permintaan stock sudah diproses sebelumnya.' });
    }
    
    await db.query(
      'UPDATE stock_requests SET status = ?, note = ? WHERE id = ?',
      [status, adminNotes || null, id]
    );
    
    res.json({ id, status, adminNotes });
  } catch (error) {
    console.error('Update stock request status error:', error);
    res.status(500).json({ error: 'Server error updating stock request status.' });
  }
}

async function validateStockArrival(req, res) {
  await delay(100);
  const { requestIds } = req.body;
  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
    return res.status(400).json({ error: 'Array requestIds tidak boleh kosong.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    const processedRequests = [];

    for (const requestId of requestIds) {
      // 1. Get stock request
      const [requests] = await connection.query(
        'SELECT * FROM stock_requests WHERE id = ?',
        [requestId]
      );

      if (requests.length === 0) {
        continue;
      }

      const request = requests[0];
      if (request.status !== 'Approved') {
        continue;
      }

      // Update status to 'Delivered'
      await connection.query(
        "UPDATE stock_requests SET status = 'Delivered' WHERE id = ?",
        [requestId]
      );

      // 2. Parse amount (e.g. "10 karton")
      const amountStr = request.amount || '';
      const match = amountStr.match(/^([\d.]+)\s*(.*)$/);
      if (!match) continue;

      const quantity = parseFloat(match[1]);
      const requestedUnit = match[2] ? match[2].trim() : '';

      // 3. Find inventory item matching the material name
      let [invItems] = await connection.query(
        'SELECT * FROM inventory WHERE LOWER(name) = ?',
        [request.material.toLowerCase()]
      );

      let invItem;
      if (invItems.length === 0) {
        // Create a new inventory item if it doesn't exist
        const newInvId = `mat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sku = `SKU-${request.material.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Date.now()}`;
        const baseUnit = ['kg', 'g', 'l', 'ml', 'pcs'].includes(requestedUnit.toLowerCase()) ? requestedUnit : 'kg';
        
        await connection.query(
          'INSERT INTO inventory (id, name, logistics_sku, base_unit, has_packaging, packaging_name, packaging_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [newInvId, request.material, sku, baseUnit, 0, null, null]
        );

        invItem = {
          id: newInvId,
          name: request.material,
          base_unit: baseUnit,
          has_packaging: 0,
          packaging_name: null,
          packaging_capacity: null
        };
      } else {
        invItem = invItems[0];
      }

      // 4. Determine batch parameters
      const batchId = `b-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // default 30 days
      
      let container = 'Wadah';
      let qty_packed = 0;
      let qty_loose = quantity;
      let unit = requestedUnit || invItem.base_unit || 'kg';
      let package_capacity = invItem.packaging_capacity !== null ? Number(invItem.packaging_capacity) : null;
      let package_unit = invItem.base_unit;

      if (invItem.has_packaging && invItem.packaging_capacity > 0 && invItem.packaging_name) {
        package_capacity = Number(invItem.packaging_capacity);
        const pkgName = invItem.packaging_name;
        
        if (requestedUnit.toLowerCase() === pkgName.toLowerCase()) {
          qty_packed = quantity;
          qty_loose = 0;
          container = pkgName;
          unit = requestedUnit.toLowerCase();
        } else if (requestedUnit.toLowerCase() === invItem.base_unit.toLowerCase()) {
          qty_packed = Math.floor(quantity / package_capacity);
          qty_loose = Number((quantity % package_capacity).toFixed(4));
          container = pkgName;
          unit = pkgName.toLowerCase();
        } else {
          qty_packed = 0;
          qty_loose = quantity;
          container = 'Wadah';
          unit = requestedUnit;
        }
      } else {
        // No packaging
        container = 'Wadah';
        qty_packed = 0;
        qty_loose = quantity;
        unit = requestedUnit || invItem.base_unit || 'kg';
      }

      // Calculate weight using the utility formatSingleBatch
      const weight = formatSingleBatch(qty_packed, qty_loose, container, package_capacity, package_unit);

      // Insert new batch
      await connection.query(
        `INSERT INTO inventory_batches 
         (id, inventoryId, kitchenId, container, weight, qty_packed, qty_loose, unit, package_capacity, package_unit, expiry) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [batchId, invItem.id, request.kitchenId, container, weight, qty_packed, qty_loose, unit, package_capacity, package_unit, expiry]
      );

      processedRequests.push(requestId);
    }

    await connection.commit();
    connection.release();

    res.json({ success: true, processedRequests });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Validate stock arrival error:', error);
    res.status(500).json({ error: 'Server error validating stock arrival.' });
  }
}

module.exports = {
  getInventory,
  getStockRequests,
  createStockRequest,
  createStockRequestBatch,
  reportWastage,
  getWastage,
  getChefDashboardData,
  getMaterialAvailability,
  updateStockRequestStatus,
  validateStockArrival
};
