
import React from 'react';
import { List, Edit2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const readinessData = [
  { name: '24 שעות', value: 30, color: '#f43f5e' },
  { name: '48 שעות', value: 90, color: '#10b981' },
  { name: '72 שעות', value: 99, color: '#10b981' },
];

const familyReadinessData = [
  { name: '{משפחה}', value: 30, color: '#f43f5e' },
  { name: '{משפחה}', value: 30, color: '#f43f5e' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
  { name: '{משפחה}', value: 80, color: '#10b981' },
];

const pieData = [
  { name: 'כשיר', value: 1083, color: '#10b981' },
  { name: 'לא כשיר', value: 466, color: '#f1f5f9' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* Column 1: Charts (Right Side) */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800">התפתחות כשירות</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">צפי כשירות לפי תקלה פתוחה</p>
                    <div className="h-48 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={readinessData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                                    {readinessData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="w-1/2 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-4">
                         <div className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4 text-slate-400" />
                            <h3 className="font-bold text-slate-800">כשירות רק״ם עיקרי</h3>
                         </div>
                         <div className="text-[10px] text-slate-400 border rounded px-1 flex items-center gap-1">
                             משפחה <ChevronDown className="w-3 h-3" />
                         </div>
                    </div>
                    
                    <div className="relative w-full h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={0}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-slate-800">80%</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">כשירות</span>
                        </div>
                    </div>

                    <div className="w-full mt-2 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                            <span className="text-slate-400">כשיר</span>
                            <span className="text-slate-700">1083</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span className="text-slate-400">לא כשיר</span>
                            <span className="text-slate-700">401</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1 mt-1">
                            <span className="text-slate-400">סה״כ כלים</span>
                            <span className="text-slate-700">1,549</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Column 2: Progress & Waitlists (Center-Right) */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <ProgressCard 
            title="כשירות מכפיל כוח אגפי" 
            percentage={89} 
            subtitle="9 כשירים מתוך 10" 
        />
        <ProgressCard 
            title="כשירות מכפיל כוח לוגיסטי" 
            percentage={89} 
            subtitle="9 כשירים מתוך 10" 
        />
        <div className="space-y-4">
            <SmallCard title="ממתינים לחוליה מטכ״לית" value="200" subValue="18 כלים" />
            <SmallCard title="פערי חלפים" value="40" subValue="18 תקלות" highlight="12 קריטיים" />
        </div>
      </div>

      {/* Column 3: Maintenance & Logistics (Center-Left) */}
      <div className="col-span-12 lg:col-span-2 space-y-6">
        <StatusCard 
            title="שחיקה" 
            value="285" 
            subValue="18 כלים"
            details={[
              { label: 'שחיקה טכנית', value: 100 },
              { label: 'שחיקה מבצעית', value: 185 },
            ]}
          />
          <div className="space-y-4">
            <SmallCard title="ממתינים לחילוץ" value="12" subValue="18 תקלות" />
            <SmallCard title="ממתינים להובלה" value="56" subValue="18 תקלות" detail="18 נדרשים מוביל כננת" />
          </div>
      </div>

      {/* Column 4: Faults & Field Data (Left Side) */}
      <div className="col-span-12 lg:col-span-2 space-y-6">
        <StatusCard 
          title="כלים תקולים במרחב הלחימה" 
          value="285" 
          subValue="18 תקלות"
          details={[
            { label: 'ניוד עצמאי', value: 100 },
            { label: 'ניוד לא עצמאי', value: 185 },
          ]}
        />
        <StatusCard 
            title="כלים תקולים בשטח" 
            value="150" 
            subValue="18 תקלות"
            details={[
              { label: 'בשטח', value: 25 },
              { label: 'אגד', value: 25 },
              { label: 'משא', value: 50 },
              { label: 'תעשיות', value: 50 },
            ]}
          />
      </div>

      {/* Bottom Row - Full Width Charts */}
      <div className="col-span-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 text-sm">כשירות לפי משפחות</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={familyReadinessData} margin={{ top: 0, right: 0, left: -40, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={(props: any) => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight="bold">
                                            {payload.value}
                                        </text>
                                        <text x={0} y={0} dy={30} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight="bold">
                                            {familyReadinessData[payload.index].value}%
                                        </text>
                                    </g>
                                );
                            }} 
                        />
                        <YAxis axisLine={false} tickLine={false} tick={false} />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={8}>
                            {familyReadinessData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components (Keep existing)
const StatusCard = ({ title, value, subValue, details }: { title: string; value: string; subValue: string; details: { label: string; value: number }[] }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col">
    <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-bold text-slate-700 max-w-[120px] leading-tight">{title}</h4>
        <List className="w-4 h-4 text-slate-300 cursor-pointer" />
    </div>
    <div className="mb-6">
        <span className="text-4xl font-extrabold text-slate-900 leading-none">{value}</span>
        <div className="text-xs text-slate-400 font-bold mt-1">{subValue}</div>
    </div>
    <div className="space-y-2 mt-auto">
        {details.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-700">{item.value}</span>
            </div>
        ))}
    </div>
  </div>
);

const SmallCard = ({ title, value, subValue, detail, highlight }: { title: string; value: string; subValue: string; detail?: string; highlight?: string }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 h-fit">
        <div className="p-2 bg-slate-50 rounded-lg">
            <List className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-600 mb-1">{title}</h4>
            <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-slate-800 leading-none">{value}</span>
                <span className="text-[10px] text-slate-400 font-bold mb-0.5">{subValue}</span>
            </div>
            {detail && <div className="text-[10px] text-slate-500 font-medium mt-1">{detail}</div>}
            {highlight && <div className="text-[10px] text-red-500 font-bold mt-1">{highlight}</div>}
        </div>
    </div>
);

const ProgressCard = ({ title, percentage, subtitle }: { title: string; percentage: number; subtitle: string }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-700">{title}</h4>
            <List className="w-4 h-4 text-slate-300" />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-[10px] text-slate-400 font-bold">{subtitle}</div>
            </div>
            <div className="text-2xl font-black text-slate-800">{percentage}%</div>
        </div>
    </div>
);

const ChevronDown = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default Dashboard;
