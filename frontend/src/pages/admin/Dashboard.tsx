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
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">Rencana Masak</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Jadwal Produksi Harian</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-bold text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/45 transition-all flex items-center gap-1.5 px-4 py-2 rounded-xl"
            onClick={() => navigate("/admin/history")}
          >
            Histori Produksi
            <ChevronRight className="w-3.5 h-3.5" />
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
        className="max-w-2xl"
      >
        {selectedActivity && (
          <div className="space-y-6 py-2">
            <div>
              <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {selectedActivity.menu}
              </h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                Dapur: {selectedActivity.kitchen}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nama Dapur</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedActivity.kitchen}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Kota</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedActivity.city}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Jumlah Porsi</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedActivity.servings} Porsi</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chef Penanggung Jawab</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedActivity.chefPenanggungJawab || '-'}</span>
              </div>
            </div>

            {selectedActivity.status === 'Ready' && selectedActivity.qaNotes && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Catatan QA</span>
                <p className="text-sm text-indigo-900 font-medium leading-relaxed italic">
                  "{selectedActivity.qaNotes}"
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button 
                onClick={() => setIsModalOpen(false)} 
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
