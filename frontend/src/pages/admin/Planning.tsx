import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { Modal } from "@/src/components/ui/Modal";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent, 
  DragOverEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, AlertTriangle, Send, Check, Calculator, Info, PackageSearch, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { api } from "@/src/services/api";
import { Kitchen } from "@/src/types";
import { useNavigate } from "react-router-dom";

// Mock Available Stock removed, now fetching from API
// MENUS imported as fallback but will be replaced by API data
import { MENUS as FALLBACK_MENUS } from "@/src/constants";
import { Menu } from "@/src/types";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

interface SortablePlanItemProps {
  item: any;
  day: string;
  onClick: () => void;
  low: boolean;
  overCapacity: boolean;
}

const SortablePlanItem: React.FC<SortablePlanItemProps> = ({ item, day, onClick, low, overCapacity }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, data: { day } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing text-left group relative",
        low 
          ? "bg-red-50/50 border-red-100 shadow-sm" 
          : overCapacity
            ? "bg-amber-50/40 border-amber-250 shadow-sm"
            : "bg-[#F9FAFB] border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg hover:shadow-primary/5"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center gap-2 mb-2 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none truncate flex-1">{item.kitchenName || item.k}</p>
        <div className={cn(
          "w-2 h-2 rounded-full shrink-0",
          low ? "bg-red-500 animate-pulse" : overCapacity ? "bg-amber-500 animate-pulse" : "bg-primary"
        )} />
      </div>
      <p className={cn("text-xs font-black truncate leading-tight", low ? "text-red-700" : overCapacity ? "text-amber-800" : "text-slate-800")}>
        {item.menuName || item.m}
      </p>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100/50 flex-wrap">
        <span className="text-[10px] font-bold text-slate-500 tracking-tighter">{item.portions} PIECES</span>
        <span className="w-1 h-1 rounded-full bg-slate-200" />
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest",
          low ? "text-red-500" : "text-primary"
        )}>
          {low ? "LOW STOCK" : "READY"}
        </span>
        {overCapacity && (
          <>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 animate-pulse">
              OVER LIMIT
            </span>
          </>
        )}
      </div>
    </div>
  );
};

interface DayColumnProps {
  day: string;
  items: any[];
  onAddClick: (day: string) => void;
  onItemClick: (item: any, day: string) => void;
  isItemLow: (item: any) => boolean;
  isItemOverCapacity: (item: any) => boolean;
  activeId: string | null;
}

