
import React, { useState } from 'react';
import { Screen, DashboardComponent } from '../types';
import { Plus, X, Edit2, Info, Users, Layout, Check } from 'lucide-react';
import AddComponentModal from './AddComponentModal';

interface ScreenEditProps {
  screen: Screen;
  components: DashboardComponent[];
  setComponents: React.Dispatch<React.SetStateAction<DashboardComponent[]>>;
  onSave: (s: Screen) => void;
  onCancel: () => void;
}

const ScreenEdit: React.FC<ScreenEditProps> = ({ screen, components, setComponents, onSave, onCancel }) => {
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [editingComponent, setEditingComponent] = useState<DashboardComponent | null>(null);

  const handleAddComponent = (comp: DashboardComponent) => {
    setComponents(prev => [...prev, comp]);
    setIsAddingComponent(false);
  };

  const handleUpdateComponent = (updatedComp: DashboardComponent) => {
    setComponents(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
    setEditingComponent(null);
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  const handleFinalSave = () => {
    onSave({ ...screen, components });
  };

  const slots = Array.from({ length: 12 });

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((_, idx) => {
          const comp = components[idx];
          if (comp) {
            return (
              <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[280px] relative group overflow-hidden">
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }} 
                     className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors shadow-sm"
                   >
                     <X className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setEditingComponent(comp); }}
                     className="p-1.5 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex gap-2 text-slate-300">
                     <Info className="w-4 h-4" />
                     <Users className="w-4 h-4" />
                     <Layout className="w-4 h-4" />
                   </div>
                   <h3 className="text-sm font-bold text-slate-800">{comp.title}</h3>
                </div>
                <div className="flex-1 bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                   {comp.type === 'free_text' ? (
                     <div className="text-[10px] font-bold line-clamp-3 overflow-hidden text-right w-full" dangerouslySetInnerHTML={{ __html: comp.content || 'רכיב טקסט ריק' }} />
                   ) : (
                     <Layout className="w-8 h-8 opacity-20" />
                   )}
                   <span className="text-[10px] font-bold uppercase tracking-widest">{comp.type === 'free_text' ? 'טקסט חופשי' : 'נתונים גרפיים'}</span>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={idx}
              onClick={() => setIsAddingComponent(true)}
              className="bg-white rounded-xl border-2 border-dashed border-slate-200 h-[280px] flex items-center justify-center hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-50 p-4 rounded-full text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">הוסף רכיב חדש</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">עריכת רכיבים</span>
            <span className="text-sm font-bold text-slate-800">{components.length} רכיבים מוגדרים כעת</span>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
            ביטול שינויים
          </button>
          <button 
            onClick={handleFinalSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            שמור שינויים במסך
          </button>
      </div>

      {(isAddingComponent || editingComponent) && (
        <AddComponentModal 
          onClose={() => {
            setIsAddingComponent(false);
            setEditingComponent(null);
          }} 
          onSubmit={editingComponent ? handleUpdateComponent : handleAddComponent}
          initialData={editingComponent || undefined}
        />
      )}
    </div>
  );
};

export default ScreenEdit;
