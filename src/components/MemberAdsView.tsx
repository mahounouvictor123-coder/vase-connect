import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  PlusCircle,
  Tag,
  Store,
  MapPin,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Eye,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { MemberAd, ProductCategory, UserProfile } from '../types';

interface MemberAdsViewProps {
  ads: MemberAd[];
  currentUser: UserProfile | null;
  onOpenCreateAd: () => void;
  onOpenAuth: () => void;
  onSelectTab: (tab: string) => void;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'Toutes les Boutiques' },
  { id: 'MODE_TEXTILE', label: 'Mode & Confection' },
  { id: 'ALIMENTATION', label: 'Alimentation & Traiteur' },
  { id: 'HIGH_TECH', label: 'High-Tech & Matériel' },
  { id: 'SERVICES_PRO', label: 'Services Professionnels' },
  { id: 'BEAUTE_SANTE', label: 'Beauté & Santé' },
];

export const MemberAdsView: React.FC<MemberAdsViewProps> = ({
  ads,
  currentUser,
  onOpenCreateAd,
  onOpenAuth,
  onSelectTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);

  const featuredAds = ads.filter(a => a.featured);
  const currentFeatured = featuredAds.length > 0 ? featuredAds[featuredIndex % featuredAds.length] : ads[0];

  const filteredAds = ads.filter(a => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchShop = a.shopName.toLowerCase().includes(q);
      const matchTagline = a.tagline.toLowerCase().includes(q);
      const matchOwner = a.ownerName.toLowerCase().includes(q);
      if (!matchTitle && !matchShop && !matchTagline && !matchOwner) return false;
    }
    return true;
  });

  const handleContactWhatsApp = (ad: MemberAd) => {
    const cleanPhone = ad.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${ad.ownerName}, j'ai vu votre publicité pour "${ad.shopName}" sur l'Espace Publicitaire Vases Connect ! Je souhaite profiter de votre offre "${ad.title}" (${ad.discountBadge || 'Offre Vases d\'Honneur'}).`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleShareAd = (ad: MemberAd) => {
    const text = `Découvrez l'offre "${ad.title}" de ${ad.shopName} sur Vases Connect ! Remise : ${ad.discountBadge || 'Exclusif fidèles'}`;
    if (navigator.share) {
      navigator.share({
        title: ad.shopName,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} - Contact WhatsApp : ${ad.whatsappNumber}`);
      setCopiedAdId(ad.id);
      setTimeout(() => setCopiedAdId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8 animate-fadeIn">
      {/* Top Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A3D36] via-[#135E54] to-[#0A3D36] text-white p-6 sm:p-10 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#C59A27]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectTab('accueil')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-amber-200 hover:text-white border border-white/20 transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E5B22F]" />
                <span>← Retour Accueil</span>
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-[#E5B22F] border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vitrine Commerciale & Économie Solidaire</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Espace Publicitaire & Boutiques des Membres
            </h1>
            <p className="text-sm text-white/80 leading-relaxed pt-1">
              Encourageons les commerces, créateurs et entreprises des frères et sœurs de l'église Vases d'Honneur. Découvrez des remises exclusives et commandez directement sur WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) onOpenAuth();
                else onOpenCreateAd();
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#d8a82d] hover:to-[#f0bf3c] text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Megaphone className="w-4 h-4 text-slate-950" />
              <span>Promouvoir ma Boutique</span>
            </button>
            <button
              onClick={() => onSelectTab('market')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Store className="w-4 h-4 text-[#E5B22F]" />
              <span>Voir le Catalogue Market</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <p className="text-lg sm:text-2xl font-black text-[#E5B22F]">{ads.length}</p>
            <p className="text-[11px] font-medium text-white/80">Boutiques Sponsorisées</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <p className="text-lg sm:text-2xl font-black text-white">100%</p>
            <p className="text-[11px] font-medium text-white/80">Entrepreneurs Chrétiens</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <p className="text-lg sm:text-2xl font-black text-emerald-300">-15% à -25%</p>
            <p className="text-[11px] font-medium text-white/80">Remises Réservées Membres</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
            <p className="text-lg sm:text-2xl font-black text-white">0 FCFA</p>
            <p className="text-[11px] font-medium text-white/80">Frais d'intermédiaire</p>
          </div>
        </div>
      </div>

      {/* Featured Ad Banner Carousel */}
      {currentFeatured && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group">
          <div className="h-80 sm:h-96 w-full relative">
            <img
              src={currentFeatured.bannerUrl}
              alt={currentFeatured.title}
              className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Banner content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#C59A27] text-slate-950 font-black text-xs rounded-full shadow-md">
                ★ SPONSORISÉ VASES CONNECT
              </span>
              {currentFeatured.discountBadge && (
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{currentFeatured.discountBadge}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white max-w-3xl leading-tight">
              {currentFeatured.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium leading-relaxed line-clamp-2">
              {currentFeatured.tagline} — {currentFeatured.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <img
                  src={currentFeatured.ownerPhoto}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C59A27]"
                />
                <div>
                  <p className="text-xs font-bold text-white">{currentFeatured.shopName}</p>
                  <p className="text-[11px] text-slate-300">
                    Par {currentFeatured.ownerName} • 📍 {currentFeatured.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleContactWhatsApp(currentFeatured)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentFeatured.ctaText || 'Commander sur WhatsApp'}</span>
                </button>
                <button
                  onClick={() => handleShareAd(currentFeatured)}
                  className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs transition-colors"
                  title="Partager cette annonce"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Arrows */}
          {featuredAds.length > 1 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
              <button
                onClick={() => setFeaturedIndex(prev => (prev > 0 ? prev - 1 : featuredAds.length - 1))}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="Précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeaturedIndex(prev => (prev + 1) % featuredAds.length)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="Suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une boutique, un produit, un artisan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0A3D36]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ads Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Toutes les Annonces & Boutiques
            </h3>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-md">
              {filteredAds.length}
            </span>
          </div>
          <button
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else onOpenCreateAd();
            }}
            className="text-xs font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ajouter une boutique</span>
          </button>
        </div>

        {filteredAds.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Store className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Aucune annonce trouvée dans cette catégorie.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Soyez le premier à promouvoir votre commerce ou activité auprès des frères et sœurs !
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={ad.bannerUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Badges on banner */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#0A3D36] text-white text-[10px] font-black uppercase rounded-lg shadow-sm">
                      {ad.badgeLabel || 'Boutique Certifiée'}
                    </span>
                    <span className="px-2.5 py-1 bg-white/90 text-slate-800 text-[10px] font-bold rounded-lg backdrop-blur-xs">
                      {ad.categoryLabel}
                    </span>
                  </div>

                  {ad.discountBadge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-md flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{ad.discountBadge}</span>
                      </span>
                    </div>
                  )}

                  {/* Shop name on image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div className="flex items-center gap-2">
                      <img
                        src={ad.ownerPhoto}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-xs font-black tracking-tight text-white drop-shadow-xs">{ad.shopName}</p>
                        <p className="text-[10px] text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{ad.city}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-[#0A3D36] transition-colors">
                      {ad.title}
                    </h4>
                    <p className="text-xs font-semibold text-[#C59A27]">{ad.tagline}</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{ad.description}</p>
                  </div>

                  {/* Owner & Department */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Propriétaire : <strong className="text-slate-800">{ad.ownerName}</strong></span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{ad.viewsCount} vues</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleContactWhatsApp(ad)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{ad.ctaText || 'Commander sur WhatsApp'}</span>
                    </button>
                    <button
                      onClick={() => handleShareAd(ad)}
                      className="p-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs transition-colors"
                      title="Partager"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  {copiedAdId === ad.id && (
                    <p className="text-[11px] text-emerald-600 font-bold text-center animate-fadeIn">
                      ✓ Lien de l'offre copié dans le presse-papiers !
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Callout Banner at bottom */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-[#0A3D36] text-[#E5B22F] flex items-center justify-center flex-shrink-0 shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              Vous avez un commerce, un atelier ou une entreprise ?
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Faites connaître vos produits, services et promotions aux milliers de fidèles de la communauté Vases d'Honneur et bénéficiez de commandes directes.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else onOpenCreateAd();
          }}
          className="px-6 py-3 bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs sm:text-sm font-black rounded-2xl shadow-md whitespace-nowrap transition-colors"
        >
          Créer mon annonce gratuitement
        </button>
      </div>
    </div>
  );
};
