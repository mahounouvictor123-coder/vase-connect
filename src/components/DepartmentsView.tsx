import React, { useState, useMemo } from 'react';
import {
  Users,
  Flame,
  Shield,
  Heart,
  Music,
  Camera,
  Wrench,
  Compass,
  ChevronRight,
  Bell,
  Sparkles,
  ArrowLeft,
  Plus,
  Search,
  Phone,
  MessageCircle,
  Mail,
  UserCheck,
  UserPlus,
  Award,
  Calendar,
  X,
  CheckCircle,
  Megaphone
} from 'lucide-react';
import { DepartmentItem, DepartmentMember, UserProfile } from '../types';
import { CreateDepartmentModal } from './departments/CreateDepartmentModal';
import { AddMemberToDepartmentModal } from './departments/AddMemberToDepartmentModal';

interface DepartmentsViewProps {
  departments: DepartmentItem[];
  currentUser?: UserProfile | null;
  existingUsers?: UserProfile[];
  onAddDepartment?: (dept: DepartmentItem) => void;
  onAddMemberToDepartment?: (deptId: string, member: DepartmentMember) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onBackToHome?: () => void;
}

const ICONS_MAP: { [key: string]: React.ReactNode } = {
  Flame: <Flame className="w-5 h-5 text-red-500" />,
  Shield: <Shield className="w-5 h-5 text-blue-500" />,
  Heart: <Heart className="w-5 h-5 text-rose-500" />,
  Music: <Music className="w-5 h-5 text-amber-500" />,
  Camera: <Camera className="w-5 h-5 text-purple-500" />,
  Users: <Users className="w-5 h-5 text-teal-600" />,
  Wrench: <Wrench className="w-5 h-5 text-slate-600" />,
  Compass: <Compass className="w-5 h-5 text-emerald-600" />,
  Megaphone: <Megaphone className="w-5 h-5 text-orange-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-500" />,
};

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  currentUser,
  existingUsers = [],
  onAddDepartment,
  onAddMemberToDepartment,
  onOpenAssistantWithPrompt,
  onBackToHome,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'COM' | 'LOUANGE' | 'PRIERE' | 'SERVICE'>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    return departments.filter(d => {
      const matchSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.leaderName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeCategoryFilter === 'COM') {
        return d.id.includes('communication') || d.id.includes('media');
      }
      if (activeCategoryFilter === 'LOUANGE') {
        return d.id.includes('louange') || d.id.includes('chorale');
      }
      if (activeCategoryFilter === 'PRIERE') {
        return d.id.includes('intercession');
      }
      if (activeCategoryFilter === 'SERVICE') {
        return d.id.includes('accueil') || d.id.includes('technique') || d.id.includes('evangelisation');
      }

      return true;
    });
  }, [departments, searchQuery, activeCategoryFilter]);

  // Handle department created
  const handleDepartmentCreated = (newDept: DepartmentItem) => {
    if (onAddDepartment) {
      onAddDepartment(newDept);
    }
    setShowCreateModal(false);
    setSelectedDept(newDept);
    showToast(`Le département « ${newDept.name} » a été créé avec succès !`);
  };

  // Handle member added
  const handleMemberAdded = (member: DepartmentMember) => {
    if (selectedDept && onAddMemberToDepartment) {
      onAddMemberToDepartment(selectedDept.id, member);
    }
    // Update local state of selectedDept
    if (selectedDept) {
      const currentList = selectedDept.membersList || [];
      const updatedList = [member, ...currentList];
      setSelectedDept({
        ...selectedDept,
        membersList: updatedList,
        memberCount: (selectedDept.memberCount || 0) + 1,
      });
    }
    setShowAddMemberModal(false);
    showToast(`${member.prenom} ${member.nom} a été ajouté(e) au département !`);
  };

  // Quick join current user
  const handleQuickJoin = () => {
    if (!currentUser) {
      showToast("Veuillez vous connecter pour rejoindre ce département.");
      return;
    }
    if (!selectedDept) return;

    const alreadyMember = selectedDept.membersList?.some(
      m => m.memberId === currentUser.id || m.telephone === currentUser.phone
    );

    if (alreadyMember) {
      showToast("Vous êtes déjà enregistré(e) dans ce département !");
      return;
    }

    const newMember: DepartmentMember = {
      id: 'dm-' + Date.now(),
      departmentId: selectedDept.id,
      memberId: currentUser.id,
      nom: currentUser.lastName,
      prenom: currentUser.firstName,
      telephone: currentUser.phone,
      roleInDepartment: 'Nouveau Membre Engagé',
      dateAdhesion: new Date().toISOString().split('T')[0],
      competences: currentUser.skills || ['Disponibilité pour le service'],
      photoUrl: currentUser.photoUrl,
    };

    handleMemberAdded(newMember);
  };

  // Total members across all departments
  const totalMobilizedMembers = useMemo(() => {
    return departments.reduce((acc, d) => acc + (d.memberCount || (d.membersList?.length ?? 0)), 0);
  }, [departments]);

  // Filtered members in selected department modal
  const filteredDeptMembers = useMemo(() => {
    if (!selectedDept || !selectedDept.membersList) return [];
    if (!memberSearchQuery.trim()) return selectedDept.membersList;
    const q = memberSearchQuery.toLowerCase();
    return selectedDept.membersList.filter(
      m =>
        m.nom.toLowerCase().includes(q) ||
        m.prenom.toLowerCase().includes(q) ||
        m.roleInDepartment.toLowerCase().includes(q) ||
        (m.competences && m.competences.some(c => c.toLowerCase().includes(q)))
    );
  }, [selectedDept, memberSearchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-70 bg-[#0A3D36] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C59A27]/50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#C59A27]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-6 sm:p-8 text-white shadow-xl border border-[#C59A27]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59A27]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#F5DE98] text-xs font-black transition-all border border-white/20 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Accueil</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59A27]/20 border border-[#C59A27]/50 text-[#F5DE98] text-xs font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Départements & Ministères</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Départements de l'Église Porte des Cieux
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Consultez pour chaque pôle (<strong>Communication</strong>, <strong>Louange</strong>, <strong>Intercession</strong>...) son <strong>Responsable dédié</strong>, la <strong>liste de ses membres</strong> et leurs talents. Vous avez la possibilité d'ajouter de nouveaux départements et d'intégrer des membres.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-bold border border-white/10">
                🏛️ {departments.length} Départements
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 text-amber-200 font-bold border border-white/10">
                👥 {totalMobilizedMembers}+ Membres mobilisés
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#b0881f] hover:to-[#d4a224] text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all hover:scale-102 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter un Département</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenAssistantWithPrompt(
                  'Présente-moi les départements de l\'église : Communication, Louange, Intercession, et dis-moi comment m\'engager.'
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Orientation via Assistant IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un département, un responsable, une mission..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D36]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous ({departments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('COM')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === 'COM'
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Communication 📸
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('LOUANGE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === 'LOUANGE'
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Louange 🎵
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('PRIERE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === 'PRIERE'
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Intercession 🔥
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('SERVICE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategoryFilter === 'SERVICE'
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Services & Logistique 🤝
            </button>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => {
          const membersList = dept.membersList || [];
          const effectiveMemberCount = Math.max(dept.memberCount || 0, membersList.length);

          return (
            <div
              key={dept.id}
              onClick={() => {
                setSelectedDept(dept);
                setMemberSearchQuery('');
              }}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group hover:border-[#C59A27]/60"
            >
              <div className="space-y-3">
                {/* Top Row: Icon + Member Count */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-50 transition-all">
                    {ICONS_MAP[dept.iconName] || <Users className="w-6 h-6 text-[#0A3D36]" />}
                  </div>
                  <span className="text-xs font-black text-[#0A3D36] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {effectiveMemberCount} membres
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-black text-base text-slate-900 group-hover:text-[#0A3D36] transition-colors line-clamp-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                    {dept.description}
                  </p>
                </div>

                {/* Section Responsable */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={
                        dept.leaderPhoto ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={dept.leaderName}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-[#C59A27]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0A3D36] text-[#C59A27] rounded-full text-[8px] font-black flex items-center justify-center">
                      R
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-black uppercase text-[#C59A27] tracking-wider block truncate">
                      {dept.leaderTitle || 'Responsable'}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {dept.leaderName}
                    </h4>
                    {dept.leaderPhone && (
                      <p className="text-[10px] text-slate-500 truncate">
                        {dept.leaderPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Members preview */}
                {membersList.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Membres ({membersList.length}) :
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {membersList.slice(0, 3).map((m, idx) => (
                        <span
                          key={m.id || idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-medium text-slate-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D36]" />
                          <span>{m.prenom} {m.nom[0]}.</span>
                        </span>
                      ))}
                      {membersList.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-500">
                          +{membersList.length - 3} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#0A3D36] font-bold">
                <span className="flex items-center gap-1 text-[11px] text-[#C59A27]">
                  <span>Ouvrir la Fenêtre</span>
                </span>
                <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-[#0A3D36] group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-800">
            Aucun département ne correspond à votre recherche
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vous pouvez créer ce département dès maintenant pour organiser l'équipe correspondante.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A3D36] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4 text-[#C59A27]" />
            <span>Créer ce département</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FENÊTRE DÉTAILLÉE DU DÉPARTEMENT (MODAL COMPLET) */}
      {/* ========================================================================= */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl my-6 p-5 sm:p-8 shadow-2xl border border-slate-100 text-slate-800 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  {ICONS_MAP[selectedDept.iconName] || <Users className="w-6 h-6 text-[#0A3D36]" />}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0A3D36] text-[10px] font-black uppercase tracking-wider mb-0.5">
                    <span>Fenêtre Officielle</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#0A3D36]">
                    {selectedDept.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedDept.memberCount || selectedDept.membersList?.length || 0} membres engagés
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description & Vision */}
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedDept.description}
            </div>

            {/* ========================================================================= */}
            {/* 1. FENÊTRE RESPONSABLE DU DÉPARTEMENT */}
            {/* ========================================================================= */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C59A27]" />
                  <span>Fenêtre Responsable du Département</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  Conducteur Référent
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/40 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        selectedDept.leaderPhoto ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={selectedDept.leaderName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C59A27] shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0A3D36] text-[#C59A27] rounded-full text-[9px] font-black flex items-center justify-center">
                      ★
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#C59A27] tracking-wider block">
                      {selectedDept.leaderTitle || 'Responsable de Département'}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      {selectedDept.leaderName}
                    </h4>
                    {selectedDept.leaderEmail && (
                      <p className="text-[11px] text-slate-500">
                        {selectedDept.leaderEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons for Leader */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedDept.leaderPhone && (
                    <a
                      href={`tel:${selectedDept.leaderPhone.replace(/\s+/g, '')}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A3D36] text-white hover:bg-[#135E54] text-xs font-bold transition-all shadow-xs"
                      title="Appeler le responsable"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appeler</span>
                    </a>
                  )}

                  <a
                    href={`https://wa.me/${(selectedDept.leaderPhone || '+22997000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${selectedDept.leaderTitle} ${selectedDept.leaderName}, je vous contacte au sujet du ${selectedDept.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-xs"
                    title="Envoyer un WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {selectedDept.leaderEmail && (
                    <a
                      href={`mailto:${selectedDept.leaderEmail}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                      title="Email au responsable"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. FENÊTRE MEMBRES DU DÉPARTEMENT */}
            {/* ========================================================================= */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C59A27]" />
                    <span>Membres du Département ({selectedDept.membersList?.length || 0})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fidèles actifs engagés dans les activités et missions de ce pôle.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>+ Ajouter un Membre</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickJoin}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] border border-[#C59A27]/40 text-xs font-bold transition-all active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Rejoindre</span>
                  </button>
                </div>
              </div>

              {/* Local search in department members */}
              {selectedDept.membersList && selectedDept.membersList.length > 3 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={e => setMemberSearchQuery(e.target.value)}
                    placeholder="Filtrer un membre, un rôle ou une compétence..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0A3D36]"
                  />
                </div>
              )}

              {/* Members List Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredDeptMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={
                          member.photoUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                        }
                        alt={member.nom}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 truncate">
                          {member.prenom} {member.nom}
                        </h5>
                        <span className="text-[10px] font-bold text-[#0A3D36] bg-emerald-50 px-1.5 py-0.2 rounded-md block truncate">
                          {member.roleInDepartment}
                        </span>
                        {member.competences && member.competences.length > 0 && (
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">
                            {member.competences.slice(0, 2).join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Member Quick WhatsApp/Phone */}
                    <div className="flex items-center gap-1 shrink-0">
                      {member.telephone && (
                        <a
                          href={`https://wa.me/${member.telephone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Bonjour ${member.prenom}, je te contacte au sujet du ${selectedDept.name}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp direct"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.telephone && (
                        <a
                          href={`tel:${member.telephone.replace(/\s+/g, '')}`}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Appeler"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {filteredDeptMembers.length === 0 && (
                  <div className="col-span-full p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                    Aucun membre trouvé avec ce critère.
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3. ACTIVITÉS & ANNONCES */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {/* Activités */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Activités & Réunions</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedDept.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59A27] mt-1.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Annonces */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#C59A27]" />
                  <span>Annonces & Projets</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDept.announcements.map((ann, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#C59A27] shrink-0 mt-0.5" />
                      <span>{ann}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const dept = selectedDept.name;
                  setSelectedDept(null);
                  onOpenAssistantWithPrompt(
                    `Comment puis-je intégrer le ${dept} et quelles sont les exigences ?`
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0A3D36] rounded-xl text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Conseils d'intégration via IA</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="px-4 py-2 bg-[#0A3D36] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#135E54] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Department */}
      {showCreateModal && (
        <CreateDepartmentModal
          onClose={() => setShowCreateModal(false)}
          onDepartmentCreated={handleDepartmentCreated}
        />
      )}

      {/* Modal: Add Member to Department */}
      {showAddMemberModal && selectedDept && (
        <AddMemberToDepartmentModal
          department={selectedDept}
          existingUsers={existingUsers}
          onClose={() => setShowAddMemberModal(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
};
