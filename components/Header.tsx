
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Save, Trash2, MousePointer2, Download, Layers, Settings2 } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  activeScreen?: Screen;
  isEditMode: boolean;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onEdit: () => void;
  onSave: () => void;
  onImportFull?: () => void;
  onToggleSelection?: () => void;
  onCancelSelection?: () => void;
  onImportToScreen?: (targetId: string, shouldRefine: boolean) => void;
  availableScreens?: Screen[];
}

const Header: React.FC<HeaderProps> = ({ 
  activeScreen, 
  isEditMode, 
  isSelectionMode, 
  selectedCount = 0,
  onEdit, 
  onSave,
  onImportFull,
  onToggleSelection,
  onCancelSelection,
  onImportToScreen,
  availableScreens = []
}) => {
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState(false);
  const [shouldRefineSelected, setShouldRefineSelected] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const isOwner = activeScreen?.ownerName === 'אני (משתמש נוכחי)';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsImportMenuOpen(false);
      }
      if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
        setIsTargetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!activeScreen) return null;

  return (
    <div className="mb-8">
      <nav className="flex items-center text-xs text-slate-400 mb-4 font-medium">
        <span>צה״ל</span><span className="mx-1.5 text-slate-300">/</span><span>פד״ם</span><span className="mx-1.5 text-slate-300">/</span><span className="text-slate-600">אוגדה 162</span>
        <ChevronDown className="w-3 h-3 ml-1" />
      </nav>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <h1 className="text-4xl font-bold text-[#2d333e]">{activeScreen.name}</h1>
           {!isEditMode && !isSelectionMode && (
             <div className="flex items-center gap-2 mt-2 mr-2">
               <span className="text-slate-300 text-sm font-mono">#ID-{activeScreen.id.substring(0,6)}</span>
               {isOwner ? <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">בעלים</span> : <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">צפייה</span>}
             </div>
           )}
           {isSelectionMode && (
             <div className="mr-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-pulse">מצב בחירה: {selectedCount} רכיבים נבחרו</div>
           )}
        </div>

        <div className="flex gap-3 relative">
          {isEditMode ? (
            <>
              <button onClick={onSave} className="bg-[#2d333e] hover:bg-slate-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md">
                <Save className="w-4 h-4" /> שמירה
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md">
                <Trash2 className="w-4 h-4" /> מחיקה
              </button>
            </>
          ) : isSelectionMode ? (
            <>
              <button onClick={onCancelSelection} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition-all">ביטול</button>
              <div className="relative" ref={targetRef}>
                <button 
                  disabled={selectedCount === 0}
                  onClick={() => setIsTargetDropdownOpen(!isTargetDropdownOpen)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
                >
                  <Download className="w-4 h-4" /> ייבוא למסך...
                  <ChevronDown className={`w-4 h-4 transition-transform ${isTargetDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTargetDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">הגדרות ייבוא</span>
                          <Settings2 className="w-3 h-3 text-slate-400" />
                       </div>
                       <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={shouldRefineSelected}
                            onChange={(e) => setShouldRefineSelected(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600"
                          />
                          <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600">עדכון שמות ויחידות לפני ייבוא</span>
                       </label>
                    </div>
                    <div className="max-h-60 overflow-y-auto pt-1">
                      {availableScreens.filter(s => s.id !== activeScreen.id).map(screen => (
                        <button key={screen.id} onClick={() => { onImportToScreen?.(screen.id, shouldRefineSelected); setIsTargetDropdownOpen(false); }} className="w-full text-right px-4 py-3 text-sm font-bold hover:bg-slate-50 text-slate-700 flex items-center justify-between border-b border-slate-50 last:border-0 group">
                          <span className="truncate flex-1 group-hover:text-blue-600">{screen.name}</span>
                          <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: screen.color }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsImportMenuOpen(!isImportMenuOpen)} className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm">
                  <Download className="w-4 h-4" /> ייבוא נתונים
                  <ChevronDown className={`w-4 h-4 transition-transform ${isImportMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isImportMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={() => { onImportFull?.(); setIsImportMenuOpen(false); }} className="w-full text-right px-4 py-3 hover:bg-slate-50 group flex items-start gap-3">
                      <Layers className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-slate-700">ייבוא מסך מלא</div>
                        <div className="text-[10px] text-slate-400">יצירת עותק חדש של מסך זה עם כל רכיביו</div>
                      </div>
                    </button>
                    <div className="h-px bg-slate-50 mx-4 my-1" />
                    <button onClick={() => { onToggleSelection?.(); setIsImportMenuOpen(false); }} className="w-full text-right px-4 py-3 hover:bg-slate-50 group flex items-start gap-3">
                      <MousePointer2 className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-slate-700">ייבוא רכיבים סלקטיבי</div>
                        <div className="text-[10px] text-slate-400">בחירה ידנית של רכיבים מהמסך לייבוא למסך אחר</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              {isOwner && <button onClick={onEdit} className="bg-[#2d333e] hover:bg-slate-900 text-white px-10 py-2 rounded-lg font-bold transition-all shadow-md">עריכה</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
