import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Users, Calendar, Phone, Heart } from 'lucide-react';
import { FamilleHonneur } from '../types';
import { getDirectionsUrl, formatDistance } from '../data/famillesHonneurData';

interface FamillesHonneurMapProps {
  familles: FamilleHonneur[];
  selectedFamille: FamilleHonneur | null;
  onSelectFamille: (famille: FamilleHonneur) => void;
  userLocation: { latitude: number; longitude: number } | null;
  onGetDirections: (famille: FamilleHonneur) => void;
  onReturnToLocation?: () => void;
  onReturnToPlatform?: () => void;
}

export const FamillesHonneurMap: React.FC<FamillesHonneurMapProps> = ({
  familles,
  selectedFamille,
  onSelectFamille,
  userLocation,
  onGetDirections,
  onReturnToLocation,
  onReturnToPlatform,
}) => {
  // Cotonou Map Bounds approx
  // Min Lat: 6.34, Max Lat: 6.46
  // Min Lon: 2.32, Max Lon: 2.60
  const minLat = 6.34;
  const maxLat = 6.46;
  const minLon = 2.32;
  const maxLon = 2.60;

  const getCoordinatesPercent = (lat: number, lon: number) => {
    // Normalization to 5% - 95%
    const x = ((lon - minLon) / (maxLon - minLon)) * 88 + 6;
    const y = 92 - ((lat - minLat) / (maxLat - minLat)) * 84;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#0A3D36]/20 bg-slate-900 shadow-md">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs">
        <Compass className="w-3.5 h-3.5 text-[#C59A27] animate-spin-slow" />
        <span className="font-bold">Carte Interactive • Cotonou & Environs</span>
        <span className="text-[10px] text-slate-300">({familles.length} Familles répertoriées)</span>
      </div>

      <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center justify-end gap-2">
        {onReturnToPlatform && (
          <button
            type="button"
            onClick={onReturnToPlatform}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300 text-[11px] font-black shadow-lg transition-all hover:scale-105 active:scale-95"
            title="Revenir au menu principal ou à la liste de la plateforme"
          >
            <span>🔙 Retour à la plateforme</span>
          </button>
        )}
        {userLocation && (
          <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-200 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Position GPS active</span>
          </div>
        )}
        {onReturnToLocation && (
          <button
            type="button"
            onClick={onReturnToLocation}
            className="flex items-center gap-1.5 bg-[#0A3D36] hover:bg-[#135E54] text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C59A27]/60 text-[11px] font-black shadow-lg transition-all hover:scale-105 active:scale-95"
            title="Revenir à ma position GPS et ma Famille la plus proche"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E5B22F] animate-pulse" />
            <span>Revenir à ma géolocalisation</span>
          </button>
        )}
      </div>

      {/* SVG Canvas Map Background representing Coast & Lagoon */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 overflow-hidden select-none">
        {/* Abstract Lagoon / Water / Roads Representation */}
        <svg className="w-full h-full absolute inset-0 opacity-30 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 500">
          {/* Lake Nokoué top right */}
          <path d="M 450 0 C 480 80, 600 120, 750 100 L 800 0 Z" fill="#0284c7" opacity="0.35" />
          {/* Cotonou Lagoon Channel */}
          <path d="M 520 100 Q 510 240, 560 380 Q 570 440, 580 500" stroke="#0284c7" strokeWidth="18" fill="none" opacity="0.4" />
          {/* Atlantic Ocean along bottom */}
          <path d="M 0 450 Q 300 440, 800 460 L 800 500 L 0 500 Z" fill="#0369a1" opacity="0.45" />
          {/* Main Highway Inter-États */}
          <path d="M 100 80 Q 350 200, 540 330 Q 650 370, 800 370" stroke="#475569" strokeWidth="6" strokeDasharray="4 4" fill="none" />
          {/* Coastal Road (Route des Pêches / Marina) */}
          <path d="M 0 430 Q 300 420, 550 430" stroke="#64748b" strokeWidth="4" fill="none" />
        </svg>

        {/* Major District Landmarks Labels */}
        <div className="absolute left-[12%] top-[35%] text-[10px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
          Abomey-Calavi
        </div>
        <div className="absolute left-[14%] top-[55%] text-[10px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
          Godomey
        </div>
        <div className="absolute left-[20%] bottom-[16%] text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
          Fidjrossè Plage
        </div>
        <div className="absolute left-[44%] bottom-[22%] text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
          Cadjèhoun / Haie Vive
        </div>
        <div className="absolute right-[28%] bottom-[28%] text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">
          Akpakpa Dodomè
        </div>
        <div className="absolute right-[8%] top-[40%] text-[10px] font-black text-slate-500 uppercase tracking-widest pointer-events-none">
          Sèmè-Kpodji
        </div>
        <div className="absolute right-[20%] bottom-[8%] text-[10px] font-black text-sky-400/60 uppercase tracking-widest pointer-events-none">
          Océan Atlantique 🌊
        </div>

        {/* User GPS Pin on Map */}
        {userLocation && (() => {
          const userPos = getCoordinatesPercent(userLocation.latitude, userLocation.longitude);
          return (
            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping" />
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-lg border-2 border-white text-[10px]">
                  📍
                </div>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded-md bg-emerald-900 text-white text-[10px] font-bold whitespace-nowrap shadow-md">
                Vous êtes ici
              </div>
            </div>
          );
        })()}

        {/* Familles Pins */}
        {familles.map(famille => {
          const pos = getCoordinatesPercent(famille.latitude, famille.longitude);
          const isSelected = selectedFamille?.id === famille.id;

          return (
            <div
              key={famille.id}
              onClick={() => onSelectFamille(famille)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin Circle */}
                <div
                  className={`relative flex items-center justify-center rounded-2xl shadow-xl transition-all duration-300 ${
                    isSelected
                      ? 'w-10 h-10 bg-gradient-to-br from-[#C59A27] to-[#E5B22F] text-slate-950 ring-4 ring-white/50 scale-125'
                      : 'w-8 h-8 bg-gradient-to-br from-[#0A3D36] to-[#135E54] text-[#E5B22F] hover:scale-115 hover:bg-[#C59A27] border border-[#C59A27]/50'
                  }`}
                >
                  <Users className={`${isSelected ? 'w-5 h-5 text-slate-950' : 'w-4 h-4 text-[#E5B22F]'}`} />

                  {/* Pulsing ring on selected */}
                  {isSelected && (
                    <span className="absolute -inset-1 rounded-2xl border-2 border-[#C59A27] animate-ping" />
                  )}
                </div>

                {/* Pin Label */}
                <div
                  className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#C59A27] text-slate-950 font-black'
                      : 'bg-slate-900/90 text-white border border-white/10 group-hover:border-[#C59A27]'
                  }`}
                >
                  {famille.quartier}
                  {famille.distanceKm !== undefined && (
                    <span className="ml-1 text-[9px] text-[#0A3D36] font-bold">
                      • {formatDistance(famille.distanceKm)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Famille Bottom Drawer Overlay on Map */}
      {selectedFamille && (
        <div className="relative z-20 bg-slate-900/95 backdrop-blur-md border-t border-[#C59A27]/40 p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-[#C59A27]/40">
              <img
                src={selectedFamille.photoFamilleUrl || selectedFamille.hotePhotoUrl}
                alt={selectedFamille.nom}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C59A27] text-slate-950">
                  {selectedFamille.quartier}
                </span>
                <span className="text-[11px] text-slate-400">{selectedFamille.commune}</span>
                {selectedFamille.distanceKm !== undefined && (
                  <span className="text-[11px] text-emerald-400 font-black flex items-center gap-0.5">
                    <Navigation className="w-3 h-3" />
                    {formatDistance(selectedFamille.distanceKm)}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-black text-white truncate">
                {selectedFamille.nom} ({selectedFamille.nomFamille})
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                📍 {selectedFamille.adresseRepere}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
            {onReturnToPlatform && (
              <button
                type="button"
                onClick={onReturnToPlatform}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
                title="Revenir à la plateforme"
              >
                <span>🔙 Retour à la plateforme</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onGetDirections(selectedFamille)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#135E54] hover:to-[#0A3D36] text-white text-xs font-bold flex items-center gap-1.5 border border-[#C59A27]/40 shadow-sm transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Itinéraire GPS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
