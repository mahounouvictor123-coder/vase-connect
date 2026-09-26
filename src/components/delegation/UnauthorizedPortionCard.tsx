import React from 'react';
import { Shield, Lock, ArrowLeft, Crown } from 'lucide-react';
import { PastorDelegation } from '../../types';

interface UnauthorizedPortionCardProps {
  delegation: PastorDelegation;
  attemptedTab: string;
  onReturnToAuthorized: (tabId: string) => void;
}

export const UnauthorizedPortionCard: React.FC<UnauthorizedPortionCardProps> = ({
  delegation,
  attemptedTab,
  onReturnToAuthorized,
}) => {
  const firstAuthorized = delegation.ongletsAutorises[0] || 'accueil';

  return (
    <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-5 animate-in zoom-in-95">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner border-2 border-rose-300">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black uppercase">
          <Shield className="w-3.5 h-3.5 text-rose-600" />
          <span>Section Non Autorisée dans votre Portion Déléguée</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Accès Strictement Cloisonné
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Le Pasteur Principal a restreint votre accès dédié au rôle de :{' '}
          <strong className="text-[#0A3D36]">{delegation.titreRole}</strong>.
          La section demandée (<code className="text-rose-600 font-mono font-bold">{attemptedTab}</code>) ne fait pas partie de vos prérogatives pastorales autorisées.
        </p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
        <p className="font-bold text-slate-700">Vos Portions Autorisées :</p>
        <div className="flex flex-wrap gap-1.5">
          {delegation.ongletsAutorises.map((tab) => (
            <span
              key={tab}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs"
            >
              ✓ {tab}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onReturnToAuthorized(firstAuthorized)}
        className="py-3 px-6 bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4 text-[#E5B22F]" />
        <span>Retourner à ma Portion Autorisée ({firstAuthorized})</span>
      </button>
    </div>
  );
};
