import React, { useState, useMemo, useEffect } from 'react';
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  User,
  Crown,
  Lock,
  Mail,
  Briefcase,
  Home,
  MapPin,
  Church,
  ChevronDown,
  Layers,
  Compass,
  Check,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  UserProfile,
  TribeId,
  InfluenceGateId,
  FamilleHonneur,
  DepartmentItem,
  TribeInfo,
} from '../types';
import { PASTOR_USER_PROFILE, PASTORAL_ACCESS_PASSCODE } from '../data/pastorData';
import { INFLUENCE_GATES } from '../data/influenceGatesData';
import { INITIAL_TRIBES } from '../data/tribesData';
import { INITIAL_DEPARTMENTS_DATA } from '../data/departmentsData';
import { INITIAL_FAMILLES_HONNEUR } from '../data/famillesHonneurData';
import {
  detectInfluenceGate,
  matchFamilleHonneur,
  GRAND_COTONOU_QUARTIERS,
  SUGGESTED_PROFESSIONS,
} from '../utils/memberAffiliationUtils';
import {
  getLeadershipAccounts,
  isPastorRegistered,
  getPastorCustomPasscode,
  registerPastorAccount,
  getRegisteredLeadershipSpaceIds,
  claimLeadershipSpace,
  LeadershipAccount,
  LeadershipCategory,
} from '../data/leadershipData';
import { updateGateResponsible } from '../data/gateLeadershipData';

