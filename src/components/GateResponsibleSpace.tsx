import React, { useState, useMemo, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  Send,
  Plus,
  Search,
  BookOpen,
  Target,
  FileText,
  Calendar,
  AlertCircle,
  Building,
  TrendingUp,
  Share2,
  Check,
  Trash2,
  ArrowRight,
  UserCheck,
  Briefcase,
  HelpCircle,
  Compass,
} from 'lucide-react';
import {
  InfluenceGate,
  GateMemberProfile,
  UserProfile,
  GateResponsibleInfo,
  GateProjectItem,
  GateAnnouncementItem,
  GateRapportPastorale,
} from '../types';
import { GATE_RESPONSIBLES, getGateResponsibles } from '../data/gateLeadershipData';
import { getLeadershipAccounts } from '../data/leadershipData';

interface GateResponsibleSpaceProps {
  gate: InfluenceGate;
  gateMembers: GateMemberProfile[];
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

export const GateResponsibleSpace: React.FC<GateResponsibleSpaceProps> = ({
  gate,
  gateMembers,
  currentUser,
  onOpenAuth,
  onOpenAssistantWithPrompt,
}) => {
  const [currentGateResponsibles, setCurrentGateResponsibles] = useState(() => getGateResponsibles());

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentGateResponsibles(getGateResponsibles());
    };
    window.addEventListener('vases-leadership-updated', handleUpdate);
    return () => window.removeEventListener('vases-leadership-updated', handleUpdate);
  }, []);

  // Responsible profile for this gate
  const responsibleInfo = useMemo(() => {
    return currentGateResponsibles[gate.id] || gate.responsable || GATE_RESPONSIBLES[gate.id] || GATE_RESPONSIBLES['croyance_coutume'];
  }, [gate, currentGateResponsibles]);

  // Auth lock state (persisted or session)
  const authKey = `vases_gate_resp_auth_${gate.id}`;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(authKey) === 'true';
    } catch {
      return false;
    }
  });

  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Sub tabs in the responsible space
  const [activeSubTab, setActiveSubTab] = useState<'MEMBRES' | 'COMMUNICATIONS' | 'PROJETS' | 'RAPPORT'>('MEMBRES');

  // Search in members
  const [memberSearch, setMemberSearch] = useState('');
  const [filterOnlyMentors, setFilterOnlyMentors] = useState(false);
  const [filterOnlyPartners, setFilterOnlyPartners] = useState(false);

  // Local certified members state (in addition to gate members)
  const [certifiedMemberIds, setCertifiedMemberIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`vases_gate_certified_${gate.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Projects state
  const [projectsList, setProjectsList] = useState<GateProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem(`vases_gate_projects_${gate.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: `proj-${gate.id}-1`,
        gateId: gate.id,
        titre: `Plan d'Impact & Réforme — ${gate.name}`,
        description: `Mobilisation des professionnels et leaders de ${gate.name} pour incarner la vision du Pasteur Mohammed Sanogo dans notre secteur.`,
        statut: 'EN_COURS',
        dateEcheance: '2026-11-30',
        porteurProjet: `${responsibleInfo.prenom} ${responsibleInfo.nom}`,
        impactAttendu: 'Fédérer au moins 50 professionnels actifs et lancer 3 synergies concrètes.',
        partenairesRecherches: 'Cadres, entrepreneurs, consultants du secteur',
      },
    ];
  });

  // Announcements state
  const [announcementsList, setAnnouncementsList] = useState<GateAnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem(`vases_gate_announcements_${gate.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: `ann-${gate.id}-1`,
        gateId: gate.id,
        titre: `Message de bienvenue du Pilote de la Porte ${gate.number}`,
        contenu: `Chers frères et sœurs engagés dans ${gate.name}, soyez les bienvenus ! Je vous invite à actualiser vos compétences et à vous joindre à nos prières sectorielles pour impacter notre nation.`,
        date: new Date().toISOString().split('T')[0],
        auteur: `${responsibleInfo.prenom} ${responsibleInfo.nom}`,
        priorite: 'HAUTE',
      },
    ];
  });

  // Reports state
  const [reportsList, setReportsList] = useState<GateRapportPastorale[]>(() => {
    try {
      const saved = localStorage.getItem(`vases_gate_reports_${gate.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // New announcement form state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'NORMALE' | 'HAUTE' | 'URGENTE'>('NORMALE');
  const [showNewAnnForm, setShowNewAnnForm] = useState(false);

  // New project form state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDate, setNewProjDate] = useState('');
  const [newProjImpact, setNewProjImpact] = useState('');
  const [newProjPartners, setNewProjPartners] = useState('');
  const [showNewProjForm, setShowNewProjForm] = useState(false);

  // Pastoral report form state
  const [reportSubject, setReportSubject] = useState(`Rapport Apostolique — Porte ${gate.name}`);
  const [reportHighlights, setReportHighlights] = useState('');
  const [reportChallenges, setReportChallenges] = useState('');
  const [reportPrayers, setReportPrayers] = useState('');
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // Filtered members for this gate
  const currentGateMembers = useMemo(() => {
    return gateMembers.filter((m) => m.gateId === gate.id);
  }, [gateMembers, gate.id]);

  const filteredGateMembers = useMemo(() => {
    return currentGateMembers.filter((m) => {
      if (filterOnlyMentors && !m.openForMentoring) return false;
      if (filterOnlyPartners && !m.seekingCollaboration) return false;
      if (memberSearch.trim()) {
        const q = memberSearch.toLowerCase();
        const matches =
          m.memberName.toLowerCase().includes(q) ||
          m.memberProfession.toLowerCase().includes(q) ||
          m.organization?.toLowerCase().includes(q) ||
          m.subSector.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [currentGateMembers, filterOnlyMentors, filterOnlyPartners, memberSearch]);

  // Statistics
  const stats = useMemo(() => {
    const total = currentGateMembers.length;
    const mentors = currentGateMembers.filter((m) => m.openForMentoring).length;
    const partners = currentGateMembers.filter((m) => m.seekingCollaboration).length;
    const subsectors = new Set(currentGateMembers.map((m) => m.subSector)).size;
    return { total, mentors, partners, subsectors };
  }, [currentGateMembers]);

  // Unlock handlers
  const handleUnlock = (code: string) => {
    const clean = code.trim();
    const allAccounts = getLeadershipAccounts();
    const gateAccount = allAccounts.find((a) => a.targetId === gate.id);
    const expectedPasscode = gateAccount?.passcode || responsibleInfo.passcode;

    // Allow gate-specific code, updated account code, master codes 1212 and 7777
    if (
      clean === expectedPasscode ||
      clean === responsibleInfo.passcode ||
      clean === '1212' ||
      clean === '7777' ||
      clean === '4000'
    ) {
      setIsUnlocked(true);
      setPasscodeError('');
      setPasscodeAttempt('');
      try {
        localStorage.setItem(authKey, 'true');
      } catch {
        // ignore
      }
    } else {
      setPasscodeError(
        `Code d'accès incorrect. Veuillez saisir le code du Pilote de cette porte (${expectedPasscode}) ou le code général 1212.`
      );
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem(authKey);
    } catch {
      // ignore
    }
  };

  // Toggle member certification
  const handleToggleCertify = (memberId: string) => {
    setCertifiedMemberIds((prev) => {
      const next = prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId];
      try {
        localStorage.setItem(`vases_gate_certified_${gate.id}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Save new announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: GateAnnouncementItem = {
      id: `ann-${Date.now()}`,
      gateId: gate.id,
      titre: newAnnTitle.trim(),
      contenu: newAnnContent.trim(),
      date: new Date().toISOString().split('T')[0],
      auteur: `${responsibleInfo.prenom} ${responsibleInfo.nom}`,
      priorite: newAnnPriority,
    };

    const updated = [newAnn, ...announcementsList];
    setAnnouncementsList(updated);
    try {
      localStorage.setItem(`vases_gate_announcements_${gate.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewAnnTitle('');
    setNewAnnContent('');
    setShowNewAnnForm(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcementsList.filter((a) => a.id !== id);
    setAnnouncementsList(updated);
    try {
      localStorage.setItem(`vases_gate_announcements_${gate.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Save new project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;

    const newProj: GateProjectItem = {
      id: `proj-${Date.now()}`,
      gateId: gate.id,
      titre: newProjTitle.trim(),
      description: newProjDesc.trim(),
      statut: 'EN_COURS',
      dateEcheance: newProjDate || '2026-12-31',
      porteurProjet: `${responsibleInfo.prenom} ${responsibleInfo.nom}`,
      impactAttendu: newProjImpact.trim() || 'Transformation et rayonnement chrétien.',
      partenairesRecherches: newProjPartners.trim(),
    };

    const updated = [newProj, ...projectsList];
    setProjectsList(updated);
    try {
      localStorage.setItem(`vases_gate_projects_${gate.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjDate('');
    setNewProjImpact('');
    setNewProjPartners('');
    setShowNewProjForm(false);
  };

  // Submit Pastoral Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportHighlights.trim()) return;

    const report: GateRapportPastorale = {
      id: `rep-${Date.now()}`,
      gateId: gate.id,
      dateSoumission: new Date().toISOString(),
      responsableNom: `${responsibleInfo.prenom} ${responsibleInfo.nom}`,
      sujet: reportSubject,
      faitsMarquants: reportHighlights,
      statistiques: {
        membresActifs: currentGateMembers.length,
        synergiesLancees: stats.partners,
        mentoresSuivis: stats.mentors,
      },
      defisEtBesoins: reportChallenges,
      sujetsPriere: reportPrayers,
      transmisAuPasteur: true,
    };

    const updated = [report, ...reportsList];
    setReportsList(updated);
    try {
      localStorage.setItem(`vases_gate_reports_${gate.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setReportSubmittedSuccess(true);
    setTimeout(() => setReportSubmittedSuccess(false), 5000);
  };

  // Format WhatsApp message to Pasteur Mohammed Sanogo
  const handleSendReportViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🏛️ *RAPPORT D'IMPACT APOSTOLIQUE — PORTE ${gate.number} : ${gate.name.toUpperCase()}*\n` +
        `👤 *Pilote Référent :* ${responsibleInfo.prenom} ${responsibleInfo.nom} (${responsibleInfo.titre})\n` +
        `📅 *Date :* ${new Date().toLocaleDateString('fr-FR')}\n\n` +
        `📊 *STATISTIQUES DE LA PORTE :*\n` +
        `• Chrétiens d'impact engagés : ${currentGateMembers.length}\n` +
        `• Mentors actifs : ${stats.mentors}\n` +
        `• Synergies & partenariats professionnels : ${stats.partners}\n\n` +
        `✨ *FAITS MARQUANTS & AVANCÉES DU ROYAUME :*\n${reportHighlights || 'Travaux de structuration et rassemblement des professionnels du secteur en cours.'}\n\n` +
        `⚠️ *DÉFIS DU SECTEUR :*\n${reportChallenges || 'Poursuite de la mobilisation et de la formation biblique continue.'}\n\n` +
        `🙏 *SUJETS DE PRIÈRE SOUMIS AU PASTEUR :*\n${reportPrayers || 'Prière pour l\'onction de sagesse, la protection spirituelle et l\'élévation des chrétiens dans ce domaine.'}\n\n` +
        `_Transmis depuis l'Espace Responsable de la Porte via Vases Connect._`
    );
    window.open(`https://wa.me/2250700000000?text=${text}`, '_blank');
  };

  // Contact member WhatsApp
  const handleContactMemberWhatsApp = (phone?: string, memberName?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Bonjour bien-aimé(e) ${memberName || ''},\n` +
        `Je vous contacte en tant que Responsable & Pilote de la Porte d'Influence « ${gate.name} » (Vases d'Honneur).\n` +
        `J'ai consulté votre profil d'impact et j'aimerais échanger avec vous pour renforcer nos synergies dans le Royaume selon la vision du Pasteur Mohammed Sanogo.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* RESPONSIBLE IDENTITY BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-6 sm:p-7 shadow-xl border border-[#C59A27]/40">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#C59A27]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Leader Profile & Photo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={responsibleInfo.photoUrl}
                alt={`${responsibleInfo.prenom} ${responsibleInfo.nom}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#C59A27] shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#C59A27] text-[#0A3D36] flex items-center justify-center font-black text-xs shadow-md">
                {gate.number}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C59A27] text-[#0A3D36] text-[10px] font-black uppercase tracking-wider">
                  {responsibleInfo.titre}
                </span>
                <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Porte {gate.number} : {gate.name}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {responsibleInfo.prenom} {responsibleInfo.nom}
              </h2>

              <p className="text-xs text-slate-200 font-medium">
                {responsibleInfo.profession} • <span className="text-[#C6DA28]">{responsibleInfo.organisation}</span>
              </p>

              {/* Direct Quick Contact Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={`https://wa.me/${responsibleInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Référent</span>
                </a>
                <a
                  href={`tel:${responsibleInfo.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/20"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>{responsibleInfo.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Access Status & Controls */}
          <div className="self-stretch md:self-center bg-black/30 backdrop-blur-xs p-4 rounded-2xl border border-white/15 flex flex-col justify-between gap-3 shrink-0 md:min-w-[260px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Statut Espace Responsable :
              </span>
              {isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400">
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Déverrouillé</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verrouillé</span>
                </span>
              )}
            </div>

            {isUnlocked ? (
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Accès Administrateur & Pilote actif pour la Porte {gate.number}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLock}
                  className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Verrouiller l'espace</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300">
                  Saisissez le code d'accès pour administrer cette porte :
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    maxLength={6}
                    value={passcodeAttempt}
                    onChange={(e) => setPasscodeAttempt(e.target.value)}
                    placeholder="Code (ex: 4001 ou 1212)"
                    className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-hidden focus:border-[#C59A27]"
                  />
                  <button
                    type="button"
                    onClick={() => handleUnlock(passcodeAttempt)}
                    className="px-3 py-1.5 rounded-xl bg-[#C59A27] hover:bg-[#D4A936] text-[#0A3D36] font-black text-xs shadow-md shrink-0"
                  >
                    Valider
                  </button>
                </div>
                {/* 1-Click Demo Shortcut */}
                <button
                  type="button"
                  onClick={() => handleUnlock(responsibleInfo.passcode)}
                  className="w-full text-center text-[10px] text-amber-300 hover:underline flex items-center justify-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Déverrouiller en 1 clic (Code Démo : {responsibleInfo.passcode})</span>
                </button>
                {passcodeError && (
                  <p className="text-[10px] text-red-300 leading-tight">{passcodeError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Apostolic Mandate Excerpt */}
        <div className="mt-5 p-3.5 bg-black/25 rounded-2xl border border-white/10 backdrop-blur-xs text-xs text-slate-200">
          <div className="flex items-center gap-1.5 text-[#F5DE98] font-black mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mandat Pastoral pour la Porte {gate.name} (Pasteur Mohammed Sanogo) :</span>
          </div>
          <p className="italic leading-relaxed">
            « {responsibleInfo.mandatVision} »
          </p>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-black uppercase">Fidèles Inscrits</span>
            <Users className="w-4 h-4 text-[#0A3D36]" />
          </div>
          <div className="text-2xl font-black text-[#0A3D36]">{stats.total}</div>
          <div className="text-[10px] text-slate-500 font-medium">dans cette porte d'influence</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-black uppercase">Mentors Actifs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.mentors}</div>
          <div className="text-[10px] text-slate-500 font-medium">disposés au mentorat</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-black uppercase">Synergies Pro</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{stats.partners}</div>
          <div className="text-[10px] text-slate-500 font-medium">ouverts aux partenariats</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-black uppercase">Sous-Secteurs</span>
            <Briefcase className="w-4 h-4 text-[#C59A27]" />
          </div>
          <div className="text-2xl font-black text-[#C59A27]">{gate.keySubSectors.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">{stats.subsectors} représentés</div>
        </div>
      </div>

      {/* RESPONSIBLE NAVIGATION SUB-TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('MEMBRES')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'MEMBRES'
              ? 'bg-[#0A3D36] text-white shadow-md'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pilotage des Membres ({currentGateMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('COMMUNICATIONS')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'COMMUNICATIONS'
              ? 'bg-[#0A3D36] text-white shadow-md'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Communications & Directives ({announcementsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('PROJETS')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'PROJETS'
              ? 'bg-[#0A3D36] text-white shadow-md'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Chantiers & Projets ({projectsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('RAPPORT')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeSubTab === 'RAPPORT'
              ? 'bg-[#0A3D36] text-white shadow-md'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rapport au Pasteur</span>
        </button>
      </div>

      {/* SECTION 1: PILOTAGE DES MEMBRES */}
      {activeSubTab === 'MEMBRES' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Rechercher par nom, métier, sous-domaine..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setFilterOnlyMentors(!filterOnlyMentors);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  filterOnlyMentors
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mentors ({stats.mentors})
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterOnlyPartners(!filterOnlyPartners);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  filterOnlyPartners
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Synergies ({stats.partners})
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenAssistantWithPrompt(
                    `En tant que responsable de la porte d'influence ${gate.name}, aide-moi à analyser les compétences des membres inscrits et propose un plan d'action pour les mobiliser efficacement.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] text-xs font-black border border-amber-200 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Stratégie IA</span>
              </button>
            </div>
          </div>

          {filteredGateMembers.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-black text-[#0A3D36]">Aucun profil trouvé</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Aucun chrétien n'a encore renseigné ce profil ou aucun membre ne correspond à vos filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGateMembers.map((member) => {
                const isCertified = certifiedMemberIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 relative hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={member.memberPhoto}
                        alt={member.memberName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-sm text-[#0A3D36] truncate">
                            {member.memberName}
                          </h4>
                          {isCertified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Validé par le Pilote</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {member.memberProfession}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {member.organization ? `${member.organization} • ` : ''}📍 {member.memberCity}
                        </p>
                      </div>
                    </div>

                    {/* Sub Sector & Role */}
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-xl bg-amber-50 text-[#0A3D36] font-bold border border-amber-200">
                        {member.roleInGate}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                        {member.subSector}
                      </span>
                    </div>

                    {/* Mandate Vision */}
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
                      « {member.visionImpact} »
                    </p>

                    {/* Actions Bar for Responsible */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleToggleCertify(member.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                            isCertified
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isCertified ? 'Retirer validation' : 'Certifier membre actif'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          Inscrit(e) le {new Date(member.registeredAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}

                      {/* Contact as responsible */}
                      {member.whatsappContact && (
                        <button
                          type="button"
                          onClick={() => handleContactMemberWhatsApp(member.whatsappContact, member.memberName)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Message du Pilote</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: COMMUNICATIONS & ANNONCES */}
      {activeSubTab === 'COMMUNICATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#0A3D36]">
                Directives & Communiqués Officiels de la Porte
              </h3>
              <p className="text-xs text-slate-500">
                Messages transmis par le Pilote Apostolique aux chrétiens de la Porte {gate.number}.
              </p>
            </div>

            {isUnlocked && (
              <button
                type="button"
                onClick={() => setShowNewAnnForm(!showNewAnnForm)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md"
              >
                <Plus className="w-4 h-4 text-[#C59A27]" />
                <span>Publier un message</span>
              </button>
            )}
          </div>

          {/* Form to create announcement */}
          {showNewAnnForm && isUnlocked && (
            <form
              onSubmit={handleCreateAnnouncement}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 animate-in fade-in"
            >
              <h4 className="font-black text-sm text-[#0A3D36] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#C59A27]" />
                <span>Nouveau Message du Responsable de Porte</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre du communiqué :
                  </label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="Ex: Convocations à la rencontre de prière sectorielle..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Niveau de priorité :
                  </label>
                  <div className="flex gap-2">
                    {(['NORMALE', 'HAUTE', 'URGENTE'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewAnnPriority(p)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          newAnnPriority === p
                            ? p === 'URGENTE'
                              ? 'bg-red-600 text-white'
                              : p === 'HAUTE'
                              ? 'bg-amber-600 text-white'
                              : 'bg-[#0A3D36] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contenu du message :
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Rédigez la directive, l'invitation ou les encouragements pastoraux..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAnnForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md"
                >
                  Diffuser le message
                </button>
              </div>
            </form>
          )}

          {/* Announcements list */}
          <div className="space-y-3">
            {announcementsList.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        ann.priorite === 'URGENTE'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : ann.priorite === 'HAUTE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Priorité {ann.priorite}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{ann.date}</span>
                  </div>

                  {isUnlocked && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                      title="Supprimer cette annonce"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-black text-sm text-[#0A3D36]">{ann.titre}</h4>

                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {ann.contenu}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Signé : <strong>{ann.auteur}</strong></span>
                  <span className="text-[#C59A27] font-bold">Porte {gate.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CHANTIERS & PROJETS */}
      {activeSubTab === 'PROJETS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#0A3D36]">
                Chantiers Stratégiques & Projets de Transformation
              </h3>
              <p className="text-xs text-slate-500">
                Actions concrètes pour transformer le secteur {gate.name} pour la gloire de Dieu.
              </p>
            </div>

            {isUnlocked && (
              <button
                type="button"
                onClick={() => setShowNewProjForm(!showNewProjForm)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md"
              >
                <Plus className="w-4 h-4 text-[#C59A27]" />
                <span>Nouveau projet</span>
              </button>
            )}
          </div>

          {/* Form to create project */}
          {showNewProjForm && isUnlocked && (
            <form
              onSubmit={handleCreateProject}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 animate-in fade-in"
            >
              <h4 className="font-black text-sm text-[#0A3D36] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C59A27]" />
                <span>Nouveau Chantier Sectoriel</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre du projet :
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="Ex: Mise en place de l'académie de formation chrétienne..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & objectifs :
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Détails de l'initiative, méthodologie et étapes..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date d'échéance :
                    </label>
                    <input
                      type="date"
                      value={newProjDate}
                      onChange={(e) => setNewProjDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Impact attendu :
                    </label>
                    <input
                      type="text"
                      value={newProjImpact}
                      onChange={(e) => setNewProjImpact(e.target.value)}
                      placeholder="Ex: 200 bénéficiaires, 5 PME créées..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Profils et partenaires recherchés :
                  </label>
                  <input
                    type="text"
                    value={newProjPartners}
                    onChange={(e) => setNewProjPartners(e.target.value)}
                    placeholder="Ex: Juristes, développeurs web, formateurs..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md"
                >
                  Enregistrer le projet
                </button>
              </div>
            </form>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsList.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        proj.statut === 'REALISE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.statut === 'EN_COURS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {proj.statut === 'REALISE'
                        ? 'Réalisé'
                        : proj.statut === 'EN_COURS'
                        ? 'En cours'
                        : 'Planifié'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Échéance : {proj.dateEcheance}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-[#0A3D36]">{proj.titre}</h4>

                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                    <span className="font-bold text-[#0A3D36] block">Impact ciblé :</span>
                    <p>{proj.impactAttendu}</p>
                  </div>

                  {proj.partenairesRecherches && (
                    <div className="text-[11px] text-slate-500">
                      <strong>Partenaires recherchés :</strong> {proj.partenairesRecherches}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 font-medium">
                    Porté par : {proj.porteurProjet}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: RAPPORT PASTORAL AU PASTEUR MOHAMMED SANOGO */}
      {activeSubTab === 'RAPPORT' && (
        <div className="space-y-5">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#0A3D36] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C59A27]" />
                <span>Rapport d'Impact Apostolique — Porte {gate.number}</span>
              </h3>
              <p className="text-xs text-slate-600">
                Ce rapport consolidé est directement destiné au <strong>Pasteur Mohammed Sanogo</strong> pour la supervision spirituelle et le pilotage de la transformation de la nation.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendReportViaWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Transmettre par WhatsApp</span>
            </button>
          </div>

          {reportSubmittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Le rapport a été enregistré avec succès dans l'historique et transmis à la Chaire Pastorale !
              </span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmitReport}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Objet / Titre de la synthèse :
              </label>
              <input
                type="text"
                required
                value={reportSubject}
                onChange={(e) => setReportSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Membres engagés :</span>
                <p className="text-base font-black text-[#0A3D36]">{currentGateMembers.length} chrétiens</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mentors actifs :</span>
                <p className="text-base font-black text-emerald-700">{stats.mentors} mentors</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Synergies économiques :</span>
                <p className="text-base font-black text-blue-700">{stats.partners} synergies</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. Faits marquants & Victoires dans le secteur {gate.name} :
              </label>
              <textarea
                rows={3}
                required
                value={reportHighlights}
                onChange={(e) => setReportHighlights(e.target.value)}
                placeholder="Décrivez les avancées majeures, témoignages d'intégrité, nominations de frères et sœurs, événements réussis..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Défis éthiques, professionnels & besoins matériels :
              </label>
              <textarea
                rows={2}
                value={reportChallenges}
                onChange={(e) => setReportChallenges(e.target.value)}
                placeholder="Pressions rencontrées dans ce milieu professionnel, besoins de formation théologique ou d'équipements..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Requêtes d'intercession soumises au Pasteur Mohammed Sanogo :
              </label>
              <textarea
                rows={2}
                value={reportPrayers}
                onChange={(e) => setReportPrayers(e.target.value)}
                placeholder="Points de prière stratégiques pour la nation et les acteurs chrétiens de cette sphère d'influence..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Signé au nom de la Porte {gate.number} par {responsibleInfo.prenom} {responsibleInfo.nom}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md active:scale-95"
                >
                  Enregistrer & Soumettre au Pasteur
                </button>
              </div>
            </div>
          </form>

          {/* Previous reports */}
          {reportsList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Historique des rapports transmis pour la Porte {gate.name} :
              </h4>
              <div className="space-y-2">
                {reportsList.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#0A3D36]">{rep.sujet}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        Transmis le {new Date(rep.dateSoumission).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{rep.faitsMarquants}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
