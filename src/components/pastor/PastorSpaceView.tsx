import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Inbox,
  Sparkles,
  Plus,
  Send,
  Share2,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Crown,
  Briefcase,
  Home,
  MessageSquare,
  Search,
  Filter,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Layers,
  Heart,
  Eye,
  Link2,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import {
  CulteResume,
  RapportTemplate,
  RapportSoumis,
  RapportSpecial,
  UserProfile,
  CultePresenceRecord,
  CulteServiceType,
  TribeInfo,
  TribeMember,
} from '../../types';
import { CulteResumeModal } from './CulteResumeModal';
import { CreateReportTemplateModal } from './CreateReportTemplateModal';
import { SubmitReportModal } from './SubmitReportModal';
import { RapportDetailModal } from './RapportDetailModal';
import { RapportSpecialModal } from './RapportSpecialModal';
import { CultePresencesManager } from './CultePresencesManager';
import { PastorMembersDirectory } from './PastorMembersDirectory';

interface PastorSpaceViewProps {
  currentUser: UserProfile | null;
  cultes: CulteResume[];
  templates: RapportTemplate[];
  rapports: RapportSoumis[];
  rapportsSpeciaux: RapportSpecial[];
  presences?: CultePresenceRecord[];
  tribes?: TribeInfo[];
  tribeMembers?: TribeMember[];
  initialRapportFormId?: string;
  initialPastorTab?: 'inbox' | 'cultes' | 'templates' | 'speciaux' | 'presences' | 'membres';
  onAddCulte: (culte: CulteResume) => void;
  onAddTemplate: (template: RapportTemplate) => void;
  onAddRapport: (rapport: RapportSoumis) => void;
  onUpdateRapport: (rapport: RapportSoumis) => void;
  onAddRapportSpecial: (special: RapportSpecial) => void;
  onAddPresence?: (presence: CultePresenceRecord) => Promise<void> | void;
  onDeletePresence?: (id: string) => Promise<void> | void;
  onOpenPublicLink?: (date: string, culte: CulteServiceType) => void;
}

