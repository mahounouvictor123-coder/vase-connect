import { InfluenceGateId, TribeId, FamilleHonneur } from '../types';
import { INFLUENCE_GATES } from '../data/influenceGatesData';

export interface GateDetectionResult {
  gateId: InfluenceGateId;
  gateName: string;
  gateNumber: number;
  iconName: string;
  themeColor: string;
  subTitle: string;
  explanation: string;
  confidence: 'high' | 'medium' | 'default';
}

/**
 * Normalise une chaîne (minuscules, sans accents, sans ponctuation excessive)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Détecte automatiquement la Porte d'Influence correspondant à une profession ou domaine d'activité
 */
export function detectInfluenceGate(profession: string): GateDetectionResult {
  const norm = normalizeText(profession);

  // 1. Croyance et coutume (Porte 1)
  if (
    /(pasteur|berger|apotre|apost|diacre|evangel|theolog|aumon|eglise|culte|missionn|relig|spirituel|chretien|doctrine|foi|prophet|cure|pretre)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'croyance_coutume')!;
    return {
      gateId: 'croyance_coutume',
      gateName: gate.name,
      gateNumber: 1,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur de la foi, du ministère pastoral, de l’éthique et des valeurs spirituelles.',
      confidence: 'high',
    };
  }

  // 2. Éducation (Porte 2)
  if (
    /(enseign|profess|institu|educat|formateur|formatrice|directeur d'ecole|chercheur|doctoran|etudian|eleve|pedagog|universit|lycee|college|ecole|academ|edtech|scolaire)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'education')!;
    return {
      gateId: 'education',
      gateName: gate.name,
      gateNumber: 2,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur de l’enseignement scolaire, supérieur, de la recherche et de la formation.',
      confidence: 'high',
    };
  }

  // 3. Législation (Porte 3)
  if (
    /(avocat|magistrat|juge|jurist|notaire|huissier|greffier|droit|loi|legal|barreau|contentieux|tribunal|juridique|juridiction)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'legislation')!;
    return {
      gateId: 'legislation',
      gateName: gate.name,
      gateNumber: 3,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur du droit, de la justice, du barreau et de la conformité juridique.',
      confidence: 'high',
    };
  }

  // 4. Santé (Porte 11) - Checked before government/politics
  if (
    /(medecin|docteur|sante|infirm|pharmac|sage-femme|chirurg|dentist|optom|biolog|therapeut|psycholog|laborat|hopital|clinique|pediatr|kines|soignant)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'sante')!;
    return {
      gateId: 'sante',
      gateName: gate.name,
      gateNumber: 11,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur médical, paramédical, pharmaceutique et soins de santé.',
      confidence: 'high',
    };
  }

  // 5. Finance (Porte 8)
  if (
    /(banqu|comptab|financ|audit|microfinanc|tresorier|assuran|fintech|bourse|patrimoine|fiscalis|economist|gestionnaire de compte|analyste fin)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'finance')!;
    return {
      gateId: 'finance',
      gateName: gate.name,
      gateNumber: 8,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur bancaire, comptable, de l’investissement et des institutions financières.',
      confidence: 'high',
    };
  }

  // 6. Média et communication (Porte 6)
  if (
    /(journalis|media|communic|marketi|digital|developp|dev |web|informati|logiciel|programmeur|codeur|data|reseaux sociaux|community|video|photo|cadreur|monteur|radio|tele|presse|graphis|designer web|redact|infograph|podcast)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'media_communication')!;
    return {
      gateId: 'media_communication',
      gateName: gate.name,
      gateNumber: 6,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur de l’information, des médias audiovisuels, du numérique et des technologies web.',
      confidence: 'high',
    };
  }

  // 7. Ressource de la terre (Porte 7)
  if (
    /(agricul|agro|agronom|fermier|elevage|avicul|piscicul|peche|plante|environn|ecolog|eau|energie|solaire|mine|geolog|terre|foret|petrol|gaz|ressource)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'ressource_terre')!;
    return {
      gateId: 'ressource_terre',
      gateName: gate.name,
      gateNumber: 7,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur agro-pastoral, des ressources naturelles, de l’énergie et de l’environnement.',
      confidence: 'high',
    };
  }

  // 8. Art et divertissement (Porte 10)
  if (
    /(artist|chant|music|mode|stylis|coutur|acteur|actrice|cinema|theatr|danse|sport|athlet|footbal|peintr|sculpt|design|comed|spectacle|mannequin)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'art_divertissement')!;
    return {
      gateId: 'art_divertissement',
      gateName: gate.name,
      gateNumber: 10,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur créatif, musique, mode, cinéma, beaux-arts et sports de haut niveau.',
      confidence: 'high',
    };
  }

  // 9. Armée et sécurité (Porte 12)
  if (
    /(armee|milit|soldat|officier|gendar|police|polic|securit|vigil|gardien|pompier|sapeur|protection civil|defense|cybersec)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'armee')!;
    return {
      gateId: 'armee',
      gateName: gate.name,
      gateNumber: 12,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur de la défense nationale, des forces de sécurité, police et protection civile.',
      confidence: 'high',
    };
  }

  // 10. Politique (Porte 5)
  if (
    /(politiqu|depute|maire|senat|elu|parlement|parti polit|civiqu|militant polit|gouverneur)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'politique')!;
    return {
      gateId: 'politique',
      gateName: gate.name,
      gateNumber: 5,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur du leadership politique, civique, parlementaire et des mandats électifs.',
      confidence: 'high',
    };
  }

  // 11. Gouvernement & Administration (Porte 4)
  if (
    /(fonctionn|administr|prefet|prefect|douan|impot|tresor publ|etat|diplomat|minister|agent publ|marches publ)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'gouvernement')!;
    return {
      gateId: 'gouvernement',
      gateName: gate.name,
      gateNumber: 4,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur de la fonction publique, des ministères et de l’administration étatique.',
      confidence: 'high',
    };
  }

  // 12. Transport et service (Porte 9)
  if (
    /(transport|chauffeur|conducteur|taxi|vtc|logist|fret|transit|port|maritim|aviat|pilot|btp|macon|architec|electri|plomb|mecanic|menuis|hotel|cuisin|restaur|artisan|service|commerc|vent|magasin|boutiqu)/.test(
      norm
    )
  ) {
    const gate = INFLUENCE_GATES.find(g => g.id === 'transport_service')!;
    return {
      gateId: 'transport_service',
      gateName: gate.name,
      gateNumber: 9,
      iconName: gate.iconName,
      themeColor: gate.themeColor,
      subTitle: gate.subTitle,
      explanation: 'Secteur des transports, de la logistique, du BTP, du commerce et des services aux usagers.',
      confidence: 'high',
    };
  }

  // Default fallback if no pattern matched
  const defaultGate = INFLUENCE_GATES.find(g => g.id === 'transport_service')!;
  return {
    gateId: 'transport_service',
    gateName: defaultGate.name,
    gateNumber: 9,
    iconName: defaultGate.iconName,
    themeColor: defaultGate.themeColor,
    subTitle: defaultGate.subTitle,
    explanation: 'Porte d’accueil pour les domaines professionnels, commerciaux et services divers.',
    confidence: 'default',
  };
}

