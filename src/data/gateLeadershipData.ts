import {
  InfluenceGateId,
  GateResponsibleInfo,
  GateProjectItem,
  GateAnnouncementItem,
  GateRapportPastorale,
} from '../types';

export const GATE_RESPONSIBLES: Record<InfluenceGateId, GateResponsibleInfo> = {
  croyance_coutume: {
    id: 'resp-gate-1',
    gateId: 'croyance_coutume',
    nom: 'Houessou',
    prenom: 'Barnabé',
    titre: 'Pilote Apostolique Référent',
    profession: 'Pasteur Enseignant, Théologien & Écrivain',
    organisation: 'Vases d\'Honneur & Collège Théologique de Réveil',
    phone: '+229 97 22 33 44',
    whatsapp: '+22997223344',
    email: 'barnabe.houessou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    passcode: '4001',
    mandatVision: 'Conformément aux enseignements du Pasteur Mohammed Sanogo, notre mandat est de sanctifier la culture, d\'épurer les coutumes contraires aux saintes écritures et d\'affermir la foi des croyants par une doctrine saine et sans compromis.',
    objectifsAnnuels: [
      'Former 150 ouvriers et leaders d\'opinion à l\'apologétique chrétienne face aux philosophies modernes',
      'Publier un recueil de discernement sur les coutumes d\'alliance et rituels traditionnels incompatibles avec la foi',
      'Accompagner 60 familles dans l\'assainissement spirituel de leurs traditions et célébrations matrimoniales',
      'Créer un cercle d\'enseignants bibliques engagés pour la réforme des mentalités'
    ],
    actionsPrioritaires: [
      'Cycle mensuel de masterclass : « Sanctifier la culture sans compromis »',
      'Permanence pastorale hebdomadaire d\'accompagnement et de délivrance des liens coutumiers',
      'Diffusion de fiches de discernement spirituel sur les réseaux et dans les Familles d\'Honneur'
    ]
  },

  education: {
    id: 'resp-gate-2',
    gateId: 'education',
    nom: 'Sossou',
    prenom: 'David',
    titre: 'Pilote Apostolique Référent',
    profession: 'Professeur Agrégé des Universités & Formateur de Cadres',
    organisation: 'Université d\'Excellence & Académie Daniel du Savoir',
    phone: '+229 97 33 44 55',
    whatsapp: '+22997334455',
    email: 'david.sossou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    passcode: '4002',
    mandatVision: 'Inspirés par Daniel et ses compagnons dotés d\'une sagesse dix fois supérieure, nous formons une génération d\'enseignants, de chercheurs et d\'élèves qui dominent par l\'excellence académique et la pureté morale.',
    objectifsAnnuels: [
      'Accompagner 300 étudiants vers l\'obtention de mentions d\'excellence et bourses d\'études internationales',
      'Former 80 enseignants et professeurs à la pédagogie centrée sur les valeurs du Royaume de Dieu',
      'Créer le premier réseau des directeurs d\'écoles et universités chrétiennes de la région',
      'Lancer le programme de mentorat académique « Daniel 10x »'
    ],
    actionsPrioritaires: [
      'Camp d\'orientation et d\'excellence pré-universitaire chaque trimestre',
      'Tutorat gratuit pour les bacheliers et étudiants en licence dans les familles de l\'église',
      'Plaidoyer pour l\'intégration de l\'intégrité éthique dans les curricula scolaires'
    ]
  },

  legislation: {
    id: 'resp-gate-3',
    gateId: 'legislation',
    nom: 'Lawson',
    prenom: 'Christine',
    titre: 'Pilote Apostolique Référent',
    profession: 'Avocate au Barreau & Arbitre International en Droits des Affaires',
    organisation: 'Cabinet Lex Honoris & Association des Juristes Chrétiens',
    phone: '+229 96 44 55 66',
    whatsapp: '+22996445566',
    email: 'christine.lawson@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    passcode: '4003',
    mandatVision: 'Dieu étant le Législateur suprême, nous positionnons des juristes, magistrats, avocats et notaires au cœur de la fabrique des lois pour défendre les plus vulnérables et restaurer la justice et la vérité.',
    objectifsAnnuels: [
      'Offrir une assistance juridique gratuite et du conseil pro bono à 120 veuves, orphelins et démunis',
      'Rédiger 4 propositions d\'amendements législatifs en faveur de la protection de la famille et de l\'éthique des affaires',
      'Fédérer 50 magistrats, avocats, greffiers et juristes d\'entreprise dans une cellule de prière et d\'action juridique',
      'Organiser le Colloque Annuel de la Justice et du Droit Chrétien'
    ],
    actionsPrioritaires: [
      'Permanence d\'écoute et d\'orientation juridique bénévole 2 samedis par mois',
      'Veille législative sur les projets de loi touchant la famille, la liberté de culte et la probité publique',
      'Mentorat des étudiants en droit et préparation au concours du Barreau et de la Magistrature'
    ]
  },

  gouvernement: {
    id: 'resp-gate-4',
    gateId: 'gouvernement',
    nom: 'Ahounou',
    prenom: 'Honoré',
    titre: 'Pilote Apostolique Référent',
    profession: 'Haut Fonctionnaire d\'État & Administrateur des Finances Publiques',
    organisation: 'Direction Nationale du Budget & Réseau des Cadres de la Fonction Publique',
    phone: '+229 95 55 66 77',
    whatsapp: '+22995556677',
    email: 'honore.ahounou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    passcode: '4004',
    mandatVision: 'Porter l\'esprit de Joseph dans l\'administration de l\'État : rigueur exemplaire, refus absolu de toute corruption, efficience dans le service public et amour de l\'intérêt général.',
    objectifsAnnuels: [
      'Sensibiliser 200 agents publics chrétiens à l\'intégrité et au refus des pots-de-vin et détournements',
      'Accompagner 40 hauts fonctionnaires dans la gouvernance axée sur les résultats et l\'éthique biblique',
      'Rédiger le « Guide du Fonctionnaire du Royaume » pour servir la patrie avec honneur',
      'Organiser des petits-déjeuners d\'intercession trimestriels pour les membres du gouvernement et les directeurs de cabinets'
    ],
    actionsPrioritaires: [
      'Cercle de prière confidentiel des directeurs d\'administration publique',
      'Formations continues sur la simplification administrative et le service du citoyen',
      'Suivi et accompagnement des jeunes diplômés intégrant les ministères'
    ]
  },

  politique: {
    id: 'resp-gate-5',
    gateId: 'politique',
    nom: 'Zinsou',
    prenom: 'Aimé',
    titre: 'Pilote Apostolique Référent',
    profession: 'Conseiller Municipal, Politologue & Spécialiste du Développement Local',
    organisation: 'Conseil Municipal & Mouvement Civique pour l\'Éthique Politique',
    phone: '+229 96 33 44 55',
    whatsapp: '+22996334455',
    email: 'aime.zinsou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    passcode: '4005',
    mandatVision: 'Revaloriser la politique comme un sacerdoce de serviteur selon le cœur de Dieu, en suscitant des élus intègres, courageux, préoccupés par le bien-être de la cité et affranchis des manœuvres perverses.',
    objectifsAnnuels: [
      'Former 70 jeunes chrétiens au leadership politique, au débat démocratique et à la gouvernance locale',
      'Créer une charte d\'éthique de l\'élu chrétien : transparence financière, service du peuple, concorde',
      'Soutenir et encadrer 15 candidats engagés pour les élections municipales et législatives',
      'Organiser les Rencontres Citoyennes pour la paix et la cohésion nationale'
    ],
    actionsPrioritaires: [
      'Académie du Leadership Politique & Civique pour la jeunesse de l\'église',
      'Groupes d\'intercession stratégique pour la stabilité politique de la nation',
      'Ateliers d\'éducation citoyenne et d\'engagement dans les conseils de quartier'
    ]
  },

  media_communication: {
    id: 'resp-gate-6',
    gateId: 'media_communication',
    nom: 'Hounkpatin',
    prenom: 'Sarah',
    titre: 'Pilote Apostolique Référent',
    profession: 'Directrice d\'Agence de Communication & Journaliste d\'Investigation',
    organisation: 'Groupe Média Nova Impact & Réseau des Communicants Chrétiens',
    phone: '+229 94 66 77 88',
    whatsapp: '+22994667788',
    email: 'sarah.hounkpatin@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    passcode: '4006',
    mandatVision: 'Occuper l\'espace médiatique, les ondes, la télévision et le numérique avec des contenus inspirants, vrais et édifiants, pour faire reculer la désinformation, l\'immoralité et le découragement.',
    objectifsAnnuels: [
      'Produire 50 documentaires, capsules vidéo et reportages mettant en valeur des héros de la foi et de l\'intégrité',
      'Former 100 jeunes créateurs de contenus chrétiens (YouTube, TikTok, Podcasts, Rédaction web)',
      'Développer une agence de presse éthique pour relayer la vérité et les actions sociales positives',
      'Organiser les assises des professionnels chrétiens de l\'audiovisuel et du journalisme'
    ],
    actionsPrioritaires: [
      'Studio collaboratif de création de contenus inspirants pour la nation',
      'Masterclass : « L\'éthique journalistique et la puissance du storytelling chrétien »',
      'Campagne médiatique annuelle de valorisation de la jeunesse travailleuse'
    ]
  },

  ressource_terre: {
    id: 'resp-gate-7',
    gateId: 'ressource_terre',
    nom: 'Dossou',
    prenom: 'Urbain',
    titre: 'Pilote Apostolique Référent',
    profession: 'Ingénieur Agronome, Promoteur Agropastoral & Expert Foncier',
    organisation: 'AgriVerte Bénin & Société Coopérative des Bâtisseurs Ruraux',
    phone: '+229 97 77 88 99',
    whatsapp: '+22997778899',
    email: 'urbain.dossou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    passcode: '4007',
    mandatVision: 'La terre appartient à l\'Éternel et tout ce qu\'elle renferme. Nous valorisons les sols, l\'agriculture biologique, les ressources minières et l\'eau avec une intendance sainte, pour assurer l\'autosuffisance alimentaire des familles.',
    objectifsAnnuels: [
      'Former et installer 80 jeunes entrepreneurs agricoles sur des exploitations maraîchères et avicoles modernes',
      'Sécuriser et cartographier 500 hectares de terres agricoles pour les membres de la coopérative de l\'église',
      'Créer une centrale d\'achat et de distribution directe de vivres sains à prix solidaires',
      'Promouvoir les énergies renouvelables et l\'irrigation solaire dans les zones rurales déshéritées'
    ],
    actionsPrioritaires: [
      'Visites de terrain et formations pratiques sur les fermes agro-écologiques modèles',
      'Accompagnement juridique pour la sécurisation foncière des titres de propriété',
      'Foire agricole et maraîchère trimestrielle de la communauté Vases d\'Honneur'
    ]
  },

  finance: {
    id: 'resp-gate-8',
    gateId: 'finance',
    nom: 'Akakpo',
    prenom: 'Patrick',
    titre: 'Pilote Apostolique Référent',
    profession: 'Directeur des Engagements Bancaires & Gestionnaire d\'Actifs Financiers',
    organisation: 'Banque Panafricaine d\'Investissement & Club des Économistes du Royaume',
    phone: '+229 95 12 34 78',
    whatsapp: '+22995123478',
    email: 'patrick.akakpo@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    passcode: '4008',
    mandatVision: 'Canaliser la richesse et les capitaux pour l\'expansion de l\'Évangile, enseigner l\'intelligence financière biblique, briser le joug du surendettement et financer des entreprises chrétiennes à fort impact social.',
    objectifsAnnuels: [
      'Accompagner 100 entrepreneurs chrétiens dans la levée de fonds et la structuration de leurs bilans financiers',
      'Dispenser la formation « Gestion des finances personnelles et libération des dettes » à 600 foyers',
      'Mettre sur pied un fonds d\'investissement solidaire pour financer les startups et PME chrétiennes viables',
      'Fédérer 60 cadres de banques, assurances et institutions de microfinance'
    ],
    actionsPrioritaires: [
      'Clinique financière mensuelle gratuite : audit de budget, conseils en épargne et désendettement',
      'Rencontres trimestrielles des investisseurs et bâtisseurs de richesse du Royaume',
      'Programme d\'éducation financière précoce pour les adolescents et jeunes diplômés'
    ]
  },

  transport_service: {
    id: 'resp-gate-9',
    gateId: 'transport_service',
    nom: 'Agbo',
    prenom: 'Blaise',
    titre: 'Pilote Apostolique Référent',
    profession: 'Directeur Général de Compagnie de Transport & Transit Logistique',
    organisation: 'Express Shalom Transit & Groupement Professionnel des Transporteurs',
    phone: '+229 97 88 99 00',
    whatsapp: '+22997889900',
    email: 'blaise.agbo@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    passcode: '4009',
    mandatVision: 'Révolutionner le secteur du transport et des services par un dévouement absolu, la sécurité routière, la ponctualité et la dignité humaine, démontrant l\'amour du prochain à travers chaque trajet et chaque livraison.',
    objectifsAnnuels: [
      'Former 150 conducteurs professionnels à la conduite défensive, à la courtoisie et au respect des passagers',
      'Créer un réseau de covoiturage et navettes sécurisées pour les cultes et grands rassemblements chrétiens',
      'Appuyer 30 chauffeurs et livreurs chrétiens pour l\'accès à la propriété de leurs véhicules ou motos de service',
      'Mettre en place une centrale d\'entraide logistique pour les déménagements et événements communautaires'
    ],
    actionsPrioritaires: [
      'Campagne de sensibilisation à la sécurité routière et à la tolérance zéro alcool au volant',
      'Ateliers d\'optimisation logistique pour les PME et commerçants de la communauté',
      'Assurance santé et prévoyance mutualisée pour les transporteurs indépendants'
    ]
  },

  art_divertissement: {
    id: 'resp-gate-10',
    gateId: 'art_divertissement',
    nom: 'Adjovi',
    prenom: 'Noémie',
    titre: 'Pilote Apostolique Référent',
    profession: 'Productrice Audiovisuelle, Scénographe & Curatrice d\'Art',
    organisation: 'Lumina Creative Arts & Collectif des Créateurs Chrétiens',
    phone: '+229 96 88 77 66',
    whatsapp: '+22996887766',
    email: 'noemie.adjovi@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&auto=format&fit=crop&q=80',
    passcode: '4010',
    mandatVision: 'Racheter les arts, le cinéma, le théâtre, la mode et la musique pour exprimer la splendeur et la pureté divine, en délivrant la jeunesse des influences perverses de l\'industrie du divertissement profane.',
    objectifsAnnuels: [
      'Produire 2 pièces de théâtre et comédies musicales chrétiennes professionnelles à diffusion nationale',
      'Accompagner 40 artistes peintres, sculpteurs, écrivains et photographes dans la commercialisation éthique',
      'Organiser le Festival Annuel des Arts Inspirés du Saint-Esprit',
      'Former 60 jeunes talents aux techniques professionnelles d\'écriture scénaristique et de réalisation'
    ],
    actionsPrioritaires: [
      'Résidences de création artistique chrétienne et masterclasses techniques',
      'Galerie d\'exposition éphémère lors des conférences d\'impact',
      'Production d\'albums de louange prophétique et de musique d\'élévation de l\'âme'
    ]
  },

  sante: {
    id: 'resp-gate-11',
    gateId: 'sante',
    nom: 'Ahouandjinou',
    prenom: 'Marcelle',
    titre: 'Pilote Apostolique Référent',
    profession: 'Médecin Chef de Clinique, Urgentiste & Praticienne Hospitalière',
    organisation: 'Centre Médical d\'Espérance & Association Médicale Chrétienne Luke',
    phone: '+229 95 88 99 11',
    whatsapp: '+22995889911',
    email: 'marcelle.ahouandjinou@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    passcode: '4011',
    mandatVision: 'Combiner la plus haute compétence médicale scientifique à la prière de foi et à la compassion du Bon Samaritain, pour restaurer la dignité des malades, soulager la douleur et apporter la guérison divine.',
    objectifsAnnuels: [
      'Organiser 6 grandes campagnes de consultations médicales, dépistages et dons de médicaments gratuits',
      'Soigner gratuitement plus de 2 000 patients démunis en zones périurbaines et rurales',
      'Fédérer 80 médecins, chirurgiens, pharmaciens, infirmiers et psychologues dans le réseau de soins d\'honneur',
      'Mettre sur pied une cellule d\'accompagnement psychologique et de soutien en santé mentale chrétienne'
    ],
    actionsPrioritaires: [
      'Caravane médicale mobile bimestrielle dans les quartiers défavorisés',
      'Permanence de télé-conseil médical d\'urgence pour les fidèles de la communauté',
      'Formations aux gestes de premiers secours et réanimation cardiaque pour les équipes d\'accueil de l\'église'
    ]
  },

  armee: {
    id: 'resp-gate-12',
    gateId: 'armee',
    nom: 'Gnacadja',
    prenom: 'Éric',
    titre: 'Pilote Apostolique Référent',
    profession: 'Capitaine, Officier Supérieur & Instructeur en Sécurité Civile',
    organisation: 'Commandement de la Protection Civile & Fraternité Militaire Chrétienne',
    phone: '+229 94 55 66 77',
    whatsapp: '+22994556677',
    email: 'eric.gnacadja@vasesdhonneur.ci',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    passcode: '4012',
    mandatVision: 'Servir sous l\'étendard du Seigneur des Armées avec loyauté, honneur et bravoure pour la patrie, comme les vaillants héros du Roi David, préservant la paix civile et protégeant les vies avec abnégation.',
    objectifsAnnuels: [
      'Fédérer 50 militaires, gendarmes, policiers et agents de sécurité privée dans la Fraternité Chrétienne des Armes',
      'Assurer le soutien moral, spirituel et psychologique des forces de l\'ordre en mission et de leurs familles',
      'Sensibiliser la jeunesse aux métiers de la défense, du civisme et de la protection des populations',
      'Mettre en place un plan de sécurité civile et d\'évacuation d\'urgence pour les édifices et rassemblements ecclésiaux'
    ],
    actionsPrioritaires: [
      'Veilles de prière nocturne pour la protection des frontières et des troupes engagées sur le front',
      'Formation continue à la déontologie, à la discipline militaire et à la non-compromission',
      'Accompagnement des veuves et orphelins des soldats tombés en mission de paix'
    ]
  }
};

