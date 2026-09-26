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
import { PastorAccessGuard } from './components/pastor/PastorAccessGuard';
import { CoeurHonneurView } from './components/CoeurHonneurView';
import { DirectCampagneSpotlightModal } from './components/campaign/DirectCampagneSpotlightModal';
import { DirectReportModal } from './components/pastor/DirectReportModal';
import { RapportDetailModal } from './components/pastor/RapportDetailModal';
import { InviteWelcomeModal } from './components/InviteWelcomeModal';
import { InviteMemberModal } from './components/InviteMemberModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PastorDelegation } from './types';
import { getPastorDelegations } from './data/pastorDelegationsData';
import { DelegatedAccessBanner } from './components/delegation/DelegatedAccessBanner';
import { UnauthorizedPortionCard } from './components/delegation/UnauthorizedPortionCard';
import { AddToHomeScreenModal } from './components/common/AddToHomeScreenModal';
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
import { INITIAL_GATE_MEMBERS, INFLUENCE_GATES } from './data/influenceGatesData';
import { INITIAL_TRIBES, INITIAL_TRIBE_MEMBERS } from './data/tribesData';
import { INITIAL_FAMILLES_HONNEUR, INITIAL_FAMILLE_INSCRIPTIONS } from './data/famillesHonneurData';
import { INITIAL_DEPARTMENTS_DATA } from './data/departmentsData';
import { INITIAL_COEUR_CAMPAGNES, INITIAL_COEUR_DEMANDES } from './data/coeurHonneurData';
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
  DepartmentItem,
  DepartmentMember,
  CoeurCampagneAide,
  CoeurDemandeAide,
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
  const [selectedGateSubTabForView, setSelectedGateSubTabForView] = useState<'MEMBRES' | 'RESPONSABLE' | 'VISION' | undefined>(undefined);
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
  const [isInviteWelcomeModalOpen, setIsInviteWelcomeModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmailHint, setInviteEmailHint] = useState('siloestore44@gmail.com');
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [isProfessionalProfileModalOpen, setIsProfessionalProfileModalOpen] = useState(false);

  // Le Cœur d'Honneur - State (avec LocalStorage + données initiales)
  const [coeurCampagnes, setCoeurCampagnes] = useState<CoeurCampagneAide[]>(() => {
    try {
      const saved = localStorage.getItem('vases_coeur_campagnes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erreur lecture coeur_campagnes localStorage', e);
    }
    return INITIAL_COEUR_CAMPAGNES;
  });

  const [coeurDemandes, setCoeurDemandes] = useState<CoeurDemandeAide[]>(() => {
    try {
      const saved = localStorage.getItem('vases_coeur_demandes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erreur lecture coeur_demandes localStorage', e);
    }
    return INITIAL_COEUR_DEMANDES;
  });

  const [coeurCampagneParamId, setCoeurCampagneParamId] = useState<string | undefined>(undefined);
  const [directCampagneSpotlight, setDirectCampagneSpotlight] = useState<CoeurCampagneAide | null>(null);
  const [initialOpenDonCampagneId, setInitialOpenDonCampagneId] = useState<string | undefined>(undefined);
  const [directSubmitTemplate, setDirectSubmitTemplate] = useState<RapportTemplate | null>(null);
  const [directViewRapport, setDirectViewRapport] = useState<RapportSoumis | null>(null);
  const [activeDelegation, setActiveDelegation] = useState<PastorDelegation | null>(() => {
    try {
      const saved = localStorage.getItem('vases_active_delegation');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [showAddToHomeScreenModal, setShowAddToHomeScreenModal] = useState<boolean>(false);

  const handleAddCoeurDemande = (newDemande: CoeurDemandeAide) => {
    setCoeurDemandes(prev => {
      const updated = [newDemande, ...prev];
      try {
        localStorage.setItem('vases_coeur_demandes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    // Incrémenter les demandes de la campagne si liée
    if (newDemande.campagneId) {
      setCoeurCampagnes(prev => {
        const updated = prev.map(c =>
          c.id === newDemande.campagneId
            ? { ...c, nombreDemandesRecues: (c.nombreDemandesRecues || 0) + 1 }
            : c
        );
        try {
          localStorage.setItem('vases_coeur_campagnes', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
    fetch('/api/coeur-honneur/demandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDemande),
    }).catch(() => {});
  };

  const handleUpdateCoeurDemande = (updatedDemande: CoeurDemandeAide) => {
    setCoeurDemandes(prev => {
      const updated = prev.map(d => (d.id === updatedDemande.id ? updatedDemande : d));
      try {
        localStorage.setItem('vases_coeur_demandes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    fetch(`/api/coeur-honneur/demandes/${updatedDemande.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDemande),
    }).catch(() => {});
  };

  const handleAddCoeurCampagne = (newCampagne: CoeurCampagneAide) => {
    setCoeurCampagnes(prev => {
      const updated = [newCampagne, ...prev];
      try {
        localStorage.setItem('vases_coeur_campagnes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    fetch('/api/coeur-honneur/campagnes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCampagne),
    }).catch(() => {});
  };

  const handleContributeCoeurCampagne = (campagneId: string, montant: number) => {
    setCoeurCampagnes(prev => {
      const updated = prev.map(c => {
        if (c.id === campagneId) {
          return {
            ...c,
            montantCollecte: (c.montantCollecte || 0) + montant,
            nombreContributeurs: (c.nombreContributeurs || 0) + 1,
          };
        }
        return c;
      });
      try {
        localStorage.setItem('vases_coeur_campagnes', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Departments State (with LocalStorage + initial data)
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('vases_departments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading departments from localStorage', e);
    }
    return INITIAL_DEPARTMENTS_DATA;
  });

  const handleAddDepartment = (newDept: DepartmentItem) => {
    setDepartments(prev => {
      const updated = [newDept, ...prev];
      try {
        localStorage.setItem('vases_departments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDept),
    }).catch(() => {});
  };

  const handleAddMemberToDepartment = (deptId: string, member: DepartmentMember) => {
    setDepartments(prev => {
      const updated = prev.map(d => {
        if (d.id === deptId) {
          const currentList = d.membersList || [];
          const existingIdx = currentList.findIndex(m => m.id === member.id);
          const newList = existingIdx !== -1
            ? currentList.map((m, i) => i === existingIdx ? member : m)
            : [member, ...currentList];
          return {
            ...d,
            membersList: newList,
            memberCount: (d.memberCount || 0) + 1,
          };
        }
        return d;
      });
      try {
        localStorage.setItem('vases_departments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    fetch(`/api/departments/${deptId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    }).catch(() => {});
  };

  const handleUserLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('vases_current_user', JSON.stringify(user));
    } catch {
      // Ignore
    }
    setMembers(prev => {
      const exists = prev.some(m => m.id === user.id);
      return exists ? prev.map(m => m.id === user.id ? user : m) : [user, ...prev];
    });
    fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }).catch(() => {});
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vases_current_user');
    } catch {
      // Ignore
    }
  };

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
    // Restore persistent session from localStorage
    try {
      const savedUserStr = localStorage.getItem('vases_current_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
        }
      }
    } catch {
      // Ignore
    }

    // Helper to safely extract clean tab name without query string from hash
    const extractCleanTab = (hashStr: string): string | null => {
      const clean = hashStr.replace(/^#/, '');
      const qIndex = clean.indexOf('?');
      const candidate = qIndex !== -1 ? clean.substring(0, qIndex) : clean;
      if (candidate.includes('=')) return null;
      return candidate || null;
    };

    // Helper to extract all query params from both window.location.search AND window.location.hash
    const getAllUrlParams = (): URLSearchParams => {
      const params = new URLSearchParams(window.location.search);
      if (typeof window !== 'undefined' && window.location.hash) {
        const rawHash = window.location.hash.replace(/^#/, '');
        const qIndex = rawHash.indexOf('?');
        if (qIndex !== -1) {
          const hashQuery = rawHash.substring(qIndex + 1);
          new URLSearchParams(hashQuery).forEach((val, key) => {
            if (!params.has(key)) params.set(key, val);
          });
        } else if (rawHash.includes('=')) {
          new URLSearchParams(rawHash).forEach((val, key) => {
            if (!params.has(key)) params.set(key, val);
          });
        }
      }
      return params;
    };

    // Synchronize browser history and physical back button
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else if (window.location.hash) {
        const hashTab = extractCleanTab(window.location.hash);
        if (hashTab) setActiveTab(hashTab);
        else setActiveTab('accueil');
      } else {
        setActiveTab('accueil');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (window.location.hash) {
      const initialTab = extractCleanTab(window.location.hash);
      if (initialTab) setActiveTab(initialTab);
    }

    // Check query parameters for invite, direct report form link or tab
    try {
      const searchParams = getAllUrlParams();
      const isInviteParam =
        searchParams.get('invite') !== null ||
        searchParams.get('invited') !== null ||
        searchParams.get('invitation') !== null ||
        searchParams.get('join') !== null ||
        searchParams.get('ref') !== null ||
        (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('invite'));

      if (isInviteParam) {
        setIsInviteWelcomeModalOpen(true);
      }

      const emailParam = searchParams.get('email');
      if (emailParam) {
        setInviteEmailHint(emailParam);
      }

      // Campagnes d'aide (ex: ?campagne=camp-1 or #coeur_honneur?campagne=camp-1)
      const requestedCampagne =
        searchParams.get('campagne') ||
        searchParams.get('coeur_campagne') ||
        searchParams.get('campagneId') ||
        searchParams.get('aide');

      if (requestedCampagne) {
        setCoeurCampagneParamId(requestedCampagne);
        setActiveTab('coeur_honneur');

        // Immédiatement ouvrir la modale officielle de la campagne
        const foundCamp =
          coeurCampagnes.find((c) => c.id === requestedCampagne) ||
          INITIAL_COEUR_CAMPAGNES.find((c) => c.id === requestedCampagne);
        if (foundCamp) {
          setDirectCampagneSpotlight(foundCamp);
        }
      }

      // Rapports - FORMULAIRE À REMPLIR PAR LE MEMBRE/RESPONSABLE
      const requestedFormId =
        searchParams.get('rapportForm') ||
        searchParams.get('rapport_form') ||
        searchParams.get('template') ||
        searchParams.get('templateId') ||
        searchParams.get('formRapport');

      if (requestedFormId) {
        setTargetRapportFormId(requestedFormId);
        const targetTpl =
          rapportTemplates.find((t) => t.id === requestedFormId) ||
          INITIAL_RAPPORT_TEMPLATES.find((t) => t.id === requestedFormId);
        if (targetTpl) {
          setDirectSubmitTemplate(targetTpl);
        }
        // Ne PAS forcer activeTab = 'pastor' pour éviter le blocage par PastorAccessGuard
      }

      // Rapports - CONSULTATION D'UN RAPPORT TRANSMIS
      const requestedViewRapportId =
        searchParams.get('viewRapportId') ||
        searchParams.get('rapportId') ||
        searchParams.get('viewRapport');

      if (requestedViewRapportId) {
        const targetRap =
          rapports.find((r) => r.id === requestedViewRapportId) ||
          INITIAL_RAPPORTS_SOUMIS.find((r) => r.id === requestedViewRapportId);
        if (targetRap) {
          setDirectViewRapport(targetRap);
        }
      }

      // Délégation pastorale d'accès cloisonné (ex: ?delegation=del-resp-presences ou ?acces=VC-PRES-7721)
      const requestedDelegationParam =
        searchParams.get('delegation') ||
        searchParams.get('portion') ||
        searchParams.get('acces') ||
        searchParams.get('delegue') ||
        searchParams.get('acces_delegue');

      if (requestedDelegationParam) {
        const allDels = getPastorDelegations();
        const foundDel =
          allDels.find((d) => d.id === requestedDelegationParam) ||
          allDels.find((d) => d.codeAccesCourt.toLowerCase() === requestedDelegationParam.toLowerCase()) ||
          allDels.find((d) => d.typePortion.toLowerCase() === requestedDelegationParam.toLowerCase());

        if (foundDel && foundDel.actif) {
          setActiveDelegation(foundDel);
          try {
            localStorage.setItem('vases_active_delegation', JSON.stringify(foundDel));
          } catch {}
          const firstAuthorized = foundDel.ongletsAutorises[0] || 'accueil';
          setActiveTab(firstAuthorized);
        }
      }

      const requestedTab = searchParams.get('tab');
      const requestedDate = searchParams.get('date');
      const requestedCulte = searchParams.get('culte') as CulteServiceType | null;

      if (requestedDate) {
        setPresenceParamDate(requestedDate);
      }
      if (requestedCulte) {
        setPresenceParamCulte(requestedCulte);
      }

      if (requestedTab && !requestedCampagne && !requestedFormId) {
        setActiveTab(requestedTab);
      }

      const requestedGate = searchParams.get('gate') as InfluenceGateId | null;
      const requestedGateSubTab = searchParams.get('gateSubTab') || searchParams.get('subtab');
      if (requestedGate) {
        setSelectedGateIdForView(requestedGate);
        if (requestedGateSubTab === 'responsable' || requestedGateSubTab === 'RESPONSABLE') {
          setSelectedGateSubTabForView('RESPONSABLE');
        } else if (requestedGateSubTab === 'vision' || requestedGateSubTab === 'VISION') {
          setSelectedGateSubTabForView('VISION');
        }
        setActiveTab('portes');
      }
    } catch {
      // Ignored if URL parsing fails
    }

    window.addEventListener('popstate', handlePopState);

    // Fetch live Cœur d'Honneur (campagnes et demandes)
    fetch('/api/coeur-honneur/campagnes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCoeurCampagnes(data);
        }
      })
      .catch(() => {});

    fetch('/api/coeur-honneur/demandes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCoeurDemandes(data);
        }
      })
      .catch(() => {});

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

  // Synchroniser l'ouverture de la modale campagne si demandée par URL et dès chargement des campagnes
  useEffect(() => {
    if (coeurCampagneParamId && !directCampagneSpotlight && coeurCampagnes.length > 0) {
      const found = coeurCampagnes.find((c) => c.id === coeurCampagneParamId);
      if (found) {
        setDirectCampagneSpotlight(found);
      }
    }
  }, [coeurCampagneParamId, directCampagneSpotlight, coeurCampagnes]);

  // Synchroniser le formulaire direct de rapport dès chargement des templates
  useEffect(() => {
    if (targetRapportFormId && !directSubmitTemplate && rapportTemplates.length > 0) {
      const found = rapportTemplates.find((t) => t.id === targetRapportFormId);
      if (found) {
        setDirectSubmitTemplate(found);
      }
    }
  }, [targetRapportFormId, directSubmitTemplate, rapportTemplates]);

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

  const handleRegisterMember = (
    user: UserProfile,
    affiliation: {
      tribeId: TribeId;
      departmentId: string;
      departmentIds?: string[];
      detectedGateId: InfluenceGateId;
      familleHonneurId?: string;
    }
  ) => {
    // 1. Établir la session membre
    handleUserLoginSuccess(user);

    // 2. Rattachement automatique à la Tribu choisie
    const newTribeMember: TribeMember = {
      id: 'tm-' + user.id,
      tribeId: affiliation.tribeId,
      nom: user.lastName,
      prenom: user.firstName,
      numero: user.phone,
      quartier: user.quartier || 'Cotonou',
      photoUrl: user.photoUrl,
      roleInTribe: 'MEMBRE',
      registeredAt: new Date().toISOString().split('T')[0],
      userId: user.id,
    };
    handleSaveTribeMember(newTribeMember, false);

    // 3. Rattachement automatique aux 2 à 3 Départements choisis
    const targetDeptIds = affiliation.departmentIds && affiliation.departmentIds.length > 0
      ? affiliation.departmentIds
      : [affiliation.departmentId];

    targetDeptIds.forEach((deptId, idx) => {
      const dept = departments.find(d => d.id === deptId);
      const newDeptMember: DepartmentMember = {
        id: 'dep-m-' + user.id + '-' + deptId,
        departmentId: deptId,
        memberId: user.id,
        nom: user.lastName,
        prenom: user.firstName,
        telephone: user.phone,
        email: user.email,
        roleInDepartment: idx === 0 ? 'Membre Actif (Principal)' : 'Membre Actif',
        dateAdhesion: new Date().toISOString().split('T')[0],
        competences: user.skills && user.skills.length > 0 ? user.skills : [user.profession],
        photoUrl: user.photoUrl,
      };
      handleAddMemberToDepartment(deptId, newDeptMember);
    });

    // 4. Rattachement automatique à la Porte d'Influence correspondante
    const gate = INFLUENCE_GATES.find(g => g.id === affiliation.detectedGateId);
    if (gate) {
      const newGateProfile: GateMemberProfile = {
        id: 'gp-' + user.id,
        userId: user.id,
        gateId: affiliation.detectedGateId,
        memberName: `${user.firstName} ${user.lastName}`,
        memberProfession: user.profession,
        memberPhoto: user.photoUrl,
        memberPhone: user.phone,
        memberCity: user.city || 'Cotonou',
        memberCountry: user.country || 'Bénin',
        roleInGate: 'Professionnel / Cadre',
        subSector: gate.keySubSectors[0] || user.profession,
        visionImpact: `Membre engagé dans la Porte ${gate.name} pour manifester les valeurs du Royaume.`,
        skills: user.skills || [user.profession],
        seekingCollaboration: true,
        openForMentoring: true,
        whatsappContact: user.phone,
        emailContact: user.email,
        registeredAt: new Date().toISOString().split('T')[0],
      };
      handleSaveGateProfile(newGateProfile);
    }

    // 5. Rattachement automatique à la Famille d'Honneur (cellule de proximité)
    if (affiliation.familleHonneurId) {
      const newInscription: FamilleHonneurInscription = {
        id: 'fhi-' + user.id,
        familleId: affiliation.familleHonneurId,
        userId: user.id,
        nom: user.lastName,
        prenom: user.firstName,
        telephone: user.phone,
        whatsapp: user.phone,
        quartier: user.quartier || 'Cotonou',
        profession: user.profession,
        statutMembre: 'MEMBRE_REGULIER',
        dateInscription: new Date().toISOString().split('T')[0],
        statut: 'PARTICIPANT_ACTIF',
      };
      handleSaveFamilleInscription(newInscription);
    }
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
        onOpenInvite={() => setIsInviteModalOpen(true)}
        onOpenAddToHomeScreen={() => setShowAddToHomeScreenModal(true)}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
        onSwitchUser={handleSwitchUser}
        allMembers={members}
        activeDelegation={activeDelegation}
      />

      {/* Bandeau d'accès délégué si l'utilisateur est sous délégation pastorale */}
      {activeDelegation && (
        <DelegatedAccessBanner
          delegation={activeDelegation}
          activeTab={activeTab}
          onNavigateAuthorizedTab={handleNavigateTab}
          onExitDelegation={() => {
            setActiveDelegation(null);
            try {
              localStorage.removeItem('vases_active_delegation');
            } catch {}
            handleNavigateTab('accueil');
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Persistent Breadcrumb & Back Navigation Bar (Visible on all tabs except accueil) */}
        <NavigationBreadcrumb
          activeTab={activeTab}
          onSelectTab={handleNavigateTab}
        />

        {/* Protection de cloisonnement : si l'onglet demandé n'est pas autorisé par la délégation */}
        {activeDelegation && !activeDelegation.ongletsAutorises.includes(activeTab) ? (
          <UnauthorizedPortionCard
            delegation={activeDelegation}
            attemptedTab={activeTab}
            onReturnToAuthorized={handleNavigateTab}
          />
        ) : (
          <>
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
                currentUser={currentUser}
                onOpenInvite={() => setIsInviteModalOpen(true)}
                onOpenCreateAd={() => setIsCreateAdModalOpen(true)}
                onOpenProfessionalProfile={() => setIsProfessionalProfileModalOpen(true)}
              />
            )}

            {activeTab === 'pastor' && (
              (currentUser?.role === 'PASTEUR' || (activeDelegation && activeDelegation.ongletsAutorises.includes('pastor'))) ? (
                <PastorSpaceView
                  currentUser={currentUser}
                  activeDelegation={activeDelegation}
                  cultes={cultes}
                  templates={rapportTemplates}
                  rapports={rapports}
                  rapportsSpeciaux={rapportsSpeciaux}
                  presences={cultesPresences}
                  tribes={tribes}
                  tribeMembers={tribeMembers}
                  initialRapportFormId={targetRapportFormId}
                  initialPastorTab={activeDelegation?.portionsPastoralesAutorisees?.[0] || 'inbox'}
                  onOpenInvite={() => setIsInviteModalOpen(true)}
                  onTestDelegation={(del) => {
                    setActiveDelegation(del);
                    handleNavigateTab(del.ongletsAutorises[0] || 'accueil');
                  }}
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
              ) : (
                <PastorAccessGuard
                  currentUser={currentUser}
                  onBackToHome={() => handleNavigateTab('accueil')}
                  onPastorUnlocked={(pastorUser) => {
                    handleUserLoginSuccess(pastorUser);
                  }}
                />
              )
            )}

        {activeTab === 'coeur_honneur' && (
          <CoeurHonneurView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            demandes={coeurDemandes}
            campagnes={coeurCampagnes}
            onAddDemande={handleAddCoeurDemande}
            onUpdateDemande={handleUpdateCoeurDemande}
            onAddCampagne={handleAddCoeurCampagne}
            onContributeCampagne={handleContributeCoeurCampagne}
            initialCampagneId={coeurCampagneParamId}
            initialOpenDonCampagneId={initialOpenDonCampagneId}
            tribes={tribes}
            famillesHonneur={famillesHonneur}
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
            presences={cultesPresences}
            rapportTemplates={rapportTemplates}
            onSaveFamille={handleSaveFamille}
            onSaveInscription={handleSaveFamilleInscription}
            onSubmitReport={handleAddRapport}
            onBackToHome={() => handleNavigateTab('accueil')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'tribus' && (
          <TribesView
            currentUser={currentUser}
            tribes={tribes}
            tribeMembers={tribeMembers}
            presences={cultesPresences}
            rapportTemplates={rapportTemplates}
            onAddPresence={handleAddCultePresence}
            onSubmitReport={handleAddRapport}
            initialTribeId={selectedTribeIdForView}
            onSaveMember={handleSaveTribeMember}
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
            initialSubTab={selectedGateSubTabForView}
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
            departments={departments}
            currentUser={currentUser}
            existingUsers={members}
            presences={cultesPresences}
            rapportTemplates={rapportTemplates}
            onAddDepartment={handleAddDepartment}
            onAddMemberToDepartment={handleAddMemberToDepartment}
            onSubmitReport={handleAddRapport}
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
            onLogout={handleUserLogout}
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
          </>
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
        activeDelegation={activeDelegation}
      />

      {/* PWA Offline & Installation Banner */}
      <PWAInstallPrompt />

      {/* Modal Universelle Ajouter à l'Écran d'Accueil (Application Mobile Vases Connect avec logo officiel) */}
      <AddToHomeScreenModal
        isOpen={showAddToHomeScreenModal}
        onClose={() => setShowAddToHomeScreenModal(false)}
        customTitle={activeDelegation ? `Vases Connect • ${activeDelegation.titreRole}` : 'Vases Connect'}
        customPortion={activeDelegation?.titreRole}
      />

      {/* Phone & Gmail & Pastoral Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          handleUserLoginSuccess(user);
          setIsAuthModalOpen(false);
        }}
        onRegisterMember={(user, affiliation) => {
          handleRegisterMember(user, affiliation);
          setIsAuthModalOpen(false);
        }}
        availableMembers={members}
        tribes={tribes}
        departments={departments}
        famillesHonneur={famillesHonneur}
      />

      {/* Member Invite Link Generation Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        currentUser={currentUser}
        onPreviewInvite={() => setIsInviteWelcomeModalOpen(true)}
      />

      {/* Invite Welcome Modal for Members Arriving via Link */}
      <InviteWelcomeModal
        isOpen={isInviteWelcomeModalOpen}
        onClose={() => setIsInviteWelcomeModalOpen(false)}
        onLoginSuccess={(user) => {
          handleUserLoginSuccess(user);
          setIsInviteWelcomeModalOpen(false);
        }}
        onRegisterMember={(user, affiliation) => {
          handleRegisterMember(user, affiliation);
          setIsInviteWelcomeModalOpen(false);
        }}
        defaultEmail={inviteEmailHint}
        tribes={tribes}
        departments={departments}
        famillesHonneur={famillesHonneur}
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

      {/* Modale d'accueil officielle & immédiate sur la Campagne sélectionnée via lien direct */}
      {directCampagneSpotlight && (
        <DirectCampagneSpotlightModal
          campagne={directCampagneSpotlight}
          onClose={() => setDirectCampagneSpotlight(null)}
          onRequestHelp={(camp) => {
            setDirectCampagneSpotlight(null);
            setCoeurCampagneParamId(camp.id);
            setActiveTab('coeur_honneur');
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }}
          onDonate={(camp) => {
            setDirectCampagneSpotlight(null);
            setInitialOpenDonCampagneId(camp.id);
            setActiveTab('coeur_honneur');
          }}
        />
      )}

      {/* Formulaire officiel de Rapport pastoral direct pour les membres et responsables via lien */}
      {directSubmitTemplate && (
        <DirectReportModal
          template={directSubmitTemplate}
          currentUser={currentUser}
          onClose={() => setDirectSubmitTemplate(null)}
          onSubmitReport={(newRapport) => {
            handleAddRapport(newRapport);
          }}
        />
      )}

      {/* Consultation directe d'un Rapport transmis pour consultation immédiate */}
      {directViewRapport && (
        <RapportDetailModal
          rapport={directViewRapport}
          canAnnotate={currentUser?.role === 'PASTEUR'}
          onClose={() => setDirectViewRapport(null)}
          onUpdateRapport={(updated) => {
            handleUpdateRapport(updated);
            setDirectViewRapport(updated);
          }}
        />
      )}
    </div>
  );
}