const DayColumn: React.FC<DayColumnProps> = ({ day, items, onAddClick, onItemClick, isItemLow, isItemOverCapacity, activeId }) => {
  const { setNodeRef } = useDroppable({
    id: day,
    data: { day }
  });

  return (
    <div key={day} className="space-y-6">
      <h4 className="text-center font-black text-slate-400 text-[10px] uppercase tracking-[0.25em]">{day}</h4>
      
      <SortableContext 
        id={day}
        items={items.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
          ref={setNodeRef}
          className={cn(
            "bg-white rounded-[32px] p-3 space-y-4 shadow-sm border transition-colors relative",
            activeId ? "border-primary/20 bg-primary-light/5" : "border-slate-50"
          )}
        >
          {items.map((item) => (
            <SortablePlanItem 
              key={item.id}
              item={item}
              day={day}
              onClick={() => onItemClick(item, day)}
              low={isItemLow(item)}
              overCapacity={isItemOverCapacity(item)}
            />
          ))}
          
          <button 
            className="w-full py-6 flex items-center justify-center text-slate-300 hover:text-primary transition-all hover:bg-primary-light rounded-[24px] border-2 border-dashed border-slate-100 hover:border-primary/30"
            onClick={() => onAddClick(day)}
          >
            <Plus className="w-6 h-6 pointer-events-none" />
          </button>
        </div>
      </SortableContext>
    </div>
  );
};

interface SimulationResult {
  isLow: boolean;
  isOverCapacity: boolean;
  totalPlannedPortions: number;
  kitchenCapacity: number;
  shortages: Array<{
    material: string;
    needed: number;
    available: number;
    shortage: number;
    unit: string;
    details: string;
  }>;
  batchUsage: Array<{
    batchId: string;
    container: string;
    materialName: string;
    amountUsed: number;
    unit: string;
  }>;
}

const useProductionSimulation = (plans: any[], inventory: any[], menus: any[], kitchens: any[]) => {
  return React.useMemo(() => {
    if (!inventory || inventory.length === 0 || !menus || menus.length === 0) {
      return { planResults: {} as Record<string, SimulationResult>, cumulativeShortagesPerKitchen: {} };
    }

    // Deep copy inventory state for simulation
    const simInventory = inventory.map(item => ({
      ...item,
      batches: (item.batches || []).map((b: any) => {
        // Calculate absolute simulated weight directly from numerical fields
        let absoluteValue = Number(b.weight_value) || 0;
        let baseUnit = b.unit || "kg";

        const cap = Number(b.package_capacity);
        const pkgU = b.package_unit;

        if (!isNaN(cap) && cap > 0 && pkgU) {
          absoluteValue = absoluteValue * cap;
          baseUnit = pkgU;
        }

        // Standardize smaller units (g -> kg, ml -> L) to match recipe metrics
        const uLower = baseUnit.toLowerCase();
        if (uLower === 'g') {
          absoluteValue = absoluteValue / 1000;
          baseUnit = 'kg';
        } else if (uLower === 'ml') {
          absoluteValue = absoluteValue / 1000;
          baseUnit = 'L';
        }

        return {
          ...b,
          originalValue: absoluteValue,
          remainingValue: absoluteValue,
          unit: baseUnit
        };
      })
    }));

    const DAYS_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const planResults: Record<string, SimulationResult> = {};
    const cumulativeShortagesPerKitchen: Record<string, Record<string, { amount: number; unit: string }>> = {};
    const kitchenDailyPortions: Record<string, Record<string, number>> = {};

    // 1. First pass to sum up portions for kitchen capacity checking per day
    DAYS_ORDER.forEach(dayName => {
      const dayPlan = plans.find(p => p.day === dayName);
      if (!dayPlan) return;

      dayPlan.items.forEach((plan: any) => {
        const kitchen = kitchens.find(k => k.id === plan.kitchenId || k.name === plan.k || k.name.includes(plan.k));
        const kitchenId = plan.kitchenId || kitchen?.id;
        if (kitchenId) {
          if (!kitchenDailyPortions[kitchenId]) {
            kitchenDailyPortions[kitchenId] = {};
          }
          if (!kitchenDailyPortions[kitchenId][dayName]) {
            kitchenDailyPortions[kitchenId][dayName] = 0;
          }
          kitchenDailyPortions[kitchenId][dayName] += Number(plan.portions) || 0;
        }
      });
    });

    // 2. Second pass to compute chronological inventory consumption
    DAYS_ORDER.forEach(dayName => {
      const dayPlan = plans.find(p => p.day === dayName);
      if (!dayPlan) return;

      dayPlan.items.forEach((plan: any) => {
        const menuData = menus.find(m => m.name === plan.m || m.name === plan.menuName);
        if (!menuData) return;

        const kitchen = kitchens.find(k => k.id === plan.kitchenId || k.name === plan.k || k.name.includes(plan.k));
        const kitchenId = plan.kitchenId || kitchen?.id;

        const shortages: SimulationResult["shortages"] = [];
        const batchUsage: SimulationResult["batchUsage"] = [];
        let isLow = false;

        const totalPlannedPortions = kitchenId ? (kitchenDailyPortions[kitchenId]?.[dayName] || 0) : 0;
        const kitchenCapacity = kitchen?.capacity || 0;
        const isOverCapacity = kitchenCapacity > 0 && totalPlannedPortions > kitchenCapacity;

        menuData.ingredients.forEach((ing: any) => {
          const totalNeeded = Number((ing.perPortion * plan.portions).toFixed(2));
          let remainingToFulfill = totalNeeded;

          const simItem = simInventory.find(item => item.name.toLowerCase() === ing.name.toLowerCase());
          if (!simItem) {
            isLow = true;
            shortages.push({
              material: ing.name,
              needed: totalNeeded,
              available: 0,
              shortage: totalNeeded,
              unit: ing.unit,
              details: `Bahan tidak ditemukan di gudang dapur`
            });
            return;
          }

          const kitchenBatches = simItem.batches
            .filter((b: any) => b.kitchenId === kitchenId)
            .sort((a: any, b: any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

          const availableBeforeThisPlan = kitchenBatches.reduce((sum: number, b: any) => sum + b.remainingValue, 0);

          kitchenBatches.forEach((batch: any) => {
            if (remainingToFulfill <= 0) return;
            if (batch.remainingValue <= 0) return;

            const toTake = Math.min(remainingToFulfill, batch.remainingValue);
            batch.remainingValue = Number((batch.remainingValue - toTake).toFixed(2));
            remainingToFulfill = Number((remainingToFulfill - toTake).toFixed(2));

            batchUsage.push({
              batchId: batch.id,
              container: batch.container,
              materialName: ing.name,
              amountUsed: toTake,
              unit: batch.unit
            });
          });

          if (remainingToFulfill > 0) {
            isLow = true;
            shortages.push({
              material: ing.name,
              needed: totalNeeded,
              available: Number(availableBeforeThisPlan.toFixed(2)),
              shortage: remainingToFulfill,
              unit: ing.unit,
              details: `Kurang ${remainingToFulfill} ${ing.unit} (Sisa stok ${availableBeforeThisPlan.toFixed(2)} ${ing.unit} di dapur)`
            });

            if (kitchenId) {
              if (!cumulativeShortagesPerKitchen[kitchenId]) {
                cumulativeShortagesPerKitchen[kitchenId] = {};
              }
              if (!cumulativeShortagesPerKitchen[kitchenId][ing.name]) {
                cumulativeShortagesPerKitchen[kitchenId][ing.name] = { amount: 0, unit: ing.unit };
              }
              cumulativeShortagesPerKitchen[kitchenId][ing.name].amount = Number(
                (cumulativeShortagesPerKitchen[kitchenId][ing.name].amount + remainingToFulfill).toFixed(2)
              );
            }
          }
        });

        planResults[plan.id] = {
          isLow,
          isOverCapacity,
          totalPlannedPortions,
          kitchenCapacity,
          shortages,
          batchUsage
        };
      });
    });

    return { planResults, cumulativeShortagesPerKitchen };
  }, [plans, inventory, menus, kitchens]);
};

export const ProductionPlanning = () => {
  const navigate = useNavigate();
  const [kitchens, setKitchens] = React.useState<Kitchen[]>([]);
  const [plans, setPlans] = React.useState<any[]>(DAYS.map(day => ({ day, items: [] })));
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [menus, setMenus] = React.useState<Menu[]>(FALLBACK_MENUS as Menu[]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [filterKitchenId, setFilterKitchenId] = React.useState<string>("all");

  // Chronological Stock Simulation
  const { planResults, cumulativeShortagesPerKitchen } = useProductionSimulation(plans, inventory, menus, kitchens);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDay = active.data.current?.day;
    const overDay = over.data.current?.day || over.id;

    if (activeDay && overDay && activeDay !== overDay) {
      setPlans((prev) => {
        const activeDayPlan = prev.find(p => p.day === activeDay);
        const overDayPlan = prev.find(p => p.day === overDay);
        
        if (!activeDayPlan || !overDayPlan) return prev;

        const activeItem = activeDayPlan.items.find((i: any) => i.id === activeId);
        if (!activeItem) return prev;

        return prev.map(p => {
          if (p.day === activeDay) {
            return { ...p, items: p.items.filter((i: any) => i.id !== activeId) };
          }
          if (p.day === overDay) {
            // Avoid duplicates
            if (p.items.some((i: any) => i.id === activeId)) return p;
            return { ...p, items: [...p.items, activeItem] };
          }
          return p;
        });
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over) {
      const activeId = active.id as string;
      const activeDay = active.data.current?.day;
      const overDay = over.data.current?.day || (DAYS.includes(over.id as string) ? over.id as string : null);

      if (activeDay && overDay && activeDay !== overDay) {
        // Dragged to a different day
        const foundDayPlan = plans.find(p => p.day === overDay);
        const item = foundDayPlan?.items.find((i: any) => i.id === activeId);
        if (item) {
          try {
            await api.updateProductionPlan(activeId, {
              day: overDay,
              portions: item.portions,
              note: item.note || "",
              kitchenId: item.kitchenId,
              menu: item.menuName || item.m
            });
            await fetchData();
          } catch (error) {
            console.error("Failed to update plan day:", error);
            await fetchData();
          }
        }
      } else if (activeDay && overDay && activeDay === overDay && active.id !== over.id) {
        // Reordering within the same day
        setPlans((prev) => {
          return prev.map(p => {
            if (p.day === activeDay) {
              const oldIndex = p.items.findIndex((i: any) => i.id === active.id);
              const newIndex = p.items.findIndex((i: any) => i.id === over.id);
              return { ...p, items: arrayMove(p.items, oldIndex, newIndex) };
            }
            return p;
          });
        });
      }
    }
  };
  const [isFormModalOpen, setFormModalOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState("");
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [portionsError, setPortionsError] = React.useState("");

  // Form State
  const [formData, setFormData] = React.useState({
    id: "",
    menu: "",
    kitchenId: "",
    portions: 0,
    note: ""
  });

  const fetchData = async () => {
    try {
      const [kitchensData, plansData, inventoryData, menusData] = await Promise.all([
        api.getKitchens(),
        api.getProductionPlans(),
        api.getInventory(),
        api.getMenus()
      ]);
      setKitchens(kitchensData);
      setInventory(inventoryData);
      const activeMenus = menusData.length > 0 ? menusData : FALLBACK_MENUS;
      setMenus(activeMenus);

      // Dynamically initialize select defaults
      setFormData(prev => ({
        ...prev,
        kitchenId: prev.kitchenId || (kitchensData.length > 0 ? kitchensData[0].id : ""),
        menu: prev.menu || (activeMenus.length > 0 ? activeMenus[0].name : "")
      }));

      const structuredPlans = DAYS.map(day => ({
        day,
        items: plansData ? plansData.filter((p: any) => p.day === day) : []
      }));
      setPlans(structuredPlans);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSavePlan = async () => {
    if (!formData.portions || formData.portions <= 0) {
      setPortionsError("Porsi wajib diisi");
      alert("Harap masukkan jumlah porsi yang valid.");
      return;
    }

    try {
      if (isEditMode) {
        await api.updateProductionPlan(formData.id, {
          day: selectedDay,
          menu: formData.menu,
          kitchenId: formData.kitchenId,
          portions: formData.portions,
          note: formData.note
        });
      } else {
        await api.createProductionPlan({
          day: selectedDay,
          menu: formData.menu,
          kitchenId: formData.kitchenId,
          portions: formData.portions,
          note: formData.note
        });
      }
      
      setFormModalOpen(false);
      setIsEditMode(false);
      await fetchData();
    } catch (error) {
      console.error("Error saving production plan:", error);
      alert("Gagal menyimpan rencana produksi: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus rencana produksi ini?")) return;
    
    try {
      await api.deleteProductionPlan(planId);
      setFormModalOpen(false);
      setIsEditMode(false);
      await fetchData();
    } catch (error) {
      console.error("Error deleting production plan:", error);
      alert("Gagal menghapus rencana produksi: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleSendShortageNotification = async () => {
    if (!formData.kitchenId) return;
    try {
      await api.createNotification(formData.kitchenId, shortageMessage);
      alert("Notifikasi kekurangan bahan berhasil dikirim ke Dapur / Akun Chef!");
    } catch (error) {
      console.error("Failed to send manual notification:", error);
      alert("Gagal mengirim notifikasi: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleEditClick = (item: any, day: string) => {
    const kitchenId = item.kitchenId || kitchens.find(k => (item.kitchenName || item.k) && k.name.includes(item.kitchenName || item.k))?.id || (kitchens.length > 0 ? kitchens[0].id : "");
    setSelectedDay(day);
    setIsEditMode(true);
    setFormData({
      id: item.id,
      menu: item.menuName || item.m,
      kitchenId: kitchenId,
      portions: item.portions,
      note: item.note || ""
    });
    setPortionsError("");
    setFormModalOpen(true);
  };

  const handleItemClick = (item: any, day: string) => {
    handleEditClick(item, day);
  };

  const handleAddClick = (day: string) => {
    setSelectedDay(day);
    setIsEditMode(false);
    setFormData({
      id: "",
      menu: menus.length > 0 ? menus[0].name : FALLBACK_MENUS[0].name,
      kitchenId: kitchens.length > 0 ? kitchens[0].id : "",
      portions: 0,
      note: ""
    });
    setPortionsError("");
    setFormModalOpen(true);
  };

  const isItemLow = React.useCallback((item: any) => {
    return planResults[item.id]?.isLow || false;
  }, [planResults]);

  const isItemOverCapacity = React.useCallback((item: any) => {
    return planResults[item.id]?.isOverCapacity || false;
  }, [planResults]);

  // Calculation Logic for Form
  const selectedMenuData = menus.find(m => m.name === formData.menu);
  const calculatedMaterials = React.useMemo(() => {
    if (!selectedMenuData || !formData.portions || formData.portions <= 0) return [];
    return selectedMenuData.ingredients.map(ing => {
      const needed = Number((ing.perPortion * formData.portions).toFixed(2));
      const item = inventory.find(i => i.name === ing.name);
      const available = item 
        ? item.batches
            .filter((b: any) => !formData.kitchenId || b.kitchenId === formData.kitchenId)
            .reduce((sum: number, b: any) => {
              let val = Number(b.weight_value) || 0;
              let baseUnit = b.unit || "kg";
              const cap = Number(b.package_capacity);
              const pkgU = b.package_unit;

              if (!isNaN(cap) && cap > 0 && pkgU) {
                val = val * cap;
                baseUnit = pkgU;
              }

              const uLower = baseUnit.toLowerCase();
              if (uLower === 'g' || uLower === 'ml') {
                val = val / 1000;
              }
              return sum + val;
            }, 0)
        : 0;
      const isLow = needed > available;
      return { ...ing, needed, available, isLow };
    });
  }, [formData.menu, formData.portions, selectedMenuData, inventory, formData.kitchenId]);

  const hasShortage = calculatedMaterials.some(m => m.isLow);

  const shortageMessage = React.useMemo(() => {
    const shortagesInfo = calculatedMaterials
      .filter(m => m.isLow)
      .map(m => `${m.name} (kurang ${(m.needed - m.available).toFixed(2)} ${m.unit})`)
      .join(", ");
    return `SCM Admin: Rencana produksi ${formData.menu} (${formData.portions} porsi) pada hari ${selectedDay} kekurangan bahan: ${shortagesInfo}.`;
  }, [calculatedMaterials, formData.menu, formData.portions, selectedDay]);

  const { selectedKitchenCapacity, otherPlansPortionsForDay, isFormOverCapacity } = React.useMemo(() => {
    const selectedKitchen = kitchens.find(k => k.id === formData.kitchenId);
    const capacity = selectedKitchen?.capacity || 0;

    const dayPlans = plans.find(p => p.day === selectedDay)?.items || [];
    const otherPortions = dayPlans
      .filter((plan: any) => {
        const planKitchenId = plan.kitchenId || kitchens.find(k => k.name === plan.k || k.name.includes(plan.k) || plan.k?.includes(k.name))?.id;
        return planKitchenId === formData.kitchenId && plan.id !== formData.id;
      })
      .reduce((sum: number, plan: any) => sum + (Number(plan.portions) || 0), 0);

    const totalProposed = otherPortions + (Number(formData.portions) || 0);
    const overCapacity = capacity > 0 && totalProposed > capacity;

    return {
      selectedKitchenCapacity: capacity,
      otherPlansPortionsForDay: otherPortions,
      isFormOverCapacity: overCapacity
    };
  }, [kitchens, formData.kitchenId, formData.id, formData.portions, plans, selectedDay]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kalender Produksi</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Jadwal Operasional Dapur</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[20px] px-5 py-2.5 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Dapur:</span>
          <select 
            value={filterKitchenId} 
            onChange={(e) => setFilterKitchenId(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 cursor-pointer"
          >
            <option value="all">Tampilkan Semua Dapur</option>
            {kitchens.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:max-w-7xl gap-4">
          {DAYS.map((day) => (
            <DayColumn 
              key={day}
              day={day}
              items={(plans.find(p => p.day === day)?.items || []).filter((item: any) => filterKitchenId === "all" || item.kitchenId === filterKitchenId)}
              onAddClick={handleAddClick}
              onItemClick={handleItemClick}
              isItemLow={isItemLow}
              isItemOverCapacity={isItemOverCapacity}
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-4 rounded-2xl border-2 bg-white shadow-2xl border-primary/20 scale-105 pointer-events-none text-left min-w-[200px]">
              {(() => {
                const item = plans.flatMap(p => p.items).find(i => i.id === activeId);
                if (!item) return null;
                const low = isItemLow(item);
                return (
                  <>
                    <div className="flex justify-between items-center gap-2 mb-2 min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none truncate flex-1">{item.kitchenName || item.k}</p>
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        low ? "bg-red-500 animate-pulse" : "bg-primary"
                      )} />
                    </div>
                    <p className="text-xs font-black text-slate-800 leading-tight truncate">{item.menuName || item.m}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500">{item.portions} PIECES</span>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Form Production Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => { setFormModalOpen(false); setIsEditMode(false); }} 
        title={isEditMode ? `Edit Rencana Produksi - ${selectedDay}` : `Tambah Rencana Produksi - ${selectedDay}`}
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div className="p-6 bg-slate-50 rounded-2xl space-y-6 border border-slate-100">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Pilih Menu</span>
                <select 
                  className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
                  value={formData.menu}
                  onChange={(e) => setFormData(prev => ({ ...prev, menu: e.target.value }))}
                >
                  {menus.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Pilih Dapur</span>
                <select 
                  className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer"
                  value={formData.kitchenId}
                  onChange={(e) => {
                    const newKitchenId = e.target.value;
                    const targetKitchen = kitchens.find(k => k.id === newKitchenId);
                    const cap = targetKitchen?.capacity || 0;
                    const dayPlans = plans.find(p => p.day === selectedDay)?.items || [];
                    const otherPortions = dayPlans
                      .filter((plan: any) => {
                        const planKitchenId = plan.kitchenId || kitchens.find(k => k.name === plan.k || k.name.includes(plan.k) || plan.k?.includes(k.name))?.id;
                        return planKitchenId === newKitchenId && plan.id !== formData.id;
                      })
                      .reduce((sum: number, plan: any) => sum + (Number(plan.portions) || 0), 0);
                    const maxAllowed = Math.max(0, cap - otherPortions);
                    setFormData(prev => ({ 
                      ...prev, 
                      kitchenId: newKitchenId,
                      portions: Math.min(prev.portions, maxAllowed)
                    }));
                  }}
                >
                  {kitchens.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
                {formData.kitchenId && (
                  <p className="text-[10px] font-bold text-slate-400 mt-1 px-1">
                    Kapasitas Dapur: <span className="text-slate-655">{selectedKitchenCapacity} porsi</span> | Sudah Terencana: <span className="text-slate-655">{otherPlansPortionsForDay} porsi</span> | Sisa Kapasitas: <span className="text-primary font-black">{Math.max(0, selectedKitchenCapacity - otherPlansPortionsForDay)} porsi</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Target Jumlah Porsi</span>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={formData.portions || ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) setPortionsError("");
                      const maxAllowed = Math.max(0, selectedKitchenCapacity - otherPlansPortionsForDay);
                      setFormData(prev => ({ ...prev, portions: Math.min(val, maxAllowed) }));
                    }}
                    max={Math.max(0, selectedKitchenCapacity - otherPlansPortionsForDay)}
                    min="0"
                    placeholder="Masukkan jumlah porsi..."
                    className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all pr-16"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider">Porsi</div>
                </div>
                {portionsError && (
                  <p id="portionsError" className="text-xs font-black text-red-500 mt-1 px-1">
                    {portionsError}
                  </p>
                )}
                {isFormOverCapacity && (
                  <div className="p-4 bg-amber-500 rounded-2xl flex gap-4 items-start shadow-xl shadow-amber-500/20 text-white animate-pulse mt-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white">Kapasitas Terlampaui</p>
                      <p className="text-[11px] leading-relaxed text-white/90 font-bold mt-1.5">
                        Total porsi terencana ({otherPlansPortionsForDay + formData.portions} porsi) melebihi kapasitas dapur ({selectedKitchenCapacity} porsi).
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Catatan Tambahan</span>
                <textarea 
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Contoh: Pisahkan sambal, kurangi garam, dll..."
                  className="w-full bg-white border-2 border-slate-100 focus:border-primary rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all h-24 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-light/10 text-primary flex items-center justify-center">
                 <Calculator className="w-4 h-4" />
              </div>
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">Cek Bahan Langsung</h4>
            </div>
            
            <div className="space-y-4">
              {calculatedMaterials.map((mat, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-4 rounded-2xl transition-all border",
                    mat.isLow ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-800 tracking-tight">{mat.name}</span>
                    <Badge 
                      status={mat.isLow ? "Kurang" : "Cukup"} 
                      className={cn("text-[8px] uppercase tracking-widest px-2 py-0.5 font-black", mat.isLow ? "bg-red-100 text-red-600" : "bg-primary-light text-primary")}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1">Dibutuhkan</span>
                      <span className="text-sm font-extrabold text-primary">{mat.needed} {mat.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1">Tersedia</span>
                      <span className="text-sm font-extrabold text-slate-800">{mat.available} {mat.unit}</span>
                    </div>
                  </div>
                </div>
              ))}

              {!formData.portions && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Masukkan porsi untuk<br/>menghitung bahan
                  </p>
                </div>
              )}
            </div>

            {hasShortage && (
              <div className="p-4 bg-red-500 rounded-2xl flex gap-4 items-start shadow-xl shadow-red-500/20">
                <AlertTriangle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Stok Kurang</p>
                  <p className="text-[11px] leading-relaxed text-white/80 font-bold mt-1.5">
                    Harap kurangi jumlah porsi atau minta penambahan stok bahan baku.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
            {isEditMode && (
              <Button 
                type="button"
                variant="danger"
                className="flex-1 min-w-[150px] py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer"
                onClick={() => handleDeletePlan(formData.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Rencana
              </Button>
            )}
            {hasShortage && (
              <Button 
                type="button"
                variant="outline"
                className="flex-1 min-w-[200px] py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer border border-amber-500 hover:bg-amber-50 text-amber-700"
                onClick={handleSendShortageNotification}
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim Notif Dapur
              </Button>
            )}
            <Button 
              type="button"
              className={cn(
                "flex-1 min-w-[180px] py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] flex items-center justify-center cursor-pointer",
                hasShortage 
                  ? "bg-red-500 hover:bg-red-650 text-white shadow-red-500/20" 
                  : ""
              )} 
              onClick={handleSavePlan}
            >
              <Check className="w-4 h-4 mr-2" />
              {isEditMode ? "Simpan Perubahan" : "Simpan Rencana"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

