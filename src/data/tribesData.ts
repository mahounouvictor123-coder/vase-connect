import { TribeInfo, TribeMember } from '../types';

export const INITIAL_TRIBES: TribeInfo[] = [
  {
    id: 'ruben',
    name: 'Ruben',
    biblicalMeaning: '« Vois, un fils ! » — Premier-né de Jacob',
    propheticBlessing: '« Que Ruben vive et qu\'il ne meure point, et que ses hommes soient nombreux ! » (Deutéronome 33:6)',
    symbol: 'L\'Eau & Le Soleil Levant',
    iconName: 'Sunrise',
    color: '#D97706',
    gradient: 'from-amber-600 to-amber-800',
    description: 'Tribu de la force primordiale et du réveil spirituel, appelée à la consécration et au rétablissement de l\'ordre divin.',
    leader: {
      title: 'Patriarche',
      nom: 'Kouadio',
      prenom: 'Emmanuel',
      phone: '+225 07 48 12 34 56',
      quartier: 'Cocody Angré 8ème Tranche',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-10',
      bio: 'Ancien de communauté et bâtisseur d\'hommes, dévoué à l\'édification des familles de la tribu Ruben.'
    }
  },
  {
    id: 'simeon',
    name: 'Siméon',
    biblicalMeaning: '« L\'Éternel a entendu »',
    propheticBlessing: '« Dieu a exaucé mon affliction. » Appel à la sanctification et au zèle pour la sainteté.',
    symbol: 'L\'Épée de la Justice & Les Portes de la Cité',
    iconName: 'Shield',
    color: '#DC2626',
    gradient: 'from-red-600 to-red-800',
    description: 'Tribu fervente et vigilante, sentinelle dans la prière et gardienne de l\'unité fraternelle.',
    leader: {
      title: 'Matriarche',
      nom: 'Traoré',
      prenom: 'Awa Grâce',
      phone: '+225 05 84 23 11 90',
      quartier: 'Yopougon Niangon Sud',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-15',
      bio: 'Femme de prière et d\'écoute, accompagnant les âmes dans la consolation et la réconciliation.'
    }
  },
  {
    id: 'levi',
    name: 'Lévi',
    biblicalMeaning: '« Attaché » — Le sacerdoce et le service saint',
    propheticBlessing: '« Ils enseigneront tes ordonnances à Jacob et ta loi à Israël ; ils mettront l\'encens sous tes narines. » (Deutéronome 33:10)',
    symbol: 'L\'Encensoir & La Menorah',
    iconName: 'Flame',
    color: '#7C3AED',
    gradient: 'from-purple-600 to-purple-800',
    description: 'Tribu vouée à l\'adoration, au sanctuaire, à l\'enseignement pur de la Parole et au service des autels.',
    leader: {
      title: 'Patriarche',
      nom: 'Yao',
      prenom: 'David Marcel',
      phone: '+225 07 59 77 44 22',
      quartier: 'Plateau Dokui',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-08',
      bio: 'Conducteur d\'adoration et berger spirituel, engagé pour la pureté du culte et le service de l\'Éternel.'
    }
  },
  {
    id: 'juda',
    name: 'Juda',
    biblicalMeaning: '« Louange » — La royauté et le sceptre',
    propheticBlessing: '« Le sceptre ne s\'éloignera point de Juda, ni le bâton souverain d\'entre ses pieds, jusqu\'à ce que vienne le Schilo. » (Genèse 49:10)',
    symbol: 'Le Lion Conquérant',
    iconName: 'Crown',
    color: '#B45309',
    gradient: 'from-amber-700 to-amber-900',
    description: 'Tribu pionnière de la louange combattante, du leadership souverain et de l\'autorité spirituelle.',
    leader: {
      title: 'Patriarche',
      nom: 'Bamba',
      prenom: 'Moïse Élie',
      phone: '+225 01 02 33 44 55',
      quartier: 'Cocody Riviera Palmeraie',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-05',
      bio: 'Visionnaire d\'impact et leader d\'hommes, inspirant la louange et la victoire dans les combats de la vie.'
    }
  },
  {
    id: 'dan',
    name: 'Dan',
    biblicalMeaning: '« Il a jugé » — Le discernement et la justice',
    propheticBlessing: '« Dan jugera son peuple, comme l\'une des tribus d\'Israël. J\'espère en ton salut, ô Éternel ! » (Genèse 49:16,18)',
    symbol: 'La Balance de Justice & L\'Aigle',
    iconName: 'Scale',
    color: '#0D9488',
    gradient: 'from-teal-600 to-teal-800',
    description: 'Tribu du discernement spirituel, du redressement juridique et de la justice pour les opprimés.',
    leader: {
      title: 'Matriarche',
      nom: 'Koné',
      prenom: 'Salimata Esther',
      phone: '+225 07 78 99 00 11',
      quartier: 'Marcory Zone 4',
      photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-12',
      bio: 'Juriste de formation et médiatrice chrétienne, plaidant pour l\'équité, la paix et la droiture.'
    }
  },
  {
    id: 'nephtali',
    name: 'Nephtali',
    biblicalMeaning: '« Mes combats » — La grâce et l\'éloquence',
    propheticBlessing: '« Nephtali est une biche en liberté ; il prononce de belles paroles. » (Genèse 49:21)',
    symbol: 'La Biche Rapide & Le Rameau Fleuri',
    iconName: 'Feather',
    color: '#16A34A',
    gradient: 'from-emerald-600 to-emerald-800',
    description: 'Tribu de la souplesse, de la poésie, de la communication inspirée et de la proclamation joyeuse de l\'Évangile.',
    leader: {
      title: 'Patriarche',
      nom: 'Gnahoré',
      prenom: 'Jean-Yves',
      phone: '+225 05 66 11 22 33',
      quartier: 'Koumassi Remblais',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-20',
      bio: 'Communicateur et évangéliste de terrain, porteur de paroles de réconfort et de libération divine.'
    }
  },
  {
    id: 'gad',
    name: 'Gad',
    biblicalMeaning: '« Troupe victorieuse » — Le courage et le triomphe',
    propheticBlessing: '« Gad sera assailli par des bandes armées, mais il les assaillira et les poursuivra ! » (Genèse 49:19)',
    symbol: 'Le Bouclier Fort & L\'Étendard',
    iconName: 'ShieldCheck',
    color: '#2563EB',
    gradient: 'from-blue-600 to-blue-800',
    description: 'Tribu vaillante, endurante dans les épreuves et victorieuse face aux attaques de l\'adversaire.',
    leader: {
      title: 'Patriarche',
      nom: 'Assi',
      prenom: 'Patrick Stéphane',
      phone: '+225 07 10 20 30 40',
      quartier: 'Abobo Baoulé',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-18',
      bio: 'Responsable d\'intercession et de combat spirituel, formant la jeunesse à l\'endurance et à la foi inébranlable.'
    }
  },
  {
    id: 'aser',
    name: 'Aser',
    biblicalMeaning: '« Heureux » — L\'abondance et la faveur',
    propheticBlessing: '« Béni soit Aser entre les enfants ! Qu\'il soit agréable à ses frères, et qu\'il plonge son pied dans l\'huile ! » (Deutéronome 33:24)',
    symbol: 'L\'Olivier & La Coupe Débordante',
    iconName: 'Droplets',
    color: '#059669',
    gradient: 'from-emerald-700 to-teal-900',
    description: 'Tribu de la prospérité féconde, de l\'onction fraîche de l\'Esprit et de la générosité bienfaisante.',
    leader: {
      title: 'Matriarche',
      nom: 'N\'Guessan',
      prenom: 'Marie-Chantal',
      phone: '+225 01 44 55 66 77',
      quartier: 'Cocody Deux-Plateaux Vallons',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-22',
      bio: 'Entrepreneure chrétienne et mère bienveillante, initiatrice d\'actions de solidarité et de redistribution.'
    }
  },
  {
    id: 'issacar',
    name: 'Issacar',
    biblicalMeaning: '« Récompense » — La sagesse des temps et saisons',
    propheticBlessing: '« Des fils d\'Issacar, qui avaient l\'intelligence des temps pour savoir ce que devait faire Israël. » (1 Chroniques 12:32)',
    symbol: 'Le Cadran & Le Livre de la Sagesse',
    iconName: 'Compass',
    color: '#4F46E5',
    gradient: 'from-indigo-600 to-indigo-800',
    description: 'Tribu de l\'intelligence stratégique, de la planification prophétique et de la diligence au travail.',
    leader: {
      title: 'Patriarche',
      nom: 'Diarra',
      prenom: 'Souleymane Paul',
      phone: '+225 07 88 12 34 00',
      quartier: 'Treichville Arras',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-14',
      bio: 'Consultant en stratégie et enseignant biblique, guidant la communauté dans l\'anticipation des temps.'
    }
  },
  {
    id: 'zabulon',
    name: 'Zabulon',
    biblicalMeaning: '« Habitation d\'honneur » — Le commerce et la navigation',
    propheticBlessing: '« Zabulon habitera sur la côte des mers, il sera sur la côte des vaisseaux. » (Genèse 49:13)',
    symbol: 'Le Navire Marchand & L\'Ancre Marine',
    iconName: 'Anchor',
    color: '#0284C7',
    gradient: 'from-sky-600 to-cyan-800',
    description: 'Tribu tournée vers les échanges internationaux, le transport maritime, la logistique et l\'expansion commerciale.',
    leader: {
      title: 'Patriarche',
      nom: 'Sery',
      prenom: 'Christian Fabrice',
      phone: '+225 05 50 60 70 80',
      quartier: 'Port-Bouët Vridi',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-19',
      bio: 'Cadre dans la logistique portuaire et mentor d\'entrepreneurs, dévoué au financement des œuvres du Royaume.'
    }
  },
  {
    id: 'joseph',
    name: 'Joseph',
    biblicalMeaning: '« Qu\'Il ajoute » — La fécondité et la souveraineté',
    propheticBlessing: '« Joseph est le rejeton d\'un arbre fertile... Les bénédictions de ton père s\'élèvent au-dessus des bénédictions de mes pères. » (Genèse 49:22,26)',
    symbol: 'La Gerbe de Blé Dorée & L\'Arbre Fertile',
    iconName: 'Sprout',
    color: '#15803D',
    gradient: 'from-green-600 to-emerald-800',
    description: 'Tribu de la gestion prévoyante, de l\'innovation, de la multiplication des ressources et du salut des nations en temps de crise.',
    leader: {
      title: 'Matriarche',
      nom: 'Aké',
      prenom: 'Florence Rebecca',
      phone: '+225 07 09 88 77 66',
      quartier: 'Bingerville Feh Kessé',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-07',
      bio: 'Gestionnaire chevronnée et mère spirituelle, inspirée par la sagesse de Joseph pour nourrir et préserver.'
    }
  },
  {
    id: 'benjamin',
    name: 'Benjamin',
    biblicalMeaning: '« Fils de ma main droite » — Le fils chéri et vaillant',
    propheticBlessing: '« C\'est le bien-aimé de l\'Éternel, il habitera en sécurité auprès de lui ; l\'Éternel le couvrira toujours. » (Deutéronome 33:12)',
    symbol: 'Le Loup Agile & L\'Arc de Précision',
    iconName: 'Zap',
    color: '#9333EA',
    gradient: 'from-fuchsia-600 to-purple-900',
    description: 'Tribu intime du cœur de Dieu, agile et courageuse, fidèle compagnon d\'armes et protectrice du temple.',
    leader: {
      title: 'Matriarche',
      nom: 'Koffi',
      prenom: 'Ruth Emmanuelle',
      phone: '+225 01 77 88 99 00',
      quartier: 'Cocody Riviera Bonoumin',
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
      assignedAt: '2025-01-11',
      bio: 'Intercesseuse et formatrice des jeunes filles, veillant avec amour et fermeté sur la tribu bien-aimée.'
    }
  }
];

