import * as React from "react";
import { Card } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileWarning, AlertOctagon, UserCheck, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { api } from "@/src/services/api";

const wastageStats = [
  { name: 'Kedaluwarsa', value: 45, color: '#F43F5E' },
  { name: 'Kelalaian Manusia', value: 30, color: '#4F46E5' },
  { name: 'Rusak/Busuk', value: 25, color: '#F59E0B' },
];

const mockAuditData = [
  { id: 'W1', kitchen: 'Jakarta Main', city: 'Jakarta', material: 'Ayam Negri', weight: 5, unit: 'kg', reason: 'Kedaluwarsa', cost: 250000, date: '2024-05-18' },
  { id: 'W2', kitchen: 'Tangerang Satellite', city: 'Tangerang', material: 'Beras Pandan', weight: 10, unit: 'kg', reason: 'Kelalaian Manusia', cost: 150000, date: '2024-05-18' },
  { id: 'W3', kitchen: 'Depok Cloud', city: 'Depok', material: 'Minyak Goreng', weight: 2, unit: 'L', reason: 'Busuk', cost: 40000, date: '2024-05-17' },
  { id: 'W4', kitchen: 'Jakarta Selatan', city: 'Jakarta', material: 'Ayam Negri', weight: 3, unit: 'kg', reason: 'Kedaluwarsa', cost: 150000, date: '2024-05-16' },
  { id: 'W5', kitchen: 'Bekasi Hub', city: 'Bekasi', material: 'Telor Ayam', weight: 12, unit: 'kg', reason: 'Busuk', cost: 85000, date: '2024-05-16' },
  { id: 'W6', kitchen: 'Bogor Central', city: 'Bogor', material: 'Sayur Bayam', weight: 8, unit: 'kg', reason: 'Kedaluwarsa', cost: 32000, date: '2024-05-15' },
  { id: 'W7', kitchen: 'Jakarta Barat', city: 'Jakarta', material: 'Daging Sapi', weight: 1.5, unit: 'kg', reason: 'Busuk', cost: 180000, date: '2024-05-15' },
  { id: 'W8', kitchen: 'Bintaro Satellite', city: 'Tangerang', material: 'Cabai Merah', weight: 4, unit: 'kg', reason: 'Kelalaian Manusia', cost: 120000, date: '2024-05-14' },
  { id: 'W9', kitchen: 'Serpong Hub', city: 'Tangerang', material: 'Santan Kelapa', weight: 5, unit: 'L', reason: 'Busuk', cost: 75000, date: '2024-05-14' },
  { id: 'W10', kitchen: 'Jakarta Timur', city: 'Jakarta', material: 'Ikan Gurame', weight: 6, unit: 'kg', reason: 'Kedaluwarsa', cost: 300000, date: '2024-05-13' },
];

type SortConfig = {
  key: keyof typeof mockAuditData[0] | null;
  direction: 'asc' | 'desc';
};

