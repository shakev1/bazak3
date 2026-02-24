
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import NewScreenModal from './components/NewScreenModal';
import ScreenView from './components/ScreenView';
import ScreenEdit from './components/ScreenEdit';
import ScreenCatalog from './components/ScreenCatalog';
import { Screen, DashboardComponent } from './types';

const INITIAL_SCREENS: Screen[] = [
  {
    id: 'user-screen-1',
    name: 'המסך האישי שלי',
    category: 'כללי',
    color: '#3b82f6',
    isPublic: false,
    allowPublicEdit: false,
    ownerName: 'אני (משתמש נוכחי)',
    components: [
      { id: 'u1-1', type: 'vehicle_readiness', title: 'כשירות אישית', unit: 'חטיבה 7', filters: [] }
    ]
  },
  {
    id: 'user-screen-2',
    name: 'מעקב אוגדתי - שלי',
    category: 'הערכת מצב',
    color: '#10b981',
    isPublic: true,
    allowPublicEdit: false,
    ownerName: 'אני (משתמש נוכחי)',
    components: []
  },
  {
    id: 'test-import-screen',
    name: 'מסך לבדיקת ייבוא (5 רכיבים)',
    category: 'בדיקות',
    color: '#f43f5e',
    isPublic: true,
    allowPublicEdit: false,
    ownerName: 'מערכת שחר - S12345',
    components: [
      { id: 't1', type: 'vehicle_readiness', title: 'כשירות טנקים', unit: 'פד״ם / אוגדה 162', filters: ['טנקים'] },
      { id: 't2', type: 'vehicle_readiness', title: 'כשירות נגמ״שים', unit: 'פצ״ן / אוגדה 36', filters: ['נגמשים'] },
      { id: 't3', type: 'readiness_development', title: 'התפתחות כשירות שבועית', unit: 'פד״ם / אוגדה 162 / חטיבה 401', filters: [] },
      { id: 't4', type: 'vehicle_readiness', title: 'כשירות משאיות', unit: 'פצ״ן / אוגדה 91', filters: ['לוגיסטיקה'] },
      { id: 't5', type: 'vehicle_readiness', title: 'כשירות ג׳יפים', unit: 'פד״ם / אוגדה 252', filters: ['ניוד'] },
    ]
  },
  {
    id: 'padam-screen',
    name: 'המסך של פד״ם',
    category: 'הערכת מצב',
    color: '#facc15',
    isPublic: true,
    allowPublicEdit: false,
    ownerName: 'אמיתי כפיר - S99999',
    components: [
      { id: '1', type: 'vehicle_readiness', title: 'כשירות רק״ם עיקרי', unit: 'פד״ם', filters: ['טנקים'] },
      { id: '2', type: 'vehicle_readiness', title: 'כשירות רק״ם עיקרי', unit: 'פד״ם', filters: ['טנקים'] },
      { id: '3', type: 'vehicle_readiness', unit: 'אוגדה 162', title: 'טנקים חטיבה 35', filters: ['חטיבה 35'] },
      { id: '4', type: 'vehicle_readiness', title: 'כשירות רק״ם עיקרי', unit: 'פד״ם', filters: ['טנקים'] },
      { id: '5', type: 'readiness_development', title: 'התפתחות כשירות', unit: 'פד״ם', filters: [] },
      { id: '6', type: 'vehicle_readiness', title: 'כשירות רק״ם עיקרי', unit: 'פד״ם', filters: ['טנקים'] },
    ]
  },
  {
    id: 'oshkosh-maneuver',
    name: 'אושקוש בתמרון',
    category: 'אושקושים',
    color: '#facc15',
    isPublic: true,
    allowPublicEdit: true,
    ownerName: 'גידי גוב - S92234',
    components: []
  }
];