/**
 * Quartiers du Grand Cotonou avec Famille d'Honneur de rattachement automatique
 */
export interface QuartierMapping {
  quartier: string;
  commune: string;
  familleId: string;
  familleNom: string;
  bergerNom: string;
}

export const GRAND_COTONOU_QUARTIERS: QuartierMapping[] = [
  {
    quartier: 'Fidjrossè Plage / Akogbato',
    commune: 'Cotonou',
    familleId: 'fh-1',
    familleNom: "Famille d'Honneur Grâce & Vie",
    bergerNom: 'Pasteur Élisée Agossa',
  },
  {
    quartier: 'Cadjèhoun / Patte d’Oie',
    commune: 'Cotonou',
    familleId: 'fh-2',
    familleNom: "Famille d'Honneur Shalom & Prospérité",
    bergerNom: 'Pasteur Jean-Marc Houndété',
  },
  {
    quartier: 'Akpakpa Dodomè / PK3',
    commune: 'Cotonou',
    familleId: 'fh-3',
    familleNom: "Famille d'Honneur Bethesda",
    bergerNom: 'Pasteur Daniel Kougblenou',
  },
  {
    quartier: 'Calavi Arconville / Zogbadjè',
    commune: 'Abomey-Calavi',
    familleId: 'fh-4',
    familleNom: "Famille d'Honneur Rehoboth",
    bergerNom: 'Pasteur Samuel Mensah',
  },
  {
    quartier: 'Menontin / Vêdoko / Sainte Rita',
    commune: 'Cotonou',
    familleId: 'fh-5',
    familleNom: "Famille d'Honneur Les Rachetés de Sion",
    bergerNom: 'Pasteur Paul Houndégla',
  },
  {
    quartier: 'Haie Vive / Cocotiers',
    commune: 'Cotonou',
    familleId: 'fh-6',
    familleNom: "Famille d'Honneur Eben-Ezer",
    bergerNom: 'Pasteur Jérémie Zinsou',
  },
  {
    quartier: 'Agla Hlazounto / Les Pylônes',
    commune: 'Cotonou',
    familleId: 'fh-7',
    familleNom: "Famille d'Honneur Peniel",
    bergerNom: 'Pasteur Barnabé Hounkpatin',
  },
  {
    quartier: 'Godomey Togoudo / Dèkoungbé',
    commune: 'Abomey-Calavi',
    familleId: 'fh-8',
    familleNom: "Famille d'Honneur Morija",
    bergerNom: 'Pasteur Josué Bio-Tchané',
  },
  {
    quartier: 'Sèmè-Podji Kraké / Djeffa',
    commune: 'Sèmè-Kpodji',
    familleId: 'fh-9',
    familleNom: "Famille d'Honneur Lumière du Monde",
    bergerNom: 'Pasteur Timothée Akplogan',
  },
];

