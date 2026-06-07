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
  FileText
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export const RequestStock = () => {
  const [requests, setRequests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Note Modal States
  const [isNoteModalOpen, setNoteModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null);
  const [targetStatus, setTargetStatus] = React.useState<"Pending" | "Denied">("Pending");
  const [adminNote, setAdminNote] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const loadRequests = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getStockRequests(); // Fetch all requests
      setRequests(data);
    } catch (error) {
      console.error("Gagal mengambil data permintaan stock:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    try {
      await api.updateStockRequestStatus(id, "Approved");
      // Reload
      const data = await api.getStockRequests();
      setRequests(data);
    } catch (error) {
      alert("Gagal menyetujui permintaan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenNoteModal = (req: any, status: "Pending" | "Denied") => {
    setSelectedRequest(req);
    setTargetStatus(status);
    setAdminNote(req.adminNotes || "");
    setNoteModalOpen(true);
  };

  const handleSaveNotesStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setUpdatingId(selectedRequest.id);

    try {
      await api.updateStockRequestStatus(selectedRequest.id, targetStatus, adminNote);
      setNoteModalOpen(false);
      // Reload
      const data = await api.getStockRequests();
      setRequests(data);
    } catch (error) {
      alert("Gagal memperbarui status permintaan.");
    } finally {
      setUpdatingId(null);
      setSelectedRequest(null);
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

  // Calculate statistics
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const deniedCount = requests.filter(r => r.status === "Denied" || r.status === "Rejected").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] text-white p-8 md:p-10 shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em]">
              <PackageSearch className="w-4 h-4 animate-pulse" />
              <span>Pusat Operasional Admin SCM</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
              Kelola Permintaan Bahan Baku
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-base max-w-2xl">
              Persetujuan, penundaan, dan pelacakan permintaan restock mandiri dari seluruh jaringan Dapur Satelit MBGflow.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 border-2 border-slate-50/50 bg-white rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:border-slate-100 transition-all duration-300">
          <div className="w-12 h-12 bg-slate-50 text-slate-650 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Total Permintaan</span>
            <span className="text-2xl font-black text-slate-800 leading-none">{totalCount}</span>
          </div>
        </Card>

        <Card className="p-5 border-2 border-slate-50/50 bg-white rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:border-amber-100 transition-all duration-300">
          <div className="w-12 h-12 bg-amber-50/80 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <Hourglass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-black text-amber-550 uppercase tracking-widest block">Menunggu</span>
            <span className="text-2xl font-black text-amber-600 leading-none">{pendingCount}</span>
          </div>
        </Card>

        <Card className="p-5 border-2 border-slate-50/50 bg-white rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all duration-300">
          <div className="w-12 h-12 bg-blue-50/80 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-blue-550 uppercase tracking-widest block">Disetujui</span>
            <span className="text-2xl font-black text-blue-600 leading-none">{approvedCount}</span>
          </div>
        </Card>

        <Card className="p-5 border-2 border-slate-50/50 bg-white rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md hover:border-red-100 transition-all duration-300">
          <div className="w-12 h-12 bg-red-50/80 text-red-650 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-red-550 uppercase tracking-widest block">Ditolak</span>
            <span className="text-2xl font-black text-red-650 leading-none">{deniedCount}</span>
          </div>
        </Card>
      </div>

      {/* Main Request Table Card */}
      <Card className="p-6 md:p-8 border-2 border-slate-50/50 rounded-[32px] shadow-xl shadow-slate-200/50 bg-white">
        {requests.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <PackageSearch className="w-12 h-12 text-slate-350 mx-auto" />
            <h3 className="text-slate-800 font-black tracking-tight text-base">Tidak Ada Permintaan</h3>
            <p className="text-slate-550 text-xs">Belum ada dapur satelit yang mengajukan penambahan bahan baku saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Tiket</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dapur Peminta</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bahan Baku</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Urgensi</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tujuan / Supplier</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Diajukan Pada</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Feedback Catatan</th>
                  <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Kelola Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50 backdrop-blur-sm">
                {requests.map((req) => {
                  let statusColor = "bg-slate-100 text-slate-500";
                  let StatusIcon = Hourglass;
                  
                  if (req.status === "Approved") {
                    statusColor = "bg-blue-50 text-blue-600 border border-blue-100/60";
                    StatusIcon = Truck;
                  } else if (req.status === "Delivered" || req.status === "Selesai") {
                    statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100/60";
                    StatusIcon = CheckCircle2;
                  } else if (req.status === "Pending") {
                    statusColor = "bg-amber-50 text-amber-600 border border-amber-100/60 shadow-sm animate-pulse";
                    StatusIcon = Hourglass;
                  } else if (req.status === "Denied" || req.status === "Rejected") {
                    statusColor = "bg-red-50 text-red-650 border border-red-100/60";
                    StatusIcon = XCircle;
                  }
 
                  const urgencyColor = req.urgency === "High" || req.urgency === "Kritis"
                    ? "text-red-700 bg-red-50 border border-red-100/60" 
                    : req.urgency === "Medium" || req.urgency === "Mendesak"
                    ? "text-amber-700 bg-amber-50 border border-amber-100/60"
                    : "text-slate-600 bg-slate-50 border border-slate-100/60";
 
                  const isPending = req.status === "Pending";
                  const supplierDisplay = req.supplierKitchenName || "Gudang Pusat";
 
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors border-l-2 border-l-transparent hover:border-l-primary">
                      <td className="p-4">
                        <span className="inline-block font-mono text-[11px] font-black text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-xl shadow-inner">
                          #{req.id}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-black text-slate-800 tracking-tight">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span>{req.kitchenName}</span>
                        </div>
                      </td>
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
                      <td className="p-4 text-xs text-slate-500 font-medium">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">
                            {new Date(req.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short"
                            })}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(req.createdAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })} WIB
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider", statusColor)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>
                            {req.status === "Pending" 
                              ? "Menunggu" 
                              : req.status === "Approved" 
                              ? "Disetujui" 
                              : req.status === "Denied" || req.status === "Rejected"
                              ? "Ditolak"
                              : "Selesai"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        {req.adminNotes ? (
                          <div className={cn(
                            "px-3 py-2 rounded-xl text-xs font-medium max-w-[200px] leading-relaxed border shadow-sm",
                            req.status === "Pending" 
                              ? "bg-amber-50 text-amber-800 border-amber-100" 
                              : req.status === "Denied" || req.status === "Rejected"
                              ? "bg-red-50 text-red-800 border-red-100"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          )}>
                            <span className="font-black block uppercase text-[8px] tracking-wider mb-0.5">Alasan:</span>
                            {req.adminNotes}
                          </div>
                        ) : (
                          <span className="text-slate-350 italic text-[11px] px-1">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <Button
                              onClick={() => handleApprove(req.id)}
                              disabled={updatingId === req.id}
                              className="bg-primary hover:bg-primary-dark text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl active:scale-95 cursor-pointer border-none shadow-md shadow-primary/10 transition-all duration-200"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleOpenNoteModal(req, "Pending")}
                              disabled={updatingId === req.id}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl active:scale-95 cursor-pointer border-none shadow-md shadow-amber-500/10 transition-all duration-200"
                            >
                              Hold
                            </Button>
                            <Button
                              onClick={() => handleOpenNoteModal(req, "Denied")}
                              disabled={updatingId === req.id}
                              className="bg-red-500 hover:bg-red-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl active:scale-95 cursor-pointer border-none shadow-md shadow-red-500/10 transition-all duration-200"
                            >
                              Deny
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">Sudah Diproses</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Note / Feedback Dialog Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={targetStatus === "Pending" ? "Tunda Permintaan & Tambah Catatan" : "Tolak Permintaan & Tambah Catatan"}
      >
        <form onSubmit={handleSaveNotesStatus} className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Detail Item</span>
            <p className="font-extrabold text-slate-700 text-sm">
              {selectedRequest?.kitchenName} mengajukan <span className="text-primary font-black">{selectedRequest?.material} ({selectedRequest?.amount})</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">
              Catatan Feedback Untuk Chef
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder={
                targetStatus === "Pending" 
                  ? "Tulis alasan menunda... (misal: 'Stok sedang didistribusikan, harap tunggu')" 
                  : "Tulis alasan menolak... (misal: 'Gunakan sisa stok bawang di freezer Tangerang dulu')"
              }
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNoteModalOpen(false)}
              className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updatingId !== null || !adminNote}
              className={cn(
                "flex-1 py-4 font-black uppercase text-[10px] tracking-widest text-white shadow-md",
                targetStatus === "Pending" ? "bg-amber-500 hover:bg-amber-600" : "bg-red-500 hover:bg-red-650"
              )}
            >
              {updatingId ? "Menyimpan..." : targetStatus === "Pending" ? "Simpan & Pending" : "Simpan & Tolak"}
            </Button>
          </div>
        </form>
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
    </div>
  );
};
