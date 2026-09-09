import React, { useState, useEffect } from 'react';
import { UserProfile, ProductItem } from '../types';
import { Shield, Sparkles, CheckCircle2, Phone, MapPin, Edit3, Lock, Eye, EyeOff, Plus, Trash2, ShoppingBag, LogOut, Award, Briefcase, Download, Smartphone, Share, X, Church, ArrowRight } from 'lucide-react';
import { INFLUENCE_GATES } from '../data/influenceGatesData';

interface ProfileViewProps {
  currentUser: UserProfile | null;
  products: ProductItem[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectTab: (tab: string) => void;
  onOpenProfessionalProfile?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  products,
  onUpdateProfile,
  onOpenAuth,
  onLogout,
  onSelectTab,
  onOpenProfessionalProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(currentUser?.firstName || '');
  const [editLastName, setEditLastName] = useState(currentUser?.lastName || '');
  const [editProfession, setEditProfession] = useState(currentUser?.profession || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Cotonou');
  const [editSkills, setEditSkills] = useState(currentUser?.skills.join(', ') || '');
  const [editActivities, setEditActivities] = useState(currentUser?.activities.join(', ') || '');
  const [phonePublic, setPhonePublic] = useState(currentUser?.phonePublic ?? true);
  const [availableOpp, setAvailableOpp] = useState(currentUser?.availableForOpportunities ?? true);
  const [availableMiss, setAvailableMiss] = useState(currentUser?.availableForMissions ?? true);

  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <img
          src="/pwa-192x192.png"
          alt="Logo Vases Connect"
          className="w-20 h-20 rounded-3xl object-cover shadow-md mx-auto border-2 border-[#C59A27]/60"
        />
        <h2 className="text-xl font-black text-[#0A3D36]">Espace Membre Vases Connect</h2>
        <p className="text-xs text-slate-600">
          Connectez-vous avec votre numéro de téléphone (code OTP) pour gérer votre profil et vos annonces.
        </p>
        <button
          onClick={onOpenAuth}
          className="w-full py-3 bg-[#0A3D36] text-white rounded-2xl text-xs font-bold shadow-md hover:bg-[#0D473E] transition-colors"
        >
          Se connecter avec mon numéro de téléphone
        </button>
      </div>
    );
  }

  const myProducts = products.filter(p => p.sellerId === currentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      profession: editProfession,
      bio: editBio,
      city: editCity,
      skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
      activities: editActivities.split(',').map(s => s.trim()).filter(Boolean),
      phonePublic,
      availableForOpportunities: availableOpp,
      availableForMissions: availableMiss,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Background accent banner */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36]" />

