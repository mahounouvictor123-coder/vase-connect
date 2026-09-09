export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'RESPONSABLE' | 'MODERATEUR' | 'MEMBRE' | 'VISITEUR';

export type AvailabilityStatus = 'DISPONIBLE' | 'OCCUPE' | 'SUR_DEMANDE' | 'EN_MISSION';

export interface UserProfile {
  id: string;
  phone: string;
  phonePublic: boolean;
  addressPublic: boolean;
  proInfoPublic: boolean;
  firstName: string;
  lastName: string;
  photoUrl: string;
  profession: string;
  bio: string;
  city: string;
  country: string;
  skills: string[];
  activities: string[]; // e.g. "Vente informatique", "Développement web", "Couture"
  departmentId: string; // e.g. "jeunesse", "chorale", "hommes", "femmes", "media"
  departmentName: string;
  availableForOpportunities: boolean;
  availableForMissions: boolean;
  status: AvailabilityStatus;
  experienceYears?: number;
  education?: string;
  portfolioUrl?: string;
  whatsappNumber?: string;
  role: Role;
  completionScore: number; // 0 - 100%
  influenceGates?: string[]; // IDs des 12 Portes d'Influence où le membre intervient
  gateProfiles?: Record<string, GateMemberProfile>; // Profil détaillé par porte d'influence
  createdAt: string;
}

export type InfluenceGateId =
  | 'croyance_coutume'
  | 'education'
  | 'legislation'
  | 'gouvernement'
  | 'politique'
  | 'media_communication'
  | 'ressource_terre'
  | 'finance'
  | 'transport_service'
  | 'art_divertissement'
  | 'sante'
  | 'armee';

export interface GateMemberProfile {
  id: string;
  userId: string;
  gateId: InfluenceGateId;
  memberName: string;
  memberProfession: string;
  memberPhoto: string;
  memberPhone?: string;
  memberCity: string;
  memberCountry?: string;
  roleInGate: string; // Ex: "Professionnel / Cadre", "Entrepreneur / Fondateur", "Étudiant / En formation", "Leader d'opinion", "Consultant / Expert"
  subSector: string; // Sous-domaine d'activité précis
  organization?: string; // Entreprise, ministère, école, cabinet, institution
  visionImpact: string; // Comment le membre manifeste les principes du Royaume de Dieu dans ce domaine
  skills: string[];
  seekingCollaboration: boolean;
  openForMentoring: boolean;
  whatsappContact?: string;
  emailContact?: string;
  registeredAt: string;
}

export interface InfluenceGate {
  id: InfluenceGateId;
  number: number; // 1 à 12
  name: string;
  subTitle: string;
  description: string;
  apostolicVision: string; // L'enseignement du Pasteur Mohammed Sanogo
  scriptureReference: string; // Verset d'ancrage biblique
  biblicalExample: string; // Exemple biblique (Daniel, Joseph, Néhémie, Esther, Paul, David...)
  iconName: string;
  themeColor: string; // Hex color
  bgGradient: string;
  keySubSectors: string[]; // Sous-secteurs d'intervention
  suggestedRoles: string[];
  bannerUrl: string;
}

export type ProductCategory =
  | 'HIGH_TECH'
  | 'MODE_TEXTILE'
  | 'ALIMENTATION'
  | 'BEAUTE_SANTE'
  | 'MAISON_DECO'
  | 'EDUCATION'
  | 'AUTOMOBILE_TRANSPORT'
  | 'SERVICES_PRO';

export interface ProductItem {
  id: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  type: 'PRODUIT' | 'SERVICE' | 'FORMATION' | 'PRESTATION';
  description: string;
  price: number;
  currency: string; // "FCFA"
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  sellerCity: string;
  sellerPhoto: string;
  sellerDepartment: string;
  imageUrl: string;
  isAvailable: boolean;
  tags: string[];
  createdAt: string;
}

export type OpportunityType = 'EMPLOI' | 'STAGE' | 'MISSION' | 'RECRUTEMENT' | 'BENEVOLAT' | 'PARTENARIAT';

export interface OpportunityItem {
  id: string;
  title: string;
  companyOrMinistry: string;
  type: OpportunityType;
  typeLabel: string;
  location: string;
  description: string;
  requiredSkills: string[];
  authorId: string;
  authorName: string;
  authorPhoto: string;
  compensation?: string;
  deadline?: string;
  imageUrl?: string; // Visual announcement / RH flyer / poster
  contactWhatsApp?: string;
  contactEmail?: string;
  contractType?: string;
  rawDescription?: string;
  createdAt: string;
  matchedProfiles?: {
    memberId: string;
    memberName: string;
    profession: string;
    city: string;
    matchPercent: number;
    matchingSkills: string[];
  }[];
}

export interface MemberAd {
  id: string;
  title: string;
  shopName: string;
  ownerId: string;
  ownerName: string;
  ownerPhoto: string;
  category: ProductCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  discountBadge?: string; // e.g. "-20% Réduction Membres", "Livraison Gratuite"
  bannerUrl: string;
  whatsappNumber: string;
  ctaText: string;
  featured: boolean;
  badgeLabel?: string; // "Sponsorisé", "Boutique Certifiée", "Offre Spéciale"
  city: string;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description: string;
  leaderName: string;
  leaderTitle: string;
  memberCount: number;
  iconName: string;
  bannerColor: string;
  activities: string[];
  announcements: string[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorProfession: string;
  authorPhoto: string;
  authorDepartment: string;
  content: string;
  imageUrl?: string;
  category: 'TEMOIGNAGE' | 'ANNONCE' | 'ENTRAIDE' | 'EVENEMENT' | 'INSPIRATION';
  categoryLabel: string;
  likesCount: number;
  likedByCurrentUser?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorPhoto: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  imageUrl: string;
  attendeesCount: number;
  isRegistered?: boolean;
  tags: string[];
}

export interface AISearchResult {
  query: string;
  intent: string;
  extractedCriteria: {
    domain?: string;
    activity?: string;
    productOrSkill?: string;
    location?: string;
    targetGroup?: string;
  };
  matchedMembers: {
    member: UserProfile;
    relevanceReason: string;
    matchScore: number;
  }[];
  matchedProducts: {
    product: ProductItem;
    relevanceReason: string;
  }[];
  matchedOpportunities: {
    opportunity: OpportunityItem;
    relevanceReason: string;
  }[];
  matchedEvents?: ChurchEvent[];
  matchedDepartments?: DepartmentItem[];
  naturalAnswer: string;
  noResultsFound: boolean;
  suggestedAction?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'OPPORTUNITY' | 'MESSAGE' | 'AI_MATCH' | 'COMMUNITY' | 'EVENT';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export type NotificationItem = AppNotification;