export const INITIAL_GATE_PROJECTS: GateProjectItem[] = [
  {
    id: 'proj-1',
    gateId: 'croyance_coutume',
    titre: 'Manuel de Discernement & Réforme des Coutumes Matrimoniales',
    description: 'Rédaction et vulgarisation d\'un guide pour célébrer les mariages traditionnels dans la pureté biblique sans sacrifices ni invocations ancestrales.',
    statut: 'EN_COURS',
    dateEcheance: '2026-11-30',
    porteurProjet: 'Pasteur Barnabé Houessou',
    impactAttendu: 'Harmoniser la coutume et la sanctification pour plus de 200 couples chaque année.',
    partenairesRecherches: 'Anthropologues chrétiens, anciens d\'églises, conseillers conjugaux'
  },
  {
    id: 'proj-2',
    gateId: 'education',
    titre: 'Programme d\'Excellence Académique « Daniel 10x »',
    description: 'Mentorat intensif, cours d\'appui et préparation méthodologique pour 120 lycéens et étudiants chrétiens visant l\'excellence.',
    statut: 'EN_COURS',
    dateEcheance: '2026-10-15',
    porteurProjet: 'Pr. David Sossou',
    impactAttendu: '100% de réussite au Baccalauréat et accès aux bourses universitaires internationales.',
    partenairesRecherches: 'Professeurs d\'universités, tuteurs en mathématiques et sciences'
  },
  {
    id: 'proj-3',
    gateId: 'legislation',
    titre: 'Clinique Juridique Pro Bono « Équité & Compassion »',
    description: 'Permanence bimensuelle gratuite tenue par des avocats et notaires chrétiens pour aider les veuves et personnes sans ressources à régulariser leur état civil et défendre leurs droits.',
    statut: 'REALISE',
    dateEcheance: '2026-08-30',
    porteurProjet: 'Me Christine Lawson',
    impactAttendu: 'Assistance juridique complète apportée à plus de 75 familles démunies.',
    partenairesRecherches: 'Avocats au barreau, juristes fiscalistes, médiateurs sociaux'
  },
  {
    id: 'proj-4',
    gateId: 'finance',
    titre: 'Fonds d\'Amorçage Solidaire « Les Talents du Royaume »',
    description: 'Création d\'un guichet de micro-financement sans usure et de mentorat pour booster 25 micro-projets de jeunes et femmes entrepreneures.',
    statut: 'EN_COURS',
    dateEcheance: '2026-12-15',
    porteurProjet: 'Patrick Akakpo',
    impactAttendu: 'Financement de 25 PME chrétiennes et création de 60 emplois durables.',
    partenairesRecherches: 'Banquiers, gestionnaires de risques, comptables agréés'
  },
  {
    id: 'proj-5',
    gateId: 'sante',
    titre: 'Caravane Médicale Régionale « Le Bon Samaritain »',
    description: 'Mission de consultations foraines, chirurgie ambulatoire, soins dentaires et dons de lunettes médicales gratuites pour les localités rurales isolées.',
    statut: 'EN_COURS',
    dateEcheance: '2026-10-25',
    porteurProjet: 'Dr. Marcelle Ahouandjinou',
    impactAttendu: '1 500 consultations gratuites et distribution de médicaments d\'urgence.',
    partenairesRecherches: 'Médecins spécialistes, grossistes pharmaceutiques, infirmiers'
  },
  {
    id: 'proj-6',
    gateId: 'media_communication',
    titre: 'Académie des Nouveaux Médias & Podcasting d\'Impact',
    description: 'Formation de 50 créateurs de contenus digitaux pour diffuser l\'Évangile et promouvoir la probité sur les réseaux sociaux.',
    statut: 'PLANIFIE',
    dateEcheance: '2026-11-15',
    porteurProjet: 'Sarah Hounkpatin',
    impactAttendu: 'Toucher 500 000 jeunes avec des messages d\'espérance et de transformation éthique.',
    partenairesRecherches: 'Monteurs vidéo, spécialistes SEO, graphistes, podcasteurs'
  }
];

