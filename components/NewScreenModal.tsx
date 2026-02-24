
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, Plus, Globe, Lock, Shield, Users, Download, ArrowRight, ArrowLeft, Trash2, Settings2, Eye, Filter, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { Screen, DashboardComponent } from '../types';

interface NewScreenModalProps {
  onClose: () => void;
  onSubmit: (name: string, category: string, color: string, isPublic: boolean, allowPublicEdit: boolean, sourceComponents?: DashboardComponent[]) => void;
  preFillData?: Partial<Screen> | null;
  // If we are just refining components for an existing screen
  isRefiningOnly?: boolean;
  componentsToRefine?: DashboardComponent[];
  onRefinementComplete?: (components: DashboardComponent[]) => void;
}

const EXISTING_CATEGORIES = ["הערכת מצב", "אושקושים", "כללי", "לוגיסטיקה", "מבצעי"];

const RECENT_UNITS = [
  "פד״ם / אוגדה 162 / חטיבה 401",
  "פד״ם / אוגדה 162 / חטיבה 7",
  "פצ״ן / אוגדה 36 / חטיבה 188",
  "פצ״ן / אוגדה 91",
  "פד״ם / אוגדה 252",
];

const NewScreenModal: React.FC<NewScreenModalProps> = ({ 
  onClose, 
  onSubmit, 
  preFillData, 
  isRefiningOnly = false,
  componentsToRefine = [],
  onRefinementComplete
}) => {
  const isImport = !!preFillData || isRefiningOnly;
  const sourceComponents = isRefiningOnly ? componentsToRefine : (preFillData?.components || []);
  
  // Step 1: Metadata (Skipped if isRefiningOnly)
  const [step, setStep] = useState(isRefiningOnly ? 2 : 1);
  const [screenName, setScreenName] = useState(preFillData?.name || '');
  const [categoryQuery, setCategoryQuery] = useState(preFillData?.category || '');
  const [selectedColor, setSelectedColor] = useState(preFillData?.color || '#000000');
  const [isPublic, setIsPublic] = useState(preFillData?.isPublic ?? false);
  const [allowPublicEdit, setAllowPublicEdit] = useState(preFillData?.allowPublicEdit ?? false);
  const [shouldRefineUnits, setShouldRefineUnits] = useState(isRefiningOnly);
  
  // Step 2: Refinement state
  const [refinementIndex, setRefinementIndex] = useState(0);
  const [refinedComponents, setRefinedComponents] = useState<DashboardComponent[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isRecentUnitsOpen, setIsRecentUnitsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === 2 && refinedComponents.length === 0) {
      setRefinedComponents(JSON.parse(JSON.stringify(sourceComponents)));
    }
  }, [step, sourceComponents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    return EXISTING_CATEGORIES.filter(cat => 
      cat.toLowerCase().includes(categoryQuery.toLowerCase())
    );
  }, [categoryQuery]);

  const handleInitialSubmit = () => {
    if (isImport && shouldRefineUnits && sourceComponents.length > 0) {
      setStep(2);
    } else {
      onSubmit(screenName, categoryQuery, selectedColor, isPublic, allowPublicEdit, sourceComponents);
    }
  };

  const handleFinalSubmit = () => {
    if (isRefiningOnly && onRefinementComplete) {
      onRefinementComplete(refinedComponents);
    } else {
      onSubmit(screenName, categoryQuery, selectedColor, isPublic, allowPublicEdit, refinedComponents);
    }
  };

  const currentComp = refinedComponents[refinementIndex];

  const updateCurrentComp = (updates: Partial<DashboardComponent>) => {
    const next = [...refinedComponents];
    next[refinementIndex] = { ...next[refinementIndex], ...updates };
    setRefinedComponents(next);
  };

  const deleteCurrentComp = () => {
    const next = refinedComponents.filter((_, i) => i !== refinementIndex);
    setRefinedComponents(next);
    if (refinementIndex >= next.length && next.length > 0) {
      setRefinementIndex(next.length - 1);
    } else if (next.length === 0) {
       if (isRefiningOnly && onRefinementComplete) onRefinementComplete([]);
       else onSubmit(screenName, categoryQuery, selectedColor, isPublic, allowPublicEdit, []);
    }
  };

  if (step === 2) {
    const thresholdRed = currentComp?.thresholds?.red || 55;
    const thresholdOrange = currentComp?.thresholds?.orange || 77;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between sticky top-0 z-10">
            {!isRefiningOnly ? (
              <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[10px] font-bold">
                <ArrowRight className="w-3.5 h-3.5" /> חזור להגדרות
              </button>
            ) : <div className="w-10" />}
            <div className="text-center">
               <h2 className="text-sm font-bold text-slate-800">
                 {isRefiningOnly ? 'דיוק רכיבים לייבוא' : 'עדכון נתוני ייבוא'}
               </h2>
               <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                 רכיב {refinementIndex + 1} מתוך {refinedComponents.length}
               </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-1 bg-slate-100 w-full overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((refinementIndex + 1) / refinedComponents.length) * 100}%` }} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
             {currentComp ? (
               <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                  {/* EDITABLE SECTION - Top */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-r-4 border-blue-500 pr-3">
                      <Settings2 className="w-5 h-5 text-blue-500" />
                      <h3 className="text-sm font-bold text-slate-800">נתוני עריכה</h3>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-right text-xs font-bold text-slate-500">שם הרכיב החדש</label>
                        <input 
                            type="text" value={currentComp.title} onChange={(e) => updateCurrentComp({ title: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-right font-bold shadow-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <button onClick={() => setIsRecentUnitsOpen(!isRecentUnitsOpen)} className="flex items-center gap-1 text-[10px] text-blue-500 font-bold hover:underline">
                            <Clock className="w-3 h-3" /> {isRecentUnitsOpen ? 'סגור היסטוריה' : 'בחירה מהיסטוריה'}
                          </button>
                          <label className="block text-right text-xs font-bold text-slate-500">צו ארגון יעד (Unit Hierarchy)</label>
                        </div>
                        {isRecentUnitsOpen && (
                          <div className="bg-slate-50 rounded-lg border border-slate-200 p-1 mb-2 max-h-32 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                             {RECENT_UNITS.map(u => (
                               <button key={u} onClick={() => { updateCurrentComp({ unit: u }); setIsRecentUnitsOpen(false); }} className="w-full text-right text-[10px] font-bold px-3 py-1.5 hover:bg-white rounded transition-colors text-slate-600 border-b border-slate-100 last:border-0">
                                 {u}
                               </button>
                             ))}
                          </div>
                        )}
                        <div className="relative group">
                            <input type="text" value={currentComp.unit} onChange={(e) => updateCurrentComp({ unit: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-right font-medium shadow-sm pl-10" />
                            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                  </div>

                  {/* IDENTIFICATION SECTION - Bottom (Read Only) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-inner">
                     <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Eye className="w-4 h-4" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">נתוני מקור לזיהוי (צפייה בלבד)</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                           סוג: {currentComp.type === 'vehicle_readiness' ? 'כשירות' : 'התפתחות'}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <span className="block text-right text-[10px] font-bold text-slate-400">סננים מקוריים:</span>
                           <div className="flex flex-wrap justify-end gap-1.5">
                              {currentComp.filters.length > 0 ? currentComp.filters.map(f => (
                                 <span key={f} className="bg-white border border-slate-100 text-slate-600 px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1 shadow-sm">
                                    <Filter className="w-2.5 h-2.5 text-blue-400" /> {f}
                                 </span>
                              )) : <span className="text-[10px] text-slate-400 italic">ללא סננים</span>}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className="block text-right text-[10px] font-bold text-slate-400">פרופיל מדרג מקורי:</span>
                           <div className="flex h-3 w-full rounded-full overflow-hidden bg-white border border-slate-200 p-0.5 shadow-sm">
                              <div className="h-full bg-[#f14336] rounded-full" style={{ width: `${thresholdRed}%` }} />
                              <div className="h-full bg-[#ff9800] rounded-full mx-0.5" style={{ width: `${thresholdOrange - thresholdRed}%` }} />
                              <div className="h-full bg-[#4caf50] rounded-full flex-1" />
                           </div>
                           <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1 uppercase tracking-tighter">
                              <span>כשיר</span><span>{thresholdOrange}%</span><span>{thresholdRed}%</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button onClick={deleteCurrentComp} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-[11px] transition-colors hover:bg-red-50 px-4 py-2 rounded-lg">
                       <Trash2 className="w-3.5 h-3.5" /> הסר מרשימת הייבוא
                    </button>
                  </div>
               </div>
             ) : null}
          </div>

          {/* Footer Navigation - Improved UX for Hebrew RTL */}
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 sticky bottom-0 backdrop-blur-sm">
             {/* Navigation Controls - RIGHT SIDE */}
             <div className="flex gap-3">
                <button 
                  disabled={refinementIndex === 0} 
                  onClick={() => setRefinementIndex(prev => prev - 1)} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                  לרכיב הקודם
                </button>
                <button 
                  disabled={refinementIndex === refinedComponents.length - 1} 
                  onClick={() => setRefinementIndex(prev => prev + 1)} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                    refinementIndex === refinedComponents.length - 1 
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  לרכיב הבא
                  <ChevronLeft className="w-4 h-4" />
                </button>
             </div>

             {/* Finalize Button - LEFT SIDE */}
             <button 
               onClick={handleFinalSubmit} 
               className="bg-blue-600 hover:bg-blue-700 text-white px-10 md:px-14 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm border-b-4 border-blue-800"
             >
               <Check className="w-4 h-4" />
               סיום ושמירת הייבוא
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 pb-2">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-slate-800">{isImport ? 'הגדרות ייבוא מסך' : 'הגדרת מסך חדש'}</h2>
              {isImport && (
                <div className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1 flex items-center gap-1">
                  <Download className="w-2.5 h-2.5" /> ייבוא עם {preFillData?.components?.length || 0} רכיבים
                </div>
              )}
            </div>
            <div className="w-5" />
        </div>

        <div className="p-10 pt-4 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-2">
                <label className="block text-right text-sm font-bold text-slate-700">שם המסך <span className="text-red-500">*</span></label>
                <input type="text" value={screenName} onChange={(e) => setScreenName(e.target.value)} placeholder="הכנס שם למסך המיובא" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right" />
            </div>

            <div className="space-y-2" ref={dropdownRef}>
                <label className="block text-right text-sm font-bold text-slate-700">קטגוריה <span className="text-red-500">*</span></label>
                <div className="relative">
                    <input type="text" value={categoryQuery} onFocus={() => setIsCategoryDropdownOpen(true)} onChange={(e) => { setCategoryQuery(e.target.value); setIsCategoryDropdownOpen(true); }} placeholder="הכנס קטגוריה" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-right pr-4 pl-10" />
                    <ChevronDown className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    {isCategoryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredCategories.map((cat) => (
                          <button key={cat} className="w-full text-right px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between group" onClick={() => { setCategoryQuery(cat); setIsCategoryDropdownOpen(false); }}>
                            <span className="text-slate-700">{cat}</span>
                            {categoryQuery === cat && <Check className="w-3 h-3 text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
            </div>

            {isImport && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <input type="checkbox" id="refine-units" checked={shouldRefineUnits} onChange={(e) => setShouldRefineUnits(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                       <label htmlFor="refine-units" className="text-sm font-bold text-slate-700 cursor-pointer">עדכון צווי ארגון לרכיבים בייבוא</label>
                    </div>
                    <Settings2 className="w-4 h-4 text-slate-400" />
                 </div>
                 <p className="text-[10px] text-slate-400 text-right font-medium">בחירה באפשרות זו תאפשר לך לעבור על כל רכיב במסך ולעדכן לו יחידה, שם או למחוק אותו לפני יצירת המסך.</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                    <label className="block text-right text-sm font-bold text-slate-700">פרטיות מסך</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setIsPublic(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${!isPublic ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Lock className="w-3 h-3" /> פרטי</button>
                        <button onClick={() => setIsPublic(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${isPublic ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Globe className="w-3 h-3" /> ציבורי</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-right text-sm font-bold text-slate-700">הרשאות עריכה</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setAllowPublicEdit(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${!allowPublicEdit ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Shield className="w-3 h-3" /> בעלים</button>
                        <button onClick={() => setAllowPublicEdit(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${allowPublicEdit ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Users className="w-3 h-3" /> כולם</button>
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 group">
                      <span className="text-xs font-mono text-slate-500 select-all uppercase">{selectedColor}</span>
                      <div className="relative cursor-pointer">
                        <div className="w-10 h-6 rounded border border-white/20 shadow-sm" style={{ backgroundColor: selectedColor }} />
                        <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                  </div>
                  <label className="text-sm font-bold text-slate-700">צבע מזהה</label>
              </div>
            </div>
        </div>

        <div className="p-6 pt-0 flex justify-center border-t border-slate-50 mt-4 bg-white">
            <button onClick={handleInitialSubmit} disabled={!screenName || !categoryQuery} className="bg-[#2d333e] hover:bg-[#1a1e26] text-white font-bold py-2.5 px-16 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isImport ? (shouldRefineUnits ? 'המשך לעריכת רכיבים' : 'בצע ייבוא סופי') : 'שמירה'}
                {isImport && shouldRefineUnits && <ArrowLeft className="w-4 h-4" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewScreenModal;
