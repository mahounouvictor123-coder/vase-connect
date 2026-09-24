import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Church,
  Home,
  Crown
} from 'lucide-react';
import { UserProfile } from '../../types';
import { PASTORAL_ACCESS_PASSCODE, PASTOR_USER_PROFILE } from '../../data/pastorData';
import { getPastorCustomPasscode } from '../../data/leadershipData';

interface PastorAccessGuardProps {
  currentUser: UserProfile | null;
  onBackToHome: () => void;
  onPastorUnlocked: (pastorUser: UserProfile) => void;
}

export const PastorAccessGuard: React.FC<PastorAccessGuardProps> = ({
  currentUser,
  onBackToHome,
  onPastorUnlocked,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPastorUnlock, setShowPastorUnlock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      const customCode = getPastorCustomPasscode();
      const entered = passcode.trim();
      if (
        entered === customCode ||
        entered === PASTORAL_ACCESS_PASSCODE ||
        entered.toLowerCase() === 'pasteur2026'
      ) {
        setIsVerifying(false);
        onPastorUnlocked(PASTOR_USER_PROFILE);
      } else {
        setIsVerifying(false);
        setError('Code pastoral incorrect. Cet espace est strictement restreint.');
      }
    }, 400);
  };

  const isMember = currentUser && currentUser.role !== 'PASTEUR';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-center animate-in fade-in zoom-in-95">
        {/* En-tête de Sécurité Majestueuse */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] p-8 text-white relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C59A27]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-[#C59A27]/40 flex items-center justify-center text-[#E5B22F] shadow-inner">
              <Lock className="w-8 h-8 text-[#E5B22F]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-[11px] font-black uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Accès Strictement Restreint</span>
            </div>

            <h2 className="text-2xl font-black text-white">
              Espace Réservé au Pasteur Principal
            </h2>

            <p className="text-xs text-emerald-100/90 max-w-sm">
              Chaire Pastorale • Rapports Confidentiels • Direction Spirituelle
            </p>
          </div>
        </div>

        {/* Corps d'Explication & Sécurité */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Protection de la confidentialité de l'Église</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Bien-aimé(e), pour des raisons de confidentialité pastorale et de protection des fidèles,
              <strong className="text-slate-900"> aucun membre de la communauté n'a accès à l'Espace Pasteur</strong>.
              Cet espace est strictement dédié à la direction de l'église (statistiques globales des cultes, boîte de rapports, suivi d'assiduité des brebis).
            </p>
          </div>

          {/* Statut Utilisateur Courant */}
          {isMember && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.firstName}
                  className="w-10 h-10 rounded-full object-cover border border-[#C59A27]"
                />
                <div>
                  <p className="text-xs font-black text-slate-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {currentUser.email || currentUser.phone || 'Membre de l\'église'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black uppercase">
                {currentUser.role}
              </span>
            </div>
          )}

          {/* Formulaire direct de Déverrouillage réservé à la chaire pastorale */}
          <div className="pt-2 border-t border-slate-100">
            <form onSubmit={handleVerifyPasscode} className="space-y-3.5 text-left bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#C59A27]" />
                  <span>Mot de Passe / Code Pastoral</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  (Code démo : <strong>7777</strong>)
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Saisissez votre code confidentiel (7777)..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#0A3D36] focus:outline-hidden shadow-xs"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || !passcode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#062722] hover:to-[#0A3D36] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 hover:scale-101 active:scale-98"
              >
                <Crown className="w-4 h-4 text-[#E5B22F]" />
                <span>{isVerifying ? 'Vérification en cours...' : 'Déverrouiller l\'Espace Pasteur'}</span>
              </button>
            </form>
          </div>

          {/* Bouton pour les membres : Retour à l'accueil */}
          <div className="pt-2">
            <button
              onClick={onBackToHome}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Je suis un fidèle / membre — Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
