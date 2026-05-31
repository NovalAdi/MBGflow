import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-white",
              className
            )}
          >
            <div className="px-8 py-6 flex items-center justify-between">
              <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">{title}</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-10 h-10 hover:bg-slate-50">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="px-8 pb-8 overflow-y-auto max-h-[80vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
