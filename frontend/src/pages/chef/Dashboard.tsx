import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { api } from "@/src/services/api";
import { 
  CookingPot, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  RefreshCw, 
  Clock, 
  Utensils, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Play, 
  Send, 
  Package, 
  Hourglass, 
  Truck, 
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

export const ChefDashboard = ({ user }: { user: any }) => {
  const [data, setData] = React.useState<any>(null);
  const [inventoryItems, setInventoryItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Quick restock form state
  const [restockMaterial, setRestockMaterial] = React.useState("");
  const [restockAmount, setRestockAmount] = React.useState("");
  const [restockUrgency, setRestockUrgency] = React.useState<"Low" | "Medium" | "High">("Medium");
  const [submittingRestock, setSubmittingRestock] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const loadDashboardData = React.useCallback(async (isRefresh = false) => {
    if (!user?.kitchenId) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [dashData, invData] = await Promise.all([
        api.getChefDashboardData(user.kitchenId),
        api.getInventory()
      ]);
      setData(dashData);
      setInventoryItems(invData);
      setErrorMsg("");
    } catch (err: any) {
      console.error("Failed to load chef dashboard data", err);
      setErrorMsg("Gagal memuat data dashboard. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.kitchenId]);

  React.useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleStartTask = async (taskId: string) => {
    try {
      await api.startTask(taskId);
      showNotification("Sukses memulai proses masak!");
      loadDashboardData(true);
    } catch (err: any) {
      alert(err.message || "Gagal memulai tugas.");
    }
  };

  const handleFinishTask = async (taskId: string) => {
    try {
      await api.finishTask({ productionId: taskId });
      showNotification("Masakan telah selesai dimasak!");
      loadDashboardData(true);
    } catch (err: any) {
      alert(err.message || "Gagal menyelesaikan tugas.");
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockMaterial || !restockAmount) {
      alert("Harap lengkapi bahan dan jumlah pengajuan!");
      return;
    }
    
    setSubmittingRestock(true);
    try {
      await api.requestStock(
        restockMaterial,
        restockAmount,
        restockUrgency,
        user.kitchenId,
        data?.kitchenName || `Dapur Chef ${user.name}`
      );
      
      showNotification(`Sukses mengajukan restock ${restockMaterial}!`);
      setRestockMaterial("");
      setRestockAmount("");
      setRestockUrgency("Medium");
      loadDashboardData(true);
    } catch (err: any) {
      alert(err.message || "Gagal mengajukan restock.");
    } finally {
      setSubmittingRestock(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        <p className="text-slate-650 font-bold text-xs uppercase tracking-widest animate-pulse">Menghimpun Target Dapur...</p>
      </div>
    );
  }

  const todayStats = data?.todayStats || { totalPortions: 0, completedPortions: 0, activeCookingCount: 0, efficiency: "0%", wastageRate: "0%" };
  const todayMenu = data?.todayMenu || [];
  const staff = data?.staff || [];
  const criticalStock = data?.criticalStock || [];
  const recentRequests = data?.recentRequests || [];

  // Gauge setup
  const totalPortions = todayStats.totalPortions;
  const completedPortions = todayStats.completedPortions;
  const portionPercentage = totalPortions > 0 ? Math.round((completedPortions / totalPortions) * 100) : 0;
  
  const radius = 60;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (portionPercentage / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 font-bold text-sm"
          >
            <Sparkles className="w-5 h-5 text-emerald-250 animate-bounce" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[32px] text-white p-8 md:p-10 shadow-xl shadow-slate-900/10">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary/30 to-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Pusat Operasional Dapur</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
              Selamat Bertugas, Chef {user?.name || "Koki Utama"}! 🍳
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-base max-w-xl">
              Hari ini Anda memimpin <span className="text-primary font-bold">{data?.kitchenName || "Dapur Utama"}</span> ({data?.city || "Kota"}). Pantau target porsi dan pertahankan efisiensi rasa.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur border border-slate-700/50 p-4 rounded-2xl shrink-0 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-primary-light/10 text-primary flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift Aktif Anda</p>
              <p className="text-sm font-black text-white tracking-tight">Shift Pagi</p>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">06:00 - 14:00 WIB</p>
            </div>
            <button 
              onClick={() => loadDashboardData(true)}
              disabled={refreshing}
              className="ml-4 p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-350 hover:text-white transition-colors cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <Card className="bg-red-50 border-2 border-red-100 p-6 rounded-[28px] flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <h4 className="font-extrabold text-slate-800 text-base">Terjadi Kendala Teknis</h4>
            <p className="text-slate-600 text-sm mt-1">{errorMsg}</p>
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Cooking Target Progress Gauge & Menu Timeline (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Circular Gauge Card */}
          <Card className="p-6 md:p-8 rounded-[28px] border-2 border-slate-50/50 relative overflow-hidden group">
            {/* Background design */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              
              {/* Premium SVG Circular Ring */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90">
                  {/* Track circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth={stroke}
                    fill="transparent"
                  />
                  {/* Colored progress circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text overlay */}
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none block">
                    {portionPercentage}%
                  </span>
                  <span className="text-[9px] uppercase font-black text-slate-650 tracking-widest block mt-1">
                    Selesai
                  </span>
                </div>
              </div>

              {/* Stats & Description */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-tight">
                    Progress Produksi Porsi Hari Ini
                  </h3>
                  <p className="text-slate-600 font-bold text-xs uppercase tracking-widest mt-1">
                    {completedPortions} dari {totalPortions} Porsi Makanan Siap Saji
                  </p>
                </div>
                
                <p className="text-slate-650 text-sm leading-relaxed font-medium">
                  Persentase penyelesaian target berdasarkan hidangan yang berstatus <span className="text-emerald-600 font-bold">"Siap Diantar"</span>. Selesaikan menu masak tersisa untuk mencapai target porsi hari ini.
                </p>

                {/* Substats Mini Grid */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <span className="text-lg font-black text-slate-800 block leading-none">{todayStats.activeCookingCount}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 block">Dimasak</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <span className="text-lg font-black text-emerald-600 block leading-none">{todayStats.efficiency}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 block">Efisiensi</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <span className="text-lg font-black text-red-500 block leading-none">{todayStats.wastageRate}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 block">Wastage</span>
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Today's cooking schedule timeline */}
          <Card className="p-6 md:p-8 rounded-[28px] border-2 border-slate-50/50 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tighter">Timeline Memasak Hari Ini</h3>
                <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest mt-1">Daftar porsi produksi dapur aktif</p>
              </div>
              <a 
                href="/chef/queue" 
                className="text-xs font-black text-primary hover:text-primary-dark flex items-center gap-1 group/btn tracking-tight"
              >
                <span>Buka Antrean</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>

            {todayMenu.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-3">
                <Utensils className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-slate-600 font-bold text-sm tracking-tight">Tidak ada rencana produksi hari ini.</p>
                <p className="text-slate-600 text-xs">Jadwal memasak kosong atau belum dibuat oleh admin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayMenu.map((item: any, idx: number) => {
                  const isNotStarted = item.status === 'NotStarted' || item.status === 'Preparing';
                  const isCooking = item.status === 'Cooking';
                  const isReady = item.status === 'Ready';

                  return (
                    <div 
                      key={item.id} 
                      className={cn(
                        "p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all hover:shadow-sm duration-300",
                        isReady 
                          ? "bg-slate-50/55 border-slate-100" 
                          : isCooking 
                          ? "bg-orange-50/30 border-orange-100" 
                          : "bg-white border-slate-100"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon Indicator */}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          isReady 
                            ? "bg-emerald-50 text-emerald-600" 
                            : isCooking 
                            ? "bg-orange-50 text-orange-600 animate-pulse" 
                            : "bg-slate-50 text-slate-600"
                        )}>
                          {isReady ? <CheckCircle2 className="w-5 h-5" /> : isCooking ? <CookingPot className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">{item.menu}</h4>
                            <span className="text-[10px] text-slate-500 font-bold tracking-tight">({item.servings} Porsi)</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                              Mulai: {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-slate-200">•</span>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-wider",
                              isReady 
                                ? "text-emerald-600" 
                                : isCooking 
                                ? "text-orange-600" 
                                : "text-slate-650"
                            )}>
                              {isReady ? "SIAP DIANTAR" : isCooking ? "DIMASAK" : "ANTREAN"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Controls directly on Dashboard */}
                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        {isNotStarted && (
                          <Button 
                            onClick={() => handleStartTask(item.id)}
                            className="bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                            Mulai Masak
                          </Button>
                        )}
                        {isCooking && (
                          <Button 
                            onClick={() => handleFinishTask(item.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg shadow-orange-500/10 transition-all active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Selesai Masak
                          </Button>
                        )}
                        {isReady && (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Handover Logistik Siap</span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </Card>

        </div>

        {/* Right Side: Crew, Stock Alerts, Restock form & tracking (1/3 width) */}
        <div className="space-y-6">

          {/* Active Kitchen Crew list */}
          <Card className="p-6 rounded-[28px] border-2 border-slate-50/50 space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tighter">Kru Dapur Aktif</h3>
              <p className="text-slate-650 font-bold text-[9px] uppercase tracking-widest mt-0.5">Teammates on-duty pagi ini</p>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {staff.length === 0 ? (
                <p className="text-slate-650 text-xs italic py-2">Tidak ada staf yang terdaftar.</p>
              ) : (
                staff.map((member: any) => {
                  const initials = member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-9 h-9 rounded-xl object-cover border border-slate-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary font-black text-xs flex items-center justify-center shadow-inner">
                            {initials}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight">{member.name}</h4>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{member.role}</span>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-sm" title="Aktif di Dapur" />
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Low Stock Alerts Card */}
          <Card className="p-6 rounded-[28px] border-2 border-slate-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tighter">Peringatan Sisa Stok</h3>
                <p className="text-slate-650 font-bold text-[9px] uppercase tracking-widest mt-0.5">Status FEFO wadah kritis / kedaluwarsa</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {criticalStock.length === 0 ? (
                <div className="p-4 text-center bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                  <p className="text-emerald-700 font-bold text-xs">Semua Stok Aman 👍</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Tidak ada wadah di bawah batas minimal.</p>
                </div>
              ) : (
                criticalStock.map((stock: any) => {
                  const isExpiring = stock.isExpiringSoon && !stock.isLow;
                  
                  return (
                    <div 
                      key={stock.id} 
                      className={cn(
                        "p-3 rounded-xl border flex items-start gap-3 transition-colors duration-200",
                        isExpiring 
                          ? "bg-amber-50/30 border-amber-100/80" 
                          : "bg-red-50/30 border-red-100/80"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-0.5",
                        isExpiring ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                      )}>
                        <Package className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight leading-tight truncate">
                          {stock.material}
                        </h4>
                        
                        {/* Packaging Container name with capacity in bracket */}
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                          {stock.container} {stock.package_capacity !== null && `(${stock.package_capacity} ${stock.package_unit})`}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md font-bold text-[9px] tracking-tight",
                            isExpiring ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                          )}>
                            Sisa: {stock.weight}
                          </span>
                          
                          {stock.isExpiringSoon && (
                            <span className="text-[9px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                              Kadaluwarsa {stock.daysToExpiry} hari lagi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Quick Restock Request panel */}
          <Card className="p-6 rounded-[28px] border-2 border-slate-50/50 space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tighter">Pengajuan Restock Cepat</h3>
              <p className="text-slate-650 font-bold text-[9px] uppercase tracking-widest mt-0.5">Pesan bahan baku darurat langsung ke SCM</p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Nama Bahan Baku</label>
                <select
                  value={restockMaterial}
                  onChange={(e) => setRestockMaterial(e.target.value)}
                  required
                  className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="" disabled className="text-slate-400">Pilih bahan baku...</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.name} className="font-semibold">{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Jumlah & Satuan</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 jerigen, 10 kg"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    required
                    className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold tracking-tight placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Urgensi</label>
                  <select
                    value={restockUrgency}
                    onChange={(e: any) => setRestockUrgency(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                  >
                    <option value="Low">Low (Rutin)</option>
                    <option value="Medium">Medium (Sedang)</option>
                    <option value="High">High (Kritis/Habis)</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submittingRestock || !restockMaterial || !restockAmount}
                className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 mr-2" />
                {submittingRestock ? "Mengirim..." : "Kirim Permintaan"}
              </Button>
            </form>
          </Card>

        </div>

      </div>

      {/* Bottom Full-width Row: Recent Restock Requests Log Tracker */}
      <Card className="p-6 md:p-8 rounded-[32px] border-2 border-slate-50/50 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter">Papan Pelacakan Pengiriman Bahan</h3>
          <p className="text-slate-650 font-bold text-[10px] uppercase tracking-widest mt-1">Status real-time restock darurat dapur anda ke logistik pusat</p>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-2">
            <Package className="w-10 h-10 text-slate-350 mx-auto" />
            <p className="text-slate-600 font-bold text-sm">Belum ada pengajuan restock cepat.</p>
            <p className="text-slate-600 text-xs">Setiap restock darurat yang diajukan di atas akan muncul pelacakannya di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-150">
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">ID Tiket</th>
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Bahan Baku</th>
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Jumlah</th>
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Urgensi</th>
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Diajukan Pada</th>
                  <th className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status Pengiriman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((req: any) => {
                  let statusColor = "bg-slate-100 text-slate-500";
                  let StatusIcon = Hourglass;
                  
                  if (req.status === "Approved") {
                    statusColor = "bg-blue-50 text-blue-600 border border-blue-100";
                    StatusIcon = Truck;
                  } else if (req.status === "Delivered" || req.status === "Selesai") {
                    statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                    StatusIcon = CheckCircle2;
                  } else if (req.status === "Pending") {
                    statusColor = "bg-amber-50 text-amber-600 border border-amber-100";
                    StatusIcon = Hourglass;
                  }

                  const urgencyColor = req.urgency === "High" 
                    ? "text-red-600 bg-red-50 border border-red-100 font-black text-[9px]" 
                    : req.urgency === "Medium"
                    ? "text-amber-600 bg-amber-50 border border-amber-100 font-black text-[9px]"
                    : "text-slate-650 bg-slate-50 border border-slate-100 font-black text-[9px]";

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-xs font-black text-slate-800 tracking-tight">#{req.id}</td>
                      <td className="py-4 text-xs font-extrabold text-slate-800 tracking-tight">{req.material}</td>
                      <td className="py-4 text-xs font-bold text-slate-650 tracking-tight">{req.amount}</td>
                      <td className="py-4">
                        <span className={cn("px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold text-[9px]", urgencyColor)}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-500 font-medium">
                        {new Date(req.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", statusColor)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{req.status === "Pending" ? "Menunggu Persetujuan" : req.status === "Approved" ? "Dalam Pengiriman" : "Telah Diterima"}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
};
