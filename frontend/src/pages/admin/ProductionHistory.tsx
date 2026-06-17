import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Modal } from "@/src/components/ui/Modal";
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download,
  Calendar,
  MoreVertical,
  UtensilsCrossed,
  MapPin,
  Utensils
} from "lucide-react";
import { api } from "@/src/services/api";
import { ProductionLog } from "@/src/types";
import { format } from "date-fns";
import { cn } from "@/src/lib/utils";

type SortConfig = {
  key: keyof ProductionLog | 'date';
  direction: 'asc' | 'desc';
} | null;

export const ProductionHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<ProductionLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [selectedItem, setSelectedItem] = React.useState<ProductionLog | null>(null);

  React.useEffect(() => {
    api.getActivity().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleSort = (key: keyof ProductionLog | 'date') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.menu.toLowerCase().includes(lowerSearch) ||
        item.kitchen.toLowerCase().includes(lowerSearch) ||
        item.city.toLowerCase().includes(lowerSearch) ||
        (item.chefPenanggungJawab || "").toLowerCase().includes(lowerSearch)
      );
    }

    // Status Filter
    if (statusFilter !== "All") {
      result = result.filter(item => item.status === statusFilter);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === 'date') {
          valA = new Date(a.startTime).getTime();
          valB = new Date(b.startTime).getTime();
        } else {
          valA = a[sortConfig.key];
          valB = b[sortConfig.key];
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig, statusFilter]);

  const stats = React.useMemo(() => {
    const total = data.length;
    const completed = data.filter(d => d.status === 'Ready').length;
    const inProgress = data.filter(d => ['Preparing', 'Cooking'].includes(d.status)).length;
    return { total, completed, inProgress };
  }, [data]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin")}
            className="rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Histori Produksi</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Laporan Lengkap Aktivitas Dapur</p>
          </div>
        </div>

        {/* <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 bg-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produksi</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stats.total}</h4>
            <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Aktivitas</p>
          </div>
        </Card>
        <Card className="p-6 border-slate-100 bg-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Berhasil Selesai</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.completed}</h4>
            <div className="mb-2 px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-black text-emerald-600">SUCCESS</div>
          </div>
        </Card>
        <Card className="p-6 border-slate-100 bg-white">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sedang Berjalan</p>
          <div className="flex items-end gap-2">
            <h4 className="text-3xl font-black text-primary tracking-tighter">{stats.inProgress}</h4>
            <div className="mb-2 px-1.5 py-0.5 rounded bg-primary-light text-[9px] font-black text-primary">LIVE</div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-100 bg-white shadow-xl shadow-slate-200/50 rounded-[32px]">
        {/* Table Controls */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari menu, dapur, koki..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-2xl border-2 border-transparent">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-600 outline-none"
              >
                <option value="All">Semua Status</option>
                <option value="Ready">Selesai</option>
                <option value="Cooking">Sedang Memasak</option>
                <option value="Preparing">Persiapan</option>
                <option value="NotStarted">Antrean</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <button onClick={() => handleSort('date')} className="flex items-center gap-2 hover:text-primary transition-colors">
                    WAKTU
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <button onClick={() => handleSort('menu')} className="flex items-center gap-2 hover:text-primary transition-colors">
                    MENU / MASAKAN
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <button onClick={() => handleSort('kitchen')} className="flex items-center gap-2 hover:text-primary transition-colors">
                    DAPUR & KOTA
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">
                  <button onClick={() => handleSort('servings')} className="flex items-center gap-2 mx-auto hover:text-primary transition-colors">
                    PORSI
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                   STATUS
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  PENANGGUNG JAWAB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAndSortedData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                >
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white group-hover:scale-105 transition-all">
                        <span className="text-[10px] font-black text-slate-400 leading-none">{format(new Date(item.startTime), "dd")}</span>
                        <span className="text-[8px] font-black text-primary leading-none uppercase">{format(new Date(item.startTime), "MMM")}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700">{format(new Date(item.startTime), "HH:mm")}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider italic">Mulai</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-800 leading-none">{item.menu}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{item.id.slice(-6).toUpperCase()}</p>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <UtensilsCrossed className="w-3 h-3 text-primary" />
                        <span className="text-xs font-black text-slate-700">{item.kitchen}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">{item.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 align-top text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-black text-slate-800 leading-none">{item.servings}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Porsi</span>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <Badge 
                      status={
                        item.status === 'NotStarted' ? 'Antrean' : 
                        item.status === 'Live' ? 'Langsung' : 
                        item.status === 'Preparing' ? 'Persiapan' :
                        item.status === 'Cooking' ? 'Masak' :
                        item.status === 'Ready' ? 'Siap Diantar' :
                        item.status === 'Done' ? 'Selesai' :
                        item.status
                      } 
                    />
                  </td>
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {(item.chefPenanggungJawab || "CH").split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{item.chefPenanggungJawab || "Koki Bertugas"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="py-32 text-center">
            <Utensils className="w-12 h-12 text-slate-100 mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tidak ada data ditemukan</p>
          </div>
        )}

        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menampilkan {filteredAndSortedData.length} dari {data.length} entri</p>
           <div className="flex gap-2">
              <Button disabled variant="outline" size="sm" className="rounded-xl font-bold text-[10px]">SEBELUMNYA</Button>
              <Button disabled variant="outline" size="sm" className="rounded-xl font-bold text-[10px]">BERIKUTNYA</Button>
           </div>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        title="Detail Aktivitas Produksi"
        className="max-w-2xl"
      >
        {selectedItem && (
          <div className="space-y-6 py-2">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MENU / MASAKAN</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{selectedItem.menu}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #{selectedItem.id.slice(-6).toUpperCase()}</p>
              </div>
              <Badge 
                status={
                  selectedItem.status === 'NotStarted' ? 'Antrean' : 
                  selectedItem.status === 'Live' ? 'Langsung' : 
                  selectedItem.status === 'Preparing' ? 'Persiapan' :
                  selectedItem.status === 'Cooking' ? 'Masak' :
                  selectedItem.status === 'Ready' ? 'Siap Diantar' :
                  selectedItem.status === 'Done' ? 'Selesai' :
                  selectedItem.status
                } 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DAPUR</p>
                  <p className="text-sm font-black text-slate-700 mt-1 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                    {selectedItem.kitchen} ({selectedItem.city})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PORSI DIPRODUKSI</p>
                  <p className="text-sm font-black text-slate-700 mt-1">
                    {selectedItem.servings} Porsi
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PENANGGUNG JAWAB</p>
                  <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">
                      {(selectedItem.chefPenanggungJawab || "CH").split(' ').map(n => n[0]).join('')}
                    </span>
                    {selectedItem.chefPenanggungJawab || "Koki Bertugas"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WAKTU MULAI</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    {selectedItem.startTime ? format(new Date(selectedItem.startTime), "dd MMMM yyyy, HH:mm") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WAKTU SELESAI</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">
                    {selectedItem.endTime ? format(new Date(selectedItem.endTime), "dd MMMM yyyy, HH:mm") : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Catatan Kualitas (QA)
              </p>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl min-h-[80px]">
                {selectedItem.qaNotes ? (
                  <p className="text-sm text-slate-700 font-bold whitespace-pre-wrap leading-relaxed">
                    {selectedItem.qaNotes}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 font-medium italic">
                    Tidak ada catatan QA yang diinput.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button 
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md"
                onClick={() => setSelectedItem(null)}
              >
                Tutup Detail
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
