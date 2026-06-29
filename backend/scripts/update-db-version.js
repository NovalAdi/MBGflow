const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../src/config/db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

// Generate unique version string based on current timestamp
const newVersion = `v_${Date.now()}`;

// Replace const CURRENT_DB_VERSION = '...'; with the new version
const versionRegex = /const CURRENT_DB_VERSION = ['"].*?['"];/;
if (versionRegex.test(dbContent)) {
  dbContent = dbContent.replace(versionRegex, `const CURRENT_DB_VERSION = '${newVersion}';`);
  fs.writeFileSync(dbPath, dbContent, 'utf8');
  console.log(`[BUILD] Updated CURRENT_DB_VERSION in db.js to: ${newVersion}`);
} else {
  console.error('[BUILD] Could not find CURRENT_DB_VERSION constant in db.js');
  process.exit(1);
}