export const INITIAL_GATE_ANNOUNCEMENTS: GateAnnouncementItem[] = [
  {
    id: 'ann-1',
    gateId: 'croyance_coutume',
    titre: 'Rencontre Trimestrielle des Théologiens & Penseurs Chrétiens',
    contenu: 'Chers frères et sœurs de la Porte Croyance & Coutume, nous vous convions ce samedi à 10h à l\'auditorium pour notre atelier sur les réformes culturelles et l\'impact de l\'enseignement apostolique.',
    date: '2026-09-20',
    auteur: 'Pasteur Barnabé Houessou',
    priorite: 'HAUTE'
  },
  {
    id: 'ann-2',
    gateId: 'education',
    titre: 'Lancement du Tutorat Universitaire Semestriel',
    contenu: 'Tous les professeurs et diplômés de Master disposés à mentorer les nouveaux étudiants sont priés de se signaler auprès du Pilote de la Porte avant le 30 septembre.',
    date: '2026-09-18',
    auteur: 'Pr. David Sossou',
    priorite: 'NORMALE'
  },
  {
    id: 'ann-3',
    gateId: 'finance',
    titre: 'Petit-déjeuner des Décideurs Financiers & Banquiers',
    contenu: 'Séance stratégique sur l\'intelligence financière biblique et la mobilisation des capitaux pour l\'autonomie économique des églises locales.',
    date: '2026-09-15',
    auteur: 'Patrick Akakpo',
    priorite: 'HAUTE'
  },
  {
    id: 'ann-4',
    gateId: 'sante',
    titre: 'Appel à volontaires : Caravane Médicale d\'Octobre',
    contenu: 'Médecins généralistes, spécialistes, dentistes et infirmiers, nous vous invitons à rejoindre la liste des bénévoles pour notre déploiement sanitaire gratuit.',
    date: '2026-09-22',
    auteur: 'Dr. Marcelle Ahouandjinou',
    priorite: 'URGENTE'
  }
];

