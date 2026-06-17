import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Modal } from "@/src/components/ui/Modal";
import { api } from "@/src/services/api";
import { Kitchen, InventoryItem } from "@/src/types";
import { MENUS } from "@/src/constants";
import { ArrowLeft, MapPin, Users, History, Warehouse, ChevronDown, Plus, Trash2, Edit2, Package, ExternalLink, Zap, Info, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useParams, useNavigate, Link } from "react-router-dom";

// Ingredients calculated dynamically from MENUS

export const KitchenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'Staf' | 'Shift' | 'Stok'>('Staf');
  const [kitchens, setKitchens] = React.useState<Kitchen[]>([]);
  const [selectedKitchenId, setSelectedKitchenId] = React.useState<string>(id || "k1");
  const [detail, setDetail] = React.useState<any>(null);
  const [isStaffModalOpen, setStaffModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedProduction, setSelectedProduction] = React.useState<any>(null);
  const [isProductionModalOpen, setProductionModalOpen] = React.useState(false);
  const [newStaffName, setNewStaffName] = React.useState("");
  const [newStaffRole, setNewStaffRole] = React.useState("Head Chef");
  const [currentKitchen, setCurrentKitchen] = React.useState<any>(null);
  const [menus, setMenus] = React.useState<any[]>([]);

  // New states for staff modal & unassigned staff
  const [isManualMode, setIsManualMode] = React.useState(false);
  const [unassignedStaff, setUnassignedStaff] = React.useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = React.useState("");
  const [newStaffEmail, setNewStaffEmail] = React.useState("");
  const [newStaffPassword, setNewStaffPassword] = React.useState("password");
  const [staffError, setStaffError] = React.useState<string | null>(null);
  const [editingStaff, setEditingStaff] = React.useState<any | null>(null);
  const [kitchenError, setKitchenError] = React.useState<string | null>(null);

  // States for deleting station confirmation modal
  const [isDeleteStationModalOpen, setIsDeleteStationModalOpen] = React.useState(false);
  const [stationToDeleteId, setStationToDeleteId] = React.useState<string | null>(null);

  // States for Google Maps URL resolution in edit kitchen modal
  const [isResolvingMaps, setIsResolvingMaps] = React.useState(false);
  const [mapsError, setMapsError] = React.useState<string | null>(null);

  const [confirmDeleteStaffId, setConfirmDeleteStaffId] = React.useState<string | null>(null);
  const [alertMessage, setAlertMessage] = React.useState<{ title: string; message: string } | null>(null);

  const fetchUnassignedStaff = React.useCallback(async () => {
    try {
      const staffList = await api.getUsers();
      const unassigned = staffList.filter((s: any) => !s.kitchenId);
      setUnassignedStaff(unassigned);
      if (unassigned.length > 0) {
        setSelectedStaffId(unassigned[0].id);
      } else {
        setSelectedStaffId("");
        setIsManualMode(true);
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  }, []);

  // States for Work Station / Division of Labor
  const [stations, setStations] = React.useState<any[]>([]);
  const [isStationModalOpen, setStationModalOpen] = React.useState(false);
  const [editingStation, setEditingStation] = React.useState<any>(null);

  const [stationName, setStationName] = React.useState("");
  const [stationStaffId, setStationStaffId] = React.useState("");
  const [stationFocus, setStationFocus] = React.useState("");
  const [stationRoleName, setStationRoleName] = React.useState("");
  const [stationStatus, setStationStatus] = React.useState("Cooking");
  const [stationTool, setStationTool] = React.useState("");

  React.useEffect(() => {
    if (id) {
      setSelectedKitchenId(id);
    }
  }, [id]);

  const getAssignedStaff = (staffId: string) => {
    return detail?.staff?.find((s: any) => s.id === staffId);
  };

  const handleOpenStationModal = (sta?: any) => {
    const activeStaff = detail?.staff?.filter((s: any) => s.role !== 'Admin') || [];
    if (sta) {
      setEditingStation(sta);
      setStationName(sta.name);
      setStationStaffId(sta.staffId || activeStaff[0]?.id || "");
      setStationFocus(sta.focus);
      setStationRoleName(sta.roleName);
      setStationStatus(sta.status);
      setStationTool(sta.tool);
    } else {
      setEditingStation(null);
      setStationName("");
      setStationStaffId(activeStaff[0]?.id || "");
      setStationFocus("");
      setStationRoleName("");
      setStationStatus("Cooking");
      setStationTool("");
    }
    setStationModalOpen(true);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    
    let updatedStations = [...stations];
    if (editingStation) {
      updatedStations = stations.map(s => s.id === editingStation.id ? {
        ...s,
        name: stationName,
        staffId: stationStaffId,
        focus: stationFocus,
        roleName: stationRoleName,
        status: stationStatus,
        tool: stationTool
      } : s);
    } else {
      const newStation = {
        id: `st-${Math.random().toString(36).substr(2, 9)}`,
        name: stationName,
        staffId: stationStaffId,
        focus: stationFocus,
        roleName: stationRoleName,
        status: stationStatus,
        tool: stationTool
      };
      updatedStations.push(newStation);
    }

    setStations(updatedStations);
    localStorage.setItem(`stations_${detail.id}`, JSON.stringify(updatedStations));
    setStationModalOpen(false);
  };

  const handleOpenDeleteStationModal = (stationId: string) => {
    setStationToDeleteId(stationId);
    setIsDeleteStationModalOpen(true);
  };

  const handleConfirmDeleteStation = () => {
    if (!detail || !stationToDeleteId) return;
    const updatedStations = stations.filter(s => s.id !== stationToDeleteId);
    setStations(updatedStations);
    localStorage.setItem(`stations_${detail.id}`, JSON.stringify(updatedStations));
    setIsDeleteStationModalOpen(false);
    setStationToDeleteId(null);
  };

  const handleEditStaffClick = (staff: any) => {
    setEditingStaff(staff);
    setNewStaffName(staff.name);
    setNewStaffEmail(staff.email || "");
    setNewStaffRole(staff.role);
    setNewStaffPassword(""); 
    setStaffError(null);
    setIsManualMode(true);
    setStaffModalOpen(true);
  };

  const handleDeleteStaff = async (staffId: string) => {
    setConfirmDeleteStaffId(staffId);
  };

  const handleUpdateKitchen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKitchen) return;
    try {
      await api.updateKitchen(currentKitchen.id, currentKitchen);
      setDetail(currentKitchen);
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddressChange = async (val: string) => {
    setCurrentKitchen((prev: any) => ({ ...prev, address: val }));
    setMapsError(null);

    const isMapsLink = val.includes("maps.app.goo.gl") || 
                       val.includes("goo.gl/maps") || 
                       val.includes("google.com/maps");

    if (isMapsLink) {
      setIsResolvingMaps(true);
      try {
        const result = await api.parseMapsUrl(val);
        if (result.success) {
          setCurrentKitchen((prev: any) => ({
            ...prev,
            address: result.address || val,
            latitude: result.latitude,
            longitude: result.longitude,
            maps_url: val
          }));
        }
      } catch (err: any) {
        console.error("Maps parsing failed", err);
        setMapsError(err.message || "Gagal mendeteksi koordinat Google Maps.");
      } finally {
        setIsResolvingMaps(false);
      }
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    try {
      if (editingStaff) {
        if (!newStaffName || !newStaffEmail) {
          setStaffError("Nama lengkap dan email wajib diisi.");
          return;
        }
        await api.updateUser(editingStaff.id, {
          name: newStaffName,
          email: newStaffEmail,
          role: newStaffRole,
          password: newStaffPassword || undefined
        });
      } else {
        if (isManualMode) {
          if (!newStaffName || !newStaffEmail) {
            setStaffError("Nama lengkap dan email wajib diisi.");
            return;
          }
          await api.addKitchenStaff(selectedKitchenId, {
            name: newStaffName,
            email: newStaffEmail,
            role: newStaffRole,
            password: newStaffPassword
          });
        } else {
          if (!selectedStaffId) {
            setStaffError("Silakan pilih staf dari dropdown.");
            return;
          }
          await api.addKitchenStaff(selectedKitchenId, {
            staffId: selectedStaffId,
            role: newStaffRole
          });
        }
      }

      // Refresh kitchen detail from API
      const updatedData = await api.getKitchenDetail(selectedKitchenId);
      setDetail(updatedData);
      
      setStaffModalOpen(false);
      setNewStaffName("");
      setNewStaffEmail("");
      setNewStaffPassword("password");
      setSelectedStaffId("");
      setEditingStaff(null);
    } catch (err: any) {
      console.error("Failed to add or update kitchen staff", err);
      setStaffError(err.message || "Gagal menyimpan detail staf.");
    }
  };

  React.useEffect(() => {
    api.getKitchens().then(setKitchens);
    api.getMenus().then(setMenus);
  }, []);

  React.useEffect(() => {
    setDetail(null);
    setKitchenError(null);
    api.getKitchenDetail(selectedKitchenId).then((data) => {
      setDetail(data);
      setCurrentKitchen(data);

      const cached = localStorage.getItem(`stations_${selectedKitchenId}`);
      if (cached) {
        setStations(JSON.parse(cached));
      } else if (['k1', 'k2', 'k3'].includes(selectedKitchenId)) {
        const cleanStaff = data.staff?.filter((s: any) => s.role !== 'Admin') || [];
        const headChefs = cleanStaff.filter((s: any) => s.role === 'Chef' || s.role === 'Head Chef');
        const staffMembers = cleanStaff.filter((s: any) => s.role !== 'Chef' && s.role !== 'Head Chef');

        const defaultStations = [
          {
            id: 'st-1',
            name: "Supervisor Utama (Head Chef)",
            staffId: headChefs[0]?.id || "",
            focus: "QC Rasa, Standarisasi Resep, Alokasi Bahan Baku",
            roleName: "Head Chef",
            status: "Supervising",
            tool: "Main Control Table / Recipe Binder"
          },
          {
            id: 'st-2',
            name: "Stasiun Ayam Goreng",
            staffId: staffMembers[0]?.id || "",
            focus: "Penggorengan Ayam Goreng Gurih (FEFO Batches)",
            roleName: "Staff Masak 1",
            status: "Cooking",
            tool: "Deep Fryer Range A1-A3"
          },
          {
            id: 'st-3',
            name: "Stasiun Sayur Kangkung",
            staffId: staffMembers[1]?.id || "",
            focus: "Penumisan Kangkung & Sayuran Segar",
            roleName: "Staff Masak 2",
            status: "Cooking",
            tool: "Wok Burner High Pressure B1"
          },
          {
            id: 'st-4',
            name: "Bagian Packaging (Pengemasan)",
            staffId: staffMembers[2]?.id || "",
            focus: "Porsi Sealing, Pelabelan Barcode, Laporan FEFO",
            roleName: "Staff Packaging",
            status: "Packaging",
            tool: "Vacuum Automatic Sealer X1"
          }
        ];
        setStations(defaultStations);
        localStorage.setItem(`stations_${selectedKitchenId}`, JSON.stringify(defaultStations));
      } else {
        setStations([]);
      }
    }).catch((err) => {
      console.error("Failed to fetch kitchen details:", err);
      setKitchenError("Dapur tidak ditemukan");
    });
  }, [selectedKitchenId]);

  if (kitchenError) {
    return (
      <div id="kitchenNotFoundError" className="p-8 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-200">
        Dapur tidak ditemukan
      </div>
    );
  }

  if (!detail) return null;

  const totalActiveServings = detail.activeProductions?.reduce((sum: number, p: any) => sum + (p.servings || 0), 0) || 0;
  const capacityUsagePercent = Math.min((totalActiveServings / detail.capacity) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-50">
        <div className="space-y-4 flex-1">
          <Link to="/admin/kitchens" className="flex items-center gap-2 text-slate-600 group cursor-pointer hover:text-primary transition-all bg-transparent border-none p-0 w-fit">
            <div className="w-6 h-6 rounded-full border border-slate-150 flex items-center justify-center group-hover:border-primary group-hover:bg-primary-light transition-all">
              <ArrowLeft className="w-3 h-3" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Kembali</span>
          </Link>
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{detail.name}</h1>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 px-3 py-2 rounded-xl">
                   <MapPin className="w-3.5 h-3.5 text-primary" />
                   {detail.address}
                </div>
                <button 
                  onClick={() => window.open(detail.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.address)}`, '_blank')}
                  className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-all bg-transparent border-none p-0 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka di Maps
                </button>
              </div>

              <div className="max-w-[400px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Utilisasi Kapasitas Hari Ini</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{totalActiveServings.toLocaleString()} / {detail.capacity.toLocaleString()} Porsi</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${capacityUsagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-10 md:pt-14">
           <Button variant="secondary" size="sm" className="h-9 text-[10px]" onClick={() => setEditModalOpen(true)}>Edit Dapur</Button>
           <Button status="danger" variant="ghost" size="sm" className="h-9 text-[10px] bg-red-50 text-red-500 hover:bg-red-100 border-none">Nonaktifkan</Button>
        </div>
      </div>

      {/* Live Cooking Widget */}
      {detail.activeProductions && detail.activeProductions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
             <h3 className="font-black text-[10px] text-slate-800 uppercase tracking-widest">Lini Produksi Aktif</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detail.activeProductions.map((p: any) => (
              <Card 
                key={p.id} 
                onClick={() => { setSelectedProduction(p); setProductionModalOpen(true); }}
                className="p-5 border-none transform-gpu rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden bg-white active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">{p.menu}</p>
                    <p className="text-xl font-black text-slate-800 tracking-tighter leading-none">{p.servings} <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Porsi</span></p>
                  </div>
                  <Badge status={p.status === 'Cooking' ? 'Sedang Dimasak' : p.status} className="rounded-full px-2.5 py-0.5 text-[8px] uppercase font-black tracking-widest border-none bg-primary-light text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">PROSES AKTIF</span>
                    </div>
                    <span className="text-[10px] text-slate-800 font-black tracking-tighter">{new Date(p.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center border-b-2 border-slate-50 gap-8 w-full mb-6">
        {(['Staf', 'Shift', 'Stok'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap px-1",
              activeTab === tab ? "text-primary" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab === "Shift" ? "Bagian Masak" : tab}
            {activeTab === tab && (
              <motion.div layoutId="underline_detail" className="absolute bottom-[-2px] left-0 right-0 h-1 bg-primary rounded-full shadow-lg shadow-primary/40" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'Staf' && (
            <motion.div 
              key="staf"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-tight">Database Personel</h3>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 px-0.5">{detail.staff?.length || 0} Staf Terdaftar</p>
                </div>
                <Button 
                  onClick={() => {
                    setStaffError(null);
                    setIsManualMode(false);
                    fetchUnassignedStaff();
                    setStaffModalOpen(true);
                  }} 
                  className="rounded-[18px] py-4 px-6 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Staf Baru
                </Button>
              </div>
              <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-50">
                      <th className="text-left py-8 px-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] w-28">FOTO</th>
                      <th className="text-left py-8 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">NAMA LENGKAP</th>
                      <th className="text-left py-8 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">POSISI</th>
                      <th className="text-left py-8 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">STATUS</th>
                      <th className="text-right py-8 px-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(() => {
                      const filteredStaff = detail.staff?.filter((s: any) => ['Admin', 'Chef', 'Head Chef', 'Staff'].includes(s.role)) || [];
                      if (filteredStaff.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="py-20 text-center">
                              <p className="text-slate-800 font-black text-lg tracking-tight">Belum ada staf terdaftar</p>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Klik tombol "Staf Baru" untuk mulai menugaskan staf</p>
                            </td>
                          </tr>
                        );
                      }
                      return filteredStaff.map((s: any) => {
                        const displayRole = s.role === 'Admin' ? 'Admin' : (s.role === 'Chef' || s.role === 'Head Chef' ? 'Head Chef' : 'Staff');
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                            <td className="py-8 px-10">
                              <div className="w-14 h-14 rounded-2xl border-[3px] border-white shadow-xl overflow-hidden bg-slate-100 ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                                <img src={s.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            </td>
                            <td className="py-8 px-6">
                               <span className="font-black text-slate-700 tracking-tighter text-lg leading-tight group-hover:text-primary transition-colors">{s.name}</span>
                            </td>
                            <td className="py-8 px-6">
                              <Badge status={displayRole} className="rounded-full px-4 py-1.5 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest border-none" />
                            </td>
                            <td className="py-8 px-6">
                              <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-primary bg-primary-light w-fit px-4 py-2 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {s.status === 'Active' ? 'Online' : s.status}
                              </div>
                            </td>
                            <td className="py-8 px-10 text-right space-x-3">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md text-slate-500 hover:text-primary transition-all"
                                onClick={() => handleEditStaffClick(s)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all"
                                onClick={() => handleDeleteStaff(s.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'Shift' && (
            <motion.div 
              key="shift"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">Pembagian Stasiun Kerja (Division of Labor)</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-0.5">Penugasan Berdasarkan Kompetensi Dan Aliran Produksi</p>
                </div>
                <Button 
                  onClick={() => handleOpenStationModal()} 
                  className="rounded-[18px] py-4 px-6 font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 shrink-0"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Penugasan Baru
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {stations.map((sta) => {
                  const staffMember = getAssignedStaff(sta.staffId);
                  const staffName = staffMember ? staffMember.name : "Belum Ditugaskan";
                  const staffAvatar = staffMember ? staffMember.avatar : `https://i.pravatar.cc/150?u=${encodeURIComponent(sta.name)}`;
                  
                  // badge color mapping
                  let badgeColorClass = "bg-slate-50 text-slate-700";
                  if (sta.roleName?.toLowerCase().includes("head") || sta.roleName?.toLowerCase().includes("chef")) {
                    badgeColorClass = "bg-amber-50 text-amber-700";
                  } else if (sta.roleName?.toLowerCase().includes("pack")) {
                    badgeColorClass = "bg-blue-50 text-blue-700";
                  } else if (sta.roleName?.toLowerCase().includes("masak") || sta.roleName?.toLowerCase().includes("cook") || sta.roleName?.toLowerCase().includes("staff") || sta.roleName?.toLowerCase().includes("staf")) {
                    badgeColorClass = "bg-rose-50 text-rose-700";
                  }

                  return (
                    <Card key={sta.id} className="p-8 relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-[40px] bg-white border-none">
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <Badge status={sta.roleName || "Stasiun Kerja"} className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none", badgeColorClass)} />
                            <h4 className="text-xl font-black text-slate-800 tracking-tight mt-1 truncate">{sta.name}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary transition-all p-0 border-none"
                                onClick={() => handleOpenStationModal(sta)}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all p-0 border-none"
                                onClick={() => handleOpenDeleteStationModal(sta.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl">
                          <div className="w-12 h-12 rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-slate-100 ring-1 ring-slate-100 shrink-0">
                            <img src={staffAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Penanggung Jawab</p>
                            <p className="text-base font-black text-slate-700 tracking-tight leading-none truncate">{staffName}</p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tugas Utama</p>
                            <p className="text-sm font-bold text-slate-600 mt-1 leading-tight">{sta.focus || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alat / Stasiun Fisik</p>
                            <p className="text-xs font-semibold text-slate-500 mt-1 leading-tight">{sta.tool || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {stations.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-100">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum Ada Pembagian Sesi Kerja</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol 'Penugasan Baru' untuk menugaskan personil.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Stok' && (
            <motion.div 
              key="stok"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-700">Monitor Stok Dapur</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {detail.stock && detail.stock.length > 0 ? (
                  detail.stock.map((item: InventoryItem) => (
                    <StockRow key={item.id} item={item} />
                  ))
                ) : (
                  <div className="py-20 text-center bg-slate-50/30 rounded-[40px] border border-slate-100 flex flex-col items-center justify-center gap-4 w-full">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Warehouse className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-black text-lg tracking-tight">Stok Dapur Kosong</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Belum ada bahan baku terdaftar di dapur ini</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Staff Modal */}
      <Modal isOpen={isStaffModalOpen} onClose={() => { setStaffModalOpen(false); setEditingStaff(null); }} title={editingStaff ? "Edit Detail Staf" : "Tambah Staff Baru"}>
        <form className="space-y-6 py-2" onSubmit={handleAddStaff}>
          {staffError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-[20px] text-xs font-bold border border-red-100 shadow-sm">
              {staffError}
            </div>
          )}

          {!editingStaff && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                  !isManualMode ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"
                )}
                onClick={() => setIsManualMode(false)}
              >
                Pilih dari Database
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all",
                  isManualMode ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"
                )}
                onClick={() => setIsManualMode(true)}
              >
                Input Manual / Baru
              </button>
            </div>
          )}

          {!isManualMode ? (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Pilih Staf Tanpa Dapur</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all cursor-pointer shadow-sm"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                >
                  {unassignedStaff.length > 0 ? (
                    unassignedStaff.map(s => {
                      const displayRole = s.role === 'Admin' ? 'Admin' : (s.role === 'Chef' || s.role === 'Head Chef' ? 'Head Chef' : 'Staff');
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name} ({displayRole} - {s.email})
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Tidak ada staf tak berdapur tersedia</option>
                  )}
                </select>
                {unassignedStaff.length === 0 && (
                  <p className="text-[10px] text-amber-600 font-bold px-1 mt-1">
                    Semua staf terdaftar sudah ditugaskan ke dapur. Gunakan opsi "Input Manual / Baru".
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Peran / Jabatan Baru</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all cursor-pointer shadow-sm"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                >
                  <option value="Head Chef">Head Chef (Chef)</option>
                  <option value="Staff">Staff Masak</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Nama Lengkap Staff</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all shadow-sm" 
                  placeholder="Masukkan nama lengkap..." 
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all shadow-sm" 
                  placeholder="Contoh: staff.baru@mbg.com" 
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Password</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all shadow-sm" 
                  placeholder={editingStaff ? "Kosongkan jika tidak ingin mengubah password..." : "Kata sandi (default: password)"} 
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 block">Peran / Jabatan</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all cursor-pointer shadow-sm"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                >
                  <option value="Head Chef">Head Chef (Chef)</option>
                  <option value="Staff">Staff Masak</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md"
              disabled={!isManualMode && unassignedStaff.length === 0}
            >
              Simpan Detail Staff
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Kitchen Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        title="Edit Detail Dapur"
      >
        <form onSubmit={handleUpdateKitchen} className="space-y-6 py-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Informasi Utama</label>
            <div className="relative group/input">
              <Utensils className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] pl-14 pr-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Nama Dapur (Contoh: Dapur Pusat Jakarta)"
                value={currentKitchen?.name || ""}
                onChange={(e) => setCurrentKitchen((prev: any) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative group/input">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-350 group-focus-within/input:text-primary transition-colors" />
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] pl-14 pr-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Alamat Lengkap Unit atau Link Google Maps..."
                value={currentKitchen?.address || ""}
                onChange={(e) => handleAddressChange(e.target.value)}
                required
              />
            </div>

            {currentKitchen?.latitude && currentKitchen?.longitude && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-[20px] text-xs font-bold flex flex-col gap-1 border border-emerald-100 shadow-sm mt-3">
                <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-600 font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Google Maps Terdeteksi
                </span>
                <span>Koordinat: {currentKitchen.latitude}, {currentKitchen.longitude}</span>
              </div>
            )}

            {isResolvingMaps && (
              <div className="p-4 bg-slate-50 text-slate-600 rounded-[20px] text-xs font-bold flex items-center gap-2.5 border border-slate-100 shadow-sm mt-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                Mendeteksi koordinat dari link Google Maps...
              </div>
            )}

            {mapsError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-[20px] text-xs font-bold border border-red-100 shadow-sm mt-3">
                {mapsError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Latitude</label>
              <input 
                type="number" 
                step="any"
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Contoh: -6.1668"
                value={currentKitchen?.latitude !== undefined && currentKitchen?.latitude !== null ? currentKitchen.latitude : ""}
                onChange={(e) => setCurrentKitchen((prev: any) => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Longitude</label>
              <input 
                type="number" 
                step="any"
                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-300 shadow-sm"
                placeholder="Contoh: 106.7865"
                value={currentKitchen?.longitude !== undefined && currentKitchen?.longitude !== null ? currentKitchen.longitude : ""}
                onChange={(e) => setCurrentKitchen((prev: any) => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas Produksi</label>
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
                onChange={(e) => setCurrentKitchen((prev: any) => ({ ...prev, capacity: Number(e.target.value) }))}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
              onClick={() => setEditModalOpen(false)}
            >
              Batalkan
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Production Detail Modal */}
      <Modal 
        isOpen={isProductionModalOpen} 
        onClose={() => setProductionModalOpen(false)} 
        title="Detail Lini Produksi"
      >
        {selectedProduction && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-5 p-6 bg-primary-light rounded-[32px] border border-primary/10">
               <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                  <Zap className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">PRODUKSI AKTIF</p>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tighter leading-tight">{selectedProduction.menu}</h4>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">JUMLAH PORSI</p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">{selectedProduction.servings} Units</p>
               </div>
               <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">WAKTU PERSIAPAN</p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">08:30 WIB</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Konsumsi Bahan Baku</h5>
               </div>
               <div className="space-y-2">
                  {(() => {
                    const menuInfo = (menus && menus.length > 0 ? menus : MENUS).find((m: any) => m.name === selectedProduction.menu);
                    const ingredients = menuInfo 
                      ? menuInfo.ingredients.map(ing => ({ 
                          material: ing.name, 
                          amount: `${(ing.perPortion * selectedProduction.servings).toFixed(2)} ${ing.unit}` 
                        }))
                      : [{ material: "Bahan Baku Standard", amount: "Sesuai Porsi" }];

                    return ingredients.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-all">
                         <span className="font-bold text-slate-600 text-sm tracking-tight">{item.material}</span>
                         <span className="font-black text-primary text-sm tracking-tighter">{item.amount}</span>
                      </div>
                    ));
                  })()}
               </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Station Modal */}
      <Modal 
        isOpen={isStationModalOpen} 
        onClose={() => setStationModalOpen(false)} 
        title={editingStation ? "Edit Penugasan Stasiun Kerja" : "Tambah Penugasan Stasiun Kerja"}
      >
        <form onSubmit={handleSaveStation} className="space-y-6 py-2">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Stasiun / Sesi Kerja</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-350 shadow-sm"
              placeholder="Contoh: Stasiun Ayam Goreng, Supervisor Utama"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Penanggung Jawab (Staf)</label>
            <select 
              className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm cursor-pointer shadow-sm"
              value={stationStaffId}
              onChange={(e) => setStationStaffId(e.target.value)}
              required
            >
              {(detail?.staff?.filter((s: any) => s.role !== 'Admin') || []).map((staff: any) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
              {detail?.staff?.filter((s: any) => s.role !== 'Admin').length === 0 && (
                <option value="">Tidak ada staf tersedia</option>
              )}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Peran (Badge)</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-350 shadow-sm"
              placeholder="Contoh: Staff Masak 1"
              value={stationRoleName}
              onChange={(e) => setStationRoleName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tugas / Fokus Utama Kerja</label>
            <textarea 
              className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-350 shadow-sm h-24 resize-none"
              placeholder="Contoh: Penggorengan Ayam Goreng Gurih (FEFO Batches)"
              value={stationFocus}
              onChange={(e) => setStationFocus(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alat / Stasiun Fisik</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] px-6 py-4 focus:bg-white focus:border-primary outline-none transition-all font-bold text-slate-800 tracking-tight text-sm placeholder:text-slate-350 shadow-sm"
              placeholder="Contoh: Deep Fryer Range A1-A3"
              value={stationTool}
              onChange={(e) => setStationTool(e.target.value)}
              required
            />
          </div>

          <div className="pt-6 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 border-none"
              onClick={() => setStationModalOpen(false)}
            >
              Batalkan
            </Button>
            <Button 
              type="submit" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Simpan Penugasan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Station Confirmation Modal */}
      <Modal 
        isOpen={isDeleteStationModalOpen} 
        onClose={() => {
          setIsDeleteStationModalOpen(false);
          setStationToDeleteId(null);
        }} 
        title="Konfirmasi Hapus"
      >
        <div className="space-y-6 py-2">
          <div className="p-4 bg-red-50 text-red-700 rounded-[20px] text-xs font-bold border border-red-100 shadow-sm">
            Apakah Anda yakin ingin menghapus stasiun kerja ini? Tindakan ini tidak dapat dibatalkan.
          </div>
          <div className="pt-2 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 border-none"
              onClick={() => {
                setIsDeleteStationModalOpen(false);
                setStationToDeleteId(null);
              }}
            >
              Batal
            </Button>
            <Button 
              type="button"
              variant="danger"
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
              onClick={handleConfirmDeleteStation}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Staff Confirmation Modal */}
      <Modal
        isOpen={confirmDeleteStaffId !== null}
        onClose={() => setConfirmDeleteStaffId(null)}
        title="Keluarkan Staf"
      >
        <div className="space-y-6 py-2">
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin mengeluarkan staf ini dari dapur? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 border-none"
              onClick={() => setConfirmDeleteStaffId(null)}
            >
              Batal
            </Button>
            <Button 
              type="button"
              variant="danger"
              className="flex-1 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs"
              onClick={async () => {
                if (!confirmDeleteStaffId) return;
                const targetId = confirmDeleteStaffId;
                setConfirmDeleteStaffId(null);
                try {
                  await api.deleteUser(targetId);
                  const updatedData = await api.getKitchenDetail(selectedKitchenId);
                  setDetail(updatedData);
                } catch (err: any) {
                  console.error("Failed to delete staff member", err);
                  setAlertMessage({ title: "Gagal Menghapus Staf", message: err.message || "Gagal menghapus staf." });
                }
              }}
            >
              Keluarkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Alert Modal */}
      <Modal
        isOpen={alertMessage !== null}
        onClose={() => setAlertMessage(null)}
        title={alertMessage?.title || "Notifikasi"}
      >
        <div className="space-y-6 py-2">
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            {alertMessage?.message}
          </p>
          <div className="pt-2">
            <Button 
              className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-md"
              onClick={() => setAlertMessage(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const StockRow = ({ item }: { item: InventoryItem, key?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Card className="p-0 overflow-hidden transform-gpu border-none shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all rounded-[24px] bg-white group/stock">
      <div 
        className={cn(
          "p-4 flex items-center gap-6 cursor-pointer hover:bg-slate-50 transition-colors",
          isOpen && "bg-slate-50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0 shadow-inner group-hover/stock:bg-primary group-hover/stock:text-white transition-colors duration-500">
          <Package className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-800 text-lg tracking-tighter leading-none">{item.name}</h4>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className={cn("h-full transition-all duration-1000", item.volume < 30 ? "bg-red-500" : "bg-primary")}
                style={{ width: `${item.volume}%` }}
              />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.volume}%</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Stok Total</p>
            <p className="font-black text-slate-800 text-base tracking-tighter">{item.totalWeight}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Wadah</p>
            <p className="font-black text-slate-800 text-base tracking-tighter">{item.batches.length}</p>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center transition-all",
            isOpen ? "bg-primary text-white border-primary" : "text-slate-300"
          )}>
             <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/30"
          >
            <div className="p-4 pt-1 space-y-2">
              {item.batches.length > 0 ? (
                item.batches.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/20 transition-all group/item">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 rounded-xl group-hover/item:bg-primary-light transition-colors">
                        <Warehouse className="w-4 h-4 text-slate-400 group-hover/item:text-primary" />
                      </div>
                      <div>
                        <span className="font-black text-slate-800 tracking-tight text-base leading-none">
                          {b.package_capacity 
                            ? `${b.qty_packed > 0 ? `${b.qty_packed} ` : ''}${b.container} (@ ${b.package_capacity} ${b.package_unit})${b.qty_loose > 0 ? ` + ${b.qty_loose} ${b.package_unit}` : ''}`
                            : b.container}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{b.weight}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">EXPIRED</p>
                         <span className="font-black text-slate-800 text-sm tracking-tighter">{b.expiry}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-slate-50 text-slate-300 hover:text-primary">
                         <ArrowLeft className="w-3 h-3 rotate-180" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <Package className="w-8 h-8 text-slate-100 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Tidak ada data wadah aktif</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
