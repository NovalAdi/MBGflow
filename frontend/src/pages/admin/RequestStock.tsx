import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { PackageSearch, Plus, Trash2, Send, ArrowLeft, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";

interface RequestItem {
  id: string;
  material: string;
  materialSelect: string;
  customMaterial: string;
  quantity: string;
  unitSelect: string;
  customUnit: string;
  urgency: string;
}

export const RequestStock = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSuccessModalOpen, setSuccessModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inventory, setInventory] = React.useState<any[]>([]);
  
  // Initial row template
  const createEmptyItem = (): RequestItem => ({
    id: Math.random().toString(36).substr(2, 9),
    material: "",
    materialSelect: "",
    customMaterial: "",
    quantity: "",
    unitSelect: "kg",
    customUnit: "",
    urgency: "Normal"
  });

  const [items, setItems] = React.useState<RequestItem[]>([createEmptyItem()]);

  // Dynamic unit options builder based on selected material
  const getAvailableUnitsForMaterial = React.useCallback((materialName: string) => {
    if (!materialName || materialName === "custom") {
      return ["kg", "g", "L", "ml", "pcs", "box", "karton"];
    }
    
    const matchedItem = inventory.find(item => item.name === materialName);
    if (!matchedItem || !matchedItem.batches || matchedItem.batches.length === 0) {
      return ["kg", "L", "pcs", "box", "karton"];
    }

    // Extract unique physical containers from batches
    const containers = matchedItem.batches
      .map((b: any) => b.container)
      .filter(Boolean) as string[];
    
    // Extract base units from batches
    const batchUnits = matchedItem.batches
      .map((b: any) => b.unit)
      .filter(Boolean) as string[];

    // Merge them and get unique values
    const uniqueOptions = Array.from(new Set([...containers, ...batchUnits]));
    
    return uniqueOptions.length > 0 ? uniqueOptions : ["kg", "L", "pcs"];
  }, [inventory]);

  // Load inventory on mount to resolve materials and units
  React.useEffect(() => {
    api.getInventory()
      .then((inv) => {
        setInventory(inv);
        
        // Parse incoming location state if pre-populated (e.g. from low stock trigger)
        const initialState = location.state as { materials?: { material: string, amount: string }[] } | null;
        if (initialState?.materials && initialState.materials.length > 0) {
          const parsed = initialState.materials.map((m) => {
            const amountStr = m.amount || "";
            const match = amountStr.match(/^([\d.,]+)\s*(.*)$/);
            const quantity = match ? match[1] : amountStr;
            const unit = match ? match[2].trim() : "";

            // Check if material is standard
            const matchedItem = inv.find(item => item.name.toLowerCase() === m.material.toLowerCase());
            const materialSelect = matchedItem ? matchedItem.name : "custom";
            const customMaterial = materialSelect === "custom" ? m.material : "";

            // Determine dynamic units for this matched item
            let availableUnits: string[] = ["kg", "L", "pcs", "box", "karton"];
            if (matchedItem && matchedItem.batches) {
              const containers = matchedItem.batches.map((b: any) => b.container).filter(Boolean);
              const batchUnits = matchedItem.batches.map((b: any) => b.unit).filter(Boolean);
              availableUnits = Array.from(new Set([...containers, ...batchUnits]));
            }

            const unitExists = availableUnits.some(u => u.toLowerCase() === unit.toLowerCase());
            const unitSelect = unitExists 
              ? availableUnits.find(u => u.toLowerCase() === unit.toLowerCase()) || unit
              : unit 
              ? "custom" 
              : availableUnits[0] || "kg";
            const customUnit = unitSelect === "custom" ? unit : "";

            return {
              id: Math.random().toString(36).substr(2, 9),
              material: m.material,
              materialSelect,
              customMaterial,
              quantity,
              unitSelect,
              customUnit,
              urgency: "Normal"
            };
          });
          setItems(parsed);
        }
      })
      .catch((err) => console.error("Gagal mengambil daftar inventori:", err));
  }, [location.state]);

  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<RequestItem>) => {
    setItems(prevItems => prevItems.map(item => {
      if (item.id !== id) return item;
      
      const newItem = { ...item, ...updates };

      // Maintain final combined material string
      if (updates.materialSelect !== undefined || updates.customMaterial !== undefined) {
        newItem.material = newItem.materialSelect === "custom" 
          ? newItem.customMaterial 
          : newItem.materialSelect;

        // Reset units dropdown when material changes to prevent mismatch
        if (updates.materialSelect !== undefined) {
          const newUnits = getAvailableUnitsForMaterial(newItem.materialSelect);
          newItem.unitSelect = newUnits[0] || "kg";
          newItem.customUnit = "";
        }
      }

      return newItem;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double check that everything is filled
    const invalid = items.some(item => {
      const materialVal = item.materialSelect === "custom" ? item.customMaterial : item.materialSelect;
      const quantityVal = item.quantity;
      const unitVal = item.unitSelect === "custom" ? item.customUnit : item.unitSelect;
      return !materialVal || !quantityVal || !unitVal;
    });

    if (invalid) {
      alert("Harap isi semua kolom bahan baku, jumlah, dan satuan!");
      return;
    }

    setIsLoading(true);
    try {
      const requests = items.map((item) => {
        const materialVal = item.materialSelect === "custom" ? item.customMaterial : item.materialSelect;
        const quantityVal = item.quantity;
        const unitVal = item.unitSelect === "custom" ? item.customUnit : item.unitSelect;
        
        return {
          material: materialVal,
          amount: `${quantityVal} ${unitVal}`, // Combines value + unit (e.g. "5 jerigen")
          urgency: item.urgency
        };
      });

      await api.requestStockBatch(requests);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Gagal mengirimkan pengajuan stok:", error);
      alert("Gagal memproses pengajuan restock bahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Permintaan Bahan Baku</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Ajukan penambahan stok ke Logistics Center</p>
        </div>
      </div>

      <Card className="p-6 border-none rounded-[28px] shadow-xl shadow-slate-200/50 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {items.map((item, index) => {
              const availableUnits = getAvailableUnitsForMaterial(item.materialSelect);

              return (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-5 bg-slate-50/50 rounded-[24px] border-2 border-transparent hover:border-slate-100 relative group transition-all">
                  
                  {/* Raw Material Select & Custom input */}
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Bahan</label>
                    <select
                      value={item.materialSelect}
                      onChange={(e) => updateItem(item.id, { materialSelect: e.target.value })}
                      required
                      className="w-full bg-white border-2 border-transparent rounded-xl p-3.5 font-black text-slate-800 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-sm"
                    >
                      <option value="" disabled>Pilih bahan baku...</option>
                      {inventory.map(invItem => (
                        <option key={invItem.id} value={invItem.name}>{invItem.name}</option>
                      ))}
                      <option value="custom" className="text-primary font-bold">-- Bahan Lain (Isi Sendiri) --</option>
                    </select>

                    {item.materialSelect === "custom" && (
                      <input 
                        type="text" 
                        placeholder="Ketik nama bahan baku baru..."
                        className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm text-sm mt-2 animate-in fade-in slide-in-from-top-2 duration-205"
                        value={item.customMaterial}
                        onChange={(e) => updateItem(item.id, { customMaterial: e.target.value })}
                        required
                      />
                    )}
                  </div>

                  {/* Quantity Input */}
                  <div className="md:w-32 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Jumlah</label>
                    <input 
                      type="number"
                      step="any"
                      min="0"
                      placeholder="e.g. 50"
                      className="w-full bg-white border-2 border-transparent rounded-xl p-3.5 font-black text-slate-800 focus:border-primary outline-none transition-all shadow-sm tracking-tight text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                      required
                    />
                  </div>

                  {/* Dynamic Unit Dropdown & Custom input */}
                  <div className="md:w-48 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Satuan</label>
                    <select 
                      value={item.unitSelect}
                      onChange={(e) => updateItem(item.id, { unitSelect: e.target.value })}
                      required
                      className="w-full bg-white border-2 border-transparent rounded-xl p-3.5 font-black text-slate-800 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-sm"
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
                        className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-800 focus:border-primary outline-none transition-all shadow-sm text-sm mt-2 animate-in fade-in slide-in-from-top-2 duration-205"
                        value={item.customUnit}
                        onChange={(e) => updateItem(item.id, { customUnit: e.target.value })}
                        required
                      />
                    )}
                  </div>

                  {/* Level of Urgency */}
                  <div className="md:w-40 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Level Urgensi</label>
                    <select 
                      className="w-full bg-white border-2 border-transparent rounded-xl p-3.5 font-black text-slate-800 focus:border-primary outline-none transition-all shadow-sm cursor-pointer text-sm"
                      value={item.urgency}
                      onChange={(e) => updateItem(item.id, { urgency: e.target.value })}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Mendesak">Mendesak</option>
                      <option value="Kritis">Kritis</option>
                    </select>
                  </div>

                  {items.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="absolute -right-3 -top-3 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all border-none group-hover:scale-110 active:scale-90 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-50">
            <button 
              type="button"
              onClick={addItem}
              className="group flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[9px] hover:text-primary-dark transition-all px-4 py-3 rounded-full bg-primary-light cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
              Baris Baru
            </button>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                type="button" 
                variant="ghost" 
                className="flex-1 md:flex-none px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-350 cursor-pointer"
                onClick={() => setItems([createEmptyItem()])}
              >
                Reset Form
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 md:flex-none px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? "PROSES..." : (
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    Kirim Permintaan
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <div className="p-6 bg-primary-light rounded-[24px] border border-primary/5 flex gap-4 items-start">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
           <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-black text-primary uppercase text-[9px] tracking-[0.2em]">Logistics Protocol</p>
          <p className="text-xs text-primary/80 font-bold leading-relaxed tracking-tight">
            Permintaan akan diteruskan ke tim gudang pusat. Status "Dikirim" menandakan bahan sedang dalam perjalanan dengan estimasi 1x24 jam.
          </p>
        </div>
      </div>

      <Modal isOpen={isSuccessModalOpen} onClose={() => { setSuccessModalOpen(false); navigate("/admin/planning"); }} title="Status Pengajuan">
        <div className="py-10 text-center space-y-8">
          <div className="w-24 h-24 bg-primary-light text-primary rounded-[32px] flex items-center justify-center mx-auto shadow-inner group transition-all">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">Data Terkirim!</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
              Total {items.length} item permintaan bahan telah didaftarkan ke sistem logistik.
            </p>
          </div>
          <Button 
            onClick={() => { setSuccessModalOpen(false); navigate("/admin/planning"); }}
            className="w-full py-6 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 cursor-pointer"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </Modal>
    </div>
  );
};
