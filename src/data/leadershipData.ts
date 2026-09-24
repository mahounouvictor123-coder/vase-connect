import { UserProfile } from '../types';

export type LeadershipCategory = 'PASTEUR' | 'CHEF_TRIBU' | 'BERGER_FAMILLE' | 'CHEF_DEPARTEMENT' | 'RESPONSABLE_PORTE';

export interface LeadershipAccount {
  id: string;
  category: LeadershipCategory;
  title: string; // e.g. "Pasteur Principal", "Patriarche / Matriarche", "Berger de Famille d'Honneur", "Responsable de Département"
  targetName: string; // e.g. "Chaire Pastorale", "Tribu de Juda", "Famille d'Honneur Grâce & Vie", "Département Communication"
  targetId?: string; // id of the tribe, famille, or department
  holderName: string; // Name of the leader
  phone: string;
  email?: string;
  passcode: string; // The secret PIN / password
  photoUrl: string;
  description: string;
}

export const INITIAL_LEADERSHIP_ACCOUNTS: LeadershipAccount[] = [
  // 1. Pasteur Principal
  {
    id: 'lead-pasteur-principal',
    category: 'PASTEUR',
    title: 'Pasteur Principal',
    targetName: 'Chaire Pastorale & Direction de l\'Église',
    holderName: 'Pasteur Mohammed Sanogo',
    phone: '+225 07 00 00 00 00',
    email: 'pasteur@vasesdhonneur.ci',
    passcode: '7777',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    description: 'Accès exclusif à la vision d\'ensemble, rapports consolidés, résumés de cultes, annuaire confidentiel des fidèles et alertes urgentes.',
  },

  // 2. Chefs de Tribus (Patriarches & Matriarches)
  {
    id: 'lead-tribu-ruben',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Ruben',
    targetId: 'ruben',
    holderName: 'Patriarche Emmanuel Kouadio',
    phone: '+225 07 48 12 34 56',
    passcode: '1201',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Gestion des membres inscrits dans la Tribu de Ruben, pointage dominical, création & transmission de rapports pastoraux.',
  },
  {
    id: 'lead-tribu-juda',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Juda',
    targetId: 'juda',
    holderName: 'Patriarche Samuel Koffi',
    phone: '+225 07 10 20 30 40',
    passcode: '1204',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    description: 'Supervision de la Tribu de Juda (Louange & Conquête), assiduité des fidèles et envoi de synthèses au Pasteur.',
  },
  {
    id: 'lead-tribu-simeon',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Matriarche)',
    targetName: 'Tribu de Siméon',
    targetId: 'simeon',
    holderName: 'Matriarche Awa Grâce Traoré',
    phone: '+225 05 84 23 11 90',
    passcode: '1202',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: 'Supervision spirituelle de la Tribu de Siméon, accompagnement des familles et transmission des rapports.',
  },
  {
    id: 'lead-tribu-levi',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Lévi',
    targetId: 'levi',
    holderName: 'Patriarche David Marcel Yao',
    phone: '+225 07 59 77 44 22',
    passcode: '1203',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    description: 'Sacerdoce, intercession sacerdotale, service saint et édification des autels de la Tribu de Lévi.',
  },
  {
    id: 'lead-tribu-dan',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Dan',
    targetId: 'dan',
    holderName: 'Patriarche Daniel Bamba',
    phone: '+225 07 01 22 33 44',
    passcode: '1205',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    description: 'Sentinelle et discernement spirituel au sein de la Tribu de Dan.',
  },
  {
    id: 'lead-tribu-nephtali',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Matriarche)',
    targetName: 'Tribu de Nephtali',
    targetId: 'nephtali',
    holderName: 'Matriarche Rebecca Konan',
    phone: '+225 05 11 22 33 44',
    passcode: '1206',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    description: 'Grâce, paroles agréables, réjouissance et communion fraternelle dans la Tribu de Nephtali.',
  },
  {
    id: 'lead-tribu-gad',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Gad',
    targetId: 'gad',
    holderName: 'Patriarche Josué N\'Guessan',
    phone: '+225 07 22 33 44 55',
    passcode: '1207',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    description: 'Vaillance, triomphe à la fin et persévérance des fidèles de la Tribu de Gad.',
  },
  {
    id: 'lead-tribu-aser',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu d\'Aser',
    targetId: 'aser',
    holderName: 'Patriarche Caleb Touré',
    phone: '+225 07 33 44 55 66',
    passcode: '1208',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    description: 'Prospérité, huile sainte, abondance et délices royaux de la Tribu d\'Aser.',
  },
  {
    id: 'lead-tribu-issacar',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu d\'Issacar',
    targetId: 'issacar',
    holderName: 'Patriarche Salomon Ouattara',
    phone: '+225 05 44 55 66 77',
    passcode: '1209',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Intelligence des temps et des saisons, stratégie du Royaume dans la Tribu d\'Issacar.',
  },
  {
    id: 'lead-tribu-zabulon',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Matriarche)',
    targetName: 'Tribu de Zabulon',
    targetId: 'zabulon',
    holderName: 'Matriarche Esther Diabaté',
    phone: '+225 07 55 66 77 88',
    passcode: '1210',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    description: 'Commerce intègre, navigation vers les nations et soutien aux expéditions missionnaires.',
  },
  {
    id: 'lead-tribu-joseph',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Joseph',
    targetId: 'joseph',
    holderName: 'Patriarche David Kouassi',
    phone: '+225 07 66 77 88 99',
    passcode: '1211',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    description: 'Rameau fécond au bord de la source divine, bénédiction abondante dans la Tribu de Joseph.',
  },
  {
    id: 'lead-tribu-benjamin',
    category: 'CHEF_TRIBU',
    title: 'Chef de Tribu (Patriarche)',
    targetName: 'Tribu de Benjamin',
    targetId: 'benjamin',
    holderName: 'Patriarche Benjamin Bakayoko',
    phone: '+225 05 77 88 99 00',
    passcode: '1213',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    description: 'Bien-aimé de l\'Éternel, protection et victoire matinale dans la Tribu de Benjamin.',
  },
  {
    id: 'lead-tribu-generic',
    category: 'CHEF_TRIBU',
    title: 'Chefs des 12 Tribus (Accès Général)',
    targetName: 'Toutes les 12 Tribus',
    holderName: 'Collège des Patriarches & Matriarches',
    phone: '+229 97 00 12 12',
    passcode: '1212',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: 'Code passe-partout sécurisé pour tous les responsables de tribus d\'Israël établis dans l\'église.',
  },

  // 3. Bergers des Familles d'Honneur
  {
    id: 'lead-fh-1',
    category: 'BERGER_FAMILLE',
    title: 'Berger',
    targetName: 'Famille Grâce & Vie (Fidjrossè)',
    targetId: 'fh-1',
    holderName: 'Pasteur Élisée Agossa',
    phone: '+229 97 10 20 30',
    passcode: '3301',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Berger pour la famille d\'honneur de Fidjrossè : fiches d\'inscriptions, photos et rapports au Pasteur.',
  },
  {
    id: 'lead-fh-2',
    category: 'BERGER_FAMILLE',
    title: 'Berger',
    targetName: 'Famille La Paix du Christ (Cadjèhoun)',
    targetId: 'fh-2',
    holderName: 'Pasteur Jean-Marc Houndété',
    phone: '+229 96 11 22 33',
    passcode: '3302',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    description: 'Supervision de la famille de Cadjèhoun, communion fraternelle et envoi de rapport au Pasteur.',
  },
  {
    id: 'lead-fh-generic',
    category: 'BERGER_FAMILLE',
    title: 'Berger (Accès Général)',
    targetName: 'Toutes les Familles d\'Honneur',
    holderName: 'Corps des Bergers Référents',
    phone: '+229 97 40 40 40',
    passcode: '3333',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    description: 'Code passe-partout sécurisé pour tous les Bergers des familles d\'honneur.',
  },

  // 4. Chefs de Départements (Communication, Louange, Intercession, Accueil, Protocole...)
  {
    id: 'lead-dept-com',
    category: 'CHEF_DEPARTEMENT',
    title: 'Responsable de Département',
    targetName: 'Département Communication & Médias',
    targetId: 'communication',
    holderName: 'Jean Koffi',
    phone: '+229 97 45 12 30',
    passcode: '5501',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: 'Régie audiovisuelle, streaming HD, réseaux sociaux, pointage d\'équipe et rapports médias.',
  },
  {
    id: 'lead-dept-louange',
    category: 'CHEF_DEPARTEMENT',
    title: 'Responsable de Département',
    targetName: 'Département Louange & Chorale',
    targetId: 'chorale',
    holderName: 'Chantre David Mensah',
    phone: '+229 97 88 55 22',
    passcode: '5502',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Conducteurs de louange, musiciens, répétitions, présence aux cultes et requêtes pastorales.',
  },
  {
    id: 'lead-dept-intercession',
    category: 'CHEF_DEPARTEMENT',
    title: 'Responsable de Département',
    targetName: 'Département Intercession & Prière',
    targetId: 'intercession',
    holderName: 'Maman Grâce Akindele',
    phone: '+229 94 22 11 00',
    passcode: '5503',
    photoUrl: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&auto=format&fit=crop&q=80',
    description: 'Sentinelles de prière, veilles nocturnes, requêtes d\'intercession et fiches de combat spirituel.',
  },
  {
    id: 'lead-dept-generic',
    category: 'CHEF_DEPARTEMENT',
    title: 'Chefs de Département (Accès Général)',
    targetName: 'Tous les Départements de l\'Église',
    holderName: 'Directoire des Départements',
    phone: '+229 96 00 55 55',
    passcode: '5555',
    photoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
    description: 'Code passe-partout sécurisé pour tous les responsables de pôles et ministères de l\'église.',
  },
  {
    id: 'lead-dept-accueil',
    category: 'CHEF_DEPARTEMENT',
    title: 'Responsable de Département',
    targetName: 'Département Accueil, Intégration & Protocole',
    targetId: 'accueil',
    holderName: 'Maman Sarah Gbaguidi',
    phone: '+229 97 12 34 56',
    passcode: '5504',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: 'Accueil chaleureux des nouveaux convertis, orientation des fidèles et service du sanctuaire.',
  },
  {
    id: 'lead-dept-coeur',
    category: 'CHEF_DEPARTEMENT',
    title: 'Responsable Le Cœur d\'Honneur',
    targetName: 'Le Cœur d\'Honneur (Action Sociale & Entraide)',
    targetId: 'coeur_honneur',
    holderName: 'Pasteur David Mensah & Équipe Diaconale',
    phone: '+229 97 00 90 90',
    passcode: '5505',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    description: 'Supervision des campagnes de bienfaisance, validation des demandes d\'aide d\'urgence et redistribution fraternelle.',
  },

  // 5. Responsables des 12 Portes d'Influence
  {
    id: 'lead-porte-1',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 1 — Croyance et coutume',
    targetId: 'croyance_coutume',
    holderName: 'Pasteur Barnabé Houessou',
    phone: '+229 97 22 33 44',
    passcode: '4001',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable de la Porte Croyance & Coutume : animation des théologiens et pasteurs, réformation éthique.',
  },
  {
    id: 'lead-porte-2',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 2 — Éducation',
    targetId: 'education',
    holderName: 'Pr. David Sossou',
    phone: '+229 97 33 44 55',
    passcode: '4002',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Éducation : mentorat académique, excellence scolaire et formation de la jeunesse avec la sagesse de Daniel.',
  },
  {
    id: 'lead-porte-3',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 3 — Législation',
    targetId: 'legislation',
    holderName: 'Me Christine Lawson',
    phone: '+229 96 44 55 66',
    passcode: '4003',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Législation & Justice : réseau des juristes et magistrats pour défendre l\'équité et le droit biblique.',
  },
  {
    id: 'lead-porte-4',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 4 — Gouvernement & Structure',
    targetId: 'gouvernement',
    holderName: 'Dr. Honoré Ahounou',
    phone: '+229 95 55 66 77',
    passcode: '4004',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Gouvernement : intégrité incorruptible de Joseph dans l\'administration publique.',
  },
  {
    id: 'lead-porte-5',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 5 — Politique',
    targetId: 'politique',
    holderName: 'Aimé Zinsou',
    phone: '+229 96 33 44 55',
    passcode: '4005',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Politique : promotion du service public, droiture civique et justice sociale.',
  },
  {
    id: 'lead-porte-6',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 6 — Média & Communication',
    targetId: 'media_communication',
    holderName: 'Sarah Hounkpatin',
    phone: '+229 94 66 77 88',
    passcode: '4006',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Médias : diffusion de la vérité, production d\'excellence et influence audiovisuelle.',
  },
  {
    id: 'lead-porte-7',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 7 — Ressource & Gestion de la terre',
    targetId: 'ressource_terre',
    holderName: 'Ing. Urbain Dossou',
    phone: '+229 97 77 88 99',
    passcode: '4007',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Ressources & Agriculture : sécurité alimentaire, souveraineté et valorisation agropastorale éthique.',
  },
  {
    id: 'lead-porte-8',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 8 — Finance & Économie',
    targetId: 'finance',
    holderName: 'Patrick Akakpo',
    phone: '+229 95 12 34 78',
    passcode: '4008',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Finance : gestion d\'actifs, investissements du Royaume et synergie des banquiers chrétiens.',
  },
  {
    id: 'lead-porte-9',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 9 — Transport & Service',
    targetId: 'transport_service',
    holderName: 'Blaise Agbo',
    phone: '+229 97 88 99 00',
    passcode: '4009',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Transport & Services : logistique d\'excellence et manifestation du service par amour.',
  },
  {
    id: 'lead-porte-10',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 10 — Art, Culture & Divertissement',
    targetId: 'art_divertissement',
    holderName: 'Noémie Adjovi',
    phone: '+229 96 88 77 66',
    passcode: '4010',
    photoUrl: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Arts & Culture : célébration de la beauté, musique et production inspirée du Saint-Esprit.',
  },
  {
    id: 'lead-porte-11',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 11 — Santé & Relation d\'aide',
    targetId: 'sante',
    holderName: 'Dr. Marcelle Ahouandjinou',
    phone: '+229 95 88 99 11',
    passcode: '4011',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Santé & Soins : compassion de Christ, médecine de pointe et guérison pour la nation.',
  },
  {
    id: 'lead-porte-12',
    category: 'RESPONSABLE_PORTE',
    title: 'Pilote Apostolique',
    targetName: 'Porte 12 — Armée & Sécurité',
    targetId: 'armee',
    holderName: 'Capitaine Éric Gnacadja',
    phone: '+229 94 55 66 77',
    passcode: '4012',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    description: 'Espace Responsable Armée & Sécurité : honneur, protection civile et bravoure sous la bannière du Dieu des armées.',
  },
  {
    id: 'lead-porte-generic',
    category: 'RESPONSABLE_PORTE',
    title: 'Directoire des 12 Portes d\'Influence',
    targetName: 'Les 12 Portes d\'Influence (Accès Général)',
    holderName: 'Collège des Pilotes Apostoliques',
    phone: '+229 97 00 12 12',
    passcode: '1212',
    photoUrl: 'https://images.unsplash.com/photo-1519491058804-de0d256ce533?w=400&auto=format&fit=crop&q=80',
    description: 'Code passe-partout pour tous les responsables et coordinateurs des 12 Portes d\'Influence.',
  },
];

