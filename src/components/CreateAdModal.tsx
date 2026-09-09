import React, { useState, useRef } from 'react';
import {
  X,
  Megaphone,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Tag,
  Phone,
  Store,
  MapPin,
  Trash2
} from 'lucide-react';
import { MemberAd, ProductCategory, UserProfile } from '../types';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ad: MemberAd) => void;
  currentUser: UserProfile | null;
}

const PRESET_AD_BANNERS = [
  {
    label: 'Mode, Vêtements & Couture',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Gâteaux, Pâtisserie & Traiteur',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'High-Tech, PC & Téléphonie',
    url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Audiovisuel & Studio Photo',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80'
  }
];

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('MODE_TEXTILE');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [discountBadge, setDiscountBadge] = useState('-15% avec le code VASES-BENI');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.whatsappNumber || currentUser?.phone || '+229 97 00 00 00');
  const [city, setCity] = useState(currentUser?.city || 'Cotonou');
  const [ctaText, setCtaText] = useState('Commander sur WhatsApp');
  const [bannerUrl, setBannerUrl] = useState(PRESET_AD_BANNERS[0].url);
  const [bannerPreview, setBannerPreview] = useState<string | null>(PRESET_AD_BANNERS[0].url);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBannerPreview(result);
      setBannerUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shopName.trim()) {
      alert('Veuillez renseigner le titre de la promotion et le nom de votre boutique.');
      return;
    }

    const categoryLabelMap: Record<ProductCategory, string> = {
      HIGH_TECH: 'High-Tech & Numérique',
      MODE_TEXTILE: 'Mode & Confection',
      ALIMENTATION: 'Alimentation & Traiteur',
      BEAUTE_SANTE: 'Beauté & Bien-être',
      MAISON_DECO: 'Maison & Décoration',
      EDUCATION: 'Formations & Éducation',
      AUTOMOBILE_TRANSPORT: 'Automobile & Transport',
      SERVICES_PRO: 'Services Professionnels'
    };

    const newAd: MemberAd = {
      id: 'ad-' + Date.now(),
      title: title.trim(),
      shopName: shopName.trim(),
      ownerId: currentUser?.id || 'guest',
      ownerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Membre Partenaire',
      ownerPhoto: currentUser?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      category,
      categoryLabel: categoryLabelMap[category] || 'Boutique',
      tagline: tagline.trim() || 'Des produits et services de qualité par des croyants engagés.',
      description: description.trim() || 'Contactez directement la boutique pour profiter de l\'offre.',
      discountBadge: discountBadge.trim() || undefined,
      bannerUrl: bannerPreview || bannerUrl,
      whatsappNumber: whatsappNumber.trim(),
      ctaText: ctaText.trim() || 'Contacter sur WhatsApp',
      featured: true,
      badgeLabel: 'Boutique Partenaire',
      city: city.trim() || 'Cotonou',
      viewsCount: 1,
      clicksCount: 0,
      createdAt: new Date().toISOString()
    };

    onSubmit(newAd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C59A27] via-[#D4AF37] to-[#0A3D36] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/15 px-2 py-0.5 rounded-md">
                Espace Publicitaire Vases Connect
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Promouvoir ma Boutique ou mes Produits
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Créez une bannière publicitaire visible par tous les fidèles et visiteurs de la communauté.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form id="create-ad-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Shop Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nom de votre Boutique ou Entreprise *
              </label>
              <div className="relative">
                <Store className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Ex: Atelier Grâce Confection, Eden Tech..."
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Titre de l'Offre Publicitaire *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Vente Privée Tenues de Fête & Mariage"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
              />
            </div>
          </div>

          {/* Category & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-[#0A3D36]"
              >
                <option value="MODE_TEXTILE">Mode & Confection</option>
                <option value="ALIMENTATION">Alimentation & Traiteur</option>
                <option value="HIGH_TECH">High-Tech & Matériel</option>
                <option value="SERVICES_PRO">Services Professionnels</option>
                <option value="BEAUTE_SANTE">Beauté & Bien-être</option>
                <option value="MAISON_DECO">Maison & Décoration</option>
                <option value="EDUCATION">Formations & Éducation</option>
                <option value="AUTOMOBILE_TRANSPORT">Automobile & Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Promo / Remise Spéciale
              </label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 text-amber-600 absolute left-3 top-3" />
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  placeholder="Ex: -20% Membres, Cadeau Offert, Livraison Gratuite..."
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>
          </div>

          {/* Slogan / Tagline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Slogan ou Phrase d'accroche percutante *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Confection de tenues de cérémonie sur mesure & Pagnes d'exception"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description de l'offre & Avantages
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentez vos produits phares, vos garanties, conditions de livraison..."
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
            />
          </div>

          {/* Banner Upload / Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bannière Visuelle Publicitaire
            </label>

            {/* Drag and drop upload */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                dragActive ? 'border-[#0A3D36] bg-emerald-50/50' : 'border-slate-300 hover:border-[#0A3D36] bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              {bannerPreview ? (
                <div className="space-y-2">
                  <img
                    src={bannerPreview}
                    alt="Aperçu Bannière"
                    className="max-h-36 mx-auto rounded-xl object-cover shadow-sm border border-slate-200"
                  />
                  <p className="text-[11px] font-bold text-emerald-700">
                    Bannière active. Cliquez pour importer une autre image.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Glissez votre visuel publicitaire ici</p>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="pt-2">
              <p className="text-[10px] text-slate-500 font-semibold mb-1">Ou sélectionnez un visuel suggéré :</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_AD_BANNERS.map((pre, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setBannerPreview(pre.url);
                      setBannerUrl(pre.url);
                    }}
                    className={`rounded-xl overflow-hidden border-2 transition-all aspect-video relative group ${
                      (bannerPreview === pre.url || bannerUrl === pre.url) ? 'border-[#0A3D36] scale-102' : 'border-transparent'
                    }`}
                  >
                    <img src={pre.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                      <span className="text-[9px] font-bold text-white leading-tight">{pre.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Numéro WhatsApp pour les commandes *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ville</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cotonou, Calavi..."
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#0A3D36]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold rounded-xl"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="create-ad-form"
            className="px-6 py-2.5 bg-gradient-to-r from-[#C59A27] to-[#0A3D36] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Lancer la Publicité</span>
          </button>
        </div>
      </div>
    </div>
  );
};
