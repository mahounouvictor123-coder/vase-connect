import React, { useState, useMemo } from 'react';
import { Search, Filter, MessageCircle, Phone, CheckCircle2, User, MapPin, Briefcase, Sparkles, ExternalLink, ShieldCheck, X, ArrowLeft } from 'lucide-react';
import { UserProfile, ProductItem } from '../types';

interface MembersDirectoryViewProps {
  members: UserProfile[];
  products: ProductItem[];
  onSelectMember: (member: UserProfile) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onBackToHome?: () => void;
}

const CATEGORY_FILTERS = [
  { id: 'ALL', label: 'Tous les membres' },
  { id: 'TECH', label: '💻 Informatique & IA' },
  { id: 'DESIGN', label: '🎨 Design & Photo' },
  { id: 'MODE', label: '✂️ Couture & Mode' },
  { id: 'FOOD', label: '🍰 Pâtisserie & Traiteur' },
  { id: 'FINANCE', label: '📊 Finance & Excel' },
  { id: 'REPAIR', label: '🔧 Technique & Réparation' },
  { id: 'TRANSPORT', label: '🚗 Transport' },
];

export const MembersDirectoryView: React.FC<MembersDirectoryViewProps> = ({
  members,
  products,
  onSelectMember,
  onOpenAssistantWithPrompt,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedMemberModal, setSelectedMemberModal] = useState<UserProfile | null>(null);

  // Departments list from members
  const departments = useMemo(() => {
    const set = new Set(members.map(m => m.departmentName));
    return Array.from(set);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.profession.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q)) ||
        m.activities.some(a => a.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedDepartment !== 'ALL' && m.departmentName !== selectedDepartment) {
        return false;
      }

      if (selectedCategory === 'TECH') {
        return m.skills.some(s => ['React', 'TypeScript', 'Firebase', 'IA', 'Python', 'Node.js', 'React Native'].includes(s));
      }
      if (selectedCategory === 'DESIGN') {
        return m.skills.some(s => ['Photoshop', 'Illustrator', 'Canva', 'Photographie', 'Vidéographie'].includes(s));
      }
      if (selectedCategory === 'MODE') {
        return m.skills.some(s => s.toLowerCase().includes('couture') || s.toLowerCase().includes('mode') || s.toLowerCase().includes('stylisme'));
      }
      if (selectedCategory === 'FOOD') {
        return m.skills.some(s => s.toLowerCase().includes('pâtisserie') || s.toLowerCase().includes('traiteur'));
      }
      if (selectedCategory === 'FINANCE') {
        return m.skills.some(s => ['Excel', 'Comptabilité', 'PowerBI', 'Fiscalité'].includes(s));
      }
      if (selectedCategory === 'REPAIR') {
        return m.skills.some(s => s.toLowerCase().includes('réparation') || s.toLowerCase().includes('maintenance') || s.toLowerCase().includes('électronique'));
      }
      if (selectedCategory === 'TRANSPORT') {
        return m.skills.some(s => s.toLowerCase().includes('transport') || s.toLowerCase().includes('chauffeur'));
      }

      return true;
    });
  }, [members, searchTerm, selectedCategory, selectedDepartment]);

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Bonjour frère/sœur ${name}, je vous contacte depuis Vases Connect.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#0A3D36] hover:text-white text-[#0A3D36] text-xs font-bold transition-all border border-slate-200 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Retour Accueil</span>
              </button>
            )}
            <span className="text-xs font-bold text-[#C59A27] uppercase tracking-wider">
              Communauté Vases d'Honneur
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0A3D36] text-[10px] font-bold">
              {members.length} membres enregistrés
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A3D36]">
            Annuaire des Talents & Compétences
          </h1>
          <p className="text-xs text-slate-500">
            Découvrez les professionnels, artisans et serviteurs de notre communauté.
          </p>
        </div>

        {/* Quick link to AI Assistant */}
        <button
          onClick={() => onOpenAssistantWithPrompt("Trouve-moi un membre pour m'aider")}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A3D36] to-[#135E54] text-white text-xs font-bold rounded-2xl shadow-sm border border-[#C59A27]/40 hover:opacity-95 shrink-0 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#E5B22F]" />
          <span>Trouver un profil avec l'Assistant IA</span>
        </button>
      </div>

      {/* Search & Filters Controls */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, compétence (React, Excel...), métier, ville..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-hidden focus:border-[#0A3D36]"
            >
              <option value="ALL">Tous les départements</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0A3D36] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header card with avatar */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative">
                  <img
                    src={member.photoUrl}
                    alt={member.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C59A27] shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Actif" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {member.firstName} {member.lastName}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>

                  <p className="text-xs font-semibold text-[#0A3D36] truncate">
                    {member.profession}
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {member.city}
                    </span>
                    <span>•</span>
                    <span className="truncate">{member.departmentName}</span>
                  </div>
                </div>
              </div>

              {/* Bio excerpt */}
              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {member.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {member.skills.slice(0, 4).map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] rounded-md font-medium bg-slate-100 text-slate-700"
                  >
                    {s}
                  </span>
                ))}
                {member.skills.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-md font-medium bg-slate-50 text-slate-400">
                    +{member.skills.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedMemberModal(member)}
                className="text-xs font-semibold text-[#0A3D36] hover:text-[#0D473E] flex items-center gap-1"
              >
                <span>Fiche complète</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1.5">
                {member.whatsappNumber && (
                  <button
                    onClick={() => handleWhatsApp(member.whatsappNumber, member.firstName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                )}
                {member.phonePublic && (
                  <a
                    href={`tel:${member.phone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
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

      {filteredMembers.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            Aucun membre ne correspond à vos critères actuels.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedDepartment('ALL');
            }}
            className="text-xs font-bold text-[#0A3D36] underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMemberModal.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C59A27]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-black text-[#0A3D36]">
                      {selectedMemberModal.firstName} {selectedMemberModal.lastName}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{selectedMemberModal.profession}</p>
                  <p className="text-[11px] text-slate-400">
                    {selectedMemberModal.departmentName} • 📍 {selectedMemberModal.city}, {selectedMemberModal.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMemberModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Completion & Availability */}
            <div className="grid grid-cols-2 gap-2 bg-[#F8FAF9] p-3 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Statut</span>
                <span className="font-bold text-emerald-700">✓ {selectedMemberModal.status}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Référencement IA</span>
                <span className="font-bold text-[#C59A27]">{selectedMemberModal.completionScore}% complété</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Présentation</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {selectedMemberModal.bio}
              </p>
            </div>

            {/* Compétences */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Compétences maîtrisées</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMemberModal.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg font-medium bg-emerald-50 text-[#0A3D36] border border-emerald-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Activités */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Activités & Services proposés</h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {selectedMemberModal.activities.map((act, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59A27]" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedMemberModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fermer
              </button>

              {selectedMemberModal.whatsappNumber && (
                <button
                  onClick={() => handleWhatsApp(selectedMemberModal.whatsappNumber, selectedMemberModal.firstName)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contacter sur WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
