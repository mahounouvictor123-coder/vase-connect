import React from 'react';
import { Home, Users2, Sparkles, ShoppingBag, User, Shield, Calendar, Heart, Crown } from 'lucide-react';
import { PastorDelegation } from '../types';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAssistant?: () => void;
  activeDelegation?: PastorDelegation | null;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAssistant,
  activeDelegation,
}) => {
  const handleAssistant = () => {
    if (onOpenAssistant) {
      onOpenAssistant();
    } else {
      onSelectTab('assistant');
    }
  };

  // If a delegation is active, customize mobile items based on authorized portions
  if (activeDelegation) {
    const authorized = activeDelegation.ongletsAutorises;

    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#C59A27]/60 px-2 py-1 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {authorized.slice(0, 5).map((tabId) => {
            const isCurrent = activeTab === tabId;
            let Icon = Shield;
            let label = tabId;

            if (tabId === 'accueil') {
              Icon = Home;
              label = 'Accueil';
            } else if (tabId === 'presence_culte') {
              Icon = Calendar;
              label = 'Présences';
            } else if (tabId === 'coeur_honneur') {
              Icon = Heart;
              label = 'Cœur d’Honneur';
            } else if (tabId === 'tribus') {
              Icon = Crown;
              label = 'Tribus';
            } else if (tabId === 'membres') {
              Icon = Users2;
              label = 'Membres';
            } else if (tabId === 'pastor') {
              Icon = Shield;
              label = 'Délégué';
            }

            return (
              <button
                key={tabId}
                onClick={() => onSelectTab(tabId)}
                className={`flex flex-col items-center py-1.5 px-2 transition-colors ${
                  isCurrent ? 'text-[#0A3D36] font-black' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#C59A27]' : ''}`} />
                <span className="text-[10px] mt-0.5 truncate max-w-[65px]">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* 1. Accueil */}
        <button
          onClick={() => onSelectTab('accueil')}
          className={`flex flex-col items-center py-1.5 px-2 transition-colors ${
            activeTab === 'accueil' ? 'text-[#0A3D36] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Accueil</span>
        </button>

        {/* 2. Annuaire Talents & Communauté */}
        <button
          onClick={() => onSelectTab('membres')}
          className={`flex flex-col items-center py-1.5 px-2 transition-colors ${
            activeTab === 'membres' || activeTab === 'feed' || activeTab === 'communaute'
              ? 'text-[#0A3D36] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Annuaire</span>
        </button>

        {/* 3. ASSISTANT IA — PROMINENT RAISED GOLD BUTTON */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={handleAssistant}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C59A27] via-[#E5B22F] to-[#F3D079] text-[#062722] p-0.5 shadow-lg shadow-[#C59A27]/40 flex items-center justify-center transform active:scale-90 transition-transform border-2 border-white ring-4 ring-[#0A3D36]/10"
            aria-label="Assistant Vases IA"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0A3D36] to-[#135E54] flex items-center justify-center text-amber-300">
              <Sparkles className="w-7 h-7 text-[#E5B22F] animate-pulse" />
            </div>
          </button>
          <span className="text-[9.5px] font-extrabold text-[#0A3D36] uppercase tracking-wider mt-1">
            Assistant IA
          </span>
        </div>

        {/* 4. Vases Market */}
        <button
          onClick={() => onSelectTab('market')}
          className={`flex flex-col items-center py-1.5 px-2 transition-colors ${
            activeTab === 'market' ? 'text-[#0A3D36] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Market</span>
        </button>

        {/* 5. Mon Profil */}
        <button
          onClick={() => onSelectTab('profil')}
          className={`flex flex-col items-center py-1.5 px-2 transition-colors ${
            activeTab === 'profil' ? 'text-[#0A3D36] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>
      </div>
    </div>
  );
};
