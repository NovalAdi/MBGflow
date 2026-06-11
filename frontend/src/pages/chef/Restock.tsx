import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  AlertTriangle, 
  Package, 
  Send, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  Truck, 
  ArrowRight,
  Info,
  Sliders,
  ChevronRight,
  Plus,
  Trash2,
  ListFilter
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

// Haversine formula to calculate distance in km
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface ManualRequestItem {
  id: string;
  materialSelect: string;
  customMaterial: string;
  quantity: string;
  unitSelect: string;
  customUnit: string;
  urgency: string;
}

export const Restock = ({ user }: { user: any }) => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [kitchenDetail, setKitchenDetail] = React.useState<any>(null);
  const [productionPlans, setProductionPlans] = React.useState<any[]>([]);
  const [wastageLogs, setWastageLogs] = React.useState<any[]>([]);
  const [menus, setMenus] = React.useState<any[]>([]);
  const [stockRequests, setStockRequests] = React.useState<any[]>([]);
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [sourceNotificationId, setSourceNotificationId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (location.state && location.state.prefillShortages && inventory.length > 0) {
      setActiveMethodTab("Manual");
      if (location.state.notificationId) {
        setSourceNotificationId(location.state.notificationId);
      }
      const shortages = location.state.prefillShortages as { material: string; amount: string }[];
      const prefilledManualItems: ManualRequestItem[] = shortages.map(sh => {
        const amountParts = sh.amount.split(/\s+/);
        const qty = amountParts[0] || "";
        const unit = amountParts[1] || "kg";
        
        const exists = inventory.some(invItem => invItem.name.toLowerCase() === sh.material.toLowerCase());
        const matchedName = exists 
          ? (inventory.find(invItem => invItem.name.toLowerCase() === sh.material.toLowerCase())?.name || sh.material)
          : "custom";

        return {
          id: Math.random().toString(36).substr(2, 9),
          materialSelect: matchedName,
          customMaterial: exists ? "" : sh.material,
          quantity: qty,
          unitSelect: unit,
          customUnit: "",
          urgency: "High"
        };
      });
      if (prefilledManualItems.length > 0) {
        setManualItems(prefilledManualItems);
      }
    }
  }, [location.state, inventory]);
  
  // Settings & Navigation
  const [maxDistance, setMaxDistance] = React.useState<number>(10);
  const [activeMethodTab, setActiveMethodTab] = React.useState<"AI" | "Manual">("AI");
  
  // AI Prediction State
  const [predicting, setPredicting] = React.useState(false);
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [aiError, setAiError] = React.useState("");
  
  // Manual Batch Form State
  const createEmptyManualItem = (): ManualRequestItem => ({
    id: Math.random().toString(36).substr(2, 9),
    materialSelect: "",
    customMaterial: "",
    quantity: "",
    unitSelect: "kg",
    customUnit: "",
    urgency: "Normal"
  });
  const [manualItems, setManualItems] = React.useState<ManualRequestItem[]>([createEmptyManualItem()]);

  // Modal / Check details state
  const [selectedMaterial, setSelectedMaterial] = React.useState<any>(null);
  const [availabilityList, setAvailabilityList] = React.useState<any[]>([]);
  const [checkingAvailability, setCheckingAvailability] = React.useState(false);
  const [submittingRequest, setSubmittingRequest] = React.useState(false);
  
  // Success states
  const [successMsg, setSuccessMsg] = React.useState("");

  // Tracking detail modal state
  const [selectedTrackingRequest, setSelectedTrackingRequest] = React.useState<any>(null);
  const [isTrackingDetailOpen, setTrackingDetailOpen] = React.useState(false);

  const loadAllData = React.useCallback(async () => {
    if (!user?.kitchenId) return;
    setLoading(true);
    try {
      const [kDetail, plans, wastage, menuList, requests, invData] = await Promise.all([
        api.getKitchenDetail(user.kitchenId),
        api.getProductionPlans(user.kitchenId),
        api.getWastage(),
        api.getMenus(),
        api.getStockRequests(user.kitchenId),
        api.getInventory()
      ]);
      setKitchenDetail(kDetail);
      setProductionPlans(plans);
      // Filter wastage by kitchen name
      const kitchenWastage = wastage.filter((w: any) => 
        w.kitchen?.toLowerCase() === kDetail.name?.toLowerCase()
      );
      setWastageLogs(kitchenWastage);
      setMenus(menuList);
      setStockRequests(requests);
      setInventory(invData);
    } catch (error) {
      console.error("Gagal memuat data restock:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.kitchenId]);

  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  // Run Mathematical Deficit Calculation (Tab 2)
  const directDeficits = React.useMemo(() => {
    // 1. Filter production plans that are active/not finished
    const activePlans = productionPlans.filter(p => p.status !== "Ready");
    
    // 2. Accumulate raw ingredients needed
    const neededMap: Record<string, { material: string; needed: number; unit: string }> = {};
    activePlans.forEach(plan => {
      const matchedMenu = menus.find(m => m.name.toLowerCase() === plan.menuName?.toLowerCase());
      if (matchedMenu && matchedMenu.ingredients) {
        matchedMenu.ingredients.forEach((ing: any) => {
          const totalNeeded = ing.perPortion * plan.portions;
          if (!neededMap[ing.name]) {
            neededMap[ing.name] = { material: ing.name, needed: 0, unit: ing.unit };
          }
          neededMap[ing.name].needed += totalNeeded;
        });
      }
    });

    // 3. Compare with current kitchen stock
    const results: any[] = [];
    Object.values(neededMap).forEach(item => {
      // Find matching item in inventory
      const stockItem = kitchenDetail?.stock?.find((s: any) => s.name.toLowerCase() === item.material.toLowerCase());
      
      // Sum stock value in base unit
      let totalStock = 0;
      if (stockItem && stockItem.batches) {
        stockItem.batches.forEach((b: any) => {
          totalStock += Number(b.weight_value) || 0;
        });
      }

      const shortage = Math.max(0, item.needed - totalStock);
      
      if (shortage > 0) {
        // Urgency logic: High if shortage is greater than stock
        const urgency = shortage > totalStock ? "High" : shortage > totalStock * 0.5 ? "Medium" : "Low";
        
        results.push({
          material: item.material,
          needed: Number(item.needed.toFixed(2)),
          currentStock: Number(totalStock.toFixed(2)),
          shortage: Number(shortage.toFixed(2)),
          unit: item.unit,
          recommendedAmount: `${Number(shortage.toFixed(2))} ${item.unit}`,
          urgency,
          reasoning: `Defisit murni berdasarkan resep menu rencana memasak dikurangi sisa stok dapur.`
        });
      }
    });

    return results;
  }, [productionPlans, menus, kitchenDetail]);

  // Run Local Fallback Analysis (Tab 1 AI Fallback)
  const runLocalPrediction = () => {
    const activePlans = productionPlans.filter(p => p.status !== "Ready");
    const neededMap: Record<string, { material: string; needed: number; unit: string }> = {};
    activePlans.forEach(plan => {
      const matchedMenu = menus.find(m => m.name.toLowerCase() === plan.menuName?.toLowerCase());
      if (matchedMenu && matchedMenu.ingredients) {
        matchedMenu.ingredients.forEach((ing: any) => {
          const totalNeeded = ing.perPortion * plan.portions;
          if (!neededMap[ing.name]) {
            neededMap[ing.name] = { material: ing.name, needed: 0, unit: ing.unit };
          }
          neededMap[ing.name].needed += totalNeeded;
        });
      }
    });

    const results: any[] = [];
    Object.values(neededMap).forEach(item => {
      const stockItem = kitchenDetail?.stock?.find((s: any) => s.name.toLowerCase() === item.material.toLowerCase());
      let totalStock = 0;
      if (stockItem && stockItem.batches) {
        stockItem.batches.forEach((b: any) => {
          totalStock += Number(b.weight_value) || 0;
        });
      }

      const shortage = Math.max(0, item.needed - totalStock);
      
      if (shortage > 0) {
        const matWastage = wastageLogs.filter(w => w.material.toLowerCase() === item.material.toLowerCase());
        const totalWasted = matWastage.reduce((sum, w) => sum + (Number(w.weight) || 0), 0);
        const avgWasted = matWastage.length > 0 ? totalWasted / matWastage.length : 0;
        
        const buffer = avgWasted > 0 ? avgWasted : shortage * 0.2;
        const recommendedValue = Math.ceil(shortage + buffer);
        const recommendedAmount = `${recommendedValue} ${item.unit}`;
        const urgency = shortage > totalStock ? "High" : shortage > totalStock * 0.5 ? "Medium" : "Low";
        
        results.push({
          material: item.material,
          needed: Number(item.needed.toFixed(2)),
          currentStock: Number(totalStock.toFixed(2)),
          shortage: Number(shortage.toFixed(2)),
          unit: item.unit,
          recommendedAmount,
          urgency,
          reasoning: `Defisit memasak ${item.needed.toFixed(1)} ${item.unit}, sisa stok ${totalStock.toFixed(1)} ${item.unit}. Ditambahkan buffer sisa wastage historis ${buffer.toFixed(1)} ${item.unit}.`
        });
      }
    });

    return results;
  };

  // Run Gemini AI Prediction
  const handleAIPredict = async () => {
    setPredicting(true);
    setAiError("");
    setPredictions([]);

    const activePlans = productionPlans.filter(p => p.status !== "Ready");

    if (activePlans.length === 0) {
      setPredictions([]);
      setAiError("Tidak ada rencana produksi aktif (semua rencana berstatus 'Ready'). AI tidak perlu memprediksi restock.");
      setPredicting(false);
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY || "";
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("API Key Gemini tidak dikonfigurasi.");
      }

      const prompt = `
Anda adalah asisten AI Peramal Inventori untuk Dapur Restoran Pintar (MBGflow).
Tugas Anda adalah memprediksi kekurangan bahan baku dan memberikan rekomendasi restock.

Data Dapur Saat Ini:
- Nama Dapur: "${kitchenDetail?.name || "Dapur Satelit"}"
- Rencana Produksi Rencana Aktif (Menunggu Dimasak):
${JSON.stringify(activePlans.map(p => ({ menu: p.menuName, porsi: p.portions, status: p.status })), null, 2)}
- Resep Hidangan (Bahan baku per porsi):
${JSON.stringify(menus, null, 2)}
- Stok Inventori Dapur Saat Ini:
${JSON.stringify(
  (kitchenDetail?.stock || []).map((s: any) => ({
    name: s.name,
    totalStock: s.totalWeight,
    batches: s.batches.map((b: any) => ({ id: b.id, weight_value: b.weight_value, unit: b.unit }))
  })),
  null,
  2
)}
- Riwayat Wastage Dapur (Kerugian/Bahan terbuang):
${JSON.stringify(wastageLogs.map(w => ({ bahan: w.material, jumlahTerbuang: w.weight, unit: w.unit, alasan: w.reason })), null, 2)}

Logika Kalkulasi:
1. Hitung total kebutuhan bahan baku untuk semua rencana produksi aktif (porsi rencana * bahan per portion).
2. Hitung total stok saat ini dari masing-masing bahan baku.
3. Temukan bahan baku yang memiliki stok kurang dari kebutuhan (shortage = kebutuhan - stok).
4. Untuk setiap bahan baku yang kurang, berikan rekomendasi jumlah restock (recommendedAmount). Gunakan data riwayat wastage historis untuk bahan tersebut sebagai buffer tambahan agar tidak terjadi kekurangan lagi.
5. Tentukan tingkat urgensi ("Low" | "Medium" | "High"). Urgensi "High" jika stok sisa sangat sedikit atau habis sama sekali.
6. Berikan reasoning singkat (dalam Bahasa Indonesia) tentang mengapa bahan tersebut kurang dan berapa buffer yang ditambahkan dari histori wastage.

Format Output: Harus mengembalikan array JSON murni tanpa markdown, tanpa penjelasan pembuka/penutup. Struktur JSON harus persis seperti di bawah ini:
[
  {
    "material": "Nama Bahan Baku (harus sesuai dengan nama bahan baku di resep/stok)",
    "needed": 150.0,
    "currentStock": 20.0,
    "shortage": 130.0,
    "unit": "kg",
    "recommendedAmount": "140 kg",
    "urgency": "High",
    "reasoning": "Penjelasan singkat dalam bahasa Indonesia"
  }
]
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resData = await response.json();
      const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Format respons Gemini tidak valid.");
      }

      const parsed = JSON.parse(text.trim());
      setPredictions(parsed);
    } catch (err: any) {
      console.warn("Koneksi Gemini AI gagal, menggunakan kalkulasi lokal pintar sebagai fallback:", err);
      const localResults = runLocalPrediction();
      setPredictions(localResults);
      if (localResults.length === 0) {
        setAiError("Semua kebutuhan bahan baku untuk rencana produksi aktif sudah mencukupi. Tidak ada restock yang diperlukan.");
      }
    } finally {
      setPredicting(false);
    }
  };

  // Check availability of the material in other kitchens
  const handleCheckAvailability = async (predictionItem: any) => {
    setSelectedMaterial(predictionItem);
    setCheckingAvailability(true);
    setAvailabilityList([]);

    try {
      const availability = await api.getMaterialAvailability(predictionItem.material);
      
      const currentLat = kitchenDetail?.latitude || 0;
      const currentLon = kitchenDetail?.longitude || 0;

      const formattedList = availability
        .filter((k: any) => k.kitchenId !== user.kitchenId)
        .map((k: any) => {
          const lat = k.latitude || 0;
          const lon = k.longitude || 0;
          const distance = calculateHaversineDistance(currentLat, currentLon, lat, lon);
          const isCentral = k.kitchenName.toLowerCase().includes("pusat") || k.kitchenId === "k1";

          return {
            ...k,
            distance: Number(distance.toFixed(1)),
            isCentral
          };
        })
        .sort((a, b) => a.distance - b.distance);

      setAvailabilityList(formattedList);
    } catch (error) {
      console.error("Gagal mengecek ketersediaan bahan baku:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Place targeted stock request
  const handleRequestStock = async (supplierKitchen: any) => {
    if (!selectedMaterial || submittingRequest) return;
    setSubmittingRequest(true);

    try {
      const amount = selectedMaterial.recommendedAmount;
      const material = selectedMaterial.material;
      const urgency = selectedMaterial.urgency;
      const kitchenId = user.kitchenId;
      const kitchenName = kitchenDetail?.name;

      const supplierId = supplierKitchen.kitchenId;
      const supplierName = supplierKitchen.kitchenName;

      await api.requestStock(
        material,
        amount,
        urgency,
        kitchenId,
        kitchenName,
        supplierId,
        supplierName
      );

      if (sourceNotificationId) {
        try {
          await api.markNotificationRead(sourceNotificationId);
          setSourceNotificationId(null);
        } catch (err) {
          console.error("Failed to mark notification read:", err);
        }
      }

      showNotification(`Sukses mengajukan restock ${material} sebanyak ${amount} ke ${supplierName}!`);
      setSelectedMaterial(null);
      const requests = await api.getStockRequests(user.kitchenId);
      setStockRequests(requests);
    } catch (error: any) {
      alert(error.message || "Gagal mengajukan restock.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Send all AI predicted shortages to central warehouse
  const handleSendAIPredictions = async () => {
    if (predictions.length === 0 || submittingRequest) return;
    setSubmittingRequest(true);
    try {
      const centralKitchen = inventory.length > 0 ? "Dapur Pusat Jakarta" : "Gudang Pusat";
      const requests = predictions.map(item => {
        return {
          material: item.material,
          amount: item.recommendedAmount,
          urgency: item.urgency || "Medium",
          supplierKitchenId: "k1",
          supplierKitchenName: centralKitchen
        };
      });

      await api.requestStockBatch(requests, user.kitchenId, kitchenDetail?.name);

      if (sourceNotificationId) {
        try {
          await api.markNotificationRead(sourceNotificationId);
          setSourceNotificationId(null);
        } catch (err) {
          console.error("Failed to mark notification read:", err);
        }
      }

      showNotification(`Sukses mengirimkan ${requests.length} pengajuan bahan hasil prediksi AI ke Gudang Pusat!`);
      
      const reqList = await api.getStockRequests(user.kitchenId);
      setStockRequests(reqList);
    } catch (err: any) {
      alert(err.message || "Gagal mengirimkan pengajuan.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  // Manual Form Handlers
  const addManualItem = () => {
    setManualItems([...manualItems, createEmptyManualItem()]);
  };

  const populateFromDeficits = () => {
    if (directDeficits.length === 0) {
      alert("Tidak ada kekurangan bahan baku (defisit) yang terdeteksi untuk rencana produksi aktif.");
      return;
    }
    const filledItems: ManualRequestItem[] = directDeficits.map(item => {
      const exists = inventory.some(invItem => invItem.name === item.material);
      return {
        id: Math.random().toString(36).substr(2, 9),
        materialSelect: exists ? item.material : "custom",
        customMaterial: exists ? "" : item.material,
        quantity: String(item.shortage),
        unitSelect: item.unit || "kg",
        customUnit: "",
        urgency: item.urgency === "High" ? "High" : item.urgency === "Medium" ? "Medium" : "Low"
      };
    });
    setManualItems(filledItems);
  };

  const removeManualItem = (id: string) => {
    if (manualItems.length === 1) return;
    setManualItems(manualItems.filter(item => item.id !== id));
  };

  const updateManualItem = (id: string, updates: Partial<ManualRequestItem>) => {
    setManualItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newItem = { ...item, ...updates };
      // Reset units when material changes
      if (updates.materialSelect !== undefined) {
        const newUnits = getAvailableUnitsForMaterial(updates.materialSelect);
        newItem.unitSelect = newUnits[0] || "kg";
        newItem.customUnit = "";
      }
      return newItem;
    }));
  };

  const getAvailableUnitsForMaterial = (materialName: string) => {
    if (!materialName || materialName === "custom") {
      return ["kg", "g", "L", "ml", "pcs", "box", "karton"];
    }
    const matchedItem = inventory.find(item => item.name === materialName);
    if (!matchedItem || !matchedItem.batches || matchedItem.batches.length === 0) {
      return ["kg", "L", "pcs", "box", "karton"];
    }
    const containers = matchedItem.batches.map((b: any) => b.container).filter(Boolean);
    const batchUnits = matchedItem.batches.map((b: any) => b.unit).filter(Boolean);
    return Array.from(new Set([...containers, ...batchUnits]));
  };

  const checkManualItemAvailability = (item: ManualRequestItem) => {
    const material = item.materialSelect === "custom" ? item.customMaterial : item.materialSelect;
    const unit = item.unitSelect === "custom" ? item.customUnit : item.unitSelect;
    if (!material || !item.quantity) {
      alert("Harap lengkapi nama bahan dan jumlah terlebih dahulu!");
      return;
    }
    handleCheckAvailability({
      material,
      recommendedAmount: `${item.quantity} ${unit}`,
      urgency: item.urgency,
      shortage: item.quantity,
      unit: unit
    });
  };

  const handleSendManualBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = manualItems.some(item => {
      const mat = item.materialSelect === "custom" ? item.customMaterial : item.materialSelect;
      const unit = item.unitSelect === "custom" ? item.customUnit : item.unitSelect;
      return !mat || !item.quantity || !unit;
    });

    if (invalid) {
      alert("Harap isi semua kolom bahan, jumlah, dan satuan!");
      return;
    }

    setSubmittingRequest(true);
    try {
      // Find central warehouse name
      const centralKitchen = inventory.length > 0 ? "Dapur Pusat Jakarta" : "Gudang Pusat";
      const requests = manualItems.map(item => {
        const mat = item.materialSelect === "custom" ? item.customMaterial : item.materialSelect;
        const unit = item.unitSelect === "custom" ? item.customUnit : item.unitSelect;
        return {
          material: mat,
          amount: `${item.quantity} ${unit}`,
          urgency: item.urgency,
          supplierKitchenId: "k1",
          supplierKitchenName: centralKitchen
        };
      });

      await api.requestStockBatch(requests, user.kitchenId, kitchenDetail?.name);

      if (sourceNotificationId) {
        try {
          await api.markNotificationRead(sourceNotificationId);
          setSourceNotificationId(null);
        } catch (err) {
          console.error("Failed to mark notification read:", err);
        }
      }

      showNotification(`Sukses mengirimkan ${requests.length} pengajuan bahan ke Gudang Pusat!`);
      setManualItems([createEmptyManualItem()]);
      
      const reqList = await api.getStockRequests(user.kitchenId);
      setStockRequests(reqList);
    } catch (err: any) {
      alert(err.message || "Gagal mengirimkan pengajuan.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        <p className="text-slate-650 font-bold text-xs uppercase tracking-widest animate-pulse">Menghimpun Logistik Dapur...</p>
      </div>
    );
  }

  // Split availability list based on distance threshold
  const nearbySatellites = availabilityList.filter(k => !k.isCentral && k.distance <= maxDistance);
  const centralWarehouses = availabilityList.filter(k => k.isCentral);
  const farSatellites = availabilityList.filter(k => !k.isCentral && k.distance > maxDistance);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 font-bold text-sm animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-5 h-5 text-emerald-250 animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] text-white p-8 md:p-10 shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Prediksi Kebutuhan & Logistik Dapur</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
              Pengajuan Restock Bahan Mandiri
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-base max-w-2xl">
              Dapur Anda: <span className="text-primary font-bold">{kitchenDetail?.name}</span> ({kitchenDetail?.city}) • Lokasi: {kitchenDetail?.latitude || "-"}, {kitchenDetail?.longitude || "-"}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur border border-slate-700/50 p-4 rounded-2xl shrink-0 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shadow-inner shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Batas Jarak Dapur Sekitar</p>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-white text-center font-bold"
                />
                <span className="text-xs font-bold text-white">km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center border-b-2 border-slate-100 gap-8 w-full">
        <button
          onClick={() => setActiveMethodTab("AI")}
          className={cn(
            "pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative px-1 cursor-pointer",
            activeMethodTab === "AI" ? "text-primary" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Prediksi AI
          {activeMethodTab === "AI" && (
            <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary rounded-full shadow-md" />
          )}
        </button>
        <button
          onClick={() => setActiveMethodTab("Manual")}
          className={cn(
            "pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative px-1 cursor-pointer",
            activeMethodTab === "Manual" ? "text-primary" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Form Input Manual
          {activeMethodTab === "Manual" && (
            <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary rounded-full shadow-md" />
          )}
        </button>
      </div>

      {/* Main Content Area based on Tab */}
      <Card className="p-6 md:p-8 border-none rounded-[28px] shadow-xl shadow-slate-200/50 bg-white">
        
        {/* TAB 1: AI GEMINI PREDICTOR */}
        {activeMethodTab === "AI" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tighter">Prediksi Kekurangan Stok Berbasis AI</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-xl">
                  Sistem akan membaca resep menu, porsi rencana produksi aktif, stok saat ini di dapur, serta menambahkan buffer dari rata-rata wastage historis dapur Anda.
                </p>
              </div>
              <Button
                onClick={handleAIPredict}
                disabled={predicting}
                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest py-4 px-6 shadow-lg shadow-primary/20 flex items-center gap-2 shrink-0 h-12 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
              >
                <Sparkles className={cn("w-4 h-4 text-emerald-250", predicting && "animate-spin")} />
                {predicting ? "Menganalisis..." : "Minta Prediksi AI Gemini"}
              </Button>
            </div>

            {predicting && (
              <div className="py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-slate-150 border-t-primary animate-spin mx-auto" />
                <p className="text-slate-650 font-bold text-xs uppercase tracking-widest animate-pulse">Gemini AI sedang membaca histori & meramalkan shortages...</p>
              </div>
            )}

            {aiError && !predicting && (
              <div className="p-10 text-center bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                <Info className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-slate-600 font-bold text-sm">{aiError}</p>
              </div>
            )}

            {!predicting && !aiError && predictions.length === 0 && (
              <div className="py-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-150/70 space-y-3">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-slate-800 font-black tracking-tight text-base">Belum Ada Hasil Analisis</h4>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Silakan klik tombol **"Minta Prediksi AI Gemini"** di atas untuk menganalisis kekurangan bahan baku untuk produksi aktif.
                </p>
              </div>
            )}

            {!predicting && predictions.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 w-fit">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Ditemukan {predictions.length} bahan baku yang diprediksi kurang untuk rencana masak mendatang.</span>
                  </div>
                  <Button
                    onClick={handleSendAIPredictions}
                    disabled={submittingRequest}
                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Semua ke Gudang Pusat
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bahan Baku</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Butuh (Rencana)</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Stok Dapur</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Defisit</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Rekomendasi AI</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Urgensi</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reasoning AI (Historis)</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/50 backdrop-blur-sm">
                      {predictions.map((item, idx) => {
                        const urgencyColor = item.urgency === "High" 
                          ? "text-red-700 bg-red-50 border border-red-100/60" 
                          : item.urgency === "Medium"
                          ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                          : "text-slate-600 bg-slate-50 border border-slate-100/60";

                        return (
                          <tr key={idx} className="hover:bg-slate-50/40 transition-colors border-l-2 border-l-transparent hover:border-l-primary">
                            <td className="p-4 text-xs font-black text-slate-800 tracking-tight">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span>{item.material}</span>
                              </div>
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-650 text-center">{item.needed} {item.unit}</td>
                            <td className="p-4 text-xs font-bold text-slate-650 text-center">{item.currentStock} {item.unit}</td>
                            <td className="p-4 text-xs font-black text-red-500 text-center">{item.shortage} {item.unit}</td>
                            <td className="p-4 text-xs font-black text-emerald-650 text-center">
                              <span className="bg-emerald-50/70 border border-emerald-100/60 text-emerald-700 px-2 py-0.5 rounded-md text-[10px]">
                                {item.recommendedAmount}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={cn("px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider", urgencyColor)}>
                                {item.urgency}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-slate-500 leading-relaxed font-medium max-w-[280px]">{item.reasoning}</td>
                            <td className="p-4 text-right">
                              <Button
                                onClick={() => handleCheckAvailability(item)}
                                className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-md shadow-primary/10 transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>Cek Distribusi</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}        {/* TAB 2: MANUAL BATCH FORM INPUT */}
        {activeMethodTab === "Manual" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-6 mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tighter">Form Pengajuan Manual</h3>
              <p className="text-slate-550 font-medium text-xs leading-relaxed max-w-xl mt-1">
                Tulis manual daftar pesanan bahan baku jika ada bahan baku kustom di luar rencana menu atau kebutuhan mendadak lainnya.
              </p>
            </div>

            <form onSubmit={handleSendManualBatch} className="space-y-6">
              <div className="space-y-4">
                {manualItems.map((item, index) => {
                  const availableUnits = getAvailableUnitsForMaterial(item.materialSelect);

                  return (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50/50 rounded-[24px] border-2 border-transparent hover:border-slate-100 relative group transition-all">
                      
                      {/* Name Selector */}
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Bahan</label>
                        <select
                          value={item.materialSelect}
                          onChange={(e) => updateManualItem(item.id, { materialSelect: e.target.value })}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-850 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-xs"
                        >
                          <option value="" disabled>Pilih bahan baku...</option>
                          {inventory.map(invItem => (
                            <option key={invItem.id} value={invItem.name}>{invItem.name}</option>
                          ))}
                          <option value="custom" className="text-primary font-bold">-- Bahan Lain (Ketik Manual) --</option>
                        </select>

                        {item.materialSelect === "custom" && (
                          <input 
                            type="text" 
                            placeholder="Ketik nama bahan baku baru..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm text-xs mt-2"
                            value={item.customMaterial}
                            onChange={(e) => updateManualItem(item.id, { customMaterial: e.target.value })}
                            required
                          />
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="md:w-28 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Jumlah</label>
                        <input 
                          type="number"
                          step="any"
                          min="0"
                          placeholder="e.g. 10"
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={item.quantity}
                          onChange={(e) => updateManualItem(item.id, { quantity: e.target.value })}
                          required
                        />
                      </div>

                      {/* Unit */}
                      <div className="md:w-36 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Satuan</label>
                        <select 
                          value={item.unitSelect}
                          onChange={(e) => updateManualItem(item.id, { unitSelect: e.target.value })}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-xs"
                        >
                          {availableUnits.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                          <option value="custom" className="text-primary font-bold">-- Satuan Lain --</option>
                        </select>

                        {item.unitSelect === "custom" && (
                          <input 
                            type="text" 
                            placeholder="Ketik satuan baru..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm text-xs mt-2"
                            value={item.customUnit}
                            onChange={(e) => updateManualItem(item.id, { customUnit: e.target.value })}
                            required
                          />
                        )}
                      </div>

                      {/* Urgency */}
                      <div className="md:w-32 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Urgensi</label>
                        <select 
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-xs"
                          value={item.urgency}
                          onChange={(e) => updateManualItem(item.id, { urgency: e.target.value })}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex items-end gap-2 shrink-0 md:pb-1">
                        <Button
                          type="button"
                          onClick={() => checkManualItemAvailability(item)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest p-3 rounded-xl h-11 border-none cursor-pointer"
                        >
                          Cek Dapur
                        </Button>
                        
                        {manualItems.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => removeManualItem(item.id)}
                            className="w-11 h-11 bg-white hover:bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow transition-all border border-slate-200 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Form Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    type="button"
                    onClick={addManualItem}
                    className="group flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[9px] hover:text-primary-dark transition-all px-4 py-3 rounded-full bg-primary-light border-none cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                    Tambah Baris
                  </button>
                  
                  <button 
                    type="button"
                    onClick={populateFromDeficits}
                    className="flex items-center gap-2 text-emerald-650 font-black uppercase tracking-[0.2em] text-[9px] hover:text-emerald-700 transition-all px-4 py-3 rounded-full bg-emerald-50 border-none cursor-pointer h-10"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-600" />
                    <span>Isi Otomatis dari Defisit Produksi</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 sm:flex-none px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-400 cursor-pointer"
                    onClick={() => setManualItems([createEmptyManualItem()])}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submittingRequest}
                    className="flex-1 sm:flex-none px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim ke Gudang Pusat
                  </Button>
                </div>
              </div>

            </form>
          </div>
        )}

      </Card>

      {/* Dynamic Stock Availability Checking Panel (Targeting Kitchen Selection) */}
      <AnimatePresence>
        {selectedMaterial && (
          <Modal
            isOpen={!!selectedMaterial}
            onClose={() => setSelectedMaterial(null)}
            title={`Cek Distribusi & Jarak: ${selectedMaterial.material}`}
          >
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Defisit Teranalisis</span>
                <p className="text-slate-800 font-extrabold text-sm">
                  Dapur membutuhkan <span className="text-red-500">{selectedMaterial.shortage || selectedMaterial.needed} {selectedMaterial.unit}</span>. Pengajuan restock: <span className="text-emerald-600">{selectedMaterial.recommendedAmount}</span>.
                </p>
              </div>

              {checkingAvailability ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-primary animate-spin mx-auto" />
                  <p className="text-slate-550 text-xs font-bold uppercase tracking-wider animate-pulse">Menghubungi unit satelit lain...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Option 1: Nearest satellite kitchens within maxDistance */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                      <span>DAPUR SEKITAR TERDEKAT (Maks {maxDistance} km)</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[8px]">{nearbySatellites.length} Dapur</span>
                    </h5>
                    
                    {nearbySatellites.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-150 text-center bg-slate-50/20">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-[11px] font-bold text-slate-500 leading-tight">Tidak ada dapur sekitar (jarak ≤ {maxDistance} km) yang memiliki stok bahan ini.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {nearbySatellites.map((k) => (
                          <div key={k.kitchenId} className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-all">
                            <div>
                              <p className="font-extrabold text-slate-800 text-sm tracking-tight">{k.kitchenName}</p>
                              <p className="text-[10px] text-slate-450 font-bold uppercase mt-0.5">
                                Jarak: <span className="text-slate-650 font-black">{k.distance} km</span> • Stok: <span className="text-primary font-black">{k.totalWeight}</span>
                              </p>
                            </div>
                            <Button
                              onClick={() => handleRequestStock(k)}
                              disabled={submittingRequest}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg cursor-pointer"
                            >
                              Minta dari Sini
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Option 2: Gudang Pusat (Central Kitchen) always available */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GUDANG PUSAT (SCM CENTER)</h5>
                    {centralWarehouses.map((k) => (
                      <div key={k.kitchenId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight">{k.kitchenName} (Gudang Pusat)</p>
                          <p className="text-[10px] text-slate-450 font-bold uppercase mt-0.5">
                            Jarak: <span className="text-slate-650 font-bold">{k.distance} km</span> • Sisa Stok: <span className="text-primary font-black">{k.totalWeight}</span>
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRequestStock(k)}
                          disabled={submittingRequest}
                          className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                        >
                          Minta ke Pusat
                        </Button>
                      </div>
                    ))}
                    {centralWarehouses.length === 0 && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500 font-bold">
                        Gudang Pusat tidak terdaftar dalam database koordinat.
                      </div>
                    )}
                  </div>

                  {/* Show far kitchens for visibility, just in case user wants to expand radius */}
                  {farSatellites.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">DAPUR LAIN DI LUAR RADIUS BATAS JARAK</p>
                      <div className="text-[10px] text-slate-500 font-medium leading-normal space-y-1">
                        {farSatellites.map(k => (
                          <div key={k.kitchenId} className="flex justify-between items-center text-slate-500">
                            <span>• {k.kitchenName} ({k.distance} km)</span>
                            <span className="font-bold">Stok: {k.totalWeight}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[8px] text-slate-400 italic">
                        Tip: Jika Anda ingin meminta dari dapur di atas, naikkan "Batas Jarak Dapur Sekitar" di bagian atas halaman.
                      </p>
                    </div>
                  )}

                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Tracking Panel: Status real-time restock darurat dapur */}
      <Card className="p-6 md:p-8 rounded-[32px] border-2 border-slate-50/50 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter">Papan Pelacakan Pengiriman Bahan</h3>
          <p className="text-slate-550 font-bold text-[10px] uppercase tracking-widest mt-1">
            Status real-time pengiriman logistik dapur Anda dari gudang pusat atau dapur satelit lain
          </p>
        </div>

        {stockRequests.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-150 rounded-3xl space-y-2">
            <Package className="w-10 h-10 text-slate-350 mx-auto" />
            <p className="text-slate-600 font-bold text-sm">Belum ada pengajuan restock.</p>
            <p className="text-slate-600 text-xs">Setiap restock yang diajukan di atas akan muncul pelacakannya di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dapur Peminta</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bahan Baku</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Urgensi</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50 backdrop-blur-sm">
                {stockRequests.map((req: any) => {
                  const urgencyColor = req.urgency === "High" || req.urgency === "Kritis"
                    ? "text-red-700 bg-red-50 border border-red-100/60" 
                    : req.urgency === "Medium" || req.urgency === "Mendesak"
                    ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                    : "text-slate-600 bg-slate-50 border border-slate-100/60";

                  const supplierDisplay = req.supplierKitchenName || "Gudang Pusat";

                  return (
                    <tr 
                      key={req.id} 
                      onClick={() => {
                        setSelectedTrackingRequest(req);
                        setTrackingDetailOpen(true);
                      }}
                      className="hover:bg-slate-50/40 transition-colors border-l-2 border-l-transparent hover:border-l-primary cursor-pointer"
                    >
                      <td className="p-4 text-xs font-black text-slate-800 tracking-tight">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span>{req.kitchenName || kitchenDetail?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-black text-slate-800 tracking-tight">
                        <span>{req.material}</span>
                      </td>
                      <td className="p-4 text-xs font-extrabold text-slate-900 tracking-tight">{req.amount}</td>
                      <td className="p-4">
                        <span className={cn("px-2.5 py-1 rounded-full uppercase tracking-wider font-black text-[9px]", urgencyColor)}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-650 tracking-tight">{supplierDisplay}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Tracking Request Detail Modal */}
      <AnimatePresence>
        {isTrackingDetailOpen && selectedTrackingRequest && (
          <Modal
            isOpen={isTrackingDetailOpen}
            onClose={() => {
              setTrackingDetailOpen(false);
              setSelectedTrackingRequest(null);
            }}
            title={`Detail Permintaan Stock: #${selectedTrackingRequest.id}`}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Dapur Peminta</span>
                  <span className="text-slate-800 font-extrabold">{selectedTrackingRequest.kitchenName || kitchenDetail?.name}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Tujuan / Supplier</span>
                  <span className="text-slate-800 font-extrabold">{selectedTrackingRequest.supplierKitchenName || "Gudang Pusat"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Bahan Baku</span>
                  <span className="text-primary font-black">{selectedTrackingRequest.material}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Jumlah</span>
                  <span className="text-slate-900 font-black">{selectedTrackingRequest.amount}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Urgensi</span>
                  <div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider inline-block",
                      selectedTrackingRequest.urgency === "High" || selectedTrackingRequest.urgency === "Kritis"
                        ? "text-red-700 bg-red-50 border border-red-100/60" 
                        : selectedTrackingRequest.urgency === "Medium" || selectedTrackingRequest.urgency === "Mendesak"
                        ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                        : "text-slate-600 bg-slate-50 border border-slate-100/60"
                    )}>
                      {selectedTrackingRequest.urgency}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Status</span>
                  <div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider inline-block border",
                      selectedTrackingRequest.status === "Approved"
                        ? "bg-blue-50 text-blue-600 border-blue-100/60"
                        : selectedTrackingRequest.status === "Delivered" || selectedTrackingRequest.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/60"
                        : selectedTrackingRequest.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border-amber-100/60 shadow-sm"
                        : "bg-red-50 text-red-650 border-red-100/60"
                    )}>
                      {selectedTrackingRequest.status === "Pending" 
                        ? "Menunggu" 
                        : selectedTrackingRequest.status === "Approved" 
                        ? "Disetujui" 
                        : selectedTrackingRequest.status === "Denied" || selectedTrackingRequest.status === "Rejected"
                        ? "Ditolak"
                        : "Selesai"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 font-mono">Tanggal Pengajuan</span>
                <span className="text-slate-800">
                  {new Date(selectedTrackingRequest.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}{" "}
                  pukul{" "}
                  {new Date(selectedTrackingRequest.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}{" "}
                  WIB
                </span>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-medium">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Catatan Admin / Feedback:</span>
                {selectedTrackingRequest.adminNotes ? (
                  <p className="text-slate-700 font-bold leading-relaxed">{selectedTrackingRequest.adminNotes}</p>
                ) : (
                  <p className="text-slate-400 italic">Tidak ada catatan feedback.</p>
                )}
              </div>
              
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setTrackingDetailOpen(false);
                    setSelectedTrackingRequest(null);
                  }}
                  className="w-full py-3.5 font-black uppercase text-[10px] tracking-widest bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
};