/**
 * Retrouve automatiquement la Famille d'Honneur correspondant à un quartier donné
 */
export function matchFamilleHonneur(
  quartierInput: string,
  familles: FamilleHonneur[]
): FamilleHonneur | undefined {
  if (!quartierInput || quartierInput.trim() === '') return undefined;
  const qNorm = normalizeText(quartierInput);

  // 1. Direct match with mapped Grand Cotonou list
  for (const m of GRAND_COTONOU_QUARTIERS) {
    const mNorm = normalizeText(m.quartier);
    if (mNorm.includes(qNorm) || qNorm.includes(mNorm)) {
      const found = familles.find(f => f.id === m.familleId);
      if (found) return found;
    }
  }

  // 2. Specific keyword heuristics
  if (/(fidjros|akogbato|fiyegnon|togbin|plage)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-1');
  }
  if (/(cadjehoun|gbegamey|patte|camp guezo|jean-paul)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-2');
  }
  if (/(akpakpa|dodome|pk3|avotrou|dandji|suru|plm)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-3');
  }
  if (/(calavi|arconville|zogbadje|tankpe|abomey)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-4');
  }
  if (/(menontin|vedoko|rita|fifadji|kouhounou|vossa)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-5');
  }
  if (/(haie|vive|aeroport|residentiel|cocotier)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-6');
  }
  if (/(agla|hlazounto|pylone|zogbo|houeyiho|ahogbohoue)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-7');
  }
  if (/(godomey|togoudo|dekoungbe|salamey|womey)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-8');
  }
  if (/(seme|sèmè|krake|kraké|djeffa|ekpe|ekpè|podji)/.test(qNorm)) {
    return familles.find(f => f.id === 'fh-9');
  }

  // 3. Fallback match in the list of familles (comparing quartier, nom, commune)
  for (const f of familles) {
    const fQuartierNorm = normalizeText(f.quartier);
    const fNomNorm = normalizeText(f.nom);
    const fCommuneNorm = normalizeText(f.commune);

    if (
      qNorm.includes(fQuartierNorm) ||
      fQuartierNorm.includes(qNorm) ||
      qNorm.includes(fNomNorm) ||
      qNorm.includes(fCommuneNorm)
    ) {
      return f;
    }
  }

  // 4. Default to first famille (Fidjrossè) if nothing matches
  return familles[0];
}

/**
 * Suggestions courantes de professions avec libellés complets
 */
export const SUGGESTED_PROFESSIONS = [
  'Développeur Web & Mobile',
  'Ingénieur Informaticien / Data',
  'Comptable & Auditeur Financier',
  'Banquier / Gestionnaire de Portefeuille',
  'Médecin Généraliste / Spécialiste',
  'Infirmier / Soignant',
  'Docteur en Pharmacie',
  'Avocat au Barreau',
  'Juriste d’Entreprise',
  'Professeur / Enseignant',
  'Directeur d’Établissement Scolaire',
  'Agro-entrepreneur / Fermier',
  'Ingénieur BTP & Architecte',
  'Chauffeur VTC / Transporteur',
  'Journaliste & Communicant',
  'Chanteur / Chantre & Musicien',
  'Styliste & Créateur de Mode',
  'Agent de la Fonction Publique',
  'Policier / Militaire / Sécurité',
  'Commerçant / E-commerce',
  'Étudiant d’Excellence',
  'Pasteur / Serviteur de Dieu',
];
