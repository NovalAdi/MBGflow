const db = require('../config/db');

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

async function getStats(req, res) {
  await delay(50);
  try {
    const [kitchenCount] = await db.query('SELECT COUNT(*) as count FROM kitchens');
    const [successfulServings] = await db.query("SELECT SUM(servings) as count FROM production_logs WHERE status = 'Ready'");
    const [currentlyCooking] = await db.query("SELECT COUNT(*) as count FROM production_logs WHERE status = 'Cooking'");
    const [totalActivities] = await db.query('SELECT COUNT(*) as count FROM production_logs');
    const [chefsOnDuty] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'Chef'");

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
}

module.exports = {
  getStats
};
