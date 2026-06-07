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

module.exports = {
  formatSingleBatch
};