export const INITIAL_GATE_REPORTS: GateRapportPastorale[] = [
  {
    id: 'rep-1',
    gateId: 'croyance_coutume',
    dateSoumission: '2026-09-01',
    responsableNom: 'Pasteur Barnabé Houessou',
    sujet: 'Rapport Mensuel d\'Impact Apostolique — Porte Croyance & Coutume',
    faitsMarquants: 'Organisation avec succès de 2 séminaires sur la sanctification des traditions avec plus de 180 participants. Rédaction du chapitre 1 du manuel sur les coutumes matrimoniales.',
    statistiques: {
      membresActifs: 24,
      synergiesLancees: 3,
      mentoresSuivis: 12
    },
    defisEtBesoins: 'Besoin d\'un local permanent pour le centre de documentation et l\'accueil des familles en quête d\'accompagnement théologique.',
    sujetsPriere: 'Intercession pour le brisement des liens ancestraux dans les lignées familiales et pour l\'affermissement spirituel des nouveaux convertis.',
    transmisAuPasteur: true
  },
  {
    id: 'rep-2',
    gateId: 'education',
    dateSoumission: '2026-09-05',
    responsableNom: 'Pr. David Sossou',
    sujet: 'Synthèse Trimestrielle — Programme d\'Excellence Scolaire & Académique',
    faitsMarquants: '15 étudiants accompagnés ont obtenu une bourse d\'excellence. 32 professeurs d\'universités chrétiens réunis en réseau actif.',
    statistiques: {
      membresActifs: 38,
      synergiesLancees: 5,
      mentoresSuivis: 45
    },
    defisEtBesoins: 'Augmentation du nombre de tuteurs bénévoles en classes préparatoires scientifiques.',
    sujetsPriere: 'Prière pour l\'inspiration divine des enseignants et la protection des esprits des enfants contre les idéologies déviantes.',
    transmisAuPasteur: true
  }
];

export const LOCAL_STORAGE_KEY_GATE_RESPONSIBLES = 'vases_gate_responsibles';

export function getGateResponsibles(): Record<InfluenceGateId, GateResponsibleInfo> {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GATE_RESPONSIBLES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...GATE_RESPONSIBLES, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error loading gate responsibles', e);
  }
  return GATE_RESPONSIBLES;
}

export function saveGateResponsibles(responsibles: Record<InfluenceGateId, GateResponsibleInfo>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_GATE_RESPONSIBLES, JSON.stringify(responsibles));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vases-leadership-updated', { detail: responsibles }));
    }
  } catch (e) {
    console.error('Error saving gate responsibles', e);
  }
}

export function updateGateResponsible(gateId: InfluenceGateId, updates: Partial<GateResponsibleInfo>): Record<InfluenceGateId, GateResponsibleInfo> {
  const current = getGateResponsibles();
  const existing = current[gateId] || GATE_RESPONSIBLES[gateId];
  const updated = {
    ...current,
    [gateId]: {
      ...existing,
      ...updates,
    },
  };
  saveGateResponsibles(updated);
  return updated;
}

