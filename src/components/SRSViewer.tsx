import React, { useEffect, useRef, useState } from 'react';
import { SRSSection } from '../types';
import { Edit3, Check, X, MessageSquare, Share2, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SRSViewerProps {
  sections: SRSSection[];
  onSectionVisible: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<SRSSection>) => void;
}

const SectionNode: React.FC<{
  section: SRSSection;
  onSectionVisible: (id: string) => void;
  onUpdateSection: (id: string, updates: Partial<SRSSection>) => void;
  observer: React.MutableRefObject<IntersectionObserver | null>;
}> = ({ section, onSectionVisible, onUpdateSection, observer }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      observer.current?.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.current?.unobserve(sectionRef.current);
      }
    };
  }, [section.id, observer]);

  const handleStartEdit = () => {
    setEditingId(section.id);
    setEditValue(section.content);
  };

  const handleSaveEdit = () => {
    onUpdateSection(section.id, { content: editValue });
    setEditingId(null);
  };

  // Mock status based on ID for visual variety
  const getStatus = () => {
    if (section.id.includes('fr')) return { label: 'Verified', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' };
    if (section.id.includes('nfr')) return { label: 'In Review', icon: Clock, color: 'text-amber-500 bg-amber-50' };
    if (section.id.includes('risk')) return { label: 'Critical', icon: AlertCircle, color: 'text-rose-500 bg-rose-50' };
    return { label: 'Draft', icon: Edit3, color: 'text-zinc-400 bg-zinc-50' };
  };

  const status = getStatus();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      ref={sectionRef}
      id={section.id}
      className="scroll-mt-24 mb-12 group relative"
    >
      {/* Decorative Line for Hierarchy */}
      {section.level > 1 && (
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-zinc-100 group-hover:bg-emerald-200 transition-colors" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1 ">
          <div className="flex items-center gap-3 ">
            <h2 className={` tracking-tight group-hover:text-emerald-500 transition-colors ${section.level === 1 ? 'text-2xl' : 'text-xl'
              }`}>
              {section.title}
            </h2>
            <span className={` items-center gap-1 px-2 py-0.5 rounded-full text-[10px]   tracking-wider ${status.color}`}>
              <status.icon size={10} />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
            <span>Last edit: 2h ago</span>
            <span>•</span>
            <span>Author: System</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          <button onClick={handleStartEdit} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors" title="Edit Section">
            <Edit3 size={16} />
          </button>
          <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors" title="Add Comment">
            <MessageSquare size={16} />
          </button>

        </div>
      </div>

      <div className="relative">
        {editingId === section.id ? (
          <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-inner">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full min-h-[120px] bg-transparent font-serif text-lg leading-relaxed focus:outline-none resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingId(null)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors shadow-sm"
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-serif text-lg whitespace-pre-wrap pl-1 border-l-2 border-transparent group-hover:border-emerald-100 transition-colors duration-500">
            {section.content}
          </div>
        )}
      </div>

      {section.children && section.children.length > 0 && (
        <div className="mt-12 space-y-12">
          {section.children.map(child => (
            <SectionNode
              key={child.id}
              section={child}
              onSectionVisible={onSectionVisible}
              onUpdateSection={onUpdateSection}
              observer={observer}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export const SRSViewer: React.FC<SRSViewerProps> = ({ sections, onSectionVisible, onUpdateSection }) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            onSectionVisible(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.2, 0.5]
      }
    );

    return () => observer.current?.disconnect();
  }, [onSectionVisible]);

  return (
    <main className="flex-1 h-full overflow-y-auto bg-white scroll-smooth selection:bg-emerald-100 relative">
      {/* Reading Progress Indicator */}
      <div className="sticky top-0 left-0 right-0 h-1 bg-zinc-100 z-40">
        <motion.div
          className="h-full bg-emerald-500 origin-left"
          style={{ scaleX: 0 }} // This would need scroll progress logic, keeping as visual placeholder
        />
      </div>

      <div className="max-w-4xl mx-auto py-24 px-16">
        <header className="mb-24 relative">
          <div className="absolute -left-12 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest">Official Document</span>
            <span className="text-zinc-400 text-xs font-mono">ID: RM-NFT-2026</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-6 leading-none">
            SRS
          </h1>
          <div className="flex items-center gap-6 text-sm text-zinc-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-200" />
              <span>Project: NFT Marketplace</span>
            </div>
            <span>•</span>
            <span>v1.0.0</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> Mar 11, 2026</span>
          </div>
        </header>

        <div className="space-y-24">
          {sections.map((section) => (
            <SectionNode
              key={section.id}
              section={section}
              onSectionVisible={onSectionVisible}
              onUpdateSection={onUpdateSection}
              observer={observer}
            />
          ))}
        </div>
        <footer className="mt-48 pt-12 border-t border-zinc-100 flex items-center justify-between text-zinc-400 text-xs font-mono">
          <span>© 2026 Roadmap Editor Pro</span>
          <div className="flex gap-4">
            <button className="hover:text-zinc-900 transition-colors">Privacy</button>
            <button className="hover:text-zinc-900 transition-colors">Terms</button>
            <button className="hover:text-zinc-900 transition-colors">Support</button>
          </div>
        </footer>


      </div>
    </main>
  );
};

