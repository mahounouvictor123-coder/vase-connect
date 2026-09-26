export type Role = 'PASTEUR' | 'SUPER_ADMIN' | 'ADMIN' | 'RESPONSABLE' | 'RESPONSABLE_COEUR_HONNEUR' | 'MODERATEUR' | 'MEMBRE' | 'VISITEUR';

export type AvailabilityStatus = 'DISPONIBLE' | 'OCCUPE' | 'SUR_DEMANDE' | 'EN_MISSION';

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
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
  departmentIds?: string[]; // IDs des 2 à 3 départements choisis
  departmentNames?: string[]; // Noms des 2 à 3 départements choisis
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
  tribeId?: TribeId;
  tribeRole?: TribeRole;
  quartier?: string;
  familleHonneurId?: string;
  createdAt: string;
}

export type TribeId =
  | 'ruben'
  | 'simeon'
  | 'levi'
  | 'juda'
  | 'dan'
  | 'nephtali'
  | 'gad'
  | 'aser'
  | 'issacar'
  | 'zabulon'
  | 'joseph'
  | 'benjamin';

export type TribeRole = 'PATRIARCHE' | 'MATRIARCHE' | 'MEMBRE' | 'RESPONSABLE';

export interface TribeLeader {
  title: 'Patriarche' | 'Matriarche';
  nom: string;
  prenom: string;
  phone: string;
  quartier: string;
  photoUrl: string;
  assignedAt?: string;
  bio?: string;
}

export interface TribeMember {
  id: string;
  tribeId: TribeId;
  nom: string;
  prenom: string;
  numero: string;
  quartier: string;
  photoUrl: string;
  roleInTribe: TribeRole;
  registeredAt: string;
  userId?: string;
}

export interface TribeInfo {
  id: TribeId;
  name: string;
  biblicalMeaning: string;
  propheticBlessing: string;
  symbol: string;
  iconName: string;
  color: string;
  gradient: string;
  description: string;
  leader?: TribeLeader;
}

export interface FamilleReunionPhoto {
  id: string;
  date: string;
  titre: string;
  photoUrl: string;
  description?: string;
  publiePar: string;
  participantsCount?: number;
}

export interface FamilleHonneur {
  id: string;
  nom: string;
  nomFamille: string;
  quartier: string;
  commune: string;
  adresseRepere: string;
  latitude: number;
  longitude: number;
  // Berger (Leader spirituel de la Famille d'Honneur)
  bergerNom: string;
  bergerPrenom?: string;
  bergerRole?: string;
  bergerPhone: string;
  bergerWhatsapp: string;
  bergerPhotoUrl: string;
  // Hôte (Foyer d'accueil)
  hoteNom: string;
  hotePrenom: string;
  hoteRole: string;
  hotePhone: string;
  hoteWhatsapp: string;
  hotePhotoUrl?: string;
  // Cadre & Maison
  photoMaisonUrl?: string;
  photoFamilleUrl?: string;
  // Photos de réunions post-rencontre
  photosReunions?: FamilleReunionPhoto[];
  rencontreFrequence: string;
  rencontreHeure: string;
  prochaineDate: string;
  capaciteAccueil: number;
  description: string;
  programmeAccueil: string[];
  membresInscritsCount: number;
  actif: boolean;
  distanceKm?: number;
  createdAt: string;
}