export const WastageReport = () => {
  const [searchText, setSearchText] = React.useState("");
  const [cityFilter, setCityFilter] = React.useState("Semua");
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: null, direction: 'asc' });
  const [auditData, setAuditData] = React.useState<any[]>(mockAuditData);
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

  React.useEffect(() => {
    api.getWastage().then((data: any) => {
      if (data && data.length > 0) {
        const backendIds = new Set(data.map((item: any) => item.id));
        const filteredMock = mockAuditData.filter((item: any) => !backendIds.has(item.id));
        setAuditData([...data, ...filteredMock]);
      }
    }).catch(err => {
      console.error("Failed to load live wastage records:", err);
    });
  }, []);

  const uniqueCities = ["Semua", ...new Set(auditData.map(item => item.city))];

  // Dynamic Pie Chart Data based on reasons in auditData
  // Force exactly 3 categories: Expired, Human Error, Spoiled
  const wastageStats = React.useMemo(() => {
    const counts: Record<string, number> = { 'Kedaluwarsa': 0, 'Kelalaian Manusia': 0, 'Busuk': 0 };
    auditData.forEach(item => {
      let category = item.reason;
      if (category === 'Damage' || category === 'Damage/Spoiled' || category === 'Spoiled' || category === 'Tumpah / Rusak') category = 'Busuk';
      if (counts.hasOwnProperty(category)) {
        counts[category]++;
      }
    });
    const total = auditData.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  }, [auditData]);

  // Data for Bar Chart: Top 5 Wastage per Material
  const materialChartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    auditData.forEach(item => {
      counts[item.material] = (counts[item.material] || 0) + item.weight;
    });
    return Object.entries(counts)
      .map(([name, weight]) => ({ name, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }, [auditData]);

  const handleSort = (key: keyof typeof mockAuditData[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let data = [...auditData];

    // Search
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      data = data.filter(item => 
        item.kitchen.toLowerCase().includes(lowerSearch) ||
        item.material.toLowerCase().includes(lowerSearch) ||
        item.city.toLowerCase().includes(lowerSearch) ||
        item.reason.toLowerCase().includes(lowerSearch)
      );
    }

    // City Filter
    if (cityFilter !== "Semua") {
      data = data.filter(item => item.city === cityFilter);
    }

    // Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [searchText, cityFilter, sortConfig]);

  // Paginated Data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const SortIcon = ({ column }: { column: keyof typeof mockAuditData[0] }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-3 h-3 ml-1 text-primary" /> : 
      <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getReasonColor = (name: string) => {
    if (name === 'Kedaluwarsa' || name === 'Expired') return '#EF4444'; // Red-500
    if (name === 'Kelalaian Manusia' || name === 'Human Error') return '#4F46E5'; // Indigo-600
    if (name === 'Busuk' || name === 'Spoiled' || name === 'Damage' || name === 'Damage/Spoiled') return '#F59E0B'; // Amber-500
    return '#64748B';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audit Limbah Nasional</h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2 px-1">Laporan efisiensi & audit limbah seluruh unit produksi</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge status="Mode Audit" className="bg-primary-light text-primary border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wastage Summary Chart (Pie) */}
        <Card className="flex flex-col items-center justify-center p-8 border-none rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all bg-white gap-6">
          <div className="w-full">
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Probabilitas Kegagalan</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Analisis Keparahan Nasional</p>
          </div>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastageStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {wastageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getReasonColor(entry.name)} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', padding: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {wastageStats.map((stat) => (
              <div key={stat.name} className="flex flex-col items-center p-4 rounded-[24px] bg-slate-50/50 border border-slate-50">
                <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ backgroundColor: getReasonColor(stat.name) }} />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">{stat.name}</span>
                <span className="text-base font-black text-slate-800 tracking-tighter">{stat.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Wastage by Material (Bar) */}
        <Card className="flex flex-col p-8 border-none rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all bg-white gap-6">
           <div className="w-full">
            <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Wastage per Bahan</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Top 5 Distribusi Volume (KG/L)</p>
          </div>
          <div className="w-full flex-1 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialChartData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 'bold' }}
                  width={110}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                />
                <Bar 
                  name="Volume"
                  dataKey="weight" 
                  fill="#15803D" 
                  stroke="#15803D"
                  strokeWidth={1}
                  radius={[0, 6, 6, 0]} 
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Global Wastage Table */}
      <Card className="p-0 overflow-hidden flex flex-col border-none rounded-[32px] shadow-sm bg-white">
        <div className="p-10 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between bg-white gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tighter leading-tight shrink-0">Log Jejak Audit</h3>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] mt-1 whitespace-nowrap">Real-time National Wastage Feed</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* City Filter */}
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-transparent focus-within:border-primary transition-all group flex-1 lg:flex-none">
                <Filter className="w-4 h-4 text-slate-300 group-focus-within:text-primary" />
                <select 
                  value={cityFilter}
                  onChange={(e) => {setCityFilter(e.target.value); setCurrentPage(1);}}
                  className="bg-transparent text-[11px] font-black text-slate-800 uppercase tracking-widest outline-none cursor-pointer w-full"
                >
                  {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div className="relative w-full lg:w-72 group">
              <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchText}
                onChange={(e) => {setSearchText(e.target.value); setCurrentPage(1);}}
                placeholder="Cari audit trail..." 
                className="pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-primary focus:bg-white outline-none w-full transition-all" 
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50 text-slate-600">
                <th onClick={() => handleSort('city')} className="text-left py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">LOK <SortIcon column="city" /></div>
                </th>
                <th onClick={() => handleSort('kitchen')} className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">DAPUR <SortIcon column="kitchen" /></div>
                </th>
                <th onClick={() => handleSort('material')} className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">Bahan <SortIcon column="material" /></div>
                </th>
                <th onClick={() => handleSort('reason')} className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">Alasan <SortIcon column="reason" /></div>
                </th>
                <th onClick={() => handleSort('weight')} className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">Berat <SortIcon column="weight" /></div>
                </th>
                <th onClick={() => handleSort('cost')} className="text-left py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center">Est. Biaya <SortIcon column="cost" /></div>
                </th>
                <th onClick={() => handleSort('date')} className="text-right py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-primary transition-colors">
                  <div className="flex items-center justify-end">Tanggal <SortIcon column="date" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="py-8 px-10">
                    <span className="text-[10px] font-black text-slate-400 bg-white border-2 border-slate-50 px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">{row.city}</span>
                  </td>
                  <td className="py-8 px-6 text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                    {row.kitchen}
                  </td>
                  <td className="py-8 px-6 text-sm font-bold text-slate-500 tracking-tight">
                    {row.material}
                  </td>
                  <td className="py-8 px-6">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-2 h-2 rounded-full",
                         row.reason === 'Kedaluwarsa' ? "bg-red-500" : row.reason === 'Kelalaian Manusia' ? "bg-primary" : "bg-orange-500"
                       )} />
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{row.reason}</span>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <span className="text-lg font-black text-slate-800 tracking-tighter">{row.weight} {row.unit}</span>
                  </td>
                  <td className="py-8 px-6">
                    <span className="text-lg font-black text-red-500 tracking-tighter">{formatCurrency(row.cost)}</span>
                  </td>
                  <td className="py-8 px-10 text-right">
                    <span className="text-[11px] text-slate-300 font-black tracking-widest uppercase">{row.date}</span>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-32 text-center">
                    <FileWarning className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Audit trail tidak ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris per halaman:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                className="bg-white border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-black text-slate-700 focus:outline-none focus:border-primary shadow-sm"
              >
                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
           </div>
           
           <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 px-6"
              >
                Sebelumnya
              </Button>
              <div className="flex items-center gap-2 px-4">
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">Hal {currentPage}</span>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">dari {totalPages || 1}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="rounded-xl font-black uppercase text-[10px] tracking-widest py-4 px-6"
              >
                Selanjutnya
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
};

