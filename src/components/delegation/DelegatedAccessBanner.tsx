import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Lock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Crown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { PastorDelegation } from '../../types';
import { AddToHomeScreenModal } from '../common/AddToHomeScreenModal';

interface DelegatedAccessBannerProps {
  delegation: PastorDelegation;
  activeTab: string;
  onNavigateAuthorizedTab: (tabId: string) => void;
  onExitDelegation?: () => void;
}

export const DelegatedAccessBanner: React.FC<DelegatedAccessBannerProps> = ({
  delegation,
  activeTab,
  onNavigateAuthorizedTab,
  onExitDelegation,
}) => {
  const [showAddToHomeModal, setShowAddToHomeModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] text-white border-b-2 border-[#C59A27] px-3.5 py-2.5 sm:px-6 sm:py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Info */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="Logo Vases Connect"
                className="w-10 h-10 rounded-2xl object-cover border-2 border-[#E5B22F] bg-[#0A3D36] shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C59A27] rounded-full border border-white flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-slate-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-[10px] font-black uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-[#E5B22F]" />
                  <span>Accès Cloisonné Délégué par le Pasteur</span>
                </span>
                <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-amber-200">
                  {delegation.codeAccesCourt}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-black text-white mt-0.5">
                <span>{delegation.titreRole}</span>
                {delegation.nomBeneficiaire && (
                  <span className="text-amber-200 font-normal hidden sm:inline">
                    • {delegation.nomBeneficiaire}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* BOUTON CLÉ : AJOUTER À L'ÉCRAN D'ACCUEIL AVEC LOGO VASES CONNECT */}
            <button
              onClick={() => setShowAddToHomeModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#d4a92c] hover:to-[#f0c246] text-[#062722] font-black px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#062722]" />
              <span>Ajouter à l'écran (App)</span>
            </button>

            {onExitDelegation && (
              <button
                onClick={onExitDelegation}
                title="Quitter la vue cloisonnée"
                className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab navigation within authorized portions */}
        {delegation.ongletsAutorises.length > 1 && (
          <div className="max-w-7xl mx-auto pt-2.5 mt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            <span className="text-[10px] font-bold text-amber-200/90 uppercase tracking-wider shrink-0 mr-1">
              Vos Portions Autorisées :
            </span>
            {delegation.ongletsAutorises.map((tabId) => {
              const isActive = activeTab === tabId;
              const tabLabels: Record<string, string> = {
                accueil: 'Accueil',
                presence_culte: 'Pointage Présences',
                familles_honneur: 'Familles d’Honneur',
                tribus: 'Tribus',
                coeur_honneur: 'Cœur d’Honneur',
                portes: 'Portes d’Influence',
                membres: 'Membres',
                market: 'Marketplace',
                opportunites: 'Opportunités',
                evenements: 'Programmes',
                mon_profil: 'Mon Profil',
                pastor: 'Espace Pastoral (Délégué)',
              };

              return (
                <button
                  key={tabId}
                  onClick={() => onNavigateAuthorizedTab(tabId)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#C59A27] text-slate-950 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {tabLabels[tabId] || tabId}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Add to Home Screen */}
      {showAddToHomeModal && (
        <AddToHomeScreenModal
          isOpen={showAddToHomeModal}
          onClose={() => setShowAddToHomeModal(false)}
          customTitle={`Vases Connect • ${delegation.titreRole}`}
          customPortion={delegation.titreRole}
        />
      )}
    </>
  );
};