const LOCAL_STORAGE_KEY_LEADERSHIP = 'vases_leadership_auth_session';
export const LOCAL_STORAGE_KEY_ACCOUNTS = 'vases_leadership_accounts';

export interface LeadershipSession {
  account: LeadershipAccount;
  unlockedAt: string;
}

export function saveLeadershipSession(account: LeadershipAccount) {
  try {
    const session: LeadershipSession = {
      account,
      unlockedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_LEADERSHIP, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving leadership session', e);
  }
}

export function getActiveLeadershipSession(): LeadershipSession | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LEADERSHIP);
    if (!saved) return null;
    return JSON.parse(saved) as LeadershipSession;
  } catch {
    return null;
  }
}

export function clearLeadershipSession() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_LEADERSHIP);
  } catch (e) {
    console.error('Error clearing leadership session', e);
  }
}

/**
 * Get all leadership accounts (loads from localStorage or falls back to initial)
 */
export function getLeadershipAccounts(): LeadershipAccount[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading leadership accounts', e);
  }
  return INITIAL_LEADERSHIP_ACCOUNTS;
}

/**
 * Save all leadership accounts to localStorage and emit event
 */
export function saveLeadershipAccounts(accounts: LeadershipAccount[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vases-leadership-updated', { detail: accounts }));
    }
  } catch (e) {
    console.error('Error saving leadership accounts', e);
  }
}

