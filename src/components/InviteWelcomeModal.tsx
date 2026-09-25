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
  Check,
  Layers,
  AlertCircle,
  Compass,
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
  const [customGateId, setCustomGateId] = useState<InfluenceGateId | ''>('');
  const [showGateSelector, setShowGateSelector] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState<TribeId>('juda');
  
  // Multi-sélection : 2 à 3 départements
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    departments[0]?.id || 'communication',
    departments[1]?.id || 'jeunesse',
  ]);
  
  const [quartier, setQuartier] = useState('Fidjrossè Plage / Akogbato');
  const [customQuartier, setCustomQuartier] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Détection de la porte en temps réel
  const detectedGateResult = useMemo(() => {
    return detectInfluenceGate(profession);
  }, [profession]);

  const effectiveGateId: InfluenceGateId = (customGateId || detectedGateResult.gateId) as InfluenceGateId;
  const effectiveGate = useMemo(() => {
    return INFLUENCE_GATES.find(g => g.id === effectiveGateId) || INFLUENCE_GATES[0];
  }, [effectiveGateId]);

  // 2. Détection de la Famille d'Honneur en temps réel
  const effectiveQuartier = quartier === 'AUTRE' ? customQuartier : quartier;
  const matchedFamille = useMemo(() => {
    return matchFamilleHonneur(effectiveQuartier, famillesHonneur);
  }, [effectiveQuartier, famillesHonneur]);

  // 3. Infos Tribu
  const selectedTribeInfo = useMemo(() => {
    return tribes.find(t => t.id === selectedTribe) || tribes[0];
  }, [selectedTribe, tribes]);

  if (!isOpen) return null;

  // Toggle département : autorise entre 2 et 3 départements
  const toggleDepartment = (deptId: string) => {
    setErrorMessage('');
    if (selectedDepartments.includes(deptId)) {
      if (selectedDepartments.length <= 2) {
        setErrorMessage('Vous devez choisir au minimum 2 départements de service.');
        return;
      }
      setSelectedDepartments(prev => prev.filter(id => id !== deptId));
    } else {
      if (selectedDepartments.length >= 3) {
        setErrorMessage('Vous pouvez choisir au maximum 3 départements de service.');
        return;
      }
      setSelectedDepartments(prev => [...prev, deptId]);
    }
  };

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
    if (selectedDepartments.length < 2 || selectedDepartments.length > 3) {
      setErrorMessage('Veuillez choisir entre 2 et 3 départements de service (actuellement : ' + selectedDepartments.length + ').');
      return;
    }

    setErrorMessage('');
    setIsSigningIn(true);

    setTimeout(() => {
      const generatedId = 'usr-inv-' + Date.now();
      const finalEmail = email || `${firstName.toLowerCase().trim()}.${lastName.toLowerCase().trim()}@gmail.com`;
      const finalQuartier = effectiveQuartier.trim() || 'Cotonou';
      
      const chosenDeptNames = departments
        .filter(d => selectedDepartments.includes(d.id))
        .map(d => d.name);
      const primaryDeptName = chosenDeptNames[0] || 'Département';
      const primaryDeptId = selectedDepartments[0] || 'communication';

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
        bio: `Membre inscrit via invitation fraternelle. Profession : ${profession.trim()} • Quartier : ${finalQuartier}.`,
        city: 'Cotonou',
        country: 'Bénin',
        skills: [profession.trim(), 'Engagement Fraternel'],
        activities: [...chosenDeptNames, `Tribu de ${selectedTribeInfo?.name || 'Juda'}`],
        departmentId: primaryDeptId,
        departmentName: chosenDeptNames.join(', '),
        departmentIds: selectedDepartments,
        departmentNames: chosenDeptNames,
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
        completionScore: 95,
        createdAt: new Date().toISOString(),
      };

      const affiliation: RegisterAffiliationData = {
        tribeId: selectedTribe,
        departmentId: primaryDeptId,
        departmentIds: selectedDepartments,
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95 my-auto max-h-[96vh] flex flex-col">
        {/* CARTE D'INVITATION FRATERNELLE OFFICIELLE (En-tête royal) */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#12584E] p-5 sm:p-7 text-white relative text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sceau & Bénédiction */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C59A27]/25 border border-[#C59A27]/50 text-[#E5B22F] text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
            <span>🕊️ INVITATION FRATERNELLE OFFICIELLE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Bienvenue dans la Famille Vases d'Honneur
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg mx-auto leading-relaxed">
            Vous avez reçu cette invitation pour rejoindre notre communauté. Renseignez votre fiche pour être officiellement rattaché(e) à vos <strong>4 sphères d'impact</strong>.
          </p>

          {/* 4 Piliers Visuels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-left">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-[#C59A27] font-bold block uppercase">1. Tribu</span>
              <span className="text-[11px] font-bold text-white">12 Tribus d'Israël</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-amber-300 font-bold block uppercase">2. Départements</span>
              <span className="text-[11px] font-bold text-white">2 à 3 au choix</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">3. Porte d'Influence</span>
              <span className="text-[11px] font-bold text-white">12 Portes de la Cité</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-[10px] text-teal-300 font-bold block uppercase">4. Quartier</span>
              <span className="text-[11px] font-bold text-white">Famille d'Honneur</span>
            </div>
          </div>
        </div>

        {/* Formulaire d'Inscription sous Invitation */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. NOM & PRÉNOM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nom de famille <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Kouassi"
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
              />
            </div>
          </div>

          {/* 2. NUMÉRO DE TÉLÉPHONE & EMAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Numéro de téléphone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+229 97 00 11 22"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Adresse Email (optionnelle)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. TRIBU D'APPARTENANCE (TRIBUT) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#C59A27]" />
                <span>Votre Tribu spirituelle d'appartenance <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                12 Tribus d'Israël
              </span>
            </div>

            <select
              value={selectedTribe}
              onChange={(e) => setSelectedTribe(e.target.value as TribeId)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-300/80 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
            >
              {tribes.map((t) => (
                <option key={t.id} value={t.id}>
                  Tribu de {t.name} — Symbole : {t.symbol} ({t.biblicalMeaning?.slice(0, 45)}...)
                </option>
              ))}
            </select>

            {selectedTribeInfo && (
              <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-amber-200 italic">
                🦁 <strong>Bénédiction :</strong> {selectedTribeInfo.biblicalMeaning}
              </p>
            )}
          </div>

          {/* 4. DÉPARTEMENTS DU MINISTÈRE (CHOIX DE 2 À 3 DÉPARTEMENTS) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Church className="w-4 h-4 text-[#0A3D36]" />
                  <span>Départements de service du Ministère <span className="text-rose-500">*</span></span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Sélectionnez <strong>2 à 3 départements</strong> dans lesquels vous souhaitez servir le Seigneur :
                </p>
              </div>

              {/* Compteur interactif */}
              <div
                className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 ${
                  selectedDepartments.length < 2
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : selectedDepartments.length === 2
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-[#C59A27]/20 text-[#0A3D36] border border-[#C59A27]/40'
                }`}
              >
                <span>
                  {selectedDepartments.length} / 3 choisis
                </span>
                {selectedDepartments.length >= 2 && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Grille des départements multi-sélection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {departments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept.id);
                const orderIndex = selectedDepartments.indexOf(dept.id);
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleDepartment(dept.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A3D36]/10 border-[#0A3D36] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black transition-colors ${
                          isSelected
                            ? 'bg-[#0A3D36] text-[#C59A27]'
                            : 'border border-slate-300 text-transparent bg-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span
                          className={`font-bold block text-xs ${
                            isSelected ? 'text-[#0A3D36]' : 'text-slate-700'
                          }`}
                        >
                          {dept.name}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {dept.description || 'Département de service'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#0A3D36] text-white shrink-0">
                        #{orderIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Vous serez immédiatement inscrit(e) comme membre actif dans chacun de ces {selectedDepartments.length} département(s).
            </p>
          </div>

          {/* 5. PROFESSION & PORTE D'INFLUENCE DANS LA CITÉ */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#C59A27]" />
                <span>Profession & Porte d'Influence <span className="text-rose-500">*</span></span>
              </label>
              <button
                type="button"
                onClick={() => setShowGateSelector(!showGateSelector)}
                className="text-[11px] text-[#0A3D36] font-bold hover:underline cursor-pointer"
              >
                {showGateSelector ? 'Masquer liste manuelle' : 'Choisir une autre porte ?'}
              </button>
            </div>

            <input
              type="text"
              required
              list="invite-modal-professions"
              value={profession}
              onChange={(e) => {
                setProfession(e.target.value);
                if (customGateId) setCustomGateId('');
              }}
              placeholder="Ex: Développeur Web, Médecin, Juriste, Comptable, Enseignant..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
            />
            <datalist id="invite-modal-professions">
              {SUGGESTED_PROFESSIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            {/* Carte de la Porte Détectée ou Choisie */}
            <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-start gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#0A3D36] text-[#C59A27] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                {effectiveGate.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Porte Royale d'Impact
                  </span>
                  <span className="font-black text-slate-900 text-xs">
                    Porte {effectiveGate.number} : {effectiveGate.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {detectedGateResult.explanation}
                </p>
              </div>
            </div>

            {showGateSelector && (
              <div className="pt-2 border-t border-amber-200 space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">
                  Sélectionner directement parmi les 12 Portes d'Influence du Royaume :
                </label>
                <select
                  value={effectiveGateId}
                  onChange={(e) => setCustomGateId(e.target.value as InfluenceGateId)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-800"
                >
                  {INFLUENCE_GATES.map((g) => (
                    <option key={g.id} value={g.id}>
                      Porte {g.number} : {g.name} — {g.subTitle.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 6. QUARTIER DE RÉSIDENCE & FAMILLE D'HONNEUR RATTACHÉE */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Votre Quartier de résidence <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Cellule de Proximité
              </span>
            </div>

            <select
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
            >
              {GRAND_COTONOU_QUARTIERS.map((q) => (
                <option key={q.quartier} value={q.quartier}>
                  {q.quartier} ({q.commune}) → {q.familleNom}
                </option>
              ))}
              <option value="AUTRE">Autre quartier (saisir manuellement)...</option>
            </select>

            {quartier === 'AUTRE' && (
              <input
                type="text"
                required
                value={customQuartier}
                onChange={(e) => setCustomQuartier(e.target.value)}
                placeholder="Votre quartier spécifique (Ex: Houéyiho, Patte d'Oie, Tankpè...)"
                className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
              />
            )}

            {matchedFamille && (
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Famille d'Honneur : {matchedFamille.nom}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded">
                      Rattaché
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Berger : <strong>{matchedFamille.bergerNom}</strong> • Quartier : {matchedFamille.quartier}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* BOUTON DE VALIDATION SOUS INVITATION */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#0A3D36] via-[#0D473E] to-[#12584E] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C59A27]" />
              <span>
                {isSigningIn
                  ? 'Enregistrement de votre inscription et des départements...'
                  : 'Accepter l\'Invitation & Valider mon Inscription'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#C59A27]" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              En validant, vous êtes immédiatement actif(ve) dans vos 2 à 3 départements, votre tribu, votre porte d'influence et votre famille d'honneur.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
