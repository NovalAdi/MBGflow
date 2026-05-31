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
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState("");
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);

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

  const calculateShortagesForPlan = (plan: any) => {
    if (!plan) return [];
    return planResults[plan.id]?.shortages?.map(s => ({
      material: s.material,
      amount: `${s.shortage.toFixed(2)} ${s.unit}`
    })) || [];
  };

  const handleRequestStock = (materials: { material: string, amount: string }[]) => {
    navigate("/admin/request-stock", { state: { materials } });
  };

  const handleRequestAllWeeklyShortages = () => {
    const allMaterialsShortage: Record<string, { amount: number, unit: string }> = {};
    
    Object.values(planResults).forEach((res: any) => {
      if (res.isLow) {
        res.shortages.forEach((sh: any) => {
          if (!allMaterialsShortage[sh.material]) {
            allMaterialsShortage[sh.material] = { amount: 0, unit: sh.unit };
          }
          allMaterialsShortage[sh.material].amount += sh.shortage;
        });
      }
    });

    const finalShortages = Object.keys(allMaterialsShortage).map(material => ({
      material,
      amount: `${allMaterialsShortage[material].amount.toFixed(2)} ${allMaterialsShortage[material].unit}`
    }));

    if (finalShortages.length > 0) {
      handleRequestStock(finalShortages);
    } else {
      alert("Tidak ada kekurangan bahan untuk minggu ini.");
    }
  };

  const handleSavePlan = async () => {
    if (!formData.portions || formData.portions <= 0) {
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
      setDetailModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error deleting production plan:", error);
      alert("Gagal menghapus rencana produksi: " + (error instanceof Error ? error.message : String(error)));
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
    setDetailModalOpen(false);
    setFormModalOpen(true);
  };

  const handleItemClick = (item: any, day: string) => {
    setSelectedPlan({ ...item, day });
    setDetailModalOpen(true);
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
    setFormModalOpen(true);
  };

  // Calculation Logic for Form
  const selectedMenuData = menus.find(m => m.name === formData.menu);
  const calculatedMaterials = React.useMemo(() => {
    if (!selectedMenuData) return [];
    return selectedMenuData.ingredients.map(ing => {
      const needed = Number((ing.perPortion * formData.portions).toFixed(2));
      const item = inventory.find(i => i.name === ing.name);
      const available = item 
        ? item.batches
            .filter((b: any) => !formData.kitchenId || b.kitchenId === formData.kitchenId)
            .reduce((sum: number, b: any) => sum + (parseFloat(b.weight) || 0), 0)
        : 0;
      const isLow = needed > available;
      return { ...ing, needed, available, isLow };
    });
  }, [formData.menu, formData.portions, selectedMenuData]);

  const hasShortage = calculatedMaterials.some(m => m.isLow);

  // Calculation for Detail View
  const detailMaterials = React.useMemo(() => {
    if (!selectedPlan) return [];
    const menuData = menus.find(m => m.name === selectedPlan.m || m.name === selectedPlan.menuName);
    if (!menuData) return [];
    
    const simResult = planResults[selectedPlan.id];
    
    return menuData.ingredients.map(ing => {
      const needed = Number((ing.perPortion * selectedPlan.portions).toFixed(2));
      const isLow = simResult?.shortages?.some(s => s.material === ing.name) || false;
      const shInfo = simResult?.shortages?.find(s => s.material === ing.name);
      const remainingNeeded = shInfo ? shInfo.shortage : 0;
      const available = Number((needed - remainingNeeded).toFixed(2));

      return {
        name: ing.name,
        needed,
        available: Math.max(0, available),
        isLow,
        shortageText: shInfo?.details || ""
      };
    });
  }, [selectedPlan, planResults, menus]);

  const isItemLow = React.useCallback((item: any) => {
    return planResults[item.id]?.isLow || false;
  }, [planResults]);

  const isItemOverCapacity = React.useCallback((item: any) => {
    return planResults[item.id]?.isOverCapacity || false;
  }, [planResults]);

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
        <Button 
          className="shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all"
          onClick={handleRequestAllWeeklyShortages}
        >
          <PackageSearch className="w-5 h-5 font-bold" />
          Minta Kekurangan Stok
        </Button>
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
              items={plans.find(p => p.day === day)?.items || []}
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

      {/* Detail Plan Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        title="Detail Audit Produksi"
        className="max-w-3xl"
      >
        {selectedPlan && (
          <div className="space-y-10 py-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h4 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em]">Data Perencanaan</h4>
              <div className="flex items-center gap-3">
                <Button 
                  variant="secondary" 
                  className="h-11 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-sm border-none bg-slate-100 hover:bg-slate-200 text-slate-700"
                  onClick={() => handleEditClick(selectedPlan, selectedPlan.day)}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Rencana
                </Button>
                <button 
                  className="h-11 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 transition-all shadow-sm border border-red-100"
                  onClick={() => handleDeletePlan(selectedPlan.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50/50 rounded-[32px] space-y-2 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Masakan / Menu</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{selectedPlan.menuName || selectedPlan.m}</p>
              </div>
              <div className="p-8 bg-slate-50/50 rounded-[32px] space-y-2 border border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Target Kapasitas</p>
                <p className="text-3xl font-black text-primary tracking-tighter leading-none">{selectedPlan.portions} <span className="text-xs uppercase font-bold tracking-widest text-primary/50 ml-1">Porsi</span></p>
              </div>
              <div className="p-8 bg-slate-50/50 rounded-[32px] space-y-3 border border-slate-50 col-span-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Penugasan Dapur</p>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-50">
                      <PackageSearch className="w-5 h-5" />
                   </div>
                   <p className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">{selectedPlan.kitchenName || selectedPlan.k} Production Hub</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50/50 rounded-[32px] space-y-3 border border-slate-50 col-span-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Catatan Produksi</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                  {selectedPlan.note || "Tidak ada catatan tambahan untuk produksi ini."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">Cek Integritas Bahan</h4>
                <Badge 
                  status={isItemLow(selectedPlan) ? "Kekurangan Bahan" : "Bahan Tersedia"} 
                  className={cn("uppercase font-black text-[9px] tracking-widest px-4 py-1.5 rounded-full border-none", isItemLow(selectedPlan) ? "bg-red-50 text-red-500" : "bg-primary-light text-primary")}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {detailMaterials.map((mat: any, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "p-6 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between border-2 transition-all gap-4",
                      mat.isLow ? "bg-red-50/50 border-red-100 shadow-sm" : "bg-white border-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-5">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0", mat.isLow ? "bg-white text-red-500 animate-pulse" : "bg-slate-50 text-slate-300")}>
                          <Check className="w-5 h-5" />
                       </div>
                       <div>
                        <p className="text-lg font-black text-slate-800 tracking-tight">{mat.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Kebutuhan: <span className="text-slate-800 font-extrabold">{mat.needed} {mat.unit}</span></p>
                        {mat.isLow && mat.shortageText && (
                          <div className="text-[10px] text-red-600 font-extrabold uppercase tracking-wide mt-2 px-3 py-1.5 rounded-xl bg-red-100/50 border border-red-100/40 w-fit">
                            ⚠️ {mat.shortageText}
                          </div>
                        )}
                      </div>
                    </div>
                    {mat.isLow && (
                      <div className="text-right flex items-center gap-4 sm:gap-6 shrink-0 self-end sm:self-auto">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1 opacity-60">DEFISIT</p>
                          <p className="font-black text-red-600 text-sm md:text-base tracking-tighter leading-none">{(mat.needed - mat.available).toFixed(2)} {mat.unit}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-12 w-12 rounded-2xl bg-white shadow-md text-red-500 hover:bg-red-50 border-none transition-all p-0 flex items-center justify-center group"
                          onClick={() => {
                            setDetailModalOpen(false);
                            handleRequestStock([{ material: mat.name, amount: `${(mat.needed - mat.available).toFixed(2)} ${mat.unit}` }]);
                          }}
                        >
                          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

              <div className="pt-8 flex gap-4">
                <Button variant="ghost" className="flex-1 py-6 rounded-3xl" onClick={() => setDetailModalOpen(false)}>Kembali</Button>
                {isItemLow(selectedPlan) ? (
                  <Button variant="danger" className="flex-1 py-6 rounded-3xl" onClick={() => {
                    setDetailModalOpen(false);
                    handleRequestStock(calculateShortagesForPlan(selectedPlan));
                  }}>
                    Minta Kekurangan Bahan
                  </Button>
                ) : (
                  <Button variant="primary" className="flex-1 py-6 rounded-3xl" onClick={() => setDetailModalOpen(false)}>
                    Finalisasi Rencana
                  </Button>
                )}
              </div>
          </div>
        )}
      </Modal>

      {/* Form Production Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => { setFormModalOpen(false); setIsEditMode(false); }} 
        title={isEditMode ? `Edit Rencana Produksi - ${selectedDay}` : `Tambah Rencana Produksi - ${selectedDay}`}
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-slate-50/50 rounded-[32px] space-y-8 border border-slate-50">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pilih Menu</label>
                <select 
                  className="w-full border-2 border-transparent bg-white rounded-2xl p-5 text-base font-black text-slate-800 outline-none focus:border-primary transition-all shadow-sm"
                  value={formData.menu}
                  onChange={(e) => setFormData(prev => ({ ...prev, menu: e.target.value }))}
                >
                  {menus.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pilih Dapur</label>
                <select 
                  className="w-full border-2 border-transparent bg-white rounded-2xl p-5 text-base font-black text-slate-800 outline-none focus:border-primary transition-all shadow-sm"
                  value={formData.kitchenId}
                  onChange={(e) => setFormData(prev => ({ ...prev, kitchenId: e.target.value }))}
                >
                  {kitchens.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
                {formData.kitchenId && (
                  <p className="text-[10px] font-bold text-slate-400 mt-1 px-1">
                    Kapasitas Dapur: <span className="text-slate-600">{selectedKitchenCapacity} porsi</span> | Sudah Terencana: <span className="text-slate-600">{otherPlansPortionsForDay} porsi</span>
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Target Jumlah Porsi</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    value={formData.portions || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, portions: Number(e.target.value) }))}
                    placeholder="Masukkan jumlah porsi..."
                    className="w-full border-2 border-transparent bg-white rounded-2xl p-5 font-black text-2xl tracking-tighter text-slate-800 outline-none focus:border-primary transition-all shadow-sm"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[10px] uppercase tracking-widest">Porsi</div>
                </div>
                {isFormOverCapacity && (
                  <div className="p-5 bg-amber-500 rounded-[24px] flex gap-4 items-start shadow-xl shadow-amber-500/20 text-white animate-pulse mt-3">
                    <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white">Kapasitas Terlampaui</p>
                      <p className="text-[11px] leading-relaxed text-white/90 font-bold mt-1.5">
                        Total porsi terencana ({otherPlansPortionsForDay + formData.portions} porsi) melebihi kapasitas dapur ({selectedKitchenCapacity} porsi).
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Catatan Tambahan</label>
                <textarea 
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Contoh: Pisahkan sambal, kurangi garam, dll..."
                  className="w-full border-2 border-transparent bg-white rounded-2xl p-5 font-medium text-sm text-slate-700 outline-none focus:border-primary transition-all shadow-sm min-h-[120px] resize-none"
                />
              </div>
            </div>
            <Button 
              className={cn(
                "w-full py-6 rounded-[24px] font-black uppercase tracking-[0.15em] text-sm shadow-2xl transition-all active:scale-[0.98]",
                hasShortage 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                  : "bg-primary hover:bg-primary-dark text-white shadow-primary/20"
              )} 
              onClick={handleSavePlan}
            >
              <Check className="w-5 h-5 mr-3" />
              {isEditMode ? "Simpan Perubahan" : "Simpan Rencana"}
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                 <Calculator className="w-4 h-4" />
              </div>
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest">Cek Bahan Langsung</h4>
            </div>
            
            <div className="space-y-4">
              {calculatedMaterials.map((mat, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-5 rounded-[24px] transition-all border-2",
                    mat.isLow ? "bg-red-50/50 border-red-100" : "bg-white border-transparent"
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
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5 opacity-60">Dibutuhkan</p>
                      <p className="font-black text-primary text-base tracking-tighter leading-none">{mat.needed} {mat.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1.5 opacity-60">Tersedia</p>
                      <p className="font-black text-slate-300 text-base tracking-tighter leading-none">{mat.available} {mat.unit}</p>
                    </div>
                  </div>
                </div>
              ))}

              {!formData.portions && (
                <div className="p-10 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                  <Info className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                    Masukkan porsi untuk<br/>menghitung bahan
                  </p>
                </div>
              )}
            </div>

            {hasShortage && (
              <div className="p-5 bg-red-500 rounded-[24px] flex gap-4 items-start shadow-xl shadow-red-500/20">
                <AlertTriangle className="w-6 h-6 text-white shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Stok Kurang</p>
                  <p className="text-[11px] leading-relaxed text-white/80 font-bold mt-1.5">
                    Harap kurangi jumlah porsi atau minta penambahan stok bahan baku.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

