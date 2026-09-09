import React, { useState } from 'react';
import { Shield, Users, ShoppingBag, Briefcase, Sparkles, CheckCircle2, AlertTriangle, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { UserProfile, ProductItem, OpportunityItem } from '../types';

interface AdminViewProps {
  members: UserProfile[];
  products: ProductItem[];
  opportunities: OpportunityItem[];
  onToggleVerifyMember: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onBackToHome?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  members,
  products,
  opportunities,
  onToggleVerifyMember,
  onDeleteProduct,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'MEMBERS' | 'PRODUCTS'>('STATS');

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#0A3D36] hover:text-white text-[#0A3D36] text-xs font-bold transition-all border border-slate-200 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>← Retour Accueil</span>
              </button>
            )}
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Administration & Modération
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0A3D36]">Tableau de Bord Pasteurs & Responsables</h1>
          <p className="text-xs text-slate-500">
            Supervision des membres, des annonces Vases Market et de l'Assistant IA Vases Connect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STATS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'STATS' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Statistiques
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'MEMBERS' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Membres ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              activeTab === 'PRODUCTS' ? 'bg-[#0A3D36] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Market ({products.length})
          </button>
        </div>
      </div>

      {/* STATS VIEW */}
      {activeTab === 'STATS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Membres Actifs</span>
              <p className="text-2xl sm:text-3xl font-black text-[#0A3D36]">{members.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">100% avec numéro vérifié</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Offres Market</span>
              <p className="text-2xl sm:text-3xl font-black text-[#C59A27]">{products.length}</p>
              <span className="text-[10px] text-slate-500">Produits & Services</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Opportunités</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-600">{opportunities.length}</p>
              <span className="text-[10px] text-blue-500">Stages, Emplois, Missions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Recherches IA / Mois</span>
              <p className="text-2xl sm:text-3xl font-black text-purple-600">842</p>
              <span className="text-[10px] text-purple-500">Assistant Vases actif</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#0A3D36] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59A27]" />
              <span>Intention de recherche les plus posées à l'Assistant Vases</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span>« Ordinateurs & informatique »</span>
                <span className="font-bold text-[#0A3D36]">32% des requêtes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span>« Chaussures & prêt-à-porter »</span>
                <span className="font-bold text-[#0A3D36]">24% des requêtes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span>« Pâtisserie & traiteur événementiel »</span>
                <span className="font-bold text-[#0A3D36]">19% des requêtes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                <span>« Création de logos & graphisme »</span>
                <span className="font-bold text-[#0A3D36]">15% des requêtes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS TABLE */}
      {activeTab === 'MEMBERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0A3D36]">Gestion des membres</h3>
            <span className="text-xs text-slate-400">{members.length} enregistrés</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Membre</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Profession</th>
                  <th className="p-3">Département</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="p-3 flex items-center gap-2">
                      <img src={m.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-semibold text-slate-900">{m.firstName} {m.lastName}</span>
                    </td>
                    <td className="p-3 font-mono">{m.phone}</td>
                    <td className="p-3">{m.profession}</td>
                    <td className="p-3">{m.departmentName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A3D36]/10 text-[#0A3D36]">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleVerifyMember(m.id)}
                        className="text-emerald-700 hover:underline font-semibold text-[11px]"
                      >
                        Vérifié ✓
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGEMENT */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0A3D36]">Annonces en ligne</h3>
            <span className="text-xs text-slate-400">{products.length} articles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Article</th>
                  <th className="p-3">Vendeur</th>
                  <th className="p-3">Prix</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3 text-right">Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3 flex items-center gap-2">
                      <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-900 line-clamp-1">{p.title}</span>
                    </td>
                    <td className="p-3">{p.sellerName}</td>
                    <td className="p-3 font-bold text-[#0A3D36]">{p.price.toLocaleString()} {p.currency}</td>
                    <td className="p-3">{p.categoryLabel}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Retirer l'annonce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
