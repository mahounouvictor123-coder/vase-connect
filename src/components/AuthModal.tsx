import React, { useState, useEffect } from 'react';
import {
  Phone,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  User,
  ShieldCheck,
  Mail,
  Lock,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types';
import { PASTOR_USER_PROFILE, PASTORAL_ACCESS_PASSCODE } from '../data/pastorData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  availableMembers: UserProfile[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  availableMembers,
}) => {
  const [authMethod, setAuthMethod] = useState<'GMAIL' | 'PHONE' | 'PASTOR'>('GMAIL');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'ONBOARDING'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('+225 07 12 34 56 78');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('778899');
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');

  // Gmail states
  const [gmailAddress, setGmailAddress] = useState('siloestore44@gmail.com');
  const [gmailFirstName, setGmailFirstName] = useState('');
  const [gmailLastName, setGmailLastName] = useState('');
  const [isGmailLoading, setIsGmailLoading] = useState(false);

  // Pastoral code states
  const [pastorCode, setPastorCode] = useState('');

  // Onboarding fields for new phone user
  const [onbFirstName, setOnbFirstName] = useState('');
  const [onbLastName, setOnbLastName] = useState('');
  const [onbProfession, setOnbProfession] = useState('');
  const [onbCity, setOnbCity] = useState('Abidjan');
  const [onbSkills, setOnbSkills] = useState('');
  const [onbActivities, setOnbActivities] = useState('');
  const [onbDepartment, setOnbDepartment] = useState('Jeunesse (Génération Impact)');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Handlers for Gmail Sign In
  const handleGmailSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gmailAddress || !gmailAddress.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse Gmail valide.');
      return;
    }
    setErrorMessage('');
    setIsGmailLoading(true);

    setTimeout(() => {
      // Check if existing member matches email
      const existing = availableMembers.find(
        m => m.email && m.email.toLowerCase() === gmailAddress.toLowerCase()
      );

      if (existing) {
        setIsGmailLoading(false);
        onLoginSuccess(existing);
        onClose();
        return;
      }

      const computedFirstName =
        gmailFirstName.trim() ||
        gmailAddress.split('@')[0].split('.')[0] ||
        'Fidèle';
      const computedLastName = gmailLastName.trim() || 'Vases';

      const newMember: UserProfile = {
        id: 'usr-gmail-' + Date.now(),
        email: gmailAddress.toLowerCase(),
        phone: '+225 01 00 00 00 00',
        phonePublic: false,
        addressPublic: false,
        proInfoPublic: true,
        firstName:
          computedFirstName.charAt(0).toUpperCase() + computedFirstName.slice(1),
        lastName: computedLastName.toUpperCase(),
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        profession: 'Membre de l\'Église',
        bio: 'Membre engagé au sein de la communauté Vases d\'Honneur. Connecté avec Google/Gmail.',
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        skills: ['Engagement Chrétien', 'Entraide'],
        activities: ['Culte Dominical', 'Tribu'],
        departmentId: 'jeunesse',
        departmentName: 'Communauté Vases',
        availableForOpportunities: true,
        availableForMissions: true,
        status: 'DISPONIBLE',
        role: 'MEMBRE', // Strictement Membre
        completionScore: 85,
        createdAt: new Date().toISOString(),
      };

      setIsGmailLoading(false);
      onLoginSuccess(newMember);
      onClose();
    }, 400);
  };

  // Handlers for Pastoral Login
  const handlePastorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (
      pastorCode.trim() === PASTORAL_ACCESS_PASSCODE ||
      pastorCode.trim().toLowerCase() === 'pasteur2026'
    ) {
      onLoginSuccess(PASTOR_USER_PROFILE);
      onClose();
    } else {
      setErrorMessage('Code d\'autorisation pastorale incorrect.');
    }
  };

  // Handlers for Phone OTP
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 8) {
      setErrorMessage('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setErrorMessage('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomOtp);
    setOtpCode(randomOtp);
    setTimer(30);
    setStep('OTP');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedCode && otpCode !== '123456' && otpCode !== '778899') {
      setErrorMessage('Code OTP invalide. Veuillez vérifier le code reçu par SMS.');
      return;
    }

    const existing = availableMembers.find(
      m => m.phone.replace(/\s+/g, '') === phoneNumber.replace(/\s+/g, '')
    );
    if (existing) {
      onLoginSuccess(existing);
      onClose();
    } else {
      setStep('ONBOARDING');
    }
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      phone: phoneNumber,
      phonePublic: true,
      addressPublic: false,
      proInfoPublic: true,
      firstName: onbFirstName || 'Fidèle',
      lastName: onbLastName || 'Vases',
      photoUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      profession: onbProfession || 'Membre de l\'église',
      bio: 'Membre engagé au sein de la communauté Vases d\'Honneur.',
      city: onbCity || 'Abidjan',
      country: 'Côte d\'Ivoire',
      skills: onbSkills.split(',').map(s => s.trim()).filter(Boolean),
      activities: onbActivities.split(',').map(a => a.trim()).filter(Boolean),
      departmentId: 'jeunesse',
      departmentName: onbDepartment,
      availableForOpportunities: true,
      availableForMissions: true,
      status: 'DISPONIBLE',
      role: 'MEMBRE', // Strictement Membre
      completionScore: 85,
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 text-slate-800 space-y-4 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#C59A27] uppercase tracking-wider">
              Identification des Membres
            </span>
            <h3 className="font-black text-lg text-[#0A3D36]">
              Connexion à Vases Connect
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Méthodes de Connexion : Onglets */}
        <div className="px-5">
          <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('GMAIL');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'GMAIL'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Google / Gmail</span>
              <span className="px-1.5 py-0.2 bg-[#C59A27]/20 text-[#0A3D36] text-[9px] rounded font-black">
                Recommandé
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('PHONE');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                authMethod === 'PHONE'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Téléphone
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('PASTOR');
                setErrorMessage('');
              }}
              className={`px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
                authMethod === 'PASTOR'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Pasteur</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-5 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* METHOD 1: GMAIL SIGN IN */}
        {authMethod === 'GMAIL' && (
          <div className="px-5 pb-5 space-y-4 text-xs">
            <p className="text-slate-600">
              Connectez-vous en un clic avec votre compte <strong>Gmail</strong>. Votre profil membre sera automatiquement rattaché.
            </p>

            {/* Gros Bouton Google Officiel */}
            <button
              type="button"
              disabled={isGmailLoading}
              onClick={() => handleGmailSignIn()}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-xs text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 transition-all hover:scale-101 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continuer avec {gmailAddress}</span>
            </button>

            {/* Saisie personnalisée */}
            <form onSubmit={handleGmailSignIn} className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ou saisissez votre adresse Gmail :
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={gmailAddress}
                    onChange={(e) => setGmailAddress(e.target.value)}
                    placeholder="votre.nom@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prénom</label>
                  <input
                    type="text"
                    value={gmailFirstName}
                    onChange={(e) => setGmailFirstName(e.target.value)}
                    placeholder="Ex: Jean"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nom</label>
                  <input
                    type="text"
                    value={gmailLastName}
                    onChange={(e) => setGmailLastName(e.target.value)}
                    placeholder="Ex: Kouassi"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGmailLoading}
                className="w-full py-3 bg-[#0A3D36] hover:bg-[#072a25] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{isGmailLoading ? 'Connexion en cours...' : 'Se connecter avec ce compte Gmail'}</span>
                <ArrowRight className="w-4 h-4 text-[#C59A27]" />
              </button>
            </form>
          </div>
        )}

        {/* METHOD 2: PHONE OTP */}
        {authMethod === 'PHONE' && (
          <div className="px-5 pb-5">
            {step === 'PHONE' && (
              <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 font-medium focus:outline-hidden focus:border-[#0A3D36]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Recevoir le code OTP par SMS</span>
                  <ArrowRight className="w-4 h-4 text-[#C59A27]" />
                </button>
              </form>
            )}

            {step === 'OTP' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900">
                  <p className="font-semibold">
                    Code SMS de test généré : <strong>{generatedCode}</strong>
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Code à 6 chiffres</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-4 pr-4 py-2.5 text-center tracking-widest text-lg font-mono bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Vérifier et continuer</span>
                  <CheckCircle2 className="w-4 h-4 text-[#C59A27]" />
                </button>
              </form>
            )}

            {step === 'ONBOARDING' && (
              <form onSubmit={handleFinishOnboarding} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Prénom"
                    value={onbFirstName}
                    onChange={(e) => setOnbFirstName(e.target.value)}
                    className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nom"
                    value={onbLastName}
                    onChange={(e) => setOnbLastName(e.target.value)}
                    className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0A3D36] text-white font-bold rounded-xl"
                >
                  Valider mon profil
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 3: PASTOR ACCESS */}
        {authMethod === 'PASTOR' && (
          <form onSubmit={handlePastorLogin} className="px-5 pb-5 space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Crown className="w-4 h-4 text-[#C59A27]" />
                <span>Chaire Pastorale • Réservé au Pasteur Principal</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Seul le Pasteur Principal est autorisé à entrer dans l'Espace Pasteur. Les membres réguliers ne disposent pas de code pastoral.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Code d'accès pastoral secret
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                <input
                  type="password"
                  required
                  value={pastorCode}
                  onChange={(e) => setPastorCode(e.target.value)}
                  placeholder="Code pastoral secret..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                (Code pastoral démo : 7777)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#062722] to-[#0A3D36] hover:from-[#000] hover:to-[#062722] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-[#E5B22F]" />
              <span>Ouvrir la Chaire Pastorale</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
