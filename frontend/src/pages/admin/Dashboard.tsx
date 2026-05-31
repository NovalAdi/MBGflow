import * as React from "react";
import { api } from "@/src/services/api";
import { ReportSummary, ProductionLog } from "@/src/types";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Modal } from "@/src/components/ui/Modal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Utensils, UtensilsCrossed, TrendingUp, History, ChevronRight, MapPin, User, Hash, ClipboardList, Plus } from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/src/lib/utils";
import { useNavigate } from "react-router-dom";

const mockProgressData = [
  { hour: '08:00', target: 120, real: 110 },
  { hour: '10:00', target: 200, real: 185 },
  { hour: '12:00', target: 450, real: 462 },
  { hour: '14:00', target: 300, real: 280 },
  { hour: '16:00', target: 150, real: 140 },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<ReportSummary | null>(null);
  const [activities, setActivities] = React.useState<ProductionLog[]>([]);
  const [menus, setMenus] = React.useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = React.useState<ProductionLog | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    api.getStats().then(setStats);
    api.getMenus().then(setMenus);
    api.getActivity().then((data) => {
      // Filter for today's activities or near future plans
      setActivities(data);
    });
  }, []);

  if (!stats) return null;

  const handleActivityClick = (act: ProductionLog) => {
    setSelectedActivity(act);
    setIsModalOpen(true);
  };

  const getMenuIngredients = (menuName: string, portions: number) => {
    const menu = menus.find(m => m.name === menuName);
    if (!menu) return [];
    return menu.ingredients.map((ing: any) => ({
      ...ing,
      total: (ing.perPortion * portions).toFixed(2)
    }));
  };

  const statCards = [
    { label: "Total Dapur Aktif", value: stats.activeKitchens.toString(), icon: UtensilsCrossed, sub: "5 Dapur baru", color: "bg-primary text-white", active: true },
    { label: "Porsi Sukses Hari Ini", value: stats.successfulServings.toLocaleString(), icon: TrendingUp, sub: "12% Lebih tinggi", color: "bg-white text-slate-900 border border-slate-100" },
    { label: "Aktivitas Memasak", value: `${stats.currentlyCooking}/${stats.totalDailyActivities}`, icon: Utensils, sub: "2 Sedang berjalan", color: "bg-white text-slate-900 border border-slate-100" },
    { label: "Karyawan Bertugas", value: stats.chefsOnDuty.toString(), icon: Users, sub: "Shift Pagi", color: "bg-white text-slate-900 border border-slate-100" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card 
            key={i} 
            className={cn(
              "flex flex-col gap-4 p-8 relative overflow-hidden group transition-all",
              stat.color
            )}
          >
            <div className="flex items-center justify-between">
              <p className={cn(
                "text-[11px] font-bold uppercase tracking-widest",
                stat.active ? "text-white/60" : "text-slate-400"
              )}>{stat.label}</p>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border transition-all group-hover:scale-110",
                stat.active ? "border-white/20 text-white" : "border-slate-100 text-slate-900"
              )}>
                 <ChevronRight className="w-4 h-4 -rotate-45" />
              </div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
              <div className="flex items-center gap-2 mt-4">
                 <div className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest",
                    stat.active ? "bg-white/10 text-white" : "bg-primary-light text-primary"
                 )}>
                    {stat.sub}
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics & Performance section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <Card className="lg:col-span-2 p-8 border-none rounded-[32px] bg-white shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Realisasi Target Produksi</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Komparasi Target vs Realisasi Porsi Selesai Hari Ini (Per Jam)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                />
                <Bar name="Target" dataKey="target" fill="#94A3B8" stroke="#94A3B8" strokeWidth={1} radius={[6, 6, 0, 0]} />
                <Bar name="Realisasi" dataKey="real" fill="#15803D" stroke="#15803D" strokeWidth={1} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Insights Card */}
        <Card className="p-8 border-none rounded-[32px] bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Status Dapur Pusat</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ringkasan Beban & Utilisasi</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Dapur Pusat Jakarta</span>
                <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 rounded-full">Optimal</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Dapur Satelit Tangerang</span>
                <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 rounded-full">Kapasitas Tinggi</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Dapur Depok Cloud</span>
                <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 rounded-full">Senggang</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-4">
            <button 
              className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
              onClick={() => navigate("/admin/kitchens")}
            >
              Lihat Detail Semua Dapur
            </button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">Rencana Masak</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Jadwal Produksi Harian</p>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full w-8 h-8" onClick={() => navigate("/admin/planning")}>
              <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => {
            const ingredients = getMenuIngredients(act.menu, act.servings);
            const displayStatus = 
              act.status === 'NotStarted' ? 'Antrean' : 
              (act.status === 'Cooking' || act.status === 'Preparing' || act.status === 'Live') ? 'Dimasak' :
              act.status === 'Ready' ? 'Selesai' :
              act.status;

            return (
                <div 
                  key={act.id} 
                  className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col gap-6 group"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100 shadow-sm transition-colors group-hover:bg-primary group-hover:text-white">
                        {act.status === 'Cooking' ? <Utensils className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                      </div>
                      <Badge status={displayStatus} className="h-fit" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-slate-900 text-2xl tracking-tighter leading-none group-hover:text-primary transition-colors">{act.menu}</h4>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{act.kitchen}</span>
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-6 py-3 border-y border-slate-50">
                  <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Porsi</p>
                    <p className="font-black text-slate-700 text-sm tracking-tighter">{act.servings} PCS</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Chef</p>
                    <p className="font-black text-slate-700 text-sm tracking-tighter truncate max-w-[100px]">{act.chefPenanggungJawab || '-'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rincian Bahan</p>
                    <p className="text-[9px] font-medium text-slate-300">{ingredients.length} Jenis</p>
                  </div>
                  <div className="max-h-32 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-50">
                        <span className="text-xs font-bold text-slate-600">{ing.name}</span>
                        <span className="text-xs font-black text-primary tracking-tighter">{ing.total} {ing.unit}</span>
                      </div>
                    ))}
                    {ingredients.length === 0 && (
                      <p className="text-[10px] text-slate-300 italic py-2">Data bahan tidak ditemukan</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-4">
              <Utensils className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada rencana masak hari ini</p>
            <Button 
              variant="ghost" 
              className="mt-4 text-primary font-bold"
              onClick={() => navigate("/admin/planning")}
            >
              Buat Rencana Baru
            </Button>
          </div>
        )}
      </div>


      {/* Activity Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Detail Aktivitas Memasak"
      >
        {selectedActivity && (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-3xl font-black text-slate-800 tracking-tighter mb-4">{selectedActivity.menu}</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <UtensilsCrossed className="w-3 h-3" />
                    Nama Dapur
                  </p>
                  <p className="font-bold text-slate-700">{selectedActivity.kitchen}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Kota
                  </p>
                  <p className="font-bold text-slate-700">{selectedActivity.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    Jumlah Porsi
                  </p>
                  <p className="font-bold text-slate-700">{selectedActivity.servings} Porsi</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Chef Penanggung Jawab
                  </p>
                  <p className="font-bold text-slate-700">{selectedActivity.chefPenanggungJawab || '-'}</p>
                </div>
              </div>
            </div>

            {selectedActivity.status === 'Ready' && selectedActivity.qaNotes && (
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList className="w-3 h-3" />
                  Catatan QA
                </p>
                <p className="text-sm text-indigo-900 font-medium leading-relaxed italic">
                  "{selectedActivity.qaNotes}"
                </p>
              </div>
            )}

            <Button className="w-full py-4 text-lg" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Tutup
            </Button>
          </div>
        )}
      </Modal>

      {/* Action Footer */}
      <div className="flex justify-end !mt-12">
        <Button 
          variant="primary" 
          className="shadow-lg shadow-primary/30 py-6 px-10 rounded-2xl group transition-all hover:scale-105 active:scale-95"
          onClick={() => navigate("/admin/history")}
        >
          Akses Tabel Histori Produksi
          <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
