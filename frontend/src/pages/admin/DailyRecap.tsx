import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { 
  ChevronLeft, 
  Search, 
  Calendar, 
  UtensilsCrossed, 
  MapPin, 
  User, 
  FileText,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { api } from "@/src/services/api";
import { format } from "date-fns";

const formatDate = (dateString: string | null | undefined, formatStr: string) => {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return format(d, formatStr);
  } catch (e) {
    return "-";
  }
};

export const DailyRecap = () => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [selectedRecap, setSelectedRecap] = React.useState<any | null>(null);

  const fetchRecaps = React.useCallback(() => {
    setLoading(true);
    api.getDailyRecap().then((res) => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    fetchRecaps();
  }, [fetchRecaps]);

  // Client side filtering for instant response
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.kitchenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (item.verifiedAt) {
        const itemTime = new Date(item.verifiedAt).getTime();
        if (startDate) {
          const start = new Date(startDate).getTime();
          if (itemTime < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate).getTime() + 86400000; // include full day
          if (itemTime > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [data, searchTerm, startDate, endDate]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin")}
            className="rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rekap Harian</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Laporan Verifikasi Bahan Baku yang Digunakan Kemarin
            </p>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <Card className="p-6 border-slate-100 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Cari Dapur / Verifikator</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nama dapur atau chef..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tanggal Mulai</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tanggal Akhir</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all text-slate-600"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
              }}
              className="flex-1 rounded-2xl font-bold py-3 text-xs uppercase tracking-widest border-2 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center bg-white border border-slate-100 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat rekap verifikasi...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-100 rounded-[32px] shadow-sm">
          <UtensilsCrossed className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tidak ada data verifikasi ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <Card 
              key={item.id} 
              onClick={() => setSelectedRecap(item)}
              className="p-6 border-slate-100 bg-white hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Verifikasi Stok
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {formatDate(item.verifiedAt, "dd MMM yyyy")}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
                    {item.kitchenName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-2 text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                    <span>Kota: {item.kitchenCity || "Jakarta"}</span>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-4 grid grid-cols-2 gap-2 text-xs font-bold">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Verifikator</span>
                    <span className="text-sm font-black text-slate-700 truncate block">{item.verifiedBy}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Item Diverifikasi</span>
                    <span className="text-sm font-black text-slate-700">{(item.items || []).length} Item</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-50 mt-4 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>
                  Waktu: {formatDate(item.verifiedAt, "HH:mm")} WIB
                </span>
                <span className="text-primary font-black flex items-center gap-1 group-hover:text-primary-dark transition-colors">
                  Detail <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      <Modal
        isOpen={!!selectedRecap}
        onClose={() => setSelectedRecap(null)}
        title="Detail Laporan Verifikasi Stok"
        className="max-w-2xl"
      >
        {selectedRecap && (
          <div className="space-y-6 py-2">
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {selectedRecap.kitchenName}
              </h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Verifikasi Oleh: {selectedRecap.verifiedBy}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tanggal Verifikasi</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {formatDate(selectedRecap.verifiedAt, "dd MMMM yyyy")}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Jam Pengajuan</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {formatDate(selectedRecap.verifiedAt, "HH:mm:ss")} WIB
                </span>
              </div>
            </div>

            {/* Materials verified */}
            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                Rincian Bahan Baku & Sisa Stok Terpakai
              </h5>
              {selectedRecap.items && selectedRecap.items.length > 0 ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 font-bold text-slate-400">
                        <th className="p-3">Nama Bahan</th>
                        <th className="p-3">ID Batch</th>
                        <th className="p-3">Wadah / Kemasan</th>
                        <th className="p-3 text-right">Stok Kemasan</th>
                        <th className="p-3 text-right">Stok Eceran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {selectedRecap.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3">{item.materialName}</td>
                          <td className="p-3 text-slate-400 font-mono">#{item.batchId.toUpperCase()}</td>
                          <td className="p-3 text-slate-500">{item.container}</td>
                          <td className="p-3 text-right text-primary font-black">
                            {item.qty_packed} {item.packagingName || item.unit}
                          </td>
                          <td className="p-3 text-right text-indigo-600 font-black">
                            {Number(item.qty_loose).toFixed(2)} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Tidak ada bahan baku yang diverifikasi.</p>
              )}
            </div>



            <div className="pt-2">
              <Button 
                onClick={() => setSelectedRecap(null)} 
                className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Tutup Laporan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
