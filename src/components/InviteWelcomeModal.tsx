import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Mail,
  User,
  Crown,
  Heart,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserProfile, TribeId, Role } from '../types';
import { INITIAL_TRIBES } from '../data/tribesData';

interface InviteWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  defaultEmail?: string;
}

export const InviteWelcomeModal: React.FC<InviteWelcomeModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultEmail = 'siloestore44@gmail.com',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedTribe, setSelectedTribe] = useState<TribeId>('juda');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = (customEmail?: string, customFirst?: string, customLast?: string) => {
    setIsSigningIn(true);
    const finalEmail = customEmail || email || 'membre.vases@gmail.com';
    const computedFirstName = customFirst || firstName.trim() || finalEmail.split('@')[0].split('.')[0] || 'Fidèle';
    const computedLastName = customLast || lastName.trim() || 'Vases';

    setTimeout(() => {
      const newUser: UserProfile = {
        id: 'usr-gmail-' + Date.now(),
        email: finalEmail,
        phone: '+225 01 00 00 00 00',
        phonePublic: false,
        addressPublic: false,
        proInfoPublic: true,
        firstName: computedFirstName.charAt(0).toUpperCase() + computedFirstName.slice(1),
        lastName: computedLastName.toUpperCase(),
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        profession: 'Membre Vases d\'Honneur',
        bio: 'Bienvenue dans la communauté Vases d\'Honneur. Connecté via Google / Gmail.',
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        skills: ['Engagement Chrétien', 'Entraide'],
        activities: ['Membre de Tribu', 'Culte Dominical'],
        departmentId: 'jeunesse',
        departmentName: 'Communauté des Vases',
        availableForOpportunities: true,
        availableForMissions: true,
        status: 'DISPONIBLE',
        role: 'MEMBRE', // STRICTEMENT MEMBRE : Aucun accès à l'Espace Pasteur
        tribeId: selectedTribe,
        completionScore: 90,
        createdAt: new Date().toISOString(),
      };

      setIsSigningIn(false);
      onLoginSuccess(newUser);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95">
        {/* Bannière d'Accueil de l'Invité */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] p-6 sm:p-8 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F] shadow-lg mb-3">
            <Sparkles className="w-7 h-7 text-[#E5B22F]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#E5B22F] text-[11px] font-black uppercase tracking-wider mb-2">
            <span>🕊️ Vous êtes Invité(e)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Bienvenue sur Vases Connect
          </h3>

          <p className="text-xs text-emerald-100/90 mt-1 max-w-md mx-auto">
            La plateforme fraternelle de la communauté Vases d'Honneur. Connectez-vous avec votre compte <strong>Gmail</strong> pour rejoindre votre tribu et pointer vos présences.
          </p>
        </div>

        {/* Corps d'Authentification Gmail */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Note de Bienvenue & Sécurité */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Espace Membre Protégé</p>
              <p className="text-[11px] text-slate-500">
                Votre connexion avec Gmail active votre compte membre personnel. L'espace de la chaire pastorale reste strictement réservé à la direction de l'église.
              </p>
            </div>
          </div>

          {/* Bouton Majeur Google Officiel */}
          <button
            type="button"
            disabled={isSigningIn}
            onClick={() => handleGoogleSignIn(email)}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
          >
            {/* SVG Officiel Google */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {isSigningIn ? 'Connexion avec Google en cours...' : `Continuer avec Google (${email})`}
            </span>
          </button>

          {/* Déclencheur pour personnaliser son compte */}
          {!showManualForm ? (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowManualForm(true)}
                className="text-xs text-[#0A3D36] hover:underline font-bold"
              >
                ✏️ Utiliser une autre adresse Gmail ou préciser mon Nom
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Adresse Gmail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: David"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Kouamé"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Votre Tribu d'appartenance
                </label>
                <select
                  value={selectedTribe}
                  onChange={(e) => setSelectedTribe(e.target.value as TribeId)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                >
                  {INITIAL_TRIBES.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tribu {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleGoogleSignIn(email, firstName, lastName)}
                className="w-full py-2.5 bg-[#0A3D36] hover:bg-[#072a25] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Valider et me connecter
              </button>
            </div>
          )}

          {/* Option invité observateur */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Première visite ?</span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Découvrir en mode invité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