/**
 * Generate a random 4-digit numeric passcode
 */
export function generateRandomPasscode(length: number = 4): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

/**
 * Generate and assign fresh passcodes for all appointed leaders (except Pasteur Principal 7777)
 */
export function generatePasscodesForAllLeaders(): LeadershipAccount[] {
  const current = getLeadershipAccounts();
  const updated = current.map(acc => {
    if (acc.id === 'lead-pasteur-principal') {
      return acc;
    }
    return {
      ...acc,
      passcode: generateRandomPasscode(4),
    };
  });
  saveLeadershipAccounts(updated);
  return updated;
}

/**
 * Update an existing leadership account
 */
export function updateLeadershipAccount(
  accountId: string,
  updates: Partial<LeadershipAccount>
): LeadershipAccount[] {
  const current = getLeadershipAccounts();
  const updated = current.map(acc => {
    if (acc.id === accountId) {
      return { ...acc, ...updates };
    }
    return acc;
  });
  saveLeadershipAccounts(updated);
  return updated;
}

/**
 * Replace a leader in a specific space (with new name, phone, photo, passcode)
 */
export function replaceLeaderInAccount(
  accountId: string,
  newLeader: {
    holderName: string;
    phone: string;
    email?: string;
    photoUrl: string;
    title?: string;
    description?: string;
    passcode?: string;
  }
): LeadershipAccount[] {
  const current = getLeadershipAccounts();
  const updated = current.map(acc => {
    if (acc.id === accountId) {
      return {
        ...acc,
        holderName: newLeader.holderName,
        phone: newLeader.phone,
        email: newLeader.email || acc.email,
        photoUrl: newLeader.photoUrl,
        title: newLeader.title || acc.title,
        description: newLeader.description || acc.description,
        passcode: newLeader.passcode || acc.passcode || generateRandomPasscode(4),
      };
    }
    return acc;
  });
  saveLeadershipAccounts(updated);
  return updated;
}

