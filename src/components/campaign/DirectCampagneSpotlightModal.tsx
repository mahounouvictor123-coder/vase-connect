import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Share2,
  Copy,
  Check,
  HeartHandshake,
  Shield,
  Apple,
  Stethoscope,
  GraduationCap,
  Home,
  Briefcase,
  Shirt,
  HelpCircle,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';
import { CoeurCampagneAide, AideCategory } from '../../types';

interface DirectCampagneSpotlightModalProps {
  campagne: CoeurCampagneAide;
  onClose: () => void;
  onRequestHelp: (campagne: CoeurCampagneAide) => void;
  onDonate: (campagne: CoeurCampagneAide) => void;
}

export const DirectCampagneSpotlightModal: React.FC<DirectCampagneSpotlightModalProps> = ({
  campagne,
  onClose,
  onRequestHelp,
  onDonate,
}) => {
  const [copied, setCopied] = useState(false);

  const getCategoryIcon = (cat: AideCategory) => {
    switch (cat) {
      case 'ALIMENTATION':
        return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'SANTE':
        return <Stethoscope className="w-4 h-4 text-rose-600" />;
      case 'SCOLARITE':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'LOGEMENT':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'EMPLOI_MICROPROJET':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'SOUTIEN_MORAL_PRIERE':
        return <HeartHandshake className="w-4 h-4 text-pink-600" />;
      case 'VESTIMENTAIRE':
        return <Shirt className="w-4 h-4 text-indigo-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const pct = campagne.objectifFinancier
    ? Math.min(100, Math.round(((campagne.fondsCollectes || 0) / campagne.objectifFinancier) * 100))
    : 0;

  const campaignShareUrl = `${window.location.origin}${window.location.pathname}?tab=coeur_honneur&campagne=${campagne.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text =
      `🕊️ *ÉGLISE PORTE DES CIEUX — LE CŒUR D’HONNEUR*\n\n` +
      `Frère / Sœur bien-aimé(e),\n` +
      `Voici l'accès direct officiel à la campagne de bienfaisance :\n` +
      `*${campagne.titre}*\n\n` +
      `📖 *Description :* ${campagne.description}\n` +
      `🎯 *Bénéficiaires :* ${campagne.beneficiairesCibles}\n\n` +
      `🤲 *Si vous êtes dans le besoin ou souhaitez apporter votre soutien (don) :*\n` +
      `👉 ${campaignShareUrl}\n\n` +
      `« Portez les fardeaux les uns des autres » (Galates 6:2)`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-rose-100 my-auto flex flex-col max-h-[92vh]">
        {/* Top Banner Header */}
        <div className="bg-gradient-to-r from-[#3b0d18] via-[#541424] to-[#1a070c] p-4 sm:p-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <Heart className="w-5 h-5 fill-rose-400 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Campagne Officielle • Cœur d'Honneur</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                Action Fraternelle & Entraide
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Image & Category */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src={campagne.imageBannerUrl}
              alt={campagne.titre}
              className="w-full h-44 sm:h-52 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-slate-800 text-[11px] font-black shadow-md backdrop-blur-xs">
              {getCategoryIcon(campagne.categorie)}
              <span>{campagne.categorie}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-[9px] font-black uppercase mb-1">
                Campagne Ouverte & Active
              </div>
              <h2 className="text-base sm:text-lg font-black drop-shadow-sm leading-snug">
                {campagne.titre}
              </h2>
            </div>
          </div>

          {/* Description & Targets */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 text-rose-950 font-medium">
              « {campagne.description} »
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C59A27] shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Bénéficiaires cibles</p>
                  <p className="font-semibold text-slate-800 line-clamp-1">{campagne.beneficiairesCibles}</p>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Objectif visé</p>
                  <p className="font-semibold text-slate-800 line-clamp-1">{campagne.objectifQuantite || 'Non spécifié'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress / Objective */}
          {campagne.objectifFinancier && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Fonds Mobilisés :</span>
                <span className="font-black text-emerald-800">
                  {(campagne.fondsCollectes || 0).toLocaleString('fr-FR')} FCFA / {campagne.objectifFinancier.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-amber-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C59A27] to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>{pct}% collecté</span>
                <span>{campagne.nombreAidesAccordees} aides déjà distribuées</span>
              </div>
            </div>
          )}

          {/* Privacy & Pastoral Care note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Votre démarche est 100% confidentielle, traitée par la Diaconie du Pasteur Mohammed Sanogo.
            </span>
          </div>

          {/* PRIMARY CALL TO ACTIONS */}
          <div className="space-y-2.5 pt-1">
            {/* ACTION 1: DEMANDE D'AIDE */}
            <button
              onClick={() => onRequestHelp(campagne)}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#541424] to-[#781830] hover:from-[#3b0d18] hover:to-[#541424] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <HeartHandshake className="w-4 h-4 text-[#E5B22F] group-hover:scale-110 transition-transform" />
              <span>Je suis dans le besoin : Renseigner ma demande d’aide</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* ACTION 2: DONATION */}
            <button
              onClick={() => onDonate(campagne)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-xs rounded-2xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>🤝 Soutenir financièrement cette campagne (Faire un Don)</span>
            </button>
          </div>

          {/* SECONDARY SHARE BUTTONS */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-black">Lien Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Copier le Lien</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Partager WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
