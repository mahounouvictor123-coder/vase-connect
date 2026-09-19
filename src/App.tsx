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
import { TribesView } from './components/TribesView';
import { FamillesHonneurView } from './components/FamillesHonneurView';
import { PastorSpaceView } from './components/pastor/PastorSpaceView';
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
import { INITIAL_TRIBES, INITIAL_TRIBE_MEMBERS } from './data/tribesData';
import { INITIAL_FAMILLES_HONNEUR, INITIAL_FAMILLE_INSCRIPTIONS } from './data/famillesHonneurData';
import {
  INITIAL_CULTES_RESUMES,
  INITIAL_RAPPORT_TEMPLATES,
  INITIAL_RAPPORTS_SOUMIS,
  INITIAL_RAPPORTS_SPECIAUX,
  INITIAL_CULTE_PRESENCES,
} from './data/pastorData';
import { CultePresenceConfirmationView } from './components/CultePresenceConfirmationView';
import {
  UserProfile,
  ProductItem,
  OpportunityItem,
  CommunityPost,
  NotificationItem,
  MemberAd,
  GateMemberProfile,
  InfluenceGateId,
  TribeMember,
  TribeId,
  FamilleHonneur,
  FamilleHonneurInscription,
  CulteResume,
  RapportTemplate,
  RapportSoumis,
  RapportSpecial,
  CultePresenceRecord,
  CulteServiceType,
} from './types';

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
  const [tribes, setTribes] = useState(INITIAL_TRIBES);
  const [tribeMembers, setTribeMembers] = useState<TribeMember[]>(INITIAL_TRIBE_MEMBERS);
  const [selectedTribeIdForView, setSelectedTribeIdForView] = useState<TribeId | undefined>(undefined);
  const [famillesHonneur, setFamillesHonneur] = useState<FamilleHonneur[]>(INITIAL_FAMILLES_HONNEUR);
  const [familleInscriptions, setFamilleInscriptions] = useState<FamilleHonneurInscription[]>(INITIAL_FAMILLE_INSCRIPTIONS);
  const [cultes, setCultes] = useState<CulteResume[]>(INITIAL_CULTES_RESUMES);
  const [cultesPresences, setCultesPresences] = useState<CultePresenceRecord[]>(INITIAL_CULTE_PRESENCES);
  const [presenceParamDate, setPresenceParamDate] = useState<string | undefined>(undefined);
  const [presenceParamCulte, setPresenceParamCulte] = useState<CulteServiceType | undefined>(undefined);
  const [rapportTemplates, setRapportTemplates] = useState<RapportTemplate[]>(INITIAL_RAPPORT_TEMPLATES);
  const [rapports, setRapports] = useState<RapportSoumis[]>(INITIAL_RAPPORTS_SOUMIS);
  const [rapportsSpeciaux, setRapportsSpeciaux] = useState<RapportSpecial[]>(INITIAL_RAPPORTS_SPECIAUX);
  const [targetRapportFormId, setTargetRapportFormId] = useState<string | undefined>(undefined);
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

    // Check query parameters for direct report form link or tab
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const requestedFormId = searchParams.get('rapportForm');
      const requestedTab = searchParams.get('tab');
      const requestedDate = searchParams.get('date');
      const requestedCulte = searchParams.get('culte') as CulteServiceType | null;

      if (requestedDate) {
        setPresenceParamDate(requestedDate);
      }
      if (requestedCulte) {
        setPresenceParamCulte(requestedCulte);
      }

      if (requestedFormId) {
        setTargetRapportFormId(requestedFormId);
        setActiveTab('pastor');
      } else if (requestedTab) {
        setActiveTab(requestedTab);
      }
    } catch {
      // Ignored if URL parsing fails
    }

    window.addEventListener('popstate', handlePopState);

    // Fetch live Familles d'Honneur
    fetch('/api/familles-honneur')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.familles) && data.familles.length > 0) {
          setFamillesHonneur(data.familles);
        }
      })
      .catch(() => {});

    // Fetch live Pastor Data (cultes, templates, rapports, speciaux)
    fetch('/api/pastor/data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (Array.isArray(data.cultes) && data.cultes.length > 0) setCultes(data.cultes);
          if (Array.isArray(data.templates) && data.templates.length > 0) setRapportTemplates(data.templates);
          if (Array.isArray(data.rapports) && data.rapports.length > 0) setRapports(data.rapports);
          if (Array.isArray(data.rapportsSpeciaux) && data.rapportsSpeciaux.length > 0) setRapportsSpeciaux(data.rapportsSpeciaux);
        }
      })
      .catch(() => {});

    // Fetch live Cultes Presences
    fetch('/api/pastor/cultes-presences')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.presences) && data.presences.length > 0) {
          setCultesPresences(data.presences);
        }
      })
      .catch(() => {});

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

  const handleSaveTribeMember = (member: TribeMember, isLeader: boolean) => {
    // 1. Update tribeMembers list
    setTribeMembers(prev => {
      const existsIndex = prev.findIndex(
        m => m.id === member.id || (m.userId === member.userId && m.tribeId === member.tribeId)
      );
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = member;
        return copy;
      }
      return [member, ...prev];
    });

    // 2. If leader, update tribe's chief
    if (isLeader) {
      setTribes(prev =>
        prev.map(t => {
          if (t.id === member.tribeId) {
            return {
              ...t,
              leader: {
                title: member.roleInTribe === 'MATRIARCHE' ? 'Matriarche' : 'Patriarche',
                nom: member.nom,
                prenom: member.prenom,
                phone: member.numero,
                quartier: member.quartier,
                photoUrl: member.photoUrl,
                assignedAt: member.registeredAt,
              },
            };
          }
          return t;
        })
      );
    }

    // 3. Update current user
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        tribeId: member.tribeId,
        tribeRole: member.roleInTribe,
      };
      setCurrentUser(updatedUser);
      setMembers(prev => prev.map(m => (m.id === currentUser.id ? updatedUser : m)));
    }

    // 4. Asynchronously persist to server
    fetch('/api/tribes/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).catch(() => {});
  };

  const handleSaveFamille = (newFamille: FamilleHonneur) => {
    setFamillesHonneur(prev => {
      const idx = prev.findIndex(f => f.id === newFamille.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newFamille;
        return copy;
      }
      return [newFamille, ...prev];
    });

    fetch('/api/familles-honneur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFamille),
    }).catch(() => {});
  };

  const handleSaveFamilleInscription = (inscription: FamilleHonneurInscription) => {
    setFamilleInscriptions(prev => [inscription, ...prev]);
    setFamillesHonneur(prev =>
      prev.map(f =>
        f.id === inscription.familleId
          ? { ...f, membresInscritsCount: (f.membresInscritsCount || 0) + 1 }
          : f
      )
    );

    fetch('/api/familles-honneur/inscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inscription),
    }).catch(() => {});
  };

  const handleAddCulte = (newCulte: CulteResume) => {
    setCultes(prev => [newCulte, ...prev]);
    fetch('/api/pastor/cultes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCulte),
    }).catch(() => {});
  };

  const handleAddTemplate = (newTemplate: RapportTemplate) => {
    setRapportTemplates(prev => [...prev, newTemplate]);
    fetch('/api/pastor/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTemplate),
    }).catch(() => {});
  };

  const handleAddRapport = (newRapport: RapportSoumis) => {
    setRapports(prev => [newRapport, ...prev]);
    fetch('/api/pastor/rapports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRapport),
    }).catch(() => {});
  };

  const handleUpdateRapport = (updatedRapport: RapportSoumis) => {
    setRapports(prev => prev.map(r => (r.id === updatedRapport.id ? updatedRapport : r)));
    fetch(`/api/pastor/rapports/${updatedRapport.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRapport),
    }).catch(() => {});
  };

  const handleAddRapportSpecial = (special: RapportSpecial) => {
    setRapportsSpeciaux(prev => [special, ...prev]);
    fetch('/api/pastor/speciaux', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(special),
    }).catch(() => {});
  };

  const handleAddCultePresence = async (newPresence: CultePresenceRecord) => {
    setCultesPresences(prev => {
      const filtered = prev.filter(
        p =>
          !(
            p.dateDimanche === newPresence.dateDimanche &&
            p.culte === newPresence.culte &&
            ((p.memberId && newPresence.memberId && p.memberId === newPresence.memberId) ||
              (p.nom.toLowerCase().trim() === newPresence.nom.toLowerCase().trim() &&
                p.prenom.toLowerCase().trim() === newPresence.prenom.toLowerCase().trim()))
          )
      );
      return [newPresence, ...filtered];
    });

    try {
      const res = await fetch('/api/pastor/cultes-presences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPresence),
      });
      const data = await res.json();
      if (data && data.newMember) {
        setTribeMembers(prev => {
          const exists = prev.some(m => m.id === data.newMember.id);
          if (exists) return prev;
          return [data.newMember, ...prev];
        });
      }
    } catch {
      // Handled via local optimistic state
    }
  };

  const handleDeleteCultePresence = async (id: string) => {
    setCultesPresences(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/pastor/cultes-presences/${id}`, {
        method: 'DELETE',
      });
    } catch {}
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
            onSelectTribe={(tribeId) => {
              setSelectedTribeIdForView(tribeId as TribeId);
              handleNavigateTab('tribus');
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

        {activeTab === 'pastor' && (
          <PastorSpaceView
            currentUser={currentUser}
            cultes={cultes}
            templates={rapportTemplates}
            rapports={rapports}
            rapportsSpeciaux={rapportsSpeciaux}
            presences={cultesPresences}
            tribes={tribes}
            tribeMembers={tribeMembers}
            initialRapportFormId={targetRapportFormId}
            onAddCulte={handleAddCulte}
            onAddTemplate={handleAddTemplate}
            onAddRapport={handleAddRapport}
            onUpdateRapport={handleUpdateRapport}
            onAddRapportSpecial={handleAddRapportSpecial}
            onAddPresence={handleAddCultePresence}
            onDeletePresence={handleDeleteCultePresence}
            onOpenPublicLink={(date, culte) => {
              setPresenceParamDate(date);
              setPresenceParamCulte(culte);
              handleNavigateTab('presence_culte');
            }}
          />
        )}

        {activeTab === 'presence_culte' && (
          <CultePresenceConfirmationView
            tribes={tribes}
            tribeMembers={tribeMembers}
            currentUser={currentUser}
            initialDate={presenceParamDate}
            initialCulte={presenceParamCulte}
            onConfirmPresence={handleAddCultePresence}
            onBackToHome={() => handleNavigateTab('accueil')}
            onOpenPastorSpace={() => handleNavigateTab('pastor')}
          />
        )}

        {activeTab === 'familles_honneur' && (
          <FamillesHonneurView
            currentUser={currentUser}
            familles={famillesHonneur}
            inscriptions={familleInscriptions}
            onSaveFamille={handleSaveFamille}
            onSaveInscription={handleSaveFamilleInscription}
            onBackToHome={() => handleNavigateTab('accueil')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'tribus' && (
          <TribesView
            currentUser={currentUser}
            tribes={tribes}
            tribeMembers={tribeMembers}
            initialTribeId={selectedTribeIdForView}
            onSaveTribeMember={handleSaveTribeMember}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToHome={() => handleNavigateTab('accueil')}
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