/**
 * Revoke/delete a leader from an account, setting it to vacant
 */
export function revokeLeaderInAccount(accountId: string): LeadershipAccount[] {
  unclaimLeadershipSpace(accountId);
  const current = getLeadershipAccounts();
  const updated = current.map(acc => {
    if (acc.id === accountId) {
      return {
        ...acc,
        holderName: 'Poste Vacant (En attente de nomination)',
        phone: '',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        description: 'Poste actuellement vacant. En attente de désignation officielle par le Pasteur Mohammed Sanogo.',
        passcode: generateRandomPasscode(4),
      };
    }
    return acc;
  });
  saveLeadershipAccounts(updated);
  return updated;
}

export const LOCAL_STORAGE_KEY_PASTOR_REGISTERED = 'vases_pastor_registered';
export const LOCAL_STORAGE_KEY_PASTOR_PASSCODE = 'vases_pastor_custom_passcode';
export const LOCAL_STORAGE_KEY_CLAIMED_SPACES = 'vases_claimed_leader_spaces';

/**
 * Check if the Pastor has already registered
 */
export function isPastorRegistered(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY_PASTOR_REGISTERED) === 'true';
  } catch {
    return false;
  }
}

/**
 * Get custom pastor passcode if created
 */
export function getPastorCustomPasscode(): string {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PASTOR_PASSCODE);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // fallback
  }
  return '7777';
}

