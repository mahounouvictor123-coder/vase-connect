import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface FloatingBackButtonProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const FloatingBackButton: React.FC<FloatingBackButtonProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (activeTab === 'accueil') {
      setShowButton(false);
      return;
    }

    const checkScroll = () => {
      // Show when scrolled down a bit, or always show on secondary tabs
      if (window.scrollY > 120) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    return () => window.removeEventListener('scroll', checkScroll);
  }, [activeTab]);

  if (activeTab === 'accueil' || !showButton) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <button
        onClick={() => {
          onSelectTab('accueil');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0A3D36] hover:bg-[#135E54] text-white shadow-xl hover:shadow-2xl border-2 border-[#C59A27] text-xs font-black transition-all hover:scale-105 active:scale-95 group"
        title="Retourner à l'accueil"
        aria-label="Retourner à l'accueil"
      >
        <ArrowLeft className="w-4 h-4 text-[#E5B22F] group-hover:-translate-x-0.5 transition-transform" />
        <Home className="w-3.5 h-3.5 text-amber-200" />
        <span>Accueil</span>
      </button>
    </div>
  );
};
