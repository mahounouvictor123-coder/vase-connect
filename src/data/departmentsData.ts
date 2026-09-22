import { DepartmentItem, DepartmentMember } from '../types';

export const INITIAL_DEPARTMENTS_DATA: DepartmentItem[] = [
  {
    id: 'communication',
    name: 'Département de la Communication & Média',
    description: 'Porte-voix et vitrine digitale de l\'Église Porte des Cieux. Assure la retransmission vidéo HD, la production audiovisuelle, le graphisme, les réseaux sociaux et la diffusion des messages d\'impact.',
    leaderName: 'Frère Jean Koffi',
    leaderTitle: 'Directeur de la Communication & Médias',
    leaderPhone: '+229 97 45 12 30',
    leaderEmail: 'jean.koffi@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    memberCount: 28,
    iconName: 'Camera',
    bannerColor: '#0A3D36',
    activities: [
      'Streaming en direct des cultes (YouTube & Facebook Live)',
      'Couverture photographique et reportages vidéo',
      'Création des affiches et identité visuelle',
      'Gestion éditoriale des réseaux sociaux & site web',
      'Masterclass bimensuelle Média & Création de Contenu'
    ],
    announcements: [
      'Recrutement ouvert pour cadreurs et monteurs vidéo pour la convention annuelle',
      'Nouvelle régie de diffusion opérationnelle pour le culte de dimanche'
    ],
    membersList: [
      {
        id: 'dep-m-1',
        departmentId: 'communication',
        nom: 'Koffi',
        prenom: 'Jean',
        telephone: '+229 97 45 12 30',
        email: 'jean.koffi@portedescieux.org',
        roleInDepartment: 'Directeur de la Communication',
        dateAdhesion: '2022-01-15',
        competences: ['Direction Artistique', 'Réalisation Vidéo', 'Stratégie Digitale'],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-m-2',
        departmentId: 'communication',
        nom: 'Koudou',
        prenom: 'Aude',
        telephone: '+229 96 11 88 44',
        email: 'aude.k@portedescieux.org',
        roleInDepartment: 'Responsable Graphisme & Branding',
        dateAdhesion: '2023-03-10',
        competences: ['Photoshop', 'Illustrator', 'Figma', 'Affiches Cultes'],
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-m-3',
        departmentId: 'communication',
        nom: 'Dossou',
        prenom: 'Marc',
        telephone: '+229 97 88 55 22',
        roleInDepartment: 'Cadreur Principal & Régie Live',
        dateAdhesion: '2023-05-20',
        competences: ['Cadrage Caméra Tourelle', 'Mixage Vidéo ATEM', 'Lumières Studio'],
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-m-4',
        departmentId: 'communication',
        nom: 'Boco',
        prenom: 'Priscille',
        telephone: '+229 95 33 22 11',
        roleInDepartment: 'Community Manager & Réseaux Sociaux',
        dateAdhesion: '2024-01-08',
        competences: ['Instagram Reels', 'TikTok Foi', 'Copywriting spirituel'],
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-m-5',
        departmentId: 'communication',
        nom: 'N\'Guessan',
        prenom: 'Christian',
        telephone: '+229 94 77 66 55',
        roleInDepartment: 'Rédacteur & Relations Publiques',
        dateAdhesion: '2023-08-14',
        competences: ['Articles de foi', 'Communiqués de presse', 'Newsletter Vases'],
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'louange',
    name: 'Département de la Louange & Adoration',
    description: 'Chœur et orchestre Sons Célestes. Conduit l\'assemblée dans le parvis du Tout-Puissant avec excellence spirituelle, onction prophétique et harmonie vocale.',
    leaderName: 'Chantre Samuel K.',
    leaderTitle: 'Directeur Musical & Conducteur de Louange',
    leaderPhone: '+229 96 33 88 11',
    leaderEmail: 'samuel.louange@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    memberCount: 45,
    iconName: 'Music',
    bannerColor: '#C59A27',
    activities: [
      'Répétitions vocales tous les vendredis à 18h30',
      'Répétition générale avec orchestre samedis à 16h',
      'Formation continue solfège, respiration et harmonie vocale',
      'Veillées d\'Adoration nocturnes « Sons du Trône »',
      'Accompagnement des cultes de dimanche et temps d\'onction'
    ],
    announcements: [
      'Auditions ouvertes voix d\'hommes (Ténors & Basses) ce samedi à 15h',
      'Masterclass d\'improvisation prophétique le dernier vendredi du mois'
    ],
    membersList: [
      {
        id: 'dep-l-1',
        departmentId: 'louange',
        nom: 'Kouassi',
        prenom: 'Samuel',
        telephone: '+229 96 33 88 11',
        email: 'samuel.louange@portedescieux.org',
        roleInDepartment: 'Directeur Musical & Soliste',
        dateAdhesion: '2021-09-01',
        competences: ['Direction Vocale', 'Arrangement Piano', 'Conducteur de Culte'],
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-l-2',
        departmentId: 'louange',
        nom: 'Tchibozo',
        prenom: 'Grâce-Divine',
        telephone: '+229 97 12 34 56',
        roleInDepartment: 'Chantre Soliste Soprano',
        dateAdhesion: '2022-04-12',
        competences: ['Chant Solo', 'Harmonisation Soprano', 'Témoignage par le chant'],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-l-3',
        departmentId: 'louange',
        nom: 'Adébo',
        prenom: 'David',
        telephone: '+229 96 78 90 12',
        roleInDepartment: 'Pianiste Principal & Chef d\'Orchestre',
        dateAdhesion: '2021-11-20',
        competences: ['Piano Clavier', 'Accords Jazz Gospel', 'Direction des Instruments'],
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-l-4',
        departmentId: 'louange',
        nom: 'Mensah',
        prenom: 'Caleb',
        telephone: '+229 95 67 89 01',
        roleInDepartment: 'Batteur',
        dateAdhesion: '2023-02-15',
        competences: ['Batterie Gospel', 'Rythmes Louange Africaine', 'Métronome'],
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-l-5',
        departmentId: 'louange',
        nom: 'Vignon',
        prenom: 'Esther',
        telephone: '+229 94 56 78 90',
        roleInDepartment: 'Choriste Alto & Secrétaire du Groupe',
        dateAdhesion: '2022-08-30',
        competences: ['Voix Alto', 'Organisation des Partitions', 'Accueil Nouveaux Chantres'],
        photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-l-6',
        departmentId: 'louange',
        nom: 'Oladélé',
        prenom: 'Nathan',
        telephone: '+229 97 65 43 21',
        roleInDepartment: 'Bassiste & Régisseur d\'Instruments',
        dateAdhesion: '2023-06-10',
        competences: ['Basse 5 cordes', 'Groove spirituel', 'Câblage instruments'],
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'intercession',
    name: 'Département de l\'Intercession & Sentinelles',
    description: 'Armée de prière et sentinelles sur les murailles. Porte le Corps pastoral, les cultes, les familles, les malades, les nations et le réveil spirituel dans le jeûne et la supplication ardente.',
    leaderName: 'Maman Esther B.',
    leaderTitle: 'Conductrice Principale des Sentinelles & Prière Prophétique',
    leaderPhone: '+229 97 55 44 33',
    leaderEmail: 'intercession@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    memberCount: 62,
    iconName: 'Flame',
    bannerColor: '#0A3D36',
    activities: [
      'Veille de prière quotidienne de 05h00 à 06h00 (Ligne de Prière Vases)',
      'Intercession d\'enfantement avant chaque culte dominical (07h00 - 08h30)',
      'Nuit de Traversée & Combat Spirituel chaque 1er vendredi du mois',
      'Chaîne de jeûne continuel pour les requêtes pastorales et délivrances',
      'Visites de prière auprès des malades et personnes éprouvées'
    ],
    announcements: [
      'Chaîne de 21 jours de jeûne et prière pour la grande rentrée spirituelle',
      'Inscription à la garde de prière de nuit (créneaux de minuit à 3h)'
    ],
    membersList: [
      {
        id: 'dep-i-1',
        departmentId: 'intercession',
        nom: 'Babalola',
        prenom: 'Esther',
        telephone: '+229 97 55 44 33',
        email: 'intercession@portedescieux.org',
        roleInDepartment: 'Conductrice Principale des Sentinelles',
        dateAdhesion: '2020-03-01',
        competences: ['Combat Spirituel', 'Discernement des Esprits', 'Exhortation à la Prière'],
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-i-2',
        departmentId: 'intercession',
        nom: 'Houéto',
        prenom: 'Paul',
        telephone: '+229 96 22 33 44',
        roleInDepartment: 'Coordonnateur des Veilles de Nuit',
        dateAdhesion: '2021-05-15',
        competences: ['Veilles Nocturnes', 'Prière d\'Autorité', 'Suivi des Sujets Urgents'],
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-i-3',
        departmentId: 'intercession',
        nom: 'Ehouan',
        prenom: 'Marie-Ange',
        telephone: '+229 97 66 77 88',
        roleInDepartment: 'Sentinelle Prière Matinale',
        dateAdhesion: '2022-02-10',
        competences: ['Modération Ligne Matinale', 'Intercession Familles & Enfants'],
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-i-4',
        departmentId: 'intercession',
        nom: 'Fanou',
        prenom: 'Jonas',
        telephone: '+229 95 88 99 00',
        roleInDepartment: 'Guerrier Spirituel & Suivi de Délivrance',
        dateAdhesion: '2022-09-01',
        competences: ['Prière de Délivrance', 'Jeûne prolongé', 'Soutien aux Requêtes'],
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-i-5',
        departmentId: 'intercession',
        nom: 'Kèkè',
        prenom: 'Déborah',
        telephone: '+229 94 12 34 56',
        roleInDepartment: 'Intercession Cultes Dominicaux',
        dateAdhesion: '2023-04-18',
        competences: ['Prière pour la Parole', 'Couverture Spirituelle de la Chaire'],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'accueil',
    name: 'Département Accueil, Protocole & Hospitalité Royale',
    description: 'Premier contact d\'amour et de dignité reflétant la royauté du Christ. Assure l\'orientation des fidèles, l\'accueil bienveillant des nouveaux visiteurs et la logistique du parvis.',
    leaderName: 'Sœur Grâce A.',
    leaderTitle: 'Responsable Protocole & Hospitalité',
    leaderPhone: '+229 96 44 22 11',
    leaderEmail: 'protocole@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    memberCount: 52,
    iconName: 'Users',
    bannerColor: '#C59A27',
    activities: [
      'Accueil personnalisé de chaque fidèle dès l\'entrée du sanctuaire',
      'Placement ordonné et gestion des places assises',
      'Prise en charge chaleureuse des nouveaux venus après le culte',
      'Protocole d\'honneur pour les ministres de Dieu et invités d\'impact',
      'Organisation des agapes et cocktails fraternels'
    ],
    announcements: [
      'Répétition générale protocole pour la convention ce samedi à 10h',
      'Dotation des nouveaux uniformes et badges d\'accueil'
    ],
    membersList: [
      {
        id: 'dep-a-1',
        departmentId: 'accueil',
        nom: 'Assogba',
        prenom: 'Grâce',
        telephone: '+229 96 44 22 11',
        email: 'protocole@portedescieux.org',
        roleInDepartment: 'Responsable Protocole & Hospitalité',
        dateAdhesion: '2021-01-20',
        competences: ['Management d\'Équipe', 'Hospitalité Diplomatique', 'Relationnel'],
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-a-2',
        departmentId: 'accueil',
        nom: 'Togbé',
        prenom: 'Kevin',
        telephone: '+229 97 33 22 11',
        roleInDepartment: 'Protocole Chaire & Invités Spéciaux',
        dateAdhesion: '2022-06-14',
        competences: ['Protocole Pastoral', 'Sécurité du Sanctuaire', 'Discrétion'],
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-a-3',
        departmentId: 'accueil',
        nom: 'Mensah',
        prenom: 'Lydia',
        telephone: '+229 95 11 44 77',
        roleInDepartment: 'Accueil Parvis & Orientation',
        dateAdhesion: '2023-01-10',
        competences: ['Sourire Royal', 'Orientation Rapide', 'Gestion des Flux'],
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-a-4',
        departmentId: 'accueil',
        nom: 'Prudencio',
        prenom: 'Sarah',
        telephone: '+229 94 99 88 77',
        roleInDepartment: 'Service des Agapes & Réceptions',
        dateAdhesion: '2023-07-22',
        competences: ['Service à Table', 'Hygiène Alimentaire', 'Raffinement'],
        photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'technique',
    name: 'Département Technique & Sonorisation',
    description: 'Pilier technique du sanctuaire. Veille à la pureté acoustique, aux éclairages scéniques, aux retours scène et au confort d\'écoute des milliers de fidèles.',
    leaderName: 'Frère Emmanuel L.',
    leaderTitle: 'Chef Équipe Technique & Ingénieur Son',
    leaderPhone: '+229 97 11 33 55',
    leaderEmail: 'technique@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    memberCount: 22,
    iconName: 'Wrench',
    bannerColor: '#062722',
    activities: [
      'Balance audio et égalisation des micros chaire et chantres',
      'Gestion des consoles numériques Behringer X32 / Midas',
      'Programmation des ambiances lumineuses DMX',
      'Maintenance préventive du parc sonore et amplification'
    ],
    announcements: [
      'Atelier pratique sur le mixage numérique audio ce samedi à 14h',
      'Test acoustique général avant la conférence internationale'
    ],
    membersList: [
      {
        id: 'dep-t-1',
        departmentId: 'technique',
        nom: 'Lokossou',
        prenom: 'Emmanuel',
        telephone: '+229 97 11 33 55',
        email: 'technique@portedescieux.org',
        roleInDepartment: 'Chef Équipe Technique & Sonorisation',
        dateAdhesion: '2021-03-10',
        competences: ['Ingénierie Audio', 'Consoles Numériques', 'Acoustique'],
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-t-2',
        departmentId: 'technique',
        nom: 'Babatoundé',
        prenom: 'Yannick',
        telephone: '+229 96 55 44 22',
        roleInDepartment: 'Régisseur Lumières & Écrans LED',
        dateAdhesion: '2022-09-15',
        competences: ['Pilotage DMX', 'Écrans Géants LED', 'Projection Vidéo'],
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'evangelisation',
    name: 'Département Évangélisation, Moisson & Suivi',
    description: 'Accomplit l\'ordre suprême de Jésus-Christ : aller faire de toutes les nations des disciples. Organise les campagnes de rue, l\'évangélisation digitale et l\'affermissement des âmes.',
    leaderName: 'Évangéliste Mathieu D.',
    leaderTitle: 'Directeur de la Grande Moisson',
    leaderPhone: '+229 95 66 77 88',
    leaderEmail: 'evangelisation@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    memberCount: 84,
    iconName: 'Compass',
    bannerColor: '#0A3D36',
    activities: [
      'Sorties d\'impact urbain chaque samedi après-midi (marchés, carrefours)',
      'Évangélisation en milieu hospitalier et centres pénitentiaires',
      'Suivi téléphonique et visites à domicile des nouveaux convertis',
      'Parcours de baptême et intégration dans les Familles d\'Honneur'
    ],
    announcements: [
      'Grande opération de moisson « Cotonou pour Christ » samedi prochain',
      'Session de formation : Comment conduire une âme au Seigneur en 5 minutes'
    ],
    membersList: [
      {
        id: 'dep-e-1',
        departmentId: 'evangelisation',
        nom: 'Degbé',
        prenom: 'Mathieu',
        telephone: '+229 95 66 77 88',
        email: 'evangelisation@portedescieux.org',
        roleInDepartment: 'Directeur de la Grande Moisson',
        dateAdhesion: '2020-06-01',
        competences: ['Prédication de Rue', 'Tracts & Évangélisation', 'Formation Disciples'],
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-e-2',
        departmentId: 'evangelisation',
        nom: 'Akplogan',
        prenom: 'Carine',
        telephone: '+229 97 88 99 11',
        roleInDepartment: 'Coordinatrice Suivi Nouveaux Convertis',
        dateAdhesion: '2022-01-12',
        competences: ['Accompagnement Spirituel', 'Affermissement', 'Écoute Fraternelle'],
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'jeunesse',
    name: 'Département de la Jeunesse (Génération Impact)',
    description: 'Mobilise les jeunes de 15 à 35 ans pour manifester l\'excellence dans la foi, les études, l\'entrepreneuriat et le leadership social.',
    leaderName: 'Pasteur David & Équipe Jeunesse',
    leaderTitle: 'Pasteur de la Jeunesse & Coordonnateur Impact',
    leaderPhone: '+229 96 00 11 22',
    leaderEmail: 'jeunesse@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    memberCount: 240,
    iconName: 'Flame',
    bannerColor: '#0A3D36',
    activities: [
      'Cultes Jeunesse bimensuels « Ignite »',
      'Masterclasses Entrepreneuriat & Métiers du Futur',
      'Camps annuels de retraite et réveil spirituel',
      'Mentorat académique et professionnel pour étudiants'
    ],
    announcements: [
      'Prochaine Masterclass Carrière : Samedi 21 Septembre à 16h',
      'Inscriptions ouvertes pour le Camp Génération Impact 2026'
    ],
    membersList: [
      {
        id: 'dep-j-1',
        departmentId: 'jeunesse',
        nom: 'Koffi',
        prenom: 'Stéphane',
        telephone: '+229 96 00 11 22',
        email: 'jeunesse@portedescieux.org',
        roleInDepartment: 'Coordonnateur Étudiants & Carrières',
        dateAdhesion: '2022-10-05',
        competences: ['Leadership Jeunesse', 'Coaching CV', 'Organisation Événements'],
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'dep-j-2',
        departmentId: 'jeunesse',
        nom: 'Lawson',
        prenom: 'Noémie',
        telephone: '+229 97 11 22 33',
        roleInDepartment: 'Responsable Louange & Animation Jeunesse',
        dateAdhesion: '2023-04-15',
        competences: ['Animation', 'Chant Moderne', 'Création Contenu'],
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hommes',
    name: 'Département des Hommes (Les Gédéons)',
    description: 'Bâtit des hommes de foi inébranlable, des époux aimants, des pères exemplaires et des entrepreneurs d\'intégrité.',
    leaderName: 'Ancien Thomas S.',
    leaderTitle: 'Président des Gédéons',
    leaderPhone: '+229 97 99 88 11',
    leaderEmail: 'gedeons@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    memberCount: 180,
    iconName: 'Shield',
    bannerColor: '#0F4C44',
    activities: [
      'Petits-déjeuners d\'affaires & Mentorat économique',
      'Prière matinale des hommes chaque 1er samedi du mois à 07h00',
      'Entraide fraternelle, visites et solidarité active'
    ],
    announcements: [
      'Rencontre mensuelle des chefs de famille : Premier samedi du mois à 7h',
      'Forum Investissement & Patrimoine chrétien en préparation'
    ],
    membersList: [
      {
        id: 'dep-h-1',
        departmentId: 'hommes',
        nom: 'Soglo',
        prenom: 'Thomas',
        telephone: '+229 97 99 88 11',
        email: 'gedeons@portedescieux.org',
        roleInDepartment: 'Président des Gédéons',
        dateAdhesion: '2020-01-10',
        competences: ['Leadership Masculin', 'Conseil Conjugal', 'Gouvernance'],
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'femmes',
    name: 'Département des Femmes (Femmes Vertueuses)',
    description: 'Communauté de femmes d\'onction, d\'élégance et de sagesse divine. S\'édifient mutuellement dans la prière, la famille et l\'entrepreneuriat d\'excellence.',
    leaderName: 'Pasteure Marie-Claire D.',
    leaderTitle: 'Coordinatrice Générale des Vertueuses',
    leaderPhone: '+229 96 77 66 55',
    leaderEmail: 'vertueuses@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    memberCount: 290,
    iconName: 'Heart',
    bannerColor: '#C59A27',
    activities: [
      'Conférence annuelle d\'impact des femmes de valeur',
      'Ateliers entrepreneuriat, gastronomie et autonomie financière',
      'Cellules d\'intercession des mères pour la bénédiction des enfants'
    ],
    announcements: [
      'Séminaire « Femme Épanouie & Bâtisseuse de Destinée » samedi 28',
      'Programme d\'entraide pour micro-entrepreneures de l\'Église'
    ],
    membersList: [
      {
        id: 'dep-f-1',
        departmentId: 'femmes',
        nom: 'Dossou',
        prenom: 'Marie-Claire',
        telephone: '+229 96 77 66 55',
        email: 'vertueuses@portedescieux.org',
        roleInDepartment: 'Coordinatrice Générale',
        dateAdhesion: '2020-02-15',
        competences: ['Enseignement Biblique', 'Accompagnement Épouses', 'Autonomie Féminine'],
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'ecodim',
    name: 'Département Enfants (ECODIM - Église des Enfants)',
    description: 'Enseigne la Parole de Dieu dès le bas âge avec pédagogie, amour et jeux bibliques. Forme la relève spirituelle de demain.',
    leaderName: 'Monitrice Rachel B.',
    leaderTitle: 'Responsable Pédagogique ECODIM',
    leaderPhone: '+229 95 44 33 22',
    leaderEmail: 'ecodim@portedescieux.org',
    leaderPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    memberCount: 95,
    iconName: 'Heart',
    bannerColor: '#0A3D36',
    activities: [
      'Cultes adaptés par tranche d\'âge (3-6 ans, 7-10 ans, 11-14 ans)',
      'Théâtre biblique, mémorisation de versets et chants d\'enfants',
      'Colonies bibliques de vacances et kermesses chrétiennes'
    ],
    announcements: [
      'Inscriptions pour le spectacle de Noël et récitation des Écritures',
      'Formation des nouveaux moniteurs samedi à 09h'
    ],
    membersList: [
      {
        id: 'dep-ec-1',
        departmentId: 'ecodim',
        nom: 'Bello',
        prenom: 'Rachel',
        telephone: '+229 95 44 33 22',
        email: 'ecodim@portedescieux.org',
        roleInDepartment: 'Responsable Pédagogique ECODIM',
        dateAdhesion: '2021-08-01',
        competences: ['Pédagogie Enfantine', 'Contes Bibliques', 'Psychologie Éveil'],
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      }
    ]
  }
];