        <div className="relative pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={currentUser.photoUrl}
              alt=""
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-slate-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-[#0A3D36]">{currentUser.profession}</p>
              <p className="text-[11px] text-slate-500">
                {currentUser.departmentName} • 📍 {currentUser.city}, {currentUser.country}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenProfessionalProfile && (
              <button
                onClick={onOpenProfessionalProfile}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:scale-102"
              >
                <Award className="w-3.5 h-3.5 text-[#E5B22F]" />
                <span>Définir mon Profil Professionnel</span>
              </button>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Annuler' : 'Modifier'}</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59A27]" />
              <span className="text-xs font-black text-[#0A3D36]">
                Score de Référencement IA : {currentUser.completionScore}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Votre profil est hautement qualifié pour être proposé par l'Assistant Vases lors des recherches des membres.
            </p>
          </div>

          <div className="w-full sm:w-36 h-2.5 bg-amber-200/80 rounded-full overflow-hidden shrink-0">
            <div
              className="h-full bg-gradient-to-r from-[#C59A27] to-[#0A3D36] rounded-full"
              style={{ width: `${currentUser.completionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Edit Form or Details View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#0A3D36]">Modifier mes informations</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Prénom</label>
              <input
                type="text"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nom</label>
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Profession / Métier</label>
            <input
              type="text"
              value={editProfession}
              onChange={(e) => setEditProfession(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Ville</label>
            <input
              type="text"
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Présentation / Bio</label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Compétences (séparées par des virgules)</label>
            <input
              type="text"
              value={editSkills}
              onChange={(e) => setEditSkills(e.target.value)}
              placeholder="React, Excel, Couture, Pâtisserie..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Activités et Prestations proposées</label>
            <input
              type="text"
              value={editActivities}
              onChange={(e) => setEditActivities(e.target.value)}
              placeholder="Vente d'ordinateurs, Création de logos, Formation..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Privacy Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800">Paramètres de confidentialité</h4>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={phonePublic}
                onChange={(e) => setPhonePublic(e.target.checked)}
                className="rounded text-[#0A3D36]"
              />
              <span>Rendre mon numéro de téléphone public aux membres connectés</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOpp}
                onChange={(e) => setAvailableOpp(e.target.checked)}
                className="rounded text-[#0A3D36]"
              />
              <span>Disponible pour les opportunités professionnelles</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableMiss}
                onChange={(e) => setAvailableMiss(e.target.checked)}
                className="rounded text-[#0A3D36]"
              />
              <span>Disponible pour les missions & besoins du ministère de l'église</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0A3D36] text-white font-bold shadow-xs"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Présentation</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-[#F8FAF9] p-3 rounded-2xl border border-slate-100">
                {currentUser.bio}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Compétences</h3>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-emerald-50 text-[#0A3D36] border border-emerald-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Activités enregistrées</h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {currentUser.activities.map((act, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59A27]" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mes 12 Portes d'Influence */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Church className="w-4 h-4 text-[#0A3D36]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    12 Portes d'Influence pour Transformer une Nation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('portes')}
                  className="text-[11px] font-bold text-[#0A3D36] hover:underline flex items-center gap-1"
                >
                  <span>Gérer</span>
                  <ArrowRight className="w-3 h-3 text-[#C59A27]" />
                </button>
              </div>

              {currentUser.influenceGates && currentUser.influenceGates.length > 0 ? (
                <div className="space-y-2">
                  {currentUser.influenceGates.map((gId) => {
                    const gate = INFLUENCE_GATES.find(g => g.id === gId);
                    const profile = currentUser.gateProfiles ? currentUser.gateProfiles[gId] : undefined;
                    if (!gate) return null;
                    return (
                      <div
                        key={gId}
                        onClick={() => onSelectTab('portes')}
                        className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-100/60 transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#0A3D36]">
                            Porte {gate.number} • {gate.name}
                          </span>
                          {profile?.roleInGate && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-amber-200">
                              {profile.roleInGate}
                            </span>
                          )}
                        </div>
                        {profile?.visionImpact && (
                          <p className="text-[11px] text-slate-600 italic line-clamp-2">
                            « {profile.visionImpact} »
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    Vous n'êtes pas encore inscrit dans l'une des 12 fenêtres d'influence apostolique.
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectTab('portes')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0A3D36] text-white text-xs font-bold shadow-xs hover:bg-[#135E54]"
                  >
                    Choisir ma Porte d'Influence
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: My Marketplace products & settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C59A27]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Mes annonces Vases Market ({myProducts.length})
                  </h3>
                </div>
                <button
                  onClick={() => onSelectTab('market')}
                  className="text-xs font-bold text-[#0A3D36] hover:underline"
                >
                  Ajouter
                </button>
              </div>

              {myProducts.length > 0 ? (
                <div className="space-y-2">
                  {myProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-slate-900 truncate">{p.title}</p>
                        <p className="text-[#0A3D36] font-bold">{p.price.toLocaleString()} {p.currency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                  Vous n'avez pas encore déposé d'article en vente.
                </div>
              )}
            </div>

            {/* Privacy Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0A3D36]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Confidentialité des données
                </h3>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span>Numéro de téléphone :</span>
                  <span className="font-bold text-[#0A3D36]">
                    {currentUser.phonePublic ? 'Visible aux membres' : 'Masqué (protégé)'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span>Identifiant unique :</span>
                  <span className="font-mono text-slate-700">{currentUser.phone}</span>
                </div>
              </div>
            </div>

            {/* PWA & Netlify Home Screen App Card */}
            <div className="bg-gradient-to-br from-[#0A3D36] via-[#0D4B42] to-[#145E54] text-white rounded-3xl p-6 shadow-md space-y-4 border border-[#C59A27]/40 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#C59A27]/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/pwa-192x192.png"
                    alt="Logo Vases Connect"
                    className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-[#C59A27]/70 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E5B22F] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Application Mobile & PWA
                    </span>
                    <h3 className="text-sm font-black">Ajouter à l'écran d'accueil</h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono font-bold text-amber-200">
                  Netlify Ready
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                Profitez de Vases Connect comme d'une vraie application native : icône officielle dorée sur l'écran d'accueil, affichage plein écran sans barre d'adresse et chargement instantané.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleInstallApp}
                  className="flex-1 py-2.5 px-3.5 bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#d4a92c] hover:to-[#f0c246] text-[#062722] font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Installer sur l'écran</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(true)}
                  className="py-2.5 px-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-amber-300" />
                  <span>Guide pas à pas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Installation Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="Vases Connect"
                  className="w-12 h-12 rounded-2xl shadow-md border-2 border-[#C59A27]/50"
                />
                <div>
                  <h3 className="font-black text-sm text-[#0A3D36]">Installer comme une Application</h3>
                  <p className="text-xs text-slate-500">iPhone, Android ou ordinateur (Netlify)</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* iPhone / Safari */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <p className="font-bold text-[#0A3D36] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#C59A27]" />
                  <span>Sur iPhone / iPad (Safari) :</span>
                </p>
                <ol className="space-y-1.5 pl-5 list-decimal text-slate-700">
                  <li>Appuyez sur l'icône de <strong>Partage</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> au bas de Safari.</li>
                  <li>Défilez et appuyez sur <strong>« Sur l'écran d'accueil »</strong>.</li>
                  <li>Appuyez sur <strong>Ajouter</strong> en haut à droite.</li>
                </ol>
              </div>

              {/* Android / Chrome */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <p className="font-bold text-[#0A3D36] flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Sur Android (Chrome / Samsung) :</span>
                </p>
                <ol className="space-y-1.5 pl-5 list-decimal text-slate-700">
                  <li>Ouvrez le menu (les <strong>3 points ⋮</strong> en haut à droite).</li>
                  <li>Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
                  <li>L'icône officielle s'installera directement sur votre écran d'accueil.</li>
                </ol>
              </div>

              {/* PC / Mac / Netlify */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-800">Sur Ordinateur (Chrome / Edge) :</p>
                <p className="text-slate-600">
                  Cliquez sur l'icône d'installation <Download className="w-3 h-3 inline text-[#0A3D36]" /> située à droite dans la barre d'adresse de votre navigateur.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="mt-5 w-full bg-[#0A3D36] hover:bg-[#135E54] text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E5B22F]" />
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