export const PastorSpaceView: React.FC<PastorSpaceViewProps> = ({
  currentUser,
  cultes,
  templates,
  rapports,
  rapportsSpeciaux,
  presences = [],
  tribes = [],
  tribeMembers = [],
  initialRapportFormId,
  initialPastorTab = 'inbox',
  onAddCulte,
  onAddTemplate,
  onAddRapport,
  onUpdateRapport,
  onAddRapportSpecial,
  onAddPresence,
  onDeletePresence,
  onOpenPublicLink,
}) => {
  // Navigation tabs in pastor space
  const [activePastorTab, setActivePastorTab] = useState<
    'inbox' | 'cultes' | 'templates' | 'speciaux' | 'presences' | 'membres'
  >(initialPastorTab);

  // Modals
  const [showCulteModal, setShowCulteModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTemplateForSubmit, setSelectedTemplateForSubmit] =
    useState<RapportTemplate | null>(null);
  const [selectedRapportForDetail, setSelectedRapportForDetail] =
    useState<RapportSoumis | null>(null);
  const [showSpecialModal, setShowSpecialModal] = useState(false);

  // Filters for Inbox
  const [inboxFilter, setInboxFilter] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedResumeId, setCopiedResumeId] = useState<string | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Auto open submit modal if directed via direct link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formId = initialRapportFormId || params.get('rapportForm');
    if (formId && templates.length > 0) {
      const target = templates.find(t => t.id === formId);
      if (target) {
        setSelectedTemplateForSubmit(target);
        setShowSubmitModal(true);
      }
    }
  }, [initialRapportFormId, templates]);

  const handleShareTemplateWhatsApp = (template: RapportTemplate) => {
    const formUrl = `${window.location.origin}${window.location.pathname}?tab=pastor&rapportForm=${template.id}`;
    const message = `🕊️ *VASES D'HONNEUR — DIRECTION PASTORALE*\n\nBien-aimé(e) Responsable,\nLe Pasteur vous invite à renseigner et soumettre directement votre rapport : *${template.titre}* sur la plateforme Vases Connect.\n\n📝 *Lien direct du formulaire à remplir en ligne :*\n${formUrl}\n\nVos réponses et statistiques remonteront instantanément dans la boîte pastorale. Que Dieu bénisse votre ministère !`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyTemplateLink = (template: RapportTemplate) => {
    const formUrl = `${window.location.origin}${window.location.pathname}?tab=pastor&rapportForm=${template.id}`;
    navigator.clipboard.writeText(formUrl);
    setCopiedTemplateId(template.id);
    setTimeout(() => setCopiedTemplateId(null), 3000);
  };

  // Unread reports count
  const newReportsCount = rapports.filter(r => r.statut === 'NOUVEAU').length;

  // Filtered reports
  const filteredRapports = rapports.filter(r => {
    const matchesFilter =
      inboxFilter === 'TOUS' ||
      (inboxFilter === 'URGENT' && r.urgente) ||
      (inboxFilter === 'TRIBU' && r.categorie === 'TRIBU') ||
      (inboxFilter === 'DEPARTEMENT' && r.categorie === 'DEPARTEMENT') ||
      (inboxFilter === 'FAMILLE_HONNEUR' && r.categorie === 'FAMILLE_HONNEUR');

    const matchesSearch =
      !searchQuery.trim() ||
      r.entiteConcernee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.auteurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.templateTitre.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenSubmitForTemplate = (template: RapportTemplate) => {
    setSelectedTemplateForSubmit(template);
    setShowSubmitModal(true);
  };

  const handleCopyResume = (resume: CulteResume) => {
    let text = `📖 *RÉSUMÉ DU CULTE DU ${new Date(resume.date).toLocaleDateString('fr-FR')}*\n`;
    text += `🏛️ *${resume.typeCulte.toUpperCase()}*\n`;
    text += `🎙️ *Orateur :* ${resume.orateur}\n`;
    text += `📜 *Thème :* ${resume.theme}\n`;
    text += `📖 *Passage(s) :* ${resume.passageBiblique}\n\n`;

    text += `📊 *MOISSON DU CULTE :*\n`;
    text += `• Total Présents : ${resume.statistiques.totalPresents}\n`;
    text += `• Nouveaux Venus : ${resume.statistiques.nouveauxVenus}\n`;
    text += `• Âmes données à Christ : ${resume.statistiques.conversions}\n\n`;

    text += `✨ *VÉRITÉS & POINTS CLÉS :*\n`;
    resume.pointsCles.forEach((p, idx) => {
      text += `${idx + 1}. ${p}\n`;
    });

    if (resume.temoignagesMarquants.length > 0) {
      text += `\n🕊️ *TÉMOIGNAGES MARQUANTS :*\n`;
      resume.temoignagesMarquants.forEach(t => {
        text += `• ${t}\n`;
      });
    }

    if (resume.notesPastorales) {
      text += `\n✍️ *DIRECTIVE PASTORALE :*\n${resume.notesPastorales}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedResumeId(resume.id);
    setTimeout(() => setCopiedResumeId(null), 2000);
  };

  const handleShareResumeWhatsApp = (resume: CulteResume) => {
    let text = `📖 *RÉSUMÉ DU CULTE DU ${new Date(resume.date).toLocaleDateString('fr-FR')}*\n`;
    text += `🏛️ *${resume.typeCulte.toUpperCase()}*\n`;
    text += `🎙️ *Orateur :* ${resume.orateur}\n`;
    text += `📜 *Thème :* ${resume.theme}\n`;
    text += `📖 *Passage(s) :* ${resume.passageBiblique}\n\n`;

    text += `📊 *MOISSON DU CULTE :*\n`;
    text += `• Total Présents : ${resume.statistiques.totalPresents}\n`;
    text += `• Nouveaux Venus : ${resume.statistiques.nouveauxVenus}\n`;
    text += `• Âmes données à Christ : ${resume.statistiques.conversions}\n\n`;

    text += `✨ *POINTS CLÉS :*\n`;
    resume.pointsCles.forEach((p, idx) => {
      text += `${idx + 1}. ${p}\n`;
    });

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* 1. Header Pastoral Majestueux */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] border border-[#C59A27]/40 shadow-xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59A27]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/50 text-[#E5B22F] text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Chaire & Bureau Pastoral • Vases d'Honneur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Espace Pastoral & Gouvernance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Supervision apostolique du troupeau : consultez les comptes-rendus des cultes, définissez les fenêtres de rapports des 12 Tribus, Départements et Familles d'Honneur, recevez les retours des membres dans votre boîte pastorale et générez les synthèses spéciales pour le partage.
            </p>
          </div>

          {/* Boutons d'Action Rapide Demandés */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActivePastorTab('presences')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black flex items-center gap-2 shadow-md hover:scale-102 active:scale-95 transition-all"
            >
              <UserCheck className="w-4 h-4 text-[#E5B22F]" />
              <span>Présences Dimanche & Liens</span>
            </button>

            <button
              onClick={() => setShowCulteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#b0871e] hover:to-[#cda028] text-slate-950 text-xs font-black flex items-center gap-2 shadow-md hover:scale-102 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>+ Résumé du Culte</span>
            </button>

            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black flex items-center gap-2 shadow-xs hover:scale-102 active:scale-95 transition-all"
            >
              <Layers className="w-4 h-4 text-[#E5B22F]" />
              <span>Créer Fenêtre de Rapport</span>
            </button>

            <button
              onClick={() => setShowSpecialModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-xs hover:scale-102 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Générer le Spécial & Partager</span>
            </button>
          </div>
        </div>

        {/* Barre de navigation interne */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePastorTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'inbox'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Boîte de Réception des Rapports</span>
            {newReportsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#A31D24] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {newReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePastorTab('cultes')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'cultes'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Résumés des Cultes ({cultes.length})</span>
          </button>

          <button
            onClick={() => setActivePastorTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'templates'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fenêtres de Rapports ({templates.length})</span>
          </button>

          <button
            onClick={() => setActivePastorTab('speciaux')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'speciaux'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E5B22F]" />
            <span>Rapports Spéciaux Générés ({rapportsSpeciaux.length})</span>
          </button>

          <button
            onClick={() => setActivePastorTab('presences')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'presences'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#E5B22F]" />
            <span>Pointage & Présences Dimanche (7h30 & 10h30)</span>
            {presences.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#C59A27] text-slate-950 text-[10px] font-black">
                {presences.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActivePastorTab('membres')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activePastorTab === 'membres'
                ? 'bg-white text-[#0A3D36] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Users className="w-4 h-4 text-[#E5B22F]" />
            <span>Effectif Total & Suivi des Brebis</span>
            {tribeMembers.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#C59A27] text-slate-950 text-[10px] font-black">
                {tribeMembers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL PAR ONGLET */}

      {/* ONGLET A : BOÎTE DE RÉCEPTION DES RAPPORTS */}
      {activePastorTab === 'inbox' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Header de la Boîte */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C59A27]">
                <Inbox className="w-5 h-5 text-[#C59A27]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Boîte de Réception Pastorale ({rapports.length} reçus)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tous les rapports des bergers, chefs de tribu et départements remontent directement ici.
                </p>
              </div>
            </div>

            {/* Bouton pour simuler / soumettre un rapport */}
            <button
              onClick={() => {
                if (templates.length > 0) {
                  setSelectedTemplateForSubmit(templates[0]);
                  setShowSubmitModal(true);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-102 transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-[#E5B22F]" />
              <span>+ Soumettre un Rapport de Membre</span>
            </button>
          </div>

          {/* Filtres & Recherche */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'TOUS', label: 'Tous les rapports' },
                { id: 'URGENT', label: 'Prioritaires' },
                { id: 'TRIBU', label: 'Rapports Tribu' },
                { id: 'DEPARTEMENT', label: 'Départements' },
                { id: 'FAMILLE_HONNEUR', label: "Familles d'Honneur" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInboxFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    inboxFilter === tab.id
                      ? 'bg-[#0A3D36] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher entité, berger..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          {/* Liste des Rapports Reçus */}
          {filteredRapports.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Aucun rapport dans cette vue</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Les rapports soumis par les membres et responsables de cellules apparaîtront directement ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRapports.map(rapport => {
                const template = templates.find(t => t.id === rapport.templateId);

                return (
                  <div
                    key={rapport.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
                      rapport.urgente
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : rapport.statut === 'NOUVEAU'
                        ? 'border-[#0A3D36]/40 ring-1 ring-[#0A3D36]/10'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Top: Auteur & Statuts */}
                    <div>
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              rapport.auteurPhotoUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                            }
                            alt={rapport.auteurNom}
                            className="w-10 h-10 rounded-full object-cover border border-[#C59A27]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-slate-900 text-xs">
                                {rapport.auteurNom}
                              </h4>
                              {rapport.urgente && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#A31D24] text-white">
                                  Prioritaire
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 font-bold text-[10px]">
                              {rapport.auteurRole}
                            </p>
                            <p className="text-[#0A3D36] font-bold text-[11px] truncate">
                              {rapport.entiteConcernee}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                            rapport.statut === 'NOUVEAU'
                              ? 'bg-amber-100 text-[#C59A27] animate-pulse'
                              : rapport.statut === 'VALIDE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {rapport.statut === 'ANNOTATION_PASTORALE'
                            ? 'Annoté'
                            : rapport.statut}
                        </span>
                      </div>

                      {/* Rapport Body Overview */}
                      <div className="py-2.5 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {rapport.templateTitre}
                          </span>
                          <span>{rapport.periode}</span>
                        </div>

                        {/* Visualisation rapide de 2 valeurs */}
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {Object.entries(rapport.valeurs)
                            .slice(0, 2)
                            .map(([key, val]) => {
                              const field = template?.champs.find(c => c.id === key);
                              const label = field ? field.label : key;

                              if (field?.type === 'photo' && val) {
                                return (
                                  <div key={key} className="text-[10px] text-slate-600">
                                    📷 Photo de réunion jointe
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={key}
                                  className="text-[11px] text-slate-700 line-clamp-1"
                                >
                                  <span className="font-bold text-slate-500">{label}:</span>{' '}
                                  {String(val)}
                                </div>
                              );
                            })}
                        </div>

                        {/* Réponse Pastorale existante */}
                        {rapport.reponsePastorale && (
                          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 space-y-0.5">
                            <span className="font-black text-[10px] uppercase text-purple-700 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Directive Pastorale transmise :
                            </span>
                            <p className="line-clamp-2 italic">
                              « {rapport.reponsePastorale.note} »
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Action bouton */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {new Date(rapport.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <button
                        onClick={() => setSelectedRapportForDetail(rapport)}
                        className="px-3 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E5B22F]" />
                        <span>Ouvrir & Répondre</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ONGLET B : RÉSUMÉS DU CULTE */}
      {activePastorTab === 'cultes' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Résumés des Cultes & Célébrations ({cultes.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Archives des prédications, moisson d'âmes et directives spirituelles.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCulteModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-102 transition-all"
            >
              <Plus className="w-4 h-4 text-[#E5B22F]" />
              <span>Nouveau Résumé</span>
            </button>
          </div>

          {/* Liste des cultes */}
          <div className="space-y-4">
            {cultes.map(culte => (
              <div
                key={culte.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header du culte */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#0A3D36] text-[#E5B22F]">
                        {culte.typeCulte}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {new Date(culte.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {culte.theme}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Prédicateur : <span className="text-[#0A3D36]">{culte.orateur}</span> •
                      Passage : <span className="italic text-slate-800">{culte.passageBiblique}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyResume(culte)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Copier le résumé"
                    >
                      {copiedResumeId === culte.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedResumeId === culte.id ? 'Copié !' : 'Copier'}</span>
                    </button>
                    <button
                      onClick={() => handleShareResumeWhatsApp(culte)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Statistiques clés */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Total Présents
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {culte.statistiques.totalPresents}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-[#C59A27] uppercase block">
                      Nouveaux Venus
                    </span>
                    <span className="text-base font-black text-slate-900">
                      +{culte.statistiques.nouveauxVenus}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      Âmes données à Christ
                    </span>
                    <span className="text-base font-black text-emerald-800">
                      +{culte.statistiques.conversions}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">
                      Hommes / Femmes / Enf.
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {culte.statistiques.hommes}H • {culte.statistiques.femmes}F •{' '}
                      {culte.statistiques.enfants}E
                    </span>
                  </div>
                </div>

                {/* Vérités & Points clés */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Points Clés du Sermon :</span>
                  </h4>
                  <ul className="space-y-1 pl-4 text-xs text-slate-700 list-disc">
                    {culte.pointsCles.map((p, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Témoignages & Directive */}
                {culte.temoignagesMarquants.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                    <h5 className="text-[10px] font-black uppercase text-[#C59A27] flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Témoignages Vivants :
                    </h5>
                    {culte.temoignagesMarquants.map((t, i) => (
                      <p key={i} className="text-xs text-slate-800 italic">
                        « {t} »
                      </p>
                    ))}
                  </div>
                )}

                {culte.notesPastorales && (
                  <div className="p-3 rounded-2xl bg-[#0A3D36]/5 border border-[#0A3D36]/15">
                    <span className="text-[10px] font-black uppercase text-[#0A3D36] block mb-0.5">
                      Directive Pastorale pour les Responsables :
                    </span>
                    <p className="text-xs text-slate-800 font-semibold">{culte.notesPastorales}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET C : FENÊTRES DE RAPPORTS (CRÉATION DYNAMIQUE PAR LE PASTEUR) */}
      {activePastorTab === 'templates' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Fenêtres & Modèles de Rapports ({templates.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Définissez vous-même les fenêtres et les éléments qui doivent y figurer.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-102 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 text-[#E5B22F]" />
              <span>Créer Nouvelle Fenêtre</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(tpl => (
              <div
                key={tpl.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-9 h-9 rounded-2xl bg-[#0A3D36]/10 text-[#0A3D36] flex items-center justify-center font-bold">
                      {tpl.categorie === 'TRIBU' ? (
                        <Crown className="w-4 h-4 text-[#C59A27]" />
                      ) : tpl.categorie === 'DEPARTEMENT' ? (
                        <Briefcase className="w-4 h-4 text-[#0A3D36]" />
                      ) : (
                        <Home className="w-4 h-4 text-[#0A3D36]" />
                      )}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-700">
                      {tpl.categorie}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm mb-1">{tpl.titre}</h4>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{tpl.description}</p>

                  {/* Éléments obligatoires définis par le pasteur */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-[#0A3D36] block">
                      Éléments à renseigner ({tpl.champs.length}) :
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {tpl.champs.slice(0, 4).map(c => (
                        <li key={c.id} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C59A27]" />
                          <span className="truncate">{c.label}</span>
                        </li>
                      ))}
                      {tpl.champs.length > 4 && (
                        <li className="text-[10px] text-slate-400 pl-3">
                          + {tpl.champs.length - 4} autres éléments configurés
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Direct Link generator indicator */}
                  <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#0A3D36] font-bold flex items-center gap-1">
                        <Link2 className="w-3 h-3 text-[#C59A27]" />
                        <span>Lien direct généré :</span>
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#C59A27] text-slate-950">
                        WHATSAPP PRÊT
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate font-mono bg-white/70 px-1.5 py-0.5 rounded border border-amber-100">
                      ?tab=pastor&rapportForm={tpl.id}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons: WhatsApp Share, Copy Link, Remplir */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShareTemplateWhatsApp(tpl)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-xs hover:scale-101 active:scale-98"
                      title="Envoyer le lien direct aux responsables par WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTemplateLink(tpl)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-slate-200"
                      title="Copier le lien direct du formulaire"
                    >
                      {copiedTemplateId === tpl.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTemplateId === tpl.id ? 'Copié !' : 'Lien'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenSubmitForTemplate(tpl)}
                    className="w-full py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-[#E5B22F]" />
                    <span>Remplir ce Rapport</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET D : RAPPORTS SPÉCIAUX GÉNÉRÉS & PARTAGE */}
      {activePastorTab === 'speciaux' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C59A27]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Rapports Spéciaux d'Impact Pastoraux ({rapportsSpeciaux.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Consolidation stratégique générée par le Pasteur, prête pour diffusion.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSpecialModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-102 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#E5B22F]" />
              <span>+ Générer un Nouveau Spécial</span>
            </button>
          </div>

          <div className="space-y-4">
            {rapportsSpeciaux.map(spec => (
              <div
                key={spec.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C59A27]/20 text-[#0A3D36] border border-[#C59A27]/40">
                      {spec.periode}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {spec.titre}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      let text = `📜 *${spec.titre.toUpperCase()}*\n🗓️ ${spec.periode}\n\n${spec.introduction}\n\n`;
                      spec.syntheses.forEach(s => {
                        text += `📌 *${s.sectionTitre}* (${s.chiffreCle})\n${s.contenu}\n\n`;
                      });
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager sur WhatsApp</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  « {spec.introduction} »
                </p>

                {/* Chiffres clés */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Participants
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {spec.statistiquesGlobales.totalParticipants?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Nouvelles Âmes
                    </span>
                    <span className="text-base font-black text-emerald-900">
                      +{spec.statistiquesGlobales.nouvellesAmes}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-[#C59A27] uppercase block">
                      12 Tribus Actives
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {spec.statistiquesGlobales.tribusActives}/12
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">
                      Familles d'Honneur
                    </span>
                    <span className="text-base font-black text-blue-900">
                      {spec.statistiquesGlobales.famillesActives} Cellules
                    </span>
                  </div>
                </div>

                {/* Synthèses intégrées */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {spec.syntheses.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="font-bold text-slate-900 text-xs">{s.sectionTitre}</h5>
                        {s.chiffreCle && (
                          <span className="px-2 py-0.5 rounded-md bg-[#0A3D36] text-[#E5B22F] text-[10px] font-black">
                            {s.chiffreCle}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600">{s.contenu}</p>
                    </div>
                  ))}
                </div>

                {/* Directives */}
                {spec.directivesPastorales.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#0A3D36]/5 border border-[#0A3D36]/20 space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#0A3D36] block">
                      Directives Pastorales pour le Corps :
                    </span>
                    <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                      {spec.directivesPastorales.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET E : POINTAGE & PRÉSENCES DIMANCHE (7H30 & 10H30) */}
      {activePastorTab === 'presences' && (
        <CultePresencesManager
          presences={presences}
          tribes={tribes}
          tribeMembers={tribeMembers}
          currentUser={currentUser}
          onAddPresence={onAddPresence || (() => {})}
          onDeletePresence={onDeletePresence}
          onOpenPublicLink={onOpenPublicLink}
        />
      )}

      {/* ONGLET F : EFFECTIF TOTAL DES MEMBRES & SUIVI DES BREBIS */}
      {activePastorTab === 'membres' && (
        <PastorMembersDirectory
          tribeMembers={tribeMembers}
          tribes={tribes}
          presences={presences}
          currentUser={currentUser}
          onAddPresence={onAddPresence}
        />
      )}

      {/* MODALS */}
      {showCulteModal && (
        <CulteResumeModal
          currentUser={currentUser}
          onClose={() => setShowCulteModal(false)}
          onSubmit={resume => {
            onAddCulte(resume);
          }}
        />
      )}

      {showCreateTemplateModal && (
        <CreateReportTemplateModal
          onClose={() => setShowCreateTemplateModal(false)}
          onSubmit={tpl => {
            onAddTemplate(tpl);
          }}
          onOpenSubmitForm={tpl => {
            setSelectedTemplateForSubmit(tpl);
            setShowSubmitModal(true);
          }}
        />
      )}

      {showSubmitModal && selectedTemplateForSubmit && (
        <SubmitReportModal
          template={selectedTemplateForSubmit}
          currentUser={currentUser}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={rap => {
            onAddRapport(rap);
          }}
        />
      )}

      {selectedRapportForDetail && (
        <RapportDetailModal
          rapport={selectedRapportForDetail}
          template={templates.find(t => t.id === selectedRapportForDetail.templateId)}
          onClose={() => setSelectedRapportForDetail(null)}
          onUpdateRapport={updated => {
            onUpdateRapport(updated);
            setSelectedRapportForDetail(updated);
          }}
        />
      )}

      {showSpecialModal && (
        <RapportSpecialModal
          rapports={rapports}
          cultes={cultes}
          onClose={() => setShowSpecialModal(false)}
          onSaveSpecial={special => {
            onAddRapportSpecial(special);
          }}
        />
      )}
    </div>
  );
};
