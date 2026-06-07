const db = require('../config/db');
const { formatSingleBatch } = require('../utils/formatters');
const { aggregateStock } = require('../utils/unitConverter');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function getKitchens(req, res) {
  await delay(50);
  try {
    const [rows] = await db.query('SELECT * FROM kitchens');
    res.json(rows);
  } catch (error) {
    console.error('Kitchens list error:', error);
    res.status(500).json({ error: 'Server error fetching kitchens list.' });
  }
}

async function createKitchen(req, res) {
  await delay(100);
  const { name, address, capacity, city, latitude, longitude } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Kitchen name is required.' });
  }
  const id = `k${Date.now()}`;
  const newKitchen = {
    id,
    name,
    address: address || '',
    capacity: Number(capacity) || 0,
    city: city || 'Unknown',
    latitude: latitude !== undefined ? Number(latitude) : null,
    longitude: longitude !== undefined ? Number(longitude) : null
  };

  try {
    await db.query(
      'INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newKitchen.id, newKitchen.name, newKitchen.address, newKitchen.capacity, newKitchen.city, newKitchen.latitude, newKitchen.longitude]
    );
    res.status(201).json(newKitchen);
  } catch (error) {
    console.error('Create kitchen error:', error);
    res.status(500).json({ error: 'Server error creating kitchen.' });
  }
}

async function updateKitchen(req, res) {
  await delay(100);
  const { id } = req.params;
  const { name, address, capacity, city, latitude, longitude } = req.body;

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
      city: city || current.city,
      latitude: latitude !== undefined ? Number(latitude) : current.latitude,
      longitude: longitude !== undefined ? Number(longitude) : current.longitude
    };

    await db.query(
      'UPDATE kitchens SET name = ?, address = ?, capacity = ?, city = ?, latitude = ?, longitude = ? WHERE id = ?',
      [updated.name, updated.address, updated.capacity, updated.city, updated.latitude, updated.longitude, id]
    );

    res.json({ id, ...updated });
  } catch (error) {
    console.error('Update kitchen error:', error);
    res.status(500).json({ error: 'Server error updating kitchen.' });
  }
}

async function deleteKitchen(req, res) {
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
}

async function getKitchenDetail(req, res) {
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
}

module.exports = {
  getKitchens,
  createKitchen,
  updateKitchen,
  deleteKitchen,
  getKitchenDetail
};
