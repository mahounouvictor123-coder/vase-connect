import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Mail,
  User,
  Crown,
  Briefcase,
  MapPin,
  Home,
  Church,
  ArrowRight,
  ShieldCheck,
  Phone,
  X,
} from 'lucide-react';
import {
  UserProfile,
  TribeId,
  InfluenceGateId,
  FamilleHonneur,
  DepartmentItem,
  TribeInfo,
} from '../types';
import { INITIAL_TRIBES } from '../data/tribesData';
import { INITIAL_DEPARTMENTS_DATA } from '../data/departmentsData';
import { INITIAL_FAMILLES_HONNEUR } from '../data/famillesHonneurData';
import { INFLUENCE_GATES } from '../data/influenceGatesData';
import {
  detectInfluenceGate,
  matchFamilleHonneur,
  GRAND_COTONOU_QUARTIERS,
  SUGGESTED_PROFESSIONS,
} from '../utils/memberAffiliationUtils';
import { RegisterAffiliationData } from './AuthModal';

interface InviteWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterMember?: (
    user: UserProfile,
    affiliation: RegisterAffiliationData
  ) => void;
  defaultEmail?: string;
  tribes?: TribeInfo[];
  departments?: DepartmentItem[];
  famillesHonneur?: FamilleHonneur[];
}

