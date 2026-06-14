import { LayoutDashboard, Calendar, Wrench, ClipboardList, LogOut, PackageSearch, Menu, Hammer, User, BarChart2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import * as React from "react";

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
  roles: ('Admin' | 'Chef')[];
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard Admin", path: "/admin", roles: ['Admin'] },
  { icon: Calendar, label: "Rencana Produksi", path: "/admin/planning", roles: ['Admin'] },
  { icon: Wrench, label: "Manajemen Dapur", path: "/admin/kitchens", roles: ['Admin'] },
  { icon: PackageSearch, label: "Permintaan Bahan", path: "/admin/request-stock", roles: ['Admin'] },
  { icon: ClipboardList, label: "Laporan Wastage", path: "/admin/reports", roles: ['Admin'] },
  { icon: BarChart2, label: "Rekap Harian", path: "/admin/daily-recap", roles: ['Admin'] },
  { icon: LayoutDashboard, label: "Dashboard Chef", path: "/chef/dashboard", roles: ['Chef'] },
  { icon: ClipboardList, label: "Antrean Masak", path: "/chef/queue", roles: ['Chef'] },
  { icon: PackageSearch, label: "Stok Dapur", path: "/chef/stock", roles: ['Chef'] },
  { icon: PackageSearch, label: "Pengajuan Restock", path: "/chef/restock", roles: ['Chef'] },
];

export const Shell = ({ children, user, onLogout }: { children: React.ReactNode, user: any, onLogout: () => void }) => {
  const role = user?.role || 'Chef';
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));
  const sortedItems = [...filteredItems].sort((a, b) => b.path.length - a.path.length);
  const currentItem = sortedItems.find(i => location.pathname === i.path || location.pathname.startsWith(i.path + '/'));
  
  // Alternative logic to match active state perfectly
  const getIsActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8F7]">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white transition-all duration-300 flex flex-col m-6 mr-0 rounded-3xl border border-slate-100",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-8 w-full flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
            <Wrench className="w-5 h-5 rotate-90" />
          </div>
          {isSidebarOpen && <span className="font-extrabold text-xl tracking-tight text-slate-800">MBGflow</span>}
        </div>

        <div className="px-4 py-2">
           {isSidebarOpen && <span className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu</span>}
        </div>

        <nav className="flex-1 w-full px-4 py-2 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isActive = getIsActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-primary-light text-primary" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className={cn(
                   "w-2 h-6 rounded-r-full absolute left-0 transition-all",
                   isActive ? "bg-primary opacity-100" : "bg-primary opacity-0"
                )} />
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-900")} />
                {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 w-full space-y-4">
          <div 
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
               <img src={user?.avatar || `https://i.pravatar.cc/150?u=${role}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 truncate">{user?.name || "Karyawan MBG"}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 transition-all duration-300">
        <div className="pb-20 pt-4">
          {children}
        </div>
      </main>

      {/* Profile Modal */}
      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        title="Detail Profil"
      >
        <div className="space-y-8 py-4">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-24 h-24 rounded-[32px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                <img src={user?.avatar || `https://i.pravatar.cc/150?u=${role}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tighter">{user?.name}</h4>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1 px-4 py-1.5 bg-primary-light rounded-full inline-block">
                  {role === 'Admin' ? 'Administrator' : 'Master Chef'}
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Terdaftar</p>
               <p className="font-bold text-slate-700">{user?.email}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Karyawan</p>
               <p className="font-bold text-slate-700">#{user?.id?.toUpperCase()}</p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              variant="ghost" 
              className="w-full py-3.5 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-black uppercase tracking-widest text-xs border border-transparent hover:border-red-100 transition-all"
              onClick={() => {
                setIsProfileModalOpen(false);
                onLogout();
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar dari Sistem
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
