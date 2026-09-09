import React, { useState, useEffect } from 'react';
import { Sparkles, Search, ArrowRight, MessageCircle, Phone, CheckCircle2, UserCheck, AlertCircle, ShoppingBag, Briefcase, PlusCircle, ExternalLink, Share2, Filter, ArrowLeft, Home } from 'lucide-react';
import { AISearchResult, UserProfile, ProductItem, OpportunityItem } from '../types';
import { queryAIAssistant } from '../services/aiService';

interface AssistantViewProps {
  onSelectMember?: (member: UserProfile) => void;
  onSelectProduct?: (product: ProductItem) => void;
  onSelectOpportunity?: (opportunity: OpportunityItem) => void;
  onOpenCreatePost?: (initialText?: string) => void;
  initialPrompt?: string;
  onOpenMarket?: () => void;
  onOpenDirectory?: () => void;
  onBackToHome?: () => void;
}

const SAMPLE_QUERIES = [
  "Quelles sont les 12 Portes d'Influence pour Transformer une Nation du Pasteur Mohammed Sanogo ?",
  "Dans quelle porte pour Transformer une Nation dois-je m'inscrire selon mon métier ?",
  "Je cherche quelqu'un qui vend des ordinateurs",
  "Qui vend des chaussures dans l'église ?",
  "Je cherche une personne qui fait de la pâtisserie",
  "Trouve-moi quelqu'un qui maîtrise Excel",
  "Je cherche une couturière à Cotonou",
  "Qui peut créer un logo pour mon entreprise ?",
  "Je cherche un photographe pour un mariage",
  "Je cherche un jeune de l'église qui développe des applications",
  "Qui s'occupe de réparer les téléphones ?",
  "Je cherche un chauffeur ou transport"
];

