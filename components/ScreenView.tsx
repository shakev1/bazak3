
import React from 'react';
import { Screen, DashboardComponent } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { Info, Users, Layout, Check, Sparkles, MessageSquare } from 'lucide-react';

interface ScreenViewProps {
  screen: Screen;
  isSelectionMode?: boolean;
  selectedComponentIds?: string[];
  newlyImportedIds?: string[];
  onToggleComponentSelection?: (id: string) => void;
}

const ScreenView: React.FC<ScreenViewProps> = ({ 
  screen, 
  isSelectionMode = false, 
  selectedComponentIds = [], 
  newlyImportedIds = [],
  onToggleComponentSelection 
}) => {
  if (!screen || !screen.components || screen.components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
        <Layout className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium italic">אין רכיבים להצגה במסך זה</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screen.components.map((comp) => {
        const isSelected = selectedComponentIds.includes(comp.id);
        const isNew = newlyImportedIds.includes(comp.id);
        
        return (
          <div 
            key={comp.id} 
            onClick={() => isSelectionMode && onToggleComponentSelection?.(comp.id)}
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col h-[280px] transition-all relative ${
              isSelectionMode ? 'cursor-pointer hover:border-blue-400 ring-offset-2' : ''
            } ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 shadow-lg scale-[1.02] bg-blue-50/10' : 'border-slate-200'} ${
              isNew ? 'ring-4 ring-blue-400 ring-opacity-50 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.01]' : ''
            }`}
          >
            {isSelectionMode && (
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
              }`}>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            )}

            {isNew && (
              <div className="absolute -top-3 -left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg animate-bounce z-10">
                <Sparkles className="w-3 h-3" />
                נוסף כעת
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
               <div className="flex gap-2 text-slate-300">
                 {comp.type === 'free_text' ? <MessageSquare className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                 <Users className="w-4 h-4" />
                 <Layout className="w-4 h-4" />
               </div>
               <h3 className="text-sm font-bold text-slate-800">{comp.title}</h3>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
              {comp.type === 'vehicle_readiness' ? (
                <VehicleReadinessWidget />
              ) : comp.type === 'free_text' ? (
                <FreeTextWidget comp={comp} />
              ) : (
                <ReadinessDevelopmentWidget />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FreeTextWidget = ({ comp }: { comp: DashboardComponent }) => (
  <div 
    className="w-full h-full p-2 overflow-y-auto custom-scrollbar"
    style={{ 
      color: comp.config?.textColor || '#1e293b',
      textAlign: comp.config?.textAlign || 'right',
      fontSize: comp.config?.fontSize === 'lg' ? '1.125rem' : '1rem'
    }}
  >
    <div 
      className="whitespace-pre-wrap break-words leading-relaxed"
      dangerouslySetInnerHTML={{ __html: comp.content || 'אין תוכן להצגה...' }}
    />
  </div>
);

const VehicleReadinessWidget = () => (
  <>
    <div className="w-1/2 flex flex-col justify-center gap-1 text-[11px] font-bold">
      <div className="flex justify-between"><span className="text-slate-400">כשיר</span><span className="text-slate-700">1083</span></div>
      <div className="flex justify-between"><span className="text-slate-400">לא כשיר</span><span className="text-slate-700">401</span></div>
      <div className="flex justify-between border-t pt-1 mt-1"><span className="text-slate-400">סה״כ כלים</span><span className="text-slate-700">1,549</span></div>
    </div>
    <div className="w-1/2 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[{value: 80, color: '#10b981'}, {value: 20, color: '#f1f5f9'}]}
            cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value"
          >
            <Cell fill="#10b981" />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-800">80%</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase">כשירות</span>
      </div>
    </div>
  </>
);

const ReadinessDevelopmentWidget = () => (
    <div className="w-full h-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{n:'24',v:30,c:'#ef4444'},{n:'48',v:90,c:'#10b981'},{n:'72',v:99,c:'#10b981'}]} margin={{left:-40}}>
                <Bar dataKey="v" radius={[2,2,0,0]} barSize={40}>
                   <Cell fill="#ef4444" />
                   <Cell fill="#10b981" />
                   <Cell fill="#10b981" />
                </Bar>
                <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fontSize:10}} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default ScreenView;
