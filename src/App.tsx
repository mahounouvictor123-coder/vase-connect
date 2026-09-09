import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { NavigationBreadcrumb } from './components/NavigationBreadcrumb';
import { FloatingBackButton } from './components/FloatingBackButton';
import { HomeView } from './components/HomeView';
import { AssistantView } from './components/AssistantView';
import { MembersDirectoryView } from './components/MembersDirectoryView';
import { MarketplaceView } from './components/MarketplaceView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { MemberAdsView } from './components/MemberAdsView';
import { CommunityFeedView } from './components/CommunityFeedView';
import { DepartmentsView } from './components/DepartmentsView';
import { EventsView } from './components/EventsView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { CreateAdModal } from './components/CreateAdModal';
import { ProfessionalProfileModal } from './components/ProfessionalProfileModal';
import { InfluenceGatesView } from './components/InfluenceGatesView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import {
  MOCK_CURRENT_USER,
  MOCK_MEMBERS,
  MOCK_PRODUCTS,
  MOCK_OPPORTUNITIES,
  MOCK_MEMBER_ADS,
  MOCK_DEPARTMENTS,
  MOCK_EVENTS,
  MOCK_COMMUNITY_POSTS,
  MOCK_NOTIFICATIONS,
} from './data/mockData';
import { INITIAL_GATE_MEMBERS } from './data/influenceGatesData';
import { UserProfile, ProductItem, OpportunityItem, CommunityPost, NotificationItem, MemberAd, GateMemberProfile, InfluenceGateId } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('accueil');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_CURRENT_USER);
  const [members, setMembers] = useState<UserProfile[]>(MOCK_MEMBERS);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(MOCK_OPPORTUNITIES);
  const [ads, setAds] = useState<MemberAd[]>(MOCK_MEMBER_ADS);
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [gateMembers, setGateMembers] = useState<GateMemberProfile[]>(INITIAL_GATE_MEMBERS);
  const [selectedGateIdForView, setSelectedGateIdForView] = useState<InfluenceGateId | undefined>(undefined);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [isProfessionalProfileModalOpen, setIsProfessionalProfileModalOpen] = useState(false);

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (window.history && window.history.pushState) {
        window.history.pushState({ tab }, '', tab === 'accueil' ? '/' : `#${tab}`);
      }
    } catch {
      // Ignored if sandboxed iframe restricts history
    }
  };

  useEffect(() => {
    // Synchronize browser history and physical back button
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else if (window.location.hash) {
        const hashTab = window.location.hash.replace('#', '');
        if (hashTab) setActiveTab(hashTab);
        else setActiveTab('accueil');
      } else {
        setActiveTab('accueil');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (window.location.hash) {
      const initialTab = window.location.hash.replace('#', '');
      if (initialTab) setActiveTab(initialTab);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAssistant = (prompt?: string) => {
    if (prompt) setAssistantPrompt(prompt);
    handleNavigateTab('assistant');
  };

  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAddOpportunity = (newOpp: OpportunityItem) => {
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const handleAddAd = (newAd: MemberAd) => {
    setAds(prev => [newAd, ...prev]);
  };

  const handleAddPost = (newPost: CommunityPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: p.likedByCurrentUser ? p.likesCount - 1 : p.likesCount + 1,
            likedByCurrentUser: !p.likedByCurrentUser,
          };
        }
        return p;
      })
    );
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setMembers(prev => prev.map(m => (m.id === currentUser.id ? updatedUser : m)));
  };

  const handleToggleVerifyMember = (id: string) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, role: m.role === 'ADMIN' ? 'MEMBRE' : 'ADMIN' } : m))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSwitchUser = (memberId: string) => {
    const selected = members.find(m => m.id === memberId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  const handleSaveGateProfile = (profile: GateMemberProfile) => {
    // 1. Update gateMembers list
    setGateMembers(prev => {
      const existsIndex = prev.findIndex(
        m => m.id === profile.id || (m.userId === profile.userId && m.gateId === profile.gateId)
      );
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = profile;
        return copy;
      }
      return [profile, ...prev];
    });

    // 2. Sync to currentUser & members directory
    if (currentUser) {
      const currentGates = currentUser.influenceGates || [];
      const updatedGates = currentGates.includes(profile.gateId)
        ? currentGates
        : [...currentGates, profile.gateId];
      const updatedGateProfiles = {
        ...(currentUser.gateProfiles || {}),
        [profile.gateId]: profile,
      };

      const updatedUser: UserProfile = {
        ...currentUser,
        influenceGates: updatedGates,
        gateProfiles: updatedGateProfiles,
      };

      setCurrentUser(updatedUser);
      setMembers(prev => prev.map(m => (m.id === currentUser.id ? updatedUser : m)));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-slate-900 flex flex-col antialiased selection:bg-[#C59A27] selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        currentUser={currentUser}
        onOpenAssistant={() => handleOpenAssistant()}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
        onSwitchUser={handleSwitchUser}
        allMembers={members}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Persistent Breadcrumb & Back Navigation Bar (Visible on all tabs except accueil) */}
        <NavigationBreadcrumb
          activeTab={activeTab}
          onSelectTab={handleNavigateTab}
        />

        {activeTab === 'accueil' && (
          <HomeView
            onSelectTab={handleNavigateTab}
            onOpenAssistantWithPrompt={handleOpenAssistant}
            onSelectMember={() => handleNavigateTab('membres')}
            onSelectProduct={() => handleNavigateTab('market')}
            onSelectGate={(gateId) => {
              setSelectedGateIdForView(gateId as InfluenceGateId);
              handleNavigateTab('portes');
            }}
            members={members}
            products={products}
            opportunities={opportunities}
            events={MOCK_EVENTS}
            posts={posts}
            ads={ads}
            onOpenCreateAd={() => setIsCreateAdModalOpen(true)}
            onOpenProfessionalProfile={() => setIsProfessionalProfileModalOpen(true)}
          />
        )}

        {activeTab === 'portes' && (
          <InfluenceGatesView
            currentUser={currentUser}
            gateMembers={gateMembers}
            initialGateId={selectedGateIdForView}
            onSaveGateProfile={handleSaveGateProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToHome={() => handleNavigateTab('accueil')}
            onOpenAssistantWithPrompt={handleOpenAssistant}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantView
            initialPrompt={assistantPrompt}
            onOpenMarket={() => handleNavigateTab('market')}
            onOpenDirectory={() => handleNavigateTab('membres')}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'membres' && (
          <MembersDirectoryView
            members={members}
            products={products}
            onSelectMember={() => {}}
            onOpenAssistantWithPrompt={handleOpenAssistant}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'market' && (
          <MarketplaceView
            products={products}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'opportunites' && (
          <OpportunitiesView
            opportunities={opportunities}
            members={members}
            currentUser={currentUser}
            onAddOpportunity={handleAddOpportunity}
            onSelectMember={() => handleNavigateTab('membres')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'ads' && (
          <MemberAdsView
            ads={ads}
            currentUser={currentUser}
            onOpenCreateAd={() => setIsCreateAdModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSelectTab={handleNavigateTab}
          />
        )}

        {activeTab === 'feed' && (
          <CommunityFeedView
            posts={posts}
            currentUser={currentUser}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenAssistantWithPrompt={handleOpenAssistant}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'departements' && (
          <DepartmentsView
            departments={MOCK_DEPARTMENTS}
            onOpenAssistantWithPrompt={handleOpenAssistant}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'evenements' && (
          <EventsView
            events={MOCK_EVENTS}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            currentUser={currentUser}
            products={products}
            onUpdateProfile={handleUpdateProfile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
            onSelectTab={handleNavigateTab}
            onOpenProfessionalProfile={() => setIsProfessionalProfileModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            members={members}
            products={products}
            opportunities={opportunities}
            onToggleVerifyMember={handleToggleVerifyMember}
            onDeleteProduct={handleDeleteProduct}
            onBackToHome={() => handleNavigateTab('accueil')}
          />
        )}
      </main>

      {/* Floating Return to Home Button for deep scroll on mobile/desktop */}
      <FloatingBackButton
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
      />

      {/* Mobile Bottom Navigation with Floating Center AI Button */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        onOpenAssistant={() => handleOpenAssistant()}
      />

      {/* PWA Offline & Installation Banner */}
      <PWAInstallPrompt />

      {/* Phone OTP Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        availableMembers={members}
      />

      {/* Create Ad & Promotion Modal */}
      <CreateAdModal
        isOpen={isCreateAdModalOpen}
        onClose={() => setIsCreateAdModalOpen(false)}
        currentUser={currentUser}
        onAddAd={handleAddAd}
      />

      {/* Professional Profile Definition Modal */}
      {currentUser && (
        <ProfessionalProfileModal
          isOpen={isProfessionalProfileModalOpen}
          onClose={() => setIsProfessionalProfileModalOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
