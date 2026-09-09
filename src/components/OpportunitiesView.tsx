import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  UserCheck,
  Clock,
  MapPin,
  DollarSign,
  MessageCircle,
  X,
  Share2,
  Copy,
  Mail,
  Eye,
  FileText,
  Building,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { OpportunityItem, UserProfile, OpportunityType } from '../types';
import { JobPostingModal } from './JobPostingModal';

interface OpportunitiesViewProps {
  opportunities: OpportunityItem[];
  members: UserProfile[];
  currentUser: UserProfile | null;
  onAddOpportunity: (newOpp: OpportunityItem) => void;
  onSelectMember: (member: UserProfile) => void;
  onOpenAuth: () => void;
  onBackToHome?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  members,
  currentUser,
  onAddOpportunity,
  onSelectMember,
  onOpenAuth,
  onBackToHome,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [appliedOppIds, setAppliedOppIds] = useState<string[]>([]);
  const [copiedOppId, setCopiedOppId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const filteredOpps = opportunities.filter(o => {
    if (selectedType !== 'ALL' && o.type !== selectedType) return false;
    return true;
  });

  const handleApply = (opp: OpportunityItem) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setAppliedOppIds(prev => [...prev, opp.id]);
    const phone = opp.contactWhatsApp || '+22997123456';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Bonjour, je postule à votre offre "${opp.title}" (${opp.companyOrMinistry}) publiée sur Vases Connect. Voici mon profil : ${currentUser.firstName} ${currentUser.lastName} (${currentUser.profession}).`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleCopyOpp = (opp: OpportunityItem) => {
    const text = `📢 OFFRE D'EMPLOI / MISSION - VASES CONNECT
📌 Poste : ${opp.title}
🏢 Structure : ${opp.companyOrMinistry}
📍 Lieu : ${opp.location}
💼 Contrat : ${opp.contractType || opp.typeLabel}
💰 Rémunération : ${opp.compensation || 'Non précisé'}
🎯 Profil recherché : ${opp.requiredSkills.join(', ')}

📝 Description :
${opp.description}

📲 Contact WhatsApp : ${opp.contactWhatsApp || 'Sur la plateforme Vases Connect'}`;

    navigator.clipboard.writeText(text);
    setCopiedOppId(opp.id);
    setTimeout(() => setCopiedOppId(null), 2500);
  };

  const calculateMatchesForOpportunity = (opp: OpportunityItem) => {
    const reqSkills = opp.requiredSkills.map(s => s.toLowerCase());
    const matches = members.map(m => {
      const memberSkills = m.skills.map(s => s.toLowerCase());
      const common = reqSkills.filter(req => memberSkills.some(ms => ms.includes(req) || req.includes(ms)));
      const basePercent = Math.round((common.length / Math.max(reqSkills.length, 1)) * 100);
      const matchPercent = Math.min(Math.max(basePercent + (m.city.toLowerCase() === opp.location.toLowerCase() ? 10 : 0), 45), 98);

      return {
        member: m,
        matchPercent,
        matchingSkills: common,
      };
    });

    matches.sort((a, b) => b.matchPercent - a.matchPercent);
    return matches.slice(0, 3);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
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
              Espace Carrières & Ministères
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
              {opportunities.length} offres disponibles
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0A3D36]">
            Opportunités & Recrutement Intelligent
          </h1>
          <p className="text-xs text-slate-500 max-w-lg">
            Emplois, missions d'église, stages et recrutements qualifiés. Déposez des annonces avec affiches RH, flyers ou copiez-collez vos textes.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else setShowCreateModal(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shrink-0 transition-all hover:scale-102"
        >
          <PlusCircle className="w-4 h-4 text-[#C59A27]" />
          <span>Publier une offre / mission</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'Toutes les offres' },
          { id: 'RECRUTEMENT', label: 'Emploi / CDI / CDD' },
          { id: 'STAGE', label: 'Stages académiques / pro' },
          { id: 'BENEVOLAT', label: 'Bénévolat & Église' },
          { id: 'PARTENARIAT', label: 'Partenariats' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === t.id
                ? 'bg-[#0A3D36] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpps.map((opp) => {
          const isApplied = appliedOppIds.includes(opp.id);
          const topMatches = calculateMatchesForOpportunity(opp);

          return (
            <div
              key={opp.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#0A3D36]/10 text-[#0A3D36]">
                      {opp.typeLabel}
                    </span>
                    {opp.contractType && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {opp.contractType}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {opp.location}
                    </span>
                    {opp.compensation && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                        <DollarSign className="w-3 h-3" />
                        {opp.compensation}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{opp.title}</h3>
                  <p className="text-xs font-bold text-[#0A3D36] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opp.companyOrMinistry}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-normal">Publié par {opp.authorName}</span>
                  </p>
                </div>

                {/* Actions: Apply & Share/Copy */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyOpp(opp)}
                    className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Copier le texte de l'annonce"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copier</span>
                  </button>

                  <button
                    onClick={() => handleApply(opp)}
                    disabled={isApplied}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#0A3D36] hover:bg-[#0D473E] text-white active:scale-95'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Candidature envoyée</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-[#C59A27]" />
                        <span>Postuler sur WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {copiedOppId === opp.id && (
                <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold animate-fadeIn">
                  ✓ Descriptif complet de l'offre copié dans votre presse-papiers !
                </div>
              )}

              {/* Main Content with Optional Visual Poster */}
              <div className="flex flex-col md:flex-row gap-4">
                {opp.imageUrl && (
                  <div
                    onClick={() => setPreviewImageUrl(opp.imageUrl || null)}
                    className="w-full md:w-48 h-36 rounded-2xl overflow-hidden relative cursor-pointer group border border-slate-200 shrink-0"
                  >
                    <img
                      src={opp.imageUrl}
                      alt="Affiche RH"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                      <Eye className="w-4 h-4" />
                      <span>Agrandir l'affiche</span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                      Affiche Visuelle RH
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#F8FAF9] p-3.5 rounded-2xl border border-slate-100 whitespace-pre-line">
                    {opp.description}
                  </p>

                  {/* Required Skills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400">Compétences recherchées :</span>
                    {opp.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Contacts info if available */}
                  {(opp.contactWhatsApp || opp.contactEmail) && (
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      {opp.contactWhatsApp && (
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <strong className="text-slate-700">{opp.contactWhatsApp}</strong>
                        </span>
                      )}
                      {opp.contactEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          <strong className="text-slate-700">{opp.contactEmail}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Matching Candidates Section */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A3D36]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Profils de fidèles de l'église recommandés par l'IA :</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {topMatches.map(({ member, matchPercent }, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectMember(member)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 cursor-pointer flex items-center justify-between gap-2 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={member.photoUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-[#C59A27]"
                        />
                        <div className="truncate text-xs">
                          <p className="font-bold text-slate-800 truncate group-hover:text-[#0A3D36]">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{member.profession.split(' ')[0]}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#0A3D36] text-[#E5B22F] shrink-0">
                        {matchPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Multi-Tab Job Posting Modal */}
      <JobPostingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onAddOpportunity}
        currentUser={currentUser}
      />

      {/* Poster Image Zoom Modal */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-3xl w-full bg-transparent p-2 text-right" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full mb-2 inline-flex"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageUrl}
              alt="Affiche Complète"
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
