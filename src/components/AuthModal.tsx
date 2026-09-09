import React, { useState, useEffect } from 'react';
import { Phone, KeyRound, ArrowRight, CheckCircle2, X, Sparkles, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

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
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'ONBOARDING'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('+229 97 12 34 56');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('778899');
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');

  // Onboarding fields for new user
  const [onbFirstName, setOnbFirstName] = useState('');
  const [onbLastName, setOnbLastName] = useState('');
  const [onbProfession, setOnbProfession] = useState('');
  const [onbCity, setOnbCity] = useState('Cotonou');
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

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 8) {
      setErrorMessage('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setErrorMessage('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomOtp);
    setOtpCode(randomOtp); // Pre-fill for instant frictionless demo testing
    setTimer(30);
    setStep('OTP');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedCode && otpCode !== '123456' && otpCode !== '778899') {
      setErrorMessage('Code OTP invalide. Veuillez vérifier le code reçu par SMS.');
      return;
    }

    // Check if phone matches an existing member
    const existing = availableMembers.find(m => m.phone.replace(/\s+/g, '') === phoneNumber.replace(/\s+/g, ''));
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
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      profession: onbProfession || 'Membre de l\'église',
      bio: 'Membre engagé au sein de la communauté Vases d\'Honneur.',
      city: onbCity || 'Cotonou',
      country: 'Bénin',
      skills: onbSkills.split(',').map(s => s.trim()).filter(Boolean),
      activities: onbActivities.split(',').map(a => a.trim()).filter(Boolean),
      departmentId: 'jeunesse',
      departmentName: onbDepartment,
      availableForOpportunities: true,
      availableForMissions: true,
      status: 'DISPONIBLE',
      role: 'MEMBRE',
      completionScore: 85,
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (member: UserProfile) => {
    onLoginSuccess(member);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-4 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex justify-between items-start pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-[#C59A27] uppercase tracking-wider">
              Identification Sécurisée
            </span>
            <h3 className="font-black text-lg text-[#0A3D36]">
              {step === 'PHONE' && 'Connexion par Téléphone'}
              {step === 'OTP' && 'Vérification du code SMS'}
              {step === 'ONBOARDING' && 'Création de votre Profil'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: PHONE NUMBER */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Sur <strong>Vases Connect</strong>, aucun mot de passe complexe ni email n'est requis. Votre numéro de téléphone est votre identifiant unique.
            </p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+229 97 00 00 00"
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

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ou connexion rapide en 1 clic (Comptes de test) :
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {availableMembers.slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(m)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img src={m.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-xs text-slate-800">
                        {m.firstName} {m.lastName} ({m.profession.split(' ')[0]})
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">{m.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900">
              <p className="font-semibold">Code SMS de test généré : <strong>{generatedCode}</strong></p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                (Pré-rempli automatiquement pour votre confort de test).
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Code à 6 chiffres</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 text-center tracking-widest text-lg font-mono bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Renvoyer le code dans : <strong>{timer}s</strong></span>
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleSendOTP}
                className="font-semibold text-[#0A3D36] disabled:opacity-40"
              >
                Renvoyer SMS
              </button>
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

        {/* STEP 3: ONBOARDING FOR NEW MEMBER */}
        {step === 'ONBOARDING' && (
          <form onSubmit={handleFinishOnboarding} className="space-y-3 text-xs">
            <p className="text-slate-600">
              Bienvenue ! Renseignez vos compétences pour que l'Assistant Vases puisse valoriser vos talents au sein de l'église.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={onbFirstName}
                  onChange={(e) => setOnbFirstName(e.target.value)}
                  placeholder="Ex: David"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={onbLastName}
                  onChange={(e) => setOnbLastName(e.target.value)}
                  placeholder="Ex: Mensah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Profession / Métier *</label>
              <input
                type="text"
                required
                value={onbProfession}
                onChange={(e) => setOnbProfession(e.target.value)}
                placeholder="Ex: Développeur, Couturière, Designer..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Compétences clés (séparées par virgules) *</label>
              <input
                type="text"
                required
                value={onbSkills}
                onChange={(e) => setOnbSkills(e.target.value)}
                placeholder="Ex: React, Photoshop, Excel, Pâtisserie..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ville de résidence</label>
              <input
                type="text"
                value={onbCity}
                onChange={(e) => setOnbCity(e.target.value)}
                placeholder="Cotonou"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Département dans l'église</label>
              <select
                value={onbDepartment}
                onChange={(e) => setOnbDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="Jeunesse (Génération Impact)">Jeunesse (Génération Impact)</option>
                <option value="Département des Hommes (Gédéons)">Département des Hommes (Gédéons)</option>
                <option value="Département des Femmes (Vertueuses)">Département des Femmes (Vertueuses)</option>
                <option value="Chorale & Louange (Sons Célestes)">Chorale & Louange</option>
                <option value="Média & Production">Média & Production</option>
                <option value="Accueil & Protocole">Accueil & Protocole</option>
                <option value="Technique & Sonorisation">Technique & Sonorisation</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>Valider mon adhésion à Vases Connect</span>
              <CheckCircle2 className="w-4 h-4 text-[#C59A27]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
