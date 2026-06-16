import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { 
  PackageSearch, 
  CheckCircle2, 
  AlertTriangle, 
  Hourglass, 
  Truck, 
  Info, 
  MessageSquare,
  XCircle,
  FileText,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export const RequestStock = () => {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [kitchens, setKitchens] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"requests-desc" | "requests-asc" | "name">("requests-desc");
  const [loading, setLoading] = React.useState(true);
  
  // Detail Modal States
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null);
  const [adminNote, setAdminNote] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [modalError, setModalError] = React.useState<string | null>(null);

  // Bulk Action States
  const [isBulkModalOpen, setBulkModalOpen] = React.useState(false);
  const [bulkActionType, setBulkActionType] = React.useState<"Pending" | "Denied">("Pending");
  const [bulkKitchenName, setBulkKitchenName] = React.useState("");
  const [bulkRequests, setBulkRequests] = React.useState<any[]>([]);
  const [bulkNote, setBulkNote] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState<{ title: string; message: string } | null>(null);

  const loadRequests = React.useCallback(async () => {
    setLoading(true);
    try {
      const [reqData, kitchenData] = await Promise.all([
        api.getStockRequests(),
        api.getKitchens()
      ]);
      setRequests(reqData);
      setKitchens(kitchenData);
    } catch (error) {
      console.error("Gagal mengambil data permintaan stock:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleOpenDetailModal = (req: any) => {
    setSelectedRequest(req);
    setAdminNote(req.adminNotes || "");
    setModalError(null);
    setDetailModalOpen(true);
  };

  const handleProcessRequest = async (status: string) => {
    if (!selectedRequest) return;
    setUpdatingId(selectedRequest.id);
    setModalError(null);

    try {
      await api.updateStockRequestStatus(selectedRequest.id, status, adminNote);
      setDetailModalOpen(false);
      setSelectedRequest(null);
      // Reload
      const data = await api.getStockRequests();
      setRequests(data);
    } catch (error: any) {
      setModalError(error.message || "Gagal memperbarui status permintaan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkApprove = async (kitchenName: string, pendingReqs: any[]) => {
    if (pendingReqs.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        pendingReqs.map(r => 
          api.updateStockRequestStatus(r.id, "Approved", "Disetujui secara masal")
        )
      );
      await loadRequests();
    } catch (error) {
      console.error(error);
      setAlertMessage({ title: "Gagal Menyetujui", message: "Gagal menyetujui seluruh permintaan dapur ini." });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBulkModal = (kitchenName: string, pendingReqs: any[], type: "Pending" | "Denied") => {
    setBulkKitchenName(kitchenName);
    setBulkRequests(pendingReqs);
    setBulkActionType(type);
    setBulkNote("");
    setBulkModalOpen(true);
  };

  const handleConfirmBulkAction = async () => {
    if (bulkRequests.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        bulkRequests.map(r => 
          api.updateStockRequestStatus(r.id, bulkActionType, bulkNote)
        )
      );
      setBulkModalOpen(false);
      await loadRequests();
    } catch (error) {
      console.error(error);
      setAlertMessage({ title: "Gagal Memproses", message: "Gagal memproses perubahan masal dapur ini." });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = React.useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const q = searchQuery.toLowerCase().trim();
    return requests.filter(r => {
      // Get matching kitchen
      const k = kitchens.find(item => item.id === r.kitchenId || item.name.toLowerCase() === r.kitchenName?.toLowerCase());
      const matchesName = r.kitchenName?.toLowerCase().includes(q) || false;
      const matchesCity = k?.city?.toLowerCase().includes(q) || false;
      const matchesAddress = k?.address?.toLowerCase().includes(q) || false;
      return matchesName || matchesCity || matchesAddress;
    });
  }, [requests, kitchens, searchQuery]);

  // Group requests by kitchen name
  const groupedRequests = React.useMemo(() => {
    return filteredRequests.reduce((groups: Record<string, any[]>, r) => {
      const name = r.kitchenName || "Dapur Tidak Dikenal";
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(r);
      return groups;
    }, {} as Record<string, any[]>);
  }, [filteredRequests]);

  // Sort groups by selected method
  const sortedGroupedRequests = React.useMemo(() => {
    const entries = Object.entries(groupedRequests);
    entries.sort((a, b) => {
      const nameA = a[0];
      const nameB = b[0];
      const countA = (a[1] as any[]).length;
      const countB = (b[1] as any[]).length;

      if (sortBy === "requests-desc") {
        return countB - countA;
      }
      if (sortBy === "requests-asc") {
        return countA - countB;
      }
      if (sortBy === "name") {
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
    return entries;
  }, [groupedRequests, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        <p className="text-slate-655 font-bold text-xs uppercase tracking-widest animate-pulse">Menghimpun Logistik Dapur...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Permintaan Bahan Baku</h1>
          <p className="text-slate-650 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Kelola Seluruh Pengajuan Restock Dapur Satelit</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari dapur, kota atau daerah..."
            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent rounded-[24px] focus:border-primary outline-none transition-all shadow-sm font-black text-slate-800 tracking-tight"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-white border-2 border-transparent rounded-[24px] px-6 py-2 shadow-sm focus-within:border-primary transition-all">
          <SlidersHorizontal className="w-5 h-5 text-slate-500" />
          <select 
            className="bg-transparent border-none outline-none py-3 text-slate-800 font-black text-xs uppercase tracking-widest cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="requests-desc">Permintaan: Terbanyak</option>
            <option value="requests-asc">Permintaan: Tersedikit</option>
            <option value="name">Urutkan: Nama (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Request Cards by Kitchen */}
      {filteredRequests.length === 0 ? (
        <Card className="p-6 md:p-8 border-2 border-slate-50/50 rounded-[32px] shadow-xl shadow-slate-200/50 bg-white">
          <div className="py-20 text-center space-y-3">
            <PackageSearch className="w-12 h-12 text-slate-350 mx-auto" />
            <h3 className="text-slate-800 font-black tracking-tight text-base">Tidak Ada Permintaan</h3>
            <p className="text-slate-550 text-xs">Belum ada dapur satelit yang mengajukan penambahan bahan baku saat ini.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedGroupedRequests.map(([kitchenName, kitchenRequestsRaw]) => {
            const kitchenRequests = kitchenRequestsRaw as any[];
            const pending = kitchenRequests.filter(r => r.status === "Pending");
            
            return (
              <Card key={kitchenName} className="p-6 md:p-8 border-2 border-slate-50/50 rounded-[32px] shadow-xl shadow-slate-200/50 bg-white space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{kitchenName}</h3>
                    <span className="text-[10px] font-black text-white bg-slate-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {kitchenRequests.length} Permintaan
                    </span>
                    {pending.length > 0 && (
                      <span className="text-[10px] font-black text-white bg-amber-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        {pending.length} Menunggu
                      </span>
                    )}
                  </div>

                  {pending.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => handleBulkApprove(kitchenName, pending)}
                        className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
                      >
                        Setujui Semua
                      </Button>
                      <Button
                        onClick={() => handleOpenBulkModal(kitchenName, pending, "Denied")}
                        className="bg-red-500 hover:bg-red-655 text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
                      >
                        Tolak Semua
                      </Button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bahan Baku</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Urgensi</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tujuan</th>
                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/50 backdrop-blur-sm">
                      {kitchenRequests.map((req) => {
                        const urgencyColor = req.urgency === "High" || req.urgency === "Kritis"
                          ? "text-red-700 bg-red-50 border border-red-100/60" 
                          : req.urgency === "Medium" || req.urgency === "Mendesak"
                          ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                          : "text-slate-600 bg-slate-50 border border-slate-100/60";

                        const statusColor = req.status === "Approved"
                          ? "bg-blue-50 text-blue-600 border-blue-100/60"
                          : req.status === "Delivered" || req.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100/60"
                          : req.status === "Pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100/60 shadow-sm"
                          : "bg-red-50 text-red-655 border-red-100/60";

                        const supplierDisplay = req.supplierKitchenName || "Gudang Pusat";

                        return (
                          <tr 
                            key={req.id} 
                            onClick={() => handleOpenDetailModal(req)}
                            className="hover:bg-slate-50/40 transition-colors border-l-2 border-l-transparent hover:border-l-primary cursor-pointer"
                          >
                            <td className="p-4 text-xs font-black text-slate-700 tracking-tight">{req.material}</td>
                            <td className="p-4 text-xs font-extrabold text-slate-900 tracking-tight">{req.amount}</td>
                            <td className="p-4">
                              <span className={cn("px-2.5 py-1 rounded-full uppercase tracking-wider font-black text-[9px]", urgencyColor)}>
                                {req.urgency}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-bold text-slate-650 tracking-tight">
                              {supplierDisplay}
                            </td>
                            <td className="p-4">
                              <span className={cn("px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider border", statusColor)}>
                                {req.status === "Pending" 
                                  ? "Menunggu" 
                                  : req.status === "Approved" 
                                  ? "Disetujui" 
                                  : req.status === "Denied" || req.status === "Rejected"
                                  ? "Ditolak"
                                  : "Selesai"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bulk Action Note Dialog Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title={`Proses Masal (${bulkActionType === "Pending" ? "Hold" : "Deny"}): ${bulkKitchenName}`}
      >
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Permintaan Masal</span>
            <p className="text-slate-800 font-extrabold text-sm mt-0.5">
              Tindakan ini akan memproses <span className="text-primary font-black">{bulkRequests.length}</span> permintaan logistik sekaligus untuk <span className="font-extrabold">{bulkKitchenName}</span>.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">
              Catatan / Feedback Masal (Wajib)
            </label>
            <textarea
              rows={4}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all resize-none"
              placeholder="Tulis catatan feedback masal yang akan diterapkan untuk seluruh tiket ini..."
              value={bulkNote}
              onChange={(e) => setBulkNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setBulkModalOpen(false)}
              variant="ghost"
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmBulkAction}
              disabled={!bulkNote.trim()}
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs cursor-pointer disabled:opacity-50"
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail & Action Dialog Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedRequest(null); }}
        title={`Detail Permintaan Stock: #${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="space-y-6">
            {modalError && (
              <div id="requestModalError" className="p-4 bg-red-50 border border-red-200 text-red-655 rounded-[20px] font-bold text-xs">
                {modalError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Dapur Peminta</span>
                <span className="text-slate-800 font-extrabold">{selectedRequest.kitchenName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Tujuan / Supplier</span>
                <span className="text-slate-800 font-extrabold">{selectedRequest.supplierKitchenName || "Gudang Pusat"}</span>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Bahan Baku</span>
                <span className="text-primary font-black">{selectedRequest.material}</span>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Jumlah</span>
                <span className="text-slate-900 font-black">{selectedRequest.amount}</span>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Urgensi</span>
                <div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider inline-block",
                    selectedRequest.urgency === "High" || selectedRequest.urgency === "Kritis"
                      ? "text-red-700 bg-red-55 border border-red-100/60" 
                      : selectedRequest.urgency === "Medium" || selectedRequest.urgency === "Mendesak"
                      ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                      : "text-slate-600 bg-slate-50 border border-slate-100/60"
                  )}>
                    {selectedRequest.urgency}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                <div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider inline-block border",
                    selectedRequest.status === "Approved"
                      ? "bg-blue-50 text-blue-600 border-blue-100/60"
                      : selectedRequest.status === "Delivered" || selectedRequest.status === "Selesai"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100/60"
                      : selectedRequest.status === "Pending"
                      ? "bg-amber-50 text-amber-600 border-amber-100/60"
                      : "bg-red-50 text-red-650 border-red-100/60"
                  )}>
                    {selectedRequest.status === "Pending" 
                      ? "Menunggu" 
                      : selectedRequest.status === "Approved" 
                      ? "Disetujui" 
                      : selectedRequest.status === "Denied" || selectedRequest.status === "Rejected"
                      ? "Ditolak"
                      : "Selesai"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Tanggal Pengajuan</span>
              <span className="text-slate-800">
                {new Date(selectedRequest.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}{" "}
                pukul{" "}
                {new Date(selectedRequest.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}{" "}
                WIB
              </span>
            </div>

            {selectedRequest.status === "Pending" ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">
                    Catatan / Feedback Admin
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all resize-none"
                    placeholder="Tulis catatan (opsional untuk disetujui, wajib untuk ditolak)..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleProcessRequest("Approved")}
                    disabled={updatingId !== null}
                    className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs cursor-pointer"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleProcessRequest("Denied")}
                    disabled={updatingId !== null || !adminNote}
                    className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-655 text-white cursor-pointer disabled:opacity-50"
                  >
                    Deny
                  </Button>
                </div>
                {!adminNote && (
                  <p className="text-[9px] text-amber-655 font-bold text-center italic">
                    * Wajib menulis catatan feedback untuk opsi Deny.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl text-xs font-medium">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Catatan Admin / Feedback:</span>
                  {selectedRequest.adminNotes ? (
                    <p className="text-slate-700 font-bold leading-relaxed">{selectedRequest.adminNotes}</p>
                  ) : (
                    <p className="text-slate-400 italic">Tidak ada catatan feedback.</p>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg block">
                    Permintaan ini sudah diproses dan tidak dapat diubah kembali.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Info Protocols */}
      <div className="p-6 bg-primary-light rounded-[24px] border border-primary/5 flex gap-4 items-start">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
           <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-black text-primary uppercase text-[9px] tracking-[0.2em]">Logistics Management Protocol</p>
          <p className="text-xs text-primary/80 font-bold leading-relaxed tracking-tight">
            Semua permintaan bahan dari dapur satelit yang berstatus **Disetujui** akan secara otomatis diteruskan ke kurir logistik pusat. Memilih **Tunda** atau **Tolak** memerlukan catatan penjelasan agar chef satelit dapat mengambil langkah antisipasi yang tepat.
          </p>
        </div>
      </div>
      {/* Custom Alert Modal */}
      <Modal
        isOpen={alertMessage !== null}
        onClose={() => setAlertMessage(null)}
        title={alertMessage?.title || "Notifikasi"}
      >
        <div className="space-y-6 py-2">
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            {alertMessage?.message}
          </p>
          <div className="pt-2">
            <Button 
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md"
              onClick={() => setAlertMessage(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
