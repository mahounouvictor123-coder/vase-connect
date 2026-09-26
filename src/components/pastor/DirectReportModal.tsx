import React, { useState } from 'react';
import {
  X,
  Send,
  FileText,
  User,
  Phone,
  Calendar,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  Upload,
  Crown,
  Share2,
  Check,
  Shield,
  Layers,
} from 'lucide-react';
import { RapportTemplate, RapportSoumis, UserProfile } from '../../types';

interface DirectReportModalProps {
  template: RapportTemplate;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmitReport: (rapport: RapportSoumis) => void;
}

export const DirectReportModal: React.FC<DirectReportModalProps> = ({
  template,
  currentUser,
  onClose,
  onSubmitReport,
}) => {
  const [auteurNom, setAuteurNom] = useState(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''
  );
  const [auteurRole, setAuteurRole] = useState(
    currentUser?.role && currentUser.role !== 'MEMBRE'
      ? currentUser.role
      : template.categorie === 'TRIBU'
      ? 'Patriarche / Adjoint de Tribu'
      : template.categorie === 'FAMILLE_HONNEUR'
      ? 'Berger de Famille'
      : template.categorie === 'DEPARTEMENT'
      ? 'Responsable / Serviteur de Département'
      : 'Membre Déclarant'
  );
  const [auteurTelephone, setAuteurTelephone] = useState(
    currentUser?.phone || ''
  );
  const [entiteConcernee, setEntiteConcernee] = useState(
    currentUser?.familleHonneurNom ||
    currentUser?.tribeName ||
    currentUser?.departmentName ||
    (template.categorie === 'TRIBU'
      ? 'Tribu de Juda'
      : template.categorie === 'FAMILLE_HONNEUR'
      ? 'Famille Grâce & Vie'
      : template.categorie === 'DEPARTEMENT'
      ? 'Protocole & Accueil Royal'
      : template.titre)
  );
  const [periode, setPeriode] = useState(
    `Semaine du ${new Date().toLocaleDateString('fr-FR')}`
  );
  const [urgente, setUrgente] = useState(false);

  // Dynamic field values
  const [valeurs, setValeurs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    template.champs.forEach((champ) => {
      if (champ.type === 'number') initial[champ.id] = 0;
      else if (champ.type === 'boolean') initial[champ.id] = false;
      else if (champ.type === 'select' && champ.options && champ.options[0]) {
        initial[champ.id] = champ.options[0];
      } else initial[champ.id] = '';
    });
    return initial;
  });

  const [submittedReport, setSubmittedReport] = useState<RapportSoumis | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleValueChange = (champId: string, val: any) => {
    setValeurs((prev) => ({
      ...prev,
      [champId]: val,
    }));
  };

  const handleFileUpload = (
    champId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleValueChange(champId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auteurNom.trim() || !entiteConcernee.trim()) {
      alert('Veuillez renseigner votre Nom et l’Entité concernée.');
      return;
    }

    setIsSubmitting(true);

    // Collect photos
    const photos: string[] = [];
    template.champs.forEach((champ) => {
      if (champ.type === 'photo' && valeurs[champ.id]) {
        photos.push(valeurs[champ.id]);
      }
    });

    const newRapport: RapportSoumis = {
      id: 'rap-' + Date.now(),
      templateId: template.id,
      templateTitre: template.titre,
      categorie: template.categorie,
      entiteConcernee: entiteConcernee.trim(),
      auteurId: currentUser?.id || 'member-' + Date.now(),
      auteurNom: auteurNom.trim(),
      auteurRole: auteurRole.trim(),
      auteurTelephone: auteurTelephone.trim() || 'Non renseigné',
      auteurPhotoUrl:
        currentUser?.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      dateRapport: new Date().toISOString().split('T')[0],
      periode: periode.trim(),
      valeurs,
      statut: 'NOUVEAU',
      photos: photos.length > 0 ? photos : undefined,
      urgente,
      createdAt: new Date().toISOString(),
    };

    onSubmitReport(newRapport);
    setSubmittedReport(newRapport);
    setIsSubmitting(false);
  };

  const shareReportUrl = submittedReport
    ? `${window.location.origin}${window.location.pathname}?viewRapportId=${submittedReport.id}`
    : '';

  const handleSharePastorWhatsApp = () => {
    if (!submittedReport) return;
    const urgentBadge = submittedReport.urgente ? '🚨 *RAPPORT URGENT*\n' : '';
    const message =
      `🕊️ *VASES D'HONNEUR — RAPPORT TRANSMIS À LA CHAIRE PASTORALE*\n\n` +
      `${urgentBadge}` +
      `📖 *Formulaire :* ${submittedReport.templateTitre}\n` +
      `🏛️ *Entité :* ${submittedReport.entiteConcernee}\n` +
      `👤 *Déclarant :* ${submittedReport.auteurRole} ${submittedReport.auteurNom}\n` +
      `📞 *Contact :* ${submittedReport.auteurTelephone}\n` +
      `📅 *Période :* ${submittedReport.periode}\n\n` +
      `✅ *Le rapport complet a été soumis et archivé dans votre boîte pastorale sur Vases Connect :*\n` +
      `👉 ${shareReportUrl}\n\n` +
      `Que le Seigneur Jésus bénisse et fortifie votre ministère pastoral !`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyReportLink = () => {
    if (!shareReportUrl) return;
    navigator.clipboard.writeText(shareReportUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-emerald-100 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <FileText className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C59A27]/20 text-[#F5DE98] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#E5B22F]" />
                <span>Formulaire Officiel • Chaire Pastorale</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {template.titre}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Pastoral Banner */}
        {!submittedReport && (
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 sm:px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 shrink-0">
            <Shield className="w-4 h-4 text-[#C59A27] shrink-0" />
            <p>
              <strong>Lien officiel de rapport :</strong> Vous avez accédé directement au formulaire demandé par la direction. Remplissez les données ci-dessous pour les transmettre à la boîte du Pasteur.
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {submittedReport ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="py-6 sm:py-8 text-center space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  Rapport Transmis avec Succès !
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Votre rapport <strong>« {submittedReport.templateTitre} »</strong> pour{' '}
                  <span className="text-[#0A3D36] font-bold">{submittedReport.entiteConcernee}</span> a été immédiatement archivé dans la boîte confidentielle du Pasteur Principal Mohammed Sanogo.
                </p>
              </div>

              {/* Pastoral WhatsApp Share Action */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Confirmer la transmission au Pasteur sur WhatsApp :</span>
                </div>
                <button
                  onClick={handleSharePastorWhatsApp}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Envoyer la notification WhatsApp au Pasteur</span>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleCopyReportLink}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-black">Lien Copié !</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>Copier le lien du rapport</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs cursor-pointer"
                >
                  Terminer & Continuer
                </button>
              </div>
            </div>
          ) : (
            /* REPORT SUBMISSION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Template Category & Description */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A3D36] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Catégorie : {template.categorie}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {template.champs.length} indicateurs à renseigner
                  </span>
                </div>
                {template.description && (
                  <p className="text-xs text-slate-600 italic">
                    « {template.description} »
                  </p>
                )}
              </div>

              {/* IDENTITÉ DU DÉCLARANT */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>1. Identité du Déclarant & Entité</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Votre Nom & Prénom <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={auteurNom}
                      onChange={(e) => setAuteurNom(e.target.value)}
                      placeholder="Ex: Frère Marc KOUASSI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Votre Rôle / Titre <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={auteurRole}
                      onChange={(e) => setAuteurRole(e.target.value)}
                      placeholder="Ex: Berger, Chef de Tribu, Serviteur..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Entité Concernée <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={entiteConcernee}
                      onChange={(e) => setEntiteConcernee(e.target.value)}
                      placeholder="Ex: Tribu de Ruben, Cellule Fidjrossè..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Téléphone / Contact WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={auteurTelephone}
                      onChange={(e) => setAuteurTelephone(e.target.value)}
                      placeholder="Ex: +229 97 00 00 00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Période ou Date concernée
                  </label>
                  <input
                    type="text"
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    placeholder="Ex: Semaine du 25 au 30, ou Culte de Dimanche"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#0A3D36] focus:ring-1 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
              </div>

              {/* INDICATEURS DU TEMPLATE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>2. Données & Statistiques Demandées</span>
                </h4>

                <div className="space-y-3">
                  {template.champs.map((champ) => (
                    <div key={champ.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {champ.label}{' '}
                        {champ.required && <span className="text-rose-500">*</span>}
                      </label>

                      {champ.type === 'number' && (
                        <input
                          type="number"
                          required={champ.required}
                          value={valeurs[champ.id] ?? 0}
                          onChange={(e) =>
                            handleValueChange(champ.id, parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black"
                        />
                      )}

                      {champ.type === 'text' && (
                        <input
                          type="text"
                          required={champ.required}
                          value={valeurs[champ.id] ?? ''}
                          onChange={(e) => handleValueChange(champ.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                          placeholder="Votre réponse..."
                        />
                      )}

                      {champ.type === 'textarea' && (
                        <textarea
                          required={champ.required}
                          rows={3}
                          value={valeurs[champ.id] ?? ''}
                          onChange={(e) => handleValueChange(champ.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                          placeholder="Détails, faits marquants, besoins..."
                        />
                      )}

                      {champ.type === 'select' && (
                        <select
                          required={champ.required}
                          value={valeurs[champ.id] ?? ''}
                          onChange={(e) => handleValueChange(champ.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                        >
                          {champ.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {champ.type === 'boolean' && (
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={!!valeurs[champ.id]}
                            onChange={(e) =>
                              handleValueChange(champ.id, e.target.checked)
                            }
                            className="w-4 h-4 text-[#0A3D36] rounded border-slate-300"
                          />
                          <span className="text-xs text-slate-700 font-semibold">
                            Oui, validé / conforme
                          </span>
                        </label>
                      )}

                      {champ.type === 'photo' && (
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs">
                              <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                              <span>Joindre une photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(champ.id, e)}
                                className="hidden"
                              />
                            </label>
                            {valeurs[champ.id] && (
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Photo attachée
                              </span>
                            )}
                          </div>
                          {valeurs[champ.id] && (
                            <img
                              src={valeurs[champ.id]}
                              alt="Aperçu"
                              className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* URGENT TOGGLE */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-rose-950">
                      Marquer ce rapport comme URGENT
                    </p>
                    <p className="text-[10px] text-rose-700">
                      Notification prioritaire transmise directement au Pasteur Principal.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={urgente}
                  onChange={(e) => setUrgente(e.target.checked)}
                  className="w-5 h-5 text-rose-600 rounded border-rose-300"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#E5B22F]" />
                <span>
                  {isSubmitting
                    ? 'Transmission en cours...'
                    : 'Transmettre le Rapport à la Direction Pastorale'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
