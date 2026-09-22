import React, { useState } from 'react';
import { Logo } from './Logo';
import { Bell, Sparkles, User, Shield, Check, LogIn, ChevronDown, ArrowLeft, Home, Crown, Users, BookOpen, Share2 } from 'lucide-react';
import { UserProfile, Role, AppNotification } from '../types';

interface HeaderProps {
  activeTab: string;
  currentUser: UserProfile | null;
  notifications: AppNotification[];
  onOpenAssistant: () => void;
  onOpenAuth: () => void;
  onSelectTab: (tab: string) => void;
  onSwitchUser?: (memberId: string) => void;
  onOpenInvite?: () => void;
  allMembers?: UserProfile[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  notifications,
  onOpenAssistant,
  onOpenAuth,
  onSelectTab,
  onSwitchUser = (_memberId: string) => {},
  onOpenInvite,
  allMembers = [],
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Direct Back to Home button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={() => onSelectTab('accueil')}
            className="cursor-pointer hover:opacity-95 transition-opacity"
            title="Accueil Vases Connect"
          >
            <Logo variant="full" size="sm" />
          </div>

          {activeTab !== 'accueil' && (
            <button
              onClick={() => onSelectTab('accueil')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0A3D36] to-[#135E54] hover:from-[#082e29] hover:to-[#0f4b43] text-white font-black text-xs shadow-xs transition-all hover:scale-102 active:scale-95 group border border-[#C59A27]/40"
              title="Retourner à la page d'accueil"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E5B22F] group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Accueil</span>
              <span className="sm:hidden text-[11px]">Accueil</span>
            </button>
          )}
        </div>

        {/* Navigation Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-1 mx-2">
          {[
            { id: 'accueil', label: 'Accueil' },
            ...(currentUser?.role === 'PASTEUR'
              ? [{ id: 'pastor', label: 'Espace Pasteur 📖' }]
              : []),
            { id: 'presence_culte', label: 'Pointage Culte 🙏' },
            { id: 'familles_honneur', label: "Familles d'Honneur 📍" },
            { id: 'portes', label: '12 Portes d\'Influence' },
            { id: 'tribus', label: '12 Tribus' },
            { id: 'membres', label: 'Annuaire' },
            { id: 'market', label: 'Market' },
            { id: 'opportunites', label: 'Emplois' },
            { id: 'ads', label: 'Boutiques' },
            { id: 'departements', label: 'Départements' },
            { id: 'evenements', label: 'Événements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0A3D36] text-white shadow-xs'
                  : tab.id === 'pastor'
                  ? 'text-[#0A3D36] bg-amber-50 hover:bg-amber-100/80 border border-[#C59A27]/40'
                  : 'text-slate-600 hover:text-[#0A3D36] hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Center: Quick Assistant Trigger (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-2">
          <button
            onClick={onOpenAssistant}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-500 text-xs transition-all group shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C59A27] group-hover:scale-110 transition-transform" />
              <span className="truncate">Assistant IA Vases...</span>
            </div>
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Bouton Inviter un Membre */}
          {onOpenInvite && (
            <button
              onClick={onOpenInvite}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0A3D36] border border-[#C59A27]/40 text-xs font-bold transition-all shadow-2xs hover:scale-102 active:scale-95"
              title="Inviter un frère ou une sœur sur Vases Connect"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C59A27]" />
              <span className="hidden sm:inline">Inviter</span>
            </button>
          )}

          {/* AI Sparkle Button for Mobile */}
          <button
            onClick={onOpenAssistant}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A3D36] to-[#135E54] text-amber-300 shadow-sm border border-[#C59A27]/40 active:scale-95"
            aria-label="Ouvrir Assistant Vases"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-[#0A3D36] hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#A31D24] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <h4 className="text-xs font-bold text-[#0A3D36]">Notifications</h4>
                  <span className="text-[10px] text-slate-400">{notifications.length} récentes</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (notif.linkTab) onSelectTab(notif.linkTab);
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-[#F8FAF9] border border-slate-100 cursor-pointer text-left transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#0A3D36]">{notif.title}</span>
                        <span className="text-[9px] text-slate-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.firstName}
                  className="w-7 h-7 rounded-full object-cover border border-[#C59A27]"
                />
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
                  {currentUser.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User switcher & options dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={currentUser.photoUrl}
                      alt={currentUser.firstName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C59A27]"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-slate-800 truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.profession}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 mt-1 rounded-full font-medium bg-[#0A3D36]/10 text-[#0A3D36]">
                        <Shield className="w-2.5 h-2.5 text-[#C59A27]" />
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">
                      Changer de profil (Démo rapide)
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {allMembers.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            onSwitchUser(m.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs hover:bg-slate-50 ${
                            m.id === currentUser.id ? 'bg-amber-50 text-[#0A3D36] font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img src={m.photoUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate">{m.firstName} ({m.profession.split(' ')[0]})</span>
                          </div>
                          {m.id === currentUser.id && <Check className="w-3.5 h-3.5 text-[#C59A27]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-1">
                    {currentUser.role === 'PASTEUR' && (
                      <button
                        onClick={() => {
                          onSelectTab('pastor');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left text-xs py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#0A3D36] font-bold flex items-center justify-between border border-[#C59A27]/30"
                      >
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#C59A27]" />
                          <span>Espace Pasteur & Rapports</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C59A27] text-slate-950 font-black">CHAIRE</span>
                      </button>
                    )}
                    {onOpenInvite && (
                      <button
                        onClick={() => {
                          onOpenInvite();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-amber-50 text-[#0A3D36] font-bold flex items-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#C59A27]" />
                        <span>Inviter un membre (Lien invité)</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onSelectTab('profil');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 text-[#0A3D36] font-medium"
                    >
                      Voir mon profil & opportunités
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('tribus');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 text-[#0A3D36] font-medium flex items-center gap-1.5"
                    >
                      <Crown className="w-3.5 h-3.5 text-[#C59A27]" />
                      Les 12 Tribus & Chefs
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('familles_honneur');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 text-[#0A3D36] font-medium flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#C59A27]" />
                      Familles d'Honneur
                    </button>
                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          onSelectTab('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 text-purple-700 font-medium flex items-center gap-1.5"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Tableau de bord Administrateur
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-[#0A3D36] hover:bg-[#0D473E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Connexion (OTP)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
