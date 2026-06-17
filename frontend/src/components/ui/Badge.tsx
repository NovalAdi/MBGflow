import { cn } from "@/src/lib/utils";
import { Status } from "@/src/types.ts";
import { motion } from "motion/react";

interface BadgeProps {
  status: Status | string;
  className?: string;
}

export const Badge = ({ status, className }: BadgeProps) => {
  const getColors = (s: string) => {
    switch (s.toLowerCase()) {
      case 'notstarted':
      case 'antrean':
      case 'belum dimasak': return 'bg-[#1E293B] text-white shadow-md border border-slate-700';
      case 'preparing': 
      case 'persiapan': return 'bg-amber-100 text-amber-900 border border-amber-200';
      case 'cooking':
      case 'dimasak':
      case 'sedang dimasak':
      case 'langsung': return 'bg-[#2563EB] text-white shadow-md border border-blue-500';
      case 'ready':
      case 'done':
      case 'selesai':
      case 'success' :
      case 'berhasil':
      case 'aktif': return 'bg-[#059669] text-white shadow-md border border-emerald-500';
      case 'waste': return 'bg-rose-600 text-white shadow-sm';
      default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  const isCooking = status.toLowerCase() === 'cooking' || status.toLowerCase() === 'sedang dimasak';

  return (
    <motion.span
      animate={isCooking ? { opacity: [1, 0.8, 1] } : {}}
      transition={isCooking ? { duration: 2, repeat: Infinity } : {}}
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center",
        getColors(status),
        className
      )}
    >
      {status}
    </motion.span>
  );
};
