import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  HeartHandshake,
  Phone,
  MessageSquare,
  Crown,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { CultePresenceRecord, CulteServiceType, TribeId, TribeInfo, TribeMember, UserProfile } from '../../types';
import {
  computeMemberAssiduity,
  getAllSundayDates,
  generatePastoralWhatsAppLink,
  MemberAssiduityProfile,
  MemberAssiduityStatus,
} from '../../utils/presenceUtils';

interface PastorMembersDirectoryProps {
  tribeMembers: TribeMember[];
  tribes: TribeInfo[];
  presences: CultePresenceRecord[];
  currentUser?: UserProfile | null;
  onAddPresence?: (presence: CultePresenceRecord) => Promise<void> | void;
  onSelectTribe?: (tribeId: TribeId) => void;
}

export const PastorMembersDirectory: React.FC<PastorMembersDirectoryProps> = ({
  tribeMembers,
  tribes,
  presences,
  currentUser,
  onAddPresence,
  onSelectTribe,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTribeFilter, setSelectedTribeFilter] = useState<'TOUTES' | TribeId>('TOUTES');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CHRONIC_ABSENT' | 'ABSENT_LAST_SUNDAY' | 'REGULAR' | 'NEVER'>('ALL');
  const [sortBy, setSortBy] = useState<'absences_desc' | 'name_asc' | 'tribe_asc'>('absences_desc');

  const sundayDates = useMemo(() => getAllSundayDates(presences), [presences]);
  const latestSunday = sundayDates[0] || '2026-09-20';

  // Compute assiduity profiles for all members
  const memberProfiles = useMemo<MemberAssiduityProfile[]>(() => {
    return tribeMembers.map((member) => computeMemberAssiduity(member, presences, sundayDates));
  }, [tribeMembers, presences, sundayDates]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = memberProfiles.length;
    const regular = memberProfiles.filter((p) => p.status === 'REGULIER').length;
    const absentOne = memberProfiles.filter((p) => p.status === 'ABSENT_1_DIMANCHE').length;
    const absentTwo = memberProfiles.filter((p) => p.status === 'ABSENT_2_DIMANCHES').length;
    const absentProlonged = memberProfiles.filter((p) => p.status === 'ABSENT_PROLONGE').length;
    const never = memberProfiles.filter((p) => p.status === 'JAMAIS_POINTE').length;
    const totalChronic = memberProfiles.filter((p) => p.isChronicAbsent).length;

    return {
      total,
      regular,
      absentOne,
      absentTwo,
      absentProlonged,
      never,
      totalChronic,
    };
  }, [memberProfiles]);

  // Filtered and sorted profiles
  const filteredProfiles = useMemo(() => {
    return memberProfiles
      .filter((profile) => {
        const m = profile.member;
        const q = searchQuery.toLowerCase().trim();

        // Search match
        const matchesQuery =
          !q ||
          m.nom.toLowerCase().includes(q) ||
          m.prenom.toLowerCase().includes(q) ||
          m.numero.includes(q) ||
          (m.quartier && m.quartier.toLowerCase().includes(q)) ||
          m.roleInTribe.toLowerCase().includes(q);

        // Tribe match
        const matchesTribe =
          selectedTribeFilter === 'TOUTES' || m.tribeId === selectedTribeFilter;

        // Status match
        let matchesStatus = true;
        if (statusFilter === 'CHRONIC_ABSENT') {
          matchesStatus = profile.isChronicAbsent;
        } else if (statusFilter === 'ABSENT_LAST_SUNDAY') {
          matchesStatus = profile.status === 'ABSENT_1_DIMANCHE';
        } else if (statusFilter === 'REGULAR') {
          matchesStatus = profile.status === 'REGULIER';
        } else if (statusFilter === 'NEVER') {
          matchesStatus = profile.status === 'JAMAIS_POINTE';
        }

        return matchesQuery && matchesTribe && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'absences_desc') {
          // Put those absent for longest at the top
          return b.consecutiveAbsencesCount - a.consecutiveAbsencesCount;
        }
        if (sortBy === 'name_asc') {
          return `${a.member.nom} ${a.member.prenom}`.localeCompare(
            `${b.member.nom} ${b.member.prenom}`
          );
        }
        if (sortBy === 'tribe_asc') {
          return a.member.tribeId.localeCompare(b.member.tribeId);
        }
        return 0;
      });
  }, [memberProfiles, searchQuery, selectedTribeFilter, statusFilter, sortBy]);

  // Quick action: validate member presence
  const handleQuickValidate = async (member: TribeMember, culte: CulteServiceType) => {
    if (!onAddPresence) return;
    const tribeObj = tribes.find((t) => t.id === member.tribeId);
    const record: CultePresenceRecord = {
      id: 'cp-' + Date.now(),
      dateDimanche: latestSunday,
      culte,
      culteLabel: culte === 'CULTE_1_07H30' ? '1er Culte (07h30)' : '2ème Culte (10h30)',
      memberId: member.id,
      nom: member.nom,
      prenom: member.prenom,
      telephone: member.numero,
      tribeId: member.tribeId,
      tribeName: tribeObj ? tribeObj.name : member.tribeId,
      quartier: member.quartier,
      statutMembre: member.roleInTribe === 'RESPONSABLE' ? 'RESPONSABLE' : 'MEMBRE_REGULIER',
      confirmeAt: new Date().toISOString(),
      source: 'PASTEUR_MANUEL',
      notes: 'Pointé directement par le bureau pastoral',
    };
    await onAddPresence(record);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#124D44] rounded-3xl p-6 text-white border border-[#C59A27]/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/40 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Annuaire & Effectif Global de l'Église</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Effectif Total des Membres & Suivi des Brebis
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              Consultez l'ensemble des <strong>{tribeMembers.length} fidèles</strong> répartis dans les 12 Tribus. Identifiez automatiquement les membres qui ne viennent plus depuis un moment afin d'organiser les relances fraternelles et les visites pastorales.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter('CHRONIC_ABSENT')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md ${
                statusFilter === 'CHRONIC_ABSENT'
                  ? 'bg-rose-500 text-white scale-102 ring-2 ring-white'
                  : 'bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-400/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-300 animate-pulse" />
              <span>Voir Brebis en Décrochage ({stats.totalChronic})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Membres */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Effectif Total</span>
          </div>
          <div className="text-2xl font-black mt-1">{stats.total}</div>
          <div className="text-[10px] opacity-70 mt-0.5">Membres des 12 Tribus</div>
        </div>

        {/* Présents Récents / Réguliers */}
        <div
          onClick={() => setStatusFilter('REGULAR')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'REGULAR'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-102'
              : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Assidus & Présents</span>
          </div>
          <div className="text-2xl font-black mt-1 text-emerald-800">{stats.regular}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Présents au dernier culte</div>
        </div>

        {/* Absents 1 Dimanche */}
        <div
          onClick={() => setStatusFilter('ABSENT_LAST_SUNDAY')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'ABSENT_LAST_SUNDAY'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102'
              : 'bg-white text-slate-900 border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Absents 1 Culte</span>
          </div>
          <div className="text-2xl font-black mt-1 text-amber-800">{stats.absentOne}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Manqué dimanche dernier</div>
        </div>

        {/* Absents depuis un moment (2+ dimanches) */}
        <div
          onClick={() => setStatusFilter('CHRONIC_ABSENT')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'CHRONIC_ABSENT'
              ? 'bg-rose-700 text-white border-rose-700 shadow-md scale-102'
              : 'bg-rose-50/70 text-slate-900 border-rose-200 hover:border-rose-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Ne viennent plus</span>
          </div>
          <div className="text-2xl font-black mt-1 text-rose-800">{stats.totalChronic}</div>
          <div className="text-[10px] text-rose-600 mt-0.5 font-bold">2+ dimanches d'absence</div>
        </div>

        {/* Jamais pointés */}
        <div
          onClick={() => setStatusFilter('NEVER')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'NEVER'
              ? 'bg-purple-800 text-white border-purple-800 shadow-md scale-102'
              : 'bg-white text-slate-900 border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" />
            <span>Jamais pointés</span>
          </div>
          <div className="text-2xl font-black mt-1 text-purple-800">{stats.never}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">À contacter en priorité</div>
        </div>
      </div>

      {/* 3. ALERTE SPÉCIALE : Brebis en décrochage / Ne viennent plus depuis un moment */}
      {stats.totalChronic > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-50 via-amber-50/60 to-rose-50 border-2 border-rose-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white uppercase tracking-wider">
                  Vigilance Pastorale
                </span>
                <span className="text-xs font-black text-rose-900">
                  {stats.totalChronic} fidèle{stats.totalChronic > 1 ? 's' : ''} ne vienn{stats.totalChronic > 1 ? 'ent' : 't'} plus depuis un moment
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Ces membres ont manqué 2 dimanches ou plus consécutifs (ou n'ont encore jamais confirmé de présence). Cliquez sur <strong>« Relance Pastorale WhatsApp »</strong> pour leur envoyer un message de bienveillance et d'encouragement pré-rédigé.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setStatusFilter('CHRONIC_ABSENT')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors"
            >
              Afficher ces {stats.totalChronic} brebis
            </button>
          </div>
        </div>
      )}

      {/* 4. Controls & Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, prénom, téléphone, quartier, rôle..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#C59A27] bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Tribe filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTribeFilter}
              onChange={(e) => setSelectedTribeFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#C59A27]"
            >
              <option value="TOUTES">Toutes les 12 Tribus</option>
              {tribes.map((t) => (
                <option key={t.id} value={t.id}>
                  Tribu {t.name}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#C59A27]"
            >
              <option value="absences_desc">Trier : Absents depuis le + longtemps</option>
              <option value="name_asc">Trier : Nom Alphabétique (A-Z)</option>
              <option value="tribe_asc">Trier : Par Tribu</option>
            </select>
          </div>
        </div>

        {/* Secondary filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Filtrer par assiduité :
          </span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous ({memberProfiles.length})
          </button>

          <button
            onClick={() => setStatusFilter('CHRONIC_ABSENT')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              statusFilter === 'CHRONIC_ABSENT'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Ne viennent plus ({stats.totalChronic})</span>
          </button>

          <button
            onClick={() => setStatusFilter('ABSENT_LAST_SUNDAY')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ABSENT_LAST_SUNDAY'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Absents dimanche dernier ({stats.absentOne})
          </button>

          <button
            onClick={() => setStatusFilter('REGULAR')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'REGULAR'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Présents au culte ({stats.regular})
          </button>

          <button
            onClick={() => setStatusFilter('NEVER')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'NEVER'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            Aucun pointage ({stats.never})
          </button>
        </div>
      </div>

      {/* 5. Members List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Affichage de <strong>{filteredProfiles.length}</strong> membre{filteredProfiles.length > 1 ? 's' : ''}
          </span>
          <span className="text-slate-400">
            Dernier dimanche de référence : <strong>{latestSunday}</strong>
          </span>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-black text-slate-700">Aucun membre ne correspond à ce filtre.</p>
            <p className="text-xs text-slate-400">Essayez de modifier votre recherche ou vos critères de filtre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProfiles.map(({ member, status, consecutiveAbsencesCount, lastPresence, totalPresencesCount, isChronicAbsent, statusLabel, badgeBg, badgeTextColor }) => {
              const tribeObj = tribes.find((t) => t.id === member.tribeId);
              const tribeName = tribeObj ? tribeObj.name : member.tribeId;

              const pastoralWhatsAppUrl = generatePastoralWhatsAppLink(
                member,
                tribeName,
                isChronicAbsent ? 'ABSENT_PROLONGE' : 'DIMANCHE_ABSENT',
                latestSunday
              );

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isChronicAbsent
                      ? 'border-rose-300 ring-1 ring-rose-100'
                      : status === 'ABSENT_1_DIMANCHE'
                      ? 'border-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header with Photo, Names, and Tribe */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A3D36] to-[#124D44] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                            {member.prenom[0]}
                            {member.nom[0]}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {member.prenom} {member.nom}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Crown className="w-3 h-3 text-[#C59A27]" />
                            <span className="font-bold text-[#0A3D36]">Tribu de {tribeName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Assiduity Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${badgeBg} ${badgeTextColor}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Member Details */}
                    <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Rôle dans la tribu :</span>
                        <span className="font-bold text-slate-800">{member.roleInTribe}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quartier de résidence :</span>
                        <span className="font-medium text-slate-800 truncate ml-2">
                          {member.quartier || 'Non renseigné'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Téléphone :</span>
                        <span className="font-bold text-slate-900">{member.numero}</span>
                      </div>

                      {/* Last presence date */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400">Dernière présence :</span>
                        <span
                          className={`font-black ${
                            lastPresence ? 'text-emerald-800' : 'text-rose-700'
                          }`}
                        >
                          {lastPresence
                            ? `${lastPresence.dateDimanche} (${lastPresence.culteLabel.split(' ')[0]})`
                            : 'Jamais enregistré'}
                        </span>
                      </div>
                    </div>

                    {/* Alerte spécifique pour absent prolongé */}
                    {isChronicAbsent && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="font-medium">
                          {consecutiveAbsencesCount > 0
                            ? `Absent depuis ${consecutiveAbsencesCount} dimanches consécutifs. Visite pastorale vivement recommandée.`
                            : 'Aucune présence enregistrée à ce jour.'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${member.numero.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Appeler par téléphone"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={pastoralWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all hover:scale-102"
                        title="Envoyer un message pastoral par WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Relance WhatsApp</span>
                      </a>
                    </div>

                    {/* Quick check-in buttons if member is actually present */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickValidate(member, 'CULTE_1_07H30')}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black transition-colors"
                        title="Marquer présent au 1er culte 07h30"
                      >
                        + 07h30
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickValidate(member, 'CULTE_2_10H30')}
                        className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-black transition-colors"
                        title="Marquer présent au 2ème culte 10h30"
                      >
                        + 10h30
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
