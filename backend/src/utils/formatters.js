// Single Batch Formatter
function formatSingleBatch(qty_packed, qty_loose, container, package_capacity, package_unit) {
  const qPacked = Number(qty_packed) || 0;
  const qLoose = Number(qty_loose) || 0;
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim();
  
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const totalVal = (qPacked * cap) + qLoose;
    let totalStr = "";
    const pkgULower = pkgU.toLowerCase();
    if (pkgULower === 'kg' && totalVal < 1 && totalVal > 0) {
      totalStr = `${Math.round(totalVal * 1000)} g`;
    } else if (pkgULower === 'l' && totalVal < 1 && totalVal > 0) {
      totalStr = `${Math.round(totalVal * 1000)} ml`;
    } else {
      totalStr = `${parseFloat(totalVal.toFixed(2))} ${pkgU}`;
    }
    
    const parts = [];
    if (qPacked > 0) {
      parts.push(`${qPacked} ${container}`);
    }
    if (qLoose > 0 || qPacked === 0) {
      if (pkgULower === 'kg' && qLoose < 1 && qLoose > 0) {
        parts.push(`${Math.round(qLoose * 1000)} g`);
      } else if (pkgULower === 'l' && qLoose < 1 && qLoose > 0) {
        parts.push(`${Math.round(qLoose * 1000)} ml`);
      } else {
        parts.push(`${parseFloat(qLoose.toFixed(2))} ${pkgU}`);
      }
    }
    
    return `${parts.join(' + ')} (Total: ${totalStr})`;
  }
  
  // Non-packaged / fallback
  const totalVal = qLoose || qPacked;
  const u = (container || 'kg').trim();
  const uLower = u.toLowerCase();
  
  if (totalVal === 0) {
    return `0 ${u}`;
  }
  if (uLower === 'kg' && totalVal < 1) {
    return `${Math.round(totalVal * 1000)} g`;
  }
  if (uLower === 'l' && totalVal < 1) {
    return `${Math.round(totalVal * 1000)} ml`;
  }
  
  const rounded = parseFloat(totalVal.toFixed(2));
  return `${rounded} ${u}`;
}

module.exports = {
  formatSingleBatch
};