const App: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>(INITIAL_SCREENS);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
  // Temporal state for components while editing - used by both ScreenEdit and Header
  const [editComponents, setEditComponents] = useState<DashboardComponent[]>([]);

  // Modals and selection states
  const [isNewScreenModalOpen, setIsNewScreenModalOpen] = useState(false);
  const [importPreFillData, setImportPreFillData] = useState<Partial<Screen> | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);
  const [newlyImportedIds, setNewlyImportedIds] = useState<string[]>([]);

  // Selective Import Refinement State
  const [isRefiningSelective, setIsRefiningSelective] = useState(false);
  const [componentsToRefine, setComponentsToRefine] = useState<DashboardComponent[]>([]);
  const [selectiveTargetId, setSelectiveTargetId] = useState<string | null>(null);

  const activeScreen = useMemo(() => {
    if (!activeScreenId) return undefined;
    return screens.find(s => s.id === activeScreenId);
  }, [screens, activeScreenId]);

  // Sync editComponents when entering edit mode
  useEffect(() => {
    if (isEditMode && activeScreen) {
      setEditComponents(activeScreen.components || []);
    }
  }, [isEditMode, activeScreenId]);

  const handleCreateScreen = (name: string, category: string, color: string, isPublic: boolean, allowPublicEdit: boolean, sourceComponents?: DashboardComponent[]) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const components = sourceComponents ? sourceComponents.map(c => ({
      ...c,
      id: Math.random().toString(36).substr(2, 9)
    })) : [];
    const newScreen: Screen = { id: newId, name, category, color, isPublic, allowPublicEdit, ownerName: 'אני (משתמש נוכחי)', components };
    setScreens(prev => [...prev, newScreen]);
    setActiveScreenId(newId);
    setIsEditMode(false);
    setIsNewScreenModalOpen(false);
    setImportPreFillData(null);
    setIsCatalogOpen(false);
    if (sourceComponents && sourceComponents.length > 0) {
      setNewlyImportedIds(components.map(c => c.id));
      setTimeout(() => setNewlyImportedIds([]), 4000);
    }
  };

  const handleTriggerFullImport = (screen: Screen) => {
    setImportPreFillData({ name: `עותק של ${screen.name}`, category: screen.category, color: screen.color, components: screen.components });
    setIsNewScreenModalOpen(true);
  };

  const finalizeSelectiveImport = (refinedList: DashboardComponent[], targetId: string) => {
    const newGenIds: string[] = [];
    setScreens(prev => prev.map(s => {
      if (s.id === targetId) {
        const newComponents = refinedList.map(c => {
          const newId = Math.random().toString(36).substr(2, 9);
          newGenIds.push(newId);
          return { ...c, id: newId };
        });
        return { ...s, components: [...s.components, ...newComponents] };
      }
      return s;
    }));
    setIsSelectionMode(false);
    setSelectedComponentIds([]);
    setIsRefiningSelective(false);
    setComponentsToRefine([]);
    setSelectiveTargetId(null);
    setActiveScreenId(targetId);
    setNewlyImportedIds(newGenIds);
    setTimeout(() => setNewlyImportedIds([]), 4000);
  };

  const handleImportSelectedComponents = (targetScreenId: string, shouldRefine: boolean) => {
    if (!activeScreen) return;
    const selected = activeScreen.components.filter(c => selectedComponentIds.includes(c.id));
    
    if (shouldRefine) {
      setComponentsToRefine(selected);
      setSelectiveTargetId(targetScreenId);
      setIsRefiningSelective(true);
    } else {
      finalizeSelectiveImport(selected, targetScreenId);
    }
  };

  const handleUpdateScreen = (updatedScreen: Screen) => {
    setScreens(prev => prev.map(s => s.id === updatedScreen.id ? updatedScreen : s));
    setIsEditMode(false);
  };

  const handleHeaderSave = () => {
    if (activeScreen) {
      // CRITICAL: Always use editComponents state which is updated by ScreenEdit
      handleUpdateScreen({ ...activeScreen, components: editComponents });
    }
  };

  const handleSelectScreen = (id: string) => {
    setActiveScreenId(id);
    setIsEditMode(false);
    setIsCatalogOpen(false);
    setIsSelectionMode(false);
    setSelectedComponentIds([]);
  };

  const handleOpenCatalog = () => {
    setIsCatalogOpen(true);
    setActiveScreenId(null);
    setIsEditMode(false);
    setIsSelectionMode(false);
  };

  const handleSelectDashboard = () => {
    setActiveScreenId(null);
    setIsEditMode(false);
    setIsCatalogOpen(false);
    setIsSelectionMode(false);
  };

  const userOwnedScreens = useMemo(() => screens.filter(s => s.ownerName === 'אני (משתמש נוכחי)'), [screens]);
  const sharedScreens = useMemo(() => screens.filter(s => s.ownerName !== 'אני (משתמש נוכחי)'), [screens]);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen text-right" dir="rtl">
      <Sidebar 
        isOpen={true} 
        screens={userOwnedScreens} 
        sharedScreens={sharedScreens}
        activeScreenId={activeScreenId}
        onSelectScreen={handleSelectScreen}
        onSelectDashboard={handleSelectDashboard}
        onAddScreen={() => setIsNewScreenModalOpen(true)}
        onOpenCatalog={handleOpenCatalog}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {isCatalogOpen ? (
          <ScreenCatalog 
            screens={screens} 
            onSelectScreen={handleSelectScreen}
            onImportScreen={handleTriggerFullImport}
          />
        ) : activeScreenId === null ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#2d333e] mb-2">מבט על מערכתי</h1>
              <p className="text-slate-500 font-medium">תמונת מצב כשירות אחזקתית בזמן אמת</p>
            </div>
            <Dashboard />
          </>
        ) : activeScreen ? (
          <>
            <Header 
              activeScreen={activeScreen}
              isEditMode={isEditMode}
              isSelectionMode={isSelectionMode}
              selectedCount={selectedComponentIds.length}
              onEdit={() => setIsEditMode(true)}
              onSave={handleHeaderSave}
              onImportFull={() => handleTriggerFullImport(activeScreen)}
              onToggleSelection={() => setIsSelectionMode(!isSelectionMode)}
              onCancelSelection={() => {
                setIsSelectionMode(false);
                setSelectedComponentIds([]);
              }}
              onImportToScreen={handleImportSelectedComponents}
              availableScreens={userOwnedScreens}
            />
            
            {isEditMode ? (
              <ScreenEdit 
                screen={activeScreen} 
                components={editComponents}
                setComponents={setEditComponents}
                onSave={(updated) => handleUpdateScreen(updated)}
                onCancel={() => setIsEditMode(false)}
              />
            ) : (
              <ScreenView 
                screen={activeScreen}
                isSelectionMode={isSelectionMode}
                selectedComponentIds={selectedComponentIds}
                newlyImportedIds={newlyImportedIds}
                onToggleComponentSelection={(id) => {
                  setSelectedComponentIds(prev => 
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                  );
                }}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-slate-400 font-bold italic">
            בחר מסך מהתפריט הצידי כדי לצפות בנתונים
          </div>
        )}
      </main>

      {isNewScreenModalOpen && (
        <NewScreenModal 
          onClose={() => {
            setIsNewScreenModalOpen(false);
            setImportPreFillData(null);
          }}
          onSubmit={handleCreateScreen}
          preFillData={importPreFillData}
        />
      )}

      {isRefiningSelective && (
        <NewScreenModal
          onClose={() => {
            setIsRefiningSelective(false);
            setComponentsToRefine([]);
            setSelectiveTargetId(null);
          }}
          isRefiningOnly={true}
          componentsToRefine={componentsToRefine}
          onRefinementComplete={(refined) => {
            if (selectiveTargetId) {
              finalizeSelectiveImport(refined, selectiveTargetId);
            }
          }}
          onSubmit={() => {}} // Not used in refinement mode
        />
      )}
    </div>
  );
};

export default App;
