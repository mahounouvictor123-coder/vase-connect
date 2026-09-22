import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Share2,
  Camera,
  Upload,
  UserCheck,
  Home,
  ShieldCheck,
  Edit3,
  Plus,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { FamilleHonneur, FamilleHonneurInscription, FamilleReunionPhoto, UserProfile } from '../types';
import { getDirectionsUrl, formatDistance } from '../data/famillesHonneurData';

interface FamilleDetailModalProps {
  famille: FamilleHonneur;
  currentUser: UserProfile | null;
  inscriptions?: FamilleHonneurInscription[];
  onClose: () => void;
  onJoin: (famille: FamilleHonneur) => void;
  onUpdateFamille?: (updated: FamilleHonneur) => void;
  onAddInscription?: (inscription: FamilleHonneurInscription) => void;
  onLaunchGps?: (famille: FamilleHonneur) => void;
  initialTab?: 'berger' | 'hote_maison' | 'photos_reunions' | 'inscription' | 'localisation';
}

export const FamilleDetailModal: React.FC<FamilleDetailModalProps> = ({
  famille,
  currentUser,
  inscriptions = [],
  onClose,
  onJoin,
  onUpdateFamille,
  onAddInscription,
  onLaunchGps,
  initialTab = 'berger',
}) => {
  const [activeTab, setActiveTab] = useState<
    'berger' | 'hote_maison' | 'photos_reunions' | 'inscription' | 'localisation'
  >(initialTab);

  // Berger edit form state
  const [isEditingBerger, setIsEditingBerger] = useState(false);
  const [bergerNom, setBergerNom] = useState(famille.bergerNom || '');
  const [bergerPrenom, setBergerPrenom] = useState(famille.bergerPrenom || '');
  const [bergerPhone, setBergerPhone] = useState(famille.bergerPhone || '');
  const [bergerWhatsapp, setBergerWhatsapp] = useState(famille.bergerWhatsapp || '');
  const [bergerRole, setBergerRole] = useState(famille.bergerRole || 'Berger');
  const [bergerPhotoUrl, setBergerPhotoUrl] = useState(famille.bergerPhotoUrl || '');

  // House photo edit state
  const [isEditingHousePhoto, setIsEditingHousePhoto] = useState(false);
  const [housePhotoUrl, setHousePhotoUrl] = useState(famille.photoMaisonUrl || '');

  // Post-meeting photo publish form state
  const [isPublishingPhoto, setIsPublishingPhoto] = useState(false);
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoTitre, setPhotoTitre] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoSuccessNotice, setPhotoSuccessNotice] = useState<string | null>(null);

  // In-modal member registration form state
  const [regNom, setRegNom] = useState(currentUser?.lastName || '');
  const [regPrenom, setRegPrenom] = useState(currentUser?.firstName || '');
  const [regPhone, setRegPhone] = useState(currentUser?.phone || '');
  const [regWhatsapp, setRegWhatsapp] = useState(currentUser?.whatsapp || currentUser?.phone || '');
  const [regQuartier, setRegQuartier] = useState(currentUser?.neighborhood || famille.quartier);
  const [regProfession, setRegProfession] = useState('');
  const [regStatutMembre, setRegStatutMembre] = useState<
    'MEMBRE_REGULIER' | 'NOUVEAU_CONVERTI' | 'VISITEUR' | 'RESPONSABLE_ACCUEIL'
  >('MEMBRE_REGULIER');
  const [regSuccess, setRegSuccess] = useState(false);

  const directionsUrl = getDirectionsUrl(famille.latitude, famille.longitude, `${famille.nom} ${famille.quartier}`);

  // Filter inscriptions for this specific family
  const familyInscriptions = inscriptions.filter(i => i.familleId === famille.id);

  // File upload helper for house or meeting photo
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'berger' | 'house' | 'meeting'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'berger') setBergerPhotoUrl(result);
        if (target === 'house') setHousePhotoUrl(result);
        if (target === 'meeting') setPhotoUrlInput(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBerger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bergerNom.trim() || !bergerPhone.trim()) return;

    const updated: FamilleHonneur = {
      ...famille,
      bergerNom: bergerNom.trim(),
      bergerPrenom: bergerPrenom.trim(),
      bergerPhone: bergerPhone.trim(),
      bergerWhatsapp: bergerWhatsapp.trim() || bergerPhone.trim(),
      bergerRole: bergerRole.trim(),
      bergerPhotoUrl:
        bergerPhotoUrl.trim() ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    };

    if (onUpdateFamille) onUpdateFamille(updated);
    setIsEditingBerger(false);
  };

  const handleSaveHousePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!housePhotoUrl.trim()) return;

    const updated: FamilleHonneur = {
      ...famille,
      photoMaisonUrl: housePhotoUrl.trim(),
    };

    if (onUpdateFamille) onUpdateFamille(updated);
    setIsEditingHousePhoto(false);
  };

  const handlePublishMeetingPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrlInput.trim() || !photoTitre.trim()) return;

    const newPhoto: FamilleReunionPhoto = {
      id: 'pr-' + Date.now(),
      date: photoDate,
      titre: photoTitre.trim(),
      photoUrl: photoUrlInput.trim(),
      description: photoDescription.trim(),
      publiePar: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : `Berger ${famille.bergerNom}`,
      participantsCount: famille.membresInscritsCount || 20,
    };

    const currentPhotos = famille.photosReunions || [];
    const updated: FamilleHonneur = {
      ...famille,
      photosReunions: [newPhoto, ...currentPhotos],
    };

    if (onUpdateFamille) onUpdateFamille(updated);

    setPhotoTitre('');
    setPhotoUrlInput('');
    setPhotoDescription('');
    setIsPublishingPhoto(false);
    setPhotoSuccessNotice('Photo de la réunion publiée avec succès dans l’album !');
    setTimeout(() => setPhotoSuccessNotice(null), 3500);
  };

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNom.trim() || !regPrenom.trim() || !regPhone.trim()) return;

    const newInscription: FamilleHonneurInscription = {
      id: 'fhi-' + Date.now(),
      familleId: famille.id,
      userId: currentUser?.id,
      nom: regNom.trim(),
      prenom: regPrenom.trim(),
      telephone: regPhone.trim(),
      whatsapp: regWhatsapp.trim() || regPhone.trim(),
      quartier: regQuartier.trim(),
      profession: regProfession.trim(),
      statutMembre: regStatutMembre,
      dateInscription: new Date().toISOString().split('T')[0],
      statut: 'INSCRIT',
    };

    if (onAddInscription) {
      onAddInscription(newInscription);
    } else {
      onJoin(famille);
    }

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
    }, 3000);
  };

  const handleShare = () => {
    const text = `Cellule de communion : ${famille.nom} à ${famille.quartier}, Cotonou.\nBerger : ${famille.bergerPrenom || ''} ${famille.bergerNom} (${famille.bergerPhone})\nHôte : ${famille.hotePrenom} ${famille.hoteNom} (${famille.hotePhone})\nProchaine rencontre : ${famille.prochaineDate}.\nRepère GPS : ${famille.adresseRepere}`;
    if (navigator.share) {
      navigator.share({
        title: famille.nom,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Informations de la Famille d\'Honneur copiées dans le presse-papier !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[94vh]">
        {/* Cover image & quick overview banner */}
        <div className="relative h-44 sm:h-52 bg-slate-900 shrink-0">
          <img
            src={
              famille.photoMaisonUrl ||
              famille.photoFamilleUrl ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
            }
            alt={famille.nom}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30" />

          {/* Top buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Badges on cover */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C59A27] text-slate-950 shadow-md flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{famille.quartier}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A3D36]/90 text-white border border-[#C59A27]/40 backdrop-blur-md">
              {famille.commune}
            </span>
            {famille.distanceKm !== undefined && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span>{formatDistance(famille.distanceKm)}</span>
              </span>
            )}
          </div>

          {/* Title & Leader quick preview on bottom of cover */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider block">
                Famille d'Honneur • {famille.nomFamille}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm">
                {famille.nom}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md text-white text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-[#E5B22F]" />
              <span>{famille.membresInscritsCount} membres</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('berger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'berger'
                ? 'bg-[#0A3D36] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Fenêtre Berger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hote_maison')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hote_maison'
                ? 'bg-[#0A3D36] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Hôte & Maison</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos_reunions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'photos_reunions'
                ? 'bg-[#0A3D36] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Photos des Réunions</span>
            {famille.photosReunions && famille.photosReunions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C59A27] text-slate-950 text-[10px] font-black flex items-center justify-center">
                {famille.photosReunions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inscription')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inscription'
                ? 'bg-[#0A3D36] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>S'inscrire comme Membre</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('localisation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'localisation'
                ? 'bg-[#0A3D36] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Localisation & Repère</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {photoSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{photoSuccessNotice}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: FENÊTRE BERGER */}
          {/* ========================================================================= */}
          {activeTab === 'berger' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C59A27]" />
                    <span>Fenêtre Berger</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Leader spirituel veillant sur l'édification et les membres de la localité.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingBerger(!isEditingBerger)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0A3D36]" />
                  <span>{isEditingBerger ? 'Annuler' : 'Renseigner / Modifier'}</span>
                </button>
              </div>

              {/* Berger View Card */}
              {!isEditingBerger ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A3D36] via-[#135E54] to-slate-900 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#C59A27]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#C59A27] shadow-xl bg-slate-800 shrink-0">
                        <img
                          src={famille.bergerPhotoUrl}
                          alt={famille.bergerNom}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-[#C59A27] text-slate-950 font-black text-[10px] shadow">
                        Berger
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                          {famille.bergerRole || 'Berger Référent'}
                        </span>
                        <h4 className="text-xl font-black text-white">
                          {famille.bergerPrenom} {famille.bergerNom}
                        </h4>
                        <p className="text-xs text-slate-200 mt-0.5">
                          Zone d'action : <strong>{famille.quartier}</strong> ({famille.commune})
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic bg-black/20 p-2.5 rounded-xl border border-white/10">
                        « Bienvenue dans notre famille de foi. N'hésitez pas à me joindre directement pour toute assistance de prière ou renseignement. »
                      </p>

                      {/* Direct Call & WhatsApp buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`tel:${famille.bergerPhone.replace(/\s+/g, '')}`}
                          className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-amber-100 text-xs font-black flex items-center gap-2 transition-transform hover:scale-102 active:scale-95 shadow-md"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#0A3D36]" />
                          <span>Appeler : {famille.bergerPhone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${famille.bergerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour Berger ${famille.bergerNom}, je vous contacte à propos de la ${famille.nom} à ${famille.quartier}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black flex items-center gap-2 transition-transform hover:scale-102 active:scale-95 shadow-md"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Berger Edit Form */
                <form
                  onSubmit={handleSaveBerger}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Edit3 className="w-4 h-4 text-[#0A3D36]" />
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Renseigner les informations du Berger
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Nom du Berger *
                      </label>
                      <input
                        type="text"
                        value={bergerNom}
                        onChange={e => setBergerNom(e.target.value)}
                        placeholder="Ex: Agossa"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Prénom du Berger
                      </label>
                      <input
                        type="text"
                        value={bergerPrenom}
                        onChange={e => setBergerPrenom(e.target.value)}
                        placeholder="Ex: Pasteur Élisée"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Numéro de Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={bergerPhone}
                        onChange={e => setBergerPhone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Numéro WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={bergerWhatsapp}
                        onChange={e => setBergerWhatsapp(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Photo du Berger (Importer un fichier ou saisir une URL)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                        <img
                          src={
                            bergerPhotoUrl ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                          }
                          alt="Aperçu berger"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={bergerPhotoUrl}
                          onChange={e => setBergerPhotoUrl(e.target.value)}
                          placeholder="Coller l'URL de l'image de profil"
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A3D36]"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span>Importer photo depuis l'appareil</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, 'berger')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingBerger(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md transition-all"
                    >
                      Enregistrer les coordonnées du Berger
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FENÊTRE HÔTE & MAISON */}
          {/* ========================================================================= */}
          {activeTab === 'hote_maison' && (
            <div className="space-y-5">
              {/* Section Hôte */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#C59A27]" />
                  <span>Foyer Hôte d'Accueil</span>
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-[#C59A27] shadow-md">
                      <img
                        src={
                          famille.hotePhotoUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                        }
                        alt={famille.hoteNom}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-[#C59A27] tracking-wider">
                        {famille.hoteRole || 'Foyer d\'Accueil'}
                      </span>
                      <h5 className="text-base font-black text-slate-900">
                        {famille.hotePrenom} {famille.hoteNom}
                      </h5>
                      <p className="text-xs text-slate-500">
                        Responsable de l'accueil fraternel, agapes et cadre de réunion
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${famille.hotePhone.replace(/\s+/g, '')}`}
                      className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0A3D36]" />
                      <span>{famille.hotePhone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${famille.hoteWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${famille.hotePrenom}, je vous contacte au sujet de la ${famille.nom}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Section Photo de la Maison */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#C59A27]" />
                      <span>Photo de la Maison / Cadre d'Accueil</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Permet aux membres et visiteurs d'identifier facilement la maison à l'arrivée.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingHousePhoto(!isEditingHousePhoto)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>{isEditingHousePhoto ? 'Annuler' : 'Importer / Changer la photo'}</span>
                  </button>
                </div>

                {/* House Photo Display */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 aspect-video max-h-72">
                  <img
                    src={
                      famille.photoMaisonUrl ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
                    }
                    alt="Façade de la maison"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>{famille.adresseRepere}</span>
                  </div>
                </div>

                {/* House Photo Edit Form */}
                {isEditingHousePhoto && (
                  <form
                    onSubmit={handleSaveHousePhoto}
                    className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3 animate-in fade-in"
                  >
                    <label className="text-xs font-black text-slate-800 block">
                      Importer une nouvelle photo de la maison / cadre d'accueil :
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={housePhotoUrl}
                        onChange={e => setHousePhotoUrl(e.target.value)}
                        placeholder="Saisir ou coller l'URL directe de la photo"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-700 whitespace-nowrap shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                        <span>Choisir fichier</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'house')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingHousePhoto(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#0A3D36] text-white text-xs font-black hover:bg-[#135E54] shadow-sm"
                      >
                        Enregistrer la photo de la maison
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PHOTOS DES RÉUNIONS (POST-MEETING COMMUNION SOUVENIRS) */}
          {/* ========================================================================= */}
          {activeTab === 'photos_reunions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#C59A27]" />
                    <span>Photos de Famille Après Chaque Réunion</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Album des souvenirs fraternels, agapes et moments bénis vécus en cellule.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublishingPhoto(!isPublishingPhoto)}
                  className="px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Publier une photo de réunion</span>
                </button>
              </div>

              {/* Publish meeting photo form */}
              {isPublishingPhoto && (
                <form
                  onSubmit={handlePublishMeetingPhoto}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C59A27]" />
                      <span>Publier le souvenir de la dernière réunion</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsPublishingPhoto(false)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Titre / Événement *
                      </label>
                      <input
                        type="text"
                        value={photoTitre}
                        onChange={e => setPhotoTitre(e.target.value)}
                        placeholder="Ex: Réunion de prière et agapes du dimanche"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Date de la réunion *
                      </label>
                      <input
                        type="date"
                        value={photoDate}
                        onChange={e => setPhotoDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Photo de la réunion (Fichier ou URL) *
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={photoUrlInput}
                        onChange={e => setPhotoUrlInput(e.target.value)}
                        placeholder="Coller l'URL de la photo ou importer ci-contre"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-700 whitespace-nowrap shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                        <span>Importer photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, 'meeting')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {photoUrlInput && (
                      <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-300">
                        <img src={photoUrlInput} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Légende / Témoignage de la rencontre
                    </label>
                    <textarea
                      value={photoDescription}
                      onChange={e => setPhotoDescription(e.target.value)}
                      rows={2}
                      placeholder="Partagez un mot sur l'ambiance, les prières partagées, la joie fraternelle..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsPublishingPhoto(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>Publier dans l'album</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Photos Gallery Grid */}
              {famille.photosReunions && famille.photosReunions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {famille.photosReunions.map(photo => (
                    <div
                      key={photo.id}
                      className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow group flex flex-col"
                    >
                      <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                        <img
                          src={photo.photoUrl}
                          alt={photo.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C59A27]" />
                          <span>{photo.date}</span>
                        </div>
                      </div>
                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-black text-slate-900 line-clamp-1">{photo.titre}</h5>
                          {photo.description && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                              {photo.description}
                            </p>
                          )}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Publié par : {photo.publiePar}</span>
                          {photo.participantsCount && (
                            <span className="font-bold text-[#0A3D36]">
                              {photo.participantsCount} participants
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-bold">
                    Aucune photo de réunion publiée pour le moment dans cette famille.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Prenez une photo de communion lors de votre prochaine rencontre et publiez-la ici !
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INSCRIPTION DES MEMBRES */}
          {/* ========================================================================= */}
          {activeTab === 'inscription' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#C59A27]" />
                  <span>Espace Inscription des Membres</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Rejoignez cette famille d'honneur pour participer aux prochaines réunions de foi et de communion.
                </p>
              </div>

              {regSuccess ? (
                <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-emerald-900">
                    Inscription enregistrée avec succès !
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Bienvenue dans la {famille.nom}. Le Berger et l'Hôte vous contacteront pour la prochaine rencontre du {famille.prochaineDate}.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleRegisterMember}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5"
                >
                  <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C59A27]" />
                    <span>Formulaire d'adhésion membre</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Votre Nom *
                      </label>
                      <input
                        type="text"
                        value={regNom}
                        onChange={e => setRegNom(e.target.value)}
                        placeholder="Ex: Dossou"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Votre Prénom *
                      </label>
                      <input
                        type="text"
                        value={regPrenom}
                        onChange={e => setRegPrenom(e.target.value)}
                        placeholder="Ex: Marc"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Téléphone Appel *
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        required
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Numéro WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={regWhatsapp}
                        onChange={e => setRegWhatsapp(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Votre Quartier de Résidence
                      </label>
                      <input
                        type="text"
                        value={regQuartier}
                        onChange={e => setRegQuartier(e.target.value)}
                        placeholder="Ex: Fidjrossè"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Votre Profession / Activité
                      </label>
                      <input
                        type="text"
                        value={regProfession}
                        onChange={e => setRegProfession(e.target.value)}
                        placeholder="Ex: Enseignant, Cadre, Entrepreneur..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#135E54] hover:to-[#0A3D36] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
                  >
                    <UserCheck className="w-4 h-4 text-[#C59A27]" />
                    <span>Confirmer mon Inscription dans cette Famille</span>
                  </button>
                </form>
              )}

              {/* Roster of members registered in this family */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">
                    Membres Enregistrés ({famille.membresInscritsCount} au total)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Capacité : {famille.capaciteAccueil} personnes
                  </span>
                </div>

                {familyInscriptions.length > 0 ? (
                  <div className="space-y-1.5">
                    {familyInscriptions.map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0A3D36] text-white flex items-center justify-center font-black text-xs">
                            {member.prenom[0]}
                            {member.nom[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">
                              {member.prenom} {member.nom}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Quartier : {member.quartier}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            Inscrit
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                    Soyez parmi les premiers membres inscrits pour cette cellule via le formulaire ci-dessus.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: LOCALISATION & PROGRAMME */}
          {/* ========================================================================= */}
          {activeTab === 'localisation' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#C59A27]" />
                  <span>Localisation & Repère Géographique</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Repère précis pour se rendre sans difficulté à la maison d'accueil.
                </p>
              </div>

              {/* Address detail box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    Repère d'accès exact
                  </span>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-black text-[#0A3D36] hover:text-[#C59A27] underline"
                  >
                    <span>Google Maps</span>
                    <Navigation className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-sm text-slate-800 font-bold">
                  📍 {famille.adresseRepere}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <span>Commune : <strong>{famille.commune}</strong></span>
                  <span>•</span>
                  <span>Quartier : <strong>{famille.quartier}</strong></span>
                  <span>•</span>
                  <span>GPS : {famille.latitude.toFixed(4)}, {famille.longitude.toFixed(4)}</span>
                </div>
              </div>

              {/* Action Directe GPS et Retour Plateforme */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-[#C59A27]/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C59A27] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">Prêt à vous rendre sur place ?</h5>
                    <p className="text-[11px] text-slate-200">
                      Lancez l'itinéraire GPS en un clic avec guidage vocal Google Maps.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (onLaunchGps) onLaunchGps(famille);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#C59A27] hover:bg-[#E5B22F] text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-xs hover:scale-102"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Lancer le GPS</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>🔙 Retour à la plateforme</span>
                  </button>
                </div>
              </div>

              {/* Programme de Rencontre */}
              {famille.programmeAccueil && famille.programmeAccueil.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Déroulement type de la rencontre
                  </h4>
                  <div className="space-y-1.5">
                    {famille.programmeAccueil.map((etape, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C59A27] shrink-0" />
                        <span>{etape}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors flex items-center gap-1.5"
          >
            <span>🔙 Retour à la plateforme</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (onLaunchGps) onLaunchGps(famille);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C59A27]" />
              <span className="hidden sm:inline">Itinéraire GPS</span>
            </a>

            <button
              type="button"
              onClick={() => setActiveTab('inscription')}
              className="px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-[#E5B22F]" />
              <span>S'inscrire comme membre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
