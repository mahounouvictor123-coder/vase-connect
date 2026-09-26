import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Users,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  Phone,
  MessageCircle,
  Trash2,
  Layers,
  X,
  Send,
  Sparkles,
  ExternalLink,
  Lock,
  Unlock,
  Smartphone,
  Crown,
  Share2,
  Calendar,
  Heart,
  Briefcase,
  Home,
  BookOpen,
} from 'lucide-react';
import { PastorDelegation, DelegationPortionType } from '../../types';
import {
  getPastorDelegations,
  savePastorDelegations,
  generateRandomAccessCode,
  generateDelegationUrl,
  generateWhatsAppDelegationMessage,
} from '../../data/pastorDelegationsData';
import { AddToHomeScreenModal } from '../common/AddToHomeScreenModal';

interface PastorCloisonnementManagerProps {
  onTestDelegation?: (delegation: PastorDelegation) => void;
}

const PORTION_PRESETS: {
  type: DelegationPortionType;
  label: string;
  defaultRole: string;
  defaultOnglets: string[];
  defaultPastorPortions: (
    | 'inbox'
    | 'cultes'
    | 'templates'
    | 'speciaux'
    | 'presences'
    | 'membres'
    | 'responsables'
    | 'cloisonnement'
  )[];
  description: string;
  icon: any;
}[] = [
  {
    type: 'MEMBRE',
    label: 'Accès Membre / Fidèle (Portion Grand Public)',
    defaultRole: 'Membre de l’Assemblée (Espace Fidèle)',
    defaultOnglets: ['accueil', 'coeur_honneur', 'familles_honneur', 'tribus', 'portes', 'market', 'opportunites', 'evenements', 'mon_profil'],
    defaultPastorPortions: [],
    description: 'Accès exclusif aux activités fraternelles, requêtes d’aide, familles et tribus. Espace pastoral 100% verrouillé.',
    icon: Users,
  },
  {
    type: 'RESPONSABLE_PRESENCES',
    label: 'Responsable du Pointage des Présences (Culte)',
    defaultRole: 'Responsable du Pointage des Présences au Culte',
    defaultOnglets: ['presence_culte', 'pastor'],
    defaultPastorPortions: ['presences', 'cultes'],
    description: 'Accès dédié au pointage dominical en direct (7h30 & 10h30), décompte de l’assistance et transmission des bilans.',
    icon: Calendar,
  },
  {
    type: 'BERGER_FAMILLE',
    label: 'Berger de Famille d’Honneur (Cellule de Maison)',
    defaultRole: 'Berger de Famille d’Honneur',
    defaultOnglets: ['familles_honneur', 'coeur_honneur'],
    defaultPastorPortions: ['templates'],
    description: 'Gestion des fidèles de la cellule de maison de proximité et formulaires de rapports de réunion.',
    icon: Home,
  },
  {
    type: 'RESPONSABLE_TRIBU',
    label: 'Patriarche / Responsable de Tribu',
    defaultRole: 'Patriarche de Tribu',
    defaultOnglets: ['tribus', 'presence_culte'],
    defaultPastorPortions: ['membres'],
    description: 'Gestion des membres de la tribu, enrôlement et mobilisation pour les cultes.',
    icon: Crown,
  },
  {
    type: 'RESPONSABLE_COEUR_HONNEUR',
    label: 'Responsable Diaconie & Cœur d’Honneur',
    defaultRole: 'Responsable Cœur d’Honneur (Bienfaisance)',
    defaultOnglets: ['coeur_honneur', 'pastor'],
    defaultPastorPortions: ['templates', 'speciaux'],
    description: 'Supervision des campagnes d’aide d’urgence, instruction confidentielle des dossiers de secours fraternel.',
    icon: Heart,
  },
  {
    type: 'RESPONSABLE_DEPARTEMENT',
    label: 'Responsable de Département / Ministère',
    defaultRole: 'Responsable de Département',
    defaultOnglets: ['accueil', 'opportunites', 'evenements'],
    defaultPastorPortions: ['templates'],
    description: 'Coordination de son équipe de serviteurs et soumission des bilans départementaux.',
    icon: Briefcase,
  },
  {
    type: 'SUR_MESURE',
    label: 'Accès Sur-Mesure (Configuration Libre)',
    defaultRole: 'Délégué Pastoral Spécial',
    defaultOnglets: ['accueil'],
    defaultPastorPortions: [],
    description: 'Vous choisissez manuellement les onglets et portions exactes permises pour ce destinataire.',
    icon: Shield,
  },
];