/**
 * Register Pastor Account with custom password
 */
export function registerPastorAccount(
  customPasscode: string,
  pastorDetails?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }
): void {
  try {
    const cleanPass = customPasscode.trim();
    localStorage.setItem(LOCAL_STORAGE_KEY_PASTOR_REGISTERED, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_PASTOR_PASSCODE, cleanPass);

    const current = getLeadershipAccounts();
    const updated = current.map(acc => {
      if (acc.id === 'lead-pasteur-principal') {
        return {
          ...acc,
          holderName: pastorDetails?.firstName && pastorDetails?.lastName
            ? `${pastorDetails.firstName} ${pastorDetails.lastName}`
            : 'Pasteur Mohammed Sanogo',
          phone: pastorDetails?.phone || acc.phone,
          email: pastorDetails?.email || acc.email,
          passcode: cleanPass,
        };
      }
      return acc;
    });

    saveLeadershipAccounts(updated);
  } catch (e) {
    console.error('Error registering pastor account', e);
  }
}

/**
 * Get array of account IDs that have already been registered/claimed by a leader
 */
export function getRegisteredLeadershipSpaceIds(): string[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CLAIMED_SPACES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * Claim an available leadership space during responsible registration
 */
export function claimLeadershipSpace(
  accountId: string,
  leaderInfo: {
    holderName: string;
    phone: string;
    email?: string;
    photoUrl?: string;
  }
): boolean {
  try {
    const currentClaimed = getRegisteredLeadershipSpaceIds();
    if (!currentClaimed.includes(accountId)) {
      const nextClaimed = [...currentClaimed, accountId];
      localStorage.setItem(LOCAL_STORAGE_KEY_CLAIMED_SPACES, JSON.stringify(nextClaimed));
    }

    const current = getLeadershipAccounts();
    const updated = current.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          holderName: leaderInfo.holderName,
          phone: leaderInfo.phone,
          email: leaderInfo.email || acc.email,
          photoUrl: leaderInfo.photoUrl || acc.photoUrl,
        };
      }
      return acc;
    });

    saveLeadershipAccounts(updated);
    return true;
  } catch (e) {
    console.error('Error claiming leadership space', e);
    return false;
  }
}

