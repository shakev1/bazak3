
import React, { useState, useMemo } from 'react';
import { Search, Star, List, Globe, Lock, Download, Copy, Share2, PlusCircle } from 'lucide-react';
import { Screen } from '../types';

interface ScreenCatalogProps {
  screens: Screen[];
  onSelectScreen: (id: string) => void;
  onImportScreen?: (screen: Screen) => void;
}

const ScreenCatalog: React.FC<ScreenCatalogProps> = ({ screens, onSelectScreen, onImportScreen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const allVisibleScreens = useMemo(() => {
    return screens.filter(s => s.isPublic).map(s => {
      // In a real app, logic for followed vs created would depend on user IDs
      const isFollowed = s.id === 'oshkosh-maneuver' || s.id === 'maneuver-a';
      return {
        ...s,
        owner: s.ownerName || 'לא ידוע',
        isFollowed: isFollowed,
        isUserCreated: s.ownerName === 'אני (משתמש נוכחי)'
      };
    }).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [screens, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="חפש מסך להצגה או לייבוא"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pr-14 pl-6 bg-white border-none rounded-2xl shadow-sm text-lg focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-right font-medium"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#2d333e]">קטלוג מסכים ציבוריים</h2>
              <p className="text-slate-400 text-sm mt-1">צפה במסכי משתמשים אחרים או ייבא אותם כעותק אישי</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                <Globe className="w-3 h-3 text-blue-500" />
                <span>מסכים ציבוריים בלבד</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allVisibleScreens.map((screen) => (
            <ScreenCard 
              key={screen.id} 
              screen={screen} 
              onClick={() => onSelectScreen(screen.id)}
              onImport={() => onImportScreen?.(screen)}
            />
          ))}
        </div>

        {allVisibleScreens.length === 0 && (
          <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-slate-300 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-slate-500 font-medium italic">לא נמצאו מסכים ציבוריים תואמים לחיפוש...</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ScreenCardProps {
  screen: any;
  onClick: () => void;
  onImport: () => void;
}

const ScreenCard: React.FC<ScreenCardProps> = ({ screen, onClick, onImport }) => {
  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm border ${screen.isUserCreated ? 'border-blue-200' : 'border-slate-100'} hover:shadow-xl transition-all cursor-pointer overflow-hidden group flex flex-col h-[280px]`}
    >
      {/* Created by Tag (if applicable) */}
      {screen.isUserCreated && (
        <div className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-bold py-1 px-3 text-center border-b border-blue-100">
          זהו מסך שבבעלותך
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col" onClick={onClick}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">#ID-{screen.id.substr(0, 5)}</span>
          </div>
          <div className="flex items-center gap-2">
            {!screen.isPublic && <Lock className="w-3 h-3 text-slate-300" />}
            <button 
              onClick={(e) => { e.stopPropagation(); }} 
              className="text-[#facc15] hover:scale-110 transition-transform"
            >
               {screen.isFollowed ? <Star className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: screen.color }} />
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{screen.name}</h3>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">קטגוריה:</span>
            <span className="text-slate-600 px-2 py-0.5 bg-slate-100 rounded">{screen.category}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">בעלים:</span>
            <span className="text-slate-600 truncate">{screen.owner}</span>
          </div>
        </div>
      </div>

      {/* Action Footer (Always visible for non-owned screens) */}
      {!screen.isUserCreated && (
        <div className="px-5 py-4 bg-blue-50/30 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50 transition-colors">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onImport();
            }}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            ייבוא עותק למסכים שלי
          </button>
          <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
            <Share2 className="w-4 h-4 text-slate-400" />
            <Download className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}

      {/* Ownership visual hint for my screens */}
      {screen.isUserCreated && (
         <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[11px] font-bold text-slate-400">מסך זה כבר מופיע ברשימה שלך</span>
           <List className="w-4 h-4 text-slate-300" />
         </div>
      )}

      {/* Selection Glow for hover */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-hover:bg-blue-500 transition-all duration-300" />
    </div>
  );
};

export default ScreenCatalog;
