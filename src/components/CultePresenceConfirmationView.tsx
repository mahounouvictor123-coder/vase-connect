import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Search,
  UserPlus,
  Send,
  Share2,
  ArrowLeft,
  Crown,
  Sparkles,
  Phone,
  MapPin,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check,
  Copy,
} from 'lucide-react';
import {
  CulteServiceType,
  CultePresenceRecord,
  TribeInfo,
  TribeMember,
  TribeId,
  UserProfile,
} from '../types';

interface CultePresenceConfirmationViewProps {
  initialDate?: string;
  initialCulte?: CulteServiceType;
  tribes: TribeInfo[];
  tribeMembers: TribeMember[];
  currentUser?: UserProfile | null;
  onConfirmPresence: (presence: CultePresenceRecord) => Promise<void> | void;
  onBackToHome: () => void;
  onOpenPastorSpace?: () => void;
}

export const CultePresenceConfirmationView: React.FC<CultePresenceConfirmationViewProps> = ({
  initialDate,
  initialCulte = 'CULTE_1_07H30',
  tribes,
  tribeMembers,
  currentUser,
  onConfirmPresence,
  onBackToHome,
  onOpenPastorSpace,
}) => {
  // Calcul du dimanche le plus proche par défaut
  const defaultSunday = useMemo(() => {
    if (initialDate) return initialDate;
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = dimanche
    const diffToSunday = (7 - dayOfWeek) % 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diffToSunday);
    return nextSunday.toISOString().split('T')[0];
  }, [initialDate]);

  const [dateDimanche, setDateDimanche] = useState<string>(defaultSunday);
  const [selectedCulte, setSelectedCulte] = useState<CulteServiceType>(initialCulte);
  const [identificationMode, setIdentificationMode] = useState<'search' | 'new'>('search');

  // Recherche parmi les préinscrits
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreRegisteredMember, setSelectedPreRegisteredMember] = useState<TribeMember | null>(null);

  // Formulaire pour nouveau / inscription
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [selectedTribeId, setSelectedTribeId] = useState<TribeId>('ruben');
  const [quartier, setQuartier] = useState('');
  const [statutMembre, setStatutMembre] = useState<CultePresenceRecord['statutMembre']>('MEMBRE_REGULIER');
  const [notes, setNotes] = useState('');

  // États de soumission et succès
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRecord, setConfirmedRecord] = useState<CultePresenceRecord | null>(null);
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  // Si l'utilisateur connecté existe et correspond à un membre de tribu
  React.useEffect(() => {
    if (currentUser && !selectedPreRegisteredMember) {
      const match = tribeMembers.find(
        tm =>
          (currentUser.tribeId && tm.tribeId === currentUser.tribeId && tm.nom.toLowerCase() === currentUser.nom.toLowerCase()) ||
          tm.userId === currentUser.id
      );
      if (match) {
        setSelectedPreRegisteredMember(match);
      }
    }
  }, [currentUser, tribeMembers, selectedPreRegisteredMember]);

  // Filtrer les membres préinscrits pour la recherche dynamique
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return tribeMembers.filter(m => {
      const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
      const reverseName = `${m.nom} ${m.prenom}`.toLowerCase();
      const phoneClean = m.numero.replace(/\s+/g, '');
      const tribe = tribes.find(t => t.id === m.tribeId);
      const tribeName = tribe ? tribe.name.toLowerCase() : '';

      return (
        fullName.includes(q) ||
        reverseName.includes(q) ||
        phoneClean.includes(q) ||
        tribeName.includes(q) ||
        (m.quartier && m.quartier.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [searchQuery, tribeMembers, tribes]);

  const handleSelectPreRegistered = (member: TribeMember) => {
    setSelectedPreRegisteredMember(member);
    setSearchQuery('');
  };

  const handleClearSelectedPreRegistered = () => {
    setSelectedPreRegisteredMember(null);
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalNom = '';
      let finalPrenom = '';
      let finalPhone = '';
      let finalTribeId: TribeId = 'ruben';
      let finalTribeName = 'Ruben';
      let finalQuartier = '';
      let finalMemberId: string | undefined = undefined;
      let finalStatut: CultePresenceRecord['statutMembre'] = 'MEMBRE_REGULIER';

      if (identificationMode === 'search' && selectedPreRegisteredMember) {
        finalNom = selectedPreRegisteredMember.nom;
        finalPrenom = selectedPreRegisteredMember.prenom;
        finalPhone = selectedPreRegisteredMember.numero;
        finalTribeId = selectedPreRegisteredMember.tribeId;
        const tribeObj = tribes.find(t => t.id === selectedPreRegisteredMember.tribeId);
        finalTribeName = tribeObj ? tribeObj.name : selectedPreRegisteredMember.tribeId;
        finalQuartier = selectedPreRegisteredMember.quartier || '';
        finalMemberId = selectedPreRegisteredMember.id;
        finalStatut = selectedPreRegisteredMember.roleInTribe === 'RESPONSABLE' ? 'RESPONSABLE' : 'MEMBRE_REGULIER';
      } else {
        if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
          setIsSubmitting(false);
          return;
        }
        finalNom = nom.trim();
        finalPrenom = prenom.trim();
        finalPhone = telephone.trim();
        finalTribeId = selectedTribeId;
        const tribeObj = tribes.find(t => t.id === selectedTribeId);
        finalTribeName = tribeObj ? tribeObj.name : selectedTribeId;
        finalQuartier = quartier.trim();
        finalStatut = statutMembre;
      }

      const culteLabel =
        selectedCulte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)';

      const record: CultePresenceRecord = {
        id: 'cp-' + Date.now(),
        dateDimanche,
        culte: selectedCulte,
        culteLabel,
        memberId: finalMemberId,
        nom: finalNom,
        prenom: finalPrenom,
        telephone: finalPhone,
        tribeId: finalTribeId,
        tribeName: finalTribeName,
        quartier: finalQuartier,
        statutMembre: finalStatut,
        confirmeAt: new Date().toISOString(),
        source: 'LIEN_MEMBRE',
        notes: notes.trim() ? notes.trim() : undefined,
      };

      await onConfirmPresence(record);
      setConfirmedRecord(record);
    } catch (err) {
      console.error('Erreur confirmation présence:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareLinkWhatsApp = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=presence_culte&date=${dateDimanche}&culte=${selectedCulte}`;
    const text = `🙏 *VASES D'HONNEUR — POINTAGE DU CULTE DOMINICAL*\n` +
      `Bien-aimé(e), confirme ta présence au culte de ce dimanche (${selectedCulte === 'CULTE_1_07H30' ? '1er Culte 07h30' : '2ème Culte 10h30'}) pour le compte de ta Tribu !\n\n` +
      `🔗 *Lien de confirmation directe :*\n${url}\n\n` +
      `_« Je suis dans la joie quand on me dit : Allons à la maison de l'Éternel ! » (Psaumes 122:1)_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=presence_culte&date=${dateDimanche}&culte=${selectedCulte}`;
    navigator.clipboard.writeText(url);
    setIsCopiedShare(true);
    setTimeout(() => setIsCopiedShare(false), 2500);
  };

  const handleResetForAnother = () => {
    setConfirmedRecord(null);
    setSelectedPreRegisteredMember(null);
    setSearchQuery('');
    setNom('');
    setPrenom('');
    setTelephone('');
    setQuartier('');
    setNotes('');
  };

  // ----------------------------------------------------
  // VUE DE SUCCÈS : PRÉSENCE BIEN CONFIRMÉE
  // ----------------------------------------------------
  if (confirmedRecord) {
    return (
      <div className="min-h-[85vh] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-[#C59A27]/30 overflow-hidden text-center p-6 sm:p-10 space-y-6 animate-fadeIn">
          {/* Badge & Icône de Victoire */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59A27]/15 border border-[#C59A27]/40 text-[#0A3D36] text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Présence Enregistrée avec Succès</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A3D36]">
              Alléluia ! Bienvenue dans la Présence de Dieu
            </h2>
            <p className="text-slate-600 text-sm">
              Merci cher(e) <strong className="text-slate-900 font-black">{confirmedRecord.prenom} {confirmedRecord.nom}</strong> ! Votre présence au culte a bien été enregistrée pour votre tribu.
            </p>
          </div>

          {/* Carte Récapitulative */}
          <div className="bg-[#F8FAF9] rounded-2xl p-5 border border-slate-200/80 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Calendar className="w-4 h-4 text-[#C59A27]" />
                <span>Dimanche :</span>
              </div>
              <span className="text-xs font-black text-slate-900">
                {new Date(confirmedRecord.dateDimanche + 'T00:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Culte Choisi :</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                {confirmedRecord.culteLabel}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <Crown className="w-4 h-4 text-[#C59A27]" />
                <span>Tribu d'Appartenance :</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A3D36] text-[#E5B22F] text-xs font-black uppercase">
                Tribu {confirmedRecord.tribeName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Statut du Fidèle :</span>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {confirmedRecord.statutMembre === 'RESPONSABLE'
                  ? 'Responsable / Patriarche'
                  : confirmedRecord.statutMembre === 'OUVRIER'
                  ? 'Ouvrier / Serviteur'
                  : confirmedRecord.statutMembre === 'NOUVEAU_CONVERTI'
                  ? 'Nouveau Converti'
                  : confirmedRecord.statutMembre === 'VISITEUR'
                  ? 'Visiteur'
                  : 'Fidèle & Membre Régulier'}
              </span>
            </div>
          </div>

          {/* Verset Biblique */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs italic leading-relaxed">
            « Car où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. »
            <div className="font-bold not-italic text-right mt-1 text-[#0A3D36]">— Matthieu 18:20</div>
          </div>

          {/* Actions & Partages */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleShareLinkWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-101 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager le lien dans le groupe de ma Tribu (WhatsApp)</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleResetForAnother}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4 text-slate-600" />
                <span>Pointer un proche / membre</span>
              </button>

              <button
                onClick={onBackToHome}
                className="py-2.5 px-4 rounded-xl bg-[#0A3D36] hover:bg-[#072a25] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#E5B22F]" />
                <span>Retour à la plateforme</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VUE DU FORMULAIRE DE CONFIRMATION
  // ----------------------------------------------------
  return (
    <div className="min-h-[85vh] py-8 px-3 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* 1. Entête Majestueuse */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] border border-[#C59A27]/40 shadow-xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C59A27]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/50 text-[#E5B22F] text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Vases d'Honneur • Culte Dominical</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenPastorSpace && currentUser?.role === 'PASTEUR' && (
                <button
                  type="button"
                  onClick={onOpenPastorSpace}
                  className="px-3 py-1.5 rounded-xl bg-[#C59A27] hover:bg-[#b0871e] text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Espace Pasteur</span>
                </button>
              )}

              <button
                type="button"
                onClick={onBackToHome}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour Accueil</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Confirmation de Présence au Culte
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Bien-aimé(e), nous célébrons Dieu chaque dimanche à <strong>07h30 (1er Culte)</strong> et à <strong>10h30 (2ème Culte)</strong>. Confirmez votre venue en sélectionnant votre culte et en tapant votre nom ou en vous inscrivant. Votre présence est automatiquement dénotée pour votre Tribu dans le tableau pastoral !
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Sélection du Culte & de la Date */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <Clock className="w-5 h-5 text-[#C59A27]" />
              <span>1. Choisissez votre Culte Dominical</span>
            </div>

            {/* Sélecteur de date dimanche */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600">Dimanche :</span>
              <input
                type="date"
                value={dateDimanche}
                onChange={e => setDateDimanche(e.target.value)}
                className="bg-transparent text-xs font-black text-[#0A3D36] focus:outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Grille des Deux Cultes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1er Culte : 07h30 */}
            <div
              onClick={() => setSelectedCulte('CULTE_1_07H30')}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between gap-4 ${
                selectedCulte === 'CULTE_1_07H30'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                    ☀️ Matinée de Gloire & Réveil
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    1er Culte • 07h30
                  </h3>
                  <p className="text-xs text-slate-500">
                    Début ponctuel à 07h30. Moment de réveil matinal, louange fervente et proclamation.
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedCulte === 'CULTE_1_07H30'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedCulte === 'CULTE_1_07H30' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Horaire : 07h30 - 09h45</span>
              </div>
            </div>

            {/* 2ème Culte : 10h30 */}
            <div
              onClick={() => setSelectedCulte('CULTE_2_10H30')}
              className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between gap-4 ${
                selectedCulte === 'CULTE_2_10H30'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase">
                    🕊️ Célébration & Familles
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    2ème Culte • 10h30
                  </h3>
                  <p className="text-xs text-slate-500">
                    Début ponctuel à 10h30. Grande célébration festive, adoration prophétique et familles.
                  </p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedCulte === 'CULTE_2_10H30'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedCulte === 'CULTE_2_10H30' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Horaire : 10h30 - 13h00</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Mode d'Identification (Tape son nom préinscrit OU S'inscrit) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <Users className="w-5 h-5 text-[#C59A27]" />
              <span>2. Identification du Fidèle</span>
            </div>
            <p className="text-xs text-slate-500">
              Tapez simplement votre nom si vous êtes déjà dans la liste des tribus, ou inscrivez-vous en 30 secondes.
            </p>
          </div>

          {/* Onglets de Bascule */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setIdentificationMode('search');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                identificationMode === 'search'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-[#C59A27]" />
              <span>Je tape mon nom préinscrit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIdentificationMode('new');
                setSelectedPreRegisteredMember(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                identificationMode === 'new'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Nouvelle Inscription / Visiteur</span>
            </button>
          </div>

          {/* MODE A : TAPE SON NOM PRÉINSCRIT */}
          {identificationMode === 'search' && (
            <div className="space-y-4">
              {!selectedPreRegisteredMember ? (
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Tapez votre Nom ou Prénom pour vous sélectionner :
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Ex: Koffi, Kouadio, Traoré, Diallo, Marie, Emmanuel..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27] bg-slate-50/50"
                    />
                  </div>

                  {/* Suggestions Instantanées */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-lg">
                      <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {searchResults.length} membre(s) trouvé(s) — Cliquez pour valider
                      </div>
                      {searchResults.map(member => {
                        const tribeObj = tribes.find(t => t.id === member.tribeId);
                        return (
                          <div
                            key={member.id}
                            onClick={() => handleSelectPreRegistered(member)}
                            className="p-3.5 hover:bg-emerald-50/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {member.photoUrl ? (
                                <img
                                  src={member.photoUrl}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-[#0A3D36] text-[#E5B22F] text-xs font-black flex items-center justify-center">
                                  {member.prenom[0]}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-black text-slate-900">
                                  {member.prenom} {member.nom}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                  <span className="font-bold text-[#0A3D36]">
                                    Tribu {tribeObj ? tribeObj.name : member.tribeId}
                                  </span>
                                  {member.quartier && <span>• {member.quartier}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-400">
                                {member.numero}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                      <p className="text-xs text-amber-900 font-medium">
                        Aucun membre préinscrit ne correspond à <strong>"{searchQuery}"</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIdentificationMode('new');
                          setNom(searchQuery);
                        }}
                        className="text-xs font-black text-emerald-700 underline hover:text-emerald-800"
                      >
                        Créer mon inscription pour ce culte maintenant →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Membre Sélectionné */
                <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {selectedPreRegisteredMember.photoUrl ? (
                        <img
                          src={selectedPreRegisteredMember.photoUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#0A3D36] text-[#E5B22F] text-sm font-black flex items-center justify-center border-2 border-emerald-600">
                          {selectedPreRegisteredMember.prenom[0]}
                        </div>
                      )}
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase">
                          <Check className="w-3 h-3 text-emerald-800" />
                          <span>Fidèle Préinscrit Confirmé</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900">
                          {selectedPreRegisteredMember.prenom} {selectedPreRegisteredMember.nom}
                        </h4>
                        <p className="text-xs text-slate-600 flex items-center gap-2">
                          <strong className="text-[#0A3D36]">
                            Tribu {tribes.find(t => t.id === selectedPreRegisteredMember.tribeId)?.name || selectedPreRegisteredMember.tribeId}
                          </strong>
                          <span>• {selectedPreRegisteredMember.numero}</span>
                          {selectedPreRegisteredMember.quartier && <span>• {selectedPreRegisteredMember.quartier}</span>}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearSelectedPreRegistered}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 underline px-2 py-1"
                    >
                      Changer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE B : NOUVELLE INSCRIPTION */}
          {identificationMode === 'new' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="Ex: Ruth, Emmanuel, David..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Nom de famille <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Ex: Koffi, Kouamé, Touré..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Numéro WhatsApp / Téléphone <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={e => setTelephone(e.target.value)}
                    placeholder="Ex: +225 07 00 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Votre Tribu (sur les 12 Tribus) <span className="text-red-500">*</span></span>
                  </label>
                  <select
                    value={selectedTribeId}
                    onChange={e => setSelectedTribeId(e.target.value as TribeId)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27] bg-white"
                  >
                    {tribes.map(t => (
                      <option key={t.id} value={t.id}>
                        Tribu {t.name} ({t.patriarchName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Quartier / Commune de résidence</span>
                  </label>
                  <input
                    type="text"
                    value={quartier}
                    onChange={e => setQuartier(e.target.value)}
                    placeholder="Ex: Cocody Angré, Yopougon, Marcory..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Statut au sein de l'Assemblée
                  </label>
                  <select
                    value={statutMembre}
                    onChange={e => setStatutMembre(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27] bg-white"
                  >
                    <option value="MEMBRE_REGULIER">Fidèle / Membre Régulier</option>
                    <option value="OUVRIER">Ouvrier / Serviteur de Département</option>
                    <option value="RESPONSABLE">Responsable / Patriarche de Tribu</option>
                    <option value="NOUVEAU_CONVERTI">Nouveau Converti (Moisson)</option>
                    <option value="VISITEUR">Visiteur pour la 1ère fois</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Note ou intention pastorale facultative */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Remarque ou besoin de prière / contact pastoral (facultatif)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Besoin d'un entretien pastoral, prière pour la famille, action de grâce..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59A27] focus:border-[#C59A27]"
            />
          </div>
        </div>

        {/* 4. Bouton de Confirmation Majeur */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              (identificationMode === 'search' && !selectedPreRegisteredMember) ||
              (identificationMode === 'new' && (!nom.trim() || !prenom.trim() || !telephone.trim()))
            }
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Enregistrement de la présence en cours...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#E5B22F]" />
                <span>
                  Confirmer ma Présence au {selectedCulte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)'}
                </span>
              </>
            )}
          </button>

          {/* Partage et Copie du Lien */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C59A27]" />
              Lien officiel de pointage dominical Vases d'Honneur
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-all"
              >
                {isCopiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedShare ? 'Lien copié !' : 'Copier le lien'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareLinkWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
