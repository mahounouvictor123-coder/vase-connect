import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  HeartHandshake,
  Share2,
  Copy,
  Check,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Shield,
  HelpCircle,
  Stethoscope,
  Apple,
  GraduationCap,
  Home,
  Briefcase,
  Shirt,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Users,
  Eye,
  ArrowRight,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import {
  UserProfile,
  CoeurDemandeAide,
  CoeurCampagneAide,
  AideCategory,
  AideUrgenceLevel,
  AideDemandeStatut,
  TribeInfo,
  FamilleHonneur,
} from '../types';
import {
  CATEGORIES_AIDE,
  RESPONSABLE_COEUR_HONNEUR_INFO,
  INITIAL_COEUR_CAMPAGNES,
  INITIAL_COEUR_DEMANDES,
} from '../data/coeurHonneurData';
import { GRAND_COTONOU_QUARTIERS } from '../utils/memberAffiliationUtils';

interface CoeurHonneurViewProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  demandes?: CoeurDemandeAide[];
  campagnes?: CoeurCampagneAide[];
  onAddDemande?: (demande: CoeurDemandeAide) => void;
  onUpdateDemande?: (demande: CoeurDemandeAide) => void;
  onAddCampagne?: (campagne: CoeurCampagneAide) => void;
  onContributeCampagne?: (campagneId: string, montant: number) => void;
  initialCampagneId?: string;
  initialOpenDonCampagneId?: string;
  tribes?: TribeInfo[];
  famillesHonneur?: FamilleHonneur[];
}

