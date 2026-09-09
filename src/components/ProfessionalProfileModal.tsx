import React, { useState, useRef } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  Upload,
  CheckCircle2,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  FileText,
  HelpCircle,
  Clock
} from 'lucide-react';
import { UserProfile, AvailabilityStatus } from '../types';

interface ProfessionalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuth: () => void;
}

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Excel Avancé', 'Comptabilité',
  'Fiscalité', 'Gestion de projet', 'Secrétariat', 'Photoshop', 'Illustrator',
  'Canva', 'Figma', 'UI/UX Design', 'Photographie', 'Vidéographie', 'Montage vidéo',
  'Sonorisation', 'Couture', 'Stylisme dame', 'Modélisme', 'Pâtisserie fine',
  'Cake Design', 'Traiteur événementiel', 'Électricité bâtiment', 'Plomberie',
  'Mécanique auto', 'Chauffeur VTC', 'Marketing Digital', 'Community Management',
  'Rédaction web', 'Traduction Anglais-Français'
];

const SUGGESTED_ACTIVITIES = [
  'Création de sites web & applications',
  'Vente de matériel informatique',
  'Confection de tenues de cérémonie sur-mesure',
  'Gâteaux d\'anniversaire & pièces montées',
  'Reportage photo & vidéo mariage',
  'Réparation smartphone & ordinateurs',
  'Formation Excel & Bureautique',
  'Accompagnement comptable & déclarations fiscales',
  'Conseil juridique d\'entreprise',
  'Décoration événementielle & agapes',
  'Transport & livraison express'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80'
];

