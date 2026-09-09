import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, User, Building, Heart, MessageSquare, Phone, Briefcase, Award } from 'lucide-react';
import { UserProfile, InfluenceGateId, GateMemberProfile } from '../types';
import { INFLUENCE_GATES } from '../data/influenceGatesData';

interface GateRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGateId: InfluenceGateId;
  currentUser: UserProfile | null;
  existingProfile?: GateMemberProfile | null;
  onSaveProfile: (profile: GateMemberProfile) => void;
  onOpenAuth: () => void;
}

export const GateRegistrationModal: React.FC<GateRegistrationModalProps> = ({
  isOpen,
  onClose,
  selectedGateId,
  currentUser,
  existingProfile,
  onSaveProfile,
  onOpenAuth,
}) => {
  const [gateId, setGateId] = useState<InfluenceGateId>(selectedGateId);
  const [roleInGate, setRoleInGate] = useState('');
  const [subSector, setSubSector] = useState('');
  const [customSubSector, setCustomSubSector] = useState('');
  const [organization, setOrganization] = useState('');
  const [profession, setProfession] = useState('');
  const [visionImpact, setVisionImpact] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [seekingCollaboration, setSeekingCollaboration] = useState(true);
  const [openForMentoring, setOpenForMentoring] = useState(true);
  const [whatsappContact, setWhatsappContact] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const currentGate = INFLUENCE_GATES.find(g => g.id === gateId) || INFLUENCE_GATES[0];

  useEffect(() => {
    setGateId(selectedGateId);
  }, [selectedGateId]);

  useEffect(() => {
    if (existingProfile) {
      setRoleInGate(existingProfile.roleInGate || '');
      setSubSector(existingProfile.subSector || '');
      setOrganization(existingProfile.organization || '');
      setProfession(existingProfile.memberProfession || '');
      setVisionImpact(existingProfile.visionImpact || '');
      setSkillsInput(existingProfile.skills ? existingProfile.skills.join(', ') : '');
      setSeekingCollaboration(existingProfile.seekingCollaboration ?? true);
      setOpenForMentoring(existingProfile.openForMentoring ?? true);
      setWhatsappContact(existingProfile.whatsappContact || currentUser?.whatsappNumber || currentUser?.phone || '');
    } else if (currentUser) {
      setProfession(currentUser.profession || '');
      setWhatsappContact(currentUser.whatsappNumber || currentUser.phone || '');
      setSkillsInput(currentUser.skills ? currentUser.skills.join(', ') : '');
      setRoleInGate(currentGate.suggestedRoles[0] || 'Professionnel / Cadre');
      setSubSector(currentGate.keySubSectors[0] || '');
      setVisionImpact('');
      setOrganization('');
    }
  }, [existingProfile, currentUser, currentGate]);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-[#C59A27]/20">
          <div className="w-16 h-16 rounded-full bg-[#0A3D36]/10 text-[#0A3D36] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-[#C59A27]" />
          </div>
          <h3 className="text-xl font-black text-[#0A3D36]">Connexion requise</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connectez-vous pour rejoindre la porte <strong>« {currentGate.name} »</strong> et définir votre mandat d'influence chrétien selon l'enseignement du Pasteur Mohammed Sanogo.
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenSector = subSector === 'AUTRE' ? customSubSector.trim() || 'Activité spécifique' : subSector;
    const skillsList = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const profileData: GateMemberProfile = {
      id: existingProfile?.id || `gp-${Date.now()}`,
      userId: currentUser.id,
      gateId: currentGate.id,
      memberName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      memberProfession: profession.trim() || currentUser.profession,
      memberPhoto: currentUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      memberPhone: currentUser.phone,
      memberCity: currentUser.city || 'Cotonou',
      memberCountry: currentUser.country || 'Bénin',
      roleInGate: roleInGate || currentGate.suggestedRoles[0],
      subSector: chosenSector || currentGate.keySubSectors[0],
      organization: organization.trim(),
      visionImpact: visionImpact.trim() || `Impacter la sphère ${currentGate.name} par les principes du Royaume de Dieu.`,
      skills: skillsList.length > 0 ? skillsList : currentUser.skills || [],
      seekingCollaboration,
      openForMentoring,
      whatsappContact: whatsappContact.trim() || currentUser.whatsappNumber || currentUser.phone,
      registeredAt: existingProfile?.registeredAt || new Date().toISOString()
    };

    onSaveProfile(profileData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A3D36]/10 text-[#0A3D36] text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Porte {currentGate.number} / 12 • 12 Portes d'Influence pour Transformer une Nation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A3D36]">
              {existingProfile ? 'Modifier mon profil' : 'S\'inscrire & Définir mon profil'}
            </h2>
            <p className="text-xs text-slate-500">
              Sphère d'impact : <span className="font-bold text-slate-800">{currentGate.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biblical Reminder Quote */}
        <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
          <p className="font-bold text-[#0A3D36]">Vision enseignée par le Pasteur Mohammed Sanogo :</p>
          <p className="italic text-slate-700 leading-relaxed text-[11px]">
            « {currentGate.apostolicVision} »
          </p>
          <p className="text-[10px] font-bold text-[#C59A27]">{currentGate.scriptureReference}</p>
        </div>

        {isSaved ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#0A3D36]">Profil enregistré avec succès !</h3>
            <p className="text-xs text-slate-600">
              Votre mandat d'impact dans la porte « {currentGate.name} » est maintenant actif dans la communauté.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Choose Gate Selector if user wants to change */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">
                Porte d'Influence sélectionnée :
              </label>
              <select
                value={gateId}
                onChange={(e) => setGateId(e.target.value as InfluenceGateId)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:border-[#0A3D36] focus:outline-hidden"
              >
                {INFLUENCE_GATES.map((g) => (
                  <option key={g.id} value={g.id}>
                    Porte {g.number} : {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession / Intitulé & Rôle dans la porte */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Votre profession ou spécialité <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Ex: Avocat d'affaires, Médecin, Ingénieur..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Votre rôle / posture dans cette porte <span className="text-red-500">*</span>
                </label>
                <select
                  value={roleInGate}
                  onChange={(e) => setRoleInGate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden font-medium"
                >
                  {currentGate.suggestedRoles.map((role, idx) => (
                    <option key={idx} value={role}>{role}</option>
                  ))}
                  <option value="Professionnel en poste">Professionnel en poste</option>
                  <option value="Chef d'entreprise / Fondateur">Chef d'entreprise / Fondateur</option>
                  <option value="Cadre / Dirigeant">Cadre / Dirigeant</option>
                  <option value="Étudiant d'excellence / En formation">Étudiant d'excellence / En formation</option>
                  <option value="Consultant / Expert indépendant">Consultant / Expert indépendant</option>
                  <option value="Porteur de projet / Visionnaire">Porteur de projet / Visionnaire</option>
                  <option value="Mentor & Formateur">Mentor & Formateur</option>
                </select>
              </div>
            </div>

            {/* Sub-sector */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Sous-domaine précis d'intervention <span className="text-red-500">*</span>
              </label>
              <select
                value={subSector}
                onChange={(e) => setSubSector(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden mb-2"
              >
                {currentGate.keySubSectors.map((sector, idx) => (
                  <option key={idx} value={sector}>{sector}</option>
                ))}
                <option value="AUTRE">Autre secteur spécifique...</option>
              </select>

              {subSector === 'AUTRE' && (
                <input
                  type="text"
                  required
                  value={customSubSector}
                  onChange={(e) => setCustomSubSector(e.target.value)}
                  placeholder="Précisez votre sous-domaine d'activité..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden"
                />
              )}
            </div>

            {/* Organization / Company / Institution */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Organisation, Entreprise, École ou Institution
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ex: Ministère de l'Économie, Cabinet Veritas, UAC, Ma propre entreprise..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden"
              />
            </div>

            {/* Vision & Impact chrétien */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Votre vision d'impact chrétien dans ce domaine <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={visionImpact}
                onChange={(e) => setVisionImpact(e.target.value)}
                placeholder="Comment comptez-vous manifester la gloire de Dieu, l'excellence et les principes bibliques dans cette sphère de la société ? Quels changements souhaitez-vous apporter ?"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Compétences clés & talents mis à disposition (séparés par des virgules)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Ex: Gestion de projet, Droit des affaires, Audit, Prise de parole..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden"
              />
            </div>

            {/* Contact WhatsApp */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Numéro WhatsApp pour contact & synergies du Royaume
              </label>
              <input
                type="tel"
                value={whatsappContact}
                onChange={(e) => setWhatsappContact(e.target.value)}
                placeholder="+229 97 00 00 00"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-[#0A3D36] focus:outline-hidden"
              />
            </div>

            {/* Checkboxes for Collaboration & Mentoring */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={seekingCollaboration}
                  onChange={(e) => setSeekingCollaboration(e.target.checked)}
                  className="rounded border-slate-300 text-[#0A3D36] focus:ring-[#0A3D36] w-4 h-4"
                />
                <span className="font-semibold text-slate-700 text-xs">
                  Je suis ouvert(e) aux partenariats et projets avec d'autres frères et sœurs de cette porte.
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={openForMentoring}
                  onChange={(e) => setOpenForMentoring(e.target.checked)}
                  className="rounded border-slate-300 text-[#0A3D36] focus:ring-[#0A3D36] w-4 h-4"
                />
                <span className="font-semibold text-slate-700 text-xs">
                  Je suis disposé(e) à mentorer et orienter des jeunes ou nouveaux professionnels.
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#082f2a] hover:to-[#0f4b43] text-white font-black shadow-md transition-all hover:scale-102 active:scale-95"
              >
                {existingProfile ? 'Mettre à jour mon profil' : 'Enregistrer mon profil dans cette Porte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