export const AssistantView: React.FC<AssistantViewProps> = ({
  onSelectMember,
  onSelectProduct,
  onSelectOpportunity,
  onOpenCreatePost,
  initialPrompt,
  onOpenMarket,
  onOpenDirectory,
  onBackToHome,
}) => {
  const [queryInput, setQueryInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [activeDomainFilter, setActiveDomainFilter] = useState<'ALL' | 'MEMBERS' | 'PRODUCTS' | 'OPPORTUNITIES'>('ALL');

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setQueryInput(initialPrompt);
      handleSearch(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || queryInput;
    if (!q.trim()) return;

    setIsLoading(true);
    if (textToSearch) {
      setQueryInput(textToSearch);
    }

    try {
      const res = await queryAIAssistant(q);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleWhatsAppContact = (phone?: string, name?: string, subject?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${name || 'frère/sœur'}, je vous contacte via la plateforme Vases Connect concernant votre profil / produit (${subject || 'service communautaire'}).`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3 bg-gradient-to-b from-[#0A3D36]/10 via-[#0A3D36]/5 to-transparent p-6 rounded-3xl border border-[#C59A27]/20">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#0A3D36] text-xs font-bold shadow-xs border border-slate-200 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>← Retour à l'accueil</span>
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A3D36] text-white text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-[#E5B22F] animate-spin-slow" />
            <span>Assistant Vases IA • Église Vases d’Honneur</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#0A3D36] tracking-tight">
          Que recherchez-vous au sein de la communauté ?
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          « Connecter les talents, les besoins et les opportunités. » Posez votre question en langage naturel, l'Assistant Vases analyse les compétences, produits et services réellement enregistrés.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-[#C59A27]/40 focus-within:border-[#0A3D36] transition-colors p-1.5">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5 text-[#0A3D36]" />
            </div>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ex: Je cherche quelqu'un qui vend des ordinateurs..."
              className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0A3D36] hover:bg-[#0D473E] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Recherche...</span>
                </>
              ) : (
                <>
                  <span>Trouver</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggested Queries Chips */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Exemples de demandes fréquentes :
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto">
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(sample)}
                className="text-[11px] bg-white hover:bg-amber-50 hover:border-[#C59A27] border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-all shadow-2xs text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0A3D36]/10 flex items-center justify-center text-[#0A3D36]">
            <Sparkles className="w-6 h-6 animate-spin text-[#C59A27]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-[#0A3D36]">Consultation de l'écosystème Vases Connect...</h3>
            <p className="text-xs text-slate-500">
              Extraction des intentions, analyse des compétences réelles, filtrage de confidentialité et calcul des scores.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-gradient-to-r from-[#0A3D36] to-[#C59A27] animate-progress" />
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !isLoading && (
        <div className="space-y-6">
          {/* Natural Language Summary Banner */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A3D36] text-[#C59A27] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A3D36]">
                    Réponse de l'Assistant Vases
                  </span>
                  <h3 className="text-xs text-slate-500">
                    Requête : « {result.query} »
                  </h3>
                </div>
              </div>

              {result.extractedCriteria.location && (
                <span className="text-[10px] bg-emerald-50 text-[#0A3D36] border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  📍 {result.extractedCriteria.location}
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-[#F8FAF9] p-3 rounded-xl border border-slate-100">
              {result.naturalAnswer}
            </p>

            {/* Filter Pills if results exist */}
            {!result.noResultsFound && (
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs overflow-x-auto">
                <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filtrer :
                </span>
                <button
                  onClick={() => setActiveDomainFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeDomainFilter === 'ALL' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tous ({result.matchedMembers.length + result.matchedProducts.length + result.matchedOpportunities.length})
                </button>
                {result.matchedMembers.length > 0 && (
                  <button
                    onClick={() => setActiveDomainFilter('MEMBERS')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeDomainFilter === 'MEMBERS' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Membres ({result.matchedMembers.length})
                  </button>
                )}
                {result.matchedProducts.length > 0 && (
                  <button
                    onClick={() => setActiveDomainFilter('PRODUCTS')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeDomainFilter === 'PRODUCTS' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Vases Market ({result.matchedProducts.length})
                  </button>
                )}
                {result.matchedOpportunities.length > 0 && (
                  <button
                    onClick={() => setActiveDomainFilter('OPPORTUNITIES')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeDomainFilter === 'OPPORTUNITIES' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Opportunités ({result.matchedOpportunities.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* NO RESULTS VIEW */}
          {result.noResultsFound && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-sm font-bold text-[#0A3D36]">
                  Aucun membre ou produit ne correspond à ces critères précis
                </h3>
                <p className="text-xs text-slate-600">
                  Rappel : l'Assistant Vases ne fabrique aucune fausse information. Vous pouvez formuler un besoin dans l'espace communautaire afin que les membres puissent vous répondre !
                </p>
              </div>

              <button
                onClick={() => onOpenCreatePost(`[Recherche de service] Bonjour, je suis à la recherche de : ${result.query}. Quelqu'un dans l'église propose-t-il cette prestation ?`)}
                className="inline-flex items-center gap-2 bg-[#0A3D36] hover:bg-[#0D473E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-[#C59A27]" />
                <span>Publier une demande dans la communauté</span>
              </button>
            </div>
          )}

          {/* MATCHED MEMBERS SECTION */}
          {(activeDomainFilter === 'ALL' || activeDomainFilter === 'MEMBERS') && result.matchedMembers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0A3D36] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C59A27]" />
                  <span>Membres identifiés ({result.matchedMembers.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Classés par pertinence IA</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.matchedMembers.map(({ member, relevanceReason, matchScore }) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Avatar, Name, Match Badge */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.photoUrl}
                            alt={member.firstName}
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-[#C59A27]/40 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-slate-900">
                                {member.firstName} {member.lastName}
                              </h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <p className="text-xs font-medium text-[#0A3D36] line-clamp-1">
                              {member.profession}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              📍 {member.city} • {member.departmentName}
                            </p>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-black rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                            {matchScore}% match
                          </span>
                        </div>
                      </div>

                      {/* Relevance reason from AI */}
                      <div className="bg-[#F8FAF9] px-2.5 py-1.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 mb-3">
                        <span className="font-semibold text-[#0A3D36]">Pourquoi ce membre : </span>
                        {relevanceReason}
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.skills.slice(0, 4).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] rounded-md font-medium bg-slate-100 text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectMember(member)}
                        className="text-xs font-semibold text-[#0A3D36] hover:underline flex items-center gap-1"
                      >
                        <span>Voir profil</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {member.whatsappNumber && (
                          <button
                            onClick={() => handleWhatsAppContact(member.whatsappNumber, member.firstName, member.profession)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs active:scale-95"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                        {member.phonePublic && (
                          <a
                            href={`tel:${member.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
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
            </div>
          )}

          {/* MATCHED PRODUCTS / SERVICES SECTION */}
          {(activeDomainFilter === 'ALL' || activeDomainFilter === 'PRODUCTS') && result.matchedProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0A3D36] flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#C59A27]" />
                  <span>Articles & Prestations Vases Market ({result.matchedProducts.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Vérifiés par la communauté</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.matchedProducts.map(({ product, relevanceReason }) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 left-2 bg-[#0A3D36] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {product.type}
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[#0A3D36] font-black text-xs px-2.5 py-1 rounded-lg shadow-xs">
                          {product.price.toLocaleString()} {product.currency}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={product.sellerPhoto}
                            alt={product.sellerName}
                            className="w-6 h-6 rounded-full object-cover border border-[#C59A27]"
                          />
                          <div className="text-[11px]">
                            <span className="font-semibold text-slate-800">{product.sellerName}</span>
                            <span className="text-slate-400 ml-1">📍 {product.sellerCity}</span>
                          </div>
                        </div>

                        <div className="bg-amber-50/80 p-2 rounded-lg text-[10px] text-amber-900 border border-amber-200">
                          {relevanceReason}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="text-xs font-semibold text-[#0A3D36] hover:underline"
                      >
                        Voir les détails
                      </button>

                      {product.sellerPhone && (
                        <button
                          onClick={() => handleWhatsAppContact(product.sellerPhone, product.sellerName, product.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#0D473E] text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span>Commander</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATCHED OPPORTUNITIES SECTION */}
          {(activeDomainFilter === 'ALL' || activeDomainFilter === 'OPPORTUNITIES') && result.matchedOpportunities.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0A3D36] flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#C59A27]" />
                  <span>Opportunités & Recrutements ({result.matchedOpportunities.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {result.matchedOpportunities.map(({ opportunity, relevanceReason }) => (
                  <div
                    key={opportunity.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {opportunity.typeLabel}
                        </span>
                        <span className="text-xs text-slate-500">📍 {opportunity.location}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{opportunity.title}</h4>
                      <p className="text-xs text-slate-600">{opportunity.companyOrMinistry}</p>
                      <p className="text-[11px] text-emerald-700 font-medium">{relevanceReason}</p>
                    </div>

                    <button
                      onClick={() => onSelectOpportunity(opportunity)}
                      className="px-4 py-2 bg-[#0A3D36] hover:bg-[#0D473E] text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
                    >
                      Voir les candidats & Postuler
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
