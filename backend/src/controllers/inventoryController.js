const db = require('../config/db');
const { formatSingleBatch } = require('../utils/formatters');
const { convertUnit, getDisplayUnit, aggregateStock } = require('../utils/unitConverter');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function getInventory(req, res) {
  await delay(50);
  try {
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
}

async function getStockRequests(req, res) {
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
    kitchenName: kitchenName || null,
    supplierKitchenId: supplierKitchenId || null,
    supplierKitchenName: supplierKitchenName || null
  };

  try {
    await db.query(
      'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, kitchenName, supplierKitchenId, supplierKitchenName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.kitchenName, newRequest.supplierKitchenId, newRequest.supplierKitchenName]
    );
    res.status(201).json(newRequest);
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
        kitchenName: reqItem.kitchenName || kitchenName || null,
        supplierKitchenId: reqItem.supplierKitchenId || null,
        supplierKitchenName: reqItem.supplierKitchenName || null
      };
      await db.query(
        'INSERT INTO stock_requests (id, material, amount, urgency, status, createdAt, kitchenId, kitchenName, supplierKitchenId, supplierKitchenName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newRequest.id, newRequest.material, newRequest.amount, newRequest.urgency, newRequest.status, newRequest.createdAt, newRequest.kitchenId, newRequest.kitchenName, newRequest.supplierKitchenId, newRequest.supplierKitchenName]
      );
      newRequests.push(newRequest);
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
      cost: Math.round(standardQty * 35000),
      date: new Date().toISOString().split('T')[0]
    };

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
}

async function getWastage(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT * FROM wastage_records ORDER BY id DESC');
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
    
    const [staff] = await db.query("SELECT * FROM staff WHERE kitchenId = ? AND role IN ('Chef', 'Head Chef', 'Staff')", [kitchenId]);
    const [todayPlans] = await db.query('SELECT * FROM production_logs WHERE kitchenId = ?', [kitchenId]);
    
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
      const isLow = val <= 2;
      const isExpiringSoon = diffDays <= 30;
      
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
      aggregated[b.kitchenId].totalWeightValue += Number(b.weight_value);
      
      const formattedWeight = formatSingleBatch(b.weight_value, b.unit, b.package_capacity, b.package_unit);
      aggregated[b.kitchenId].batches.push({
        id: b.id,
        container: b.container,
        weight_value: Number(b.weight_value),
        unit: b.unit,
        weight: formattedWeight,
        expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : ''
      });
    }
    
    const aggregatedList = Object.values(aggregated).map((k) => {
      const baseUnit = k.unit || 'kg';
      const cap = Number(k.package_capacity);
      const pkgUnit = k.package_unit || '';
      const formattedTotal = formatSingleBatch(k.totalWeightValue, baseUnit, cap, pkgUnit);
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
    
    await db.query(
      'UPDATE stock_requests SET status = ?, adminNotes = ? WHERE id = ?',
      [status, adminNotes || null, id]
    );
    
    res.json({ id, status, adminNotes });
  } catch (error) {
    console.error('Update stock request status error:', error);
    res.status(500).json({ error: 'Server error updating stock request status.' });
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
  updateStockRequestStatus
};
