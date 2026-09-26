import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Settings,
  Layers,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Link2,
  Send,
  ChevronUp,
  ChevronDown,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import { RapportTemplate, RapportTemplateField } from '../../types';

interface CreateReportTemplateModalProps {
  onClose: () => void;
  onSubmit: (template: RapportTemplate) => void;
  onOpenSubmitForm?: (template: RapportTemplate) => void;
}

export const CreateReportTemplateModal: React.FC<CreateReportTemplateModalProps> = ({
  onClose,
  onSubmit,
  onOpenSubmitForm,
}) => {
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState<
    'TRIBU' | 'DEPARTEMENT' | 'FAMILLE_HONNEUR' | 'MISSION_EVANGELISATION' | 'PERSONNALISE'
  >('PERSONNALISE');
  const [description, setDescription] = useState('');

  // Liste des champs personnalisés
  const [champs, setChamps] = useState<RapportTemplateField[]>([
    {
      id: 'field_1',
      label: 'Famille d\'Honneur / Entité ou Tribu',
      type: 'text',
      placeholder: 'Ex: Famille Grâce & Vie, Tribu de Juda...',
      required: true,
    },
    {
      id: 'field_2',
      label: 'Nombre de personnes touchées / présentes',
      type: 'number',
      placeholder: 'Ex: 15',
      required: true,
    },
    {
      id: 'field_3',
      label: 'Compte-rendu détaillé des activités',
      type: 'textarea',
      placeholder: 'Détaillez les faits marquants...',
      required: true,
    },
  ]);

  // Nouveau champ en cours d'ajout
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<
    'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean' | 'photo'
  >('text');
  const [newRequired, setNewRequired] = useState(true);
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [fieldAddedSuccess, setFieldAddedSuccess] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [createdTemplate, setCreatedTemplate] = useState<RapportTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAddField = (
    customLabel?: string,
    customType?: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean' | 'photo',
    customPlaceholder?: string
  ) => {
    const rawLabel = customLabel !== undefined ? customLabel : newLabel;
    const labelToAdd = rawLabel.trim() || `Élément ${champs.length + 1}`;
    const typeToAdd = customType || newType;
    const placeholderToAdd = (customPlaceholder !== undefined ? customPlaceholder : newPlaceholder).trim();

    const newField: RapportTemplateField = {
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      label: labelToAdd,
      type: typeToAdd,
      required: newRequired,
      placeholder: placeholderToAdd || undefined,
    };

    setChamps(prev => [...prev, newField]);
    setNewLabel('');
    setNewPlaceholder('');
    setNewRequired(true);
    setFieldAddedSuccess(true);
    setTimeout(() => setFieldAddedSuccess(false), 2500);
  };

  const handleRemoveField = (id: string) => {
    setChamps(prev => prev.filter(c => c.id !== id));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    setChamps(prev => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleUpdateField = (id: string, updates: Partial<RapportTemplateField>) => {
    setChamps(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;

    // Si l'utilisateur a tapé un texte dans "newLabel" sans cliquer sur Ajouter, on l'ajoute automatiquement !
    let finalChamps = [...champs];
    if (newLabel.trim()) {
      finalChamps.push({
        id: 'field_' + Date.now(),
        label: newLabel.trim(),
        type: newType,
        required: newRequired,
        placeholder: newPlaceholder.trim() || undefined,
      });
    }

    if (finalChamps.length === 0) return;

    const elementsObligatoires = finalChamps
      .filter(c => c.required)
      .map(c => c.label);

    const newTemplate: RapportTemplate = {
      id: 'tpl-' + Date.now(),
      titre: titre.trim(),
      categorie,
      description:
        description.trim() ||
        `Fenêtre de rapport personnalisée pour ${titre.trim()} définie par le Pasteur.`,
      icone:
        categorie === 'TRIBU'
          ? 'Crown'
          : categorie === 'DEPARTEMENT'
          ? 'Briefcase'
          : categorie === 'FAMILLE_HONNEUR'
          ? 'Home'
          : 'Layers',
      elementsObligatoires:
        elementsObligatoires.length > 0 ? elementsObligatoires : [titre.trim()],
      champs: finalChamps,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newTemplate);
    setCreatedTemplate(newTemplate);
    setSubmitted(true);
  };

  const generatedUrl = createdTemplate
    ? `${window.location.origin}${window.location.pathname}?rapportForm=${createdTemplate.id}`
    : '';

  const handleCopyLink = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!createdTemplate || !generatedUrl) return;
    const message = `🕊️ *VASES D'HONNEUR — DIRECTION PASTORALE*\n\nBien-aimé(e) Responsable,\nLe Pasteur vous invite à renseigner et soumettre votre rapport : *${createdTemplate.titre}*.\n\n📝 *Lien direct du formulaire à remplir en ligne :*\n${generatedUrl}\n\nVos réponses remonteront directement dans la boîte pastorale. Que Dieu vous bénisse abondamment !`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <Settings className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Configuration Pastorale
              </span>
              <h3 className="text-base font-black text-white">Créer une Fenêtre de Rapport</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted && createdTemplate ? (
          <div className="p-6 sm:p-8 space-y-6 my-auto animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Fenêtre de Rapport Créée avec Succès !</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Le formulaire <strong>« {createdTemplate.titre} »</strong> a été enregistré. Le lien direct sécurisé ci-dessous permet aux responsables et membres de renseigner leur rapport directement sur leur téléphone ou ordinateur.
              </p>
            </div>

            {/* Direct Form Link Box */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Lien direct unique généré pour ce formulaire :</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C59A27] text-slate-950 font-black">
                  PRÊT À DIFFUSER
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white rounded-xl border border-amber-200 p-1.5">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="w-full bg-transparent px-2 text-xs font-mono text-slate-700 select-all outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Ce lien ouvre immédiatement la fenêtre de saisie de ce rapport spécifique pour vos bergers, patriarches ou responsables de département.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md hover:scale-101 active:scale-98"
              >
                <Share2 className="w-4 h-4" />
                <span>Envoyer aux Responsables par WhatsApp</span>
              </button>

              {onOpenSubmitForm && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSubmitForm(createdTemplate);
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A3D36]" />
                  <span>Tester le Formulaire</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#0A3D36] text-white text-xs font-black hover:bg-[#135E54] transition-colors"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
            {/* Identification du Modèle */}
            <div className="space-y-3">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <Layers className="w-4 h-4 text-[#C59A27]" />
                <span>1. Identification de la Fenêtre de Rapport</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Titre du Rapport *
                  </label>
                  <input
                    type="text"
                    value={titre}
                    onChange={e => setTitre(e.target.value)}
                    placeholder="Ex: Rapport Mission Évangélisation de Rue"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catégorie *</label>
                  <select
                    value={categorie}
                    onChange={e => setCategorie(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                  >
                    <option value="TRIBU">Rapport Tribu</option>
                    <option value="DEPARTEMENT">Rapport Département</option>
                    <option value="FAMILLE_HONNEUR">Rapport Famille d'Honneur</option>
                    <option value="MISSION_EVANGELISATION">Mission & Évangélisation</option>
                    <option value="PERSONNALISE">Modèle Personnalisé Libre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description / Consignes pour les déclarants
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: À renseigner par le responsable d'équipe après chaque sortie..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                />
              </div>
            </div>

            {/* Définition des Éléments & Champs qui doivent y rester */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-4 h-4 text-[#C59A27]" />
                  <span>2. Éléments & Questions qui doivent y figurer ({champs.length})</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">
                  {champs.length} champ{champs.length > 1 ? 's' : ''} configuré{champs.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Feedback toast quand un élément est ajouté */}
              {fieldAddedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nouvel élément ajouté avec succès à la liste !</span>
                </div>
              )}

              {/* Liste des champs actuels */}
              <div className="space-y-2">
                {champs.map((champ, idx) => (
                  <div
                    key={champ.id}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-[#0A3D36] text-[#E5B22F] text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {editingFieldId === champ.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            defaultValue={champ.label}
                            onBlur={e => {
                              if (e.target.value.trim()) {
                                handleUpdateField(champ.id, { label: e.target.value.trim() });
                              }
                              setEditingFieldId(null);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if ((e.target as HTMLInputElement).value.trim()) {
                                  handleUpdateField(champ.id, {
                                    label: (e.target as HTMLInputElement).value.trim(),
                                  });
                                }
                                setEditingFieldId(null);
                              }
                            }}
                            autoFocus
                            className="px-2 py-1 rounded-lg border border-[#0A3D36] text-xs font-bold text-slate-900 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingFieldId(null)}
                            className="px-2 py-1 bg-[#0A3D36] text-white text-[10px] font-bold rounded-md"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div className="truncate flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 truncate">{champ.label}</span>
                            <button
                              type="button"
                              onClick={() => setEditingFieldId(champ.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Modifier le nom de l'élément"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="uppercase font-semibold text-[#0A3D36] bg-[#0A3D36]/10 px-1.5 py-0.2 rounded">
                              {champ.type}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateField(champ.id, { required: !champ.required })
                              }
                              className={`px-1.5 py-0.2 rounded font-bold transition-colors ${
                                champ.required
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                              title="Cliquer pour basculer obligatoire / facultatif"
                            >
                              {champ.required ? '• Obligatoire' : '• Facultatif'}
                            </button>
                            {champ.placeholder && (
                              <span className="truncate italic text-slate-400">
                                « {champ.placeholder} »
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Boutons monter / descendre */}
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-white rounded transition-colors"
                        title="Monter"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 'down')}
                        disabled={idx === champs.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-white rounded transition-colors"
                        title="Descendre"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(champ.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                        title="Supprimer cet élément"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formulaire d'ajout d'un nouvel élément */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#0A3D36] text-xs flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#C59A27]" />
                    <span>Ajouter un nouvel élément personnalisé à la fenêtre :</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    (Appuyez sur Entrée ou cliquez sur Ajouter)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddField();
                        }
                      }}
                      placeholder="Nom de l'élément (ex: Nombre de décisions pour Christ, Lieu exact...)"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0A3D36] outline-none shadow-inner"
                    />
                  </div>
                  <div>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#0A3D36] outline-none"
                    >
                      <option value="text">Texte court</option>
                      <option value="textarea">Texte long / Description</option>
                      <option value="number">Nombre / Chiffre</option>
                      <option value="date">Date</option>
                      <option value="photo">Photo / Image</option>
                      <option value="boolean">Case à cocher (Oui/Non)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <input
                    type="text"
                    value={newPlaceholder}
                    onChange={e => setNewPlaceholder(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddField();
                      }
                    }}
                    placeholder="Indication dans la case (ex: « Tapez ici... » - optionnel)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-amber-200 bg-white text-xs focus:ring-2 focus:ring-[#0A3D36] outline-none"
                  />

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newRequired}
                        onChange={e => setNewRequired(e.target.checked)}
                        className="rounded text-[#0A3D36] focus:ring-[#0A3D36] w-4 h-4 cursor-pointer"
                      />
                      <span>Obligatoire</span>
                    </label>

                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddField();
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] active:bg-[#072823] text-white text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#E5B22F]" />
                      <span>+ Ajouter à la liste</span>
                    </button>
                  </div>
                </div>

                {/* Suggestions d'éléments en 1 clic */}
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1.5">
                    💡 Suggestions rapides d'éléments (cliquez pour ajouter directement) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddField("Nombre d'âmes touchées / conversions", 'number', 'Ex: 12')
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>✝️ Âmes / Conversions</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddField('Offrandes ou Dons collectés (FCFA)', 'number', 'Ex: 25000')
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>💰 Offrandes / Dons</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddField("Photo ou preuve de l'activité", 'photo', 'Importer une photo')
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>📸 Photo / Preuve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddField(
                          'Difficultés et besoins spirituels ou matériels',
                          'textarea',
                          'Détaillez vos besoins...'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>⚠️ Besoins & Difficultés</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddField(
                          'Requêtes de prière et intercession',
                          'textarea',
                          'Sujets confiés...'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>🙏 Requêtes de prière</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddField('Date de la prochaine rencontre', 'date')
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C59A27]" />
                      <span>📅 Date prochaine</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={champs.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all disabled:opacity-50"
              >
                Valider & Déployer cette Fenêtre
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
