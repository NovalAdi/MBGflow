// Unit Conversion Helper
function convertUnit(value, fromUnit, toUnit, package_capacity, package_unit) {
  const val = Number(value) || 0;
  const f = (fromUnit || '').toLowerCase().trim();
  const t = (toUnit || '').toLowerCase().trim();
  if (f === t) return val;
  
  // Standard metric scale conversions
  if (f === 'kg' && t === 'g') return val * 1000;
  if (f === 'g' && t === 'kg') return val / 1000;
  if (f === 'l' && t === 'ml') return val * 1000;
  if (f === 'ml' && t === 'l') return val / 1000;
  
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim().toLowerCase();
  
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const isFromPkg = (f !== 'kg' && f !== 'g' && f !== 'l' && f !== 'ml');
    const isToPkg = (t !== 'kg' && t !== 'g' && t !== 'l' && t !== 'ml');
    
    if (isFromPkg && !isToPkg) {
      // package type -> standard unit (e.g. jerigen -> L)
      const valInStandardPkgUnit = val * cap;
      return convertUnit(valInStandardPkgUnit, pkgU, t);
    }
    if (!isFromPkg && isToPkg) {
      // standard unit -> package type (e.g. L -> jerigen)
      const valInStandardPkgUnit = convertUnit(val, f, pkgU);
      return valInStandardPkgUnit / cap;
    }
  }
  
  return val;
}

// Display Unit Determiner
function getDisplayUnit(weight_value, unit, package_capacity, package_unit) {
  const val = Number(weight_value) || 0;
  const u = (unit || 'kg').trim();
  
  const cap = Number(package_capacity);
  const pkgU = (package_unit || '').trim();
  if (!isNaN(cap) && cap > 0 && pkgU) {
    const pkgULower = pkgU.toLowerCase();
    const totalVal = val * cap;
    if (pkgULower === 'kg' && totalVal < 1 && totalVal > 0) return 'g';
    if (pkgULower === 'l' && totalVal < 1 && totalVal > 0) return 'ml';
    return pkgU;
  }
  
  const uLower = u.toLowerCase();
  if (uLower === 'kg' && val < 1 && val > 0) return 'g';
  if (uLower === 'l' && val < 1 && val > 0) return 'ml';
  return u;
}

// Multi-batch Stock Aggregator
function aggregateStock(itemBatches) {
  if (!itemBatches || itemBatches.length === 0) {
    return { totalWeight: "0 kg", volume: 0 };
  }
  
  let weightSumKg = 0;
  let volumeSumL = 0;
  
  let hasWeights = false;
  let hasVolumes = false;
  
  for (const b of itemBatches) {
    const val = Number(b.weight_value) || 0;
    const u = (b.unit || 'kg').trim();
    const uLower = u.toLowerCase();
    
    const cap = Number(b.package_capacity);
    const pkgUnit = (b.package_unit || '').trim().toLowerCase();
    
    if (!isNaN(cap) && cap > 0 && pkgUnit) {
      const totalPkgVal = val * cap;
      if (pkgUnit === 'kg' || pkgUnit === 'g') {
        hasWeights = true;
        weightSumKg += pkgUnit === 'g' ? totalPkgVal / 1000 : totalPkgVal;
      } else if (pkgUnit === 'l' || pkgUnit === 'ml') {
        hasVolumes = true;
        volumeSumL += pkgUnit === 'ml' ? totalPkgVal / 1000 : totalPkgVal;
      }
    } else {
      if (uLower === 'kg' || uLower === 'g') {
        hasWeights = true;
        weightSumKg += uLower === 'g' ? val / 1000 : val;
      } else if (uLower === 'l' || uLower === 'ml') {
        hasVolumes = true;
        volumeSumL += uLower === 'ml' ? val / 1000 : val;
      } else {
        hasWeights = true;
        weightSumKg += val;
      }
    }
  }
  
  const parts = [];
  let progressVal = 0;
  
  if (hasWeights) {
    if (weightSumKg < 1 && weightSumKg > 0) {
      parts.push(`${Math.round(weightSumKg * 1000)} g`);
    } else {
      parts.push(`${parseFloat(weightSumKg.toFixed(2))} kg`);
    }
    progressVal += weightSumKg;
  }
  
  if (hasVolumes) {
    if (volumeSumL < 1 && volumeSumL > 0) {
      parts.push(`${Math.round(volumeSumL * 1000)} ml`);
    } else {
      parts.push(`${parseFloat(volumeSumL.toFixed(2))} L`);
    }
    progressVal += volumeSumL;
  }
  
  const totalWeight = parts.join(" - ") || "0 kg";
  const volume = Math.min((progressVal / 500) * 100, 100);
  
  return { totalWeight, volume };
}

module.exports = {
  convertUnit,
  getDisplayUnit,
  aggregateStock
};