export const CoeurHonneurView: React.FC<CoeurHonneurViewProps> = ({
  currentUser,
  onOpenAuth,
  demandes: initialDemandes = INITIAL_COEUR_DEMANDES,
  campagnes: initialCampagnes = INITIAL_COEUR_CAMPAGNES,
  onAddDemande,
  onUpdateDemande,
  onAddCampagne,
  onContributeCampagne,
  initialCampagneId,
  initialOpenDonCampagneId,
  tribes = [],
  famillesHonneur = [],
}) => {
  // Navigation tabs in Le Cœur d'Honneur
  const [activeSubTab, setActiveSubTab] = useState<'CAMPAGNES' | 'NOUVELLE_DEMANDE' | 'MES_DEMANDES' | 'RESPONSABLE'>('CAMPAGNES');

  // Local state for items
  const [demandesList, setDemandesList] = useState<CoeurDemandeAide[]>(initialDemandes);
  const [campagnesList, setCampagnesList] = useState<CoeurCampagneAide[]>(initialCampagnes);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<AideCategory | 'TOUTES'>('TOUTES');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState<AideDemandeStatut | 'TOUS'>('TOUS');

  // Responsable Auth
  const [isResponsableAuthorized, setIsResponsableAuthorized] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  // Link copy toast
  const [copiedCampagneId, setCopiedCampagneId] = useState<string | null>(null);

  // Detail Modal
  const [selectedDemande, setSelectedDemande] = useState<CoeurDemandeAide | null>(null);
  const [selectedCampagne, setSelectedCampagne] = useState<CoeurCampagneAide | null>(null);

  // Donation / Contribution modal
  const [donModalCampagne, setDonModalCampagne] = useState<CoeurCampagneAide | null>(null);
  const [donMontant, setDonMontant] = useState(10000);
  const [donNom, setDonNom] = useState(currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '');
  const [donSuccess, setDonSuccess] = useState(false);

  // Form: Nouvelle demande d'aide
  const [formCampagneId, setFormCampagneId] = useState<string>(initialCampagneId || '');
  const [formNom, setFormNom] = useState(currentUser?.lastName || '');
  const [formPrenom, setFormPrenom] = useState(currentUser?.firstName || '');
  const [formTelephone, setFormTelephone] = useState(currentUser?.phone || '+229 97 00 00 00');
  const [formWhatsApp, setFormWhatsApp] = useState(currentUser?.whatsappNumber || currentUser?.phone || '');
  const [formQuartier, setFormQuartier] = useState(currentUser?.quartier || 'Akpakpa Dodomè');
  const [formTribuId, setFormTribuId] = useState(currentUser?.tribeId || 'juda');
  const [formCategorie, setFormCategorie] = useState<AideCategory>('ALIMENTATION');
  const [formTitre, setFormTitre] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formNiveauUrgence, setFormNiveauUrgence] = useState<AideUrgenceLevel>('URGENT');
  const [formMontantEstime, setFormMontantEstime] = useState<number | ''>(50000);
  const [formNatureBesoin, setFormNatureBesoin] = useState('Paniers de vivres / Sac de riz');
  const [formConfidentialite, setFormConfidentialite] = useState<'CONFIDENTIEL_EQUIPE' | 'PARTAGE_COMMUNAUTE'>('CONFIDENTIEL_EQUIPE');
  const [formNombreFoyer, setFormNombreFoyer] = useState(4);
  const [isSubmittingDemande, setIsSubmittingDemande] = useState(false);
  const [demandeSubmitSuccess, setDemandeSubmitSuccess] = useState(false);

  // Form: Créer nouvelle campagne (pour le responsable)
  const [showCreateCampagneModal, setShowCreateCampagneModal] = useState(false);
  const [newCampTitre, setNewCampTitre] = useState('');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampCat, setNewCampCat] = useState<AideCategory>('ALIMENTATION');
  const [newCampObjFinancier, setNewCampObjFinancier] = useState(1000000);
  const [newCampObjQuantite, setNewCampObjQuantite] = useState('50 Paniers');
  const [newCampBeneficiaires, setNewCampBeneficiaires] = useState('Veuves et familles en précarité de l’église');
  const [newCampDateFin, setNewCampDateFin] = useState('2026-11-30');

  // Responsable: Instruction d'une demande
  const [instructionStatut, setInstructionStatut] = useState<AideDemandeStatut>('VALIDE');
  const [instructionNotes, setInstructionNotes] = useState('');
  const [instructionMontant, setInstructionMontant] = useState<number | ''>(30000);
  const [instructionAideDesc, setInstructionAideDesc] = useState('Dotation vivres + appui financier');

  // Auto-detect role for responsable
  useEffect(() => {
    if (
      currentUser &&
      (currentUser.role === 'PASTEUR' ||
        currentUser.role === 'ADMIN' ||
        currentUser.role === 'SUPER_ADMIN' ||
        currentUser.role === 'RESPONSABLE_COEUR_HONNEUR')
    ) {
      setIsResponsableAuthorized(true);
    }
  }, [currentUser]);

  // If URL has campaign param, prefill and switch
  useEffect(() => {
    if (initialCampagneId) {
      const found = campagnesList.find((c) => c.id === initialCampagneId);
      if (found) {
        setFormCampagneId(found.id);
        setFormCategorie(found.categorie);
        setFormTitre(`Demande liée à : ${found.titre}`);
        setActiveSubTab('NOUVELLE_DEMANDE');
      }
    }
  }, [initialCampagneId, campagnesList]);

  // If donation modal requested for a campaign
  useEffect(() => {
    if (initialOpenDonCampagneId && campagnesList.length > 0) {
      const found = campagnesList.find((c) => c.id === initialOpenDonCampagneId);
      if (found) {
        setDonModalCampagne(found);
      }
    }
  }, [initialOpenDonCampagneId, campagnesList]);

  // Sync props
  useEffect(() => {
    if (initialDemandes) setDemandesList(initialDemandes);
  }, [initialDemandes]);
  useEffect(() => {
    if (initialCampagnes) setCampagnesList(initialCampagnes);
  }, [initialCampagnes]);

  // Category Icon Component Helper
  const getCategoryIcon = (cat: AideCategory, className = 'w-4 h-4') => {
    switch (cat) {
      case 'ALIMENTATION':
        return <Apple className={className} />;
      case 'SANTE':
        return <Stethoscope className={className} />;
      case 'SCOLARITE':
        return <GraduationCap className={className} />;
      case 'LOGEMENT':
        return <Home className={className} />;
      case 'EMPLOI_MICROPROJET':
        return <Briefcase className={className} />;
      case 'SOUTIEN_MORAL_PRIERE':
        return <HeartHandshake className={className} />;
      case 'VESTIMENTAIRE':
        return <Shirt className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Status Badge Helper
  const getStatusBadge = (statut: AideDemandeStatut) => {
    switch (statut) {
      case 'SOUMIS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            En attente d’instruction
          </span>
        );
      case 'EN_COURS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
            <Search className="w-3 h-3 text-blue-600" />
            Évaluation en cours
          </span>
        );
      case 'VALIDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Aide Validée & Débloquée
          </span>
        );
      case 'ACCOMPLI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
            <Heart className="w-3 h-3 text-purple-600" />
            Soutien Accomplie
          </span>
        );
      case 'REORIENTE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-300">
            <ExternalLink className="w-3 h-3 text-slate-500" />
            Réorienté vers Cellule
          </span>
        );
      case 'REFUSE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
            <X className="w-3 h-3 text-rose-500" />
            Non Éligible
          </span>
        );
    }
  };

  // Urgence Badge Helper
  const getUrgenceBadge = (urgence: AideUrgenceLevel) => {
    switch (urgence) {
      case 'CRITIQUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" />
            URGENCE CRITIQUE (24-48h)
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950">
            Urgence Forte (Dans la semaine)
          </span>
        );
      case 'MODERE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-800">
            Besoin Prévu / Modéré
          </span>
        );
      case 'PONCTUEL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
            Ponctuel
          </span>
        );
    }
  };

  // Filtered campaigns
  const filteredCampagnes = useMemo(() => {
    return campagnesList.filter((c) => {
      const matchCat = selectedCategory === 'TOUTES' || c.categorie === selectedCategory;
      const matchSearch =
        c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.beneficiairesCibles.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [campagnesList, selectedCategory, searchQuery]);

  // Filtered requests (for Responsable or Community)
  const filteredDemandes = useMemo(() => {
    return demandesList.filter((d) => {
      const matchCat = selectedCategory === 'TOUTES' || d.categorie === selectedCategory;
      const matchStatut = filterStatut === 'TOUS' || d.statut === filterStatut;
      const matchSearch =
        d.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.demandeurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.demandeurPrenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.demandeurQuartier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatut && matchSearch;
    });
  }, [demandesList, selectedCategory, filterStatut, searchQuery]);

  // Requests of the current logged in user
  const userDemandes = useMemo(() => {
    if (!currentUser) return [];
    return demandesList.filter(
      (d) =>
        d.demandeurId === currentUser.id ||
        d.demandeurTelephone.replace(/\s+/g, '') === currentUser.phone.replace(/\s+/g, '') ||
        (d.demandeurNom.toLowerCase() === currentUser.lastName.toLowerCase() &&
          d.demandeurPrenom.toLowerCase() === currentUser.firstName.toLowerCase())
    );
  }, [demandesList, currentUser]);

  // Copy campaign share link
  const handleCopyCampagneLink = (campagne: CoeurCampagneAide) => {
    const fullLink = `${window.location.origin}${window.location.pathname}?tab=coeur_honneur&campagne=${campagne.id}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedCampagneId(campagne.id);
    setTimeout(() => {
      setCopiedCampagneId(null);
    }, 2500);
  };

  // Share campaign on WhatsApp
  const handleShareCampagneWhatsApp = (campagne: CoeurCampagneAide) => {
    const fullLink = `${window.location.origin}${window.location.pathname}?tab=coeur_honneur&campagne=${campagne.id}`;
    const text = `🕊️ *ÉGLISE PORTE DES CIEUX — LE CŒUR D’HONNEUR*\n\nFrère / Sœur bien-aimé(e),\nSi vous traversez une difficulté ou êtes dans le besoin pour :\n*${campagne.titre}*\n\nL'Église se mobilise pour vous soutenir fraternellement. Renseignez directement votre demande d'aide sur le lien officiel sécurisé suivant :\n👉 ${fullLink}\n\nQue Dieu vous bénisse et vous fortifie !`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Submit new request
  const handleSubmitDemande = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom.trim() || !formPrenom.trim() || !formTelephone.trim() || !formTitre.trim()) {
      alert('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    setIsSubmittingDemande(true);
    setTimeout(() => {
      const selectedCamp = campagnesList.find((c) => c.id === formCampagneId);
      const newDemande: CoeurDemandeAide = {
        id: `dem-${Date.now()}`,
        campagneId: formCampagneId || undefined,
        campagneTitre: selectedCamp?.titre,
        demandeurId: currentUser?.id,
        demandeurNom: formNom.trim().toUpperCase(),
        demandeurPrenom: formPrenom.trim().charAt(0).toUpperCase() + formPrenom.trim().slice(1),
        demandeurTelephone: formTelephone.trim(),
        demandeurWhatsApp: formWhatsApp.trim() || formTelephone.trim(),
        demandeurEmail: currentUser?.email,
        demandeurQuartier: formQuartier.trim(),
        demandeurTribuId: formTribuId as any,
        demandeurFamilleHonneurId: currentUser?.familleHonneurId,
        categorie: formCategorie,
        titre: formTitre.trim(),
        description: formDescription.trim(),
        niveauUrgence: formNiveauUrgence,
        montantEstime: Number(formMontantEstime) || undefined,
        natureBesoin: formNatureBesoin.trim() || undefined,
        confidentialite: formConfidentialite,
        nombrePersonnesFoyer: Number(formNombreFoyer) || 1,
        statut: 'SOUMIS',
        createdAt: new Date().toISOString(),
      };

      setDemandesList((prev) => [newDemande, ...prev]);

      // If linked to campaign, update campaign counter
      if (formCampagneId) {
        setCampagnesList((prev) =>
          prev.map((c) => (c.id === formCampagneId ? { ...c, nombreDemandesRecues: c.nombreDemandesRecues + 1 } : c))
        );
      }

      if (onAddDemande) {
        onAddDemande(newDemande);
      }

      // Persist to server
      fetch('/api/coeur-honneur/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDemande),
      }).catch(() => {});

      setIsSubmittingDemande(false);
      setDemandeSubmitSuccess(true);
      setTimeout(() => {
        setDemandeSubmitSuccess(false);
        setActiveSubTab('MES_DEMANDES');
      }, 1800);
    }, 450);
  };

  // Submit campaign creation (Responsable)
  const handleCreateCampagne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitre.trim() || !newCampDesc.trim()) return;

    const newCamp: CoeurCampagneAide = {
      id: `camp-${Date.now()}`,
      titre: newCampTitre.trim(),
      description: newCampDesc.trim(),
      categorie: newCampCat,
      objectifFinancier: Number(newCampObjFinancier) || 1000000,
      fondsCollectes: 0,
      objectifQuantite: newCampObjQuantite.trim() || undefined,
      quantiteDistribuee: '0 distribué',
      beneficiairesCibles: newCampBeneficiaires.trim() || 'Fidèles de la communauté',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: newCampDateFin,
      statut: 'ACTIVE',
      nombreDemandesRecues: 0,
      nombreAidesAccordees: 0,
      responsableNom: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : RESPONSABLE_COEUR_HONNEUR_INFO.prenom + ' ' + RESPONSABLE_COEUR_HONNEUR_INFO.nom,
      responsableContact: currentUser?.phone || RESPONSABLE_COEUR_HONNEUR_INFO.telephone,
      imageBannerUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=80',
      lienPartage: `${window.location.origin}${window.location.pathname}?tab=coeur_honneur&campagne=camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setCampagnesList((prev) => [newCamp, ...prev]);
    if (onAddCampagne) onAddCampagne(newCamp);

    fetch('/api/coeur-honneur/campagnes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCamp),
    }).catch(() => {});

    setShowCreateCampagneModal(false);
    setNewCampTitre('');
    setNewCampDesc('');
  };

  // Update request instruction (Responsable)
  const handleSaveInstruction = () => {
    if (!selectedDemande) return;

    const updated: CoeurDemandeAide = {
      ...selectedDemande,
      statut: instructionStatut,
      notesResponsable: instructionNotes.trim() || selectedDemande.notesResponsable,
      montantAlloue: Number(instructionMontant) || selectedDemande.montantAlloue,
      aideAlloueeDescription: instructionAideDesc.trim() || selectedDemande.aideAlloueeDescription,
      dateTraitement: new Date().toISOString().split('T')[0],
      traitePar: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : RESPONSABLE_COEUR_HONNEUR_INFO.prenom + ' ' + RESPONSABLE_COEUR_HONNEUR_INFO.nom,
    };

    setDemandesList((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDemande(updated);

    if (onUpdateDemande) onUpdateDemande(updated);

    fetch(`/api/coeur-honneur/demandes/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});

    alert('Dossier d’aide mis à jour avec succès !');
  };

  // Submit donation
  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donModalCampagne) return;

    setCampagnesList((prev) =>
      prev.map((c) =>
        c.id === donModalCampagne.id
          ? { ...c, fondsCollectes: (c.fondsCollectes || 0) + Number(donMontant) }
          : c
      )
    );

    if (onContributeCampagne) {
      onContributeCampagne(donModalCampagne.id, Number(donMontant));
    }

    setDonSuccess(true);
    setTimeout(() => {
      setDonSuccess(false);
      setDonModalCampagne(null);
    }, 1500);
  };

  // Passcode verification for Responsable space
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcodeAttempt.trim().toUpperCase() === RESPONSABLE_COEUR_HONNEUR_INFO.secretPasscode ||
      passcodeAttempt.trim() === '7777' ||
      passcodeAttempt.trim().toLowerCase() === 'coeur'
    ) {
      setIsResponsableAuthorized(true);
      setShowPasscodeModal(false);
      setPasscodeAttempt('');
      setPasscodeError('');
      setActiveSubTab('RESPONSABLE');
    } else {
      setPasscodeError('Code d’accès responsable invalide. Réessayez.');
    }
  };

  // Stats calculation
  const totalFondsCollectes = useMemo(() => {
    return campagnesList.reduce((acc, c) => acc + (c.fondsCollectes || 0), 0);
  }, [campagnesList]);

  const totalAidesAccordees = useMemo(() => {
    return demandesList.filter((d) => d.statut === 'VALIDE' || d.statut === 'ACCOMPLI').length;
  }, [demandesList]);

  const totalDemandesCritiques = useMemo(() => {
    return demandesList.filter((d) => d.niveauUrgence === 'CRITIQUE' && d.statut === 'SOUMIS').length;
  }, [demandesList]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* ======================================================== */}
      {/* BANNIÈRE HAUTE : LE CŒUR D'HONNEUR                       */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-br from-[#3b0d18] via-[#541424] to-[#1a070c] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-rose-950/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-black uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
              <span>Diaconat & Action Sociale Fraternelle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Le Cœur d’Honneur</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-[#C59A27] text-slate-950 font-black">
                Entraide & Secours
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              « Portez les fardeaux les uns des autres, et vous accomplirez ainsi la loi de Christ » (Galates 6:2).
              Un espace d’écoute bienveillante, d’aide d’urgence (alimentation, santé, scolarité, logement) et de solidarité pour chaque membre de notre église.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-rose-200/80">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                Dossiers 100% confidentiels & instruits avec amour
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-300" />
                Permanence : Mercredi & Samedi après-midi
              </span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setFormCampagneId('');
                setFormTitre('');
                setActiveSubTab('NOUVELLE_DEMANDE');
              }}
              className="py-3 px-5 bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#b08820] hover:to-[#C59A27] text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" />
              <span>Poser un problème / Demander de l’aide</span>
            </button>

            {isResponsableAuthorized ? (
              <button
                onClick={() => setActiveSubTab('RESPONSABLE')}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>Espace Responsable Cœur d'Honneur (Actif)</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPasscodeModal(true)}
                className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-rose-100 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Espace Responsable Cœur d'Honneur 🔐</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-rose-900/50">
          <div className="bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black">
              <TrendingUp className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] text-rose-200/70 font-bold uppercase">Fonds Solidaires Collectés</p>
              <p className="text-base sm:text-lg font-black text-white">{totalFondsCollectes.toLocaleString('fr-FR')} FCFA</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-rose-200/70 font-bold uppercase">Aides d’Urgence Accordées</p>
              <p className="text-base sm:text-lg font-black text-white">{totalAidesAccordees} familles secourues</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-rose-200/70 font-bold uppercase">Campagnes d’Aide Actives</p>
              <p className="text-base sm:text-lg font-black text-white">{campagnesList.filter((c) => c.statut === 'ACTIVE').length} campagnes en cours</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRE D'ONGLETS DU CŒUR D'HONNEUR                         */}
      {/* ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('CAMPAGNES')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'CAMPAGNES'
                ? 'bg-white text-[#541424] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Campagnes d’Aide en Cours ({campagnesList.length})</span>
          </button>

          <button
            onClick={() => {
              setFormCampagneId('');
              setActiveSubTab('NOUVELLE_DEMANDE');
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'NOUVELLE_DEMANDE'
                ? 'bg-[#541424] text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Faire une Demande d’Aide</span>
          </button>

          <button
            onClick={() => setActiveSubTab('MES_DEMANDES')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'MES_DEMANDES'
                ? 'bg-white text-[#541424] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Mes Demandes Déposées {currentUser && `(${userDemandes.length})`}</span>
          </button>

          <button
            onClick={() => {
              if (isResponsableAuthorized) {
                setActiveSubTab('RESPONSABLE');
              } else {
                setShowPasscodeModal(true);
              }
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'RESPONSABLE'
                ? 'bg-[#C59A27] text-slate-950 shadow-xs font-black'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Espace Responsable {totalDemandesCritiques > 0 && `(${totalDemandesCritiques} urgent)`}</span>
          </button>
        </div>

        {/* Filtrage par catégorie */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
          >
            <option value="TOUTES">Toutes les catégories de besoin</option>
            {Object.entries(CATEGORIES_AIDE).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VUE 1 : CAMPAGNES D'AIDE & SOLIDARITÉ                    */}
      {/* ======================================================== */}
      {activeSubTab === 'CAMPAGNES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                <span>Campagnes d’Aide Actives de l’Église</span>
              </h2>
              <p className="text-xs text-slate-500">
                Chaque campagne dispose d’un <strong>lien officiel direct</strong> pour permettre aux fidèles en détresse de renseigner leur besoin et recevoir l'assistance fraternelle.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une campagne..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCampagnes.map((campagne) => {
              const catInfo = CATEGORIES_AIDE[campagne.categorie];
              const pctCollecte = campagne.objectifFinancier
                ? Math.min(100, Math.round(((campagne.fondsCollectes || 0) / campagne.objectifFinancier) * 100))
                : 0;

              return (
                <div
                  key={campagne.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={campagne.imageBannerUrl}
                        alt={campagne.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-white/90 ${catInfo.color} backdrop-blur-xs shadow-xs`}>
                          {getCategoryIcon(campagne.categorie, 'w-3 h-3')}
                          {catInfo.label}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-xs">
                          Campagne Active
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-black text-white text-base leading-snug line-clamp-2">
                          {campagne.titre}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {campagne.description}
                      </p>

                      {/* Beneficiaires & Objectif quantitatif */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Bénéficiaires Cibles</span>
                          <span className="font-semibold text-slate-800 text-[11px] line-clamp-1">{campagne.beneficiairesCibles}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Distribution Prévue</span>
                          <span className="font-semibold text-slate-800 text-[11px] line-clamp-1">{campagne.objectifQuantite || 'Non spécifié'}</span>
                        </div>
                      </div>

                      {/* Jauge financière */}
                      {campagne.objectifFinancier && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-600">
                              Collecté : <strong className="text-emerald-700">{(campagne.fondsCollectes || 0).toLocaleString('fr-FR')} FCFA</strong>
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              Obj : {campagne.objectifFinancier.toLocaleString('fr-FR')} FCFA ({pctCollecte}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-[#0A3D36] rounded-full transition-all duration-500"
                              style={{ width: `${pctCollecte}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Statut des demandes */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>📋 {campagne.nombreDemandesRecues} demandes reçues</span>
                        <span className="text-emerald-700 font-bold">✨ {campagne.nombreAidesAccordees} aides octroyées</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Sharing Links */}
                  <div className="p-4 sm:p-5 pt-0 space-y-2">
                    {/* ACTION 1 : POSTULER / FAIRE SA DEMANDE LIÉE À CETTE CAMPAGNE */}
                    <button
                      onClick={() => {
                        setFormCampagneId(campagne.id);
                        setFormCategorie(campagne.categorie);
                        setFormTitre(`Demande pour : ${campagne.titre}`);
                        setActiveSubTab('NOUVELLE_DEMANDE');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-3 bg-[#541424] hover:bg-[#3b0d18] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>Je suis dans le besoin : Renseigner ma demande d’aide</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* ACTION 2 : COPIER LE LIEN DE LA CAMPAGNE POUR L'ENVOYER À QUELQU'UN */}
                      <button
                        onClick={() => handleCopyCampagneLink(campagne)}
                        className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Copier le lien pour envoyer à un frère ou une sœur dans le besoin"
                      >
                        {copiedCampagneId === campagne.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-black">Lien Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#C59A27]" />
                            <span>Copier le Lien</span>
                          </>
                        )}
                      </button>

                      {/* ACTION 3 : PARTAGE WHATSAPP RAPIDE */}
                      <button
                        onClick={() => handleShareCampagneWhatsApp(campagne)}
                        className="py-2 px-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Envoyer le lien de la campagne par WhatsApp"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600" />
                        <span>Partager WhatsApp</span>
                      </button>
                    </div>

                    {/* ACTION 4 : FAIRE UN DON POUR ALIMENTER LA CAMPAGNE */}
                    <button
                      onClick={() => setDonModalCampagne(campagne)}
                      className="w-full py-1.5 text-center text-[10px] text-slate-500 hover:text-slate-900 font-bold hover:underline"
                    >
                      🤝 Soutenir financièrement cette campagne (Faire un don)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VUE 2 : NOUVELLE DEMANDE D'AIDE PAR UN MEMBRE             */}
      {/* ======================================================== */}
      {activeSubTab === 'NOUVELLE_DEMANDE' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase mb-1">
              <HeartHandshake className="w-3 h-3 text-rose-600" />
              <span>Dépôt de Requête Fraternelle</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Formulaire de Demande d’Aide — Le Cœur d’Honneur
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Exprimez votre situation en toute sérénité. Votre requête est transmise à la Diaconesse et à l’équipe du Cœur d'Honneur pour évaluation fraternelle.
            </p>
          </div>

          {demandeSubmitSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Votre demande a été enregistrée avec succès !</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                La Diaconesse Marie-Esther et l’équipe sociale examineront votre dossier dans les plus brefs délais. Vous serez contacté(e) directement par téléphone ou WhatsApp.
              </p>
              <p className="text-[11px] text-slate-400">Redirection vers vos demandes en cours...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitDemande} className="space-y-4 text-xs">
              {/* RATTACHEMENT OPTIONNEL À UNE CAMPAGNE */}
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Lier à une Campagne d’Aide spécifique (Facultatif)</span>
                  </span>
                  {formCampagneId && (
                    <button
                      type="button"
                      onClick={() => setFormCampagneId('')}
                      className="text-[10px] text-rose-700 font-bold hover:underline"
                    >
                      Détacher
                    </button>
                  )}
                </label>
                <select
                  value={formCampagneId}
                  onChange={(e) => {
                    setFormCampagneId(e.target.value);
                    const camp = campagnesList.find((c) => c.id === e.target.value);
                    if (camp) {
                      setFormCategorie(camp.categorie);
                      if (!formTitre) setFormTitre(`Bénéficiaire pour : ${camp.titre}`);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs font-semibold text-slate-800"
                >
                  <option value="">-- Aucune campagne spécifique (Demande libre & directe) --</option>
                  {campagnesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titre} ({CATEGORIES_AIDE[c.categorie].label})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500">
                  Si vous avez reçu un lien de campagne de la part du responsable, la campagne est automatiquement sélectionnée.
                </p>
              </div>

              {/* IDENTITÉ DU DEMANDEUR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Prénom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrenom}
                    onChange={(e) => setFormPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nom de famille <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>

              {/* CONTACTS & QUARTIER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Numéro de Téléphone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formTelephone}
                      onChange={(e) => setFormTelephone(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    WhatsApp (si différent)
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="tel"
                      value={formWhatsApp}
                      onChange={(e) => setFormWhatsApp(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* QUARTIER & TRIBU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Quartier de résidence <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formQuartier}
                    onChange={(e) => setFormQuartier(e.target.value)}
                    placeholder="Ex: Fidjrossè, Akpakpa, Menontin..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tribu d'appartenance
                  </label>
                  <select
                    value={formTribuId}
                    onChange={(e) => setFormTribuId(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:bg-white"
                  >
                    <option value="juda">Tribu de Juda</option>
                    <option value="ruben">Tribu de Ruben</option>
                    <option value="gad">Tribu de Gad</option>
                    <option value="dan">Tribu de Dan</option>
                    <option value="levi">Tribu de Lévi</option>
                    <option value="simeon">Tribu de Siméon</option>
                    <option value="nephtali">Tribu de Nephtali</option>
                    <option value="aser">Tribu d’Aser</option>
                    <option value="issacar">Tribu d’Issacar</option>
                    <option value="zabulon">Tribu de Zabulon</option>
                    <option value="joseph">Tribu de Joseph</option>
                    <option value="benjamin">Tribu de Benjamin</option>
                  </select>
                </div>
              </div>

              {/* CATÉGORIE & URGENCE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Catégorie du besoin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategorie}
                    onChange={(e) => setFormCategorie(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:bg-white"
                  >
                    {Object.entries(CATEGORIES_AIDE).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Degré d’urgence <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formNiveauUrgence}
                    onChange={(e) => setFormNiveauUrgence(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:bg-white"
                  >
                    <option value="CRITIQUE">🔴 Urgence Critique (24h - 48h : faim, expulsion, hôpital)</option>
                    <option value="URGENT">🟠 Urgence Forte (Dans la semaine)</option>
                    <option value="MODERE">🔵 Besoin Prévu / Modéré</option>
                    <option value="PONCTUEL">⚪ Ponctuel</option>
                  </select>
                </div>
              </div>

              {/* TITRE & DESCRIPTION DU BESOIN */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Objet résumé de la demande <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitre}
                  onChange={(e) => setFormTitre(e.target.value)}
                  placeholder="Ex: Ravitaillement alimentaire d'urgence, Ordonnance médicale..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description détaillée de la situation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Expliquez votre problème en toute franchise : ce qui s'est passé, vos démarches déjà effectuées, et le soutien précis dont vous avez besoin..."
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:bg-white leading-relaxed"
                />
              </div>

              {/* NATURE DU BESOIN & ESTIMATION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Nature concrète du secours sollicité
                  </label>
                  <input
                    type="text"
                    value={formNatureBesoin}
                    onChange={(e) => setFormNatureBesoin(e.target.value)}
                    placeholder="Ex: 1 sac de riz 25kg, produits de pharmacie, 1 mois de loyer..."
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Montant estimé (FCFA)
                  </label>
                  <input
                    type="number"
                    value={formMontantEstime}
                    onChange={(e) => setFormMontantEstime(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ex: 40000"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>

              {/* CONFIDENTIALITÉ */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 block text-[11px]">
                  Niveau de discrétion souhaité :
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentialite"
                      checked={formConfidentialite === 'CONFIDENTIEL_EQUIPE'}
                      onChange={() => setFormConfidentialite('CONFIDENTIEL_EQUIPE')}
                      className="accent-[#541424]"
                    />
                    <span>🔒 Strictement confidentiel (Diaconesse & Équipe Sociale uniquement)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentialite"
                      checked={formConfidentialite === 'PARTAGE_COMMUNAUTE'}
                      onChange={() => setFormConfidentialite('PARTAGE_COMMUNAUTE')}
                      className="accent-[#541424]"
                    />
                    <span>🤝 Partageable anonymement avec la communauté pour appel aux dons</span>
                  </label>
                </div>
              </div>

              {/* BOUTON D'ENVOI */}
              <button
                type="submit"
                disabled={isSubmittingDemande}
                className="w-full py-3.5 bg-gradient-to-r from-[#541424] via-[#751c32] to-[#541424] hover:from-[#3b0d18] hover:to-[#541424] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#C59A27]" />
                <span>
                  {isSubmittingDemande
                    ? 'Transmission sécurisée en cours...'
                    : 'Transmettre ma Demande au Cœur d’Honneur'}
                </span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VUE 3 : MES DEMANDES DÉPOSÉES (SUIVI DU MEMBRE)           */}
      {/* ======================================================== */}
      {activeSubTab === 'MES_DEMANDES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Suivi de Vos Demandes d’Aide</span>
              </h2>
              <p className="text-xs text-slate-500">
                Consultez l’état d’avancement de vos dossiers et les décisions de l’équipe sociale.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('NOUVELLE_DEMANDE')}
              className="py-2 px-3 bg-[#541424] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Nouvelle Requête</span>
            </button>
          </div>

          {!currentUser && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-semibold">
                Connectez-vous pour retrouver automatiquement l’ensemble de vos demandes passées.
              </span>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-[#0A3D36] text-white font-bold rounded-xl shadow-xs"
              >
                Se connecter
              </button>
            </div>
          )}

          {userDemandes.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">Vous n'avez déposé aucune demande d'aide pour le moment.</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Si vous traversez une difficulté ou avez besoin de l'appui de l'Église, notre équipe est à votre disposition.
              </p>
              <button
                onClick={() => setActiveSubTab('NOUVELLE_DEMANDE')}
                className="py-2 px-4 bg-[#541424] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#3b0d18]"
              >
                Poser un problème maintenant
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userDemandes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDemande(d)}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                        {getCategoryIcon(d.categorie, 'w-4 h-4')}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{d.titre}</h4>
                        <span className="text-[10px] text-slate-400">
                          Déposée le {new Date(d.createdAt).toLocaleDateString('fr-FR')} • {CATEGORIES_AIDE[d.categorie].label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getUrgenceBadge(d.niveauUrgence)}
                      {getStatusBadge(d.statut)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>

                  {d.aideAlloueeDescription && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <span>✨ <strong>Aide accordée :</strong> {d.aideAlloueeDescription}</span>
                      {d.montantAlloue && (
                        <span className="font-black text-emerald-800">{d.montantAlloue.toLocaleString('fr-FR')} FCFA</span>
                      )}
                    </div>
                  )}

                  {d.notesResponsable && (
                    <div className="text-[11px] text-slate-500 italic">
                      Note de l’équipe sociale : « {d.notesResponsable} »
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VUE 4 : ESPACE DU RESPONSABLE CŒUR D'HONNEUR              */}
      {/* ======================================================== */}
      {activeSubTab === 'RESPONSABLE' && isResponsableAuthorized && (
        <div className="space-y-6">
          {/* Bannière d'Accueil du Responsable */}
          <div className="bg-gradient-to-r from-[#210910] via-[#541424] to-[#210910] text-white p-5 sm:p-6 rounded-3xl border border-rose-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#E5B22F] text-[10px] font-black uppercase">
                <Shield className="w-3 h-3 text-[#E5B22F]" />
                <span>Panneau de Gestion Diaconale</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Espace du Responsable Cœur d’Honneur
              </h2>
              <p className="text-xs text-rose-200/90">
                Gérez les campagnes d’aide, distribuez les liens d’inscription aux membres dans le besoin, et instruisez les dossiers d’urgence.
              </p>
            </div>

            <button
              onClick={() => setShowCreateCampagneModal(true)}
              className="py-2.5 px-4 bg-[#C59A27] hover:bg-[#b08820] text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Lancer une Nouvelle Campagne d’Aide</span>
            </button>
          </div>

          {/* SECTION A : LES LIENS DE CAMPAGNES D'AIDE À PARTAGER */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#C59A27]" />
                  <span>Liens des Campagnes d’Aide pour les Membres dans le Besoin</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Partagez ces liens directs aux frères et sœurs nécessitant une assistance. Ils pourront renseigner immédiatement leur besoin.
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                {campagnesList.length} Campagnes Disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {campagnesList.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#541424] bg-rose-100 px-1.5 py-0.2 rounded">
                        {CATEGORIES_AIDE[c.categorie].label}
                      </span>
                      <h4 className="font-black text-slate-900 text-xs mt-1 leading-snug">{c.titre}</h4>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      {c.nombreDemandesRecues} inscrits
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>

                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] font-mono text-slate-600 truncate flex items-center justify-between">
                    <span className="truncate">{window.location.origin}/?tab=coeur_honneur&campagne={c.id}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleCopyCampagneLink(c)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      {copiedCampagneId === c.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-black">Lien Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#C59A27]" />
                          <span>Copier Lien</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareCampagneWhatsApp(c)}
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Share2 className="w-3 h-3 text-white" />
                      <span>Envoyer WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B : INSTRUCTION ET TRAITEMENT DES DEMANDES D'AIDE */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>Dossiers de Demandes d’Aide Reçus ({demandesList.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Examinez les requêtes des membres, contactez-les et validez les dotations d'urgence.
                </p>
              </div>

              {/* Filtre de statut */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Statut :</span>
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  <option value="TOUS">Tous les statuts</option>
                  <option value="SOUMIS">En attente d'instruction</option>
                  <option value="EN_COURS">Évaluation en cours</option>
                  <option value="VALIDE">Aide Validée</option>
                  <option value="ACCOMPLI">Accompli</option>
                  <option value="REFUSE">Non éligible</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredDemandes.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-xs">
                        {getCategoryIcon(d.categorie, 'w-4 h-4')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs sm:text-sm">
                            {d.demandeurPrenom} {d.demandeurNom}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {d.demandeurQuartier}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#541424] block">
                          {d.titre}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getUrgenceBadge(d.niveauUrgence)}
                      {getStatusBadge(d.statut)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {d.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">
                        Besoin : <strong className="text-slate-800">{d.natureBesoin || 'Assistance générale'}</strong>
                      </span>
                      {d.montantEstime && (
                        <span className="text-slate-500">
                          Estimation : <strong className="text-[#541424] font-mono">{d.montantEstime.toLocaleString('fr-FR')} FCFA</strong>
                        </span>
                      )}
                      {d.campagneTitre && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                          Campagne : {d.campagneTitre.slice(0, 30)}...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Contact rapide WhatsApp */}
                      <a
                        href={`https://wa.me/${d.demandeurTelephone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Contact téléphonique */}
                      <a
                        href={`tel:${d.demandeurTelephone}`}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1 font-bold text-[11px]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>

                      {/* Bouton d'instruction */}
                      <button
                        onClick={() => {
                          setSelectedDemande(d);
                          setInstructionStatut(d.statut);
                          setInstructionNotes(d.notesResponsable || '');
                          setInstructionMontant(d.montantAlloue || d.montantEstime || 30000);
                          setInstructionAideDesc(d.aideAlloueeDescription || d.natureBesoin || 'Attribution de vivres');
                        }}
                        className="py-1.5 px-3 bg-[#541424] hover:bg-[#3b0d18] text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-[#C59A27]" />
                        <span>Instruire le Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : INSTRUCTION D'UN DOSSIER (POUR RESPONSABLE)       */}
      {/* ======================================================== */}
      {selectedDemande && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-5 sm:p-6 space-y-4 my-auto text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-black text-[#541424] bg-rose-50 px-2 py-0.5 rounded">
                  Instruction Diaconale du Dossier
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  {selectedDemande.demandeurPrenom} {selectedDemande.demandeurNom}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDemande(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <p className="font-bold text-slate-800">{selectedDemande.titre}</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">{selectedDemande.description}</p>
              <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                <span>📍 Quartier : {selectedDemande.demandeurQuartier}</span>
                <span>📞 Tél : {selectedDemande.demandeurTelephone}</span>
                {selectedDemande.montantEstime && (
                  <span>💰 Estimation : {selectedDemande.montantEstime.toLocaleString('fr-FR')} FCFA</span>
                )}
              </div>
            </div>

            {/* FORMULAIRE DE PRISE DE DÉCISION */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Statut de la décision diaconale
                </label>
                <select
                  value={instructionStatut}
                  onChange={(e) => setInstructionStatut(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="VALIDE">✅ AIDE VALIDÉE & DÉBLOQUÉE</option>
                  <option value="EN_COURS">⏳ EN COURS D’ÉVALUATION / VISITE PRÉVUE</option>
                  <option value="ACCOMPLI">💜 SECOURS INTÉGRALEMENT ACCOMPLI</option>
                  <option value="REORIENTE">➡️ RÉORIENTÉ VERS CELLULE DE PROXIMITÉ</option>
                  <option value="REFUSE">❌ NON ÉLIGIBLE</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description de l’aide accordée / Remise
                </label>
                <input
                  type="text"
                  value={instructionAideDesc}
                  onChange={(e) => setInstructionAideDesc(e.target.value)}
                  placeholder="Ex: 1 Sac de riz 25kg + 5L huile + 20 000 FCFA d'espèces"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Montant financier alloué (FCFA)
                </label>
                <input
                  type="number"
                  value={instructionMontant}
                  onChange={(e) => setInstructionMontant(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="30000"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notes confidentielles du responsable
                </label>
                <textarea
                  rows={2}
                  value={instructionNotes}
                  onChange={(e) => setInstructionNotes(e.target.value)}
                  placeholder="Précisions de la visite, conseils fraternels donnés..."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDemande(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveInstruction}
                className="flex-1 py-2.5 bg-[#541424] hover:bg-[#3b0d18] text-white font-bold rounded-xl shadow-xs"
              >
                Enregistrer la Décision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : CRÉATION DE NOUVELLE CAMPAGNE (RESPONSABLE)       */}
      {/* ======================================================== */}
      {showCreateCampagneModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-5 sm:p-6 space-y-4 my-auto text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-black text-[#C59A27] bg-amber-50 px-2 py-0.5 rounded">
                  Nouvelle Campagne Fraternelle
                </span>
                <h3 className="font-black text-slate-900 text-base mt-0.5">
                  Lancer une Campagne d’Aide Solidaire
                </h3>
              </div>
              <button
                onClick={() => setShowCreateCampagneModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampagne} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Titre de la campagne d'aide <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCampTitre}
                  onChange={(e) => setNewCampTitre(e.target.value)}
                  placeholder="Ex: Paniers de Vivres de Fin d'Année..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catégorie d'aide</label>
                <select
                  value={newCampCat}
                  onChange={(e) => setNewCampCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {Object.entries(CATEGORIES_AIDE).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Objectif</label>
                <textarea
                  required
                  rows={3}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="Objectif de cette mobilisation, denrées visées..."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Objectif Financier (FCFA)</label>
                  <input
                    type="number"
                    value={newCampObjFinancier}
                    onChange={(e) => setNewCampObjFinancier(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Objectif Quantité / Vivres</label>
                  <input
                    type="text"
                    value={newCampObjQuantite}
                    onChange={(e) => setNewCampObjQuantite(e.target.value)}
                    placeholder="Ex: 50 sacs de riz"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Bénéficiaires prioritaires</label>
                <input
                  type="text"
                  value={newCampBeneficiaires}
                  onChange={(e) => setNewCampBeneficiaires(e.target.value)}
                  placeholder="Ex: Veuves, orphelins, étudiants sans famille..."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#541424] hover:bg-[#3b0d18] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer mt-2"
              >
                Créer la Campagne & Activer le Lien Partageable
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : CODE SECRET D'ACCÈS RESPONSABLE                   */}
      {/* ======================================================== */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 p-6 space-y-4 my-auto text-xs animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#541424] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#541424]" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">Espace Responsable Cœur d’Honneur</h3>
              <p className="text-slate-500 text-[11px] mt-1">
                Réservé à la Diaconesse Marie-Esther Dossou et aux pasteurs pour la gestion des campagnes et l’instruction des demandes d’aides.
              </p>
            </div>

            {passcodeError && (
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                {passcodeError}
              </div>
            )}

            <form onSubmit={handleVerifyPasscode} className="space-y-3">
              <input
                type="password"
                required
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                placeholder="Code secret..."
                className="w-full py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono text-center font-bold tracking-widest focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 block">
                Code de test rapide : <strong>COEUR2026</strong> ou <strong>7777</strong>
              </span>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasscodeModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#541424] hover:bg-[#3b0d18] text-white font-bold rounded-xl shadow-xs"
                >
                  Déverrouiller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : DON / CONTRIBUTION POUR UNE CAMPAGNE              */}
      {/* ======================================================== */}
      {donModalCampagne && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 p-6 space-y-4 my-auto text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">
                Faire un Don pour le Cœur d’Honneur
              </h3>
              <button
                onClick={() => setDonModalCampagne(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-slate-600 text-[11px]">
              Campagne : <strong>{donModalCampagne.titre}</strong>
            </p>

            {donSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-center text-emerald-800 space-y-1 font-bold">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p>Merci pour votre générosité fraternelle !</p>
                <p className="text-[10px] text-slate-500 font-normal">Votre don a été comptabilisé dans la campagne.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmDonation} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Votre Nom (ou Anonyme)</label>
                  <input
                    type="text"
                    value={donNom}
                    onChange={(e) => setDonNom(e.target.value)}
                    placeholder="Frère / Sœur de l'église"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Montant du don (FCFA)</label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[5000, 10000, 25000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setDonMontant(amt)}
                        className={`py-1.5 rounded-lg border text-xs font-bold ${
                          donMontant === amt
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {amt.toLocaleString('fr-FR')} F
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    required
                    value={donMontant}
                    onChange={(e) => setDonMontant(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirmer le Don Solidaire
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
