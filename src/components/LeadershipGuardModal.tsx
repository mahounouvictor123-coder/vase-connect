import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Crown,
  Award,
  Home,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  LeadershipAccount,
  LeadershipCategory,
  verifyLeadershipPasscode,
  INITIAL_LEADERSHIP_ACCOUNTS,
} from '../data/leadershipData';

interface LeadershipGuardModalProps {
  category: LeadershipCategory;
  title: string;
  targetName?: string;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUnlocked: (account: LeadershipAccount) => void;
  onOpenCreateReport?: () => void;
}

export const LeadershipGuardModal: React.FC<LeadershipGuardModalProps> = ({
  category,
  title,
  targetName,
  currentUser,
  onClose,
  onUnlocked,
  onOpenCreateReport,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Suggested demo hint
  const getDemoHint = () => {
    switch (category) {
      case 'PASTEUR':
        return 'Code Pasteur Démo : 7777';
      case 'CHEF_TRIBU':
        return 'Code Démo Chef de Tribu : 1201 (Ruben), 1204 (Juda) ou 1212';
      case 'BERGER_FAMILLE':
        return 'Code Démo Berger : 3301 (Fidjrossè) ou 3333 (Tous Bergers)';
      case 'CHEF_DEPARTEMENT':
        return 'Code Démo Responsable : 5501 (Com), 5502 (Louange) ou 5555';
      case 'RESPONSABLE_PORTE':
        return 'Code Démo Pilote Porte : 4001 à 4012 (selon la porte) ou 1212';
      default:
        return 'Code secret requis';
    }
  };

  const getIcon = () => {
    switch (category) {
      case 'CHEF_TRIBU':
        return <Crown className="w-8 h-8 text-[#E5B22F]" />;
      case 'BERGER_FAMILLE':
        return <Home className="w-8 h-8 text-[#E5B22F]" />;
      case 'CHEF_DEPARTEMENT':
        return <Award className="w-8 h-8 text-[#E5B22F]" />;
      case 'RESPONSABLE_PORTE':
        return <Sparkles className="w-8 h-8 text-[#E5B22F]" />;
      case 'PASTEUR':
      default:
        return <BookOpen className="w-8 h-8 text-[#E5B22F]" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      const verified = verifyLeadershipPasscode(passcode, category);
      setIsVerifying(false);

      if (verified) {
        onUnlocked(verified);
      } else {
        setError(
          'Code d\'accès incorrect. Cet espace est strictement restreint au responsable établi.'
        );
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] p-6 text-white relative">
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-[#C59A27]/40 flex items-center justify-center shadow-inner">
              {getIcon()}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
              <span>Espace Restreint & Sécurisé</span>
            </div>

            <h3 className="text-xl font-black text-white">{title}</h3>

            {targetName && (
              <p className="text-xs text-amber-200/90 font-medium">
                {targetName}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-left">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Lock className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Protection par Mot de Passe Obligatoire</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pour garantir que seuls les responsables légitimes accèdent aux fiches confidentielles, saisissez votre code secret ci-dessous.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Mot de passe / Code d'accès</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {getDemoHint()}
                </span>
              </div>

              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A3D36] focus:outline-hidden"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={isVerifying || !passcode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#135E54] hover:to-[#0A3D36] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-[#C59A27]" />
                <span>{isVerifying ? 'Vérification...' : 'Déverrouiller l\'Espace'}</span>
              </button>

              {onOpenCreateReport && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateReport();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] border border-[#C59A27]/50 text-xs font-black flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#C59A27]" />
                  <span>Rédiger & Envoyer un Rapport au Pasteur</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors text-center block"
              >
                Fermer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
