import React, { useState } from 'react';
import { X, Plus, Trash2, Camera, Music, Flame, Shield, Heart, Users, Wrench, Compass, Megaphone, Sparkles, UserCheck, Phone, Mail, Award } from 'lucide-react';
import { DepartmentItem } from '../../types';

interface CreateDepartmentModalProps {
  onClose: () => void;
  onDepartmentCreated: (dept: DepartmentItem) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Camera', label: 'Communication / Médias', icon: <Camera className="w-4 h-4 text-purple-600" /> },
  { name: 'Music', label: 'Louange & Chant', icon: <Music className="w-4 h-4 text-amber-600" /> },
  { name: 'Flame', label: 'Intercession & Prière', icon: <Flame className="w-4 h-4 text-red-500" /> },
  { name: 'Users', label: 'Accueil & Protocole', icon: <Users className="w-4 h-4 text-teal-600" /> },
  { name: 'Wrench', label: 'Technique & Sono', icon: <Wrench className="w-4 h-4 text-slate-600" /> },
  { name: 'Compass', label: 'Évangélisation', icon: <Compass className="w-4 h-4 text-emerald-600" /> },
  { name: 'Shield', label: 'Hommes (Gédéons)', icon: <Shield className="w-4 h-4 text-blue-600" /> },
  { name: 'Heart', label: 'Femmes / Enfants', icon: <Heart className="w-4 h-4 text-rose-500" /> },
  { name: 'Megaphone', label: 'Annonces & Relations', icon: <Megaphone className="w-4 h-4 text-orange-500" /> },
  { name: 'Sparkles', label: 'Ministère Spécial', icon: <Sparkles className="w-4 h-4 text-yellow-500" /> },
];

export const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({
  onClose,
  onDepartmentCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Camera');
  const [bannerColor, setBannerColor] = useState('#0A3D36');

  // Responsable du département
  const [leaderNom, setLeaderNom] = useState('');
  const [leaderPrenom, setLeaderPrenom] = useState('');
  const [leaderTitle, setLeaderTitle] = useState('Responsable du Département');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhoto, setLeaderPhoto] = useState('');

  // Activités
  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState<string[]>([
    'Réunion hebdomadaire de coordination',
    'Session de formation et perfectionnement'
  ]);

  // Annonce initiale
  const [initialAnnouncement, setInitialAnnouncement] = useState('');

  // Erreurs
  const [error, setError] = useState<string | null>(null);

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (idx: number) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner le nom du département.');
      return;
    }
    if (!description.trim()) {
      setError('Veuillez fournir une description de la mission du département.');
      return;
    }
    if (!leaderNom.trim()) {
      setError('Veuillez indiquer le nom du responsable du département.');
      return;
    }

    const fullLeaderName = `${leaderPrenom.trim()} ${leaderNom.trim()}`.trim();
    const deptId = 'dept-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString().slice(-4);

    const defaultLeaderPhoto = leaderPhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

    const newDepartment: DepartmentItem = {
      id: deptId,
      name: name.trim(),
      description: description.trim(),
      leaderName: fullLeaderName,
      leaderTitle: leaderTitle.trim() || 'Responsable de Département',
      leaderPhone: leaderPhone.trim() || '+229 97 00 00 00',
      leaderEmail: leaderEmail.trim() || undefined,
      leaderPhoto: defaultLeaderPhoto,
      memberCount: 1, // Au moins le responsable
      iconName,
      bannerColor,
      activities: activities.length > 0 ? activities : ['Permanence et réunions de service'],
      announcements: initialAnnouncement.trim()
        ? [initialAnnouncement.trim()]
        : [`Création officielle du département ${name.trim()} ! Bienvenue à tous les engagés.`],
      membersList: [
        {
          id: 'dm-' + Date.now(),
          departmentId: deptId,
          nom: leaderNom.trim(),
          prenom: leaderPrenom.trim(),
          telephone: leaderPhone.trim() || '+229 97 00 00 00',
          email: leaderEmail.trim() || undefined,
          roleInDepartment: leaderTitle.trim() || 'Responsable',
          dateAdhesion: new Date().toISOString().split('T')[0],
          competences: ['Coordination', 'Vision pastorale', 'Leadership'],
          photoUrl: defaultLeaderPhoto,
        }
      ]
    };

    onDepartmentCreated(newDepartment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 p-5 sm:p-7 shadow-2xl border border-slate-100 text-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0A3D36] text-[10px] font-black uppercase tracking-wider mb-1">
              <Award className="w-3 h-3 text-[#C59A27]" />
              <span>Organisation de l'Église</span>
            </div>
            <h2 className="text-xl font-black text-[#0A3D36]">
              Créer un Nouveau Département
            </h2>
            <p className="text-xs text-slate-500">
              Définissez la mission, le responsable et les activités de ce département.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1 : Informations Générales */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>1. Identité du Département</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nom officiel du département *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Département de la Communication, Département de la Louange..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Description & Vision spirituelle *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Expliquez le rôle clé de ce département dans l'édification de l'Église..."
                rows={3}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>

            {/* Choix de l'Icône */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Icône représentative
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {AVAILABLE_ICONS.map(ic => (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setIconName(ic.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all ${
                      iconName === ic.name
                        ? 'bg-[#0A3D36] text-white border-[#0A3D36] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{ic.icon}</span>
                    <span className="truncate text-[11px]">{ic.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 : Responsable du Département */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>2. Responsable du Département</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Prénom du Responsable
                </label>
                <input
                  type="text"
                  value={leaderPrenom}
                  onChange={e => setLeaderPrenom(e.target.value)}
                  placeholder="Ex: Samuel, Esther, Jean..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nom de famille *
                </label>
                <input
                  type="text"
                  value={leaderNom}
                  onChange={e => setLeaderNom(e.target.value)}
                  placeholder="Ex: Koffi, Kouassi, Agossa..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Titre officiel
                </label>
                <input
                  type="text"
                  value={leaderTitle}
                  onChange={e => setLeaderTitle(e.target.value)}
                  placeholder="Ex: Directeur, Conductrice, Chef d'Équipe..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#0A3D36]" />
                  <span>Téléphone / WhatsApp</span>
                </label>
                <input
                  type="tel"
                  value={leaderPhone}
                  onChange={e => setLeaderPhone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#0A3D36]" />
                  <span>Email de contact</span>
                </label>
                <input
                  type="email"
                  value={leaderEmail}
                  onChange={e => setLeaderEmail(e.target.value)}
                  placeholder="responsable@portedescieux.org"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Lien Photo du Responsable (optionnel)
              </label>
              <input
                type="url"
                value={leaderPhoto}
                onChange={e => setLeaderPhoto(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          {/* Section 3 : Activités Clés & Annonce */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>3. Activités & Première Annonce</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Activités régulières du département
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={activityInput}
                  onChange={e => setActivityInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddActivity(); }}}
                  placeholder="Ex: Répétition vendredi à 18h, Nuit de prière..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-2 rounded-xl bg-[#0A3D36] text-white text-xs font-bold hover:bg-[#135E54] transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {activities.length > 0 && (
                <div className="space-y-1.5">
                  {activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      <span className="truncate">• {act}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Première annonce ou projet en cours (optionnel)
              </label>
              <input
                type="text"
                value={initialAnnouncement}
                onChange={e => setInitialAnnouncement(e.target.value)}
                placeholder="Ex: Recrutement ouvert pour nouveaux membres et bénévoles !"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#082e29] hover:to-[#0f4b43] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 border border-[#C59A27]/40 active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#C59A27]" />
              <span>Créer le Département</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
