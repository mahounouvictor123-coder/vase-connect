import React, { useState, useRef } from 'react';
import {
  X,
  Briefcase,
  Upload,
  Image as ImageIcon,
  FileText,
  Sparkles,
  CheckCircle2,
  DollarSign,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Copy,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { OpportunityItem, OpportunityType, UserProfile } from '../types';

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opp: OpportunityItem) => void;
  currentUser: UserProfile | null;
}

const COMMON_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Excel', 'Comptabilité', 'Secrétariat',
  'Photoshop', 'Illustrator', 'Canva', 'Figma', 'Vidéographie', 'Montage vidéo',
  'Sonorisation', 'Couture', 'Stylisme', 'Pâtisserie', 'Traiteur', 'Marketing Digital',
  'Vente', 'Gestion de projet', 'Électricité', 'Chauffeur / Transport'
];

const PRESET_BANNERS = [
  {
    label: 'Technologie & Informatique',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Design & Créatif',
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Administration & Gestion',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Ministère & Bénévolat Église',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'
  }
];

export const JobPostingModal: React.FC<JobPostingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'paste' | 'visual'>('form');

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<OpportunityType>('EMPLOI');
  const [contractType, setContractType] = useState('CDI Plein Temps');
  const [location, setLocation] = useState('Cotonou');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [compensation, setCompensation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '+229 97 00 00 00');
  const [email, setEmail] = useState('');

  // Visual announcement / flyer poster
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Raw paste area
  const [rawPastedText, setRawPastedText] = useState('');
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Smart Parse Copied text
  const handleParsePastedText = () => {
    if (!rawPastedText.trim()) return;

    setDescription(rawPastedText);

    // Simple heuristic parser for convenience
    const lines = rawPastedText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0 && !title) {
      // First line might be the title
      setTitle(lines[0].replace(/^(poste|offre d'emploi|recrutement|titre)\s*[:\-]\s*/i, ''));
    }

    // Check for detected skills
    const detectedSkills: string[] = [];
    COMMON_SKILLS.forEach(sk => {
      const regex = new RegExp(`\\b${sk}\\b`, 'i');
      if (regex.test(rawPastedText) && !skills.includes(sk)) {
        detectedSkills.push(sk);
      }
    });

    if (detectedSkills.length > 0) {
      setSkills(prev => Array.from(new Set([...prev, ...detectedSkills])));
    }

    setPasteFeedback(`Texte importé avec succès ! ${detectedSkills.length} compétences détectées.`);
    setTimeout(() => {
      setActiveSubTab('form');
      setPasteFeedback(null);
    }, 1200);
  };

  const handleInsertTemplate = (templateType: 'cdi' | 'stage' | 'benevolat') => {
    if (templateType === 'cdi') {
      setTitle('Responsable Commercial & Développement Clientèle');
      setCompany('Entreprise Partenaire Vases d\'Honneur');
      setType('EMPLOI');
      setContractType('CDI Plein Temps');
      setCompensation('200 000 - 350 000 FCFA + Commissions');
      setDeadline('30 du mois prochain');
      setSkills(['Vente', 'Marketing Digital', 'Gestion de projet', 'Excel']);
      setDescription(
        `MISSIONS PRINCIPALES :\n- Développer le portefeuille clients B2B et B2C au Bénin.\n- Présenter nos offres et négocier les contrats commerciaux.\n- Assurer le suivi et la fidélisation des partenaires.\n\nPROFIL RECHERCHÉ :\n- Bac+2/3 en Commerce, Marketing ou Gestion.\n- Excellente élocution et intégrité chrétienne irréprochable.\n- Maîtrise des outils bureautiques.`
      );
    } else if (templateType === 'stage') {
      setTitle('Stagiaire Assistant(e) Comptable & Administratif');
      setCompany('Cabinet FIDELIA Conseil');
      setType('STAGE');
      setContractType('Stage Professionnel (6 mois)');
      setCompensation('75 000 FCFA d\'indemnité mensuelle');
      setDeadline('15 du mois prochain');
      setSkills(['Comptabilité', 'Excel', 'Secrétariat']);
      setDescription(
        `MISSIONS :\n- Enregistrement des pièces comptables et factures.\n- Rapprochements bancaires et déclarations périodiques.\n- Classement et archivage des dossiers administratifs.\n\nCONDITIONS :\n- Stage conventionné pré-embauche.\n- Formation et accompagnement d'un aîné chrétien expérimenté.`
      );
    } else {
      setTitle('Bénévoles Régie & Retransmission Vidéo en Direct');
      setCompany('Département Média Vases d\'Honneur');
      setType('BENEVOLAT');
      setContractType('Bénévolat Ministériel');
      setCompensation('Formation technique offerte & Bénédiction');
      setDeadline('Permanent');
      setSkills(['Vidéographie', 'Sonorisation', 'Montage vidéo', 'Dévouement']);
      setDescription(
        `Servir le Seigneur avec vos dons !\nRejoignez l'équipe de production pour le culte dominical :\n- Opérateur caméra plateau\n- Régie streaming YouTube & Facebook\n- Captation sonore et projection des chants.`
      );
    }
    setActiveSubTab('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Veuillez indiquer un intitulé pour le poste.');
      return;
    }

    const typeLabelMap: Record<OpportunityType, string> = {
      EMPLOI: 'Offre d\'Emploi (CDI / CDD)',
      STAGE: 'Stage Professionnel',
      RECRUTEMENT: 'Recrutement / Contrat',
      MISSION: 'Mission Freelance / Prestation',
      BENEVOLAT: 'Bénévolat Église',
      PARTENARIAT: 'Partenariat Commercial'
    };

    const finalImage = imagePreview || imageUrl || PRESET_BANNERS[0].url;

    const newOpp: OpportunityItem = {
      id: 'opp-' + Date.now(),
      title: title.trim(),
      companyOrMinistry: company.trim() || 'Organisation Partenaire',
      type,
      typeLabel: typeLabelMap[type] || 'Opportunité',
      contractType,
      location: location.trim() || 'Cotonou',
      description: description.trim() || 'Consultez les coordonnées pour postuler à cette offre.',
      requiredSkills: skills.length > 0 ? skills : ['Motivation', 'Rigueur'],
      authorId: currentUser?.id || 'guest',
      authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre Vases d\'Honneur',
      authorPhoto: currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      compensation: compensation.trim() || 'À convenir',
      deadline: deadline.trim() || 'Ouvert jusqu\'à pourvoi',
      imageUrl: finalImage,
      contactWhatsApp: whatsapp.trim(),
      contactEmail: email.trim(),
      rawDescription: rawPastedText || undefined,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newOpp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] to-[#135E54] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#E5B22F] shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5B22F] bg-white/10 px-2 py-0.5 rounded-md">
                  Vases Carrières & Missions
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Publier une Offre d'Emploi</h2>
              <p className="text-xs text-white/80 mt-0.5">
                Rédigez l'annonce, collez un descriptif existant ou importez une affiche visuelle.
              </p>
            </div>
          </div>

          {/* Navigation Bar inside Modal */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => setActiveSubTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'form'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formulaire Détaillé</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('paste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'paste'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copier / Coller une offre</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'visual'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Affiche Visuelle {imagePreview || imageUrl ? '✓' : ''}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: COPY & PASTE AREA */}
          {activeSubTab === 'paste' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
                <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Espace de collage intelligent</p>
                  <p className="text-amber-800">
                    Collez ici le texte intégral d'une offre que vous avez reçue sur WhatsApp, par mail ou LinkedIn. Notre système détectera automatiquement le titre, les compétences clés et pré-remplira le formulaire.
                  </p>
                </div>
              </div>

              {/* Quick Template Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Modèles prêts à l'emploi :</span>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('cdi')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Exemple CDI Commercial
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('stage')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Exemple Stage Comptabilité
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTemplate('benevolat')}
                  className="px-2.5 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-medium transition-colors"
                >
                  Exemple Bénévolat Média Église
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Collez le texte de l'annonce ici :
                </label>
                <textarea
                  value={rawPastedText}
                  onChange={(e) => setRawPastedText(e.target.value)}
                  placeholder="Collez ici l'offre (ex: Société XYZ recrute un(e) Assistant(e) de Direction... Missions : Gestion d'agenda, rédaction... Compétences : Excel, Secrétariat... Contact : ...)"
                  rows={9}
                  className="w-full p-4 rounded-2xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36] focus:border-transparent font-mono leading-relaxed"
                />
              </div>

              {pasteFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{pasteFeedback}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  disabled={!rawPastedText.trim()}
                  className="px-5 py-2.5 bg-[#0A3D36] hover:bg-[#135E54] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#E5B22F]" />
                  <span>Analyser & Pré-remplir le formulaire</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL FLYER / POSTER IMPORT AREA */}
          {activeSubTab === 'visual' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-900">
                <ImageIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Affiche visuelle & Flyer RH</p>
                  <p className="text-emerald-800">
                    Les annonces avec affiche attirent 3 fois plus de candidats qualifiés ! Glissez-déposez le visuel de l'offre (flyer Canva, photo, document graphique) ou choisissez parmi nos arrière-plans professionnels.
                  </p>
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#0A3D36] bg-[#0A3D36]/5 scale-[1.01]'
                    : 'border-slate-300 hover:border-[#0A3D36] bg-slate-50/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />

                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Affiche aperçu"
                      className="max-h-56 mx-auto rounded-2xl object-cover shadow-md border border-slate-200"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Affiche chargée avec succès ! Cliquez pour changer.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#0A3D36] border border-slate-200 shadow-sm flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Glissez votre affiche RH ici ou <span className="text-[#0A3D36] underline">parcourez vos fichiers</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Formats acceptés : PNG, JPG, JPEG, WebP (Jusqu'à 10 Mo)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Alternative */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ou collez directement l'URL web de l'affiche :
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setImagePreview(e.target.value);
                    }}
                    placeholder="https://mon-entreprise.com/affiche-recrutement.jpg"
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Effacer le visuel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Backgrounds */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 mb-2">Visuels professionnels suggérés :</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_BANNERS.map((banner, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImagePreview(banner.url);
                        setImageUrl(banner.url);
                      }}
                      className="group relative rounded-xl overflow-hidden border-2 transition-all hover:scale-102 text-left aspect-video"
                      style={{
                        borderColor: (imagePreview === banner.url || imageUrl === banner.url) ? '#0A3D36' : 'transparent'
                      }}
                    >
                      <img src={banner.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white leading-tight">
                          {banner.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURED FORM (Always visible when tab is 'form') */}
          {activeSubTab === 'form' && (
            <form id="job-offer-form" onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              {/* Row 1: Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intitulé du poste ou de l'offre *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Développeur React, Couturière, Chauffeur..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Entreprise, Ministère ou Structure *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ex: Cabinet FIDELIA, Département Média..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              {/* Row 2: Type, Contract & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catégorie d'opportunité
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as OpportunityType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-[#0A3D36]"
                  >
                    <option value="EMPLOI">Emploi (CDI / CDD)</option>
                    <option value="STAGE">Stage Professionnel</option>
                    <option value="RECRUTEMENT">Recrutement Rapide</option>
                    <option value="MISSION">Mission Freelance / Prestation</option>
                    <option value="BENEVOLAT">Bénévolat Ministériel Église</option>
                    <option value="PARTENARIAT">Partenariat Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Type de contrat
                  </label>
                  <input
                    type="text"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    placeholder="Ex: CDI, CDD 6 mois, Bénévolat..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ville / Localisation
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Cotonou, Calavi, Télétravail..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              {/* Description / Detailed text area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Description détaillée du poste & Missions *
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('paste')}
                    className="text-[11px] text-[#0A3D36] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Coller un texte</span>
                  </button>
                </div>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez les missions principales, le profil recherché, les responsabilités et les avantages..."
                  rows={5}
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36] leading-relaxed"
                />
              </div>

              {/* Skills Tags with Quick suggestions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Compétences clés recherchées (Utilisées par l'Assistant IA pour le matching)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Ajoutez une compétence (ex: Excel, React, Pâtisserie...) puis Entrée"
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Ajouter
                  </button>
                </div>

                {/* Selected Skills Tags */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A3D36]/10 text-[#0A3D36] rounded-lg text-xs font-bold"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold">Suggestions rapides :</span>
                  {COMMON_SKILLS.slice(0, 10).map((sk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSkill(sk)}
                      disabled={skills.includes(sk)}
                      className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 rounded-md transition-colors"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Compensation & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rémunération / Salaire (en FCFA ou Avantages)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="Ex: 250 000 FCFA / mois, Bénévolat..."
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date limite de candidature
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="Ex: 30 Octobre 2026 ou Permanent"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro WhatsApp pour postuler *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email de contact (Optionnel)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="recrutement@entreprise.com"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>
              </div>

              {/* Visual preview mini block if image chosen */}
              {(imagePreview || imageUrl) && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Affiche"
                    className="w-16 h-12 rounded-xl object-cover border border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">Affiche visuelle attachée</p>
                    <p className="text-[11px] text-slate-500">L'affiche sera affichée sur la carte de l'offre.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('visual')}
                    className="text-xs text-[#0A3D36] font-bold hover:underline"
                  >
                    Modifier
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Annuler
          </button>

          <div className="flex items-center gap-3">
            {activeSubTab !== 'form' && (
              <button
                type="button"
                onClick={() => setActiveSubTab('form')}
                className="px-4 py-2.5 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                Retour au formulaire
              </button>
            )}

            <button
              type="submit"
              form="job-offer-form"
              onClick={(e) => {
                if (activeSubTab !== 'form') {
                  setActiveSubTab('form');
                }
              }}
              className="px-6 py-2.5 bg-[#0A3D36] hover:bg-[#135E54] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E5B22F]" />
              <span>Publier l'Offre sur Vases Connect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
