import React from 'react';
import { Sparkles, ShoppingBag, Users, Briefcase, ArrowRight, CheckCircle2, MessageCircle, Calendar, MapPin, Heart, Megaphone, Tag, Store, Award, Church, GraduationCap, Scale, Landmark, Vote, Radio, Sprout, Coins, Truck, Palette, HeartPulse, ShieldAlert } from 'lucide-react';
import { UserProfile, ProductItem, OpportunityItem, ChurchEvent, CommunityPost, MemberAd } from '../types';
import { INFLUENCE_GATES } from '../data/influenceGatesData';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenAssistantWithPrompt: (prompt?: string) => void;
  onSelectMember: (member: UserProfile) => void;
  onSelectProduct: (product: ProductItem) => void;
  members: UserProfile[];
  products: ProductItem[];
  opportunities: OpportunityItem[];
  events: ChurchEvent[];
  posts: CommunityPost[];
  ads?: MemberAd[];
  onOpenCreateAd?: () => void;
  onOpenProfessionalProfile?: () => void;
  onSelectGate?: (gateId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenAssistantWithPrompt,
  onSelectMember,
  onSelectProduct,
  members,
  products,
  opportunities,
  events,
  posts,
  ads = [],
  onOpenCreateAd,
  onOpenProfessionalProfile,
  onSelectGate,
}) => {
  const nextEvent = events[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-8">
      {/* Hero Community Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A3D36] via-[#0D473E] to-[#062722] text-white p-6 sm:p-10 shadow-xl border border-[#C59A27]/30">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#C59A27]/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-200 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-[#C59A27] animate-ping" />
            <span>Assemblée Porte des Cieux • Vases d’Honneur</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Connecter les talents, les besoins et les opportunités.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl">
            Bienvenue sur l'écosystème numérique intelligent de notre église. Trouvez un artisan, achetez des produits entre fidèles ou découvrez des compétences vérifiées.
          </p>

          {/* Assistant Search Prompt Box */}
          <div className="pt-2">
            <div
              onClick={() => onOpenAssistantWithPrompt()}
              className="flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white text-slate-800 shadow-xl cursor-pointer hover:bg-amber-50/80 transition-all border-2 border-[#C59A27]/40 group"
            >
              <div className="flex items-center gap-3 pl-2">
                <Sparkles className="w-5 h-5 text-[#C59A27] group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                  « Qui vend des ordinateurs ou des chaussures dans l'église ? »
                </span>
              </div>
              <button className="px-4 py-2 bg-[#0A3D36] group-hover:bg-[#0D473E] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-colors">
                <span>Interroger l'IA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <button
          onClick={() => onSelectTab('portes')}
          className="bg-gradient-to-br from-[#0A3D36] to-[#135E54] text-white p-4 rounded-3xl border border-[#C59A27]/40 shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/15 text-[#F5DE98] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Church className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-200">12 Portes</h3>
              <span className="px-1.5 py-0.2 text-[8px] font-black bg-[#C59A27] text-[#0A3D36] rounded">LIVRE</span>
            </div>
            <p className="text-[10px] text-emerald-100 line-clamp-1">Transformer une Nation</p>
          </div>
        </button>

        <button
          onClick={() => onOpenAssistantWithPrompt()}
          className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-[#C59A27] shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C59A27] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D36]">Assistant Vases</h3>
            <p className="text-[11px] text-slate-500">Recherche IA intelligente</p>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('market')}
          className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-[#C59A27] shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0A3D36] flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D36]">Vases Market</h3>
            <p className="text-[11px] text-slate-500">{products.length} offres vérifiées</p>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('ads')}
          className="bg-white p-4 rounded-3xl border border-amber-300 hover:border-[#C59A27] shadow-xs hover:shadow-md transition-all text-left space-y-2 group relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#C59A27] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D36]">Publicités</h3>
              <span className="px-1.5 py-0.2 text-[9px] font-black bg-amber-500 text-slate-950 rounded">PROMO</span>
            </div>
            <p className="text-[11px] text-slate-500">Boutiques & Remises</p>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('membres')}
          className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-[#C59A27] shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D36]">Annuaire Talents</h3>
            <p className="text-[11px] text-slate-500">{members.length} membres qualifiés</p>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('opportunites')}
          className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-[#C59A27] shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0A3D36]">Opportunités</h3>
            <p className="text-[11px] text-slate-500">Emplois & Missions</p>
          </div>
        </button>
      </div>

      {/* Quick Action Banners: Pro Profile Definition & Launch Ad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => {
            if (onOpenProfessionalProfile) onOpenProfessionalProfile();
            else onSelectTab('profil');
          }}
          className="bg-gradient-to-r from-[#0A3D36] to-[#135E54] text-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#E5B22F] group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5B22F]">Membres & Artisans</span>
              <h4 className="text-sm sm:text-base font-black">Définir mon Profil Professionnel</h4>
              <p className="text-[11px] text-white/80">Indexez votre métier pour être proposé par l'Assistant IA.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#E5B22F] group-hover:translate-x-1 transition-transform" />
        </div>

        <div
          onClick={() => {
            if (onOpenCreateAd) onOpenCreateAd();
            else onSelectTab('ads');
          }}
          className="bg-gradient-to-r from-[#C59A27] to-[#d4af37] text-slate-950 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Commerces & Boutiques</span>
              <h4 className="text-sm sm:text-base font-black">Faire la Promotion de ma Boutique</h4>
              <p className="text-[11px] text-slate-800">Bannière publicitaire et remises pour les fidèles.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 12 Portes d'Influence (Pasteur Mohammed Sanogo) Section */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#0A3D36] text-[11px] font-black border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Ouvrage Apostolique • MOHAMMED SANOGO</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#0A3D36]">
              12 Portes d'Influence pour Transformer une Nation
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              D'après le livre du Pasteur Mohammed Sanogo : les chrétiens sont appelés à intervenir avec excellence et intégrité dans les 12 domaines clés d'activités pour transformer la société.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('portes')}
            className="px-4 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-xs flex items-center gap-2 self-start sm:self-center transition-all hover:scale-102 active:scale-95"
          >
            <span>Explorer les 12 Portes</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C59A27]" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
          {INFLUENCE_GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              onClick={() => {
                if (onSelectGate) onSelectGate(gate.id);
                else onSelectTab('portes');
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-[#0A3D36]/40 transition-all text-left flex items-start gap-2.5 group active:scale-95"
            >
              <div className="w-7 h-7 rounded-xl bg-[#0A3D36] text-[#C59A27] text-xs font-black flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {gate.number}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0A3D36] truncate">
                  {gate.name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {gate.subTitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Espace Publicitaire & Boutiques des Membres */}
      {ads && ads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#C59A27] uppercase tracking-wider">
                  Boutiques Sponsorisées
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  Offres exclusives fidèles
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#0A3D36]">
                Espace Publicitaire & Boutiques des Membres
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('ads')}
              className="text-xs font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
            >
              <span>Toutes les publicités ({ads.length})</span>
              <ArrowRight className="w-3 h-3 text-[#C59A27]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.slice(0, 3).map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ad.bannerUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {ad.discountBadge && (
                      <div className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{ad.discountBadge}</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 bg-[#0A3D36] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {ad.badgeLabel || 'Sponsorisé'}
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <p className="text-xs font-black drop-shadow-xs">{ad.shopName}</p>
                      <p className="text-[10px] text-slate-200">Par {ad.ownerName} • 📍 {ad.city}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0A3D36] line-clamp-1">
                      {ad.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {ad.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const cleanPhone = ad.whatsappNumber.replace(/[^0-9]/g, '');
                      window.open(`https://wa.me/${cleanPhone}?text=Bonjour, je vous contacte depuis Vases Connect au sujet de votre publicité "${ad.title}".`, '_blank');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Commander sur WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Market Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A3D36]">
              À la une sur Vases Market
            </h2>
            <p className="text-xs text-slate-500">Produits et services proposés par les membres</p>
          </div>
          <button
            onClick={() => onSelectTab('market')}
            className="text-xs font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3 h-3 text-[#C59A27]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 3).map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
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
                  <div className="absolute top-2 right-2 bg-white/95 text-[#0A3D36] font-black text-xs px-2.5 py-1 rounded-lg shadow-xs">
                    {product.price.toLocaleString()} {product.currency}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-[#0A3D36]">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Vendu par <strong className="text-slate-700">{product.sellerName}</strong> • 📍 {product.sellerCity}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0A3D36]">
                <span>Voir l'offre</span>
                <span className="text-[#C59A27] font-bold">Commander →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Church Talents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0A3D36]">
              Talents de notre Assemblée
            </h2>
            <p className="text-xs text-slate-500">Profils recommandés pour vos besoins quotidiens</p>
          </div>
          <button
            onClick={() => onSelectTab('membres')}
            className="text-xs font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
          >
            <span>Explorer l'annuaire</span>
            <ArrowRight className="w-3 h-3 text-[#C59A27]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {members.slice(0, 3).map(m => (
            <div
              key={m.id}
              onClick={() => onSelectMember(m)}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
            >
              <img
                src={m.photoUrl}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C59A27]"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-[#0A3D36]">
                    {m.firstName} {m.lastName}
                  </h3>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-semibold text-[#0A3D36] truncate">{m.profession}</p>
                <span className="text-[10px] text-slate-400 truncate block">📍 {m.city} • {m.departmentName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Event Feature */}
      {nextEvent && (
        <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 rounded-3xl p-6 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C59A27]" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Prochain Grand Rendez-vous
              </span>
            </div>
            <h3 className="text-lg font-black text-[#0A3D36]">{nextEvent.title}</h3>
            <p className="text-xs text-slate-600 max-w-xl">{nextEvent.description}</p>
            <p className="text-xs font-semibold text-slate-700">
              📅 {nextEvent.date} à {nextEvent.time} • 📍 {nextEvent.location}
            </p>
          </div>

          <button
            onClick={() => onSelectTab('evenements')}
            className="px-5 py-2.5 bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold text-xs rounded-2xl shadow-xs shrink-0 transition-colors"
          >
            En savoir plus & S'inscrire
          </button>
        </div>
      )}
    </div>
  );
};
