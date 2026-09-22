import React, { useState, useMemo } from 'react';
import {
  Users,
  MapPin,
  Navigation,
  Search,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Plus,
  Compass,
  Home,
  ShieldCheck,
  Camera,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { FamilleHonneur, FamilleHonneurInscription, UserProfile } from '../types';
import {
  COMMUNES_LIST,
  QUARTIERS_LIST,
  LOCALITES_PREINSCRITES,
  calculateDistanceKm,
  formatDistance,
  getDirectionsUrl,
} from '../data/famillesHonneurData';
import { FamillesHonneurMap } from './FamillesHonneurMap';
import { JoinFamilleModal } from './JoinFamilleModal';
import { ProposeFamilleModal } from './ProposeFamilleModal';
import { FamilleDetailModal } from './FamilleDetailModal';

interface FamillesHonneurViewProps {
  currentUser: UserProfile | null;
  familles: FamilleHonneur[];
  inscriptions?: FamilleHonneurInscription[];
  onSaveFamille: (famille: FamilleHonneur) => void;
  onSaveInscription: (inscription: FamilleHonneurInscription) => void;
  onBackToHome?: () => void;
  onOpenAuth?: () => void;
}

export const FamillesHonneurView: React.FC<FamillesHonneurViewProps> = ({
  currentUser,
  familles,
  inscriptions = [],
  onSaveFamille,
  onSaveInscription,
  onBackToHome,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('Toutes');
  const [selectedQuartier, setSelectedQuartier] = useState('Tous les quartiers');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [selectedFamilleForDetail, setSelectedFamilleForDetail] = useState<FamilleHonneur | null>(null);
  const [selectedFamilleForJoin, setSelectedFamilleForJoin] = useState<FamilleHonneur | null>(null);
  const [activeGpsFamille, setActiveGpsFamille] = useState<FamilleHonneur | null>(null);
  const [detailModalInitialTab, setDetailModalInitialTab] = useState<
    'berger' | 'hote_maison' | 'photos_reunions' | 'inscription' | 'localisation'
  >('berger');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  // User GPS coordinates
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [recenterNotice, setRecenterNotice] = useState<string | null>(null);

  const handleLaunchGps = (famille: FamilleHonneur) => {
    setActiveGpsFamille(famille);
    const url = getDirectionsUrl(famille.latitude, famille.longitude, userLocation);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Auto detect location on click
  const handleDetectLocation = (callback?: (pos: { latitude: number; longitude: number }) => void) => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
        setRecenterNotice('Position GPS détectée avec succès !');
        setTimeout(() => setRecenterNotice(null), 3000);
        if (callback) callback(coords);
      },
      () => {
        setIsLocating(false);
        alert('Impossible de récupérer votre position GPS actuelle.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Revenir directement à la géolocalisation et réinitialiser les filtres
  const handleReturnToGeolocation = () => {
    setSearchQuery('');
    setSelectedCommune('Toutes');
    setSelectedQuartier('Tous les quartiers');

    if (!userLocation) {
      handleDetectLocation(coords => {
        const sorted = [...familles]
          .map(f => ({
            ...f,
            distanceKm: calculateDistanceKm(coords.latitude, coords.longitude, f.latitude, f.longitude),
          }))
          .sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
        if (sorted[0]) {
          openDetailModal(sorted[0], 'localisation');
        }
      });
    } else {
      setRecenterNotice('Recentré sur votre position géographique !');
      setTimeout(() => setRecenterNotice(null), 3000);
      if (nearestFamille) {
        openDetailModal(nearestFamille, 'localisation');
      }
    }
  };

  const handleClearLocation = () => {
    setUserLocation(null);
    setRecenterNotice('Position GPS effacée.');
    setTimeout(() => setRecenterNotice(null), 2500);
  };

  const openDetailModal = (
    famille: FamilleHonneur,
    tab: 'berger' | 'hote_maison' | 'photos_reunions' | 'inscription' | 'localisation' = 'berger'
  ) => {
    setDetailModalInitialTab(tab);
    setSelectedFamilleForDetail(famille);
  };

  // Compute distance for each famille if userLocation is available
  const famillesWithDistance = useMemo(() => {
    return familles.map(f => {
      if (userLocation) {
        const dist = calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          f.latitude,
          f.longitude
        );
        return { ...f, distanceKm: dist };
      }
      return f;
    });
  }, [familles, userLocation]);

  // Filtered & sorted familles
  const filteredFamilles = useMemo(() => {
    return famillesWithDistance
      .filter(f => {
        const matchesQuery =
          !searchQuery.trim() ||
          f.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.nomFamille.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.quartier.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.commune.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.adresseRepere.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.bergerNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (f.bergerPrenom && f.bergerPrenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
          f.hoteNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.hotePrenom.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCommune =
          selectedCommune === 'Toutes' ||
          f.commune.toLowerCase() === selectedCommune.toLowerCase();

        const matchesQuartier =
          selectedQuartier === 'Tous les quartiers' ||
          f.quartier.toLowerCase().includes(selectedQuartier.toLowerCase());

        return matchesQuery && matchesCommune && matchesQuartier;
      })
      .sort((a, b) => {
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        return b.membresInscritsCount - a.membresInscritsCount;
      });
  }, [famillesWithDistance, searchQuery, selectedCommune, selectedQuartier]);

  const nearestFamille = useMemo(() => {
    if (!userLocation || famillesWithDistance.length === 0) return null;
    const sorted = [...famillesWithDistance].sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    return sorted[0];
  }, [userLocation, famillesWithDistance]);

  // Check if search query matches a pre-registered locality
  const matchedPreInscrite = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.trim().toLowerCase();
    const found = LOCALITES_PREINSCRITES.find(
      l =>
        l.nom.toLowerCase().includes(query) ||
        query.includes(l.nom.toLowerCase()) ||
        l.quartier.toLowerCase().includes(query)
    );
    if (!found) return null;
    return famillesWithDistance.find(f => f.id === found.familleId || f.quartier.includes(found.quartier));
  }, [searchQuery, famillesWithDistance]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in">
      {/* Persistent Return to Platform Banner when GPS Navigation is active */}
      {activeGpsFamille && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] text-white shadow-xl border-2 border-[#C59A27] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C59A27] text-slate-950 flex items-center justify-center font-black animate-pulse shrink-0 shadow-md">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C59A27] text-slate-950 uppercase tracking-wider">
                  Navigation GPS Ouverte
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {activeGpsFamille.nom} ({activeGpsFamille.quartier})
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1">
                L'itinéraire GPS a été ouvert dans Google Maps. Vous pouvez revenir sur la plateforme Vases Connect à tout moment.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveGpsFamille(null);
                openDetailModal(activeGpsFamille, 'localisation');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#C59A27] hover:bg-[#E5B22F] text-slate-950 text-xs font-black shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>🔙 Retour à la plateforme</span>
            </button>
            {onBackToHome && (
              <button
                type="button"
                onClick={() => {
                  setActiveGpsFamille(null);
                  onBackToHome();
                }}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
              >
                Accueil
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveGpsFamille(null)}
              className="px-2 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
              title="Fermer ce bandeau"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-6 sm:p-10 text-white shadow-xl border border-[#C59A27]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59A27]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/50 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Familles d'Honneur • Fenêtres Berger, Hôte & Maison</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Familles d'Honneur
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Consultez pour chaque localité pré-inscrite son <strong>Berger référent</strong> (nom, photo, numéro d'appel), son <strong>Hôte</strong>, la <strong>photo de la maison</strong> d'accueil, l'album des <strong>photos de famille après chaque réunion</strong>, et inscrivez-vous en 1 clic !
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            {userLocation ? (
              <>
                <button
                  type="button"
                  onClick={handleReturnToGeolocation}
                  className="px-4 py-2.5 rounded-xl bg-[#C59A27] hover:bg-[#E5B22F] text-slate-950 text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-102 active:scale-95"
                  title="Recentrer sur ma position GPS et ma Famille la plus proche"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>Revenir à ma géolocalisation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDetectLocation()}
                  disabled={isLocating}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95 disabled:opacity-50"
                  title="Actualiser ma position GPS"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>{isLocating ? 'Actualisation...' : 'Actualiser GPS'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="px-2.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
                  title="Désactiver la position GPS"
                >
                  Effacer GPS
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleDetectLocation()}
                disabled={isLocating}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur flex items-center gap-2 transition-all hover:scale-102 active:scale-95 disabled:opacity-50"
              >
                <Navigation className="w-4 h-4 text-[#C59A27]" />
                <span>{isLocating ? 'Localisation en cours...' : 'Trouver ma Famille la plus proche'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (!currentUser && onOpenAuth) {
                  onOpenAuth();
                } else {
                  setIsProposeModalOpen(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-102 active:scale-95 border border-emerald-500/50"
            >
              <Plus className="w-4 h-4" />
              <span>Proposer ma Famille</span>
            </button>
          </div>
        </div>

        {/* Nearest Famille Banner Alert if GPS active */}
        {nearestFamille && nearestFamille.distanceKm !== undefined && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#C59A27]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={nearestFamille.bergerPhotoUrl}
                alt={nearestFamille.bergerNom}
                className="w-11 h-11 rounded-xl object-cover border-2 border-[#C59A27] shrink-0"
              />
              <div>
                <p className="font-bold text-white">
                  Famille la plus proche : <span className="text-[#F5DE98] font-black">{nearestFamille.nom}</span> ({nearestFamille.quartier})
                </p>
                <p className="text-slate-200 text-[11px]">
                  Berger : <strong>{nearestFamille.bergerPrenom} {nearestFamille.bergerNom}</strong> ({nearestFamille.bergerPhone}) • À <strong>{formatDistance(nearestFamille.distanceKm)}</strong> de votre position
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleReturnToGeolocation}
                className="px-3 py-1.5 rounded-lg bg-[#C59A27] hover:bg-[#E5B22F] text-slate-950 text-xs font-black transition-colors flex items-center gap-1 shadow-sm"
              >
                <Navigation className="w-3 h-3 text-slate-950" />
                <span>Ma géolocalisation</span>
              </button>
              <button
                type="button"
                onClick={() => openDetailModal(nearestFamille, 'berger')}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Fiche Berger
              </button>
              <button
                type="button"
                onClick={() => openDetailModal(nearestFamille, 'inscription')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SPOTLIGHT BANNER: LOCALITÉ PRÉ-INSCRITE SÉLECTIONNÉE OU TAPÉE */}
      {/* ========================================================================= */}
      {matchedPreInscrite && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0A3D36]/10 to-emerald-500/10 border-2 border-[#C59A27] shadow-xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#C59A27]/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C59A27] animate-ping" />
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Localité Pré-inscrite Détectée :{' '}
                <span className="text-[#0A3D36] uppercase">{matchedPreInscrite.quartier}</span>
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C59A27] text-slate-950">
              {matchedPreInscrite.commune}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Fenêtre Berger Spotlight */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
              <img
                src={matchedPreInscrite.bergerPhotoUrl}
                alt={matchedPreInscrite.bergerNom}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C59A27] shrink-0"
              />
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-black uppercase text-[#C59A27] tracking-wider block">
                  Berger Référent
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  {matchedPreInscrite.bergerPrenom} {matchedPreInscrite.bergerNom}
                </h4>
                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href={`tel:${matchedPreInscrite.bergerPhone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1 rounded-lg bg-[#0A3D36] text-white text-[11px] font-black flex items-center gap-1 hover:bg-[#135E54]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{matchedPreInscrite.bergerPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${matchedPreInscrite.bergerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour Berger ${matchedPreInscrite.bergerNom}, je vous contacte à propos de la cellule ${matchedPreInscrite.quartier}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                    title="WhatsApp direct"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Fenêtre Maison d'Accueil Spotlight */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
              <img
                src={
                  matchedPreInscrite.photoMaisonUrl ||
                  matchedPreInscrite.photoFamilleUrl ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
                }
                alt="Cadre maison"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shrink-0"
              />
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-black uppercase text-[#0A3D36] tracking-wider block">
                  Maison & Cadre d'Accueil
                </span>
                <p className="text-xs text-slate-800 font-bold line-clamp-1">
                  📍 {matchedPreInscrite.adresseRepere}
                </p>
                <button
                  type="button"
                  onClick={() => openDetailModal(matchedPreInscrite, 'hote_maison')}
                  className="text-[11px] text-[#C59A27] font-black hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  <span>Importer / Changer la photo</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Spotlight */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Membres inscrits :</span>
                <span className="font-black text-[#0A3D36]">
                  {matchedPreInscrite.membresInscritsCount} personnes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openDetailModal(matchedPreInscrite, 'photos_reunions')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-amber-50 text-[#0A3D36] border border-amber-200 text-[11px] font-black hover:bg-amber-100 flex items-center justify-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Photos Réunions</span>
                </button>
                <button
                  type="button"
                  onClick={() => openDetailModal(matchedPreInscrite, 'inscription')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-[#0A3D36] text-white text-[11px] font-black hover:bg-[#135E54] flex items-center justify-center gap-1 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#E5B22F]" />
                  <span>S'inscrire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEARCH & LOCALITÉS PRÉ-INSCRITES BAR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
        {/* Search input + Filters + Return to Geolocation Button */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tapez le nom d'une localité (ex: Fidjrossè, Cadjèhoun, Akpakpa, Calavi, Menontin...), nom du Berger ou Hôte..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A3D36] focus:bg-white transition-all font-medium text-slate-900"
            />
          </div>

          {/* Commune Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 shrink-0">Commune :</span>
            <select
              value={selectedCommune}
              onChange={e => setSelectedCommune(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            >
              {COMMUNES_LIST.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quartier Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 shrink-0">Quartier :</span>
            <select
              value={selectedQuartier}
              onChange={e => setSelectedQuartier(e.target.value)}
              className="px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            >
              {QUARTIERS_LIST.map(q => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Geolocation Return Button */}
          <button
            type="button"
            onClick={handleReturnToGeolocation}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm shrink-0 active:scale-95 ${
              userLocation
                ? 'bg-emerald-50 hover:bg-emerald-100 text-[#0A3D36] border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
            title="Revenir à ma position GPS et afficher les Familles les plus proches"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C59A27] animate-pulse" />
            <span>Revenir à ma géolocalisation</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cartes ({filteredFamilles.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Carte Interactive</span>
            </button>
          </div>
        </div>

        {/* LOCALITÉS PRÉ-INSCRITES CLIC RAPIDE */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Localités Pré-inscrites (Cliquez pour faire ressortir le Berger & la Maison) :</span>
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-500 hover:text-slate-900 underline"
              >
                Réinitialiser recherche
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {LOCALITES_PREINSCRITES.map(loc => {
              const isActive =
                searchQuery.toLowerCase() === loc.nom.toLowerCase() ||
                searchQuery.toLowerCase() === loc.quartier.toLowerCase();

              return (
                <button
                  key={loc.nom}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setSearchQuery('');
                    } else {
                      setSearchQuery(loc.nom);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs ${
                    isActive
                      ? 'bg-[#0A3D36] text-white ring-2 ring-[#C59A27]'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-slate-950'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isActive ? 'text-[#E5B22F]' : 'text-[#C59A27]'}`} />
                  <span>{loc.nom}</span>
                  <span className="text-[10px] opacity-75 font-normal">({loc.commune})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Bar with Return to Geolocation Button */}
        {(searchQuery || selectedCommune !== 'Toutes' || selectedQuartier !== 'Tous les quartiers') && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Filtres actifs :</span>
              {selectedCommune !== 'Toutes' && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  {selectedCommune}
                </span>
              )}
              {selectedQuartier !== 'Tous les quartiers' && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  {selectedQuartier}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  « {searchQuery} »
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={handleReturnToGeolocation}
              className="text-[#0A3D36] hover:text-[#C59A27] font-black text-xs flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#0A3D36]" />
              <span>Revenir à ma géolocalisation</span>
            </button>
          </div>
        )}
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C59A27]" />
              <span className="text-xs text-slate-800 font-bold">
                Mode Carte & Navigation GPS active ({filteredFamilles.length} foyers répertoriés)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className="px-3.5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>🔙 Retour à la plateforme (Vue Liste)</span>
              </button>
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Accueil</span>
                </button>
              )}
            </div>
          </div>

          <FamillesHonneurMap
            familles={filteredFamilles}
            selectedFamille={selectedFamilleForDetail}
            onSelectFamille={f => openDetailModal(f, 'berger')}
            userLocation={userLocation}
            onGetDirections={handleLaunchGps}
            onReturnToLocation={handleReturnToGeolocation}
            onReturnToPlatform={onBackToHome || (() => setViewMode('cards'))}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* CARDS VIEW MODE */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              Affichage de <strong>{filteredFamilles.length}</strong> Familles d'Honneur avec Berger & Maison
            </span>
            {userLocation && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Classées par proximité kilométrique
              </span>
            )}
          </div>

          {filteredFamilles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C59A27] flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Aucune Famille d'Honneur trouvée</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Aucun foyer ne correspond à vos critères de recherche pour le moment. Vous pouvez proposer votre propre foyer pour bénir votre quartier !
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0A3D36] text-white text-xs font-bold shadow-md hover:bg-[#135E54] transition-all"
              >
                Proposer ma Famille
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFamilles.map(famille => {
                const directionsUrl = getDirectionsUrl(
                  famille.latitude,
                  famille.longitude,
                  `${famille.nom} ${famille.quartier}`
                );

                const reunionPhotosCount = famille.photosReunions ? famille.photosReunions.length : 0;

                return (
                  <div
                    key={famille.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#C59A27]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Photo cover (Maison / Cadre d'accueil) */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={
                            famille.photoMaisonUrl ||
                            famille.photoFamilleUrl ||
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
                          }
                          alt={famille.nom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C59A27] text-slate-950 shadow-sm">
                            {famille.quartier}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A3D36]/90 text-white backdrop-blur border border-[#C59A27]/30">
                            {famille.commune}
                          </span>
                        </div>

                        {/* GPS Distance Badge */}
                        {famille.distanceKm !== undefined && (
                          <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 shadow-sm flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            <span>{formatDistance(famille.distanceKm)}</span>
                          </div>
                        )}

                        {/* Bottom Name & Photo Maison badge */}
                        <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-end justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-black uppercase text-[#F5DE98] tracking-wider block">
                              {famille.nomFamille}
                            </span>
                            <h3 className="text-sm font-black text-white leading-tight drop-shadow-sm truncate">
                              {famille.nom}
                            </h3>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-slate-200 border border-white/20 shrink-0 flex items-center gap-1">
                            <Home className="w-3 h-3 text-[#C59A27]" />
                            <span>Maison</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3.5">
                        {/* 1. FENÊTRE BERGER CARD SNIPPET */}
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-50 border border-amber-200/80 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <img
                                src={famille.bergerPhotoUrl}
                                alt={famille.bergerNom}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-[#C59A27] shrink-0"
                              />
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0A3D36] text-[#C59A27] flex items-center justify-center text-[9px] font-black">
                                B
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase text-[#C59A27] tracking-wider block">
                                Berger
                              </span>
                              <h4 className="text-xs font-black text-slate-900 leading-tight">
                                {famille.bergerPrenom} {famille.bergerNom}
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                {famille.bergerPhone}
                              </p>
                            </div>
                          </div>

                          {/* Fast Contact Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`tel:${famille.bergerPhone.replace(/\s+/g, '')}`}
                              className="p-1.5 rounded-lg bg-[#0A3D36] text-white hover:bg-[#135E54] transition-colors"
                              title="Appeler le Berger"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${famille.bergerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour Berger ${famille.bergerNom}, je vous contacte à propos de la Famille d'Honneur ${famille.nom} à ${famille.quartier}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                              title="WhatsApp Berger"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Location address */}
                        <div className="text-xs text-slate-600 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C59A27] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong>Repère :</strong> {famille.adresseRepere}
                          </span>
                        </div>

                        {/* Schedule info */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C59A27]" />
                            {famille.rencontreFrequence}
                          </span>
                          <span className="font-bold text-[#0A3D36]">
                            {famille.rencontreHeure}
                          </span>
                        </div>

                        {/* Hôte & Photos counters */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                famille.hotePhotoUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                              }
                              alt={famille.hoteNom}
                              className="w-6 h-6 rounded-full object-cover border border-[#C59A27]/40"
                            />
                            <span className="text-[11px] text-slate-700 font-bold">
                              Hôte : {famille.hotePrenom}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <button
                              type="button"
                              onClick={() => openDetailModal(famille, 'photos_reunions')}
                              className="flex items-center gap-1 text-slate-600 hover:text-[#0A3D36] font-semibold"
                              title="Voir les photos de réunions"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                              <span>{reunionPhotosCount} photo{reunionPhotosCount > 1 ? 's' : ''}</span>
                            </button>
                            <span className="font-bold text-[#0A3D36]">
                              {famille.membresInscritsCount} membres
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openDetailModal(famille, 'berger')}
                          className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors text-center flex items-center justify-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0A3D36]" />
                          <span>Berger & Fiche</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openDetailModal(famille, 'photos_reunions')}
                          className="py-2 px-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
                          title="Publier ou voir photos de famille après réunion"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span className="hidden sm:inline">Photos</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleLaunchGps(famille)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-700 hover:text-[#0A3D36] transition-colors"
                          title="Lancer itinéraire GPS dans Google Maps"
                        >
                          <Navigation className="w-4 h-4 text-[#C59A27]" />
                        </button>
                      </div>

                      {/* Prominent S'inscrire button */}
                      <button
                        type="button"
                        onClick={() => openDetailModal(famille, 'inscription')}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#135E54] hover:to-[#0A3D36] text-white text-xs font-black shadow-sm hover:scale-101 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4 text-[#E5B22F]" />
                        <span>S'inscrire comme membre dans cette famille</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {selectedFamilleForDetail && (
        <FamilleDetailModal
          famille={selectedFamilleForDetail}
          currentUser={currentUser}
          inscriptions={inscriptions}
          initialTab={detailModalInitialTab}
          onClose={() => setSelectedFamilleForDetail(null)}
          onJoin={f => setSelectedFamilleForJoin(f)}
          onLaunchGps={handleLaunchGps}
          onUpdateFamille={updated => {
            onSaveFamille(updated);
            setSelectedFamilleForDetail(updated);
          }}
          onAddInscription={inscription => {
            onSaveInscription(inscription);
          }}
        />
      )}

      {selectedFamilleForJoin && (
        <JoinFamilleModal
          famille={selectedFamilleForJoin}
          currentUser={currentUser}
          onClose={() => setSelectedFamilleForJoin(null)}
          onSubmit={inscription => {
            onSaveInscription(inscription);
          }}
        />
      )}

      {isProposeModalOpen && (
        <ProposeFamilleModal
          currentUser={currentUser}
          onClose={() => setIsProposeModalOpen(false)}
          onSubmit={famille => {
            onSaveFamille(famille);
          }}
        />
      )}

      {/* Floating Quick Action Button: Revenir à ma géolocalisation */}
      <button
        type="button"
        onClick={handleReturnToGeolocation}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-2xl border-2 border-[#C59A27] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all backdrop-blur-md group"
        title="Revenir immédiatement à ma position GPS et aux Familles les plus proches"
      >
        <div className="w-7 h-7 rounded-xl bg-[#C59A27] text-slate-950 flex items-center justify-center font-black shrink-0 group-hover:rotate-12 transition-transform">
          <Navigation className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5 font-black text-white">
            <span>Revenir à ma géolocalisation</span>
            <span
              className={`w-2 h-2 rounded-full ${userLocation ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}
            />
          </div>
          {nearestFamille && nearestFamille.distanceKm !== undefined ? (
            <span className="text-[10px] text-amber-200 font-bold block">
              Plus proche : {nearestFamille.quartier} ({formatDistance(nearestFamille.distanceKm)})
            </span>
          ) : (
            <span className="text-[10px] text-slate-300 font-medium block">
              Cotonou, Calavi, Sèmè
            </span>
          )}
        </div>
      </button>

      {/* Floating Feedback Notice Toast */}
      {recenterNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#0A3D36]/95 text-white border border-[#C59A27] text-xs font-black shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
          <Navigation className="w-4 h-4 text-[#E5B22F] animate-pulse" />
          <span>{recenterNotice}</span>
        </div>
      )}
    </div>
  );
};
