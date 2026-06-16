import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { Box, Trash2, AlertCircle, Calendar, Hash, ArrowUpDown, ChevronDown, Package, Warehouse, CheckSquare, Check, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { isBefore, addDays, format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/src/services/api";

export const ChefStock = ({ user }: { user: any }) => {
  const [stockItems, setStockItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isWastageModalOpen, setWastageModalOpen] = React.useState(false);
  const [selectedBatch, setSelectedBatch] = React.useState<any>(null);
  const [wastageWeight, setWastageWeight] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [wastageReason, setWastageReason] = React.useState("Busuk");
  const [wastageNotes, setWastageNotes] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  // Validation States
  const [isValidationModalOpen, setValidationModalOpen] = React.useState(false);
  const [approvedRequests, setApprovedRequests] = React.useState<any[]>([]);
  const [selectedRequestIds, setSelectedRequestIds] = React.useState<Record<string, boolean>>({});
  const [validatingArrival, setValidatingArrival] = React.useState(false);
  const [validationError, setValidationError] = React.useState("");

  const refreshStock = React.useCallback(() => {
    if (user?.kitchenId) {
      setLoading(true);
      Promise.all([
        api.getKitchenDetail(user.kitchenId),
        api.getStockRequests(user.kitchenId)
      ]).then(([kitchenRes, requestsRes]) => {
        setStockItems(kitchenRes.stock || []);
        const approved = requestsRes.filter((r: any) => r.status === 'Approved');
        setApprovedRequests(approved);
        
        const initialSelection: Record<string, boolean> = {};
        approved.forEach((r: any) => {
          initialSelection[r.id] = true;
        });
        setSelectedRequestIds(initialSelection);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load stock detail and requests:", err);
        setLoading(false);
      });
    }
  }, [user?.kitchenId]);

  React.useEffect(() => {
    refreshStock();
  }, [refreshStock]);

  const handleValidateArrival = async () => {
    const idsToValidate = Object.keys(selectedRequestIds).filter(id => selectedRequestIds[id]);
    if (idsToValidate.length === 0) {
      setValidationError("Silakan pilih minimal satu bahan baku untuk divalidasi.");
      return;
    }

    setValidatingArrival(true);
    setValidationError("");
    try {
      await api.validateStockArrival(idsToValidate);
      setSuccessMsg("Bahan baku berhasil divalidasi dan ditambahkan ke stok dapur!");
      setValidationModalOpen(false);
      refreshStock();
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err: any) {
      setValidationError(err?.message || "Gagal memvalidasi kedatangan bahan baku.");
    } finally {
      setValidatingArrival(false);
    }
  };

  // Grouping by material (which is already provided as an item in stock)
  // Our new structure has items, and each item has batches
  const groupedStock = React.useMemo(() => {
    return stockItems.map(item => ({
      ...item,
      batches: (item.batches || []).sort((a: any, b: any) => parseISO(a.expiry).getTime() - parseISO(b.expiry).getTime())
    }));
  }, [stockItems]);

  const handleReportWastage = (batch: any) => {
    setSelectedBatch(batch);
    setWastageWeight("");
    setWastageReason("Busuk");
    setWastageNotes("");
    setErrorMsg("");
    setWastageModalOpen(true);
  };

  const handleWastageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !user?.kitchenId) return;

    try {
      setErrorMsg("");
      await api.reportWastage({
        batchId: selectedBatch.id,
        kitchenId: user.kitchenId,
        materialName: selectedBatch.material,
        container: selectedBatch.container,
        weight: parseFloat(wastageWeight),
        reason: wastageReason,
        notes: wastageNotes
      });
      setWastageModalOpen(false);
      setSuccessMsg("Laporan wastage berhasil dikirim! (Sukses)");
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
      refreshStock();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal melaporkan wastage.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {successMsg && (
        <div id="toastSuccess" className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 font-bold text-sm toast">
          <span>{successMsg}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Stok Dapur Granular</h2>
          <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Monitor persediaan per wadah (FEFO)</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             variant="primary" 
             size="sm" 
             className="h-9 text-[10px] bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 active:scale-95 transition-all" 
             onClick={() => {
               setValidationError("");
               setValidationModalOpen(true);
             }}
           >
             <CheckSquare className="w-4 h-4" />
             Validasi Bahan Baku Sampai
             {approvedRequests.length > 0 && (
               <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-white text-primary rounded-full font-black animate-pulse">
                 {approvedRequests.length}
               </span>
             )}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {groupedStock.map((material) => (
          <StockRow 
             key={material.name} 
             material={material} 
             onReportWastage={handleReportWastage}
          />
        ))}
      </div>

      {/* Wastage Report Modal */}
      <Modal 
        isOpen={isWastageModalOpen} 
        onClose={() => setWastageModalOpen(false)} 
        title="Laporan Kerugian (Wastage)"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600 shrink-0">
               <AlertCircle className="w-6 h-6" />
            </div>
             <div>
                <h4 className="font-extrabold text-red-800 text-xl tracking-tight">{selectedBatch?.material}</h4>
                <p className="text-[10px] text-red-700 font-bold uppercase tracking-widest mt-1">
                  ID Batch: {selectedBatch?.id} • {selectedBatch?.package_capacity 
                    ? `${selectedBatch.qty_packed > 0 ? `${selectedBatch.qty_packed} ` : ''}${selectedBatch.container} (@ ${selectedBatch.package_capacity} ${selectedBatch.package_unit})${selectedBatch.qty_loose > 0 ? ` + ${selectedBatch.qty_loose} ${selectedBatch.package_unit}` : ''}` 
                    : selectedBatch?.container}
                </p>
             </div>
          </div>

          <form className="space-y-4" onSubmit={handleWastageSubmit}>
            {errorMsg && (
              <div id="alert_ExceedsStockError" className="p-4 bg-red-50 border border-red-200 text-red-650 rounded-[20px] font-bold text-xs">
                {errorMsg}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Jumlah Dibuang ({selectedBatch?.package_unit || selectedBatch?.unit || 'kg'})
                </label>
                <input 
                  type="number" 
                  name="amount"
                  step="any" 
                  required
                  value={wastageWeight}
                  onChange={(e) => setWastageWeight(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all" 
                  placeholder="0.0" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Alasan</label>
                <select 
                  name="reason"
                  id="reason"
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all"
                >
                  <option value="Busuk">Busuk</option>
                  <option value="Kedaluwarsa">Kedaluwarsa</option>
                  <option value="Tumpah / Rusak">Tumpah / Rusak</option>
                  <option value="Kelalaian Manusia">Kelalaian Manusia</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Catatan Tambahan</label>
              <textarea 
                value={wastageNotes}
                onChange={(e) => setWastageNotes(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all h-24 resize-none" 
                placeholder="Ceritakan detail kronologi..." 
              />
            </div>
            <Button className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs mt-4" variant="danger" type="submit">
              Submit Laporan Kerugian
            </Button>
          </form>
        </div>
      </Modal>

      {/* Validation Modal */}
      <Modal 
        isOpen={isValidationModalOpen} 
        onClose={() => setValidationModalOpen(false)} 
        title="Validasi Kedatangan Bahan Baku"
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="p-4 bg-primary-light border border-primary/20 rounded-2xl">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
              Validasi Pengiriman / Penerimaan
            </span>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">
              Berikut adalah daftar pengajuan restock bahan baku Anda yang sudah di-approve oleh Admin/Koordinator. Silakan checklist bahan baku yang sudah sampai di dapur fisik secara benar untuk ditambahkan ke daftar stok.
            </p>
          </div>

          {validationError && (
            <div className="p-4 bg-red-50 border border-red-150 text-red-650 rounded-2xl text-xs font-bold shadow-sm">
              {validationError}
            </div>
          )}

          {approvedRequests.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 space-y-2">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h5 className="font-extrabold text-slate-800 text-sm">Tidak Ada Bahan Baku Menunggu Validasi</h5>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Saat ini belum ada kiriman bahan baku yang di-approve oleh Admin untuk dapur Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {approvedRequests.map((req: any) => {
                const isSelected = !!selectedRequestIds[req.id];
                const dateStr = req.createdAt ? new Date(req.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
                
                return (
                  <div 
                    key={req.id} 
                    onClick={() => {
                      setSelectedRequestIds(prev => ({
                        ...prev,
                        [req.id]: !prev[req.id]
                      }));
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-primary/20 transition-all cursor-pointer select-none",
                      isSelected && "bg-white border-primary/30 shadow-md shadow-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary text-white" : "border-slate-350 bg-white"
                      )}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-sm tracking-tight">{req.material}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Requested: {dateStr}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-350" />
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider",
                            req.urgency === 'High' ? 'bg-red-50 text-red-650' : req.urgency === 'Medium' ? 'bg-amber-50 text-amber-650' : 'bg-slate-50 text-slate-650'
                          )}>
                            {req.urgency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-primary tracking-tight">{req.amount}</span>
                      {req.note && (
                        <p className="text-[10px] text-slate-450 italic font-medium mt-0.5 max-w-[180px] truncate" title={req.note}>
                          Catatan: {req.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {approvedRequests.length > 0 && (
            <Button 
              className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2" 
              onClick={handleValidateArrival}
              disabled={validatingArrival}
            >
              {validatingArrival ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses Validasi...
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Validasi & Tambah ke Stok ({Object.keys(selectedRequestIds).filter(id => selectedRequestIds[id]).length} Item)
                </>
              )}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

const StockRow = ({ material, onReportWastage }: { material: any, onReportWastage: (batch: any) => void, key?: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Card className="p-0 overflow-hidden transform-gpu border-slate-50 rounded-[24px] shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div 
        className={cn(
          "p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors",
          isOpen && "bg-slate-50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0 shadow-sm">
          <Package className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 text-lg tracking-tighter leading-tight">{material.name}</h4>
          <div className="flex items-center gap-2 mt-1 px-0.5">
            <span className="text-[9px] font-bold text-slate-555 uppercase tracking-widest">{material.batches.length} Wadah Aktif</span>
            <span className="w-1 h-1 rounded-full bg-slate-350" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{material.totalWeight} Total</span>
          </div>
        </div>
        <div className={cn(
          "w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center transition-all",
          isOpen ? "bg-primary text-white border-primary" : "text-slate-300"
        )}>
           <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-slate-50/50"
          >
            <div className="p-4 pt-0 space-y-2">
              {material.batches.map((batch: any) => {
                const expiryDate = parseISO(batch.expiry);
                const isNearExpiry = isBefore(expiryDate, addDays(new Date(), 30));

                return (
                  <div key={batch.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 bg-white border border-slate-50 rounded-xl shadow-sm hover:border-primary/20 transition-all group/item">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 rounded-xl group-hover/item:bg-primary-light transition-colors">
                        <Box className="w-5 h-5 text-slate-400 group-hover/item:text-primary" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight text-base leading-none">
                          {batch.package_capacity 
                            ? `${batch.qty_packed > 0 ? `${batch.qty_packed} ` : ''}${batch.container} (@ ${batch.package_capacity} ${batch.package_unit})${batch.qty_loose > 0 ? ` + ${batch.qty_loose} ${batch.package_unit}` : ''}`
                            : batch.container}
                        </p>
                        <p className="text-[9px] text-slate-550 font-bold uppercase tracking-[0.2em] flex items-center gap-1 mt-1.5">
                          <Hash className="w-2.5 h-2.5 text-slate-450" />
                          {batch.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 md:gap-8">
                       <div className="flex flex-col text-right md:text-left">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">BERAT</span>
                         <span className="font-black text-slate-800 text-sm tracking-tighter">{batch.weight}</span>
                       </div>
                       
                       <div className="flex flex-col text-right md:text-left">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">EXPIRED</span>
                         <div className="flex items-center gap-2">
                            <span className={cn("font-black text-sm tracking-tighter", isNearExpiry ? "text-red-500" : "text-slate-800")}>
                               {format(expiryDate, 'dd/MM/yyyy')}
                            </span>
                         </div>
                       </div>

                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 px-3 text-red-400 hover:text-red-650 hover:bg-red-50 font-black text-[9px] uppercase tracking-widest rounded-lg"
                        onClick={() => onReportWastage({ ...batch, material: material.name })}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Lapor
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