export interface FamilleHonneurInscription {
  id: string;
  familleId: string;
  userId?: string;
  nom: string;
  prenom: string;
  telephone: string;
  whatsapp?: string;
  quartier: string;
  profession?: string;
  statutMembre?: 'MEMBRE_REGULIER' | 'NOUVEAU_CONVERTI' | 'VISITEUR' | 'RESPONSABLE_ACCUEIL' | 'BENEVOLE';
  dateInscription: string;
  statut: 'INSCRIT' | 'PARTICIPANT_ACTIF' | 'INVITE';
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

export interface GateResponsibleInfo {
  id: string;
  gateId: InfluenceGateId;
  nom: string;
  prenom?: string;
  titre: string; // Ex: "Pilote Apostolique", "Responsable Référent"
  profession: string;
  organisation: string;
  phone: string;
  whatsapp: string;
  email: string;
  photoUrl: string;
  passcode: string;
  mandatVision: string;
  objectifsAnnuels: string[];
  actionsPrioritaires: string[];
}

export interface GateProjectItem {
  id: string;
  gateId: InfluenceGateId;
  titre: string;
  description: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'REALISE';
  dateEcheance: string;
  porteurProjet: string;
  impactAttendu: string;
  partenairesRecherches?: string;
}

export interface GateAnnouncementItem {
  id: string;
  gateId: InfluenceGateId;
  titre: string;
  contenu: string;
  date: string;
  auteur: string;
  priorite: 'NORMALE' | 'HAUTE' | 'URGENTE';
}

export interface GateRapportPastorale {
  id: string;
  gateId: InfluenceGateId;
  dateSoumission: string;
  responsableNom: string;
  sujet: string;
  faitsMarquants: string;
  statistiques: {
    membresActifs: number;
    synergiesLancees: number;
    mentoresSuivis: number;
  };
  defisEtBesoins: string;
  sujetsPriere: string;
  transmisAuPasteur: boolean;
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
  responsable?: GateResponsibleInfo;
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

export interface DepartmentMember {
  id: string;
  departmentId: string;
  memberId?: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  roleInDepartment: string; // Ex: 'Responsable', 'Adjoint', 'Chantre', 'Caméraman', 'Intercesseur', 'Protocole', 'Membre Actif'
  dateAdhesion?: string;
  competences?: string[];
  photoUrl?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description: string;
  leaderName: string;
  leaderTitle: string;
  leaderPhone?: string;
  leaderEmail?: string;
  leaderPhoto?: string;
  memberCount: number;
  iconName: string;
  bannerColor: string;
  activities: string[];
  announcements: string[];
  membersList?: DepartmentMember[];
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

// ==========================================
// ESPACE PASTEUR : RÉSUMÉS, RAPPORTS & INBOX
// ==========================================

export interface CulteResumeStatistiques {
  totalPresents: number;
  hommes: number;
  femmes: number;
  enfants: number;
  nouveauxVenus: number;
  conversions: number;
  baptemesOuRecons?: number;
}

export type CulteServiceType = 'CULTE_1_07H30' | 'CULTE_2_10H30';

export interface CultePresenceRecord {
  id: string;
  dateDimanche: string; // Format YYYY-MM-DD
  culte: CulteServiceType;
  culteLabel: string; // "1er Culte (07h30)" ou "2ème Culte (10h30)"
  memberId?: string;
  nom: string;
  prenom: string;
  telephone: string;
  tribeId: TribeId;
  tribeName: string;
  quartier?: string;
  statutMembre: 'MEMBRE_REGULIER' | 'NOUVEAU_CONVERTI' | 'VISITEUR' | 'OUVRIER' | 'RESPONSABLE';
  confirmeAt: string;
  source: 'LIEN_MEMBRE' | 'PASTEUR_MANUEL';
  notes?: string;
}

export interface CulteResume {
  id: string;
  date: string;
  typeCulte: string;
  theme: string;
  orateur: string;
  passageBiblique: string;
  pointsCles: string[];
  statistiques: CulteResumeStatistiques;
  temoignagesMarquants: string[];
  notesPastorales?: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface RapportTemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean' | 'photo';
  placeholder?: string;
  required: boolean;
  options?: string[];
  section?: string;
}

export interface RapportTemplate {
  id: string;
  titre: string;
  categorie: 'TRIBU' | 'DEPARTEMENT' | 'FAMILLE_HONNEUR' | 'MISSION_EVANGELISATION' | 'PERSONNALISE';
  description: string;
  icone: string;
  elementsObligatoires: string[];
  champs: RapportTemplateField[];
  createdAt: string;
}

export interface RapportReponsePastorale {
  date: string;
  note: string;
  pasteurNom: string;
  priereOuBenediction?: string;
}

export interface RapportSoumis {
  id: string;
  templateId: string;
  templateTitre: string;
  categorie: 'TRIBU' | 'DEPARTEMENT' | 'FAMILLE_HONNEUR' | 'MISSION_EVANGELISATION' | 'PERSONNALISE';
  entiteConcernee: string;
  auteurId: string;
  auteurNom: string;
  auteurRole: string;
  auteurTelephone: string;
  auteurPhotoUrl?: string;
  dateRapport: string;
  periode: string;
  valeurs: Record<string, any>;
  statut: 'NOUVEAU' | 'LU' | 'EN_COURS' | 'VALIDE' | 'ANNOTATION_PASTORALE' | 'ARCHIVE';
  reponsePastorale?: RapportReponsePastorale;
  photos?: string[];
  urgente: boolean;
  createdAt: string;
}

export interface RapportSpecialSynthese {
  sectionTitre: string;
  contenu: string;
  chiffreCle?: string;
}

export interface RapportSpecial {
  id: string;
  titre: string;
  periode: string;
  introduction: string;
  statistiquesGlobales: {
    totalParticipants?: number;
    nouvellesAmes?: number;
    tribusActives?: number;
    famillesActives?: number;
    departementsMobilises?: number;
  };
  syntheses: RapportSpecialSynthese[];
  directivesPastorales: string[];
  recommandations?: string;
  dateGeneration: string;
  partageFormat: 'TEXTE' | 'WHATSAPP' | 'IMPRESSION';
}

// ==========================================
// CŒUR D'HONNEUR - ESPACE SOCIAL & SOLIDARITÉ
// ==========================================

export type AideCategory =
  | 'ALIMENTATION'
  | 'SANTE'
  | 'SCOLARITE'
  | 'LOGEMENT'
  | 'EMPLOI_MICROPROJET'
  | 'SOUTIEN_MORAL_PRIERE'
  | 'VESTIMENTAIRE'
  | 'AUTRE';

export type AideUrgenceLevel = 'CRITIQUE' | 'URGENT' | 'MODERE' | 'PONCTUEL';

export type AideDemandeStatut =
  | 'SOUMIS'
  | 'EN_COURS'
  | 'VALIDE'
  | 'ACCOMPLI'
  | 'REORIENTE'
  | 'REFUSE';

export interface CoeurDemandeAide {
  id: string;
  campagneId?: string;
  campagneTitre?: string;
  demandeurId?: string;
  demandeurNom: string;
  demandeurPrenom: string;
  demandeurTelephone: string;
  demandeurWhatsApp?: string;
  demandeurEmail?: string;
  demandeurQuartier: string;
  demandeurTribuId?: TribeId;
  demandeurFamilleHonneurId?: string;
  categorie: AideCategory;
  titre: string;
  description: string;
  niveauUrgence: AideUrgenceLevel;
  montantEstime?: number; // En FCFA
  natureBesoin?: string; // Ex: Sac de riz, Médicaments, Écolage
  confidentialite: 'CONFIDENTIEL_EQUIPE' | 'PARTAGE_COMMUNAUTE';
  nombrePersonnesFoyer?: number;
  statut: AideDemandeStatut;
  notesResponsable?: string;
  aideAlloueeDescription?: string;
  montantAlloue?: number;
  dateTraitement?: string;
  traitePar?: string;
  createdAt: string;
}

export interface CoeurCampagneAide {
  id: string;
  titre: string;
  description: string;
  categorie: AideCategory;
  objectifFinancier?: number; // En FCFA
  fondsCollectes?: number;
  objectifQuantite?: string; // Ex: "100 sacs de riz et vivres", "50 kits scolaires"
  quantiteDistribuee?: string;
  beneficiairesCibles: string;
  dateDebut: string;
  dateFin: string;
  statut: 'ACTIVE' | 'CLOTUREE' | 'PREPARATION';
  nombreDemandesRecues: number;
  nombreAidesAccordees: number;
  responsableNom: string;
  responsableContact: string;
  imageBannerUrl?: string;
  lienPartage: string;
  createdAt: string;
}

export type DelegationPortionType =
  | 'MEMBRE'
  | 'RESPONSABLE_PRESENCES'
  | 'RESPONSABLE_TRIBU'
  | 'BERGER_FAMILLE'
  | 'RESPONSABLE_DEPARTEMENT'
  | 'RESPONSABLE_COEUR_HONNEUR'
  | 'SUR_MESURE';

export interface PastorDelegation {
  id: string;
  nomBeneficiaire: string;
  telephoneBeneficiaire?: string;
  titreRole: string;
  typePortion: DelegationPortionType;
  ongletsAutorises: string[];
  portionsPastoralesAutorisees?: (
    | 'inbox'
    | 'cultes'
    | 'templates'
    | 'speciaux'
    | 'presences'
    | 'membres'
    | 'responsables'
    | 'cloisonnement'
  )[];
  entiteAssociee?: string;
  actif: boolean;
  dateCreation: string;
  codeAccesCourt: string;
  notesPastorales?: string;
}



