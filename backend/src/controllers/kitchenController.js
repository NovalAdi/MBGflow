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
  const { name, address, capacity, city, latitude, longitude, staffIds, maps_url } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Kitchen name is required.' });
  }

  let guessedCity = city || 'Unknown';
  if (!city && address) {
    guessedCity = address.split(',')[0].trim();
  }

  const id = `k${Date.now()}`;
  const newKitchen = {
    id,
    name,
    address: address || '',
    capacity: Number(capacity) || 0,
    city: guessedCity,
    latitude: latitude !== undefined ? Number(latitude) : null,
    longitude: longitude !== undefined ? Number(longitude) : null,
    maps_url: maps_url || null
  };

  try {
    await db.query(
      'INSERT INTO kitchens (id, name, address, capacity, city, latitude, longitude, maps_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newKitchen.id, newKitchen.name, newKitchen.address, newKitchen.capacity, newKitchen.city, newKitchen.latitude, newKitchen.longitude, newKitchen.maps_url]
    );

    if (Array.isArray(staffIds) && staffIds.length > 0) {
      const placeholders = staffIds.map(() => '?').join(',');
      await db.query(
        `UPDATE users SET kitchenId = ? WHERE id IN (${placeholders})`,
        [newKitchen.id, ...staffIds]
      );
    }

    res.status(201).json(newKitchen);
  } catch (error) {
    console.error('Create kitchen error:', error);
    res.status(500).json({ error: 'Server error creating kitchen.' });
  }
}

async function updateKitchen(req, res) {
  await delay(100);
  const { id } = req.params;
  const { name, address, capacity, city, latitude, longitude, maps_url } = req.body;

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
      city: city || (address ? address.split(',')[0].trim() : current.city),
      latitude: latitude !== undefined ? Number(latitude) : current.latitude,
      longitude: longitude !== undefined ? Number(longitude) : current.longitude,
      maps_url: maps_url !== undefined ? maps_url : current.maps_url
    };

    await db.query(
      'UPDATE kitchens SET name = ?, address = ?, capacity = ?, city = ?, latitude = ?, longitude = ?, maps_url = ? WHERE id = ?',
      [updated.name, updated.address, updated.capacity, updated.city, updated.latitude, updated.longitude, updated.maps_url, id]
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

    // Production logs with menu name via JOIN
    const [activeProductions] = await db.query(
      `SELECT pl.*, m.name as menu, k.name as kitchen, k.city
       FROM production_logs pl
       JOIN menus m ON pl.menuId = m.id
       JOIN kitchens k ON pl.kitchenId = k.id
       WHERE pl.kitchenId = ? AND pl.status != 'Done'`,
      [id]
    );

    const [userList] = await db.query("SELECT * FROM users WHERE kitchenId = ? AND role IN ('Admin', 'Chef', 'Head Chef', 'Staff')", [id]);

    const [inventoryItems] = await db.query('SELECT * FROM inventory');
    const [batches] = await db.query('SELECT * FROM inventory_batches WHERE kitchenId = ?', [id]);

    const kitchenInventory = inventoryItems.map(item => {
      const dbBatches = batches.filter(b => b.inventoryId === item.id);
      if (dbBatches.length === 0) return null;

      const itemBatches = dbBatches.map(b => {
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
          expiry: b.expiry ? b.expiry.toISOString().split('T')[0] : ''
        };
      });

      const { totalWeight, volume } = aggregateStock(itemBatches);

      return {
        id: item.id,
        name: item.name,
        logistics_sku: item.logistics_sku,
        base_unit: item.base_unit,
        has_packaging: item.has_packaging,
        packaging_name: item.packaging_name,
        packaging_capacity: item.packaging_capacity !== null ? Number(item.packaging_capacity) : null,
        volume: volume,
        totalWeight: totalWeight,
        batches: itemBatches
      };
    }).filter(Boolean);

    res.json({
      ...kitchen,
      staff: userList,
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

async function parseMapsUrl(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  try {
    let targetUrl = url;
    // Follow redirect if short URL
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });
      targetUrl = response.url;
    }

    // Parse coordinates
    let latitude = null;
    let longitude = null;

    // Pattern 1: @lat,lng
    const atMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      latitude = parseFloat(atMatch[1]);
      longitude = parseFloat(atMatch[2]);
    } else {
      // Pattern 2: query parameter q=lat,lng or query=lat,lng or ll=lat,lng
      const queryMatch = targetUrl.match(/[?&](q|query|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (queryMatch) {
        latitude = parseFloat(queryMatch[2]);
        longitude = parseFloat(queryMatch[3]);
      } else {
        // Pattern 3: !3d-6.1668123!4d106.7865432
        const dataMatch = targetUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (dataMatch) {
          latitude = parseFloat(dataMatch[1]);
          longitude = parseFloat(dataMatch[2]);
        }
      }
    }

    // Parse place name
    let placeName = null;
    const placeMatch = targetUrl.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      try {
        placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      } catch (e) {
        placeName = placeMatch[1].replace(/\+/g, ' ');
      }
    }

    if (latitude === null || longitude === null) {
      return res.status(400).json({ error: 'Gagal mendeteksi koordinat dari Google Maps link ini.' });
    }

    res.json({
      success: true,
      latitude,
      longitude,
      address: placeName || ''
    });
  } catch (error) {
    console.error('Parse maps URL error:', error);
    res.status(500).json({ error: 'Server error parsing Google Maps URL.' });
  }
}

async function addKitchenStaff(req, res) {
  await delay(100);
  const { id: kitchenId } = req.params;
  const { staffId, name, role, email, password } = req.body;

  try {
    // 1. Check if kitchen exists
    const [kitchens] = await db.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    if (kitchens.length === 0) {
      return res.status(404).json({ error: 'Kitchen not found.' });
    }

    // 2. If staffId is provided, we assign the existing user to this kitchen
    if (staffId) {
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [staffId]);
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if (role) {
        await db.query('UPDATE users SET kitchenId = ?, role = ? WHERE id = ?', [kitchenId, role, staffId]);
      } else {
        await db.query('UPDATE users SET kitchenId = ? WHERE id = ?', [kitchenId, staffId]);
      }
      return res.json({ success: true, message: 'User successfully assigned to kitchen.' });
    }

    // 3. Otherwise, we create a new user manually
    if (!name || !role || !email) {
      return res.status(400).json({ error: 'Name, role, and email are required for manual creation.' });
    }

    // Check if email already exists
    const [existing] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const bcrypt = require('bcryptjs');
    const newId = `s_manual_${Date.now()}`;
    const defaultPassword = password || 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = {
      id: newId,
      name,
      role,
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(newId)}`,
      kitchenId,
      email: email.toLowerCase(),
      password: hashedPassword
    };

    await db.query(
      'INSERT INTO users (id, name, role, status, avatar, kitchenId, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newUser.id, newUser.name, newUser.role, newUser.status, newUser.avatar, newUser.kitchenId, newUser.email, newUser.password]
    );

    const { password: _, ...responseUser } = newUser;
    res.status(201).json(responseUser);
  } catch (error) {
    console.error('Add kitchen staff error:', error);
    res.status(500).json({ error: 'Server error assigning or creating kitchen staff.' });
  }
}

module.exports = {
  getKitchens,
  createKitchen,
  updateKitchen,
  deleteKitchen,
  getKitchenDetail,
  parseMapsUrl,
  addKitchenStaff
};
