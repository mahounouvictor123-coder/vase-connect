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
      if (passcode.trim() === PASTORAL_ACCESS_PASSCODE || passcode.trim().toLowerCase() === 'pasteur2026') {
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

          {/* Bouton Majeur : Retour à l'accueil pour les membres */}
          <div className="space-y-3">
            <button
              onClick={onBackToHome}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0A3D36] hover:bg-[#072a25] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-101 active:scale-98 transition-all"
            >
              <Home className="w-4 h-4 text-[#E5B22F]" />
              <span>Retourner à l'Accueil Membre</span>
            </button>

            <p className="text-[11px] text-slate-500">
              Retrouvez votre tribu, vos annonces, les événements et le pointage dominical sur l'accueil.
            </p>
          </div>

          {/* Déverrouillage réservé à la chaire pastorale */}
          <div className="pt-4 border-t border-slate-100">
            {!showPastorUnlock ? (
              <button
                type="button"
                onClick={() => setShowPastorUnlock(true)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Vous êtes le Pasteur Principal ? Déverrouiller la chaire</span>
              </button>
            ) : (
              <form onSubmit={handleVerifyPasscode} className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Code Pastoral Secret</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">(Code démo : 7777)</span>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Entrez le code pastoral..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A3D36] focus:outline-hidden"
                  />
                </div>

                {error && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isVerifying || !passcode.trim()}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#062722] hover:to-[#0A3D36] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isVerifying ? 'Vérification...' : 'Ouvrir l\'Espace Pasteur'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPastorUnlock(false);
                      setError(null);
                      setPasscode('');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
