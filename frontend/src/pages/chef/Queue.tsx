import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { ProductionLog } from "@/src/types";
import { Play, CheckCircle2, Thermometer, MessageSquare, QrCode, ClipboardList, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/src/lib/utils";

interface ExtendedProductionLog extends ProductionLog {
  ingredients?: { name: string; amount: string }[];
}

export const ChefQueue = ({ user }: { user: any }) => {
  const [tasks, setTasks] = React.useState<ExtendedProductionLog[]>([]);
  const [selectedTask, setSelectedTask] = React.useState<ExtendedProductionLog | null>(null);
  const [isQAModalOpen, setQAModalOpen] = React.useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [handoverData, setHandoverData] = React.useState<{ id: string; qr: string } | null>(null);

  const fetchTasks = React.useCallback(() => {
    api.getActivity(user?.kitchenId).then(setTasks);
  }, [user?.kitchenId]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAction = (task: ExtendedProductionLog) => {
    if (task.status === 'NotStarted' || task.status === 'Preparing') {
      api.startTask(task.id).then(() => {
        fetchTasks();
      });
    } else if (task.status === 'Cooking' || task.status === 'Ready') {
      setSelectedTask(task);
      setQAModalOpen(true);
    }
  };

  const openInfo = (task: ExtendedProductionLog) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const getStatusConfig = (status: ProductionLog['status']) => {
    switch (status) {
      case 'NotStarted':
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const config = getStatusConfig(task.status);
          const StatusIcon = config.icon;

          return (
            <Card key={task.id} className="p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all rounded-[28px] border-2 border-slate-50/50 hover:border-primary/10">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("px-4 py-1.5 rounded-full font-black text-[9px] tracking-[0.2em] border-none uppercase shadow-sm", config.color)}>
                  • {config.label}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">PIC</p>
                  <p className="text-xs font-black text-slate-800 tracking-tight">{user?.name}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-primary transition-colors leading-[0.9]">
                  {task.menu}
                </h3>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xl font-black text-slate-700 tracking-tighter">{task.servings} <span className="text-[10px] uppercase font-bold tracking-widest ml-0.5 text-slate-600">Porsi</span></span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sejak {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <Button 
                   className={cn(
                    "col-span-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95",
                    task.status === 'Ready' 
                      ? "bg-green-500 hover:bg-green-600 shadow-green-500/10" 
                      : task.status === 'Cooking'
                      ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
                      : "bg-primary hover:bg-primary-dark shadow-primary/10"
                  )}
                  onClick={() => handleAction(task)}
                >
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {config.btnText}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-12 aspect-square rounded-2xl bg-slate-50 text-slate-500 hover:bg-primary/5 hover:text-primary border-none shadow-sm transition-all"
                  onClick={() => openInfo(task)}
                >
                  <Info className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Detail Produksi & Bahan"
        className="max-w-2xl"
      >
        {selectedTask && (
          <div className="space-y-10 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-50 space-y-2">
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Target Produksi</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{selectedTask.servings} <span className="text-sm uppercase font-bold text-slate-600">Porsi</span></p>
              </div>
              <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-50 space-y-2">
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Waktu Mulai</p>
                <p className="text-4xl font-black text-primary tracking-tighter">{new Date(selectedTask.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Bahan Baku Dibutuhkan</h4>
                 <Badge status="Tervalidasi" className="bg-green-50 text-green-600 border-none font-black text-[9px] tracking-widest uppercase" />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {selectedTask.ingredients ? (
                  selectedTask.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[28px] hover:border-primary/20 transition-all group">
                       <span className="text-lg font-black text-slate-700 tracking-tight group-hover:text-primary transition-colors">{ing.name}</span>
                       <span className="px-6 py-2 bg-slate-50 rounded-2xl text-sm font-black text-slate-500 tracking-tighter">{ing.amount}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Data bahan tidak tersedia</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
               <Button className="w-full py-6 rounded-[24px] font-black uppercase tracking-widest" variant="ghost" onClick={() => setDetailModalOpen(false)}>
                 Tutup Detail
               </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* QA & Handover Modal */}
      <Modal 
        isOpen={isQAModalOpen} 
        onClose={() => setQAModalOpen(false)} 
        title={`QA & Serah Terima: ${selectedTask?.menu}`}
        className="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Thermometer className="w-3.5 h-3.5 text-red-500" />
                Suhu Akhir (°C)
              </label>
              <input type="number" step="0.1" className="w-full border-2 border-slate-50 bg-slate-50 rounded-[24px] p-6 font-black text-3xl tracking-tighter focus:bg-white focus:border-primary transition-all outline-none" placeholder="75.0" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Catatan Kualitas
              </label>
              <textarea className="w-full border-2 border-slate-50 bg-slate-50 rounded-[24px] p-6 h-28 resize-none font-bold text-slate-700 focus:bg-white focus:border-primary transition-all outline-none" placeholder="Tambahkan catatan QC..." />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="font-black text-slate-800 text-lg tracking-tight">Kalkulator Stok Balikan</h4>
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">Update Real-time</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Ayam Negri', unit: 'kg' },
                { name: 'Minyak Goreng', unit: 'L' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-6 p-6 bg-slate-50/50 border border-slate-50 rounded-[24px] group hover:bg-white hover:border-slate-100 transition-all">
                  <span className="text-base font-black text-slate-700 tracking-tight">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <input type="text" className="w-28 text-right bg-white border border-slate-200 rounded-xl p-3 text-lg font-black tracking-tighter text-primary" placeholder="Sisa" />
                    <span className="text-sm font-black text-slate-500 w-6 uppercase">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full py-6 text-lg" variant="primary" onClick={submitQA}>
            {selectedTask?.status === 'Ready' ? 'Buat ID & QR Serah Terima' : 'Konfirmasi Selesai Masak'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