export const ProfessionalProfileModal: React.FC<ProfessionalProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#0A3D36]/10 text-[#0A3D36] flex items-center justify-center mx-auto font-black text-xl">
            VH
          </div>
          <h3 className="text-xl font-black text-[#0A3D36]">Connexion requise</h3>
          <p className="text-xs text-slate-600">
            Vous devez être connecté avec votre numéro de téléphone pour définir votre profil professionnel sur Vases Connect.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex-1 py-2.5 bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold rounded-xl shadow-md"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active subtab
  const [activeTab, setActiveTab] = useState<'identity' | 'skills' | 'contact'>('identity');

  // Fields
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [profession, setProfession] = useState(currentUser.profession);
  const [bio, setBio] = useState(currentUser.bio);
  const [city, setCity] = useState(currentUser.city);
  const [country, setCountry] = useState(currentUser.country || 'Bénin');
  const [departmentName, setDepartmentName] = useState(currentUser.departmentName || 'Média & Production');
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [activities, setActivities] = useState<string[]>(currentUser.activities || []);
  const [newActivity, setNewActivity] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(currentUser.experienceYears || 3);
  const [education, setEducation] = useState(currentUser.education || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser.whatsappNumber || currentUser.phone);
  const [status, setStatus] = useState<AvailabilityStatus>(currentUser.status || 'DISPONIBLE');
  const [availableForOpportunities, setAvailableForOpportunities] = useState(currentUser.availableForOpportunities);
  const [availableForMissions, setAvailableForMissions] = useState(currentUser.availableForMissions);
  const [phonePublic, setPhonePublic] = useState(currentUser.phonePublic);
  const [addressPublic, setAddressPublic] = useState(currentUser.addressPublic);
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live completion score
  const calculateScore = () => {
    let score = 20; // base
    if (profession && profession.trim().length > 3) score += 15;
    if (bio && bio.trim().length > 20) score += 15;
    if (skills.length >= 3) score += 20;
    if (activities.length >= 1) score += 10;
    if (education && education.trim().length > 2) score += 5;
    if (portfolioUrl) score += 5;
    if (whatsappNumber) score += 5;
    if (photoUrl) score += 5;
    return Math.min(score, 100);
  };

  const currentScore = calculateScore();

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (sk: string) => {
    const trimmed = sk.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(prev => prev.filter(s => s !== sk));
  };

  const handleAddActivity = (act: string) => {
    const trimmed = act.trim();
    if (trimmed && !activities.includes(trimmed)) {
      setActivities(prev => [...prev, trimmed]);
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (act: string) => {
    setActivities(prev => prev.filter(a => a !== act));
  };

  const handleInsertBioSample = () => {
    setBio(
      `Professionnel rigoureux et passionné, avec ${experienceYears} ans d'expérience. Engagé au sein du département ${departmentName} de l'église Vases d'Honneur, je mets mes compétences et mon éthique de travail au service de projets d'excellence.`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      firstName,
      lastName,
      profession,
      bio,
      city,
      country,
      departmentName,
      skills,
      activities,
      experienceYears,
      education,
      portfolioUrl,
      whatsappNumber,
      status,
      availableForOpportunities,
      availableForMissions,
      phonePublic,
      addressPublic,
      photoUrl,
      completionScore: currentScore,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img
                  src={photoUrl}
                  alt="Profil"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-md group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5B22F] bg-white/10 px-2 py-0.5 rounded-md">
                    Annuaire des Talents
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Définir mon Profil Professionnel
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Indexez vos compétences réelles pour être recommandé par l'Assistant Vases IA.
                </p>
              </div>
            </div>

            {/* Profile Score Badge */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 sm:text-right min-w-[170px]">
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-[11px] font-medium text-white/80">Niveau de complétion :</span>
                <span className="text-sm font-black text-[#E5B22F]">{currentScore}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#E5B22F] h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentScore}%` }}
                />
              </div>
              <p className="text-[9px] text-white/70 mt-1">
                {currentScore === 100 ? 'Profil 100% optimisé pour l\'IA' : 'Complétez vos compétences pour atteindre 100%'}
              </p>
            </div>
          </div>

          {/* Sub-tabs inside Modal */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => setActiveTab('identity')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'identity'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>1. Métier & Parcours</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'skills'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>2. Compétences & Prestations ({skills.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'contact'
                  ? 'bg-white text-[#0A3D36] shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>3. Disponibilité & Contact</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form id="profile-pro-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: IDENTITY & PROFESSION */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Photo Selector Row */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={photoUrl}
                  alt="Aperçu"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0A3D36] shadow-sm flex-shrink-0"
                />
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="text-xs font-bold text-slate-800">Photo de profil professionnelle</p>
                  <p className="text-[11px] text-slate-500">
                    Importez votre photo ou choisissez un avatar représentatif :
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-[#0A3D36] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-[#135E54]"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Importer photo</span>
                    </button>
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(av)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-transform hover:scale-110 ${
                          photoUrl === av ? 'border-[#0A3D36] scale-105' : 'border-transparent'
                        }`}
                      >
                        <img src={av} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              {/* Exact Profession */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Métier ou Titre Professionnel Précis *
                </label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Ex: Développeur Web Fullstack & Formateur IA, Designer Graphique, Couturière Styliste..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Ce titre apparaît sur votre carte membre et sert de mot-clé prioritaire pour l'Assistant IA.
                </p>
              </div>

              {/* Bio & Pitch */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Pitch professionnel & Bio d'expertise *
                  </label>
                  <button
                    type="button"
                    onClick={handleInsertBioSample}
                    className="text-[10px] text-[#0A3D36] font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#E5B22F]" />
                    <span>Insérer un modèle inspirant</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez votre parcours, vos points forts, votre dévouement et comment vous pouvez aider la communauté..."
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36] leading-relaxed"
                />
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Années d'expérience professionnelle
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Formation / Diplôme / Certifications
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="Ex: Master Informatique, Licence Gestion, CAP..."
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>
              </div>

              {/* Church Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Département ministériel à l'église Vases d'Honneur
                </label>
                <select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-[#0A3D36]"
                >
                  <option value="Média & Production">Média & Production</option>
                  <option value="Chorale & Louange">Chorale & Louange (Sons Célestes)</option>
                  <option value="Département des Hommes (Gédéons)">Département des Hommes (Gédéons)</option>
                  <option value="Département des Femmes (Vertueuses)">Département des Femmes (Vertueuses)</option>
                  <option value="Jeunesse (Génération Impact)">Jeunesse (Génération Impact)</option>
                  <option value="Accueil & Protocole">Accueil & Protocole</option>
                  <option value="Intercession & Prière">Intercession & Prière</option>
                  <option value="Technique & Sonorisation">Technique & Sonorisation</option>
                  <option value="Autre Ministère">Autre Ministère</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & ACTIVITIES */}
          {activeTab === 'skills' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C59A27]" />
                  <span>Indexation sémantique par l'IA</span>
                </p>
                <p className="text-emerald-800">
                  L'Assistant Vases IA utilise vos compétences pour vous recommander auprès des fidèles qui cherchent un prestataire ou pour vous associer aux offres d'emploi compatibles.
                </p>
              </div>

              {/* Skills section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vos Compétences Clés & Outils maîtrisés *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkill);
                      }
                    }}
                    placeholder="Ajoutez une compétence (ex: React, Excel, Pâtisserie...) puis Entrée"
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkill)}
                    className="px-3 py-2 bg-[#0A3D36] text-white rounded-xl text-xs font-bold hover:bg-[#135E54]"
                  >
                    Ajouter
                  </button>
                </div>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 bg-slate-50 border border-slate-200 rounded-2xl mb-2">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Aucune compétence ajoutée pour l'instant.</span>
                  ) : (
                    skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A3D36] text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="hover:text-rose-300 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Quick suggestions */}
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Suggestions rapides en 1 clic :</p>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {SUGGESTED_SKILLS.map((sk, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddSkill(sk)}
                        disabled={skills.includes(sk)}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 rounded-md transition-colors"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activities / Services offered */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Activités & Services proposés aux membres
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddActivity(newActivity);
                      }
                    }}
                    placeholder="Ex: Confection de tenues de mariage, Vente de PC portables..."
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddActivity(newActivity)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Ajouter
                  </button>
                </div>

                {/* Current activities */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activities.map((act, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium"
                    >
                      <span>{act}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(act)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold w-full">Exemples fréquents :</span>
                  {SUGGESTED_ACTIVITIES.slice(0, 6).map((act, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddActivity(act)}
                      disabled={activities.includes(act)}
                      className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 rounded-md transition-colors"
                    >
                      + {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT & AVAILABILITY */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Availability Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Statut de Disponibilité Professionnelle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'DISPONIBLE', label: 'Disponible', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                    { id: 'SUR_DEMANDE', label: 'Sur demande', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                    { id: 'OCCUPE', label: 'En poste / Occupé', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                    { id: 'EN_MISSION', label: 'En mission', color: 'border-purple-500 bg-purple-50 text-purple-800' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStatus(st.id as AvailabilityStatus)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all ${
                        status === st.id ? st.color + ' shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">
                    Ouvert aux offres d'emploi & contrats
                  </span>
                  <input
                    type="checkbox"
                    checked={availableForOpportunities}
                    onChange={(e) => setAvailableForOpportunities(e.target.checked)}
                    className="w-4 h-4 accent-[#0A3D36] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-semibold text-slate-700">
                    Disponible pour le bénévolat d'église
                  </span>
                  <input
                    type="checkbox"
                    checked={availableForMissions}
                    onChange={(e) => setAvailableForMissions(e.target.checked)}
                    className="w-4 h-4 accent-[#0A3D36] rounded"
                  />
                </label>
              </div>

              {/* WhatsApp Professional Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro WhatsApp Professionnel *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+229 97 12 34 56"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const clean = whatsappNumber.replace(/[^0-9]/g, '');
                      window.open(`https://wa.me/${clean}?text=Bonjour`, '_blank');
                    }}
                    className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <span>Tester</span>
                  </button>
                </div>
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ville de résidence</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Cotonou, Calavi, Porto-Novo..."
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lien Portfolio / LinkedIn / Site</label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://mon-portfolio.com"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy toggles */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-slate-800">Paramètres de confidentialité & visibilité</p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {phonePublic ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Afficher mon numéro WhatsApp publiquement sur mon profil</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={phonePublic}
                      onChange={(e) => setPhonePublic(e.target.checked)}
                      className="w-4 h-4 accent-[#0A3D36] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {addressPublic ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Afficher ma ville aux membres de l'église</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={addressPublic}
                      onChange={(e) => setAddressPublic(e.target.checked)}
                      className="w-4 h-4 accent-[#0A3D36] rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Annuler
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'contact' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'identity') setActiveTab('skills');
                  else if (activeTab === 'skills') setActiveTab('contact');
                }}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Suivant →
              </button>
            ) : null}

            <button
              type="submit"
              form="profile-pro-form"
              className="px-6 py-2.5 bg-[#0A3D36] hover:bg-[#135E54] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E5B22F]" />
              <span>Enregistrer & Activer mon Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
