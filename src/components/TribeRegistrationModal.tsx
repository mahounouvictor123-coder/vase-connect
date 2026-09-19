import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  User,
  Phone,
  MapPin,
  Shield,
  Crown,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { TribeInfo, TribeMember, TribeRole, UserProfile } from '../types';

interface TribeRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tribe: TribeInfo;
  currentUser?: UserProfile | null;
  existingMember?: TribeMember | null;
  isLeaderMode?: boolean;
  onSaveMember: (member: TribeMember, isLeader: boolean) => void;
}

export const TribeRegistrationModal: React.FC<TribeRegistrationModalProps> = ({
  isOpen,
  onClose,
  tribe,
  currentUser,
  existingMember,
  isLeaderMode = false,
  onSaveMember,
}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numero, setNumero] = useState('');
  const [quartier, setQuartier] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [roleInTribe, setRoleInTribe] = useState<TribeRole>('MEMBRE');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      if (existingMember) {
        setNom(existingMember.nom || '');
        setPrenom(existingMember.prenom || '');
        setNumero(existingMember.numero || '');
        setQuartier(existingMember.quartier || '');
        setPhotoUrl(existingMember.photoUrl || '');
        setRoleInTribe(existingMember.roleInTribe || (isLeaderMode ? 'PATRIARCHE' : 'MEMBRE'));
      } else if (isLeaderMode && tribe.leader) {
        setNom(tribe.leader.nom || '');
        setPrenom(tribe.leader.prenom || '');
        setNumero(tribe.leader.phone || '');
        setQuartier(tribe.leader.quartier || '');
        setPhotoUrl(tribe.leader.photoUrl || '');
        setRoleInTribe(tribe.leader.title === 'Matriarche' ? 'MATRIARCHE' : 'PATRIARCHE');
      } else if (currentUser) {
        setNom(currentUser.lastName || '');
        setPrenom(currentUser.firstName || '');
        setNumero(currentUser.phone || '');
        setQuartier(currentUser.city || '');
        setPhotoUrl(currentUser.photoUrl || '');
        setRoleInTribe(isLeaderMode ? 'PATRIARCHE' : 'MEMBRE');
      } else {
        setNom('');
        setPrenom('');
        setNumero('');
        setQuartier('');
        setPhotoUrl('');
        setRoleInTribe(isLeaderMode ? 'PATRIARCHE' : 'MEMBRE');
      }
    }
  }, [isOpen, existingMember, currentUser, isLeaderMode, tribe]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setPhotoUrl(imageUrlInput.trim());
      setImageUrlInput('');
      setShowUrlInput(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nom.trim()) {
      setErrorMessage('Veuillez renseigner votre Nom.');
      return;
    }
    if (!prenom.trim()) {
      setErrorMessage('Veuillez renseigner votre Prénom.');
      return;
    }
    if (!numero.trim()) {
      setErrorMessage('Veuillez renseigner votre Numéro de téléphone.');
      return;
    }
    if (!quartier.trim()) {
      setErrorMessage('Veuillez renseigner votre Quartier de résidence.');
      return;
    }
    if (!photoUrl.trim()) {
      setErrorMessage('Veuillez importer votre photo de profil (obligatoire).');
      return;
    }

    setIsSubmitting(true);

    const isLeader = roleInTribe === 'PATRIARCHE' || roleInTribe === 'MATRIARCHE';

    const memberData: TribeMember = {
      id: existingMember?.id || `tm-${Date.now()}`,
      tribeId: tribe.id,
      nom: nom.trim(),
      prenom: prenom.trim(),
      numero: numero.trim(),
      quartier: quartier.trim(),
      photoUrl: photoUrl.trim(),
      roleInTribe,
      registeredAt: existingMember?.registeredAt || new Date().toISOString().split('T')[0],
      userId: currentUser?.id,
    };

    setTimeout(() => {
      onSaveMember(memberData, isLeader);
      setIsSubmitting(false);
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header with Tribe accent */}
        <div className="relative p-6 bg-gradient-to-r from-[#0A3D36] via-[#124D44] to-[#0A3D36] text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-[11px] font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Tribu de {tribe.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isLeaderMode
                ? 'Désigner / Modifier le Chef de Tribu'
                : existingMember
                ? 'Mettre à jour mon inscription'
                : `S'inscrire dans la Tribu ${tribe.name}`}
            </h2>
            <p className="text-xs text-slate-200">
              Renseignez votre identité, votre contact, votre quartier et importez votre photo de profil.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Photo de profil (Obligatoire) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Photo de profil <span className="text-red-500">* (Obligatoire)</span></span>
              {photoUrl && <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Photo chargée</span>}
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              {/* Image Preview */}
              <div className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md flex items-center justify-center group">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                    <Camera className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-medium">Aucune photo</span>
                  </div>
                )}
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold"
                  >
                    Changer
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Upload className="w-4 h-4 text-[#C59A27]" />
                  <span>Importer ma photo</span>
                </button>

                <div className="text-[11px] text-slate-500">
                  <span>PNG, JPG ou WEBP depuis votre appareil</span>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="ml-2 text-[#0A3D36] hover:underline font-bold"
                  >
                    {showUrlInput ? 'Masquer URL' : 'ou par URL web'}
                  </button>
                </div>

                {showUrlInput && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="url"
                      placeholder="https://exemple.com/photo.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg font-bold hover:bg-slate-700"
                    >
                      Valider
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rôle dans la tribu : Membre ou Chef (Matriarche / Patriarche) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statut dans la Tribu
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRoleInTribe('MEMBRE')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  roleInTribe === 'MEMBRE'
                    ? 'bg-[#0A3D36] text-white border-[#0A3D36] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Membre</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleInTribe('PATRIARCHE')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  roleInTribe === 'PATRIARCHE'
                    ? 'bg-[#C59A27] text-[#0A3D36] border-[#C59A27] shadow-sm font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Patriarche (Chef)</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleInTribe('MATRIARCHE')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  roleInTribe === 'MATRIARCHE'
                    ? 'bg-[#C59A27] text-[#0A3D36] border-[#C59A27] shadow-sm font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Matriarche (Chef)</span>
              </button>
            </div>
            {(roleInTribe === 'PATRIARCHE' || roleInTribe === 'MATRIARCHE') && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                Vous vous enregistrez comme <strong>{roleInTribe === 'PATRIARCHE' ? 'Patriarche' : 'Matriarche'}</strong> (Chef spirituel et guide) de la tribu {tribe.name}.
              </p>
            )}
          </div>

          {/* Nom & Prénom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nom <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouadio, Bamba..."
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prénom <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: Emmanuel, Marie..."
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>
          </div>

          {/* Numéro & Quartier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Numéro de téléphone <span className="text-red-500">*</span></span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: +225 07 12 34 56 78"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Quartier de résidence <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cocody Angré, Yopougon..."
                value={quartier}
                onChange={(e) => setQuartier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md transition-all hover:scale-102 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-[#C59A27]" />
                  <span>
                    {roleInTribe === 'PATRIARCHE' || roleInTribe === 'MATRIARCHE'
                      ? 'Confirmer comme Chef'
                      : 'Valider mon inscription'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
