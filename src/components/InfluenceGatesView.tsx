import React, { useState, useMemo } from 'react';
import {
  Church,
  GraduationCap,
  Scale,
  Landmark,
  Vote,
  Radio,
  Sprout,
  Coins,
  Truck,
  Palette,
  HeartPulse,
  ShieldAlert,
  Users,
  Sparkles,
  Search,
  PlusCircle,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Phone,
  CheckCircle2,
  Award,
  BookOpen,
  Filter,
  UserCheck,
  Building,
  Target,
  Globe
} from 'lucide-react';
import { InfluenceGateId, InfluenceGate, GateMemberProfile, UserProfile } from '../types';
import { INFLUENCE_GATES } from '../data/influenceGatesData';
import { GateRegistrationModal } from './GateRegistrationModal';

interface InfluenceGatesViewProps {
  currentUser: UserProfile | null;
  gateMembers: GateMemberProfile[];
  initialGateId?: InfluenceGateId;
  onSaveGateProfile: (profile: GateMemberProfile) => void;
  onOpenAuth: () => void;
  onBackToHome?: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

const GATE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Church,
  GraduationCap,
  Scale,
  Landmark,
  Vote,
  Radio,
  Sprout,
  Coins,
  Truck,
  Palette,
  HeartPulse,
  ShieldAlert
};

