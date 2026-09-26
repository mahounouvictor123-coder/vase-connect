import React, { useState } from 'react';
import {
  X,
  FileText,
  Send,
  Share2,
  Copy,
  Check,
  Calendar,
  User,
  Phone,
  Tag,
  AlertTriangle,
  Upload,
  Crown,
  Award,
  Home,
  BookOpen,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RapportSoumis, RapportTemplate, UserProfile } from '../types';
import { LeadershipCategory } from '../data/leadershipData';

interface CreateSendReportModalProps {
  category: LeadershipCategory;
  defaultEntityName?: string;
  defaultLeaderName?: string;
  defaultLeaderPhone?: string;
  targetId?: string;
  templates?: RapportTemplate[];
  currentUser?: UserProfile | null;
  onClose: () => void;
  onSubmitReport: (rapport: RapportSoumis) => void;
}

export const CreateSendReportModal: React.FC<CreateSendReportModalProps> = ({
  category,
  defaultEntityName = '',
  defaultLeaderName = '',
  defaultLeaderPhone = '',
  templates = [],
  currentUser,
  onClose,
  onSubmitReport,
}) => {
  // Category defaults
  const getCategoryTitle = () => {
    switch (category) {
      case 'CHEF_TRIBU':
        return 'Rapport de Tribu • Patriarche / Matriarche';
      case 'BERGER_FAMILLE':
        return 'Rapport • Berger de Famille d\'Honneur';
      case 'CHEF_DEPARTEMENT':
        return 'Rapport Ministériel • Responsable de Département';
      case 'PASTEUR':
      default:
        return 'Rapport Pastoral Direct';
    }
  };

  const getRoleLabel = () => {
    switch (category) {
      case 'CHEF_TRIBU':
        return 'Patriarche / Matriarche de Tribu';
      case 'BERGER_FAMILLE':
        return 'Berger';
      case 'CHEF_DEPARTEMENT':
        return 'Responsable de Département';
      case 'PASTEUR':
      default:
        return 'Pasteur';
    }
  };

  // Form states
  const [entiteConcernee, setEntiteConcernee] = useState(
    defaultEntityName || (category === 'CHEF_TRIBU' ? 'Tribu de Juda' : category === 'BERGER_FAMILLE' ? 'Famille Grâce & Vie' : 'Département Communication')
  );
  const [auteurNom, setAuteurNom] = useState(
    defaultLeaderName || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '')
  );
  const [auteurTelephone, setAuteurTelephone] = useState(
    defaultLeaderPhone || currentUser?.phone || '+229 97 00 00 00'
  );
  const [periode, setPeriode] = useState(
    `Semaine du ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
  );
  const [urgente, setUrgente] = useState(false);

  // Quantitative fields
  const [participantsCount, setParticipantsCount] = useState<number>(18);
  const [nouvellesAmesCount, setNouvellesAmesCount] = useState<number>(2);
  const [offrandesMontant, setOffrandesMontant] = useState<string>('25 000 FCFA');

  // Narrative fields
  const [faitsMarquants, setFaitsMarquants] = useState<string>(
    'Forte mobilisation fraternelle, atmosphère de prière intense et communion spirituelle vivante.'
  );
  const [temoignages, setTemoignages] = useState<string>(
    'Témoignage de guérison et de délivrance partagé lors de notre dernière rencontre.'
  );
  const [besoinsPastoraux, setBesoinsPastoraux] = useState<string>(
    'Visite pastorale sollicitée pour deux familles éprouvées et soutien dans la prière.'
  );

  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState<string>('');

  // Status after submission
  const [submittedReport, setSubmittedReport] = useState<RapportSoumis | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleAddPhotoUrl = () => {
    if (photoInput.trim() && !photos.includes(photoInput.trim())) {
      setPhotos(prev => [...prev, photoInput.trim()]);
      setPhotoInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entiteConcernee.trim() || !auteurNom.trim()) return;

    const newReport: RapportSoumis = {
      id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      templateId: category === 'CHEF_TRIBU' ? 'tpl-tribu' : category === 'BERGER_FAMILLE' ? 'tpl-famille' : 'tpl-departement',
      templateTitre: getCategoryTitle(),
      categorie: category === 'CHEF_TRIBU' ? 'TRIBU' : category === 'BERGER_FAMILLE' ? 'FAMILLE_HONNEUR' : 'DEPARTEMENT',
      entiteConcernee: entiteConcernee.trim(),
      auteurNom: auteurNom.trim(),
      auteurId: currentUser?.id || `aut_${Date.now()}`,
      auteurRole: getRoleLabel(),
      auteurTelephone: auteurTelephone.trim(),
      dateRapport: new Date().toISOString().split('T')[0],
      periode: periode.trim(),
      valeurs: {
        total_presents: participantsCount,
        nouvelles_personnes: nouvellesAmesCount,
        finances_offrandes: offrandesMontant,
        faits_marquants: faitsMarquants,
        temoignages: temoignages,
        requetes_pastorales: besoinsPastoraux,
      },
      photos,
      statut: 'NOUVEAU',
      urgente,
      createdAt: new Date().toISOString(),
    };

    onSubmitReport(newReport);
    setSubmittedReport(newReport);
  };

  // Generate shareable link for the pastor
  const getShareablePastorLink = () => {
    if (!submittedReport) return '';
    return `${window.location.origin}${window.location.pathname}?viewRapportId=${submittedReport.id}`;
  };

  const handleCopyLink = () => {
    const link = getShareablePastorLink();
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSendToPastorWhatsApp = () => {
    if (!submittedReport) return;
    const link = getShareablePastorLink();
    const urgentBadge = submittedReport.urgente ? '🚨 *RAPPORT URGENT*\n' : '';
    
    const message =
      `🕊️ *VASES D'HONNEUR — TRANSMISSION DE RAPPORT AU PASTEUR*\n\n` +
      `${urgentBadge}` +
      `📖 *Catégorie :* ${submittedReport.templateTitre}\n` +
      `🏛️ *Entité :* ${submittedReport.entiteConcernee}\n` +
      `👤 *Responsable déclarant :* ${submittedReport.auteurRole} ${submittedReport.auteurNom}\n` +
      `📞 *Contact :* ${submittedReport.auteurTelephone}\n` +
      `📅 *Période :* ${submittedReport.periode}\n\n` +
      `📊 *Chiffres Clés :*\n` +
      `• Membres réunis : *${participantsCount} personnes*\n` +
      `• Nouvelles âmes : *${nouvellesAmesCount} âmes reçues*\n` +
      `• Caisse / Offrandes : *${offrandesMontant}*\n\n` +
      `📝 *Synthèse & Faits Marquants :*\n${faitsMarquants}\n\n` +
      (temoignages ? `✨ *Témoignage :*\n${temoignages}\n\n` : '') +
      (besoinsPastoraux ? `🙏 *Requête / Sujet Pastoral :*\n${besoinsPastoraux}\n\n` : '') +
      `🔗 *Consulter le rapport complet & confidentiel sur Vases Connect :*\n${link}\n\n` +
      `Que le Seigneur Jésus bénisse la Chaire Pastorale !`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] p-5 sm:p-6 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/40 flex items-center justify-center text-[#E5B22F]">
              {category === 'CHEF_TRIBU' && <Crown className="w-5 h-5 text-[#E5B22F]" />}
              {category === 'BERGER_FAMILLE' && <Home className="w-5 h-5 text-[#E5B22F]" />}
              {category === 'CHEF_DEPARTEMENT' && <Award className="w-5 h-5 text-[#E5B22F]" />}
              {category === 'PASTEUR' && <BookOpen className="w-5 h-5 text-[#E5B22F]" />}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C59A27]/20 text-[#F5DE98] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Espace Responsable • Rapport Direction</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {getCategoryTitle()}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!submittedReport ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
              <Share2 className="w-4 h-4 text-[#C59A27] shrink-0 mt-0.5" />
              <div>
                <strong>Transmission Directe à la Chaire Pastorale.</strong> Ce rapport sera archivé dans la boîte de réception confidentielle du Pasteur Principal. Dès validation, un lien sécurisé et un bouton WhatsApp vous permettront de lui faire parvenir en un clic.
              </div>
            </div>

            {/* Identification Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Entité, Famille d'Honneur ou Tribu *
                </label>
                <input
                  type="text"
                  required
                  value={entiteConcernee}
                  onChange={e => setEntiteConcernee(e.target.value)}
                  placeholder="Ex: Tribu de Ruben, Famille d'Honneur Grâce & Vie..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Période du Rapport *
                </label>
                <input
                  type="text"
                  required
                  value={periode}
                  onChange={e => setPeriode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Nom du Responsable déclarant ({getRoleLabel()}) *
                </label>
                <input
                  type="text"
                  required
                  value={auteurNom}
                  onChange={e => setAuteurNom(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Numéro de Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={auteurTelephone}
                  onChange={e => setAuteurTelephone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            {/* Quantitative Stats */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Statistiques Numériques & Impact</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Participants Réunis
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={participantsCount}
                    onChange={e => setParticipantsCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-[#0A3D36] focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Nouvelles Âmes / Reçues
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={nouvellesAmesCount}
                    onChange={e => setNouvellesAmesCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-amber-700 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Entraide / Offrandes
                  </label>
                  <input
                    type="text"
                    value={offrandesMontant}
                    onChange={e => setOffrandesMontant(e.target.value)}
                    placeholder="Ex: 35 000 FCFA"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Faits Marquants & Activités Réalisées *
                </label>
                <textarea
                  rows={2}
                  required
                  value={faitsMarquants}
                  onChange={e => setFaitsMarquants(e.target.value)}
                  placeholder="Décrivez le déroulement, l'ambiance spirituelle, les enseignements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Témoignages & Victoires Partagées
                </label>
                <textarea
                  rows={2}
                  value={temoignages}
                  onChange={e => setTemoignages(e.target.value)}
                  placeholder="Témoignage de guérison, percée professionnelle, réconciliation..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Besoins Spirituels & Requêtes Pastorales pour le Pasteur
                </label>
                <textarea
                  rows={2}
                  value={besoinsPastoraux}
                  onChange={e => setBesoinsPastoraux(e.target.value)}
                  placeholder="Situations particulières, familles malades nécessitant une visite..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            {/* Photos Upload */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label className="text-xs font-black text-slate-800 block">
                Photos de Communion / Rencontre (Optionnel)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={photoInput}
                  onChange={e => setPhotoInput(e.target.value)}
                  placeholder="Coller l'URL d'une photo d'activité..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0"
                  >
                    + Ajouter URL
                  </button>
                  <label className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-2">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white text-[10px] rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Urgence Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-xs font-black text-rose-950 block">
                    Marquer ce rapport comme URGENT
                  </span>
                  <span className="text-[11px] text-rose-700">
                    Notifie immédiatement la chaire pastorale en priorité haute.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={urgente}
                onChange={e => setUrgente(e.target.checked)}
                className="w-5 h-5 rounded-md accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#135E54] hover:to-[#0A3D36] text-white text-xs font-black shadow-md flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
              >
                <Send className="w-4 h-4 text-[#C59A27]" />
                <span>Enregistrer & Générer le Lien pour le Pasteur</span>
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* ÉCRAN DE SUCCÈS & PARTAGE DU RAPPORT PAR LIEN / WHATSAPP AU PASTEUR       */
          /* ========================================================================= */
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">
                Rapport Transmis avec Succès !
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Votre rapport a été enregistré dans le registre central et est immédiatement visible par la chaire pastorale.
              </p>
            </div>

            {/* Boîte du lien direct à envoyer au Pasteur */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-left max-w-lg mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Lien d'Accès Sécurisé pour le Pasteur</span>
                </span>
                {isCopied && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Copié !
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareablePastorLink()}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Copier</span>
                </button>
              </div>
            </div>

            {/* Boutons d'Action Directe */}
            <div className="space-y-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={handleSendToPastorWhatsApp}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow-lg hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-2.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Envoyer le Rapport au Pasteur par WhatsApp avec le Lien</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Fermer la fenêtre
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
