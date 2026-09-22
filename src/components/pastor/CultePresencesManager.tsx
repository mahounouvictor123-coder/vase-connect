import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Phone,
  MessageSquare,
  Search,
  Plus,
  Crown,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  Filter,
  BarChart3,
  Flame,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import {
  CultePresenceRecord,
  CulteServiceType,
  TribeInfo,
  TribeMember,
  TribeId,
  UserProfile,
} from '../../types';
import {
  computeMemberAssiduity,
  doesPresenceMatchMember,
  generatePastoralWhatsAppLink,
  getAllSundayDates,
  isMemberPresentOnSunday,
} from '../../utils/presenceUtils';

interface CultePresencesManagerProps {
  presences: CultePresenceRecord[];
  tribes: TribeInfo[];
  tribeMembers: TribeMember[];
  currentUser?: UserProfile | null;
  onAddPresence: (presence: CultePresenceRecord) => Promise<void> | void;
  onDeletePresence?: (id: string) => Promise<void> | void;
  onOpenPublicLink?: (date: string, culte: CulteServiceType) => void;
}

export const CultePresencesManager: React.FC<CultePresencesManagerProps> = ({
  presences,
  tribes,
  tribeMembers,
  onAddPresence,
  onDeletePresence,
  onOpenPublicLink,
}) => {
  // Dates rapides prédéfinies
  const SUNDAY_RECENT = '2026-09-13';
  const SUNDAY_CURRENT = '2026-09-20';

  const [selectedDate, setSelectedDate] = useState<string>(SUNDAY_CURRENT);
  const [selectedCulteFilter, setSelectedCulteFilter] = useState<'TOUS' | CulteServiceType>('TOUS');
  const [selectedTribeFilter, setSelectedTribeFilter] = useState<'TOUTES' | TribeId>('TOUTES');
  const [activeSubTab, setActiveSubTab] = useState<
    'tribes' | 'all_absents' | 'chronic_absents' | 'all_presents'
  >('tribes');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  // États pour les retours visuels
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCopiedReport, setIsCopiedReport] = useState(false);

  // Modal d'ajout manuel rapide
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualNom, setManualNom] = useState('');
  const [manualPrenom, setManualPrenom] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualTribeId, setManualTribeId] = useState<TribeId>('ruben');
  const [manualCulte, setManualCulte] = useState<CulteServiceType>('CULTE_1_07H30');
  const [manualStatut, setManualStatut] = useState<CultePresenceRecord['statutMembre']>('MEMBRE_REGULIER');
  const [manualNotes, setManualNotes] = useState('');

  // 1. Filtrer les présences pour la date sélectionnée
  const datePresences = useMemo(() => {
    return presences.filter(p => p.dateDimanche === selectedDate);
  }, [presences, selectedDate]);

  // Présences filtrées par culte
  const culteFilteredPresences = useMemo(() => {
    if (selectedCulteFilter === 'TOUS') return datePresences;
    return datePresences.filter(p => p.culte === selectedCulteFilter);
  }, [datePresences, selectedCulteFilter]);

  // Présents par culte
  const countCulte1 = useMemo(
    () => datePresences.filter(p => p.culte === 'CULTE_1_07H30').length,
    [datePresences]
  );
  const countCulte2 = useMemo(
    () => datePresences.filter(p => p.culte === 'CULTE_2_10H30').length,
    [datePresences]
  );
  const countNouveaux = useMemo(
    () => datePresences.filter(p => p.statutMembre === 'NOUVEAU_CONVERTI' || p.statutMembre === 'VISITEUR').length,
    [datePresences]
  );

  // Total de membres préinscrits dans les tribus
  const totalInscrits = tribeMembers.length;
  const totalPresents = culteFilteredPresences.length;
  const tauxPresence = totalInscrits > 0 ? Math.round((totalPresents / totalInscrits) * 100) : 0;

  // 2. Calcul détaillé par Tribu (Présents vs Absents)
  const tribeStats = useMemo(() => {
    return tribes.map(tribe => {
      // Membres de cette tribu
      const membersOfTribe = tribeMembers.filter(m => m.tribeId === tribe.id);

      // Présences confirmées pour cette tribu et cette date/culte
      const presentsOfTribe = culteFilteredPresences.filter(p => p.tribeId === tribe.id);

      // Liste des membres absents : membres inscrits qui ne figurent pas dans presentsOfTribe
      const absentsOfTribe = membersOfTribe.filter(member => {
        const isPresent = datePresences.some(p => {
          if (p.tribeId !== tribe.id) return false;
          if (p.memberId && p.memberId === member.id) return true;
          return (
            p.nom.toLowerCase().trim() === member.nom.toLowerCase().trim() &&
            p.prenom.toLowerCase().trim() === member.prenom.toLowerCase().trim()
          );
        });
        return !isPresent;
      });

      const presentsCulte1 = datePresences.filter(
        p => p.tribeId === tribe.id && p.culte === 'CULTE_1_07H30'
      ).length;
      const presentsCulte2 = datePresences.filter(
        p => p.tribeId === tribe.id && p.culte === 'CULTE_2_10H30'
      ).length;

      const rate =
        membersOfTribe.length > 0
          ? Math.round((presentsOfTribe.length / membersOfTribe.length) * 100)
          : 0;

      return {
        tribe,
        totalMembers: membersOfTribe.length,
        presentsCount: presentsOfTribe.length,
        absentsCount: absentsOfTribe.length,
        presentsCulte1,
        presentsCulte2,
        rate,
        presents: presentsOfTribe,
        absents: absentsOfTribe,
      };
    });
  }, [tribes, tribeMembers, culteFilteredPresences, datePresences]);

  // Filtrer par tribu sélectionnée
  const filteredTribeStats = useMemo(() => {
    if (selectedTribeFilter === 'TOUTES') return tribeStats;
    return tribeStats.filter(t => t.tribe.id === selectedTribeFilter);
  }, [tribeStats, selectedTribeFilter]);

  // Total global des absents identifiés
  const totalAbsentsIdentifies = useMemo(() => {
    return tribeStats.reduce((acc, curr) => acc + curr.absentsCount, 0);
  }, [tribeStats]);

  // Tous les dimanches disponibles
  const allSundays = useMemo(() => getAllSundayDates(presences), [presences]);

  // Tous les membres absents du dimanche sélectionné (filtrés par tribu sélectionnée)
  const allAbsentsList = useMemo(() => {
    return tribeMembers.filter(member => {
      if (selectedTribeFilter !== 'TOUTES' && member.tribeId !== selectedTribeFilter) return false;
      const isPresent = datePresences.some(p => doesPresenceMatchMember(p, member));
      return !isPresent;
    });
  }, [tribeMembers, selectedTribeFilter, datePresences]);

  // Membres qui ne viennent plus depuis un moment (2 dimanches consécutifs d'absence ou plus)
  const chronicAbsentsList = useMemo(() => {
    return tribeMembers
      .map(m => computeMemberAssiduity(m, presences, allSundays))
      .filter(p => p.isChronicAbsent)
      .filter(p => selectedTribeFilter === 'TOUTES' || p.member.tribeId === selectedTribeFilter);
  }, [tribeMembers, presences, allSundays, selectedTribeFilter]);

  // URL du lien généré pour les membres
  const generatedLink = useMemo(() => {
    const baseUrl = `${window.location.origin}${window.location.pathname}?tab=presence_culte&date=${selectedDate}`;
    if (selectedCulteFilter !== 'TOUS') {
      return `${baseUrl}&culte=${selectedCulteFilter}`;
    }
    return baseUrl;
  }, [selectedDate, selectedCulteFilter]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const handleShareLinkWhatsApp = () => {
    const text =
      `🙏 *VASES D'HONNEUR — POINTAGE & CONFIRMATION DES CULTES*\n` +
      `📅 *Dimanche du ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}*\n\n` +
      `Chers Patriarches, Matriarches et Bien-aimés des 12 Tribus,\n` +
      `Merci de confirmer dès maintenant votre présence au culte (1er Culte 07h30 ou 2ème Culte 10h30) en cliquant sur le lien ci-dessous :\n\n` +
      `🔗 *Confirmer ma Présence :*\n${generatedLink}\n\n` +
      `_« Venez, montons à la montagne de l'Éternel... afin qu'il nous enseigne ses voies ! »_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copie de la Synthèse Pastorale pour WhatsApp
  const handleCopyPastoralReport = () => {
    let report = `📊 *SYNTHÈSE PASTORALE DU POINTAGE DOMINICAL*\n`;
    report += `📅 *Dimanche : ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}*\n\n`;
    report += `🏛️ *PARTICIPATION GLOBALE :*\n`;
    report += `• Total Présents Confirmés : ${totalPresents} fidèles\n`;
    report += `  - ☀️ 1er Culte (07h30) : ${countCulte1} présents\n`;
    report += `  - 🕊️ 2ème Culte (10h30) : ${countCulte2} présents\n`;
    report += `• Nouveaux Venus / Visiteurs : ${countNouveaux}\n`;
    report += `• Taux de Mobilisation : ${tauxPresence}%\n`;
    report += `• Absents à relancer : ${totalAbsentsIdentifies} fidèles\n\n`;

    report += `👑 *MOBILISATION DES 12 TRIBUS :*\n`;
    tribeStats.forEach(ts => {
      report += `• *Tribu ${ts.tribe.name}* : ${ts.presentsCount}/${ts.totalMembers} présents (${ts.rate}%) — [07h30: ${ts.presentsCulte1} | 10h30: ${ts.presentsCulte2}]\n`;
      if (ts.absents.length > 0) {
        report += `  ↳ _Absents (${ts.absents.length}) : ${ts.absents.map(a => `${a.prenom} ${a.nom}`).join(', ')}_\n`;
      }
    });

    report += `\n✍️ *Directives :* Que chaque Patriarche et Responsable prenne des nouvelles chaleureuses des membres absents pour la gloire de Dieu.`;

    navigator.clipboard.writeText(report);
    setIsCopiedReport(true);
    setTimeout(() => setIsCopiedReport(false), 2500);
  };

  // Relance pastorale personnalisée par WhatsApp pour un membre absent
  const handleRelanceAbsentWhatsApp = (member: TribeMember, tribe: TribeInfo) => {
    const text =
      `🕊️ *Shalom Bien-aimé(e) ${member.prenom} !*\n` +
      `C'est ton église Vases d'Honneur (Tribu de ${tribe.name}).\n` +
      `Tu nous as manqué ce dimanche lors de nos cultes de célébration.\n` +
      `Nous prions que la paix de Dieu soit avec toi et ta maison. As-tu besoin d'une prière ou d'un accompagnement fraternel ?\n` +
      `Donne-nous de tes nouvelles, sois richement béni(e) !`;

    const cleanPhone = member.numero.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Validation manuelle rapide pour un absent (s'il était présent en retard)
  const handleQuickValidatePresence = async (member: TribeMember, tribe: TribeInfo, culte: CulteServiceType) => {
    const record: CultePresenceRecord = {
      id: 'cp-' + Date.now(),
      dateDimanche: selectedDate,
      culte,
      culteLabel: culte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)',
      memberId: member.id,
      nom: member.nom,
      prenom: member.prenom,
      telephone: member.numero,
      tribeId: tribe.id,
      tribeName: tribe.name,
      quartier: member.quartier,
      statutMembre: member.roleInTribe === 'RESPONSABLE' ? 'RESPONSABLE' : 'MEMBRE_REGULIER',
      confirmeAt: new Date().toISOString(),
      source: 'PASTEUR_MANUEL',
      notes: 'Pointé manuellement par le bureau pastoral',
    };

    await onAddPresence(record);
  };

  // Soumission manuelle d'un fidèle externe
  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNom.trim() || !manualPrenom.trim() || !manualPhone.trim()) return;

    const tribeObj = tribes.find(t => t.id === manualTribeId);
    const tribeName = tribeObj ? tribeObj.name : manualTribeId;

    const record: CultePresenceRecord = {
      id: 'cp-' + Date.now(),
      dateDimanche: selectedDate,
      culte: manualCulte,
      culteLabel: manualCulte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)',
      nom: manualNom.trim(),
      prenom: manualPrenom.trim(),
      telephone: manualPhone.trim(),
      tribeId: manualTribeId,
      tribeName,
      statutMembre: manualStatut,
      confirmeAt: new Date().toISOString(),
      source: 'PASTEUR_MANUEL',
      notes: manualNotes.trim() ? manualNotes.trim() : undefined,
    };

    await onAddPresence(record);
    setShowManualModal(false);
    setManualNom('');
    setManualPrenom('');
    setManualPhone('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Bandeau Générateur de Lien & Partage */}
      <div className="bg-gradient-to-r from-[#0A3D36] via-[#104D44] to-[#0A3D36] rounded-3xl p-6 text-white border border-[#C59A27]/40 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#E5B22F] text-xs font-black uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" />
              <span>Générateur de Lien pour les Membres</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Lien de Confirmation des Cultes Dominicales (7h30 & 10h30)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Partagez ce lien chaque dimanche matin ou samedi soir sur WhatsApp. Les fidèles tapent leur nom préinscrit ou s'inscrivent en un clic. Leurs présences et absences se dénotent automatiquement ci-dessous !
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleShareLinkWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md hover:scale-102 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager sur WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black flex items-center gap-2 transition-all"
            >
              {isCopiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#E5B22F]" />}
              <span>{isCopiedLink ? 'Lien copié !' : 'Copier le lien'}</span>
            </button>

            <button
              onClick={() => {
                if (onOpenPublicLink) {
                  onOpenPublicLink(selectedDate, selectedCulteFilter === 'TOUS' ? 'CULTE_1_07H30' : selectedCulteFilter);
                } else {
                  window.open(generatedLink, '_blank');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#C59A27] hover:bg-[#b58c21] text-slate-950 text-xs font-black flex items-center gap-2 shadow-sm hover:scale-102 active:scale-95 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ouvrir Pointage Membre</span>
            </button>
          </div>
        </div>

        {/* Aperçu de l'URL */}
        <div className="bg-black/30 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-xs font-mono text-slate-300 border border-white/10 overflow-hidden">
          <div className="truncate text-ellipsis">{generatedLink}</div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B22F] shrink-0">
            Actif
          </span>
        </div>
      </div>

      {/* 2. Filtres & Sélection du Dimanche */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Choix Dimanche & Raccourcis */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C59A27]" />
              <span>Dimanche :</span>
            </span>

            <button
              onClick={() => setSelectedDate(SUNDAY_CURRENT)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === SUNDAY_CURRENT
                  ? 'bg-[#0A3D36] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dimanche 20 Sep (En cours)
            </button>

            <button
              onClick={() => setSelectedDate(SUNDAY_RECENT)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === SUNDAY_RECENT
                  ? 'bg-[#0A3D36] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Dimanche 13 Sep (Précédent)
            </button>

            {/* Date Picker Manuel */}
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-800 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-[#C59A27]"
            />
          </div>

          {/* Action Manuelle & Export Pastoral */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPastoralReport}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all"
            >
              {isCopiedReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C59A27]" />}
              <span>{isCopiedReport ? 'Synthèse copiée !' : 'Copier Rapport WhatsApp'}</span>
            </button>

            <button
              onClick={() => setShowManualModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#072722] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-[#E5B22F]" />
              <span>Pointer Manuellement</span>
            </button>
          </div>
        </div>

        {/* Filtres Cultes & Tribus */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Bascule Cultes : TOUS / 7h30 / 10h30 */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setSelectedCulteFilter('TOUS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedCulteFilter === 'TOUS'
                  ? 'bg-white text-[#0A3D36] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les Cultes ({datePresences.length})
            </button>

            <button
              onClick={() => setSelectedCulteFilter('CULTE_1_07H30')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                selectedCulteFilter === 'CULTE_1_07H30'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>☀️ 1er Culte (07h30)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                {countCulte1}
              </span>
            </button>

            <button
              onClick={() => setSelectedCulteFilter('CULTE_2_10H30')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                selectedCulteFilter === 'CULTE_2_10H30'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🕊️ 2ème Culte (10h30)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black">
                {countCulte2}
              </span>
            </button>
          </div>

          {/* Filtre Tribu */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTribeFilter}
              onChange={e => setSelectedTribeFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C59A27]"
            >
              <option value="TOUTES">Toutes les 12 Tribus</option>
              {tribes.map(t => (
                <option key={t.id} value={t.id}>
                  Tribu {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Statistiques & KPIs Pastoraux Globaux */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Inscrits Tribus</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalInscrits}</div>
          <div className="text-[10px] text-slate-400">Effectif total</div>
        </div>

        <div
          onClick={() => setActiveSubTab('all_presents')}
          className={`rounded-2xl p-4 border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeSubTab === 'all_presents'
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-white border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Présents</span>
          </div>
          <div className="text-2xl font-black">{totalPresents}</div>
          <div className="text-[10px] opacity-75">Confirmés au culte</div>
        </div>

        <div
          onClick={() => setActiveSubTab('all_absents')}
          className={`rounded-2xl p-4 border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeSubTab === 'all_absents'
              ? 'bg-rose-700 text-white border-rose-700'
              : 'bg-white border-rose-200/80 bg-rose-50/20 hover:border-rose-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" />
            <span>Absents Dimanche</span>
          </div>
          <div className="text-2xl font-black">{totalAbsentsIdentifies}</div>
          <div className="text-[10px] opacity-75">Non pointés ce jour</div>
        </div>

        <div
          onClick={() => setActiveSubTab('chronic_absents')}
          className={`rounded-2xl p-4 border shadow-xs space-y-1 cursor-pointer transition-all ${
            activeSubTab === 'chronic_absents'
              ? 'bg-red-800 text-white border-red-800'
              : 'bg-red-50/70 border-red-300 text-red-900 hover:border-red-400'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Ne viennent plus</span>
          </div>
          <div className="text-2xl font-black">{chronicAbsentsList.length}</div>
          <div className="text-[10px] font-bold opacity-75">2+ dimanches manqués</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>1er Culte 07h30</span>
          </div>
          <div className="text-2xl font-black text-amber-800">{countCulte1}</div>
          <div className="text-[10px] text-slate-400">Culte matinal</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-indigo-200/80 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>2ème Culte 10h30</span>
          </div>
          <div className="text-2xl font-black text-indigo-800">{countCulte2}</div>
          <div className="text-[10px] text-slate-400">Culte de célébration</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#C59A27]/40 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-[#0A3D36] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Taux Présence</span>
          </div>
          <div className="text-2xl font-black text-[#0A3D36]">{tauxPresence}%</div>
          <div className="text-[10px] text-[#C59A27] font-bold">Mobilisation</div>
        </div>
      </div>

      {/* 4. Barre d'Onglets de Suivi Dominical */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('tribes')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeSubTab === 'tribes'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Dénotation par Tribus ({filteredTribeStats.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('all_absents')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeSubTab === 'all_absents'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Tous les Absents du Dimanche ({allAbsentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chronic_absents')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeSubTab === 'chronic_absents'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-red-50 hover:bg-red-100 text-red-900 border border-red-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Ne viennent plus depuis un moment ({chronicAbsentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('all_presents')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeSubTab === 'all_presents'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tous les Présents ({culteFilteredPresences.length})</span>
          </button>
        </div>

        {/* Recherche dans les membres */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchMemberQuery}
            onChange={e => setSearchMemberQuery(e.target.value)}
            placeholder="Rechercher un fidèle..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#C59A27] bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* 4. Dénotation par Tribu : Liste des 12 Tribus avec Présents et Absents */}
      {activeSubTab === 'tribes' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#0A3D36] uppercase tracking-wider">
              <Crown className="w-4 h-4 text-[#C59A27]" />
              <span>Dénotation de Présence par Tribu ({filteredTribeStats.length} tribus)</span>
            </div>
            <p className="text-xs text-slate-500">
              Pour chaque tribu, visualisez instantanément qui est venu (07h30 et 10h30) et qui ne s'est pas encore présenté.
            </p>
          </div>

          {/* Recherche dans les membres */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchMemberQuery}
              onChange={e => setSearchMemberQuery(e.target.value)}
              placeholder="Rechercher un membre..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#C59A27] bg-white"
            />
          </div>
        </div>

        {/* Grille des Tribus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredTribeStats.map(({ tribe, totalMembers, presentsCount, absentsCount, presentsCulte1, presentsCulte2, rate, presents, absents }) => {
            // Filtre par recherche texte locale
            const q = searchMemberQuery.toLowerCase().trim();
            const filteredPresents = presents.filter(p =>
              !q || `${p.prenom} ${p.nom}`.toLowerCase().includes(q) || p.telephone.includes(q)
            );
            const filteredAbsents = absents.filter(a =>
              !q || `${a.prenom} ${a.nom}`.toLowerCase().includes(q) || a.numero.includes(q)
            );

            return (
              <div
                key={tribe.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Entête de la Tribu */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xs"
                        style={{ backgroundColor: tribe.bannerColor || '#0A3D36' }}
                      >
                        {tribe.symbol}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Tribu {tribe.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Patriarche : <span className="font-bold text-slate-700">{tribe.patriarchName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Jauge et Taux */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black"
                        style={{
                          backgroundColor: rate >= 70 ? '#ECFDF5' : rate >= 40 ? '#FFFBEB' : '#FEF2F2',
                          color: rate >= 70 ? '#047857' : rate >= 40 ? '#B45309' : '#B91C1C',
                        }}
                      >
                        <span>{rate}%</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                        {presentsCount} / {totalMembers} présents
                      </div>
                    </div>
                  </div>

                  {/* Barre de Progression */}
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${rate}%`,
                        backgroundColor: tribe.bannerColor || '#0A3D36',
                      }}
                    />
                  </div>

                  {/* Détail par Culte (7h30 et 10h30) */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1">
                    <span className="flex items-center gap-1 text-amber-800">
                      <span>☀️ 1er Culte (07h30) :</span>
                      <strong className="text-slate-900">{presentsCulte1}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-indigo-800">
                      <span>🕊️ 2ème Culte (10h30) :</span>
                      <strong className="text-slate-900">{presentsCulte2}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-rose-700">
                      <span>❌ Absents :</span>
                      <strong className="text-rose-700">{absentsCount}</strong>
                    </span>
                  </div>
                </div>

                {/* Corps : Liste des Présents et des Absents */}
                <div className="p-5 space-y-4 flex-1">
                  {/* SOUS-SECTION 1 : CEUX QUI SONT VENUS (PRÉSENTS) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ceux qui sont venus ({filteredPresents.length})</span>
                      </span>
                    </div>

                    {filteredPresents.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        Aucun membre n'a encore confirmé pour ce filtre.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-[#FBFDFB]">
                        {filteredPresents.map(present => (
                          <div
                            key={present.id}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-emerald-50/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black flex items-center justify-center shrink-0">
                                {present.prenom[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-900 truncate">
                                  {present.prenom} {present.nom}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {present.telephone} {present.quartier ? `• ${present.quartier}` : ''}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                  present.culte === 'CULTE_1_07H30'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-indigo-100 text-indigo-900'
                                }`}
                              >
                                {present.culte === 'CULTE_1_07H30' ? '07h30' : '10h30'}
                              </span>

                              {onDeletePresence && (
                                <button
                                  onClick={() => onDeletePresence(present.id)}
                                  className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                  title="Retirer ce pointage"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SOUS-SECTION 2 : CEUX QUI NE SONT PAS VENUS (ABSENTS) */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-black text-rose-800">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Ceux qui ne sont pas venus ({filteredAbsents.length})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Membres inscrits non pointés
                      </span>
                    </div>

                    {filteredAbsents.length === 0 ? (
                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/50 text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C59A27]" />
                        <span>Gloire à Dieu ! 100% des membres de cette tribu sont présents.</span>
                      </div>
                    ) : (
                      <div className="divide-y divide-rose-100/60 border border-rose-100 rounded-2xl overflow-hidden bg-rose-50/20">
                        {filteredAbsents.map(absent => (
                          <div
                            key={absent.id}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-rose-50/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {absent.photoUrl ? (
                                <img
                                  src={absent.photoUrl}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                                  {absent.prenom[0]}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-900 truncate">
                                  {absent.prenom} {absent.nom}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {absent.numero} {absent.quartier ? `• ${absent.quartier}` : ''}
                                </div>
                              </div>
                            </div>

                            {/* Actions Pastorales pour l'Absent */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Bouton Relance WhatsApp */}
                              <button
                                onClick={() => handleRelanceAbsentWhatsApp(absent, tribe)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shadow-xs transition-all"
                                title="Envoyer message pastoral WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Relancer</span>
                              </button>

                              {/* Bouton Marquer Présent (Retardataire) */}
                              <button
                                onClick={() => handleQuickValidatePresence(absent, tribe, selectedCulteFilter === 'CULTE_2_10H30' ? 'CULTE_2_10H30' : 'CULTE_1_07H30')}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all"
                                title="Pointer comme présent en salle"
                              >
                                + Présent
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Onglet : TOUS LES ABSENTS DU DIMANCHE */}
      {activeSubTab === 'all_absents' && (
        <div className="space-y-4">
          <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-rose-900 font-black text-base">
                <UserX className="w-5 h-5 text-rose-600" />
                <span>Tous les Membres Absents du Dimanche {selectedDate} ({allAbsentsList.length})</span>
              </div>
              <span className="text-xs bg-rose-200/80 text-rose-900 font-bold px-3 py-1 rounded-full">
                À contacter & visiter en priorité
              </span>
            </div>
            <p className="text-xs text-rose-800">
              Ces membres inscrits ne se sont pas enregistrés aux cultes du dimanche sélectionné. Vous pouvez leur envoyer directement un message de bienveillance pastorale sur WhatsApp ou les pointer comme présents s'ils sont arrivés en retard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAbsentsList
              .filter(m => {
                const q = searchMemberQuery.toLowerCase().trim();
                return !q || `${m.prenom} ${m.nom}`.toLowerCase().includes(q) || m.numero.includes(q) || (m.quartier && m.quartier.toLowerCase().includes(q));
              })
              .map(member => {
                const tribe = tribes.find(t => t.id === member.tribeId);
                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border-2 border-rose-100 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-800 font-black text-sm flex items-center justify-center shrink-0">
                          {member.prenom[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-slate-900 text-sm truncate">
                          {member.prenom} {member.nom}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                          <span>{member.numero}</span>
                          {member.quartier && <span>• {member.quartier}</span>}
                        </div>
                        {tribe && (
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-black text-white" style={{ backgroundColor: tribe.bannerColor || '#0A3D36' }}>
                            <span>{tribe.symbol}</span>
                            <span>Tribu {tribe.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleRelanceAbsentWhatsApp(member, tribe)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Prendre des nouvelles (WhatsApp)</span>
                      </button>
                      <button
                        onClick={() => handleQuickValidatePresence(member, tribe, selectedCulteFilter === 'CULTE_2_10H30' ? 'CULTE_2_10H30' : 'CULTE_1_07H30')}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                        title="Pointer présent"
                      >
                        + Présent
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Onglet : MEMBRES QUI NE VIENNENT PLUS DEPUIS UN MOMENT */}
      {activeSubTab === 'chronic_absents' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-300 rounded-3xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-red-950 font-black text-base">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Brebis qui ne viennent plus depuis un moment ({chronicAbsentsList.length})</span>
              </div>
              <span className="text-xs bg-red-200 text-red-900 font-black px-3 py-1 rounded-full">
                Attention Pastorale Requise (2+ dimanches sans présence)
              </span>
            </div>
            <p className="text-xs text-red-800">
              « Quel homme d'entre vous, s'il a cent brebis, et qu'il en perde une, ne laisse les quatre-vingt-dix-neuf dans le désert pour aller après celle qui est perdue, jusqu'à ce qu'il la retrouve ? » (Luc 15:4).
              Ces membres n'ont pas participé aux récents cultes. Contactez-les sans tarder ou planifiez une visite pastorale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chronicAbsentsList
              .filter(p => {
                const q = searchMemberQuery.toLowerCase().trim();
                return !q || `${p.member.prenom} ${p.member.nom}`.toLowerCase().includes(q) || p.member.numero.includes(q) || (p.member.quartier && p.member.quartier.toLowerCase().includes(q));
              })
              .map(({ member, consecutiveAbsences, lastPresentDate }) => {
                const tribe = tribes.find(t => t.id === member.tribeId);
                const whatsappMsg = `Bonjour bien-aimé(e) ${member.prenom}, c'est l'équipe pastorale de la Cité Royale Siloé. Le Seigneur a mis ton nom sur notre cœur car nous avons remarqué ton absence aux cultes du dimanche. Nous voulions savoir comment tu vas et si tout va bien pour toi et ta famille. Que la grâce et la paix de Dieu reposent sur toi !`;
                const whatsappUrl = `https://wa.me/${member.numero.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl border-2 border-red-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-red-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-800 font-black text-sm flex items-center justify-center shrink-0">
                          {member.prenom[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-slate-900 text-sm truncate">
                          {member.prenom} {member.nom}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {member.numero} {member.quartier ? `• ${member.quartier}` : ''}
                        </div>
                        {tribe && (
                          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-black text-white" style={{ backgroundColor: tribe.bannerColor || '#0A3D36' }}>
                            <span>{tribe.symbol}</span>
                            <span>Tribu {tribe.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-red-50/80 rounded-2xl p-3 border border-red-200 space-y-1">
                      <div className="text-xs font-bold text-red-900 flex items-center justify-between">
                        <span>Dimanches manqués consécutifs :</span>
                        <span className="font-black text-red-700 bg-red-200 px-2 py-0.5 rounded-md">
                          {consecutiveAbsences} dimanche(s)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Dernier culte assisté : <strong className="text-slate-800">{lastPresentDate || 'Aucun enregistré'}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Prendre des nouvelles (WhatsApp)</span>
                      </a>
                      <button
                        onClick={() => handleQuickValidatePresence(member, tribe, selectedCulteFilter === 'CULTE_2_10H30' ? 'CULTE_2_10H30' : 'CULTE_1_07H30')}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                        title="Pointer présent"
                      >
                        + Présent
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Onglet : TOUS LES PRÉSENTS */}
      {activeSubTab === 'all_presents' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Tous les Membres Présents aux Cultes du {selectedDate} ({culteFilteredPresences.length})</span>
              </div>
              <span className="text-xs bg-emerald-200 text-emerald-900 font-black px-3 py-1 rounded-full">
                Présences confirmées
              </span>
            </div>
            <p className="text-xs text-emerald-800">
              Liste complète des fidèles qui ont assisté aux cultes ce dimanche. Vous pouvez vérifier leurs horaires et canal d'enregistrement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {culteFilteredPresences
              .filter(p => {
                const q = searchMemberQuery.toLowerCase().trim();
                return !q || `${p.prenom} ${p.nom}`.toLowerCase().includes(q) || p.telephone.includes(q);
              })
              .map(presence => {
                const tribe = tribes.find(t => t.id === presence.tribeId);
                return (
                  <div
                    key={presence.id}
                    className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                        {presence.prenom[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-slate-900 text-sm truncate">
                          {presence.prenom} {presence.nom}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {presence.telephone}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {presence.culte === 'CULTE_1_07H30' ? 'Culte 1 (07h30)' : 'Culte 2 (10h30)'}
                          </span>
                          {tribe && (
                            <span className="text-[10px] text-slate-600 font-bold truncate">
                              • Tribu {tribe.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeletePresence(presence.id)}
                      className="text-slate-300 hover:text-rose-600 p-2 text-xs font-bold transition-all"
                      title="Supprimer ce pointage"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 5. MODAL D'AJOUT MANUEL D'UN FIDÈLE */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#C59A27]/30 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <Plus className="w-5 h-5 text-[#C59A27]" />
                <span>Pointer un Fidèle Manuellement</span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={manualPrenom}
                    onChange={e => setManualPrenom(e.target.value)}
                    placeholder="Prénom"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={manualNom}
                    onChange={e => setManualNom(e.target.value)}
                    placeholder="Nom"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tribu</label>
                  <select
                    value={manualTribeId}
                    onChange={e => setManualTribeId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {tribes.map(t => (
                      <option key={t.id} value={t.id}>
                        Tribu {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Culte Confirmé</label>
                  <select
                    value={manualCulte}
                    onChange={e => setManualCulte(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    <option value="CULTE_1_07H30">1er Culte (07h30)</option>
                    <option value="CULTE_2_10H30">2ème Culte (10h30)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut</label>
                  <select
                    value={manualStatut}
                    onChange={e => setManualStatut(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="MEMBRE_REGULIER">Membre Régulier</option>
                    <option value="RESPONSABLE">Responsable / Patriarche</option>
                    <option value="OUVRIER">Ouvrier</option>
                    <option value="NOUVEAU_CONVERTI">Nouveau Converti</option>
                    <option value="VISITEUR">Visiteur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes pastorales</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="Ex: Arrivé en retard, requiert visite..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#072722] text-white text-xs font-black shadow-md transition-all"
                >
                  Enregistrer la Présence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
