import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Crown,
  Phone,
  MessageSquare,
  MapPin,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Shield,
  BookOpen,
  Filter,
  UserCheck,
  UserX,
  AlertTriangle,
  Award,
  Flame,
  Sun,
  Crown as CrownIcon
} from 'lucide-react';
import { CultePresenceRecord, CulteServiceType, RapportSoumis, RapportTemplate, TribeId, TribeInfo, TribeMember, TribeRole, UserProfile } from '../types';
import { INITIAL_TRIBES } from '../data/tribesData';
import { TribeRegistrationModal } from './TribeRegistrationModal';
import { LeadershipGuardModal } from './LeadershipGuardModal';
import { CreateSendReportModal } from './CreateSendReportModal';
import { LeadershipAccount } from '../data/leadershipData';
import { Lock, FileText, Send } from 'lucide-react';
import {
  computeMemberAssiduity,
  doesPresenceMatchMember,
  getAllSundayDates,
  KNOWN_SUNDAYS,
} from '../utils/presenceUtils';

interface TribesViewProps {
  currentUser?: UserProfile | null;
  tribes?: TribeInfo[];
  tribeMembers: TribeMember[];
  presences?: CultePresenceRecord[];
  rapportTemplates?: RapportTemplate[];
  onAddPresence?: (presence: CultePresenceRecord) => Promise<void> | void;
  onSubmitReport?: (rapport: RapportSoumis) => void;
  initialTribeId?: TribeId;
  onSaveMember?: (member: TribeMember, isLeader: boolean) => void;
  onSaveTribeMember?: (member: TribeMember, isLeader: boolean) => void;
  onOpenAuth: () => void;
  onBackToHome?: () => void;
}

