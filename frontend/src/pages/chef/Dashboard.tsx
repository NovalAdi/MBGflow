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
import { useNavigate } from "react-router-dom";

export const ChefDashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<any>(null);
  const [inventoryItems, setInventoryItems] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isVerified, setIsVerified] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  

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
      const [dashData, invData, notifData, verificationStatus] = await Promise.all([
        api.getChefDashboardData(user.kitchenId),
        api.getInventory(),
        api.getNotifications(user.kitchenId),
        api.checkStockVerificationStatus(user.kitchenId)
      ]);
      setData(dashData);
      setInventoryItems(invData);
      setNotifications(notifData || []);
      setIsVerified(verificationStatus.verified);
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
    if (!isVerified) {
      alert("Harap lakukan verifikasi stok harian terlebih dahulu di halaman Antrean Masak.");
      navigate("/chef/queue");
      return;
    }
    try {
      await api.startTask(taskId);
      showNotification("Sukses memulai proses masak!");
      loadDashboardData(true);
    } catch (err: any) {
      alert(err.message || "Gagal memulai tugas.");
    }
  };

  const handleFinishTask = async (taskId: string) => {
    if (!isVerified) {
      alert("Harap lakukan verifikasi stok harian terlebih dahulu di halaman Antrean Masak.");
      navigate("/chef/queue");
      return;
    }
    try {
      await api.finishTask({ productionId: taskId });
      showNotification("Masakan telah selesai dimasak!");
      loadDashboardData(true);
    } catch (err: any) {
      alert(err.message || "Gagal menyelesaikan tugas.");
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: 1 } : n));
      showNotification("Notifikasi ditandai dibaca!");
    } catch (err: any) {
      console.error("Failed to mark notification read", err);
    }
  };

  const parseShortageNotification = (message: string) => {
    const parts = message.split("kekurangan bahan:");
    if (parts.length < 2) return [];
    const itemsText = parts[1].replace(/\.$/, "").trim();
    const items = itemsText.split(",").map(item => {
      const match = item.match(/(.+?)\s*\(kurang\s+(.+?)\)/);
      if (match) {
        return {
          material: match[1].trim(),
          amount: match[2].trim()
        };
      }
      return null;
    }).filter((x): x is { material: string; amount: string } => x !== null);
    return items;
  };

  const handleCreateRestockRequestFromNotification = (notif: any) => {
    const parsedShortages = parseShortageNotification(notif.message);
    navigate("/chef/restock", { 
      state: { 
        prefillShortages: parsedShortages,
        notificationId: notif.id
      } 
    });
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Chef</h1>
          <p className="text-slate-600 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">
            {data?.kitchenName || "Dapur Utama"} • {data?.city || "Kota"} • Shift Pagi (06:00 - 14:00)
          </p>
        </div>
        <button 
          onClick={() => loadDashboardData(true)}
          disabled={refreshing}
          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border border-slate-100"
          title="Perbarui Data"
        >
          <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
        </button>
      </div>

      {/* Verification Warning Alert */}
      {!isVerified && (
        <Card className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Verifikasi Stok Harian Dapur Belum Dilakukan!</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Harap selaraskan sisa stok fisik dapur Anda terlebih dahulu di menu Antrean Masak sebelum memulai proses memasak.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/chef/queue")}
            className="py-3.5 px-6 rounded-2xl font-black uppercase tracking-widest text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer w-full sm:w-auto"
          >
            Lakukan Verifikasi
          </Button>
        </Card>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <Card className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-500 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Terjadi Kendala Teknis</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{errorMsg}</p>
          </div>
        </Card>
      )}

      {/* Notifications Section */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Pemberitahuan Sistem (Kekurangan Bahan)</h3>
            <span className="text-[9px] font-black text-white bg-red-500 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
              {notifications.filter(n => !n.isRead).length} Baru
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {notifications.filter(n => !n.isRead).map((notif: any) => (
              <Card key={notif.id} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:shadow-md transition-all">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="p-2.5 bg-red-100 text-red-500 rounded-2xl shrink-0">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2">
                      {new Date(notif.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0 justify-end">
                  <Button 
                    onClick={() => handleCreateRestockRequestFromNotification(notif)}
                    className="py-3.5 px-5 rounded-2xl font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer w-full md:w-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Buat Permintaan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
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
                            disabled={!isVerified}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer",
                              !isVerified
                                ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed pointer-events-none opacity-60"
                                : "bg-primary hover:bg-primary-dark shadow-primary/10 text-white"
                            )}
                          >
                            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                            Mulai Masak
                          </Button>
                        )}
                        {isCooking && (
                          <Button 
                            onClick={() => handleFinishTask(item.id)}
                            disabled={!isVerified}
                            className={cn(
                              "text-[10px] font-black uppercase tracking-widest h-9 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer",
                              !isVerified
                                ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed pointer-events-none opacity-60"
                                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white"
                            )}
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
                          {stock.package_capacity !== null
                            ? `${stock.qty_packed > 0 ? `${stock.qty_packed} ` : ''}${stock.container} (@ ${stock.package_capacity} ${stock.package_unit})${stock.qty_loose > 0 ? ` + ${stock.qty_loose} ${stock.package_unit}` : ''}`
                            : stock.container}
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

        </div>

      </div>

    </div>
  );
};
