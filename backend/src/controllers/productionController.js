const db = require('../config/db');
const { convertUnit } = require('../utils/unitConverter');
const { formatSingleBatch } = require('../utils/formatters');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function getActivity(req, res) {
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
}

async function getProductionPlans(req, res) {
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
}

async function createProductionPlan(req, res) {
  await delay(100);
  const { id, day, menu, kitchenId, portions, note } = req.body;
  if (!day || !menu || !kitchenId || !portions) {
    return res.status(400).json({ error: 'Data rencana produksi tidak lengkap.' });
  }

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [kitchenId]);
    if (kitchens.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Kitchen tidak ditemukan.' });
    }
    const kitchen = kitchens[0];

    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [menu.toLowerCase()]);
    if (menus.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }
    const menuData = menus[0];

    const [chefs] = await connection.query("SELECT name FROM staff WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [kitchenId]);
    const chefName = chefs.length > 0 ? chefs[0].name : '';

    const planId = id || `p${Date.now()}`;

    await connection.query(
      'INSERT INTO production_plans (id, day, menuId, menuName, kitchenId, kitchenName, portions, note, status, chefPenanggungJawab) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [planId, day, menuData.id, menuData.name, kitchen.id, kitchen.name, Number(portions), note || '', 'Pending', chefName]
    );

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
}

async function updateProductionPlan(req, res) {
  await delay(100);
  const { id } = req.params;
  const { day, menu, kitchenId, portions, note } = req.body;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

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

    const [kitchens] = await connection.query('SELECT * FROM kitchens WHERE id = ?', [mergedKitchenId]);
    if (kitchens.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Kitchen tidak ditemukan.' });
    }
    const kitchen = kitchens[0];

    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [mergedMenuName.toLowerCase()]);
    if (menus.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Menu tidak ditemukan.' });
    }
    const menuData = menus[0];

    let chefName = current.chefPenanggungJawab;
    if (mergedKitchenId !== current.kitchenId) {
      const [chefs] = await connection.query("SELECT name FROM staff WHERE kitchenId = ? AND role = 'Chef' LIMIT 1", [mergedKitchenId]);
      chefName = chefs.length > 0 ? chefs[0].name : '';
    }

    await connection.query(
      'UPDATE production_plans SET day = ?, menuId = ?, menuName = ?, kitchenId = ?, kitchenName = ?, portions = ?, note = ?, chefPenanggungJawab = ? WHERE id = ?',
      [mergedDay, menuData.id, menuData.name, kitchen.id, kitchen.name, mergedPortions, mergedNote || '', chefName, id]
    );

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
}

async function deleteProductionPlan(req, res) {
  await delay(100);
  const { id } = req.params;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    const [existing] = await connection.query('SELECT * FROM production_plans WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Rencana produksi tidak ditemukan.' });
    }

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
}

async function finishProductionLog(req, res) {
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
}

async function startProductionLog(req, res) {
  await delay(100);
  const { id } = req.body;

  const connection = await db.pool.getConnection();
  try {
    await connection.beginTransaction();

    const [tasks] = await connection.query('SELECT * FROM production_logs WHERE id = ?', [id]);
    if (tasks.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Task not found.' });
    }

    const plan = tasks[0];
    const startTime = new Date().toISOString();

    await connection.query("UPDATE production_logs SET status = 'Cooking', startTime = ? WHERE id = ?", [startTime, id]);
    await connection.query("UPDATE production_plans SET status = 'Cooking' WHERE id = ?", [id]);

    const [menus] = await connection.query('SELECT * FROM menus WHERE LOWER(name) = ?', [plan.menu.toLowerCase()]);
    if (menus.length > 0) {
      const menu = menus[0];
      const [ingredients] = await connection.query('SELECT * FROM ingredients WHERE menuId = ?', [menu.id]);

      for (const ing of ingredients) {
        const totalNeeded = Number(ing.perPortion) * plan.servings;
        let remainingNeeded = totalNeeded;

        const [invItems] = await connection.query('SELECT * FROM inventory WHERE LOWER(name) = ?', [ing.name.toLowerCase()]);
        if (invItems.length > 0) {
          const invItem = invItems[0];
          
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
}

async function getMenus(req, res) {
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
}

module.exports = {
  getActivity,
  getProductionPlans,
  createProductionPlan,
  updateProductionPlan,
  deleteProductionPlan,
  finishProductionLog,
  startProductionLog,
  getMenus
};