export const TribesView: React.FC<TribesViewProps> = ({
  currentUser,
  tribes = INITIAL_TRIBES,
  tribeMembers,
  presences = [],
  rapportTemplates = [],
  onAddPresence,
  onSubmitReport,
  initialTribeId,
  onSaveMember,
  onSaveTribeMember,
  onOpenAuth,
  onBackToHome,
}) => {
  const [selectedTribeId, setSelectedTribeId] = useState<TribeId | null>(initialTribeId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuartierFilter, setSelectedQuartierFilter] = useState('ALL');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [modalLeaderMode, setModalLeaderMode] = useState(false);
  const [editingMember, setEditingMember] = useState<TribeMember | null>(null);

  // Security & Leadership states
  const [isLeaderGuardOpen, setIsLeaderGuardOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [activeLeaderAccount, setActiveLeaderAccount] = useState<LeadershipAccount | null>(null);

  // Selected Tribe object
  const activeTribe = useMemo(() => {
    if (!selectedTribeId) return null;
    return tribes.find((t) => t.id === selectedTribeId) || tribes[0];
  }, [selectedTribeId, tribes]);

  // Members of the currently selected tribe
  const activeTribeMembers = useMemo(() => {
    if (!selectedTribeId) return [];
    return tribeMembers.filter((m) => m.tribeId === selectedTribeId);
  }, [selectedTribeId, tribeMembers]);

  // The active tribe's current leader from tribe info or from tribe members list
  const activeLeader = useMemo(() => {
    if (!activeTribe) return null;
    // Check if there is an assigned member with PATRIARCHE or MATRIARCHE role
    const leaderMember = activeTribeMembers.find(
      (m) => m.roleInTribe === 'PATRIARCHE' || m.roleInTribe === 'MATRIARCHE'
    );
    if (leaderMember) {
      return {
        title: (leaderMember.roleInTribe === 'MATRIARCHE' ? 'Matriarche' : 'Patriarche') as 'Patriarche' | 'Matriarche',
        nom: leaderMember.nom,
        prenom: leaderMember.prenom,
        phone: leaderMember.numero,
        quartier: leaderMember.quartier,
        photoUrl: leaderMember.photoUrl,
        assignedAt: leaderMember.registeredAt,
        bio: activeTribe.leader?.bio || `Chef spirituel et guide de la tribu ${activeTribe.name}.`,
      };
    }
    return activeTribe.leader;
  }, [activeTribe, activeTribeMembers]);

  // Distinct quartiers for filtering
  const distinctQuartiers = useMemo(() => {
    const set = new Set<string>();
    activeTribeMembers.forEach((m) => {
      if (m.quartier) set.add(m.quartier.trim());
    });
    return Array.from(set).sort();
  }, [activeTribeMembers]);

  // Filtered members in current tribe
  const filteredTribeMembers = useMemo(() => {
    return activeTribeMembers.filter((m) => {
      // Exclude leader from standard member list if already highlighted prominently
      const matchesSearch =
        searchQuery === '' ||
        `${m.nom} ${m.prenom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.quartier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.numero.includes(searchQuery);

      const matchesQuartier =
        selectedQuartierFilter === 'ALL' || m.quartier.trim() === selectedQuartierFilter;

      return matchesSearch && matchesQuartier;
    });
  }, [activeTribeMembers, searchQuery, selectedQuartierFilter]);

  // Check if current user is registered in the active tribe
  const currentUserRegistration = useMemo(() => {
    if (!currentUser || !selectedTribeId) return null;
    return tribeMembers.find(
      (m) => (m.userId === currentUser.id || m.numero === currentUser.phone) && m.tribeId === selectedTribeId
    );
  }, [currentUser, selectedTribeId, tribeMembers]);

  // Suivi des Présences au Culte dans la Tribu
  const [selectedSunday, setSelectedSunday] = useState<string>(KNOWN_SUNDAYS[0]);
  const [presenceSubTab, setPresenceSubTab] = useState<'all' | 'absents' | 'chronic' | 'presents'>('all');

  const allSundays = useMemo(() => getAllSundayDates(presences), [presences]);

  const tribePresencesOnSunday = useMemo(() => {
    return presences.filter((p) => {
      const matchDate = p.dateDimanche === selectedSunday;
      const matchTribe = p.tribeId === selectedTribeId;
      const matchMember = activeTribeMembers.some((m) => doesPresenceMatchMember(p, m));
      return matchDate && (matchTribe || matchMember);
    });
  }, [presences, selectedSunday, selectedTribeId, activeTribeMembers]);

  const presentMembers = useMemo(() => {
    return activeTribeMembers.filter((m) =>
      tribePresencesOnSunday.some((p) => doesPresenceMatchMember(p, m))
    );
  }, [activeTribeMembers, tribePresencesOnSunday]);

  const absentMembers = useMemo(() => {
    return activeTribeMembers.filter(
      (m) => !tribePresencesOnSunday.some((p) => doesPresenceMatchMember(p, m))
    );
  }, [activeTribeMembers, tribePresencesOnSunday]);

  const assiduityMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeMemberAssiduity>>();
    activeTribeMembers.forEach((m) => {
      map.set(m.id, computeMemberAssiduity(m, presences, allSundays));
    });
    return map;
  }, [activeTribeMembers, presences, allSundays]);

  const chronicAbsentMembers = useMemo(() => {
    return activeTribeMembers.filter((m) => {
      const assid = assiduityMap.get(m.id);
      return assid?.isChronicAbsent;
    });
  }, [activeTribeMembers, assiduityMap]);

  // Membres affichés selon l'onglet de présence sélectionné
  const displayedTribeMembers = useMemo(() => {
    let list = filteredTribeMembers;
    if (presenceSubTab === 'absents') {
      list = list.filter((m) => absentMembers.some((a) => a.id === m.id));
    } else if (presenceSubTab === 'chronic') {
      list = list.filter((m) => chronicAbsentMembers.some((c) => c.id === m.id));
    } else if (presenceSubTab === 'presents') {
      list = list.filter((m) => presentMembers.some((p) => p.id === m.id));
    }
    return list;
  }, [filteredTribeMembers, presenceSubTab, absentMembers, chronicAbsentMembers, presentMembers]);

  const handleQuickMarkPresent = async (member: TribeMember, culte: CulteServiceType = 'CULTE_1_07H30') => {
    if (!onAddPresence || !activeTribe) return;
    const newRecord: CultePresenceRecord = {
      id: `presence_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      dateDimanche: selectedSunday,
      culte,
      culteLabel: culte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)',
      memberId: member.id,
      prenom: member.prenom,
      nom: member.nom,
      telephone: member.numero,
      tribeId: activeTribe.id,
      tribeName: activeTribe.name,
      quartier: member.quartier,
      statutMembre: 'MEMBRE_REGULIER',
      source: 'PASTEUR_MANUEL',
      confirmeAt: new Date().toISOString(),
    };
    await onAddPresence(newRecord);
  };

  const handleSaveFinal = (member: TribeMember, isLeader: boolean) => {
    if (onSaveMember) onSaveMember(member, isLeader);
    else if (onSaveTribeMember) onSaveTribeMember(member, isLeader);
  };

  // Handlers
  const handleOpenRegister = (asLeader = false, memberToEdit?: TribeMember) => {
    if (!currentUser && !memberToEdit) {
      // Allow opening or prompt
    }
    setModalLeaderMode(asLeader);
    setEditingMember(memberToEdit || null);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {selectedTribeId ? (
              <button
                type="button"
                onClick={() => setSelectedTribeId(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Toutes les tribus</span>
              </button>
            ) : (
              onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Accueil</span>
                </button>
              )
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59A27]">
              Organisation Communautaire
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0A3D36]">
            {activeTribe ? `Tribu de ${activeTribe.name}` : 'Les 12 Tribus'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            {activeTribe
              ? activeTribe.description
              : 'Espace communautaire des 12 tribus. Chaque tribu est dirigée par un Patriarche ou une Matriarche. Inscrivez-vous avec votre nom, prénom, quartier, numéro et votre photo de profil.'}
          </p>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-3">
          {activeTribe && (
            <button
              type="button"
              onClick={() => handleOpenRegister(false, currentUserRegistration || undefined)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md transition-all hover:scale-102 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#C59A27]" />
              <span>
                {currentUserRegistration
                  ? 'Modifier mon inscription'
                  : `S'inscrire dans la Tribu ${activeTribe.name}`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ALL TRIBES GRID VIEW (When no tribe is specifically selected)           */}
      {/* ========================================================================= */}
      {!selectedTribeId && (
        <div className="space-y-8">
          {/* Hero Banner for Tribes */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-6 sm:p-8 shadow-xl border border-[#C59A27]/30">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Les 12 Tribus & Leurs Chefs Spirituels</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Rejoignez Votre Tribu Fraternelle
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                Dans chaque tribu, les frères et sœurs s'enregistrent avec leur <strong>nom</strong>, <strong>prénom</strong>, <strong>numéro</strong>, <strong>quartier</strong> et leur <strong>photo de profil</strong>. Chaque tribu est chapeautée par son chef : le <strong>Patriarche</strong> ou la <strong>Matriarche</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <span className="text-[#C59A27] font-black text-sm">12</span>
                  <span>Tribus Établies</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                  <Users className="w-4 h-4 text-[#C59A27]" />
                  <span><strong>{tribeMembers.length}</strong> Membres Inscrits</span>
                </div>
              </div>
            </div>
          </div>

          {/* 12 Tribes Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tribes.map((tribe, index) => {
              const membersCount = tribeMembers.filter((m) => m.tribeId === tribe.id).length;
              // find assigned leader if updated
              const leaderMember = tribeMembers.find(
                (m) =>
                  m.tribeId === tribe.id &&
                  (m.roleInTribe === 'PATRIARCHE' || m.roleInTribe === 'MATRIARCHE')
              );
              const leader = leaderMember
                ? {
                    title: (leaderMember.roleInTribe === 'MATRIARCHE' ? 'Matriarche' : 'Patriarche') as 'Patriarche' | 'Matriarche',
                    nom: leaderMember.nom,
                    prenom: leaderMember.prenom,
                    phone: leaderMember.numero,
                    quartier: leaderMember.quartier,
                    photoUrl: leaderMember.photoUrl,
                  }
                : tribe.leader;

              const isUserInThisTribe =
                currentUser &&
                tribeMembers.some(
                  (m) =>
                    (m.userId === currentUser.id || m.numero === currentUser.phone) &&
                    m.tribeId === tribe.id
                );

              return (
                <div
                  key={tribe.id}
                  onClick={() => setSelectedTribeId(tribe.id)}
                  className="group relative bg-white rounded-3xl p-5 shadow-xs hover:shadow-xl border border-slate-100 hover:border-[#C59A27]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  {/* Card Header with Tribe badge */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#0A3D36] text-[#C59A27] font-black text-xs flex items-center justify-center shadow-xs">
                          {index + 1}
                        </span>
                        <h3 className="font-black text-lg text-slate-800 group-hover:text-[#0A3D36] transition-colors">
                          {tribe.name}
                        </h3>
                      </div>

                      {isUserInThisTribe && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                          Ma Tribu
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {tribe.biblicalMeaning}
                    </p>

                    {/* Dedicated Space for Tribe Leader (Matriarche ou Patriarche) */}
                    {leader && (
                      <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center gap-3">
                        <img
                          src={leader.photoUrl}
                          alt={`${leader.prenom} ${leader.nom}`}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <Crown className="w-3 h-3 text-[#C59A27]" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                              {leader.title}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {leader.prenom} {leader.nom}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{leader.quartier}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#0A3D36]" />
                      <span><strong>{membersCount}</strong> membre{membersCount > 1 ? 's' : ''}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#0A3D36] font-bold group-hover:translate-x-1 transition-transform">
                      <span>Voir la tribu</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SPECIFIC TRIBE DETAIL VIEW (Leader Showcase + Member Registration + List) */}
      {/* ========================================================================= */}
      {activeTribe && (
        <div className="space-y-8">
          {/* Tribe Specific Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3D36] via-[#124D44] to-[#0A3D36] text-white p-6 sm:p-8 shadow-xl border border-[#C59A27]/30">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" />
                  <span>12 Tribus • {activeTribe.symbol}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Tribu de {activeTribe.name}
                </h2>

                <p className="text-sm text-slate-200 leading-relaxed font-light">
                  {activeTribe.propheticBlessing}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs font-medium">
                    {activeTribeMembers.length} membre{activeTribeMembers.length > 1 ? 's' : ''} inscrit{activeTribeMembers.length > 1 ? 's' : ''}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#C59A27]/30 text-amber-200 font-semibold">
                    Signification : {activeTribe.biblicalMeaning}
                  </span>
                </div>
              </div>

              {/* Quick Action in Banner */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenRegister(false, currentUserRegistration || undefined)}
                  className="px-5 py-3 rounded-2xl bg-[#C59A27] hover:bg-[#D4A936] text-[#0A3D36] font-black text-xs shadow-lg transition-transform hover:scale-102 active:scale-95 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {currentUserRegistration ? 'Modifier mon profil' : 'S\'inscrire dans cette tribu'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ESPACE DÉDIÉ AU CHEF DE TRIBU (Matriarche ou Patriarche)                   */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border-2 border-[#C59A27]/40 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27] text-[#0A3D36] text-xs font-black uppercase tracking-wider shadow-xs">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Espace du Chef de Tribu</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A3D36]">
                  {activeLeader ? `${activeLeader.title} de la Tribu` : 'Patriarche ou Matriarche'}
                </h3>
                <p className="text-xs text-slate-600">
                  Responsable spirituel, pasteur d'impact et conducteur désigné pour veiller sur la tribu de {activeTribe.name}.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaderGuardOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C59A27] hover:bg-[#E5B22F] text-slate-950 text-xs font-black shadow-sm transition-all hover:scale-102 active:scale-95"
                  title="Accès sécurisé pour le Chef de Tribu (mot de passe requis)"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>Espace Chef & Rapport 🔒</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenRegister(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C59A27] text-[#0A3D36] hover:bg-amber-100 text-xs font-bold transition-all shadow-xs"
                >
                  <CrownIcon className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>{activeLeader ? 'Modifier le Chef' : 'Désigner le Chef'}</span>
                </button>
              </div>
            </div>

            {activeLeader ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-xs">
                {/* Photo de profil importée du Chef */}
                <div className="relative shrink-0">
                  <img
                    src={activeLeader.photoUrl}
                    alt={`${activeLeader.prenom} ${activeLeader.nom}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-[#C59A27] shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#C59A27] text-[#0A3D36] text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>{activeLeader.title}</span>
                  </div>
                </div>

                {/* Info du Chef */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <span className="text-xs font-bold text-[#C59A27] uppercase tracking-wider">
                      {activeLeader.title} Officiel(le)
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {activeLeader.prenom} {activeLeader.nom}
                    </h4>
                  </div>

                  {activeLeader.bio && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                      « {activeLeader.bio} »
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-[#C59A27] shrink-0" />
                      <span className="truncate">
                        <strong>Quartier :</strong> {activeLeader.quartier}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <Phone className="w-4 h-4 text-[#0A3D36] shrink-0" />
                      <span className="truncate">
                        <strong>Numéro :</strong> {activeLeader.phone}
                      </span>
                    </div>
                  </div>

                  {/* Actions directes de contact */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={`tel:${activeLeader.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span>Appeler le {activeLeader.title}</span>
                    </a>
                    <a
                      href={`https://wa.me/${activeLeader.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-amber-300 space-y-3">
                <Crown className="w-12 h-12 mx-auto text-amber-400" />
                <h4 className="font-bold text-slate-800 text-base">
                  Aucun Patriarche ou Matriarche désigné pour le moment
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Chaque tribu a un chef spirituel. Si vous avez été établi ou souhaitez proposer un responsable pour cette tribu, vous pouvez le désigner ci-dessous.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenRegister(true)}
                  className="px-4 py-2 rounded-xl bg-[#C59A27] text-[#0A3D36] text-xs font-black shadow-md hover:bg-[#D4A936]"
                >
                  Désigner le Chef de Tribu
                </button>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* ANNUAIRE DES MEMBRES DE LA TRIBU                                         */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-[#0A3D36]">
                  Membres Inscrits dans la Tribu {activeTribe.name} ({activeTribeMembers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Tous les fidèles inscrits avec leur nom, prénom, quartier, numéro et photo de profil.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister(false, currentUserRegistration || undefined)}
                className="px-4 py-2 rounded-xl bg-[#0A3D36] text-white text-xs font-bold hover:bg-[#135E54] flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#C59A27]" />
                <span>S'inscrire comme membre</span>
              </button>
            </div>

            {/* Suivi des Présences au Culte dans la Tribu */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-black text-[#0A3D36] uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-[#C59A27]" />
                    <span>Pointage & Présences Dimanche • Tribu {activeTribe.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Les absents et fidèles ne venant plus depuis un moment sont dénotés automatiquement dès la fin des cultes.
                  </p>
                </div>

                {/* Sélecteur de Dimanche */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600 shrink-0">Dimanche :</span>
                  <select
                    value={selectedSunday}
                    onChange={(e) => setSelectedSunday(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#C59A27]"
                  >
                    {allSundays.map((d) => (
                      <option key={d} value={d}>
                        {d === allSundays[0] ? `Dimanche ${d} (Plus récent)` : `Dimanche ${d}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Boutons d'Onglets de Présence de la Tribu */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPresenceSubTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    presenceSubTab === 'all'
                      ? 'bg-[#0A3D36] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Tous les membres ({activeTribeMembers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPresenceSubTab('absents')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    presenceSubTab === 'absents'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Absents ce Dimanche ({absentMembers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPresenceSubTab('chronic')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    presenceSubTab === 'chronic'
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'bg-red-50 text-red-900 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span>Ne viennent plus depuis un moment ({chronicAbsentMembers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPresenceSubTab('presents')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    presenceSubTab === 'presents'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Présents ({presentMembers.length})</span>
                </button>
              </div>

              {/* Bannières explicatives selon onglet actif */}
              {presenceSubTab === 'absents' && (
                <div className="p-3 bg-rose-100/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                  <UserX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Membres de la tribu absents au culte du {selectedSunday} ({absentMembers.length}).</strong> Dès que les présences sont renseignées chaque dimanche, cette liste s'actualise automatiquement dans votre tribu. Contactez vos frères et sœurs sur WhatsApp pour prendre de leurs nouvelles !
                  </div>
                </div>
              )}

              {presenceSubTab === 'chronic' && (
                <div className="p-3 bg-red-100/80 border border-red-300 rounded-xl text-xs text-red-950 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Brebis qui ne viennent plus depuis un moment ({chronicAbsentMembers.length}).</strong> Ces membres ont manqué 2 dimanches consécutifs ou plus. Une attention fraternelle et une visite pastorale sont recommandées pour prendre soin d'eux.
                  </div>
                </div>
              )}
            </div>

            {/* Search & Quartier Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, quartier ou numéro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>

              {distinctQuartiers.length > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={selectedQuartierFilter}
                    onChange={(e) => setSelectedQuartierFilter(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
                  >
                    <option value="ALL">Tous les quartiers ({activeTribeMembers.length})</option>
                    {distinctQuartiers.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Members Cards Grid */}
            {displayedTribeMembers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedTribeMembers.map((member) => {
                  const isLeader =
                    member.roleInTribe === 'PATRIARCHE' || member.roleInTribe === 'MATRIARCHE';
                  const isCurrentUser =
                    currentUser &&
                    (member.userId === currentUser.id || member.numero === currentUser.phone);

                  const isPresent = presentMembers.some((p) => p.id === member.id);
                  const isAbsent = absentMembers.some((a) => a.id === member.id);
                  const assid = assiduityMap.get(member.id);
                  const isChronic = assid?.isChronicAbsent;

                  const whatsappFraternelAbsent = `Bonjour bien-aimé(e) ${member.prenom}, toute la tribu ${activeTribe.name} pense à toi aujourd'hui ! Nous avons remarqué ton absence au culte ce dimanche ${selectedSunday}. Que la paix et la grâce de Dieu soient sur toi. Comment vas-tu ?`;
                  const whatsappUrlAbsent = `https://wa.me/${member.numero.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappFraternelAbsent)}`;

                  const whatsappChronic = `Bonjour bien-aimé(e) ${member.prenom}, c'est la tribu ${activeTribe.name} de la Cité Royale Siloé. Le Seigneur a mis ton nom sur notre cœur car nous avons constaté que tu ne venais plus depuis quelques dimanches. Nous voulions prendre de tes nouvelles et savoir si tout va bien. Tu es précieux(se) pour nous !`;
                  const whatsappUrlChronic = `https://wa.me/${member.numero.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappChronic)}`;

                  return (
                    <div
                      key={member.id}
                      className={`relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 ${
                        isChronic
                          ? 'border-red-300 bg-red-50/15'
                          : isAbsent
                          ? 'border-rose-200 bg-rose-50/10'
                          : isLeader
                          ? 'border-[#C59A27]/50 bg-amber-50/20'
                          : isCurrentUser
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Member Card Header with Photo */}
                        <div className="flex items-center gap-4">
                          <img
                            src={member.photoUrl}
                            alt={`${member.prenom} ${member.nom}`}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isLeader ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#C59A27] text-[#0A3D36] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  <span>{member.roleInTribe === 'MATRIARCHE' ? 'Matriarche' : 'Patriarche'}</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                  Membre
                                </span>
                              )}
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                  Moi
                                </span>
                              )}

                              {/* Statut de présence au culte */}
                              {isPresent ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Présent ce dimanche</span>
                                </span>
                              ) : isChronic ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-black flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  <span>Ne vient plus ({assid?.consecutiveAbsences} d.)</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center gap-1">
                                  <UserX className="w-3 h-3" />
                                  <span>Absent ce dimanche</span>
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate mt-1">
                              {member.prenom} {member.nom}
                            </h4>

                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#C59A27] shrink-0" />
                              <span className="font-medium text-slate-700">{member.quartier}</span>
                            </p>
                          </div>
                        </div>

                        {/* Details Info */}
                        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Numéro :</span>
                            <span className="font-bold text-slate-800">{member.numero}</span>
                          </div>
                          {isChronic && assid?.lastPresentDate && (
                            <div className="flex items-center justify-between text-red-700 text-[11px] font-bold">
                              <span>Dernier culte :</span>
                              <span>{assid.lastPresentDate}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-400">Inscrit le :</span>
                            <span>{member.registeredAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact and Fraternal Outreach Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        {/* Si absent ou absent chronique, bouton direct de relance fraternelle */}
                        {isAbsent && (
                          <div className="flex items-center gap-2">
                            <a
                              href={isChronic ? whatsappUrlChronic : whatsappUrlAbsent}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Prendre des nouvelles (WhatsApp)</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleQuickMarkPresent(member)}
                              className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                              title="Pointer présent au culte"
                            >
                              + Présent
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${member.numero.replace(/\s+/g, '')}`}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-[#0A3D36] hover:text-white text-slate-700 transition-colors"
                              title="Appeler"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${member.numero.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {isCurrentUser && (
                            <button
                              type="button"
                              onClick={() => handleOpenRegister(isLeader, member)}
                              className="text-xs font-bold text-[#0A3D36] hover:underline"
                            >
                              Modifier
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <Users className="w-10 h-10 mx-auto text-slate-400" />
                <h4 className="font-bold text-slate-700 text-sm">
                  {searchQuery || selectedQuartierFilter !== 'ALL'
                    ? 'Aucun membre ne correspond à vos filtres'
                    : `Soyez le premier à vous inscrire dans la tribu ${activeTribe.name} !`}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || selectedQuartierFilter !== 'ALL'
                    ? 'Essayez de modifier vos termes de recherche ou de réinitialiser les filtres.'
                    : 'Renseignez votre nom, prénom, numéro, quartier et importez votre photo de profil.'}
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenRegister(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A3D36] text-white text-xs font-bold shadow-xs hover:bg-[#135E54]"
                >
                  S'inscrire maintenant
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registration / Edit Modal */}
      {activeTribe && (
        <TribeRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setEditingMember(null);
          }}
          tribe={activeTribe}
          currentUser={currentUser}
          existingMember={editingMember}
          isLeaderMode={modalLeaderMode}
          onSaveMember={(member, isLeader) => {
            handleSaveFinal(member, isLeader);
          }}
        />
      )}

      {/* Leadership Access Guard for Tribe Leader */}
      {isLeaderGuardOpen && activeTribe && (
        <LeadershipGuardModal
          category="CHEF_TRIBU"
          title={`Espace Sécurisé • Chef de la Tribu ${activeTribe.name}`}
          targetName={`Tribu ${activeTribe.name}`}
          currentUser={currentUser}
          onClose={() => setIsLeaderGuardOpen(false)}
          onUnlocked={(account) => {
            setActiveLeaderAccount(account);
            setIsLeaderGuardOpen(false);
            setIsCreateReportOpen(true);
          }}
          onOpenCreateReport={() => {
            setIsLeaderGuardOpen(false);
            setIsCreateReportOpen(true);
          }}
        />
      )}

      {/* Create & Send Report Modal directly to Pastor */}
      {isCreateReportOpen && activeTribe && (
        <CreateSendReportModal
          category="CHEF_TRIBU"
          defaultEntityName={`Tribu ${activeTribe.name}`}
          defaultLeaderName={activeLeaderAccount?.holderName || (activeLeader ? `${activeLeader.prenom} ${activeLeader.nom}` : '')}
          defaultLeaderPhone={activeLeaderAccount?.phone || activeLeader?.phone || ''}
          templates={rapportTemplates}
          currentUser={currentUser}
          onClose={() => setIsCreateReportOpen(false)}
          onSubmitReport={(report) => {
            if (onSubmitReport) onSubmitReport(report);
          }}
        />
      )}
    </div>
  );
};