export const InviteWelcomeModal: React.FC<InviteWelcomeModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterMember,
  defaultEmail = 'siloestore44@gmail.com',
  tribes = INITIAL_TRIBES,
  departments = INITIAL_DEPARTMENTS_DATA,
  famillesHonneur = INITIAL_FAMILLES_HONNEUR,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+229 97 00 11 22');
  const [profession, setProfession] = useState('Développeur Web & Mobile');
  const [selectedTribe, setSelectedTribe] = useState<TribeId>('juda');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('communication');
  const [quartier, setQuartier] = useState('Fidjrossè Plage / Akogbato');
  const [customQuartier, setCustomQuartier] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Détection de la porte en temps réel
  const detectedGateResult = useMemo(() => {
    return detectInfluenceGate(profession);
  }, [profession]);

  const effectiveGate = useMemo(() => {
    return INFLUENCE_GATES.find(g => g.id === detectedGateResult.gateId) || INFLUENCE_GATES[0];
  }, [detectedGateResult.gateId]);

  // 2. Détection de la Famille d'Honneur en temps réel
  const effectiveQuartier = quartier === 'AUTRE' ? customQuartier : quartier;
  const matchedFamille = useMemo(() => {
    return matchFamilleHonneur(effectiveQuartier, famillesHonneur);
  }, [effectiveQuartier, famillesHonneur]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    setErrorMessage('');
    setIsSigningIn(true);

    setTimeout(() => {
      const generatedId = 'usr-inv-' + Date.now();
      const finalEmail = email || `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}@gmail.com`;
      const finalQuartier = effectiveQuartier.trim() || 'Cotonou';
      const chosenDept = departments.find(d => d.id === selectedDepartment) || departments[0];

      const newUser: UserProfile = {
        id: generatedId,
        email: finalEmail,
        phone: phone.trim(),
        phonePublic: true,
        addressPublic: false,
        proInfoPublic: true,
        firstName: firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1),
        lastName: lastName.trim().toUpperCase(),
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        profession: profession.trim(),
        bio: `Membre invité sur Vases Connect. Profession : ${profession.trim()} • Quartier : ${finalQuartier}.`,
        city: 'Cotonou',
        country: 'Bénin',
        skills: [profession.trim(), 'Engagement Fraternel'],
        activities: [chosenDept.name, `Tribu ${selectedTribe}`],
        departmentId: selectedDepartment,
        departmentName: chosenDept.name,
        availableForOpportunities: true,
        availableForMissions: true,
        status: 'DISPONIBLE',
        role: 'MEMBRE',
        tribeId: selectedTribe,
        tribeRole: 'MEMBRE',
        influenceGates: [effectiveGate.id],
        gateProfiles: {
          [effectiveGate.id]: {
            id: 'gp-' + generatedId,
            userId: generatedId,
            gateId: effectiveGate.id,
            memberName: `${firstName.trim()} ${lastName.trim().toUpperCase()}`,
            memberProfession: profession.trim(),
            memberPhoto:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            memberPhone: phone.trim(),
            memberCity: 'Cotonou',
            memberCountry: 'Bénin',
            roleInGate: 'Professionnel / Cadre',
            subSector: effectiveGate.keySubSectors[0] || profession.trim(),
            visionImpact: `Membre inscrit via invitation dans la Porte ${effectiveGate.name}.`,
            skills: [profession.trim()],
            seekingCollaboration: true,
            openForMentoring: true,
            whatsappContact: phone.trim(),
            emailContact: finalEmail,
            registeredAt: new Date().toISOString().split('T')[0],
          },
        },
        quartier: finalQuartier,
        familleHonneurId: matchedFamille?.id,
        completionScore: 92,
        createdAt: new Date().toISOString(),
      };

      const affiliation: RegisterAffiliationData = {
        tribeId: selectedTribe,
        departmentId: selectedDepartment,
        detectedGateId: effectiveGate.id,
        familleHonneurId: matchedFamille?.id,
      };

      if (onRegisterMember) {
        onRegisterMember(newUser, affiliation);
      } else {
        onLoginSuccess(newUser);
      }

      setIsSigningIn(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95 my-auto max-h-[95vh] flex flex-col">
        {/* Bannière d'Accueil de l'Invité */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] p-5 sm:p-6 text-white relative text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F] shadow-lg mb-2">
            <Sparkles className="w-6 h-6 text-[#E5B22F]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#E5B22F] text-[11px] font-black uppercase tracking-wider mb-1">
            <span>🕊️ Vous êtes Invité(e)</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white">
            Bienvenue sur Porte des Cieux
          </h3>
          <p className="text-xs text-emerald-100/90 mt-0.5 max-w-md mx-auto">
            Remplissez votre fiche pour être affecté(e) automatiquement à votre <strong>Porte d'Influence</strong>, votre <strong>Tribu</strong>, votre <strong>Département</strong> et votre <strong>Famille d'Honneur</strong>.
          </p>
        </div>

        {/* Corps d'Authentification */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              {errorMessage}
            </div>
          )}

          {/* Prénom & Nom */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Prénom <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: David"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Koffi"
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>
          </div>

          {/* Téléphone & Email */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Téléphone WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+229 97 00 11 22"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Email Gmail (Optionnel)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>
            </div>
          </div>

          {/* Profession & Détection de Porte d'Influence */}
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Profession ou domaine d'activité <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              required
              list="invite-professions"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Ex: Développeur Web, Médecin, Comptable, Juriste..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
            />
            <datalist id="invite-professions">
              {SUGGESTED_PROFESSIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            <div className="p-2 rounded-xl bg-white border border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-black">
                ✨ Porte Détectée : Porte {effectiveGate.number} — {effectiveGate.name}
              </span>
            </div>
          </div>

          {/* Tribu & Département */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Tribu <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={selectedTribe}
                onChange={(e) => setSelectedTribe(e.target.value as TribeId)}
                className="w-full px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
              >
                {tribes.map((t) => (
                  <option key={t.id} value={t.id}>
                    Tribu {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Church className="w-3.5 h-3.5 text-[#0A3D36]" />
                <span>Département <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quartier & Rattachement Famille d'Honneur */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quartier de résidence <span className="text-rose-500">*</span></span>
            </label>
            <select
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900"
            >
              {GRAND_COTONOU_QUARTIERS.map((q) => (
                <option key={q.quartier} value={q.quartier}>
                  {q.quartier} → {q.familleNom}
                </option>
              ))}
              <option value="AUTRE">Autre quartier...</option>
            </select>

            {quartier === 'AUTRE' && (
              <input
                type="text"
                required
                value={customQuartier}
                onChange={(e) => setCustomQuartier(e.target.value)}
                placeholder="Votre quartier (Ex: Houéyiho, Patte d'Oie...)"
                className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900"
              />
            )}

            {matchedFamille && (
              <div className="p-2 rounded-xl bg-white border border-emerald-200 text-[11px] flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="text-slate-700">
                  Famille d'Honneur : <strong>{matchedFamille.nom}</strong> ({matchedFamille.quartier})
                </span>
              </div>
            )}
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3 bg-[#0A3D36] hover:bg-[#072a25] text-white font-bold rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 cursor-pointer"
          >
            <span>{isSigningIn ? 'Enregistrement en cours...' : 'Valider mon Inscription & Mes Affectations'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
          </button>
        </form>
      </div>
    </div>
  );
};