export const InfluenceGatesView: React.FC<InfluenceGatesViewProps> = ({
  currentUser,
  gateMembers,
  initialGateId,
  onSaveGateProfile,
  onOpenAuth,
  onBackToHome,
  onOpenAssistantWithPrompt,
}) => {
  const [selectedGateId, setSelectedGateId] = useState<InfluenceGateId | null>(initialGateId || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubSector, setSelectedSubSector] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Active gate object if one is selected
  const activeGate = useMemo(() => {
    if (!selectedGateId) return null;
    return INFLUENCE_GATES.find(g => g.id === selectedGateId) || INFLUENCE_GATES[0];
  }, [selectedGateId]);

  // Current user's profile in the active gate (if any)
  const currentUserGateProfile = useMemo(() => {
    if (!currentUser || !activeGate) return null;
    return gateMembers.find(
      gm => gm.userId === currentUser.id && gm.gateId === activeGate.id
    ) || null;
  }, [currentUser, activeGate, gateMembers]);

  // Filtered members in current gate
  const filteredMembers = useMemo(() => {
    if (!activeGate) return [];
    return gateMembers.filter(m => {
      if (m.gateId !== activeGate.id) return false;

      if (selectedSubSector !== 'ALL' && m.subSector !== selectedSubSector) {
        return false;
      }

      if (selectedRoleFilter !== 'ALL') {
        if (selectedRoleFilter === 'MENTOR' && !m.openForMentoring) return false;
        if (selectedRoleFilter === 'COLLAB' && !m.seekingCollaboration) return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          m.memberName.toLowerCase().includes(q) ||
          m.memberProfession.toLowerCase().includes(q) ||
          m.organization?.toLowerCase().includes(q) ||
          m.subSector.toLowerCase().includes(q) ||
          m.visionImpact.toLowerCase().includes(q) ||
          m.skills.some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [activeGate, gateMembers, selectedSubSector, selectedRoleFilter, searchTerm]);

  // Count of members per gate
  const gateMemberCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    INFLUENCE_GATES.forEach(g => {
      counts[g.id] = gateMembers.filter(m => m.gateId === g.id).length;
    });
    return counts;
  }, [gateMembers]);

  const handleSelectGate = (gateId: InfluenceGateId) => {
    setSelectedGateId(gateId);
    setSelectedSubSector('ALL');
    setSelectedRoleFilter('ALL');
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePrevious = () => {
    if (!activeGate) return;
    const currentIndex = INFLUENCE_GATES.findIndex(g => g.id === activeGate.id);
    const prevIndex = (currentIndex - 1 + INFLUENCE_GATES.length) % INFLUENCE_GATES.length;
    handleSelectGate(INFLUENCE_GATES[prevIndex].id);
  };

  const handleNavigateNext = () => {
    if (!activeGate) return;
    const currentIndex = INFLUENCE_GATES.findIndex(g => g.id === activeGate.id);
    const nextIndex = (currentIndex + 1) % INFLUENCE_GATES.length;
    handleSelectGate(INFLUENCE_GATES[nextIndex].id);
  };

  const handleWhatsAppContact = (phone?: string, memberName?: string, gateName?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Bonjour bien-aimé(e) ${memberName || ''}, je vous contacte depuis la plateforme Vases Connect suite à votre inscription dans la porte d'influence « ${gateName || ''} ». J'aimerais échanger avec vous pour une synergie dans le Royaume.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-28 space-y-6 text-slate-800">
      {/* Top Breadcrumb / Return */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#0A3D36] text-xs font-bold transition-all border border-slate-200 shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>← Accueil</span>
            </button>
          )}
          {selectedGateId && (
            <button
              type="button"
              onClick={() => setSelectedGateId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] text-xs font-bold transition-all border border-amber-200 active:scale-95"
            >
              <span>Vue d'ensemble des 12 Portes</span>
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <Sparkles className="w-4 h-4 text-[#C59A27]" />
          <span>Livre du <strong>Pasteur Mohammed Sanogo</strong></span>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-6 sm:p-8 shadow-xl border border-[#C59A27]/30">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#C59A27]/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Ouvrage Apostolique • MOHAMMED SANOGO</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              <span className="text-[#C6DA28] block sm:inline">12 PORTES D'INFLUENCE</span>{' '}
              <span className="text-white block sm:inline font-extrabold text-xl sm:text-3xl lg:text-4xl">
                POUR TRANSFORMER UNE NATION
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              D'après le livre apostolique du <strong>Pasteur Mohammed Sanogo</strong> : « <em>12 Portes d'Influence pour Transformer une Nation</em> ». Les chrétiens sont appelés à sortir de l'isolement religieux pour investir, sanctifier et exceller dans les 12 domaines clés de la société afin de transformer notre nation pour la gloire de Dieu.
            </p>

            {/* Quick Counter Stats */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <span className="text-[#C59A27] font-black text-sm">12</span>
                <span>Portes d'Activité</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                <Users className="w-4 h-4 text-[#C59A27]" />
                <span><strong>{gateMembers.length}</strong> Frères & Sœurs engagés</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) onOpenAuth();
                  else setIsRegisterModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#C59A27] hover:bg-[#D4A936] text-[#0A3D36] font-black shadow-md transition-transform hover:scale-102 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>S'inscrire à une Porte</span>
              </button>
            </div>
          </div>

          {/* Book Cover Graphical Visual Badge */}
          <div className="shrink-0 w-44 sm:w-52 bg-[#231221] rounded-2xl p-3 shadow-2xl border-2 border-[#C59A27]/50 text-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="pt-2 pb-1 border-b border-white/10">
              <div className="text-[13px] font-black tracking-tighter text-[#C6DA28] uppercase leading-tight">
                12 PORTES
              </div>
              <div className="text-[11px] font-black tracking-tight text-[#C6DA28] uppercase">
                D'INFLUENCE
              </div>
              <div className="text-[7.5px] font-bold text-white tracking-widest uppercase mt-0.5">
                <span className="text-[#C6DA28]">POUR</span> TRANSFORMER
              </div>
              <div className="text-[10px] font-black tracking-tighter text-[#C6DA28] uppercase">
                UNE NATION
              </div>
            </div>

            {/* Earth illustration representation */}
            <div className="my-2.5 px-2 py-2 bg-gradient-to-b from-[#1C2C38] to-[#121A22] rounded-xl border border-white/10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E5D8B] via-[#48A25D] to-[#2B7AA3] flex items-center justify-center shadow-inner border border-white/30 relative">
                <Globe className="w-10 h-10 text-white/90" />
              </div>
              <span className="text-[8px] text-amber-200/80 font-bold uppercase tracking-wider mt-1">
                Sphères d'impact
              </span>
            </div>

            <div className="pt-1 border-t border-white/10">
              <div className="text-[9px] font-black tracking-widest text-[#E5B22F] uppercase">
                MOHAMMED SANOGO
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Gate Switcher Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Explorer les 12 Portes d'Influence :
          </span>
          {selectedGateId && (
            <button
              onClick={() => setSelectedGateId(null)}
              className="text-xs text-[#0A3D36] font-bold hover:underline"
            >
              Voir la grille complète
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedGateId(null)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedGateId === null
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Toutes les 12 portes</span>
          </button>

          {INFLUENCE_GATES.map((gate) => {
            const Icon = GATE_ICONS[gate.iconName] || Church;
            const isSelected = selectedGateId === gate.id;
            const count = gateMemberCounts[gate.id] || 0;

            return (
              <button
                key={gate.id}
                type="button"
                onClick={() => handleSelectGate(gate.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0A3D36] text-white shadow-md ring-2 ring-[#C59A27]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                  isSelected ? 'bg-[#C59A27] text-[#0A3D36]' : 'bg-slate-200 text-slate-700'
                }`}>
                  {gate.number}
                </div>
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{gate.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: OVERVIEW GRID OF ALL 12 GATES */}
      {selectedGateId === null && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#0A3D36]">
                Les 12 Fenêtres d'Activité Apostolique
              </h2>
              <p className="text-xs text-slate-500">
                Cliquez sur une porte pour explorer ses visionnaires, ses sous-domaines et y inscrire votre profil.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenAssistantWithPrompt("Aide-moi à identifier dans quelle porte d'influence je dois m'inscrire selon mon métier et mes compétences.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] text-xs font-bold border border-amber-200 self-start"
            >
              <Sparkles className="w-4 h-4 text-[#C59A27]" />
              <span>Demander conseil à l'Assistant IA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INFLUENCE_GATES.map((gate) => {
              const Icon = GATE_ICONS[gate.iconName] || Church;
              const count = gateMemberCounts[gate.id] || 0;
              const isUserEnrolled = currentUser && gateMembers.some(
                m => m.userId === currentUser.id && m.gateId === gate.id
              );

              return (
                <div
                  key={gate.id}
                  onClick={() => handleSelectGate(gate.id)}
                  className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#0A3D36]/40"
                >
                  <div className="p-5 space-y-3.5">
                    {/* Top line with gate number & enrolled badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#0A3D36] text-[#C59A27] font-black text-sm flex items-center justify-center shadow-xs">
                          {gate.number}
                        </span>
                        <div className="p-1.5 rounded-lg bg-slate-100 text-[#0A3D36] group-hover:bg-[#0A3D36] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {isUserEnrolled && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Inscrit(e)</span>
                        </span>
                      )}
                    </div>

                    {/* Gate Title & Subtitle */}
                    <div>
                      <h3 className="font-black text-lg text-[#0A3D36] group-hover:text-[#135E54] transition-colors">
                        {gate.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {gate.subTitle}
                      </p>
                    </div>

                    {/* Apostolic Vision Excerpt */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      « {gate.apostolicVision} »
                    </p>

                    {/* Biblical archetype & reference */}
                    <div className="text-[11px] text-[#C59A27] font-bold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{gate.biblicalExample}</span>
                    </div>

                    {/* Key Sectors Preview */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {gate.keySubSectors.slice(0, 3).map((sub, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg truncate max-w-[200px]"
                        >
                          {sub}
                        </span>
                      ))}
                      {gate.keySubSectors.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                          +{gate.keySubSectors.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <Users className="w-4 h-4 text-[#0A3D36]" />
                      <span>{count} {count > 1 ? 'membres inscrits' : 'membre inscrit'}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[#0A3D36] font-black group-hover:translate-x-1 transition-transform">
                      <span>Ouvrir la fenêtre</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DETAILED WINDOW FOR THE SELECTED GATE ("FENÊTRE D'ACTIVITÉ") */}
      {selectedGateId !== null && activeGate && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Gate Window Header & Navigation */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Thematic Top Header */}
            <div className="bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#C59A27] text-[#0A3D36] text-xs font-black uppercase tracking-wider shadow-xs">
                      Porte {activeGate.number} sur 12
                    </span>
                    <span className="text-xs text-amber-200 font-bold">
                      Modèle biblique : {activeGate.biblicalExample}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white">
                    {activeGate.name}
                  </h2>
                  <p className="text-sm text-slate-200 font-light">
                    {activeGate.subTitle}
                  </p>
                </div>

                {/* Next / Previous Gate Quick Jump */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleNavigatePrevious}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 active:scale-95"
                    title="Porte précédente"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNavigateNext}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/20 active:scale-95"
                    title="Porte suivante"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Biblical scripture quote */}
              <div className="mt-5 p-3.5 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-xs text-xs text-slate-200 space-y-1">
                <p className="font-black text-[#F5DE98] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ancrage biblique :</span>
                </p>
                <p className="italic leading-relaxed">{activeGate.scriptureReference}</p>
              </div>
            </div>

            {/* Apostolic Teaching Block */}
            <div className="p-6 bg-amber-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C59A27] block">
                  L'Enseignement du Pasteur Mohammed Sanogo pour cette Porte :
                </span>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  « {activeGate.apostolicVision} »
                </p>
              </div>

              {/* User registration status & CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                {currentUserGateProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Mon profil dans cette Porte (Modifier)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) onOpenAuth();
                      else setIsRegisterModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 hover:scale-102 active:scale-95 transition-all"
                  >
                    <PlusCircle className="w-4 h-4 text-[#C59A27]" />
                    <span>Rejoindre cette Porte & Définir mon Profil</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sub-sectors explorer for this gate */}
            <div className="p-5 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Filtrer par sous-secteur d'activité :
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSubSector('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubSector === 'ALL'
                      ? 'bg-[#0A3D36] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Tous ({gateMembers.filter(m => m.gateId === activeGate.id).length})
                </button>
                {activeGate.keySubSectors.map((sector, idx) => {
                  const countInSector = gateMembers.filter(
                    m => m.gateId === activeGate.id && m.subSector === sector
                  ).length;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSubSector(sector)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSubSector === sector
                          ? 'bg-[#0A3D36] text-white shadow-xs ring-1 ring-[#C59A27]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{sector}</span>
                      {countInSector > 0 && (
                        <span className="ml-1.5 text-[10px] opacity-75 font-semibold">({countInSector})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un frère, métier, compétence..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:border-[#0A3D36]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Type :</span>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('ALL')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 ${
                  selectedRoleFilter === 'ALL'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('MENTOR')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 ${
                  selectedRoleFilter === 'MENTOR'
                    ? 'bg-[#0A3D36] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Disposés au Mentorat
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoleFilter('COLLAB')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 ${
                  selectedRoleFilter === 'COLLAB'
                    ? 'bg-[#0A3D36] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ouverts aux Partenariats
              </button>
            </div>
          </div>

          {/* Members List in this Gate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0A3D36] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C59A27]" />
                <span>
                  Chrétiens d'Impact dans la Porte « {activeGate.name} » ({filteredMembers.length})
                </span>
              </h3>

              <button
                type="button"
                onClick={() => onOpenAssistantWithPrompt(`Présente-moi les profils chrétiens les plus pertinents inscrits dans la porte ${activeGate.name} et comment collaborer avec eux.`)}
                className="text-xs font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Consulter avec l'IA</span>
              </button>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C59A27] flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h4 className="font-black text-[#0A3D36] text-lg">
                  Soyez le premier à inscrire votre profil dans cette porte !
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Aucun membre ne correspond encore à ces critères. Saisissez cette opportunité pour vous positionner et manifester la lumière du Royaume dans {activeGate.name}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else setIsRegisterModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md"
                >
                  Définir mon profil maintenant
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3.5"
                  >
                    {/* Header: Photo + Name + Role */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={member.memberPhoto}
                        alt={member.memberName}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-[#C59A27]/40 shrink-0 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-black text-sm text-[#0A3D36] truncate">
                            {member.memberName}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Porte {activeGate.number}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {member.memberProfession}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          {member.organization && (
                            <>
                              <Building className="w-3 h-3 shrink-0 text-slate-400" />
                              <span className="font-medium text-slate-600">{member.organization}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>📍 {member.memberCity}</span>
                        </p>
                      </div>
                    </div>

                    {/* Role in gate & sub-sector */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-[#0A3D36] font-bold border border-amber-200">
                        {member.roleInGate}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                        {member.subSector}
                      </span>
                    </div>

                    {/* Christian vision & impact statement */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#C59A27] block">
                        Mandat & Vision d'impact chrétien :
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        « {member.visionImpact} »
                      </p>
                    </div>

                    {/* Skills pills */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 5).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-semibold bg-emerald-50 text-[#0A3D36] px-2 py-0.5 rounded-lg border border-emerald-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Badges for Mentoring & Collaboration */}
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                      {member.openForMentoring && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Disposé(e) au mentorat</span>
                        </span>
                      )}
                      {member.seekingCollaboration && (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>Ouvert(e) aux partenariats</span>
                        </span>
                      )}
                    </div>

                    {/* Contact Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Inscrit(e) le {new Date(member.registeredAt).toLocaleDateString('fr-FR')}
                      </span>

                      <div className="flex items-center gap-2">
                        {member.whatsappContact && (
                          <button
                            type="button"
                            onClick={() => handleWhatsAppContact(member.whatsappContact, member.memberName, activeGate.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs active:scale-95 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                        {member.memberPhone && (
                          <a
                            href={`tel:${member.memberPhone}`}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A3D36] transition-colors"
                            title="Appeler"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Registration Modal */}
      {isRegisterModalOpen && (
        <GateRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          selectedGateId={selectedGateId || 'croyance_coutume'}
          currentUser={currentUser}
          existingProfile={currentUserGateProfile}
          onSaveProfile={(profile) => {
            onSaveGateProfile(profile);
            setIsRegisterModalOpen(false);
          }}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
};
