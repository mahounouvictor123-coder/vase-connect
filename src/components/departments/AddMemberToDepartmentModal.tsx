import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Award, Check } from 'lucide-react';
import { DepartmentMember, DepartmentItem, UserProfile } from '../../types';

interface AddMemberToDepartmentModalProps {
  department: DepartmentItem;
  existingUsers?: UserProfile[];
  onClose: () => void;
  onMemberAdded: (member: DepartmentMember) => void;
}

export const AddMemberToDepartmentModal: React.FC<AddMemberToDepartmentModalProps> = ({
  department,
  existingUsers = [],
  onClose,
  onMemberAdded,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [roleInDepartment, setRoleInDepartment] = useState('Membre Actif');
  const [competencesInput, setCompetencesInput] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [error, setError] = useState<string | null>(null);

  // If selecting an existing member
  const handleSelectExistingUser = (userId: string) => {
    setSelectedUserId(userId);
    const found = existingUsers.find(u => u.id === userId);
    if (found) {
      setNom(found.lastName);
      setPrenom(found.firstName);
      setTelephone(found.phone);
      setPhotoUrl(found.photoUrl);
      setCompetencesInput(found.skills ? found.skills.join(', ') : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setError('Veuillez renseigner le nom de famille.');
      return;
    }
    if (!telephone.trim()) {
      setError('Veuillez renseigner un numéro de téléphone.');
      return;
    }

    const competences = competencesInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const newMember: DepartmentMember = {
      id: 'dm-' + Date.now(),
      departmentId: department.id,
      memberId: selectedUserId || undefined,
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      email: email.trim() || undefined,
      roleInDepartment: roleInDepartment.trim() || 'Membre Actif',
      dateAdhesion: new Date().toISOString().split('T')[0],
      competences: competences.length > 0 ? competences : ['Engagement régulier'],
      photoUrl: photoUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    };

    onMemberAdded(newMember);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg my-8 p-5 sm:p-7 shadow-2xl border border-slate-100 text-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0A3D36] text-[10px] font-black uppercase tracking-wider mb-1">
              <Award className="w-3 h-3 text-[#C59A27]" />
              <span>{department.name}</span>
            </div>
            <h2 className="text-lg font-black text-[#0A3D36]">
              Ajouter un Membre au Département
            </h2>
            <p className="text-xs text-slate-500">
              Rattachez un fidèle ou bénévole avec son rôle et ses compétences.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick select existing user if any */}
          {existingUsers.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Sélectionner un membre de la communauté (optionnel)
              </label>
              <select
                value={selectedUserId}
                onChange={e => handleSelectExistingUser(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              >
                <option value="">-- Saisie manuelle d'un nouveau membre --</option>
                {existingUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} • {u.profession || 'Fidèle'} ({u.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Prénom du membre
              </label>
              <input
                type="text"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Ex: David, Esther..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nom de famille *
              </label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Ex: Kouassi, Mensah..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#0A3D36]" />
                <span>Téléphone / WhatsApp *</span>
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="+229 97 00 00 00"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3 text-[#0A3D36]" />
                <span>Email (optionnel)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="membre@eglise.org"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Rôle au sein du département *
            </label>
            <input
              type="text"
              value={roleInDepartment}
              onChange={e => setRoleInDepartment(e.target.value)}
              placeholder="Ex: Chantre Soliste, Cadreur, Intercesseur de Nuit, Protocole Parvis..."
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Compétences ou dons (séparés par des virgules)
            </label>
            <input
              type="text"
              value={competencesInput}
              onChange={e => setCompetencesInput(e.target.value)}
              placeholder="Ex: Piano, Cadrage, Voix Soprano, Écoute fraternelle, Graphisme..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Photo URL (optionnel)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            />
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
              className="px-5 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 border border-[#C59A27]/40 active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-[#C59A27]" />
              <span>Enregistrer le Membre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