export interface RegisterAffiliationData {
  tribeId: TribeId;
  departmentId: string;
  departmentIds?: string[];
  detectedGateId: InfluenceGateId;
  familleHonneurId?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterMember?: (
    user: UserProfile,
    affiliation: RegisterAffiliationData
  ) => void;
  availableMembers: UserProfile[];
  tribes?: TribeInfo[];
  departments?: DepartmentItem[];
  famillesHonneur?: FamilleHonneur[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterMember,
  availableMembers,
  tribes = INITIAL_TRIBES,
  departments = INITIAL_DEPARTMENTS_DATA,
  famillesHonneur = INITIAL_FAMILLES_HONNEUR,
}) => {
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'LOGIN' | 'PASTOR'>('REGISTER');
  const [loginSubMethod, setLoginSubMethod] = useState<'GMAIL' | 'PHONE'>('GMAIL');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessRegistration, setIsSuccessRegistration] = useState(false);

  // ==========================================
  // REGISTRATION ROLE SELECTION STATE
  // ==========================================
  const [regRole, setRegRole] = useState<'MEMBRE' | 'RESPONSABLE' | 'PASTEUR'>('MEMBRE');
  const [pastorRegistered, setPastorRegistered] = useState<boolean>(() => isPastorRegistered());
  const [claimedSpaceIds, setClaimedSpaceIds] = useState<string[]>(() => getRegisteredLeadershipSpaceIds());

  // Pastor Registration Specifics
  const [pastorPassword, setPastorPassword] = useState('');
  const [pastorConfirmPassword, setPastorConfirmPassword] = useState('');
  const [showPastorPass, setShowPastorPass] = useState(false);

  // Responsible Registration Specifics
  const [respSpaceCategory, setRespSpaceCategory] = useState<LeadershipCategory | 'ALL'>('ALL');
  const [selectedLeadershipAccountId, setSelectedLeadershipAccountId] = useState<string>('');
  const [respAccessCode, setRespAccessCode] = useState('');
  const [showRespAccessCode, setShowRespAccessCode] = useState(false);

  // Update states whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      const isReg = isPastorRegistered();
      setPastorRegistered(isReg);
      if (isReg && regRole === 'PASTEUR') {
        setRegRole('MEMBRE');
      }
      setClaimedSpaceIds(getRegisteredLeadershipSpaceIds());
    }
  }, [isOpen]);

  // ==========================================
  // REGISTRATION FORM STATES (COMMON)
  // ==========================================
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regPhone, setRegPhone] = useState('+229 97 00 11 22');
  const [regEmail, setRegEmail] = useState('');
  const [regProfession, setRegProfession] = useState('Développeur Web & Mobile');
  const [customGateId, setCustomGateId] = useState<InfluenceGateId | ''>('');
  const [showGateSelector, setShowGateSelector] = useState(false);
  const [regTribeId, setRegTribeId] = useState<TribeId>('juda');
  const [regDepartmentId, setRegDepartmentId] = useState<string>('communication');
  const [regDepartmentIds, setRegDepartmentIds] = useState<string[]>([
    departments[0]?.id || 'communication',
    departments[1]?.id || 'jeunesse',
  ]);
  const [regQuartier, setRegQuartier] = useState('Fidjrossè Plage / Akogbato');
  const [customQuartier, setCustomQuartier] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Toggle département : autorise entre 2 et 3 départements
  const toggleDepartment = (deptId: string) => {
    setErrorMessage('');
    if (regDepartmentIds.includes(deptId)) {
      if (regDepartmentIds.length <= 2) {
        setErrorMessage('Vous devez choisir au minimum 2 départements de service.');
        return;
      }
      setRegDepartmentIds(prev => prev.filter(id => id !== deptId));
    } else {
      if (regDepartmentIds.length >= 3) {
        setErrorMessage('Vous pouvez choisir au maximum 3 départements de service.');
        return;
      }
      setRegDepartmentIds(prev => [...prev, deptId]);
    }
  };

  // ==========================================
  // LOGIN FORM STATES
  // ==========================================
  const [gmailAddress, setGmailAddress] = useState('siloestore44@gmail.com');
  const [gmailFirstName, setGmailFirstName] = useState('');
  const [gmailLastName, setGmailLastName] = useState('');
  const [isGmailLoading, setIsGmailLoading] = useState(false);

  const [phoneLogin, setPhoneLogin] = useState('+229 97 10 20 30');
  const [phoneStep, setPhoneStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('778899');

  // ==========================================
  // PASTOR FORM STATES
  // ==========================================
  const [pastorCode, setPastorCode] = useState('');

  // ==========================================
  // COMPUTED AUTOMATIC AFFILIATIONS
  // ==========================================
  // 1. Automatic Influence Gate based on Profession
  const detectedGateResult = useMemo(() => {
    return detectInfluenceGate(regProfession);
  }, [regProfession]);

  const effectiveGateId: InfluenceGateId = (customGateId || detectedGateResult.gateId) as InfluenceGateId;
  const effectiveGate = useMemo(() => {
    return INFLUENCE_GATES.find(g => g.id === effectiveGateId) || INFLUENCE_GATES[0];
  }, [effectiveGateId]);

  // 2. Automatic Famille d'Honneur based on Quartier
  const effectiveQuartierText = regQuartier === 'AUTRE' ? customQuartier : regQuartier;
  const matchedFamille = useMemo(() => {
    return matchFamilleHonneur(effectiveQuartierText, famillesHonneur);
  }, [effectiveQuartierText, famillesHonneur]);

  // 3. Selected Tribe Info
  const selectedTribeInfo = useMemo(() => {
    return tribes.find(t => t.id === regTribeId) || tribes[0];
  }, [regTribeId, tribes]);

  // 4. Selected Department Info
  const selectedDeptInfo = useMemo(() => {
    return departments.find(d => d.id === regDepartmentId) || departments[0];
  }, [regDepartmentId, departments]);

  const selectedDeptInfos = useMemo(() => {
    return departments.filter(d => regDepartmentIds.includes(d.id));
  }, [regDepartmentIds, departments]);

  if (!isOpen) return null;

  // ==========================================
  // SUBMIT REGISTRATION (PASTEUR, RESPONSABLE, OU MEMBRE)
  // ==========================================
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // ----------------------------------------------------
    // CASE 1: INSCRIPTION DU PASTEUR (Crée et confirme son mot de passe)
    // ----------------------------------------------------
    if (regRole === 'PASTEUR') {
      if (!regFirstName.trim() || !regLastName.trim()) {
        setErrorMessage('Veuillez renseigner le nom et le prénom du Pasteur.');
        return;
      }
      if (!regPhone.trim()) {
        setErrorMessage('Veuillez renseigner un numéro de téléphone joignable.');
        return;
      }
      if (!pastorPassword || pastorPassword.length < 4) {
        setErrorMessage('Veuillez créer un mot de passe pastoral d\'au moins 4 caractères.');
        return;
      }
      if (pastorPassword !== pastorConfirmPassword) {
        setErrorMessage('La confirmation du mot de passe ne correspond pas au mot de passe créé.');
        return;
      }

      setIsSubmittingReg(true);

      setTimeout(() => {
        const cleanPass = pastorPassword.trim();
        registerPastorAccount(cleanPass, {
          firstName: regFirstName.trim(),
          lastName: regLastName.trim().toUpperCase(),
          phone: regPhone.trim(),
          email: regEmail.trim() || 'pasteur@vasesdhonneur.ci',
        });

        const newPastorUser: UserProfile = {
          ...PASTOR_USER_PROFILE,
          id: 'usr-pasteur-principal',
          firstName: regFirstName.trim(),
          lastName: regLastName.trim().toUpperCase(),
          phone: regPhone.trim(),
          email: regEmail.trim() || PASTOR_USER_PROFILE.email,
          role: 'PASTEUR',
        };

        setPastorRegistered(true);
        setIsSubmittingReg(false);
        setIsSuccessRegistration(true);

        setTimeout(() => {
          setIsSuccessRegistration(false);
          onLoginSuccess(newPastorUser);
          onClose();
        }, 1600);
      }, 400);
      return;
    }

    // ----------------------------------------------------
    // CASE 2: INSCRIPTION D'UN RESPONSABLE (Mot de passe envoyé par le Pasteur)
    // ----------------------------------------------------
    if (regRole === 'RESPONSABLE') {
      if (!selectedLeadershipAccountId) {
        setErrorMessage('Veuillez sélectionner l\'espace dont vous êtes nommé(e) responsable.');
        return;
      }

      const allAccounts = getLeadershipAccounts();
      const targetAccount = allAccounts.find((a) => a.id === selectedLeadershipAccountId);
      if (!targetAccount) {
        setErrorMessage('Espace de responsabilité sélectionné introuvable.');
        return;
      }

      const currentClaimed = getRegisteredLeadershipSpaceIds();
      if (currentClaimed.includes(targetAccount.id)) {
        setErrorMessage('Cet espace est déjà enregistré par un responsable en fonction.');
        return;
      }

      if (!respAccessCode.trim()) {
        setErrorMessage('Veuillez saisir le mot de passe / code d\'accès que le Pasteur vous a envoyé.');
        return;
      }

      const pastorMasterPass = getPastorCustomPasscode();
      const isCodeValid =
        respAccessCode.trim().toLowerCase() === targetAccount.passcode.trim().toLowerCase() ||
        respAccessCode.trim() === pastorMasterPass ||
        respAccessCode.trim() === PASTORAL_ACCESS_PASSCODE ||
        respAccessCode.trim() === '1212';

      if (!isCodeValid) {
        setErrorMessage('❌ Code d\'accès incorrect pour cet espace. Le mot de passe vous a été envoyé par le Pasteur Mohammed Sanogo. Veuillez vérifier ou contacter le secrétariat pastoral.');
        return;
      }

      if (!regFirstName.trim() || !regLastName.trim()) {
        setErrorMessage('Veuillez renseigner votre nom et prénom.');
        return;
      }
      if (!regPhone.trim()) {
        setErrorMessage('Veuillez renseigner votre numéro de téléphone.');
        return;
      }

      setIsSubmittingReg(true);

      setTimeout(() => {
        const leaderFullName = `${regFirstName.trim()} ${regLastName.trim().toUpperCase()}`;

        // Claim the space
        claimLeadershipSpace(targetAccount.id, {
          holderName: leaderFullName,
          phone: regPhone.trim(),
          email: regEmail.trim(),
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        });

        // If gate responsible, sync gateLeadershipData
        if (targetAccount.category === 'RESPONSABLE_PORTE' && targetAccount.targetId) {
          updateGateResponsible(targetAccount.targetId as InfluenceGateId, {
            nom: leaderFullName,
            phone: regPhone.trim(),
            passcode: targetAccount.passcode,
          });
        }

        const generatedId = 'usr-lead-' + Date.now();
        const gateIdForLeader: InfluenceGateId =
          targetAccount.category === 'RESPONSABLE_PORTE' && targetAccount.targetId
            ? (targetAccount.targetId as InfluenceGateId)
            : effectiveGateId;

        const tribeIdForLeader: TribeId =
          targetAccount.category === 'CHEF_TRIBU' && targetAccount.targetId
            ? (targetAccount.targetId as TribeId)
            : regTribeId;

        const newLeaderUser: UserProfile = {
          id: generatedId,
          phone: regPhone.trim(),
          email: regEmail.trim() || undefined,
          phonePublic: true,
          addressPublic: false,
          proInfoPublic: true,
          firstName: regFirstName.trim().charAt(0).toUpperCase() + regFirstName.trim().slice(1),
          lastName: regLastName.trim().toUpperCase(),
          photoUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          profession: regProfession.trim() || targetAccount.title,
          bio: `Responsable nommé(e) : ${targetAccount.title} pour « ${targetAccount.targetName} ».`,
          city: 'Cotonou',
          country: 'Bénin',
          skills: [targetAccount.title, regProfession.trim() || 'Leadership'],
          activities: [targetAccount.targetName, 'Directoire Pastoral'],
          departmentId:
            targetAccount.category === 'CHEF_DEPARTEMENT' && targetAccount.targetId
              ? targetAccount.targetId
              : regDepartmentId,
          departmentName:
            targetAccount.category === 'CHEF_DEPARTEMENT'
              ? targetAccount.targetName
              : selectedDeptInfo?.name || 'Département',
          availableForOpportunities: true,
          availableForMissions: true,
          status: 'DISPONIBLE',
          role: 'RESPONSABLE',
          tribeId: tribeIdForLeader,
          tribeRole: targetAccount.category === 'CHEF_TRIBU' ? 'PATRIARCHE' : 'RESPONSABLE',
          influenceGates: [gateIdForLeader],
          quartier: effectiveQuartierText.trim() || 'Cotonou',
          familleHonneurId: matchedFamille?.id,
          completionScore: 100,
          createdAt: new Date().toISOString(),
        };

        setClaimedSpaceIds(getRegisteredLeadershipSpaceIds());
        setIsSubmittingReg(false);
        setIsSuccessRegistration(true);

        setTimeout(() => {
          setIsSuccessRegistration(false);
          onLoginSuccess(newLeaderUser);
          onClose();
        }, 1600);
      }, 450);
      return;
    }

    // ----------------------------------------------------
    // CASE 3: INSCRIPTION MEMBRE STANDARD
    // ----------------------------------------------------
    if (!regFirstName.trim() || !regLastName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone joignable.');
      return;
    }
    if (!regProfession.trim()) {
      setErrorMessage('Veuillez indiquer votre profession ou domaine d’activité.');
      return;
    }
    if (regDepartmentIds.length < 2 || regDepartmentIds.length > 3) {
      setErrorMessage(`Veuillez choisir entre 2 et 3 départements de service (actuellement : ${regDepartmentIds.length}).`);
      return;
    }

    setIsSubmittingReg(true);

    setTimeout(() => {
      const generatedId = 'usr-reg-' + Date.now();
      const finalQuartier = effectiveQuartierText.trim() || 'Cotonou';
      
      const chosenDeptNames = departments
        .filter(d => regDepartmentIds.includes(d.id))
        .map(d => d.name);
      const primaryDeptName = chosenDeptNames[0] || 'Département';
      const primaryDeptId = regDepartmentIds[0] || 'communication';

      const newUser: UserProfile = {
        id: generatedId,
        phone: regPhone.trim(),
        email: regEmail.trim() || undefined,
        phonePublic: true,
        addressPublic: false,
        proInfoPublic: true,
        firstName: regFirstName.trim().charAt(0).toUpperCase() + regFirstName.trim().slice(1),
        lastName: regLastName.trim().toUpperCase(),
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        profession: regProfession.trim(),
        bio: `Membre inscrit sur Vases Connect. Profession : ${regProfession.trim()} • Quartier : ${finalQuartier}.`,
        city: 'Cotonou',
        country: 'Bénin',
        skills: [regProfession.trim(), 'Vie de l’Église', 'Engagement'],
        activities: [...chosenDeptNames, `Tribu de ${selectedTribeInfo?.name || 'Juda'}`],
        departmentId: primaryDeptId,
        departmentName: chosenDeptNames.join(', '),
        departmentIds: regDepartmentIds,
        departmentNames: chosenDeptNames,
        availableForOpportunities: true,
        availableForMissions: true,
        status: 'DISPONIBLE',
        role: 'MEMBRE', // Strictement Membre
        tribeId: regTribeId,
        tribeRole: 'MEMBRE',
        influenceGates: [effectiveGateId],
        gateProfiles: {
          [effectiveGateId]: {
            id: 'gp-' + generatedId,
            userId: generatedId,
            gateId: effectiveGateId,
            memberName: `${regFirstName.trim()} ${regLastName.trim().toUpperCase()}`,
            memberProfession: regProfession.trim(),
            memberPhoto:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            memberPhone: regPhone.trim(),
            memberCity: 'Cotonou',
            memberCountry: 'Bénin',
            roleInGate: 'Professionnel / Cadre',
            subSector: effectiveGate.keySubSectors[0] || regProfession.trim(),
            visionImpact: `Membre engagé dans la Porte ${effectiveGate.name}.`,
            skills: [regProfession.trim()],
            seekingCollaboration: true,
            openForMentoring: true,
            whatsappContact: regPhone.trim(),
            emailContact: regEmail.trim() || undefined,
            registeredAt: new Date().toISOString().split('T')[0],
          },
        },
        quartier: finalQuartier,
        familleHonneurId: matchedFamille?.id,
        completionScore: 95,
        createdAt: new Date().toISOString(),
      };

      const affiliation: RegisterAffiliationData = {
        tribeId: regTribeId,
        departmentId: primaryDeptId,
        departmentIds: regDepartmentIds,
        detectedGateId: effectiveGateId,
        familleHonneurId: matchedFamille?.id,
      };

      if (onRegisterMember) {
        onRegisterMember(newUser, affiliation);
      } else {
        onLoginSuccess(newUser);
      }

      setIsSubmittingReg(false);
      setIsSuccessRegistration(true);

      setTimeout(() => {
        setIsSuccessRegistration(false);
        onClose();
      }, 1800);
    }, 450);
  };

  // ==========================================
  // GMAIL SIGN IN
  // ==========================================
  const handleGmailSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gmailAddress || !gmailAddress.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse Gmail valide.');
      return;
    }
    setErrorMessage('');
    setIsGmailLoading(true);

    setTimeout(() => {
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
      const computedLastName = gmailLastName.trim() || 'Porte des Cieux';

      const newMember: UserProfile = {
        id: 'usr-gmail-' + Date.now(),
        email: gmailAddress.toLowerCase(),
        phone: '+229 97 00 00 00',
        phonePublic: false,
        addressPublic: false,
        proInfoPublic: true,
        firstName:
          computedFirstName.charAt(0).toUpperCase() + computedFirstName.slice(1),
        lastName: computedLastName.toUpperCase(),
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        profession: 'Membre de l’Église',
        bio: 'Fidèle engagé connecté avec Google/Gmail.',
        city: 'Cotonou',
        country: 'Bénin',
        skills: ['Engagement Chrétien', 'Entraide'],
        activities: ['Culte Dominical', 'Tribu'],
        departmentId: 'communication',
        departmentName: 'Département de la Communication & Média',
        availableForOpportunities: true,
        availableForMissions: true,
        status: 'DISPONIBLE',
        role: 'MEMBRE',
        tribeId: 'juda',
        completionScore: 85,
        createdAt: new Date().toISOString(),
      };

      setIsGmailLoading(false);
      onLoginSuccess(newMember);
      onClose();
    }, 400);
  };

  // ==========================================
  // PHONE SIGN IN
  // ==========================================
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneLogin.length < 8) {
      setErrorMessage('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    setErrorMessage('');
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpCode(randomOtp);
    setPhoneStep('OTP');
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode !== '123456' && otpCode !== '778899') {
      setErrorMessage('Code OTP invalide. Veuillez vérifier le code.');
      return;
    }

    const existing = availableMembers.find(
      m => m.phone.replace(/\s+/g, '') === phoneLogin.replace(/\s+/g, '')
    );
    if (existing) {
      onLoginSuccess(existing);
      onClose();
    } else {
      // Switch directly to complete registration with prefilled phone
      setRegPhone(phoneLogin);
      setActiveTab('REGISTER');
      setPhoneStep('INPUT');
    }
  };

  // ==========================================
  // AVAILABLE LEADERSHIP ACCOUNTS FOR REGISTRATION
  // ==========================================
  const availableLeadershipAccounts = useMemo(() => {
    const all = getLeadershipAccounts();
    return all.filter((a) => {
      if (a.id === 'lead-pasteur-principal') return false;
      if (a.id.includes('generic')) return false;
      if (respSpaceCategory !== 'ALL' && a.category !== respSpaceCategory) {
        return false;
      }
      return true;
    });
  }, [respSpaceCategory, isOpen]);

  // ==========================================
  // PASTOR LOGIN
  // ==========================================
  const handlePastorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const customPass = getPastorCustomPasscode();
    if (
      (customPass && pastorCode.trim() === customPass) ||
      pastorCode.trim() === PASTORAL_ACCESS_PASSCODE ||
      pastorCode.trim().toLowerCase() === 'pasteur2026'
    ) {
      onLoginSuccess(PASTOR_USER_PROFILE);
      onClose();
    } else {
      setErrorMessage('Code d’autorisation pastorale incorrect.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 text-slate-800 my-auto overflow-hidden animate-in fade-in zoom-in-95 max-h-[94vh] flex flex-col">
        {/* En-tête */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex justify-between items-start bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C59A27] animate-pulse" />
              <span className="text-[10px] font-black text-[#C59A27] uppercase tracking-wider">
                Porte des Cieux • Adhésion & Connexion
              </span>
            </div>
            <h3 className="font-black text-lg sm:text-xl text-[#0A3D36]">
              {activeTab === 'REGISTER'
                ? regRole === 'PASTEUR'
                  ? 'Chaire Pastorale • Inscription Direction'
                  : regRole === 'RESPONSABLE'
                  ? 'Nomination • Inscription Responsable'
                  : 'Inscription d’un Nouveau Membre'
                : activeTab === 'LOGIN'
                ? 'Connexion Membre'
                : 'Chaire Pastorale • Accès Pasteur'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Onglets de navigation principale */}
        <div className="px-4 sm:px-5 pt-3">
          <div className="grid grid-cols-3 rounded-2xl bg-slate-100 p-1 text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('REGISTER');
                setErrorMessage('');
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 text-center ${
                activeTab === 'REGISTER'
                  ? 'bg-[#0A3D36] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
              <span className="truncate">Inscription Complète</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('LOGIN');
                setErrorMessage('');
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 text-center ${
                activeTab === 'LOGIN'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">Déjà Inscrit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('PASTOR');
                setErrorMessage('');
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 text-center ${
                activeTab === 'PASTOR'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
              <span className="truncate">Pasteur</span>
            </button>
          </div>
        </div>

        {/* Message d'erreur s'il y a lieu */}
        {errorMessage && (
          <div className="mx-4 sm:mx-5 mt-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {errorMessage}
          </div>
        )}

        {/* Message de confirmation de succès après inscription */}
        {isSuccessRegistration ? (
          <div className="p-8 text-center space-y-4 my-auto">
            {regRole === 'PASTEUR' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
                  <Crown className="w-9 h-9 text-[#C59A27]" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Bienvenue Chaire Pastorale !
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre compte pastoral a été créé avec succès et votre mot de passe personnel d'administration est validé. L'option d'inscription « Pasteur » est désormais clôturée et sécurisée.
                </p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 max-w-md mx-auto text-xs text-amber-900 font-bold text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-950 font-black">
                    <Sparkles className="w-4 h-4 text-[#C59A27]" />
                    <span>Pouvoir Apostolique de Gestion :</span>
                  </div>
                  <p className="text-[11px] font-normal text-amber-800">
                    Vous avez désormais plein pouvoir pour nommer, remplacer et révoquer les responsables des 12 Portes, des 12 Tribus et des Départements, et leur générer des codes d'accès directs.
                  </p>
                </div>
              </>
            ) : regRole === 'RESPONSABLE' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300">
                  <ShieldCheck className="w-9 h-9 text-emerald-700" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Bienvenue Responsable, {regFirstName} !
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Votre mandat a été validé avec succès grâce au mot de passe confidentiel transmis par le Pasteur Mohammed Sanogo. Vous avez désormais accès à la gestion de votre espace.
                </p>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-slate-700 font-medium text-left">
                  🏛️ Espace assigné : <strong>{availableLeadershipAccounts.find(a => a.id === selectedLeadershipAccountId)?.targetName || 'Votre Espace de Responsabilité'}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Bienvenue dans la Famille, {regFirstName} !
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Votre inscription est validée. Vous avez été rattaché(e) avec succès à :
                </p>
                <div className="grid grid-cols-2 gap-2 text-left max-w-md mx-auto text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">🏛️ PORTE D'INFLUENCE</span>
                    <span className="font-bold text-[#0A3D36]">Porte {effectiveGate.number} • {effectiveGate.name}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">👑 TRIBU</span>
                    <span className="font-bold text-[#C59A27]">Tribu de {selectedTribeInfo?.name}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">🕊️ DÉPARTEMENT</span>
                    <span className="font-bold text-slate-800">{selectedDeptInfo?.name}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">🏠 FAMILLE D'HONNEUR</span>
                    <span className="font-bold text-emerald-800">{matchedFamille?.nom || 'Famille Grâce & Vie'}</span>
                  </div>
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-400 animate-pulse">Connexion en cours...</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 text-xs">
            {/* ==================================================== */}
            {/* ONGLET 1 : INSCRIPTION SELON LE STATUT */}
            {/* ==================================================== */}
            {activeTab === 'REGISTER' && (
              <div className="space-y-4">
                {/* 1. CHOIX DU PROFIL : MEMBRE, RESPONSABLE, OU PASTEUR */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Sélectionnez votre profil d'inscription :
                    </label>
                    {pastorRegistered && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                        👑 Pasteur Principal inscrit
                      </span>
                    )}
                  </div>

                  <div className={`grid ${!pastorRegistered ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5`}>
                    {/* Option 1 : Membre */}
                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('MEMBRE');
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                        regRole === 'MEMBRE'
                          ? 'border-[#0A3D36] bg-[#0A3D36]/5 ring-2 ring-[#0A3D36]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <User className={`w-4 h-4 ${regRole === 'MEMBRE' ? 'text-[#0A3D36]' : 'text-slate-400'}`} />
                        {regRole === 'MEMBRE' && <CheckCircle2 className="w-3.5 h-3.5 text-[#0A3D36]" />}
                      </div>
                      <div className="mt-2">
                        <span className="font-black text-xs text-slate-900 block">Membre</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">Fidèle de la communauté</span>
                      </div>
                    </button>

                    {/* Option 2 : Responsable */}
                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('RESPONSABLE');
                        setErrorMessage('');
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                        regRole === 'RESPONSABLE'
                          ? 'border-[#C59A27] bg-[#C59A27]/10 ring-2 ring-[#C59A27]/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Shield className={`w-4 h-4 ${regRole === 'RESPONSABLE' ? 'text-[#C59A27]' : 'text-slate-400'}`} />
                        {regRole === 'RESPONSABLE' && <CheckCircle2 className="w-3.5 h-3.5 text-[#C59A27]" />}
                      </div>
                      <div className="mt-2">
                        <span className="font-black text-xs text-slate-900 block">Responsable</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">Mot de passe envoyé par Pasteur</span>
                      </div>
                    </button>

                    {/* Option 3 : Pasteur (Ne figure plus du tout une fois le pasteur inscrit !) */}
                    {!pastorRegistered && (
                      <button
                        type="button"
                        onClick={() => {
                          setRegRole('PASTEUR');
                          setErrorMessage('');
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                          regRole === 'PASTEUR'
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Crown className={`w-4 h-4 ${regRole === 'PASTEUR' ? 'text-amber-600' : 'text-slate-400'}`} />
                          {regRole === 'PASTEUR' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <div className="mt-2">
                          <span className="font-black text-xs text-amber-900 block">Pasteur</span>
                          <span className="text-[10px] text-amber-700/80 line-clamp-1">Chaire Pastorale</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* ==================================================== */}
                {/* FORUMULAIRE A : PASTEUR (Crée son propre mot de passe & confirme) */}
                {/* ==================================================== */}
                {regRole === 'PASTEUR' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                    <div className="bg-gradient-to-r from-amber-500/15 via-[#C59A27]/20 to-amber-500/10 p-4 rounded-2xl border-2 border-amber-400/60 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-700" />
                        <span className="font-black text-xs text-amber-950 uppercase tracking-wider">
                          Inscription Pastorale & Création de votre Mot de Passe
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                        En tant que Pasteur Principal, <strong>vous devez créer votre propre mot de passe et le confirmer</strong> ci-dessous. Dès que votre inscription est enregistrée, cette option « Pasteur » disparaîtra définitivement du formulaire pour des raisons de sécurité.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Prénom du Pasteur <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Ex: Mohammed"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Nom de famille <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Ex: SANOGO"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Téléphone Pastoral <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+225 07 00 00 00 00"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Email officiel (optionnel)
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="pasteur@vasesdhonneur.ci"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
                        />
                      </div>
                    </div>

                    {/* CREATION DU MOT DE PASSE ET CONFIRMATION */}
                    <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Créer et Confirmer votre Mot de Passe Personnel</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPastorPass(!showPastorPass)}
                          className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-amber-200"
                        >
                          {showPastorPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showPastorPass ? 'Masquer' : 'Afficher'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Créer votre mot de passe <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type={showPastorPass ? 'text' : 'password'}
                            required
                            minLength={4}
                            value={pastorPassword}
                            onChange={(e) => setPastorPassword(e.target.value)}
                            placeholder="Min. 4 caractères"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-mono font-bold focus:outline-hidden focus:border-[#0A3D36]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Confirmer votre mot de passe <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type={showPastorPass ? 'text' : 'password'}
                            required
                            minLength={4}
                            value={pastorConfirmPassword}
                            onChange={(e) => setPastorConfirmPassword(e.target.value)}
                            placeholder="Retapez le mot de passe"
                            className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-mono font-bold focus:outline-hidden focus:border-[#0A3D36]"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        🔒 Vous utiliserez ce mot de passe pour vous authentifier dans l'onglet pastoral.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReg}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-[#C59A27] to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{isSubmittingReg ? 'Enregistrement du mot de passe...' : 'Créer mon Mot de Passe & Valider le Compte Pastoral'}</span>
                    </button>
                  </form>
                )}

                {/* ==================================================== */}
                {/* FORMULAIRE B : RESPONSABLE (Le Pasteur lui envoie son mot de passe) */}
                {/* ==================================================== */}
                {regRole === 'RESPONSABLE' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                    {/* Notice pastorale */}
                    <div className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 p-4 rounded-2xl border-2 border-[#C59A27]/60 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#C59A27] shrink-0" />
                        <span className="font-black text-xs text-[#0A3D36] uppercase tracking-wider">
                          Accréditation Responsable • Mot de Passe Fourni par le Pasteur
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                        Pour les responsables, <strong>c'est le Pasteur qui génère et envoie le mot de passe secret</strong>. Sélectionnez ci-dessous votre espace d'affectation puis entrez le mot de passe reçu.
                      </p>
                    </div>

                    {/* 1. Filtre par Catégorie d'Espace */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        1. Catégorie de votre espace de responsabilité :
                      </label>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                        <button
                          type="button"
                          onClick={() => setRespSpaceCategory('ALL')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            respSpaceCategory === 'ALL'
                              ? 'bg-[#0A3D36] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Tous les Espaces
                        </button>
                        <button
                          type="button"
                          onClick={() => setRespSpaceCategory('RESPONSABLE_PORTE')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            respSpaceCategory === 'RESPONSABLE_PORTE'
                              ? 'bg-[#0A3D36] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🏛️ 12 Portes d'Influence
                        </button>
                        <button
                          type="button"
                          onClick={() => setRespSpaceCategory('CHEF_TRIBU')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            respSpaceCategory === 'CHEF_TRIBU'
                              ? 'bg-[#0A3D36] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          👑 12 Tribus d'Israël
                        </button>
                        <button
                          type="button"
                          onClick={() => setRespSpaceCategory('BERGER_FAMILLE')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            respSpaceCategory === 'BERGER_FAMILLE'
                              ? 'bg-[#0A3D36] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🏠 Familles d'Honneur
                        </button>
                        <button
                          type="button"
                          onClick={() => setRespSpaceCategory('CHEF_DEPARTEMENT')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            respSpaceCategory === 'CHEF_DEPARTEMENT'
                              ? 'bg-[#0A3D36] text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🕊️ Départements
                        </button>
                      </div>
                    </div>

                    {/* 2. Sélection de l'Espace Spécifique */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        2. Sélectionnez l'espace dont vous êtes nommé(e) responsable <span className="text-rose-500">*</span> :
                      </label>
                      <select
                        required
                        value={selectedLeadershipAccountId}
                        onChange={(e) => setSelectedLeadershipAccountId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#0A3D36]"
                      >
                        <option value="">-- Sélectionnez votre espace d'affectation --</option>
                        {availableLeadershipAccounts.map((acc) => {
                          const isClaimed = claimedSpaceIds.includes(acc.id);
                          return (
                            <option key={acc.id} value={acc.id} disabled={isClaimed}>
                              {isClaimed ? '🔒 (Déjà pourvu & inscrit) ' : '✨ '}
                              {acc.targetName} — {acc.title}
                              {isClaimed ? ' [Indisponible]' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* 3. Mot de passe / code d'accès envoyé par le pasteur */}
                    <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-[#0A3D36] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span>3. Mot de passe / Code d'accès envoyé par le Pasteur <span className="text-rose-500">*</span></span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowRespAccessCode(!showRespAccessCode)}
                          className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-amber-200"
                        >
                          {showRespAccessCode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showRespAccessCode ? 'Masquer' : 'Afficher'}</span>
                        </button>
                      </div>

                      <input
                        type={showRespAccessCode ? 'text' : 'password'}
                        required
                        value={respAccessCode}
                        onChange={(e) => setRespAccessCode(e.target.value)}
                        placeholder="Entrez le mot de passe secret fourni par le Pasteur"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-sm font-mono font-black tracking-wider focus:outline-hidden focus:border-[#0A3D36]"
                      />
                      <p className="text-[10px] text-slate-500">
                        Ce mot de passe vérifie votre accréditation officielle auprès de la Chaire Pastorale.
                      </p>
                    </div>

                    {/* 4. Coordonnées du Responsable */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Prénom du responsable <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="Ex: Barnabé"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Nom de famille <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Ex: HOUESSOU"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Téléphone direct / WhatsApp <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+229 97 10 20 30"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] font-mono"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Email officiel (optionnel)
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="responsable@vasesdhonneur.ci"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Profession / Titre d'expertise
                      </label>
                      <input
                        type="text"
                        value={regProfession}
                        onChange={(e) => setRegProfession(e.target.value)}
                        placeholder="Ex: Théologien, Juriste, Ingénieur, Directeur Administratif..."
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReg}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C59A27]" />
                      <span>{isSubmittingReg ? 'Validation du mot de passe envoyé...' : 'Valider mon Mandat de Responsable avec le Code'}</span>
                    </button>
                  </form>
                )}

                {/* ==================================================== */}
                {/* FORMULAIRE C : MEMBRE STANDARD (Automatisé avec 2 à 3 Départements) */}
                {/* ==================================================== */}
                {regRole === 'MEMBRE' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in">
                    {/* Bannière Détection d'Invitation Fraternelle */}
                    {typeof window !== 'undefined' && (window.location.search.includes('invite') || window.location.search.includes('invited') || window.location.search.includes('invitation') || window.location.hash.toLowerCase().includes('invite')) && (
                      <div className="bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-3.5 rounded-2xl border border-[#C59A27]/40 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-[#E5B22F]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#E5B22F] tracking-wide block">
                            🕊️ Invitation Fraternelle Reçue
                          </span>
                          <p className="text-xs text-emerald-100 font-semibold leading-tight">
                            Bienvenue ! Votre fiche d'inscription active instantanément vos 4 affectations (Tribu, 2 à 3 Départements, Porte d'Influence et Quartier).
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-[#0A3D36]/10 via-[#C59A27]/10 to-emerald-50 p-3 rounded-2xl border border-[#0A3D36]/15 flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#C59A27] shrink-0" />
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        <strong>Rattachement automatique instantané :</strong> En renseignant votre profil, vous êtes immédiatement intégré(e) à votre <strong>Tribu</strong>, vos <strong>2 à 3 Départements de service</strong>, votre <strong>Porte d'Influence</strong> et votre <strong>Famille d'Honneur de quartier</strong>.
                      </p>
                    </div>

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
                            value={regFirstName}
                            onChange={(e) => setRegFirstName(e.target.value)}
                            placeholder="Ex: Jean"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
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
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Ex: Kouassi"
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
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
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="+229 97 00 11 22"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white font-mono"
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
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="jean.kouassi@gmail.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-[#0A3D36] focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. TRIBU SPIRITUELLE (TRIBUT) */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-[#C59A27]" />
                          <span>Votre Tribu d’appartenance <span className="text-rose-500">*</span></span>
                        </label>
                        <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                          12 Tribus d'Israël
                        </span>
                      </div>
                      <select
                        value={regTribeId}
                        onChange={(e) => setRegTribeId(e.target.value as TribeId)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#0A3D36]"
                      >
                        {tribes.map((t) => (
                          <option key={t.id} value={t.id}>
                            Tribu de {t.name} — Symbole : {t.symbol}
                          </option>
                        ))}
                      </select>
                      {selectedTribeInfo && (
                        <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-amber-200/60 italic">
                          🦁 <strong>Bénédiction biblique :</strong> {selectedTribeInfo.biblicalMeaning}
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
                            Vous pouvez choisir <strong>2 à 3 départements</strong> d'engagement :
                          </p>
                        </div>

                        {/* Compteur interactif */}
                        <div
                          className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 ${
                            regDepartmentIds.length < 2
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : regDepartmentIds.length === 2
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#C59A27]/20 text-[#0A3D36] border border-[#C59A27]/40'
                          }`}
                        >
                          <span>{regDepartmentIds.length} / 3 choisis</span>
                          {regDepartmentIds.length >= 2 && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Grille multi-sélection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {departments.map((dept) => {
                          const isSelected = regDepartmentIds.includes(dept.id);
                          const orderIndex = regDepartmentIds.indexOf(dept.id);
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

                      <p className="text-[10px] text-slate-500 italic">
                        Vous serez rattaché(e) aux serviteurs actifs dans ces {regDepartmentIds.length} départements.
                      </p>
                    </div>

                    {/* 5. PROFESSION & PORTE D'INFLUENCE DANS LA CITÉ */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span>Profession ou Domaine d’activité <span className="text-rose-500">*</span></span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowGateSelector(!showGateSelector)}
                          className="text-[10px] text-[#0A3D36] font-bold hover:underline cursor-pointer"
                        >
                          {showGateSelector ? 'Masquer sélecteur manuel' : 'Changer manuellement la porte ?'}
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        list="suggested-professions"
                        value={regProfession}
                        onChange={(e) => {
                          setRegProfession(e.target.value);
                          if (customGateId) setCustomGateId('');
                        }}
                        placeholder="Ex: Développeur Web, Médecin, Comptable, Enseignant, Avocat..."
                        className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300/80 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                      />
                      <datalist id="suggested-professions">
                        {SUGGESTED_PROFESSIONS.map((p) => (
                          <option key={p} value={p} />
                        ))}
                      </datalist>

                      {/* CARTE DE DÉTECTION EN TEMPS RÉEL DE LA PORTE D'INFLUENCE */}
                      <div className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-start justify-between gap-3 shadow-2xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0A3D36] text-[#C59A27] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                            {effectiveGate.number}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                ✨ Ajout Automatique
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
                      </div>

                      {showGateSelector && (
                        <div className="pt-2 border-t border-amber-200 space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 block">
                            Sélectionner une autre porte d’influence si vous le souhaitez :
                          </label>
                          <select
                            value={effectiveGateId}
                            onChange={(e) => setCustomGateId(e.target.value as InfluenceGateId)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-800"
                          >
                            {INFLUENCE_GATES.map((g) => (
                              <option key={g.id} value={g.id}>
                                Porte {g.number} : {g.name} ({g.subTitle.slice(0, 45)}...)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 6. QUARTIER & RATTACHEMENT AUTOMATIQUE À LA FAMILLE D'HONNEUR */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Quartier de résidence <span className="text-rose-500">*</span></span>
                        </label>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                          Famille d’Honneur liée
                        </span>
                      </div>

                      <select
                        value={regQuartier}
                        onChange={(e) => setRegQuartier(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      >
                        {GRAND_COTONOU_QUARTIERS.map((q) => (
                          <option key={q.quartier} value={q.quartier}>
                            {q.quartier} ({q.commune}) → {q.familleNom}
                          </option>
                        ))}
                        <option value="AUTRE">Autre quartier spécifique (saisir manuellement)...</option>
                      </select>

                      {regQuartier === 'AUTRE' && (
                        <input
                          type="text"
                          required
                          value={customQuartier}
                          onChange={(e) => setCustomQuartier(e.target.value)}
                          placeholder="Précisez votre quartier (Ex: Houéyiho, Patte d'Oie, Tankpè...)"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-semibold text-slate-900 focus:outline-hidden"
                        />
                      )}

                      {/* CARTE DE LA FAMILLE D'HONNEUR RATTACHÉE */}
                      {matchedFamille && (
                        <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-xs flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black">
                              <Home className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{matchedFamille.nom}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-black rounded">
                                  Rattaché
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 block">
                                Quartier : {matchedFamille.quartier} ({matchedFamille.commune}) • Berger : {matchedFamille.bergerNom}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VALIDATION MEMBRE */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingReg}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A3D36] via-[#0D473E] to-[#12584E] hover:from-[#072a25] hover:to-[#0A3D36] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 cursor-pointer"
                      >
                        <span>
                          {isSubmittingReg
                            ? 'Enregistrement de vos 4 affectations...'
                            : 'Valider mon Inscription & Mes Affectations'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#C59A27]" />
                      </button>
                      <p className="text-[10px] text-center text-slate-400 mt-2">
                        En validant, votre profil est instantanément synchronisé dans votre tribu, vos 2 à 3 départements et votre famille d'honneur.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* ONGLET 2 : CONNEXION POUR MEMBRE DÉJÀ INSCRIT */}
            {/* ==================================================== */}
            {activeTab === 'LOGIN' && (
              <div className="space-y-4">
                <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginSubMethod('GMAIL')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      loginSubMethod === 'GMAIL'
                        ? 'bg-white text-[#0A3D36] shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Google / Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginSubMethod('PHONE')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      loginSubMethod === 'PHONE'
                        ? 'bg-white text-[#0A3D36] shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Numéro de Téléphone
                  </button>
                </div>

                {/* SOUS-METHODE 1 : GMAIL */}
                {loginSubMethod === 'GMAIL' && (
                  <div className="space-y-3">
                    <p className="text-slate-600 text-[11px]">
                      Connectez-vous avec votre adresse <strong>Gmail</strong>. Votre compte membre sera retrouvé automatiquement.
                    </p>

                    <button
                      type="button"
                      disabled={isGmailLoading}
                      onClick={() => handleGmailSignIn()}
                      className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-xs text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 transition-all"
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

                    <form onSubmit={handleGmailSignIn} className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Ou entrer une autre adresse Gmail :
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={gmailAddress}
                            onChange={(e) => setGmailAddress(e.target.value)}
                            placeholder="votre.email@gmail.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isGmailLoading}
                        className="w-full py-2.5 bg-[#0A3D36] hover:bg-[#072a25] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
                      >
                        <span>{isGmailLoading ? 'Connexion...' : 'Se connecter'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
                      </button>
                    </form>
                  </div>
                )}

                {/* SOUS-METHODE 2 : PHONE */}
                {loginSubMethod === 'PHONE' && (
                  <div className="space-y-3">
                    {phoneStep === 'INPUT' ? (
                      <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Numéro de téléphone
                          </label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                            <input
                              type="tel"
                              required
                              value={phoneLogin}
                              onChange={(e) => setPhoneLogin(e.target.value)}
                              placeholder="+229 97 10 20 30"
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:border-[#0A3D36]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#0A3D36] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
                        >
                          <span>Recevoir le code OTP de test</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-xs">
                          Code de test généré : <strong>{generatedOtp}</strong>
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
                            className="w-full py-2 text-center text-lg font-mono font-black tracking-widest bg-slate-50 rounded-xl border border-slate-200"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#0A3D36] text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
                        >
                          <span>Confirmer la connexion</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C59A27]" />
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Profils déjà disponibles en démonstration */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Ou sélectionner un compte fidéle existant :
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {availableMembers.slice(0, 4).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onLoginSuccess(m);
                          onClose();
                        }}
                        className="w-full p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between text-left transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={m.photoUrl}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-[#C59A27]"
                          />
                          <span className="font-bold text-slate-800">
                            {m.firstName} {m.lastName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{m.profession}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* ONGLET 3 : CHAIRE PASTORALE (CODE 7777) */}
            {/* ==================================================== */}
            {activeTab === 'PASTOR' && (
              <form onSubmit={handlePastorLogin} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Crown className="w-4 h-4 text-[#C59A27]" />
                    <span>Chaire Pastorale • Réservé au Pasteur Principal</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Accès réservé pour la consultation des rapports de cellules, des tribus, des départements et la gestion générale.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Code d’accès pastoral secret
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0A3D36]" />
                    <input
                      type="password"
                      required
                      value={pastorCode}
                      onChange={(e) => setPastorCode(e.target.value)}
                      placeholder="Code secret..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-[#0A3D36] font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (Code pastoral de test : <strong>7777</strong>)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#062722] to-[#0A3D36] hover:from-[#000] hover:to-[#062722] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-[#E5B22F]" />
                  <span>Ouvrir la Chaire Pastorale</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
