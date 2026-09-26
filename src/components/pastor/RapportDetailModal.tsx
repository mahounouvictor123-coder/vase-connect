import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Calendar,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Share2,
  Copy,
  Check,
  Crown,
  Briefcase,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { RapportSoumis, RapportTemplate } from '../../types';

interface RapportDetailModalProps {
  rapport: RapportSoumis;
  template?: RapportTemplate;
  canAnnotate?: boolean;
  onClose: () => void;
  onUpdateRapport: (updated: RapportSoumis) => void;
}

export const RapportDetailModal: React.FC<RapportDetailModalProps> = ({
  rapport,
  template,
  canAnnotate = true,
  onClose,
  onUpdateRapport,
}) => {
  const [notePastorale, setNotePastorale] = useState(
    rapport.reponsePastorale?.note || ''
  );
  const [prierePastorale, setPrierePastorale] = useState(
    rapport.reponsePastorale?.priereOuBenediction || ''
  );
  const [statut, setStatut] = useState(rapport.statut);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveResponse = () => {
    const updated: RapportSoumis = {
      ...rapport,
      statut: notePastorale.trim() ? 'ANNOTATION_PASTORALE' : statut,
      reponsePastorale: notePastorale.trim()
        ? {
            date: new Date().toISOString(),
            note: notePastorale.trim(),
            pasteurNom: 'Pasteur Principal',
            priereOuBenediction: prierePastorale.trim() || undefined,
          }
        : undefined,
    };
    onUpdateRapport(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleValidate = () => {
    const updated: RapportSoumis = {
      ...rapport,
      statut: 'VALIDE',
    };
    setStatut('VALIDE');
    onUpdateRapport(updated);
  };

  const generateShareText = () => {
    let text = `📋 *RAPPORT : ${rapport.templateTitre.toUpperCase()}*\n`;
    text += `📍 *Entité :* ${rapport.entiteConcernee}\n`;
    text += `👤 *Déclarant :* ${rapport.auteurNom} (${rapport.auteurRole})\n`;
    text += `📅 *Date/Période :* ${rapport.periode}\n\n`;
    text += `*--- ÉLÉMENTS DU RAPPORT ---*\n`;

    Object.entries(rapport.valeurs).forEach(([key, val]) => {
      // Find label if template is present
      const field = template?.champs.find(c => c.id === key);
      const label = field ? field.label : key;
      text += `• *${label}* : ${val}\n`;
    });

    if (rapport.reponsePastorale) {
      text += `\n*--- NOTE & BÉNÉDICTION PASTORALE ---*\n`;
      text += `✍️ ${rapport.reponsePastorale.note}\n`;
      if (rapport.reponsePastorale.priereOuBenediction) {
        text += `🕊️ *Bénédiction :* ${rapport.reponsePastorale.priereOuBenediction}\n`;
      }
    }

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              {rapport.categorie === 'TRIBU' ? (
                <Crown className="w-5 h-5 text-[#E5B22F]" />
              ) : rapport.categorie === 'DEPARTEMENT' ? (
                <Briefcase className="w-5 h-5 text-[#E5B22F]" />
              ) : (
                <Home className="w-5 h-5 text-[#E5B22F]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-[#E5B22F] tracking-wider">
                  Boîte Pastorale • {rapport.categorie}
                </span>
                {rapport.urgente && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#A31D24] text-white">
                    Prioritaire
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-white">{rapport.templateTitre}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Copier le rapport"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              title="Partager sur WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          {/* Card info Déclarant */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  rapport.auteurPhotoUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                }
                alt={rapport.auteurNom}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C59A27]"
              />
              <div>
                <h4 className="font-black text-slate-900 text-sm">{rapport.auteurNom}</h4>
                <p className="text-slate-600 font-bold text-[11px]">{rapport.auteurRole}</p>
                <p className="text-[#0A3D36] font-bold text-[11px]">{rapport.entiteConcernee}</p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold">{rapport.periode}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a
                  href={`tel:${rapport.auteurTelephone}`}
                  className="font-bold text-[#0A3D36] hover:underline"
                >
                  {rapport.auteurTelephone}
                </a>
              </div>
              <div className="mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    rapport.statut === 'VALIDE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rapport.statut === 'ANNOTATION_PASTORALE'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rapport.statut === 'ANNOTATION_PASTORALE'
                    ? 'Annoté par le Pasteur'
                    : rapport.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Données du Rapport Soumis */}
          <div className="space-y-3">
            <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-4 h-4 text-[#C59A27]" />
              <span>Contenu & Éléments Renseignés</span>
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {Object.entries(rapport.valeurs).map(([fieldId, val]) => {
                // Find label if template provided
                const field = template?.champs.find(c => c.id === fieldId);
                const label = field ? field.label : fieldId.replace(/_/g, ' ');

                if (field?.type === 'photo' && val) {
                  return (
                    <div key={fieldId} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-500 text-[10px] uppercase block mb-1.5">
                        {label}
                      </span>
                      <img
                        src={val}
                        alt="Photo rapport"
                        className="w-full max-h-60 object-cover rounded-xl border border-slate-300 shadow-sm"
                      />
                    </div>
                  );
                }

                return (
                  <div key={fieldId} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-500 text-[10px] uppercase block mb-1">
                      {label}
                    </span>
                    <p className="text-slate-900 font-semibold whitespace-pre-line text-xs">
                      {typeof val === 'boolean' ? (val ? 'Oui' : 'Non') : String(val)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Réponse Pastorale */}
          {canAnnotate ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-emerald-50/50 border border-[#C59A27]/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                  <MessageSquare className="w-4 h-4 text-[#C59A27]" />
                  <span>Note & Directive Pastorale en Réponse</span>
                </h4>
                <button
                  type="button"
                  onClick={handleValidate}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Marquer Validé</span>
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Instruction pastorale / Recommandation pour l'auteur
                </label>
                <textarea
                  rows={2}
                  value={notePastorale}
                  onChange={e => setNotePastorale(e.target.value)}
                  placeholder="Ex: Bien reçu, continuez d'encourager la prière. Je délègue le pasteur associé..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white focus:ring-2 focus:ring-[#0A3D36] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Prière apostolique ou bénédiction prophétique (optionnel)
                </label>
                <input
                  type="text"
                  value={prierePastorale}
                  onChange={e => setPrierePastorale(e.target.value)}
                  placeholder="Ex: Que la paix et la multiplication du Seigneur soient votre partage !"
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-200 bg-white focus:ring-2 focus:ring-[#0A3D36] text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {savedSuccess ? (
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Réponse pastorale enregistrée avec succès !
                  </span>
                ) : (
                  <span className="text-slate-500 text-[10px]">
                    Cette note sera directement rattachée au rapport du membre.
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveResponse}
                  className="px-4 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-xs hover:scale-102 transition-all cursor-pointer"
                >
                  Enregistrer la Réponse Pastorale
                </button>
              </div>
            </div>
          ) : (
            rapport.reponsePastorale && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-[#C59A27]/40 space-y-2">
                <div className="flex items-center gap-1.5 text-[#0A3D36] font-black text-xs uppercase">
                  <Sparkles className="w-4 h-4 text-[#C59A27]" />
                  <span>Réponse & Bénédiction de la Chaire Pastorale</span>
                </div>
                {rapport.reponsePastorale.note && (
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs text-slate-800">
                    <p className="font-bold text-[10px] text-slate-500 uppercase mb-1">Instruction Pastorale :</p>
                    <p className="font-medium italic">« {rapport.reponsePastorale.note} »</p>
                  </div>
                )}
                {rapport.reponsePastorale.priereOuBenediction && (
                  <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
                    <p className="font-bold text-[10px] text-emerald-700 uppercase mb-1">🕊️ Bénédiction & Prière :</p>
                    <p>« {rapport.reponsePastorale.priereOuBenediction} »</p>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500">
            Reçu le {new Date(rapport.createdAt).toLocaleDateString('fr-FR')} à{' '}
            {new Date(rapport.createdAt).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
