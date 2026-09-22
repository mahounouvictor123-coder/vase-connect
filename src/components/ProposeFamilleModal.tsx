import React, { useState } from 'react';
import {
  X,
  Users,
  MapPin,
  Navigation,
  Sparkles,
  CheckCircle2,
  Phone,
  Heart,
  ShieldCheck,
  Home,
  Camera,
  Upload,
} from 'lucide-react';
import { FamilleHonneur, UserProfile } from '../types';

interface ProposeFamilleModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (famille: FamilleHonneur) => void;
}

export const ProposeFamilleModal: React.FC<ProposeFamilleModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [nom, setNom] = useState('');
  const [nomFamille, setNomFamille] = useState(
    currentUser ? `Famille ${currentUser.lastName}` : ''
  );
  const [commune, setCommune] = useState('Cotonou');
  const [quartier, setQuartier] = useState(currentUser?.neighborhood || '');
  const [adresseRepere, setAdresseRepere] = useState('');
  const [latitude, setLatitude] = useState(6.37);
  const [longitude, setLongitude] = useState(2.39);
  const [isLocating, setIsLocating] = useState(false);

  // Berger Fields
  const [bergerNom, setBergerNom] = useState('');
  const [bergerPrenom, setBergerPrenom] = useState('Pasteur');
  const [bergerPhone, setBergerPhone] = useState('');
  const [bergerWhatsapp, setBergerWhatsapp] = useState('');
  const [bergerPhotoUrl, setBergerPhotoUrl] = useState('');

  // Hôte Fields
  const [hoteNom, setHoteNom] = useState(currentUser?.lastName || '');
  const [hotePrenom, setHotePrenom] = useState(currentUser?.firstName || '');
  const [hotePhone, setHotePhone] = useState(currentUser?.phone || '');
  const [hoteWhatsapp, setHoteWhatsapp] = useState(currentUser?.whatsapp || currentUser?.phone || '');

  // Photo de la maison
  const [photoMaisonUrl, setPhotoMaisonUrl] = useState('');

  const [capaciteAccueil, setCapaciteAccueil] = useState(20);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLatitude(Math.round(pos.coords.latitude * 10000) / 10000);
        setLongitude(Math.round(pos.coords.longitude * 10000) / 10000);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLatitude(6.368);
        setLongitude(2.402);
      },
      { timeout: 10000 }
    );
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'berger' | 'house'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'berger') setBergerPhotoUrl(result);
        if (target === 'house') setPhotoMaisonUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || !quartier.trim() || !hoteNom.trim() || !hotePhone.trim()) return;

    const newFamille: FamilleHonneur = {
      id: 'fh-' + Date.now(),
      nom: nom.trim(),
      nomFamille: nomFamille.trim() || `Famille ${hoteNom}`,
      quartier: quartier.trim(),
      commune,
      adresseRepere: adresseRepere.trim() || `À proximité de ${quartier}`,
      latitude,
      longitude,
      // Berger
      bergerNom: bergerNom.trim() || 'Référent Pastoral',
      bergerPrenom: bergerPrenom.trim(),
      bergerRole: 'Berger',
      bergerPhone: bergerPhone.trim() || hotePhone.trim(),
      bergerWhatsapp: bergerWhatsapp.trim() || bergerPhone.trim() || hotePhone.trim(),
      bergerPhotoUrl:
        bergerPhotoUrl.trim() ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      // Hôte
      hoteNom: hoteNom.trim(),
      hotePrenom: hotePrenom.trim(),
      hoteRole: "Pilote Foyer d'Accueil",
      hotePhone: hotePhone.trim(),
      hoteWhatsapp: hoteWhatsapp.trim() || hotePhone.trim(),
      hotePhotoUrl:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      // Maison
      photoMaisonUrl:
        photoMaisonUrl.trim() ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      photoFamilleUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      photosReunions: [],
      rencontreFrequence: 'Chaque dernier dimanche du mois',
      rencontreHeure: '17h00 - 19h00',
      prochaineDate: 'Dimanche 27 Septembre 2026 à 17h00',
      capaciteAccueil: Number(capaciteAccueil) || 20,
      description:
        description.trim() ||
        'Bienvenue dans notre foyer pour célébrer la fraternité, la parole et l\'amour de Christ.',
      programmeAccueil: [
        '17h00 : Accueil chaleureux & rafraîchissements',
        '17h20 : Louange & prières partagées',
        '17h50 : Méditation de la parole & édification',
        '18h30 : Agapes fraternelles',
      ],
      membresInscritsCount: 1,
      actif: true,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newFamille);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <Heart className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Ouvrir son foyer
              </span>
              <h3 className="text-base font-black text-white">Proposer une Famille d'Honneur</h3>
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

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">Famille d'Honneur enregistrée !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Que le Seigneur bénisse votre foyer d'accueil. Votre cellule est désormais active et visible pour les résidents de {quartier}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
            {/* Section Informations Générales */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#C59A27]" />
                <span>1. Identification de la Famille & Localité</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nom de la Cellule *
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Ex: Famille d'Honneur Grâce & Vie"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nom de famille d'accueil
                  </label>
                  <input
                    type="text"
                    value={nomFamille}
                    onChange={e => setNomFamille(e.target.value)}
                    placeholder="Ex: Famille Dossou"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Commune *</label>
                  <select
                    value={commune}
                    onChange={e => setCommune(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  >
                    <option value="Cotonou">Cotonou</option>
                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                    <option value="Sèmè-Kpodji">Sèmè-Kpodji</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quartier *</label>
                  <input
                    type="text"
                    value={quartier}
                    onChange={e => setQuartier(e.target.value)}
                    placeholder="Ex: Fidjrossè, Cadjèhoun, Akpakpa..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Repère précis d'accès *
                </label>
                <input
                  type="text"
                  value={adresseRepere}
                  onChange={e => setAdresseRepere(e.target.value)}
                  placeholder="Ex: À 200m de la Pharmacie Akogbato, 2ème rue pavée"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              {/* Geolocation Button */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C59A27]" />
                  <span className="text-xs text-slate-700 font-semibold">
                    Position GPS : {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#0A3D36]" />
                  <span>{isLocating ? 'Captation...' : 'Capturer ma position'}</span>
                </button>
              </div>
            </div>

            {/* Section Berger */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C59A27]" />
                <span>2. Fenêtre Berger (Conducteur Spirituel)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nom du Berger *
                  </label>
                  <input
                    type="text"
                    value={bergerNom}
                    onChange={e => setBergerNom(e.target.value)}
                    placeholder="Ex: Agossa"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Prénom du Berger
                  </label>
                  <input
                    type="text"
                    value={bergerPrenom}
                    onChange={e => setBergerPrenom(e.target.value)}
                    placeholder="Ex: Pasteur Élisée"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Téléphone du Berger *
                  </label>
                  <input
                    type="tel"
                    value={bergerPhone}
                    onChange={e => setBergerPhone(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    WhatsApp du Berger
                  </label>
                  <input
                    type="tel"
                    value={bergerWhatsapp}
                    onChange={e => setBergerWhatsapp(e.target.value)}
                    placeholder="+229 97 00 00 00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Photo du Berger (Importer un fichier ou saisir l'URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bergerPhotoUrl}
                    onChange={e => setBergerPhotoUrl(e.target.value)}
                    placeholder="Lien de la photo du Berger"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer text-xs font-bold text-slate-700 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Fichier</span>
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

            {/* Section Hôte & Maison */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                <Home className="w-4 h-4 text-[#C59A27]" />
                <span>3. Fenêtre Hôte & Photo de la Maison</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom Hôte *</label>
                  <input
                    type="text"
                    value={hoteNom}
                    onChange={e => setHoteNom(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Prénom Hôte *</label>
                  <input
                    type="text"
                    value={hotePrenom}
                    onChange={e => setHotePrenom(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone Hôte *</label>
                  <input
                    type="tel"
                    value={hotePhone}
                    onChange={e => setHotePhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Capacité d'accueil</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={capaciteAccueil}
                    onChange={e => setCapaciteAccueil(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Photo de la Maison / Cadre d'Accueil (Façade ou Salon)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={photoMaisonUrl}
                    onChange={e => setPhotoMaisonUrl(e.target.value)}
                    placeholder="URL de la photo de la maison"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
                  />
                  <label className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer text-xs font-bold text-slate-700 shrink-0">
                    <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'house')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer submit */}
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
                className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md transition-all hover:scale-102 active:scale-95"
              >
                Enregistrer la Famille d'Honneur
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
