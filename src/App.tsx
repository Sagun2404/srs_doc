import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { SRSViewer } from './components/SRSViewer';
import { AIChat } from './components/AIChat';
import { INITIAL_SRS_DATA } from './constants';
import { SRSSection } from './types';

export default function App() {
  const [sections, setSections] = useState<SRSSection[]>(INITIAL_SRS_DATA);
  const [activeSectionId, setActiveSectionId] = useState(INITIAL_SRS_DATA[0].id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAIChatCollapsed, setIsAIChatCollapsed] = useState(false);

  const handleSectionVisible = useCallback((id: string) => {
    setActiveSectionId(id);
  }, []);

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionId(id);
    }
  };

  const updateRecursive = (list: SRSSection[], id: string, updates: Partial<SRSSection>): SRSSection[] => {
    return list.map(section => {
      if (section.id === id) {
        return { ...section, ...updates };
      }
      if (section.children) {
        return { ...section, children: updateRecursive(section.children, id, updates) };
      }
      return section;
    });
  };

  const handleUpdateSection = (id: string, updates: Partial<SRSSection>) => {
    setSections(prev => updateRecursive(prev, id, updates));
  };

  return (
    <div className="flex flex-col h-screen w-full  bg-parchment/95 backdrop-blur-sm border-b border-warm-stone/10 overflow-hidden font-sans text-zinc-900 antialiased">
      {/* Top Header */}
      <header className="h-14 border-b  bg-parchment/95 backdrop-blur-sm border-b border-warm-stone/10 flex items-center justify-between px-6 z-30 ">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sage-teal rounded-lg flex items-center justify-center text-white font-bold text-xs">
            SRS
          </div>
          <h1 className="font-bold text-sm tracking-tight">Srs Editor</h1>

        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(sections, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'roadmap-document.json';
              a.click();
            }}
            className="btn-primary"
          >
            Export JSON
          </button>
          <button className="btn-primary">
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Navigation */}
        <Sidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Pane: Document Viewer */}
        <SRSViewer
          sections={sections}
          onSectionVisible={handleSectionVisible}
          onUpdateSection={handleUpdateSection}
        />

        {/* Right Pane: AI Chat */}
        <AIChat
          isCollapsed={isAIChatCollapsed}
          onToggleCollapse={() => setIsAIChatCollapsed(!isAIChatCollapsed)}
        />
      </div>
    </div>
  );
}
