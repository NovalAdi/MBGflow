import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { ProductionLog } from "@/src/types";
import { Play, CheckCircle2, Thermometer, MessageSquare, QrCode, ClipboardList, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/src/lib/utils";

interface ExtendedProductionLog extends ProductionLog {
  ingredients?: { name: string; amount: string }[];
}

export const ChefQueue = ({ user }: { user: any }) => {
  const [tasks, setTasks] = React.useState<ExtendedProductionLog[]>([]);
  const [menus, setMenus] = React.useState<any[]>([]);
  const [selectedTask, setSelectedTask] = React.useState<ExtendedProductionLog | null>(null);
  const [isQAModalOpen, setQAModalOpen] = React.useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [handoverData, setHandoverData] = React.useState<{ id: string; qr: string } | null>(null);

  // Stock Verification States
  const [isVerified, setIsVerified] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [temperature, setTemperature] = React.useState("");
  const [qaError, setQaError] = React.useState<string | null>(null);
  const [leftoverStock, setLeftoverStock] = React.useState<Record<string, string>>({});
  const [isVerificationModalOpen, setVerificationModalOpen] = React.useState(false);
  const [verificationData, setVerificationData] = React.useState<{
    lastMenu: string | null;
    detailedIngredients: any[];
    otherIngredients: any[];
  } | null>(null);
  const [pendingTaskId, setPendingTaskId] = React.useState<string | null>(null);
  const [detailedInputs, setDetailedInputs] = React.useState<Record<string, { qty_packed: string; qty_loose: string }>>({});
  const [otherInputs, setOtherInputs] = React.useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = React.useState(false);

  const [kitchenStock, setKitchenStock] = React.useState<any[]>([]);

  const fetchTasks = React.useCallback(async () => {
    try {
      const [tasksData, menusData, verificationStatus, kitchenData] = await Promise.all([
        api.getActivity(user?.kitchenId),
        api.getMenus(),
        api.checkStockVerificationStatus(user?.kitchenId),
        user?.kitchenId ? api.getKitchenDetail(user.kitchenId) : Promise.resolve(null)
      ]);
      setTasks(tasksData || []);
      setMenus(menusData || []);
      setIsVerified(verificationStatus.verified);
      setKitchenStock(kitchenData?.stock || []);
    } catch (error) {
      console.error("Failed to fetch tasks and menus", error);
    }
  }, [user?.kitchenId]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAction = async (task: ExtendedProductionLog) => {
    if (task.status === 'NotStarted' || task.status === 'Preparing' || task.status === 'Pending') {
      try {
        const status = await api.checkStockVerificationStatus(user?.kitchenId);
        if (status.verified) {
          api.startTask(task.id).then(() => {
            setErrorMsg(null);
            fetchTasks();
          }).catch((err: any) => {
            setErrorMsg(err.message || "Stok kosong atau stok tidak mencukupi untuk bahan baku utama!");
          });
        } else {
          setPendingTaskId(task.id);
          const data = await api.getLastCookedMenu(user?.kitchenId);
          setVerificationData(data);
          
          // Pre-populate detailed inputs
          const newDetailedInputs: Record<string, { qty_packed: string; qty_loose: string }> = {};
          data.detailedIngredients.forEach((ing: any) => {
            newDetailedInputs[ing.batchId] = {
              qty_packed: String(ing.qty_packed),
              qty_loose: String(ing.qty_loose)
            };
          });
          setDetailedInputs(newDetailedInputs);

          // Pre-populate other inputs
          const newOtherInputs: Record<string, string> = {};
          data.otherIngredients.forEach((ing: any) => {
            const cap = Number(ing.package_capacity) || 0;
            const totalVal = cap > 0 ? (ing.qty_packed * cap) + ing.qty_loose : ing.qty_loose;
            newOtherInputs[ing.batchId] = String(totalVal);
          });
          setOtherInputs(newOtherInputs);

          setVerificationModalOpen(true);
        }
      } catch (err) {
        console.error("Failed to perform stock verification check", err);
        // Fallback: start task anyway
        api.startTask(task.id).then(() => {
          setErrorMsg(null);
          fetchTasks();
        }).catch((err: any) => {
          setErrorMsg(err.message || "Stok kosong atau stok tidak mencukupi untuk bahan baku utama!");
        });
      }
    } else if (task.status === 'Cooking' || task.status === 'Ready') {
      setSelectedTask(task);
      setTemperature("");
      setLeftoverStock({});
      setQaError(null);
      setQAModalOpen(true);
    }
  };

  const submitVerification = async () => {
    if (!user?.kitchenId || !pendingTaskId || !verificationData) return;
    setIsVerifying(true);

    try {
      const items: any[] = [];

      // Collect detailed ingredients
      Object.keys(detailedInputs).forEach((batchId) => {
        const val = detailedInputs[batchId];
        items.push({
          batchId,
          qty_packed: Number(val.qty_packed) || 0,
          qty_loose: Number(val.qty_loose) || 0
        });
      });

      // Collect other ingredients
      Object.keys(otherInputs).forEach((batchId) => {
        const val = otherInputs[batchId];
        const batch = verificationData.otherIngredients.find(b => b.batchId === batchId);
        const totalVal = Number(val) || 0;
        
        if (batch) {
          const cap = Number(batch.package_capacity);
          if (cap > 0) {
            items.push({
              batchId,
              qty_packed: Math.floor(totalVal / cap),
              qty_loose: Number((totalVal % cap).toFixed(4))
            });
          } else {
            items.push({
              batchId,
              qty_packed: 0,
              qty_loose: totalVal
            });
          }
        } else {
          items.push({
            batchId,
            qty_loose: totalVal
          });
        }
      });

      await api.submitStockVerification({
        kitchenId: user.kitchenId,
        verifiedBy: user.name,
        items
      });

      // After verification, start the task if we have a valid pendingTaskId
      if (pendingTaskId && pendingTaskId !== "dummy") {
        try {
          await api.startTask(pendingTaskId);
          setErrorMsg(null);
        } catch (err: any) {
          setErrorMsg(err.message || "Stok kosong atau stok tidak mencukupi untuk bahan baku utama!");
        }
      }
      
      setIsVerified(true);
      setVerificationModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      alert(err?.message || "Gagal melakukan verifikasi stok.");
    } finally {
      setIsVerifying(false);
    }
  };

  const openInfo = (task: ExtendedProductionLog) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const getStatusConfig = (status: ProductionLog['status']) => {
    switch (status) {
      case 'NotStarted':
      case 'Pending':
        return { label: 'ANTREAN', color: 'bg-slate-100 text-slate-500', btnText: 'Mulai Masak', icon: Play };
      case 'Preparing':
        return { label: 'PERSIAPAN', color: 'bg-indigo-50 text-indigo-500', btnText: 'Mulai Masak', icon: Play };
      case 'Cooking':
        return { label: 'DIMASAK', color: 'bg-orange-100/50 text-orange-600 border border-orange-200', btnText: 'Selesai Masak', icon: CheckCircle2 };
      case 'Ready':
        return { label: 'SIAP DIANTAR', color: 'bg-primary-light text-primary border border-primary/20', btnText: 'Serah Terima', icon: QrCode };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-500', btnText: 'Proses', icon: Play };
    }
  };

  const submitQA = () => {
    const tempVal = parseFloat(temperature);
    if (isNaN(tempVal)) {
      setQaError("Suhu wajib diisi!");
      return;
    }
    if (tempVal < 60) {
      setQaError("Suhu makanan kurang panas / di bawah standar keamanan pangan!");
      return;
    }

    let hasNegative = false;
    Object.keys(leftoverStock).forEach(key => {
      const val = parseFloat(leftoverStock[key]);
      if (!isNaN(val) && val < 0) {
        hasNegative = true;
      }
    });

    if (hasNegative) {
      setQaError("Sisa bahan baku tidak boleh bernilai negatif!");
      return;
    }

    setQaError(null);

    api.finishTask({ productionId: selectedTask?.id }).then(res => {
      // User requested: Cooking -> Ready should not generate QR
      if (selectedTask?.status === 'Ready') {
        setHandoverData({ id: res.handoverId, qr: JSON.stringify({ id: res.handoverId, menu: selectedTask?.menu }) });
      }
      fetchTasks();
      setQAModalOpen(false);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {errorMsg && (
        <Card className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-500 rounded-2xl shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Gagal Memproses Antrean</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{errorMsg}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-slate-600 font-bold border-none" 
            onClick={() => setErrorMsg(null)}
          >
            Tutup
          </Button>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Antrean Masak</h2>
          <p className="text-slate-650 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Daftar porsi produksi yang perlu segera diproses hari ini</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-slate-650 uppercase tracking-widest">Shift Kontrol</p>
              <p className="text-xs font-black text-primary tracking-tighter">Pagi (06:00 - 14:00)</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shadow-sm">
              <ClipboardList className="w-5 h-5" />
           </div>
        </div>
      </div>

      {handoverData && (
        <Card className="bg-primary text-white relative overflow-hidden border-none animate-in fade-in zoom-in-95 duration-500 shadow-xl shadow-primary/20 rounded-[28px]">
          <div className="p-6 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="bg-white p-6 rounded-[28px] shadow-xl transform hover:scale-105 transition-transform">
              <QRCodeSVG value={handoverData.qr} size={140} />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">Logistik Siap</p>
                <h3 className="text-3xl font-black tracking-tighter mt-1">ID: {handoverData.id}</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg font-medium tracking-tight">
                Produksi telah divalidasi. ID serah terima ini berlaku untuk 30 menit ke depan. Pastikan logistik memindai kode ini.
              </p>
              <Button variant="secondary" onClick={() => setHandoverData(null)} className="py-4 px-8 text-base rounded-2xl font-black tracking-tight shadow-xl">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Selesai Serah Terima
              </Button>
            </div>
          </div>
          <div className="absolute top-[-80px] right-[-80px] p-8 opacity-5">
             <QrCode className="w-[500px] h-[500px]" />
          </div>
        </Card>
      )}

      {/* Verification Warning Alert */}
      {!isVerified && (
        <Card className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
              <ClipboardList className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Verifikasi Stok Harian Dapur Belum Dilakukan!</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Harap selaraskan sisa stok fisik dapur Anda sebelum memproses antrean masak hari ini.</p>
            </div>
          </div>
          <Button 
            onClick={async () => {
              try {
                const data = await api.getLastCookedMenu(user?.kitchenId);
                setVerificationData(data);
                
                const newDetailedInputs: Record<string, { qty_packed: string; qty_loose: string }> = {};
                data.detailedIngredients.forEach((ing: any) => {
                  newDetailedInputs[ing.batchId] = {
                    qty_packed: String(ing.qty_packed),
                    qty_loose: String(ing.qty_loose)
                  };
                });
                setDetailedInputs(newDetailedInputs);

                const newOtherInputs: Record<string, string> = {};
                data.otherIngredients.forEach((ing: any) => {
                  const cap = Number(ing.package_capacity) || 0;
                  const totalVal = cap > 0 ? (ing.qty_packed * cap) + ing.qty_loose : ing.qty_loose;
                  newOtherInputs[ing.batchId] = String(totalVal);
                });
                setOtherInputs(newOtherInputs);

                // Set a default pending task id as the first NotStarted task
                const firstNotStarted = tasks.find(t => t.status === 'NotStarted' || t.status === 'Preparing' || t.status === 'Pending');
                if (firstNotStarted) {
                  setPendingTaskId(firstNotStarted.id);
                } else if (tasks.length > 0) {
                  setPendingTaskId(tasks[0].id);
                } else {
                  setPendingTaskId("dummy");
                }

                setVerificationModalOpen(true);
              } catch (err) {
                console.error("Failed to load verification items", err);
              }
            }}
            className="py-3.5 px-6 rounded-2xl font-black uppercase tracking-widest text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer w-full sm:w-auto"
          >
            Verifikasi Sekarang
          </Button>
        </Card>
      )}

      <div className="relative">
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300", !isVerified && "blur-[6px] pointer-events-none opacity-40 select-none")}>
          {tasks.map((task) => {
            const config = getStatusConfig(task.status);
            const StatusIcon = config.icon;

            const menuData = menus.find(m => m.name.toLowerCase() === task.menu.toLowerCase());
            const ingredients = menuData ? menuData.ingredients.map((ing: any) => {
              const needed = ing.perPortion * task.servings;
              return {
                name: ing.name,
                amount: `${needed.toFixed(2)} ${ing.unit}`,
                numericAmount: needed,
                unit: ing.unit
              };
            }) : [];

            const isStockInsufficient = ingredients.some(ing => {
              const stockItem = kitchenStock.find(s => s.name.toLowerCase() === ing.name.toLowerCase());
              if (!stockItem) return true;
              let totalAvailable = 0;
              if (stockItem.batches && stockItem.batches.length > 0) {
                stockItem.batches.forEach((b: any) => {
                  const qtyPacked = Number(b.qty_packed) || 0;
                  const qtyLoose = Number(b.qty_loose) || 0;
                  const cap = Number(b.package_capacity);
                  totalAvailable += (!isNaN(cap) && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;
                });
              } else {
                totalAvailable = parseFloat(stockItem.totalWeight) || 0;
              }
              return totalAvailable < ing.numericAmount;
            });

            const showStockWarning = isStockInsufficient && (task.status === 'NotStarted' || task.status === 'Preparing' || task.status === 'Pending');

            return (
              <Card key={task.id} className="p-8 group hover:shadow-2xl hover:shadow-primary/10 transition-all rounded-[40px] border-0 bg-white flex flex-col justify-between h-full relative overflow-hidden shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("px-4 py-1.5 rounded-full font-black text-[9px] tracking-[0.2em] border-none uppercase shadow-sm", config.color)}>
                      • {config.label}
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PIC</p>
                      <p className="text-xs font-black text-slate-800 tracking-tight">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-primary transition-colors leading-[1.0] font-sans">
                      {task.menu}
                    </h3>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-xl font-black text-slate-700 tracking-tighter">{task.servings} <span className="text-[10px] uppercase font-bold tracking-widest ml-0.5 text-slate-650">Porsi</span></span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Shift Pagi</span>
                    </div>
                  </div>                  {/* Ingredients List Section */}
                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <p className="text-[9px] font-black text-slate-450 uppercase tracking-[0.2em] mb-3">Rincian Bahan Baku</p>
                    {ingredients.length > 0 ? (
                      <div className="max-h-28 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {ingredients.map((ing: any, i: number) => {
                          const stockItem = kitchenStock.find(s => s.name.toLowerCase() === ing.name.toLowerCase());
                          let totalAvailable = 0;
                          if (stockItem) {
                            if (stockItem.batches && stockItem.batches.length > 0) {
                              stockItem.batches.forEach((b: any) => {
                                const qtyPacked = Number(b.qty_packed) || 0;
                                const qtyLoose = Number(b.qty_loose) || 0;
                                const cap = Number(b.package_capacity);
                                totalAvailable += (!isNaN(cap) && cap > 0) ? (qtyPacked * cap) + qtyLoose : qtyLoose;
                              });
                            } else {
                              totalAvailable = parseFloat(stockItem.totalWeight) || 0;
                            }
                          }
                          const isIngInsufficient = totalAvailable < ing.numericAmount;

                          return (
                            <div key={i} className={cn(
                              "flex justify-between items-center rounded-xl px-4 py-2 border",
                              isIngInsufficient && (task.status === 'NotStarted' || task.status === 'Preparing' || task.status === 'Pending')
                                ? "bg-red-50/55 border-red-100 text-red-700 font-bold"
                                : "bg-slate-50 border-slate-100/50 text-slate-700"
                            )}>
                              <span className="text-xs font-bold">{ing.name}</span>
                              <span className={cn(
                                "text-xs font-black tracking-tight",
                                isIngInsufficient && (task.status === 'NotStarted' || task.status === 'Preparing' || task.status === 'Pending')
                                  ? "text-red-650 font-black"
                                  : "text-primary font-black"
                              )}>{ing.amount}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-550 italic">Memuat rincian bahan...</p>
                    )}
                  </div>
                </div>

                {showStockWarning && (
                  <div id="alert_NoStockError" className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 items-start animate-pulse">
                    <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-red-800 uppercase tracking-widest">Stok tidak mencukupi</p>
                      <p className="text-[10px] leading-relaxed text-red-700 font-bold mt-1">
                        Bahan baku kosong atau kurang untuk memenuhi jumlah porsi. Mulai masak dinonaktifkan.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons at the bottom */}
                <div className="grid grid-cols-5 gap-3 mt-auto pt-2">
                  <Button 
                     disabled={showStockWarning || !isVerified}
                     className={cn(
                      "col-span-4 h-12 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer",
                      (showStockWarning || !isVerified)
                        ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed pointer-events-none opacity-50"
                        : task.status === 'Ready' 
                        ? "bg-green-500 hover:bg-green-600 shadow-green-500/20 text-white" 
                        : task.status === 'Cooking'
                        ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white"
                        : "bg-primary hover:bg-primary-dark shadow-primary/20 text-white"
                    )}
                    onClick={() => handleAction({ ...task, ingredients })}
                  >
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {config.btnText}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 aspect-square rounded-[20px] bg-slate-50 text-slate-500 hover:bg-primary/5 hover:text-primary border-none shadow-sm transition-all flex items-center justify-center"
                    onClick={() => openInfo({ ...task, ingredients })}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {!isVerified && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-slate-100/5 backdrop-blur-[2px] rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="p-4 bg-primary-light text-primary rounded-full mb-4 shadow-md">
              <ClipboardList className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">Antrean Masak Dikunci</h4>
            <p className="text-sm text-slate-550 font-medium text-center mt-2 max-w-sm">
              Selesaikan pengecekan sisa stok dapur terlebih dahulu menggunakan tombol verifikasi di atas.
            </p>
          </div>
        )}
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Detail Laporan Produksi"
        className="max-w-xl"
      >
        {selectedTask && (
          <div className="space-y-6 py-2">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Target Produksi</span>
                <span className="text-sm font-extrabold text-slate-800">{selectedTask.servings} Porsi</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Waktu Mulai</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {selectedTask.startTime ? new Date(selectedTask.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"} WIB
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                Bahan Baku Dibutuhkan
              </h5>
              {selectedTask.ingredients && selectedTask.ingredients.length > 0 ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 font-bold text-slate-400">
                        <th className="p-3">Nama Bahan</th>
                        <th className="p-3 text-right">Kebutuhan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {selectedTask.ingredients.map((ing, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-3">{ing.name}</td>
                          <td className="p-3 text-right text-primary font-black">{ing.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Data bahan baku tidak tersedia.</p>
              )}
            </div>

            <div className="pt-2">
               <Button className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={() => setDetailModalOpen(false)}>
                 Tutup Detail
               </Button>
            </div>
          </div>
        )}
      </Modal>      {/* QA & Handover Modal */}
      <Modal 
        isOpen={isQAModalOpen} 
        onClose={() => setQAModalOpen(false)} 
        title={`QA & Serah Terima: ${selectedTask?.menu}`}
        className="max-w-3xl"
      >
        <div className="space-y-6">
          {qaError && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold shadow-sm">
              {qaError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-red-500" />
                Suhu Akhir (°C)
              </span>
              <input 
                type="number" 
                name="suhu"
                step="0.1" 
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all" 
                placeholder="75.0" 
                value={temperature}
                onChange={(e) => {
                  setTemperature(e.target.value);
                  setQaError(null);
                }}
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Catatan Kualitas
              </span>
              <textarea className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all h-24 resize-none" placeholder="Tambahkan catatan QC..." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Kalkulator Stok Balikan</h4>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update Real-time</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Ayam Negri', unit: 'kg' },
                { name: 'Minyak Goreng', unit: 'L' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-6 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:border-primary/20 transition-all">
                  <span className="text-sm font-bold text-slate-700">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      name={item.name}
                      value={leftoverStock[item.name] || ""}
                      onChange={(e) => {
                        setLeftoverStock(prev => ({ ...prev, [item.name]: e.target.value }));
                        setQaError(null);
                      }}
                      className="w-28 text-right bg-white border-2 border-slate-100 focus:border-primary rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-all" 
                      placeholder="Sisa" 
                    />
                    <span className="text-xs font-bold text-slate-500 w-6 uppercase">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs" onClick={submitQA}>
            {selectedTask?.status === 'Ready' ? 'Buat ID & QR Serah Terima' : 'Konfirmasi Selesai Masak'}
          </Button>
        </div>
      </Modal>

      {/* Stock Verification Modal */}
      <Modal
        isOpen={isVerificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        title="Verifikasi Awal Stok Dapur"
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="p-4 bg-primary-light border border-primary/20 rounded-2xl">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
              Pengecekan Stok Wajib
            </span>
            <p className="text-slate-500 text-xs font-bold leading-relaxed">
              Sebelum memproses antrean masak hari ini, harap verifikasi stok fisik bahan baku Anda. Ini menyelaraskan stok dapur dengan sistem.
            </p>
          </div>

          <div className="space-y-8 pr-1">
            {verificationData?.lastMenu && (
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-3">
                  <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
                    Bahan Baku Menu Kemarin ({verificationData.lastMenu})
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Harap cek wadah dan sisa eceran secara mendetail
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {verificationData.detailedIngredients.map((ing) => (
                    <div key={ing.batchId} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight leading-none">
                            {ing.materialName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                            ID: {ing.batchId} • {ing.container} {ing.package_capacity ? `(@ ${ing.package_capacity} ${ing.package_unit})` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            Kemasan Utuh ({ing.container})
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={detailedInputs[ing.batchId]?.qty_packed || "0"}
                            onChange={(e) => setDetailedInputs({
                              ...detailedInputs,
                              [ing.batchId]: {
                                ...detailedInputs[ing.batchId],
                                qty_packed: e.target.value
                              }
                            })}
                            className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            Sisa Eceran ({ing.package_unit || ing.unit || 'kg'})
                          </span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={detailedInputs[ing.batchId]?.qty_loose || "0"}
                            onChange={(e) => setDetailedInputs({
                              ...detailedInputs,
                              [ing.batchId]: {
                                ...detailedInputs[ing.batchId],
                                qty_loose: e.target.value
                              }
                            })}
                            className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {verificationData?.otherIngredients && verificationData.otherIngredients.length > 0 && (
              <div className="space-y-4">
                <div className="border-l-4 border-slate-400 pl-3">
                  <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
                    Bahan Baku Lainnya (Pengecekan Cepat)
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Masukkan total berat/volume riil yang bersisa
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {verificationData.otherIngredients.map((ing) => (
                    <div key={ing.batchId} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                        <p className="font-bold text-slate-700 tracking-tight text-sm">
                          {ing.materialName}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                          {ing.container} {ing.package_capacity ? `(@ ${ing.package_capacity} ${ing.package_unit})` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={otherInputs[ing.batchId] || "0"}
                          onChange={(e) => setOtherInputs({
                            ...otherInputs,
                            [ing.batchId]: e.target.value
                          })}
                          className="w-32 text-right bg-white border-2 border-slate-100 focus:border-primary rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-all"
                        />
                        <span className="text-xs font-bold text-slate-500 w-8 uppercase">
                          {ing.package_unit || ing.unit || 'kg'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button 
            className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs" 
            onClick={submitVerification}
            disabled={isVerifying}
          >
            {isVerifying ? "Menyimpan Verifikasi..." : "Konfirmasi & Mulai Masak"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
