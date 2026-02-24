
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, Type, Bold, Palette, AlignRight, AlignCenter, AlignLeft, Info, BarChart2, TrendingUp } from 'lucide-react';
import { DashboardComponent, ComponentType } from '../types';

interface AddComponentModalProps {
  onClose: () => void;
  onSubmit: (comp: DashboardComponent) => void;
  initialData?: DashboardComponent;
}

const RECENT_UNITS = [
  "פד״ם / אוגדה 162 / חטיבה 401",
  "פד״ם / אוגדה 162 / חטיבה 7",
  "פצ״ן / אוגדה 36 / חטיבה 188",
  "פצ״ן / אוגדה 91",
  "פד״ם / אוגדה 252"
];

const AddComponentModal: React.FC<AddComponentModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [step, setStep] = useState(initialData ? 2 : 1);
  const [selectedType, setSelectedType] = useState<ComponentType>(initialData?.type || 'vehicle_readiness');
  const [isRecentUnitsOpen, setIsRecentUnitsOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [compName, setCompName] = useState(initialData?.title || '');
  const [selectedUnit, setSelectedUnit] = useState(initialData?.unit || 'פד״ם / אוגדה 162');
  const [thresholdRed, setThresholdRed] = useState(initialData?.thresholds?.red || 55);
  const [thresholdOrange, setThresholdOrange] = useState(initialData?.thresholds?.orange || 77);

  const [textColor, setTextColor] = useState(initialData?.config?.textColor || '#1e293b');
  const [textAlign, setTextAlign] = useState<any>(initialData?.config?.textAlign || 'right');

  // Load initial content ONLY ONCE to prevent React from wiping user edits on state changes
  useEffect(() => {
    if (step === 2 && editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [step]); // Only trigger when we move to step 2

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const applyStyle = (command: string, value: any = null) => {
    // Focus first to ensure the selection is active
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
  };

  const handleSave = () => {
    // Read the HTML directly from the DOM to capture user edits
    const content = selectedType === 'free_text' ? editorRef.current?.innerHTML : undefined;
    
    onSubmit({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      type: selectedType,
      title: compName || (selectedType === 'vehicle_readiness' ? 'כשירות כלים' : selectedType === 'free_text' ? 'הערת מפקד' : 'התפתחות כשירות'),
      unit: selectedUnit,
      filters: initialData?.filters || (selectedType === 'free_text' ? [] : ['טנקים']),
      thresholds: selectedType === 'free_text' ? undefined : { red: thresholdRed, orange: thresholdOrange },
      content: content,
      config: { 
        textColor, 
        textAlign,
        isBold: false 
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white border-b border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">
            {step === 1 ? 'בחירת סוג רכיב' : `הגדרת רכיב: ${selectedType === 'free_text' ? 'טקסט חופשי' : 'נתוני כשירות'}`}
          </h2>
          <div className="w-5" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <ComponentOption 
                title="כשירות כלים" 
                description="אחוז ומספר כשירות הכלים לפי יחידה"
                selected={selectedType === 'vehicle_readiness'}
                onClick={() => setSelectedType('vehicle_readiness')}
                preview={<div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full border-4 border-green-500 border-t-slate-200 flex items-center justify-center text-[8px] font-bold">80%</div><BarChart2 className="w-6 h-6 text-blue-500" /></div>}
              />
              <ComponentOption 
                title="טקסט חופשי / הערה" 
                description="כתיבת הנחיות, דגשים או הערות מפקד מעוצבות"
                selected={selectedType === 'free_text'}
                onClick={() => setSelectedType('free_text')}
                preview={<div className="flex flex-col gap-1 w-full"><div className="h-1.5 w-full bg-blue-100 rounded" /><div className="h-1.5 w-3/4 bg-blue-100 rounded" /><div className="h-1.5 w-1/2 bg-blue-100 rounded" /></div>}
              />
              <ComponentOption 
                title="התפתחות צפי כשירות" 
                description="גרף עמודות המציג צפי כשירות לפי זמנים"
                selected={selectedType === 'readiness_development'}
                onClick={() => setSelectedType('readiness_development')}
                preview={<div className="flex items-end gap-1 h-6"><div className="w-2 bg-red-400 h-1/2 rounded-t-sm" /><div className="w-2 bg-green-400 h-full rounded-t-sm" /><div className="w-2 bg-green-500 h-3/4 rounded-t-sm" /></div>}
              />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-4">
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 text-sm text-right">שם הרכיב (כותרת)</label>
                <input 
                  type="text" 
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="למשל: דגשים לבוקר / הערת מפקד"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-right shadow-sm font-bold"
                />
              </div>

              {selectedType === 'free_text' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">
                      <Info className="w-3 h-3" /> סמן טקסט כדי לעצב אותו
                    </div>
                    <label className="block font-bold text-slate-700 text-sm text-right">תוכן ההערה</label>
                  </div>
                  
                  {/* Fixed ToolBar: Clicking here doesn't overwrite text anymore */}
                  <div className="bg-slate-50 border border-slate-200 border-b-0 rounded-t-xl p-2 flex items-center justify-end gap-2">
                     <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
                        <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded hover:bg-slate-50 ${textAlign === 'left' ? 'bg-slate-100 text-blue-600' : 'text-slate-500'}`}><AlignLeft className="w-4 h-4" /></button>
                        <button onClick={() => setTextAlign('center')} className={`p-1.5 rounded hover:bg-slate-50 ${textAlign === 'center' ? 'bg-slate-100 text-blue-600' : 'text-slate-500'}`}><AlignCenter className="w-4 h-4" /></button>
                        <button onClick={() => setTextAlign('right')} className={`p-1.5 rounded hover:bg-slate-50 ${textAlign === 'right' ? 'bg-slate-100 text-blue-600' : 'text-slate-500'}`}><AlignRight className="w-4 h-4" /></button>
                     </div>
                     <div className="w-px h-6 bg-slate-200 mx-1" />
                     <button 
                        onMouseDown={(e) => { e.preventDefault(); applyStyle('bold'); }} 
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-black shadow-sm"
                     >
                        <Bold className="w-4 h-4" />
                     </button>
                     <div className="relative group">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: textColor }} />
                          <Palette className="w-4 h-4 text-slate-500" />
                        </button>
                        <input 
                          type="color" 
                          value={textColor} 
                          onChange={(e) => { 
                            setTextColor(e.target.value); 
                            applyStyle('foreColor', e.target.value); 
                          }} 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                     </div>
                  </div>

                  {/* The actual editor - NO dangerouslySetInnerHTML here to avoid React resets */}
                  <div 
                    ref={editorRef}
                    contentEditable
                    dir="rtl"
                    className="w-full min-h-[180px] p-5 bg-white border border-slate-200 rounded-b-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-right shadow-inner overflow-y-auto"
                    style={{ textAlign: textAlign }}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Metric configurations (Readiness, Development) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setIsRecentUnitsOpen(!isRecentUnitsOpen)} className="text-[10px] text-blue-600 font-bold hover:underline">
                        {isRecentUnitsOpen ? 'סגור היסטוריה' : 'בחירה מהיסטוריה'}
                      </button>
                      <label className="block font-bold text-slate-700 text-sm">צו ארגון (Unit)</label>
                    </div>
                    {isRecentUnitsOpen && (
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-2 mb-2 grid grid-cols-1 gap-1">
                        {RECENT_UNITS.map(u => (
                          <button key={u} onClick={() => { setSelectedUnit(u); setIsRecentUnitsOpen(false); }} className="text-right text-[11px] font-bold p-2 hover:bg-white rounded transition-colors text-slate-600">
                            {u}
                          </button>
                        ))}
                      </div>
                    )}
                    <input type="text" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none text-right" />
                  </div>
                  
                  <div className="space-y-12 pt-6">
                    <label className="block font-bold text-slate-700 text-sm text-right">מדרגי כשירות (Thresholds)</label>
                    <div className="relative px-2">
                        <div className="flex h-10 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-1">
                           <div className="h-full bg-red-500/80 rounded-l" style={{ width: `${thresholdRed}%` }} />
                           <div className="h-full bg-orange-500/80 mx-0.5" style={{ width: `${thresholdOrange - thresholdRed}%` }} />
                           <div className="h-full bg-green-500/80 rounded-r flex-1" />
                        </div>
                        <input type="range" min="0" max="100" value={thresholdRed} onChange={(e) => setThresholdRed(parseInt(e.target.value))} className="absolute -top-6 right-0 w-full h-2 bg-transparent appearance-none cursor-pointer accent-red-600" />
                        <input type="range" min="0" max="100" value={thresholdOrange} onChange={(e) => setThresholdOrange(parseInt(e.target.value))} className="absolute top-12 right-0 w-full h-2 bg-transparent appearance-none cursor-pointer accent-orange-500" />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                          <span>כשיר</span>
                          <span>{thresholdOrange}% (כתום)</span>
                          <span>{thresholdRed}% (אדום)</span>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
           {step === 2 && !initialData && (
             <button onClick={handleBack} className="text-slate-500 hover:text-slate-700 font-bold text-sm">חזור לבחירה</button>
           )}
           <div className="mr-auto flex items-center gap-4">
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm px-4">ביטול</button>
             <button 
               onClick={step === 1 ? handleNext : handleSave}
               className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
             >
               {step === 1 ? 'המשך' : 'שמור רכיב'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ComponentOption = ({ title, description, selected, onClick, preview }: any) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${
      selected ? 'border-blue-500 bg-blue-50/30 ring-4 ring-blue-500/10 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
    }`}
  >
    <div className={`p-4 rounded-xl w-full h-20 flex items-center justify-center border border-slate-100 bg-slate-50 transition-colors`}>
      {preview}
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-[10px] text-slate-400 leading-relaxed px-2">{description}</p>
    </div>
  </div>
);

export default AddComponentModal;
