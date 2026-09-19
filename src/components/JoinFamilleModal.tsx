import React, { useState } from 'react';
import { X, Users, CheckCircle2, Phone, MapPin, Calendar, Clock, ShieldCheck, Home } from 'lucide-react';
import { FamilleHonneur, FamilleHonneurInscription, UserProfile } from '../types';

interface JoinFamilleModalProps {
  famille: FamilleHonneur;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (inscription: FamilleHonneurInscription) => void;
}

export const JoinFamilleModal: React.FC<JoinFamilleModalProps> = ({
  famille,
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [nom, setNom] = useState(currentUser?.lastName || '');
  const [prenom, setPrenom] = useState(currentUser?.firstName || '');
  const [telephone, setTelephone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || currentUser?.phone || '');
  const [quartier, setQuartier] = useState(currentUser?.neighborhood || famille.quartier);
  const [profession, setProfession] = useState('');
  const [statutMembre, setStatutMembre] = useState<
    'MEMBRE_REGULIER' | 'NOUVEAU_CONVERTI' | 'VISITEUR' | 'RESPONSABLE_ACCUEIL'
  >('MEMBRE_REGULIER');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !telephone.trim()) return;

    const newInscription: FamilleHonneurInscription = {
      id: 'fhi-' + Date.now(),
      familleId: famille.id,
      userId: currentUser?.id,
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      whatsapp: whatsapp.trim() || telephone.trim(),
      quartier: quartier.trim() || famille.quartier,
      profession: profession.trim(),
      statutMembre,
      dateInscription: new Date().toISOString().split('T')[0],
      statut: 'INSCRIT',
    };

    onSubmit(newInscription);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] to-[#135E54] p-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Rejoindre la Famille d'Honneur
              </span>
              <h3 className="text-base font-black text-white">{famille.nom}</h3>
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

        {/* Berger & Locality Mini-Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/70 p-3.5 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={
                famille.bergerPhotoUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
              }
              alt={famille.bergerNom}
              className="w-10 h-10 rounded-xl object-cover border border-[#C59A27] shrink-0"
            />
            <div>
              <span className="text-[10px] font-black uppercase text-[#C59A27] tracking-wider block">
                Berger Référent
              </span>
              <p className="font-black text-slate-900 leading-tight">
                {famille.bergerPrenom} {famille.bergerNom}
              </p>
              <p className="text-[11px] text-slate-600">
                Tél : {famille.bergerPhone}
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-600">
            <span className="font-bold text-[#0A3D36] block">📍 {famille.quartier}</span>
            <span>{famille.prochaineDate.split('à')[0]}</span>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">Inscription Enregistrée !</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Vous êtes désormais enregistré dans la {famille.nom}. Le Berger ({famille.bergerNom}) et l'Hôte ({famille.hoteNom}) ont été notifiés de votre venue !
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nom *</label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Ex: Dossou"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Prénom *</label>
                <input
                  type="text"
                  required
                  value={prenom}
                  onChange={e => setPrenom(e.target.value)}
                  placeholder="Ex: Marc"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Téléphone Appel *</label>
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Quartier de résidence</label>
                <input
                  type="text"
                  value={quartier}
                  onChange={e => setQuartier(e.target.value)}
                  placeholder="Ex: Fidjrossè"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Statut dans la cellule</label>
                <select
                  value={statutMembre}
                  onChange={e => setStatutMembre(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                >
                  <option value="MEMBRE_REGULIER">Membre régulier</option>
                  <option value="NOUVEAU_CONVERTI">Nouveau converti</option>
                  <option value="VISITEUR">Visiteur / Curieux</option>
                  <option value="RESPONSABLE_ACCUEIL">Responsable Accueil</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Profession / Activité</label>
              <input
                type="text"
                value={profession}
                onChange={e => setProfession(e.target.value)}
                placeholder="Ex: Entrepreneur, Enseignant, Étudiant..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all"
              >
                Confirmer mon inscription
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