export const INITIAL_TRIBE_MEMBERS: TribeMember[] = [
  // Ruben
  {
    id: 'tm-1',
    tribeId: 'ruben',
    nom: 'Kouadio',
    prenom: 'Emmanuel',
    numero: '+225 07 48 12 34 56',
    quartier: 'Cocody Angré 8ème Tranche',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-10',
    userId: 'u-101'
  },
  {
    id: 'tm-2',
    tribeId: 'ruben',
    nom: 'Diallo',
    prenom: 'Abdoulaye Isaac',
    numero: '+225 05 11 22 33 44',
    quartier: 'Cocody Faya',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-01',
    userId: 'u-102'
  },
  {
    id: 'tm-3',
    tribeId: 'ruben',
    nom: 'Bedié',
    prenom: 'Clarisse',
    numero: '+225 07 89 00 12 34',
    quartier: 'Cocody Angré Château',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-05',
    userId: 'u-103'
  },

  // Siméon
  {
    id: 'tm-4',
    tribeId: 'simeon',
    nom: 'Traoré',
    prenom: 'Awa Grâce',
    numero: '+225 05 84 23 11 90',
    quartier: 'Yopougon Niangon Sud',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MATRIARCHE',
    registeredAt: '2025-01-15',
    userId: 'u-104'
  },
  {
    id: 'tm-5',
    tribeId: 'simeon',
    nom: 'Ouattara',
    prenom: 'Marc Stéphane',
    numero: '+225 01 22 33 44 55',
    quartier: 'Yopougon Maroc',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-02',
    userId: 'u-105'
  },

  // Lévi
  {
    id: 'tm-6',
    tribeId: 'levi',
    nom: 'Yao',
    prenom: 'David Marcel',
    numero: '+225 07 59 77 44 22',
    quartier: 'Plateau Dokui',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-08',
    userId: 'u-106'
  },
  {
    id: 'tm-7',
    tribeId: 'levi',
    nom: 'Goli',
    prenom: 'Bernadette',
    numero: '+225 07 41 85 29 63',
    quartier: 'Abobo BC',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-04',
    userId: 'u-107'
  },

  // Juda
  {
    id: 'tm-8',
    tribeId: 'juda',
    nom: 'Bamba',
    prenom: 'Moïse Élie',
    numero: '+225 01 02 33 44 55',
    quartier: 'Cocody Riviera Palmeraie',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-05',
    userId: 'u-108'
  },
  {
    id: 'tm-9',
    tribeId: 'juda',
    nom: 'Kouamé',
    prenom: 'Jean-Marc',
    numero: '+225 07 14 25 36 47',
    quartier: 'Riviera Bonoumin',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-08',
    userId: 'u-109'
  },

  // Dan
  {
    id: 'tm-10',
    tribeId: 'dan',
    nom: 'Koné',
    prenom: 'Salimata Esther',
    numero: '+225 07 78 99 00 11',
    quartier: 'Marcory Zone 4',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MATRIARCHE',
    registeredAt: '2025-01-12',
    userId: 'u-110'
  },

  // Nephtali
  {
    id: 'tm-11',
    tribeId: 'nephtali',
    nom: 'Gnahoré',
    prenom: 'Jean-Yves',
    numero: '+225 05 66 11 22 33',
    quartier: 'Koumassi Remblais',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-20',
    userId: 'u-111'
  },

  // Gad
  {
    id: 'tm-12',
    tribeId: 'gad',
    nom: 'Assi',
    prenom: 'Patrick Stéphane',
    numero: '+225 07 10 20 30 40',
    quartier: 'Abobo Baoulé',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-18',
    userId: 'u-112'
  },

  // Aser
  {
    id: 'tm-13',
    tribeId: 'aser',
    nom: 'N\'Guessan',
    prenom: 'Marie-Chantal',
    numero: '+225 01 44 55 66 77',
    quartier: 'Cocody Deux-Plateaux Vallons',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MATRIARCHE',
    registeredAt: '2025-01-22',
    userId: 'u-113'
  },

  // Issacar
  {
    id: 'tm-14',
    tribeId: 'issacar',
    nom: 'Diarra',
    prenom: 'Souleymane Paul',
    numero: '+225 07 88 12 34 00',
    quartier: 'Treichville Arras',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-14',
    userId: 'u-114'
  },

  // Zabulon
  {
    id: 'tm-15',
    tribeId: 'zabulon',
    nom: 'Sery',
    prenom: 'Christian Fabrice',
    numero: '+225 05 50 60 70 80',
    quartier: 'Port-Bouët Vridi',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'PATRIARCHE',
    registeredAt: '2025-01-19',
    userId: 'u-115'
  },

  // Joseph
  {
    id: 'tm-16',
    tribeId: 'joseph',
    nom: 'Aké',
    prenom: 'Florence Rebecca',
    numero: '+225 07 09 88 77 66',
    quartier: 'Bingerville Feh Kessé',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MATRIARCHE',
    registeredAt: '2025-01-07',
    userId: 'u-116'
  },

  // Benjamin
  {
    id: 'tm-17',
    tribeId: 'benjamin',
    nom: 'Koffi',
    prenom: 'Ruth Emmanuelle',
    numero: '+225 01 77 88 99 00',
    quartier: 'Cocody Riviera Bonoumin',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MATRIARCHE',
    registeredAt: '2025-01-11',
    userId: 'u-117'
  },
  {
    id: 'tm-18',
    tribeId: 'benjamin',
    nom: 'Touré',
    prenom: 'Armel Caleb',
    numero: '+225 07 23 45 67 89',
    quartier: 'Cocody Angré 7ème Tranche',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-12',
    userId: 'u-118'
  },
  {
    id: 'tm-19',
    tribeId: 'benjamin',
    nom: 'Soro',
    prenom: 'Mariam Estelle',
    numero: '+225 05 34 56 78 90',
    quartier: 'Cocody Riviera 2',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-15',
    userId: 'u-119'
  },

  // Membres additionnels pour Ruben
  {
    id: 'tm-20',
    tribeId: 'ruben',
    nom: 'N\'Guessan',
    prenom: 'Thierry Daniel',
    numero: '+225 07 99 88 77 11',
    quartier: 'Cocody Attoban',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-18',
    userId: 'u-120'
  },
  {
    id: 'tm-21',
    tribeId: 'ruben',
    nom: 'Kassi',
    prenom: 'Béatrice Sandrine',
    numero: '+225 01 12 90 34 56',
    quartier: 'Cocody Danga',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-20',
    userId: 'u-121'
  },

  // Membres additionnels pour Siméon
  {
    id: 'tm-22',
    tribeId: 'simeon',
    nom: 'Bakayoko',
    prenom: 'Fatoumata Esther',
    numero: '+225 07 45 67 89 01',
    quartier: 'Yopougon Selmer',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-22',
    userId: 'u-122'
  },
  {
    id: 'tm-23',
    tribeId: 'simeon',
    nom: 'Kouassi',
    prenom: 'Ange Michaël',
    numero: '+225 05 67 89 01 23',
    quartier: 'Yopougon Toits Rouges',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-25',
    userId: 'u-123'
  },

  // Membres additionnels pour Lévi
  {
    id: 'tm-24',
    tribeId: 'levi',
    nom: 'Amon',
    prenom: 'Priscille Joëlle',
    numero: '+225 07 78 90 12 34',
    quartier: 'Abobo Samaké',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-26',
    userId: 'u-124'
  },
  {
    id: 'tm-25',
    tribeId: 'levi',
    nom: 'Diomandé',
    prenom: 'Samuel Ézéchiel',
    numero: '+225 01 89 01 23 45',
    quartier: 'Adjamé 220 Logements',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-02-28',
    userId: 'u-125'
  },

  // Membres additionnels pour Juda
  {
    id: 'tm-26',
    tribeId: 'juda',
    nom: 'Gueï',
    prenom: 'Serge Aristide',
    numero: '+225 05 90 12 34 56',
    quartier: 'Cocody Riviera 3',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-01',
    userId: 'u-126'
  },
  {
    id: 'tm-27',
    tribeId: 'juda',
    nom: 'Tanoh',
    prenom: 'Christelle Victoire',
    numero: '+225 07 01 23 45 67',
    quartier: 'Cocody Faya Génie 2000',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-02',
    userId: 'u-127'
  },

  // Membres additionnels pour Dan
  {
    id: 'tm-28',
    tribeId: 'dan',
    nom: 'Yapi',
    prenom: 'Jérôme Théophile',
    numero: '+225 01 12 34 56 78',
    quartier: 'Marcory Biétry',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-03',
    userId: 'u-128'
  },
  {
    id: 'tm-29',
    tribeId: 'dan',
    nom: 'Coulibaly',
    prenom: 'Aminata Noémie',
    numero: '+225 07 23 45 67 80',
    quartier: 'Marcory Anoumabo',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-04',
    userId: 'u-129'
  },

  // Membres additionnels pour Nephtali
  {
    id: 'tm-30',
    tribeId: 'nephtali',
    nom: 'Kouamé',
    prenom: 'Félicité Grâce',
    numero: '+225 05 34 56 78 91',
    quartier: 'Koumassi Prodomo',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-05',
    userId: 'u-130'
  },
  {
    id: 'tm-31',
    tribeId: 'nephtali',
    nom: 'Bahi',
    prenom: 'Gervais Jonathan',
    numero: '+225 07 45 67 89 02',
    quartier: 'Koumassi Nord-Est',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-06',
    userId: 'u-131'
  },

  // Membres additionnels pour Gad
  {
    id: 'tm-32',
    tribeId: 'gad',
    nom: 'Gnagne',
    prenom: 'Sylvie Diane',
    numero: '+225 01 56 78 90 12',
    quartier: 'Abobo Clouetcha',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-07',
    userId: 'u-132'
  },
  {
    id: 'tm-33',
    tribeId: 'gad',
    nom: 'Oura',
    prenom: 'Jean-Baptiste',
    numero: '+225 07 67 89 01 24',
    quartier: 'Abobo Avocatier',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-08',
    userId: 'u-133'
  },

  // Membres additionnels pour Aser
  {
    id: 'tm-34',
    tribeId: 'aser',
    nom: 'Meïté',
    prenom: 'Ibrahim Salomon',
    numero: '+225 05 78 90 12 35',
    quartier: 'Cocody Deux-Plateaux Aghien',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-09',
    userId: 'u-134'
  },
  {
    id: 'tm-35',
    tribeId: 'aser',
    nom: 'Loba',
    prenom: 'Carine Déborah',
    numero: '+225 07 89 01 23 46',
    quartier: 'Cocody 7ème Tranche',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-10',
    userId: 'u-135'
  },

  // Membres additionnels pour Issacar
  {
    id: 'tm-36',
    tribeId: 'issacar',
    nom: 'Dodo',
    prenom: 'Hortense Marie',
    numero: '+225 01 90 12 34 57',
    quartier: 'Treichville Habitat',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-11',
    userId: 'u-136'
  },
  {
    id: 'tm-37',
    tribeId: 'issacar',
    nom: 'Kpolo',
    prenom: 'Ferdinand',
    numero: '+225 07 01 23 45 68',
    quartier: 'Treichville Belleville',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-12',
    userId: 'u-137'
  },

  // Membres additionnels pour Zabulon
  {
    id: 'tm-38',
    tribeId: 'zabulon',
    nom: 'Boni',
    prenom: 'Josiane Michelle',
    numero: '+225 05 12 34 56 79',
    quartier: 'Port-Bouët Gonzagueville',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-13',
    userId: 'u-138'
  },
  {
    id: 'tm-39',
    tribeId: 'zabulon',
    nom: 'N\'Dri',
    prenom: 'Éric Landry',
    numero: '+225 07 23 45 67 81',
    quartier: 'Port-Bouët Derrière-Wharf',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-14',
    userId: 'u-139'
  },

  // Membres additionnels pour Joseph
  {
    id: 'tm-40',
    tribeId: 'joseph',
    nom: 'Vakaba',
    prenom: 'Ousmane Joseph',
    numero: '+225 01 34 56 78 92',
    quartier: 'Bingerville Gbagba',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-15',
    userId: 'u-140'
  },
  {
    id: 'tm-41',
    tribeId: 'joseph',
    nom: 'Tiapani',
    prenom: 'Esther Bénédicte',
    numero: '+225 07 45 67 89 03',
    quartier: 'Bingerville Marché',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    roleInTribe: 'MEMBRE',
    registeredAt: '2025-03-16',
    userId: 'u-141'
  }
];