/**
 * Unclaim / release a leadership space so it becomes available again
 */
export function unclaimLeadershipSpace(accountId: string): void {
  try {
    const currentClaimed = getRegisteredLeadershipSpaceIds();
    const nextClaimed = currentClaimed.filter(id => id !== accountId);
    localStorage.setItem(LOCAL_STORAGE_KEY_CLAIMED_SPACES, JSON.stringify(nextClaimed));
  } catch (e) {
    console.error('Error unclaiming leadership space', e);
  }
}

/**
 * Reset pastor registration (for dev / administration testing)
 */
export function resetPastorRegistration(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PASTOR_REGISTERED);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PASTOR_PASSCODE);
  } catch (e) {
    console.error('Error resetting pastor registration', e);
  }
}

/**
 * Get leadership accounts that are currently available for registration
 * (excludes pastor and accounts already claimed by a responsible)
 */
export function getAvailableLeadershipAccountsForRegistration(): LeadershipAccount[] {
  const accounts = getLeadershipAccounts();
  const claimedIds = getRegisteredLeadershipSpaceIds();

  return accounts.filter(acc => {
    if (acc.id === 'lead-pasteur-principal') return false;
    // Exclude generic accounts from individual appointment
    if (acc.id.includes('generic')) return false;
    // Exclude already claimed accounts
    if (claimedIds.includes(acc.id)) return false;
    return true;
  });
}

/**
 * Verify passcode across all registered leadership accounts dynamically
 */
export function verifyLeadershipPasscode(
  enteredCode: string,
  expectedCategory?: LeadershipCategory
): LeadershipAccount | null {
  const clean = enteredCode.trim();
  if (!clean) return null;

  const accounts = getLeadershipAccounts();
  const pastorCustomPass = getPastorCustomPasscode();

  // Check match in accounts
  const found = accounts.find(acc => {
    const codeMatch = acc.passcode.toLowerCase() === clean.toLowerCase();
    if (!codeMatch) return false;
    if (expectedCategory && acc.category !== expectedCategory && acc.passcode !== '7777' && acc.passcode !== pastorCustomPass) {
      return false;
    }
    return true;
  });

  return found || null;
}
