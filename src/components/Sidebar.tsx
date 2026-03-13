import React from 'react';
import { SRSSection } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, PanelLeftClose, PanelLeftOpen, Hash } from 'lucide-react';

interface SidebarProps {
  sections: SRSSection[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSectionId,
  onSectionClick,
  isCollapsed,
  onToggleCollapse
}) => {
  const renderLinks = (list: SRSSection[]) => {
    return list.map((section) => (
      <React.Fragment key={section.id}>
        <li>
          <button
            onClick={() => onSectionClick(section.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group relative ${activeSectionId === section.id
              ? 'btn-primary'
              : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            style={{ paddingLeft: isCollapsed ? '0.75rem' : `${section.level * 0.75 + 0.75}rem` }}
          >
            {isCollapsed ? (
              <Hash size={16} className={activeSectionId === section.id ? 'text-sage-teal' : 'text-zinc-400'} />
            ) : (
              <>
                {section.level > 1 && <ChevronRight size={12} className={`opacity-50 ${activeSectionId === section.id ? 'text-zinc-400' : ''}`} />}
                <span className={`truncate ${activeSectionId === section.id ? 'font-medium' : 'font-normal'}`}>
                  {section.title}
                </span>
              </>
            )}

            {activeSectionId === section.id && !isCollapsed && (
              <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
            )}

            {isCollapsed && activeSectionId === section.id && (
              <div className="absolute left-0 w-1 h-4 bg-emerald-400 rounded-r-full" />
            )}
          </button>
        </li>
        {section.children && !isCollapsed && renderLinks(section.children)}
      </React.Fragment>
    ));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '64px' : '260px' }}
      className="h-full border-r border-zinc-200 bg-zinc-50 overflow-hidden flex flex-col relative z-20"
    >
      <div className="p-4 border-b border-zinc-200 bg-white flex items-center justify-between">
        {!isCollapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-widest "
          >
            Contents
          </motion.h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:text-sage-teal  "
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <ul className="space-y-1 px-2">
          {renderLinks(sections)}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-zinc-200 bg-ipfs-teal">
          <div className="text-[10px] font-body ">
            Roadmap Editor v1.0.0
          </div>
        </div>
      )}
    </motion.aside>
  );
};
