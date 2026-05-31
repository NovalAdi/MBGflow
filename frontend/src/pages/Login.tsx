import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wrench, Eye, EyeOff, LogIn, ChevronRight, Check, AlertTriangle, LayoutDashboard, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { api } from "../services/api";

export const Login = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.login({ email, password });
      if (response.success) {
        onLogin(response.user);
        if (response.user.role === 'Admin') {
          navigate("/admin");
        } else {
          navigate("/chef/queue");
        }
      } else {
        setError("Kredensial tidak valid.");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Pane - Artistic Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-80"
            alt="Kitchen Background"
          />
          <div className="absolute inset-0 bg-slate-900/20" />
        </motion.div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/40 rotate-12">
              <Wrench className="w-6 h-6 rotate-90" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">MBGflow</span>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter max-w-md">
                Precision in Every <span className="text-primary">Portion.</span>
              </h2>
              <p className="text-white/80 text-lg mt-6 max-w-sm font-medium leading-relaxed">
                Kelola rantai pasok dan produksi dapur pusat dengan sistem manajemen terintegrasi.
              </p>
            </motion.div>

            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === 0 ? "w-8 bg-primary" : "w-2 bg-white/20")} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
            <span>© 2024 MBG Culinaries</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>Version 2.4.0</span>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-white relative">
        <div className="max-w-md w-full mx-auto space-y-12">
          <div className="space-y-3">
            <motion.h3 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-slate-900 tracking-tight leading-none"
            >
              Selamat Datang <span className="text-primary italic">Kembali!</span>
            </motion.h3>
            <p className="text-slate-600 font-bold text-sm tracking-tight">Pilih jalur akses anda untuk masuk ke sistem SCM.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Email Karyawan</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-6 py-4 outline-none focus:bg-white focus:border-primary transition-all font-bold text-slate-800 placeholder:text-slate-400 shadow-sm shadow-slate-200/50",
                      error && "border-red-500 bg-red-50"
                    )}
                    placeholder="nama@mbg-culinaries.com"
                    required
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    {email.includes("@") && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Kata Sandi</label>
                  <button type="button" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Lupa Sandi?</button>
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] px-6 py-4 outline-none focus:bg-white focus:border-primary transition-all font-bold text-slate-800 placeholder:text-slate-400 shadow-sm shadow-slate-200/50"
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                 <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary appearance-none bg-slate-100 border-2 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                 <label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer">Biarkan saya tetap masuk selama 30 hari</label>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-red-600 leading-normal">{error}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full py-7 rounded-[26px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk ke Dashboard
                </>
              )}
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Login Cepat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button
                type="button"
                onClick={() => { setEmail("admin@mbg.com"); setPassword("password"); }}
                className="flex items-center justify-center gap-3 py-4.5 px-5 border-2 border-slate-100 hover:border-orange-200 rounded-[24px] bg-slate-50/20 hover:bg-orange-50/10 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 font-extrabold text-xs text-slate-700 cursor-pointer text-left"
             >
                <div className="w-8 h-8 rounded-xl bg-orange-100/70 flex items-center justify-center text-orange-600 border border-orange-200 shrink-0">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-800 font-black tracking-tight text-sm leading-none">Portal Admin</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Uji Coba Admin</p>
                </div>
             </button>
             <button
                type="button"
                onClick={() => { setEmail("chef@mbg.com"); setPassword("password"); }}
                className="flex items-center justify-center gap-3 py-4.5 px-5 border-2 border-slate-100 hover:border-emerald-200 rounded-[24px] bg-slate-50/20 hover:bg-emerald-50/10 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 font-extrabold text-xs text-slate-700 cursor-pointer text-left"
             >
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 flex items-center justify-center text-emerald-600 border border-emerald-200 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-slate-800 font-black tracking-tight text-sm leading-none">Portal Chef</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Uji Coba Koki</p>
                </div>
             </button>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8">
            Belum punya akun? <button className="text-primary hover:underline">Hubungi IT Support</button>
          </p>
        </div>
      </div>
    </div>
  );
};
