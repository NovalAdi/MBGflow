import * as React from "react";
import { api } from "@/src/services/api";
import { Kitchen } from "@/src/types";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { Utensils, MapPin, MoreVertical, Plus, Edit2, Trash2, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const INDO_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const KitchenList = () => {
  const [kitchens, setKitchens] = React.useState<Kitchen[]>([]);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentKitchen, setCurrentKitchen] = React.useState<Partial<Kitchen> | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"name" | "capacity-desc" | "capacity-asc">("name");

  const todayIndex = new Date().getDay();
  let todayDayName = INDO_DAYS[todayIndex];
  if (todayDayName === "Minggu") {
    todayDayName = "Senin";
  }

  const fetchKitchens = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [kitchensData, plansData] = await Promise.all([
        api.getKitchens(),
        api.getProductionPlans()
      ]);
      setKitchens(kitchensData);
      setPlans(plansData || []);
    } catch (error) {
      console.error("Failed to fetch kitchens and plans", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchKitchens();
  }, [fetchKitchens]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKitchen?.name || !currentKitchen?.address) return;

    try {
      if (currentKitchen.id) {
        await api.updateKitchen(currentKitchen.id, currentKitchen);
      } else {
        await api.createKitchen(currentKitchen as Omit<Kitchen, 'id'>);
      }
      setIsModalOpen(false);
      setCurrentKitchen(null);
      fetchKitchens();
    } catch (error) {
      console.error("Operation failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dapur ini?")) return;
    try {
      await api.deleteKitchen(id);
      fetchKitchens();
    } catch (error) {
      console.error("Penghapusan gagal", error);
    }
  };

  const filteredKitchens = React.useMemo(() => {
    return kitchens
      .filter(k => 
        k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "capacity-desc") return b.capacity - a.capacity;
        if (sortBy === "capacity-asc") return a.capacity - b.capacity;
        return 0;
      });
  }, [kitchens, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Dapur</h1>
          <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Kelola Seluruh Lokasi Central Kitchen</p>
        </div>
        <Button 
          onClick={() => { setCurrentKitchen({ name: "", address: "", capacity: 1000 }); setIsModalOpen(true); }}
          className="shadow-2xl shadow-primary/20 rounded-[20px] py-4 px-8 font-black uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5 mr-3" />
          Tambah Dapur
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari dapur atau kota..."
            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent rounded-[24px] focus:border-primary outline-none transition-all shadow-sm font-black text-slate-800 tracking-tight"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-white border-2 border-transparent rounded-[24px] px-6 py-2 shadow-sm focus-within:border-primary transition-all">
          <SlidersHorizontal className="w-5 h-5 text-slate-500" />
          <select 
            className="bg-transparent border-none outline-none py-3 text-slate-800 font-black text-xs uppercase tracking-widest cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="name">Urutkan: Nama (A-Z)</option>
            <option value="capacity-desc">Kapasitas: Tertinggi</option>
            <option value="capacity-asc">Kapasitas: Terendah</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-slate-50 rounded-[32px] animate-pulse" />
          ))
        ) : filteredKitchens.length > 0 ? (
          filteredKitchens.map((kitchen) => (
            <Link 
              key={kitchen.id} 
              to={`/admin/kitchens/${kitchen.id}`}
              className="group block h-full"
            >
              <Card className="h-full p-8 flex flex-col justify-between gap-6 overflow-hidden transition-all duration-500 border-none transform group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-15px_rgba(21,128,61,0.1)] rounded-[32px] bg-white relative">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-light group-hover:text-primary transition-colors">
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2 md:h-14 font-sans" title={kitchen.name}>{kitchen.name}</h3>
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] px-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{kitchen.address}</span>
                    </div>
                  </div>
                </div>
              
                {(() => {
                  const totalPortionsToday = plans
                    .filter(p => p.kitchenId === kitchen.id && p.day === todayDayName)
                    .reduce((sum, p) => sum + (Number(p.portions) || 0), 0);
                  const usedPercentage = Math.min(100, Math.round((totalPortionsToday / kitchen.capacity) * 100));

                  return (
                    <div className="pt-2 space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-sans">Utilisasi Hari Ini ({todayDayName})</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest font-sans">
                          {totalPortionsToday.toLocaleString()} / {kitchen.capacity.toLocaleString()} ({usedPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner p-1">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out shadow-lg",
                            usedPercentage > 90 
                              ? "bg-red-500 shadow-red-500/20" 
                              : usedPercentage > 75 
                                ? "bg-amber-500 shadow-amber-500/20" 
                                : "bg-primary shadow-primary/20"
                          )}
                          style={{ width: `${usedPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-10 h-10" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">Tidak ada dapur ditemukan</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2">Coba kata kunci lain atau tambah dapur baru</p>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentKitchen?.id ? "Edit Dapur" : "Tambah Dapur Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Informasi Utama</label>
            <div className="relative group/input">
              <Utensils className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] pl-14 pr-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-450 shadow-sm"
                placeholder="Nama Dapur (Contoh: Dapur Pusat Jakarta)"
                value={currentKitchen?.name || ""}
                onChange={(e) => setCurrentKitchen(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative group/input">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] pl-14 pr-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-450 shadow-sm"
                placeholder="Alamat Lengkap Unit..."
                value={currentKitchen?.address || ""}
                onChange={(e) => setCurrentKitchen(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Kapasitas Produksi</label>
              <span className="text-xs font-black text-primary bg-primary-light px-3 py-1 rounded-full uppercase tracking-widest">{currentKitchen?.capacity?.toLocaleString() || 1000} Porsi</span>
            </div>
            <div className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100 flex flex-col gap-4">
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="50"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                value={currentKitchen?.capacity || 100}
                onChange={(e) => setCurrentKitchen(prev => ({ ...prev, capacity: Number(e.target.value) }))}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <span>100 Porsi</span>
                <span>5k Porsi</span>
                <span>10k Porsi</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50"
              onClick={() => setIsModalOpen(false)}
            >
              Batalkan
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              {currentKitchen?.id ? "Simpan Perubahan" : "Konfirmasi & Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
