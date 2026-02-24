
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  List, 
  AlertCircle, 
  FileEdit, 
  Plus, 
  ChevronDown,
  Activity,
  User,
  Settings,
  ShieldCheck,
  ChevronLeft,
  Users
} from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onAddScreen?: () => void;
  screens: Screen[];
  sharedScreens: Screen[];
  activeScreenId: string | null;
  onSelectScreen: (id: string) => void;
  onSelectDashboard: () => void;
  onOpenCatalog?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onAddScreen, 
  screens, 
  sharedScreens,
  activeScreenId, 
  onSelectScreen,
  onSelectDashboard,
  onOpenCatalog
}) => {
  const categories: string[] = Array.from(new Set(screens.map(s => s.category)));
  const sharedCategories: string[] = Array.from(new Set(sharedScreens.map(s => s.category)));

  return (
    <aside className={`w-80 bg-white border-l border-slate-200 flex flex-col h-screen sticky top-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">
          מערכת מרכזת למעקב <br /> כשירות הטנ״א
        </h2>
      </div>

      <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
        <SidebarItem 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          label="מבט על" 
          active={activeScreenId === null && !onOpenCatalog} 
          onClick={onSelectDashboard}
        />
        <SidebarItem icon={<List className="w-5 h-5" />} label="רשימת כלים" />
        <SidebarItem icon={<AlertCircle className="w-5 h-5" />} label="רשימת תקלות" />
        <SidebarItem icon={<FileEdit className="w-5 h-5" />} label="דיווח כשירות" />

        <div className="my-8 border-t border-slate-100 pt-8 px-2">
            <button 
              onClick={onAddScreen}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors"
            >
                <Plus className="w-5 h-5" />
                הוספת מסך
            </button>
        </div>

        <SectionHeader label="מסכים שייצרתי" />
        
        {categories.length > 0 ? categories.map(category => (
          <SidebarItem 
            key={category}
            icon={category === 'הערכת מצב' ? <Activity className="w-5 h-5" /> : <User className="w-5 h-5" />} 
            label={category} 
            expandable 
            initialExpanded={true}
            subItems={screens
              .filter(s => s.category === category)
              .map(s => ({
                id: s.id,
                label: s.name,
                statusColor: s.color,
                isActive: activeScreenId === s.id
              }))
            }
            onSubItemClick={onSelectScreen}
          />
        )) : (
          <div className="px-3 py-2 text-xs text-slate-400 italic">אין מסכים אישיים</div>
        )}

        <SectionHeader label="מסכים משותפים" />
        {sharedCategories.length > 0 ? sharedCategories.map(category => (
          <SidebarItem 
            key={`shared-${category}`}
            icon={<Users className="w-5 h-5" />} 
            label={category} 
            expandable 
            initialExpanded={false}
            subItems={sharedScreens
              .filter(s => s.category === category)
              .map(s => ({
                id: s.id,
                label: s.name,
                statusColor: s.color,
                isActive: activeScreenId === s.id
              }))
            }
            onSubItemClick={onSelectScreen}
          />
        )) : (
          <div className="px-3 py-2 text-xs text-slate-400 italic">אין מסכים משותפים זמינים</div>
        )}
        
        <div className="mt-6 px-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onOpenCatalog?.();
              }} 
              className="text-blue-600 font-bold text-sm underline hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              לקטלוג המסכים המלא
            </button>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white bg-blue-500"></div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">פותח ע״י יחידת שחר</div>
        </div>
      </div>
    </aside>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
    <div className="px-2 pt-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
);

interface SubItem {
  id: string;
  label: string;
  statusColor?: string;
  isActive?: boolean;
}

interface SidebarItemProps {
    icon: React.ReactNode; 
    label: string; 
    active?: boolean;
    expandable?: boolean;
    subItems?: SubItem[];
    initialExpanded?: boolean;
    onClick?: () => void;
    onSubItemClick?: (id: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
    icon, 
    label, 
    active = false, 
    expandable = false,
    subItems,
    initialExpanded = false,
    onClick,
    onSubItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handleMainClick = () => {
    if (expandable) setIsExpanded(!isExpanded);
    if (onClick) onClick();
  };

  return (
    <div className="space-y-1">
      <div 
        onClick={handleMainClick}
        className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
          <span className={`text-sm font-semibold`}>{label}</span>
        </div>
        {expandable && (
          isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronLeft className="w-4 h-4 text-slate-400" />
        )}
      </div>
      
      {expandable && isExpanded && subItems && (
        <div className="mr-6 border-r border-slate-100 pr-2 space-y-1">
          {subItems.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => onSubItemClick?.(sub.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all cursor-pointer ${sub.isActive ? 'bg-blue-50/50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
               <div className="flex items-center gap-3">
                 <div 
                    className="w-3 h-2 rounded-sm" 
                    style={{ backgroundColor: sub.statusColor || '#cbd5e1' }}
                 />
                 <span className="text-xs font-semibold">{sub.label}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
