import React from 'react';
import { ArrowLeft, Home, ChevronRight, Sparkles, ShoppingBag, Briefcase, Users, Store } from 'lucide-react';

interface NavigationBreadcrumbProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

const TAB_CONFIG: Record<string, { title: string; category: string; icon?: React.ReactNode }> = {
  portes: {
    title: '12 Portes d\'Influence pour Transformer une Nation — MOHAMMED SANOGO',
    category: 'Ouvrage Apostolique & Impact',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#E5B22F]" />,
  },
  assistant: {
    title: 'Assistant Intelligent Vases IA',
    category: 'Intelligence Artificielle',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#E5B22F]" />,
  },
  membres: {
    title: 'Annuaire des Talents & Membres',
    category: 'Communauté',
    icon: <Users className="w-3.5 h-3.5 text-[#0A3D36]" />,
  },
  market: {
    title: 'Vases Market & Troc',
    category: 'Boutique Solidaire',
    icon: <ShoppingBag className="w-3.5 h-3.5 text-[#0A3D36]" />,
  },
  opportunites: {
    title: 'Carrières, Emplois & Missions',
    category: 'Recrutement RH',
    icon: <Briefcase className="w-3.5 h-3.5 text-[#0A3D36]" />,
  },
  ads: {
    title: 'Espace Publicitaire & Boutiques des Membres',
    category: 'Vitrine Commerciale',
    icon: <Store className="w-3.5 h-3.5 text-[#C59A27]" />,
  },
  feed: {
    title: 'Mur Communautaire & Témoignages',
    category: 'Échanges & Entraide',
  },
  departements: {
    title: 'Départements & Ministères',
    category: 'Organisation Église',
  },
  evenements: {
    title: 'Agenda & Événements',
    category: 'Rassemblements',
  },
  profil: {
    title: 'Mon Espace Membre & Profil',
    category: 'Compte Personnel',
  },
  admin: {
    title: 'Administration & Modération',
    category: 'Gestion Pastorale',
  },
};

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  activeTab,
  onSelectTab,
}) => {
  if (activeTab === 'accueil') return null;

  const currentConfig = TAB_CONFIG[activeTab] || {
    title: activeTab,
    category: 'Page',
  };

  const handleGoHome = () => {
    onSelectTab('accueil');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Left: Prominent Back to Home Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0A3D36] via-[#0D4B42] to-[#145E54] hover:from-[#082f2a] hover:to-[#0f4b43] text-white text-xs sm:text-sm font-black shadow-sm transition-all hover:scale-102 active:scale-95 group shrink-0 border border-[#C59A27]/30"
            aria-label="Retourner à la page d'accueil"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5B22F] group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil</span>
          </button>

          {/* Breadcrumb Path */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <button
              onClick={handleGoHome}
              className="hover:text-[#0A3D36] font-semibold text-slate-600 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Accueil</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-[11px] font-medium text-slate-400">
              {currentConfig.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="font-black text-[#0A3D36] truncate max-w-[200px] md:max-w-xs">
              {currentConfig.title}
            </span>
          </div>
        </div>

        {/* Right: Quick shortcuts to other main tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {activeTab !== 'market' && (
            <button
              onClick={() => onSelectTab('market')}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0A3D36]/10 text-slate-700 hover:text-[#0A3D36] text-[11px] font-bold transition-colors shrink-0"
            >
              <ShoppingBag className="w-3 h-3 text-[#C59A27]" />
              <span>Market</span>
            </button>
          )}

          {activeTab !== 'opportunites' && (
            <button
              onClick={() => onSelectTab('opportunites')}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0A3D36]/10 text-slate-700 hover:text-[#0A3D36] text-[11px] font-bold transition-colors shrink-0"
            >
              <Briefcase className="w-3 h-3 text-blue-600" />
              <span>Emplois</span>
            </button>
          )}

          {activeTab !== 'ads' && (
            <button
              onClick={() => onSelectTab('ads')}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors shrink-0 border border-amber-200"
            >
              <Store className="w-3 h-3 text-[#C59A27]" />
              <span>Boutiques</span>
            </button>
          )}

          {activeTab !== 'assistant' && (
            <button
              onClick={() => onSelectTab('assistant')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-100 to-amber-200 text-amber-950 text-[11px] font-black transition-transform active:scale-95 shrink-0 border border-amber-300"
            >
              <Sparkles className="w-3 h-3 text-[#C59A27]" />
              <span className="hidden sm:inline">Assistant IA</span>
              <span className="sm:hidden">IA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
