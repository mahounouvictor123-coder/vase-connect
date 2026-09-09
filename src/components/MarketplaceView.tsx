import React, { useState, useMemo, useRef } from 'react';
import { ShoppingBag, Search, PlusCircle, MessageCircle, Tag, CheckCircle2, X, Filter, ArrowLeft, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ProductItem, ProductCategory, UserProfile } from '../types';

interface MarketplaceViewProps {
  products: ProductItem[];
  currentUser: UserProfile | null;
  onAddProduct: (newProduct: ProductItem) => void;
  onOpenAuth: () => void;
  onBackToHome?: () => void;
}

const CATEGORIES: { id: ProductCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Toutes les catégories' },
  { id: 'HIGH_TECH', label: '💻 High-Tech & PC' },
  { id: 'MODE_TEXTILE', label: '👗 Mode & Chaussures' },
  { id: 'ALIMENTATION', label: '🍰 Pâtisserie & Traiteur' },
  { id: 'SERVICES_PRO', label: '⚡ Services & Prestations' },
  { id: 'EDUCATION', label: '📚 Éducation & Formations' },
  { id: 'BEAUTE_SANTE', label: '🌿 Beauté & Santé' },
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  currentUser,
  onAddProduct,
  onOpenAuth,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('HIGH_TECH');
  const [newType, setNewType] = useState<'PRODUIT' | 'SERVICE' | 'FORMATION' | 'PRESTATION'>('PRODUIT');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (selectedType !== 'ALL' && p.type !== selectedType) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedType]);

  const handleWhatsAppContact = (product: ProductItem) => {
    const phone = product.sellerPhone || currentUser?.phone;
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Bonjour ${product.sellerName}, j'ai vu votre article "${product.title}" (${product.price.toLocaleString()} ${product.currency}) sur Vases Connect et je souhaiterais plus d'informations.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const priceNum = parseInt(newPrice.replace(/[^0-9]/g, ''), 10) || 0;
    const item: ProductItem = {
      id: 'prod-' + Date.now(),
      title: newTitle,
      category: newCategory,
      categoryLabel: CATEGORIES.find(c => c.id === newCategory)?.label.replace(/^[^\s]+\s/, '') || 'Divers',
      type: newType,
      description: newDescription,
      price: priceNum,
      currency: 'FCFA',
      sellerId: currentUser.id,
      sellerName: `${currentUser.firstName} ${currentUser.lastName}`,
      sellerPhone: currentUser.phone,
      sellerCity: currentUser.city,
      sellerPhoto: currentUser.photoUrl,
      sellerDepartment: currentUser.departmentName,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
      isAvailable: true,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    onAddProduct(item);
    setShowPublishModal(false);
    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImageUrl('');
    setNewTags('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0A3D36] to-[#0F4C44] p-6 rounded-3xl text-white shadow-md border border-[#C59A27]/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-amber-200 hover:text-white text-xs font-bold transition-all border border-white/20 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E5B22F]" />
                <span>Retour Accueil</span>
              </button>
            )}
            <span className="text-xs font-bold text-[#E5B22F] uppercase tracking-wider">
              Marketplace Communautaire
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
              {products.length} annonces actives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Vases Market</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
            Soutenez les activités économiques de nos frères et sœurs. Achetez, vendez et sollicitez des prestations de confiance au sein du Corps du Christ.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else setShowPublishModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#C59A27] hover:bg-[#D4A21D] text-[#062722] font-black text-xs rounded-2xl shadow-lg transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Vendre un produit / service</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit, ordinateur, robe, gâteau, formation..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-hidden focus:border-[#0A3D36]"
            >
              <option value="ALL">Tous les types</option>
              <option value="PRODUIT">Produits uniquement</option>
              <option value="SERVICE">Services uniquement</option>
              <option value="FORMATION">Formations</option>
              <option value="PRESTATION">Prestations</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#0A3D36]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {product.type}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0A3D36] font-black text-xs px-3 py-1.5 rounded-xl shadow-md border border-slate-100">
                  {product.price.toLocaleString()} {product.currency}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-[#0A3D36] transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Seller info */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <img
                    src={product.sellerPhoto}
                    alt={product.sellerName}
                    className="w-6 h-6 rounded-full object-cover border border-[#C59A27]"
                  />
                  <div className="text-[11px] truncate">
                    <span className="font-semibold text-slate-800">{product.sellerName}</span>
                    <span className="text-slate-400 ml-1">📍 {product.sellerCity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedProduct(product)}
                className="text-xs font-semibold text-[#0A3D36] hover:underline"
              >
                Détails
              </button>

              <button
                onClick={() => handleWhatsAppContact(product)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Commander WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            Aucun article ne correspond à votre recherche.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedType('ALL');
            }}
            className="text-xs font-bold text-[#0A3D36] underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0A3D36]" />
                <h3 className="font-bold text-base text-[#0A3D36]">Déposer une offre sur Vases Market</h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titre de l'article ou prestation *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Ordinateur Dell Core i7 / Confection gâteau mariage"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  >
                    <option value="HIGH_TECH">High-Tech & PC</option>
                    <option value="MODE_TEXTILE">Mode & Chaussures</option>
                    <option value="ALIMENTATION">Alimentation & Traiteur</option>
                    <option value="SERVICES_PRO">Services Professionnels</option>
                    <option value="EDUCATION">Éducation & Formation</option>
                    <option value="BEAUTE_SANTE">Beauté & Santé</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                  >
                    <option value="PRODUIT">Produit matériel</option>
                    <option value="SERVICE">Service</option>
                    <option value="FORMATION">Formation</option>
                    <option value="PRESTATION">Prestation technique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Prix (FCFA) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Ex: 25000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description complète</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Décrivez l'état, les caractéristiques et les conditions de livraison..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              {/* Visual Import Area */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 block">
                  Visuel du produit ou service <span className="text-red-500">*</span>
                </label>

                {newImageUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 bg-slate-50 group">
                    <img
                      src={newImageUrl}
                      alt="Aperçu visuel"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white text-[#0A3D36] text-xs font-bold shadow-md hover:bg-slate-100"
                      >
                        Changer le visuel
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewImageUrl('')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#0A3D36] rounded-2xl p-4 text-center bg-slate-50 hover:bg-emerald-50/40 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0A3D36] flex items-center justify-center mx-auto shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Cliquez pour importer une photo depuis votre appareil
                      </p>
                      <p className="text-[11px] text-slate-500">
                        PNG, JPG, WebP acceptés (haute qualité recommandée)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Alternative: URL field */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">Ou via lien :</span>
                  <input
                    type="url"
                    value={newImageUrl.startsWith('data:') ? '' : newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>

                {/* Curated quick suggestions */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Exemples de visuels prêts à l'emploi :
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {[
                      { label: 'Informatique', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80' },
                      { label: 'Couture & Mode', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80' },
                      { label: 'Pâtisserie', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80' },
                      { label: 'Services Pro', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80' },
                      { label: 'Formation', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewImageUrl(preset.url)}
                        className="shrink-0 text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-[#0A3D36] text-slate-600 rounded-lg transition-colors border border-slate-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mots-clés pour l'Assistant IA (séparés par des virgules)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="ordinateur, dell, bureautique, informatique"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold shadow-xs"
                >
                  Publier l'annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#C59A27] uppercase tracking-wider">
                  {selectedProduct.categoryLabel}
                </span>
                <h3 className="font-black text-lg text-[#0A3D36]">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={selectedProduct.imageUrl}
              alt=""
              className="w-full h-52 object-cover rounded-2xl border border-slate-200"
            />

            <div className="flex items-center justify-between bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-900">Prix communautaire :</span>
              <span className="text-base font-black text-[#0A3D36]">
                {selectedProduct.price.toLocaleString()} {selectedProduct.currency}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {selectedProduct.description}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={selectedProduct.sellerPhoto}
                alt=""
                className="w-10 h-10 rounded-full object-cover border-2 border-[#C59A27]"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">{selectedProduct.sellerName}</span>
                <span className="text-slate-500">{selectedProduct.sellerDepartment} • 📍 {selectedProduct.sellerCity}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fermer
              </button>
              <button
                onClick={() => handleWhatsAppContact(selectedProduct)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