const ALL_AVAILABLE_TABS = [
  { id: 'accueil', label: 'Accueil & Événements' },
  { id: 'presence_culte', label: 'Pointage Présences Dimanche' },
  { id: 'familles_honneur', label: 'Familles d’Honneur (Cellules)' },
  { id: 'tribus', label: 'Tribus du Royaume' },
  { id: 'coeur_honneur', label: 'Cœur d’Honneur (Aides & Dons)' },
  { id: 'portes', label: 'Portes d’Influence' },
  { id: 'membres', label: 'Annuaire des Talents & Membres' },
  { id: 'market', label: 'Marketplace Chrétienne' },
  { id: 'opportunites', label: 'Opportunités & Emplois' },
  { id: 'evenements', label: 'Agenda des Programmes' },
  { id: 'mon_profil', label: 'Espace Mon Profil' },
  { id: 'pastor', label: 'Espace Pastoral (Portion autorisée)' },
];

export const PastorCloisonnementManager: React.FC<PastorCloisonnementManagerProps> = ({
  onTestDelegation,
}) => {
  const [delegations, setDelegations] = useState<PastorDelegation[]>(getPastorDelegations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPresetType, setSelectedPresetType] = useState<DelegationPortionType>('RESPONSABLE_PRESENCES');
  const [formNom, setFormNom] = useState('');
  const [formTelephone, setFormTelephone] = useState('');
  const [formRole, setFormRole] = useState('Responsable du Pointage des Présences au Culte');
  const [formEntite, setFormEntite] = useState('Département Protocole & Accueil');
  const [formNotes, setFormNotes] = useState('');
  const [formOnglets, setFormOnglets] = useState<string[]>(['presence_culte', 'pastor']);
  const [formPastorPortions, setFormPastorPortions] = useState<
    ('inbox' | 'cultes' | 'templates' | 'speciaux' | 'presences' | 'membres' | 'responsables' | 'cloisonnement')[]
  >(['presences', 'cultes']);

  // Modal PWA Install Preview
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [selectedDelegationForPwa, setSelectedDelegationForPwa] = useState<PastorDelegation | null>(null);

  const handlePresetSelect = (presetType: DelegationPortionType) => {
    setSelectedPresetType(presetType);
    const preset = PORTION_PRESETS.find((p) => p.type === presetType);
    if (preset) {
      setFormRole(preset.defaultRole);
      setFormOnglets(preset.defaultOnglets);
      setFormPastorPortions(preset.defaultPastorPortions);
    }
  };

  const handleToggleTab = (tabId: string) => {
    setFormOnglets((prev) =>
      prev.includes(tabId) ? prev.filter((t) => t !== tabId) : [...prev, tabId]
    );
  };

  const handleTogglePastorPortion = (
    portion: 'inbox' | 'cultes' | 'templates' | 'speciaux' | 'presences' | 'membres' | 'responsables' | 'cloisonnement'
  ) => {
    setFormPastorPortions((prev) =>
      prev.includes(portion) ? prev.filter((p) => p !== portion) : [...prev, portion]
    );
  };

  const handleCreateDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom.trim() || !formRole.trim() || formOnglets.length === 0) {
      alert('Veuillez renseigner le nom, le rôle et au moins un onglet autorisé.');
      return;
    }

    const newDel: PastorDelegation = {
      id: 'del-' + Date.now(),
      nomBeneficiaire: formNom.trim(),
      telephoneBeneficiaire: formTelephone.trim(),
      titreRole: formRole.trim(),
      typePortion: selectedPresetType,
      ongletsAutorises: formOnglets,
      portionsPastoralesAutorisees: formPastorPortions,
      entiteAssociee: formEntite.trim() || 'Église Vases d’Honneur',
      actif: true,
      dateCreation: new Date().toISOString(),
      codeAccesCourt: generateRandomAccessCode(
        selectedPresetType === 'MEMBRE' ? 'VC-MBR' : 'VC-DIR'
      ),
      notesPastorales: formNotes.trim() || undefined,
    };

    const updated = [newDel, ...delegations];
    setDelegations(updated);
    savePastorDelegations(updated);
    setShowCreateModal(false);

    // Reset form
    setFormNom('');
    setFormTelephone('');
    setFormNotes('');
  };

  const handleToggleActive = (id: string) => {
    const updated = delegations.map((d) => (d.id === id ? { ...d, actif: !d.actif } : d));
    setDelegations(updated);
    savePastorDelegations(updated);
  };

  const handleDeleteDelegation = (id: string) => {
    if (confirm('Êtes-vous certain de vouloir révoquer et supprimer définitivement ce lien délégué ?')) {
      const updated = delegations.filter((d) => d.id !== id);
      setDelegations(updated);
      savePastorDelegations(updated);
    }
  };

  const handleCopyLink = (del: PastorDelegation) => {
    const url = generateDelegationUrl(del);
    navigator.clipboard.writeText(url);
    setCopiedId(del.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = (del: PastorDelegation) => {
    const message = generateWhatsAppDelegationMessage(del);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredDelegations = delegations.filter((d) => {
    const matchesSearch =
      d.nomBeneficiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.titreRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.entiteAssociee && d.entiteAssociee.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.codeAccesCourt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || d.typePortion === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-[#C59A27]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C59A27]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#E5B22F]" />
              <span>Gouvernance & Cloisonnement Pastoral Sécurisé</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Gestionnaire des Liens d'Accès Délégués & Portions
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Déléguez des accès strictement cloisonnés aux <strong>membres</strong> et aux <strong>responsables</strong> (présences, tribus, familles, départements, diaconie). Chaque lien restreint le destinataire à sa <strong>seule portion définie</strong> et permet d'ajouter l'application sur son écran d'accueil avec le logo officiel <strong>Vases Connect</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                handlePresetSelect('RESPONSABLE_PRESENCES');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#d4a92c] hover:to-[#f0c246] text-[#062722] font-black text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un Nouvel Accès Cloisonné</span>
            </button>
          </div>
        </div>

        {/* Stats summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <p className="text-[10px] text-amber-200 uppercase font-bold">Total Liens Générés</p>
            <p className="text-lg font-black text-white">{delegations.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <p className="text-[10px] text-emerald-300 uppercase font-bold">Accès Actifs</p>
            <p className="text-lg font-black text-emerald-400">
              {delegations.filter((d) => d.actif).length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <p className="text-[10px] text-amber-200 uppercase font-bold">Profils Responsables</p>
            <p className="text-lg font-black text-white">
              {delegations.filter((d) => d.typePortion !== 'MEMBRE').length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <p className="text-[10px] text-amber-200 uppercase font-bold">Profils Membres</p>
            <p className="text-lg font-black text-white">
              {delegations.filter((d) => d.typePortion === 'MEMBRE').length}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, rôle, département, code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
          >
            <option value="ALL">Tous les types d'accès</option>
            <option value="MEMBRE">Membres / Fidèles</option>
            <option value="RESPONSABLE_PRESENCES">Pointage Présences Cultes</option>
            <option value="BERGER_FAMILLE">Bergers Familles d'Honneur</option>
            <option value="RESPONSABLE_TRIBU">Patriarches de Tribus</option>
            <option value="RESPONSABLE_COEUR_HONNEUR">Cœur d'Honneur</option>
            <option value="RESPONSABLE_DEPARTEMENT">Départements</option>
            <option value="SUR_MESURE">Sur-mesure</option>
          </select>
        </div>
      </div>

      {/* 3. Delegations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDelegations.map((del) => {
          const url = generateDelegationUrl(del);
          const isCopied = copiedId === del.id;

          return (
            <div
              key={del.id}
              className={`rounded-3xl p-5 border transition-all ${
                del.actif
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              {/* Header card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A3D36]/10 text-[#0A3D36] flex items-center justify-center font-black">
                    <Shield className="w-5 h-5 text-[#C59A27]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {del.codeAccesCourt}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          del.actif
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {del.actif ? '● Actif' : '○ Révoqué'}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug mt-0.5">
                      {del.titreRole}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(del.id)}
                  title={del.actif ? 'Désactiver ce lien' : 'Réactiver ce lien'}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  {del.actif ? <Lock className="w-4 h-4 text-emerald-600" /> : <Unlock className="w-4 h-4 text-rose-500" />}
                </button>
              </div>

              {/* Beneficiaire & Entité */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Bénéficiaire :</span>
                  <span className="font-black text-slate-800">{del.nomBeneficiaire}</span>
                </div>
                {del.telephoneBeneficiaire && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">WhatsApp :</span>
                    <span className="font-semibold text-slate-700">{del.telephoneBeneficiaire}</span>
                  </div>
                )}
                {del.entiteAssociee && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-bold">Entité rattachée :</span>
                    <span className="font-semibold text-[#0A3D36]">{del.entiteAssociee}</span>
                  </div>
                )}
              </div>

              {/* Cloisonnement - Portions autorisées vs restreintes */}
              <div className="space-y-2 mb-4 text-xs">
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Portions & Onglets Autorisés ({del.ongletsAutorises.length}) :</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {del.ongletsAutorises.map((tabId) => (
                      <span
                        key={tabId}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold"
                      >
                        {ALL_AVAILABLE_TABS.find((t) => t.id === tabId)?.label || tabId}
                      </span>
                    ))}
                  </div>
                </div>

                {del.typePortion === 'MEMBRE' ? (
                  <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200 text-[10px] text-rose-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>
                      <strong>Cloisonnement :</strong> Espace pastoral, rapports confidentiels et gouvernance strictement inaccessibles.
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#C59A27] shrink-0" />
                    <span>
                      <strong>Portion pastorale restreinte :</strong> Seuls les outils attribués à {del.titreRole} sont visibles.
                    </span>
                  </div>
                )}
              </div>

              {/* URL Snippet */}
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 mb-3 flex items-center justify-between text-[11px] font-mono text-slate-700 truncate">
                <span className="truncate">{url}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => handleCopyLink(del)}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-black">Lien Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>Copier le Lien</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleShareWhatsApp(del)}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Envoyer WhatsApp</span>
                </button>
              </div>

              {/* Secondary utility actions */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => {
                    setSelectedDelegationForPwa(del);
                    setShowPwaModal(true);
                  }}
                  className="text-[#0A3D36] hover:text-[#135E54] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Guide Ajout Écran (App)</span>
                </button>

                {onTestDelegation && (
                  <button
                    onClick={() => onTestDelegation(del)}
                    className="text-blue-600 hover:text-blue-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tester la vue</span>
                  </button>
                )}

                <button
                  onClick={() => handleDeleteDelegation(del.id)}
                  className="text-rose-600 hover:text-rose-700 font-bold text-[11px] flex items-center gap-1 p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Supprimer définitivement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDelegations.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
          <Shield className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-sm text-slate-700">Aucun accès cloisonné trouvé</p>
          <p className="text-xs">Modifiez vos critères de recherche ou créez un nouvel accès délégué.</p>
        </div>
      )}

      {/* 4. MODALE DE CRÉATION D'ACCÈS CLOISONNÉ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#C59A27]/40 my-auto flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
                  <Shield className="w-5 h-5 text-[#E5B22F]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Créer un Nouvel Accès Cloisonné Dédié
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    Définition des prérogatives et génération du lien exclusif
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateDelegation} className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Presets Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  1. Choisir un Modèle d’Accès ou Sur-Mesure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PORTION_PRESETS.map((preset) => {
                    const isSelected = selectedPresetType === preset.type;
                    const Icon = preset.icon;

                    return (
                      <div
                        key={preset.type}
                        onClick={() => handlePresetSelect(preset.type)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#0A3D36]/5 border-[#0A3D36] ring-2 ring-[#0A3D36]/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0A3D36]' : 'text-slate-500'}`} />
                          <h4 className="text-xs font-black text-slate-900 line-clamp-1">{preset.label}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{preset.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Beneficiaire Identity */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  2. Destinataire & Entité
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nom & Prénom du Destinataire <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formNom}
                      onChange={(e) => setFormNom(e.target.value)}
                      placeholder="Ex: Frère David KOUADIO"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Numéro WhatsApp (pour l’envoi direct)
                    </label>
                    <input
                      type="tel"
                      value={formTelephone}
                      onChange={(e) => setFormTelephone(e.target.value)}
                      placeholder="Ex: +229 97 00 00 00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Titre / Rôle Attribué <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="Ex: Responsable du Pointage des Présences"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Entité Rattachée
                    </label>
                    <input
                      type="text"
                      value={formEntite}
                      onChange={(e) => setFormEntite(e.target.value)}
                      placeholder="Ex: Tribu de Juda, Cellule Fidjrossè..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Onglets & Portions Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                    3. Onglets & Sections Autorisés (Cloisonnement) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {formOnglets.length} sélectionné(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_AVAILABLE_TABS.map((tab) => {
                    const isChecked = formOnglets.includes(tab.id);

                    return (
                      <label
                        key={tab.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTab(tab.id)}
                          className="w-4 h-4 text-[#0A3D36] rounded border-slate-300"
                        />
                        <span className="text-[11px]">{tab.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Si espace pastor autorise, selectionner les sous-onglets pastoraux */}
                {formOnglets.includes('pastor') && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
                    <p className="font-black text-amber-900 text-xs">
                      Portions pastorales internes autorisées pour ce responsable :
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { id: 'presences', label: 'Pointage Présences' },
                        { id: 'cultes', label: 'Synthèses Cultes' },
                        { id: 'templates', label: 'Formulaires Rapports' },
                        { id: 'speciaux', label: 'Rapports Spéciaux' },
                        { id: 'membres', label: 'Annuaire Brebis' },
                        { id: 'inbox', label: 'Boîte Pastorale' },
                      ].map((item) => {
                        const isPortionChecked = formPastorPortions.includes(item.id as any);
                        return (
                          <label key={item.id} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isPortionChecked}
                              onChange={() => handleTogglePastorPortion(item.id as any)}
                              className="w-3.5 h-3.5 text-[#0A3D36] rounded"
                            />
                            <span className="text-[10px] font-semibold text-slate-800">{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Shield className="w-4 h-4 text-[#E5B22F]" />
                  <span>Générer le Lien d'Accès Cloisonné Officiel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal PWA Install Preview */}
      {showPwaModal && (
        <AddToHomeScreenModal
          isOpen={showPwaModal}
          onClose={() => setShowPwaModal(false)}
          customTitle={`Vases Connect — ${selectedDelegationForPwa?.titreRole || 'Accès Délégué'}`}
          customPortion={selectedDelegationForPwa?.titreRole}
        />
      )}
    </div>
  );
};
