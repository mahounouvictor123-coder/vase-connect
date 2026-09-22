import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_MEMBERS, INITIAL_PRODUCTS, INITIAL_OPPORTUNITIES, INITIAL_DEPARTMENTS, INITIAL_EVENTS, INITIAL_POSTS } from './src/data/mockData';
import { INFLUENCE_GATES, INITIAL_GATE_MEMBERS } from './src/data/influenceGatesData';
import { INITIAL_TRIBES, INITIAL_TRIBE_MEMBERS } from './src/data/tribesData';
import { INITIAL_FAMILLES_HONNEUR, INITIAL_FAMILLE_INSCRIPTIONS } from './src/data/famillesHonneurData';
import { INITIAL_CULTES_RESUMES, INITIAL_RAPPORT_TEMPLATES, INITIAL_RAPPORTS_SOUMIS, INITIAL_RAPPORTS_SPECIAUX, INITIAL_CULTE_PRESENCES } from './src/data/pastorData';
import { UserProfile, ProductItem, OpportunityItem, AISearchResult, GateMemberProfile, TribeMember, TribeInfo, FamilleHonneur, FamilleHonneurInscription, CulteResume, RapportTemplate, RapportSoumis, RapportSpecial, CultePresenceRecord, DepartmentItem, DepartmentMember } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with live state
let members: UserProfile[] = [...INITIAL_MEMBERS];
let products: ProductItem[] = [...INITIAL_PRODUCTS];
let opportunities: OpportunityItem[] = [...INITIAL_OPPORTUNITIES];
let posts = [...INITIAL_POSTS];
let departments: DepartmentItem[] = [...INITIAL_DEPARTMENTS];
const events = [...INITIAL_EVENTS];
let gateMembers: GateMemberProfile[] = [...INITIAL_GATE_MEMBERS];
let tribes: TribeInfo[] = [...INITIAL_TRIBES];
let tribeMembers: TribeMember[] = [...INITIAL_TRIBE_MEMBERS];
let famillesHonneur: FamilleHonneur[] = [...INITIAL_FAMILLES_HONNEUR];
let familleInscriptions: FamilleHonneurInscription[] = [...INITIAL_FAMILLE_INSCRIPTIONS];
let cultesResumes: CulteResume[] = [...INITIAL_CULTES_RESUMES];
let rapportTemplates: RapportTemplate[] = [...INITIAL_RAPPORT_TEMPLATES];
let rapportsSoumis: RapportSoumis[] = [...INITIAL_RAPPORTS_SOUMIS];
let rapportsSpeciaux: RapportSpecial[] = [...INITIAL_RAPPORTS_SPECIAUX];
let cultesPresences: CultePresenceRecord[] = [...INITIAL_CULTE_PRESENCES];

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Data endpoints
app.get('/api/data/all', (req, res) => {
  res.json({
    members,
    products,
    opportunities,
    departments,
    events,
    posts,
    gates: INFLUENCE_GATES,
    gateMembers,
  });
});

// 12 Influence Gates endpoints (Pasteur Mohammed Sanogo)
app.get('/api/gates', (req, res) => {
  res.json({ gates: INFLUENCE_GATES });
});

app.get('/api/gates/members', (req, res) => {
  const { gateId } = req.query;
  if (gateId && typeof gateId === 'string') {
    const filtered = gateMembers.filter(m => m.gateId === gateId);
    res.json({ members: filtered });
  } else {
    res.json({ members: gateMembers });
  }
});

app.post('/api/gates/members', (req, res) => {
  const profile: GateMemberProfile = req.body;
  if (!profile.id) {
    profile.id = 'gm-' + Date.now();
  }
  const existingIdx = gateMembers.findIndex(
    m => m.id === profile.id || (m.userId === profile.userId && m.gateId === profile.gateId)
  );
  if (existingIdx !== -1) {
    gateMembers[existingIdx] = profile;
  } else {
    gateMembers.unshift(profile);
  }
  res.json({ success: true, profile });
});

// Les 12 Tribus endpoints
app.get('/api/tribes', (req, res) => {
  res.json({ tribes });
});

app.get('/api/tribes/members', (req, res) => {
  const { tribeId } = req.query;
  if (tribeId && typeof tribeId === 'string') {
    const filtered = tribeMembers.filter(m => m.tribeId === tribeId);
    res.json({ members: filtered });
  } else {
    res.json({ members: tribeMembers });
  }
});

app.post('/api/tribes/members', (req, res) => {
  const member: TribeMember = req.body;
  if (!member.id) {
    member.id = 'tm-' + Date.now();
  }
  const existingIdx = tribeMembers.findIndex(
    m => m.id === member.id || (m.userId === member.userId && m.tribeId === member.tribeId)
  );
  if (existingIdx !== -1) {
    tribeMembers[existingIdx] = member;
  } else {
    tribeMembers.unshift(member);
  }

  // If registering as leader, also update leader in tribes array
  if (member.roleInTribe === 'PATRIARCHE' || member.roleInTribe === 'MATRIARCHE') {
    const tIdx = tribes.findIndex(t => t.id === member.tribeId);
    if (tIdx !== -1) {
      tribes[tIdx] = {
        ...tribes[tIdx],
        leader: {
          title: member.roleInTribe === 'MATRIARCHE' ? 'Matriarche' : 'Patriarche',
          nom: member.nom,
          prenom: member.prenom,
          phone: member.numero,
          quartier: member.quartier,
          photoUrl: member.photoUrl,
          assignedAt: member.registeredAt,
        }
      };
    }
  }

  res.json({ success: true, member });
});

// Departments endpoints
app.get('/api/departments', (req, res) => {
  res.json({ departments });
});

app.post('/api/departments', (req, res) => {
  const newDept: DepartmentItem = req.body;
  if (!newDept.id) {
    newDept.id = 'dept-' + Date.now();
  }
  if (!newDept.membersList) {
    newDept.membersList = [];
  }
  departments.unshift(newDept);
  res.json({ success: true, department: newDept });
});

app.post('/api/departments/:id/members', (req, res) => {
  const { id } = req.params;
  const member: DepartmentMember = req.body;
  const dept = departments.find(d => d.id === id);
  if (!dept) {
    return res.status(404).json({ error: 'Département introuvable' });
  }
  if (!member.id) {
    member.id = 'dm-' + Date.now();
  }
  member.departmentId = id;
  if (!dept.membersList) {
    dept.membersList = [];
  }
  const existingIdx = dept.membersList.findIndex(m => m.id === member.id || (member.email && m.email === member.email));
  if (existingIdx !== -1) {
    dept.membersList[existingIdx] = member;
  } else {
    dept.membersList.push(member);
    dept.memberCount = (dept.memberCount || 0) + 1;
  }
  res.json({ success: true, member, department: dept });
});

// Familles d'Honneur endpoints
app.get('/api/familles-honneur', (req, res) => {
  const { commune, quartier } = req.query;
  let filtered = [...famillesHonneur];
  if (commune && typeof commune === 'string' && commune !== 'Toutes') {
    filtered = filtered.filter(f => f.commune.toLowerCase() === commune.toLowerCase());
  }
  if (quartier && typeof quartier === 'string' && quartier !== 'Tous les quartiers') {
    filtered = filtered.filter(f => f.quartier.toLowerCase().includes(quartier.toLowerCase()));
  }
  res.json({ familles: filtered });
});

app.post('/api/familles-honneur', (req, res) => {
  const newFamille: FamilleHonneur = req.body;
  if (!newFamille.id) {
    newFamille.id = 'fh-' + Date.now();
  }
  if (!newFamille.createdAt) {
    newFamille.createdAt = new Date().toISOString();
  }
  const existingIdx = famillesHonneur.findIndex(f => f.id === newFamille.id);
  if (existingIdx !== -1) {
    famillesHonneur[existingIdx] = newFamille;
  } else {
    famillesHonneur.unshift(newFamille);
  }
  res.json({ success: true, famille: newFamille });
});

app.get('/api/familles-honneur/inscriptions', (req, res) => {
  const { familleId } = req.query;
  if (familleId && typeof familleId === 'string') {
    const list = familleInscriptions.filter(i => i.familleId === familleId);
    return res.json({ inscriptions: list });
  }
  res.json({ inscriptions: familleInscriptions });
});

app.post('/api/familles-honneur/inscriptions', (req, res) => {
  const inscription: FamilleHonneurInscription = req.body;
  if (!inscription.id) {
    inscription.id = 'fhi-' + Date.now();
  }
  if (!inscription.dateInscription) {
    inscription.dateInscription = new Date().toISOString().split('T')[0];
  }
  familleInscriptions.unshift(inscription);

  // Update count in famille
  const fIdx = famillesHonneur.findIndex(f => f.id === inscription.familleId);
  if (fIdx !== -1) {
    famillesHonneur[fIdx].membresInscritsCount = (famillesHonneur[fIdx].membresInscritsCount || 0) + 1;
  }

  res.json({ success: true, inscription });
});

// ==========================================
// ESPACE PASTEUR API ROUTES
// ==========================================

app.get('/api/pastor/data', (req, res) => {
  res.json({
    cultes: cultesResumes,
    templates: rapportTemplates,
    rapports: rapportsSoumis,
    rapportsSpeciaux: rapportsSpeciaux,
    cultesPresences: cultesPresences,
  });
});

// Présences aux Cultes (7h30 et 10h30)
app.get('/api/pastor/cultes-presences', (req, res) => {
  const { date, culte, tribeId } = req.query;
  let filtered = [...cultesPresences];

  if (date) {
    filtered = filtered.filter(p => p.dateDimanche === date);
  }
  if (culte && culte !== 'TOUS') {
    filtered = filtered.filter(p => p.culte === culte);
  }
  if (tribeId && tribeId !== 'TOUTES') {
    filtered = filtered.filter(p => p.tribeId === tribeId);
  }

  res.json(filtered);
});

app.post('/api/pastor/cultes-presences', (req, res) => {
  const record: CultePresenceRecord = req.body;
  if (!record.id) {
    record.id = 'cp-' + Date.now();
  }
  if (!record.confirmeAt) {
    record.confirmeAt = new Date().toISOString();
  }

  // Vérifier si une présence existe déjà pour ce membre et cette date/culte
  const existingIdx = cultesPresences.findIndex(p => {
    if (record.memberId && p.memberId && p.memberId === record.memberId) {
      return p.dateDimanche === record.dateDimanche && p.culte === record.culte;
    }
    return (
      p.nom.toLowerCase().trim() === record.nom.toLowerCase().trim() &&
      p.prenom.toLowerCase().trim() === record.prenom.toLowerCase().trim() &&
      p.dateDimanche === record.dateDimanche &&
      p.culte === record.culte
    );
  });

  if (existingIdx !== -1) {
    cultesPresences[existingIdx] = { ...cultesPresences[existingIdx], ...record };
    return res.json({ success: true, presence: cultesPresences[existingIdx], updated: true });
  }

  cultesPresences.unshift(record);

  // Si c'est une nouvelle inscription avec une tribu et qu'il n'est pas encore membre de la tribu
  if (record.tribeId && !record.memberId) {
    const existingTribeMember = tribeMembers.find(
      tm =>
        tm.tribeId === record.tribeId &&
        (tm.numero.replace(/\s+/g, '') === record.telephone.replace(/\s+/g, '') ||
         (tm.nom.toLowerCase() === record.nom.toLowerCase() && tm.prenom.toLowerCase() === record.prenom.toLowerCase()))
    );

    if (!existingTribeMember) {
      const newTribeMember: TribeMember = {
        id: 'tm-' + Date.now(),
        tribeId: record.tribeId,
        nom: record.nom,
        prenom: record.prenom,
        numero: record.telephone,
        quartier: record.quartier || 'Non spécifié',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        roleInTribe: record.statutMembre === 'RESPONSABLE' ? 'RESPONSABLE' : 'MEMBRE',
        registeredAt: record.dateDimanche,
      };
      tribeMembers.push(newTribeMember);
      record.memberId = newTribeMember.id;
    } else {
      record.memberId = existingTribeMember.id;
    }
  }

  res.json({ success: true, presence: record, created: true });
});

app.delete('/api/pastor/cultes-presences/:id', (req, res) => {
  const { id } = req.params;
  cultesPresences = cultesPresences.filter(p => p.id !== id);
  res.json({ success: true });
});

app.post('/api/pastor/cultes', (req, res) => {
  const newCulte: CulteResume = req.body;
  if (!newCulte.id) {
    newCulte.id = 'culte-' + Date.now();
  }
  cultesResumes.unshift(newCulte);
  res.json({ success: true, culte: newCulte });
});

app.post('/api/pastor/templates', (req, res) => {
  const newTemplate: RapportTemplate = req.body;
  if (!newTemplate.id) {
    newTemplate.id = 'tpl-' + Date.now();
  }
  rapportTemplates.push(newTemplate);
  res.json({ success: true, template: newTemplate });
});

app.post('/api/pastor/rapports', (req, res) => {
  const newRapport: RapportSoumis = req.body;
  if (!newRapport.id) {
    newRapport.id = 'rap-' + Date.now();
  }
  rapportsSoumis.unshift(newRapport);
  res.json({ success: true, rapport: newRapport });
});

app.put('/api/pastor/rapports/:id', (req, res) => {
  const { id } = req.params;
  const index = rapportsSoumis.findIndex(r => r.id === id);
  if (index !== -1) {
    rapportsSoumis[index] = { ...rapportsSoumis[index], ...req.body };
    res.json({ success: true, rapport: rapportsSoumis[index] });
  } else {
    res.status(404).json({ error: 'Rapport non trouvé' });
  }
});

app.post('/api/pastor/speciaux', (req, res) => {
  const newSpecial: RapportSpecial = req.body;
  if (!newSpecial.id) {
    newSpecial.id = 'spec-' + Date.now();
  }
  rapportsSpeciaux.unshift(newSpecial);
  res.json({ success: true, special: newSpecial });
});

app.post('/api/members', (req, res) => {
  const newMember: UserProfile = req.body;
  if (!newMember.id) {
    newMember.id = 'usr-' + Date.now();
  }
  members.unshift(newMember);
  res.json({ success: true, member: newMember });
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...req.body };
    res.json({ success: true, member: members[index] });
  } else {
    res.status(404).json({ error: 'Membre non trouvé' });
  }
});

app.post('/api/products', (req, res) => {
  const newProduct: ProductItem = req.body;
  if (!newProduct.id) {
    newProduct.id = 'prod-' + Date.now();
  }
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

app.post('/api/opportunities', (req, res) => {
  const newOpp: OpportunityItem = req.body;
  if (!newOpp.id) {
    newOpp.id = 'opp-' + Date.now();
  }
  opportunities.unshift(newOpp);
  res.json({ success: true, opportunity: newOpp });
});

app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  if (!newPost.id) {
    newPost.id = 'post-' + Date.now();
  }
  posts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post('/api/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (post) {
    post.likedByCurrentUser = !post.likedByCurrentUser;
    post.likesCount += post.likedByCurrentUser ? 1 : -1;
    res.json({ success: true, likesCount: post.likesCount, liked: post.likedByCurrentUser });
  } else {
    res.status(404).json({ error: 'Post non trouvé' });
  }
});

// Deterministic semantic fallback search engine
function fallbackSearch(query: string): AISearchResult {
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Matched members
  const matchedMembers: AISearchResult['matchedMembers'] = [];
  const matchedProducts: AISearchResult['matchedProducts'] = [];
  const matchedOpportunities: AISearchResult['matchedOpportunities'] = [];

  // Synonyms mappings
  const keywordsMap: { [key: string]: string[] } = {
    computer: ['ordinateur', 'ordinateur portable', 'pc', 'laptop', 'informaticien', 'dell', 'hp', 'informatique'],
    shoes: ['chaussure', 'chaussures', 'soulier', 'escarpin', 'richelieu', 'cuir'],
    pastry: ['patisserie', 'patissier', 'patissiere', 'gateau', 'gateaux', 'anniversaire', 'cake', 'traiteur'],
    logo: ['logo', 'graphiste', 'designer', 'infographiste', 'photoshop', 'illustrator', 'canva', 'identite visuelle', 'charte graphique'],
    excel: ['excel', 'comptable', 'comptabilite', 'powerbi', 'finance', 'tableur', 'gestion'],
    photo: ['photographe', 'photographie', 'videaste', 'video', 'filmer', 'mariage', 'camera', 'drone'],
    transport: ['transport', 'chauffeur', 'voiture', 'vehicule', 'deplacement', 'navette'],
    clothes: ['couturiere', 'couture', 'vetement', 'vetements', 'styliste', 'robe', 'tenue', 'enfant', 'enfants'],
    repair: ['reparer', 'reparation', 'telephone', 'smartphone', 'iphone', 'ecran'],
    dev: ['developpeur', 'developper', 'application', 'site web', 'react', 'code', 'programmeur', 'jeune developpeur'],
    recruitment: ['recruter', 'recrutement', 'embaucher', 'stage', 'emploi', 'secretaire']
  };

  // Check query against keywords
  for (const m of members) {
    const memberText = `${m.firstName} ${m.lastName} ${m.profession} ${m.bio} ${m.skills.join(' ')} ${m.activities.join(' ')} ${m.city} ${m.departmentName}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let score = 0;
    let reasons: string[] = [];

    // Direct words check
    const queryWords = q.split(/\s+/).filter(w => w.length > 2);
    for (const w of queryWords) {
      if (memberText.includes(w)) {
        score += 25;
        reasons.push(`Correspondance avec "${w}"`);
      }
    }

    // Synonym cluster match
    for (const [, synonyms] of Object.entries(keywordsMap)) {
      const queryMatchesCategory = synonyms.some(s => q.includes(s));
      const memberMatchesCategory = synonyms.some(s => memberText.includes(s));
      if (queryMatchesCategory && memberMatchesCategory) {
        score += 40;
        reasons.push(`Compétence ou métier lié détecté`);
      }
    }

    // Location bonus if specified
    if (q.includes('cotonou') && m.city.toLowerCase().includes('cotonou')) {
      score += 15;
    }
    // Youth check
    if ((q.includes('jeune') || q.includes('jeunesse')) && (m.departmentId === 'jeunesse' || m.skills.includes('React Native'))) {
      score += 20;
      reasons.push('Membre du département Jeunesse');
    }

    if (score > 25) {
      matchedMembers.push({
        member: m,
        relevanceReason: reasons.slice(0, 2).join(' • ') || 'Profil pertinent pour votre besoin',
        matchScore: Math.min(score, 98),
      });
    }
  }

  // Products check
  for (const p of products) {
    const prodText = `${p.title} ${p.description} ${p.categoryLabel} ${p.tags.join(' ')} ${p.sellerName} ${p.sellerCity}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    let match = false;
    for (const [, synonyms] of Object.entries(keywordsMap)) {
      if (synonyms.some(s => q.includes(s)) && synonyms.some(s => prodText.includes(s))) {
        match = true;
        break;
      }
    }
    if (!match) {
      const queryWords = q.split(/\s+/).filter(w => w.length > 2);
      match = queryWords.some(w => prodText.includes(w));
    }

    if (match) {
      matchedProducts.push({
        product: p,
        relevanceReason: `Article "${p.title}" disponible auprès de ${p.sellerName}`,
      });
    }
  }

  // Sort by score
  matchedMembers.sort((a, b) => b.matchScore - a.matchScore);

  const hasResults = matchedMembers.length > 0 || matchedProducts.length > 0;

  let naturalAnswer = '';
  if (hasResults) {
    const parts: string[] = [];
    if (matchedMembers.length > 0) {
      parts.push(`J'ai trouvé ${matchedMembers.length} membre(s) qualifié(s) dans notre église pour répondre à votre besoin.`);
    }
    if (matchedProducts.length > 0) {
      parts.push(`${matchedProducts.length} offre(s) ou produit(s) vérifié(s) sont disponible(s) sur Vases Market.`);
    }
    naturalAnswer = parts.join(' ');
  } else {
    naturalAnswer = "Je n'ai trouvé aucun membre correspondant actuellement dans la plateforme. Vous pouvez publier une demande afin que les membres concernés puissent vous contacter.";
  }

  return {
    query,
    intent: 'Recherche communautaire Vases Connect',
    extractedCriteria: {
      location: q.includes('cotonou') ? 'Cotonou' : undefined,
    },
    matchedMembers,
    matchedProducts,
    matchedOpportunities,
    naturalAnswer,
    noResultsFound: !hasResults,
    suggestedAction: !hasResults ? 'Publier une annonce dans la section Entraide ou Opportunités' : undefined,
  };
}

// AI Assistant Intelligent Endpoint with Gemini 3.8-flash
app.post('/api/assistant', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'La requête est obligatoire' });
    return;
  }

  const ai = getAIClient();

  // If no Gemini API key is configured or server offline, use high-precision local matcher
  if (!ai) {
    const localResult = fallbackSearch(query);
    res.json(localResult);
    return;
  }

  try {
    // Sanitized context data for Gemini (respecting privacy: phone number hidden if not public)
    const membersData = members.map(m => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      profession: m.profession,
      skills: m.skills,
      activities: m.activities,
      city: m.city,
      department: m.departmentName,
      status: m.status,
      experienceYears: m.experienceYears,
      availableForOpportunities: m.availableForOpportunities,
      availableForMissions: m.availableForMissions,
      phonePublic: m.phonePublic,
    }));

    const productsData = products.map(p => ({
      id: p.id,
      title: p.title,
      type: p.type,
      category: p.categoryLabel,
      description: p.description,
      price: `${p.price} ${p.currency}`,
      sellerName: p.sellerName,
      sellerCity: p.sellerCity,
      tags: p.tags,
      isAvailable: p.isAvailable,
    }));

    const oppsData = opportunities.map(o => ({
      id: o.id,
      title: o.title,
      type: o.typeLabel,
      location: o.location,
      requiredSkills: o.requiredSkills,
      compensation: o.compensation,
    }));

    const prompt = `Tu es l'ASSISTANT VASES, le moteur d'intelligence artificielle de la communauté de l'église Vases d'Honneur (Assemblée Porte des Cieux).
Slogan : "Connecter les talents, les besoins et les opportunités de la communauté."

RÈGLES ABSOLUES :
1. Tu ne dois JAMAIS INVENTER une personne, un produit, un prix, un service ou une compétence.
2. Toutes les données doivent STRICTEMENT provenir de la liste fournie ci-dessous.
3. Si AUCUN résultat ne correspond, réponds exactement :
   "Je n'ai trouvé aucun membre correspondant actuellement dans la plateforme."
   et propose : "Vous pouvez publier une demande afin que les membres concernés puissent vous contacter."
4. Comprends les intentions, le contexte et les synonymes (ex: "faire mon logo" = graphiste, infographiste, designer, création visuelle ; "PC" = ordinateur portable, laptop ; "chaussures" = vendeurs de chaussures ; "filmer mariage" = photographe/vidéaste ; "couturière à Cotonou" = couturière installée à Cotonou).
5. Fournis une réponse structurée en JSON.

DONNÉES DISPONIBLES DANS LA PLATEFORME VASES CONNECT :
MEMBRES : ${JSON.stringify(membersData)}
PRODUITS & SERVICES EN VENTE : ${JSON.stringify(productsData)}
OPPORTUNITÉS : ${JSON.stringify(oppsData)}
ENSEIGNEMENT ET LIVRE « 12 PORTES D'INFLUENCE POUR TRANSFORMER UNE NATION » DU PASTEUR MOHAMMED SANOGO : ${JSON.stringify(INFLUENCE_GATES.map(g => ({ number: g.number, id: g.id, name: g.name, subSectors: g.keySubSectors, biblicalExample: g.biblicalExample })))}
LES 12 TRIBUS : ${JSON.stringify(tribes.map(t => ({ id: t.id, name: t.name, leader: t.leader, meaning: t.biblicalMeaning })))}
FAMILLES D'HONNEUR GÉOLOCALISÉES (COTONOU & ENVIRONS) : ${JSON.stringify(famillesHonneur.map(f => ({ id: f.id, nom: f.nom, quartier: f.quartier, commune: f.commune, repere: f.adresseRepere, hote: `${f.hotePrenom} ${f.hoteNom}`, phone: f.hotePhone, rencontre: f.rencontreFrequence, prochaine: f.prochaineDate })))}

Si l'utilisateur interroge sur les 12 Portes d'Influence pour Transformer une Nation, sur les 12 Tribus, ou sur les FAMILLES D'HONNEUR (cellules fraternelles de fin de mois dans les quartiers de Cotonou, Calavi, Sèmè), guide-le avec précision et bienveillance.

DEMANDE UTILISATEUR : "${query}"

Renvoie les IDs exacts des membres, produits et opportunités qui correspondent. Calcule un score de pertinence de 50 à 98% pour chaque membre correspondant.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            extractedCriteria: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                activity: { type: Type.STRING },
                productOrSkill: { type: Type.STRING },
                location: { type: Type.STRING },
              },
            },
            matchedMemberIds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  memberId: { type: Type.STRING },
                  relevanceReason: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                },
                required: ['memberId', 'relevanceReason', 'matchScore'],
              },
            },
            matchedProductIds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  relevanceReason: { type: Type.STRING },
                },
                required: ['productId', 'relevanceReason'],
              },
            },
            matchedOpportunityIds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  opportunityId: { type: Type.STRING },
                  relevanceReason: { type: Type.STRING },
                },
                required: ['opportunityId', 'relevanceReason'],
              },
            },
            naturalAnswer: { type: Type.STRING },
            noResultsFound: { type: Type.BOOLEAN },
            suggestedAction: { type: Type.STRING },
          },
          required: ['intent', 'naturalAnswer', 'noResultsFound'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Hydrate back to full objects
    const hydratedMembers: AISearchResult['matchedMembers'] = [];
    if (parsed.matchedMemberIds && Array.isArray(parsed.matchedMemberIds)) {
      for (const item of parsed.matchedMemberIds) {
        const found = members.find(m => m.id === item.memberId);
        if (found) {
          hydratedMembers.push({
            member: found,
            relevanceReason: item.relevanceReason,
            matchScore: item.matchScore,
          });
        }
      }
    }

    const hydratedProducts: AISearchResult['matchedProducts'] = [];
    if (parsed.matchedProductIds && Array.isArray(parsed.matchedProductIds)) {
      for (const item of parsed.matchedProductIds) {
        const found = products.find(p => p.id === item.productId);
        if (found) {
          hydratedProducts.push({
            product: found,
            relevanceReason: item.relevanceReason,
          });
        }
      }
    }

    const hydratedOpportunities: AISearchResult['matchedOpportunities'] = [];
    if (parsed.matchedOpportunityIds && Array.isArray(parsed.matchedOpportunityIds)) {
      for (const item of parsed.matchedOpportunityIds) {
        const found = opportunities.find(o => o.id === item.opportunityId);
        if (found) {
          hydratedOpportunities.push({
            opportunity: found,
            relevanceReason: item.relevanceReason,
          });
        }
      }
    }

    // Fallback if AI found nothing or hallucinated IDs
    if (hydratedMembers.length === 0 && hydratedProducts.length === 0 && !parsed.noResultsFound) {
      const fallback = fallbackSearch(query);
      res.json(fallback);
      return;
    }

    const result: AISearchResult = {
      query,
      intent: parsed.intent || 'Recherche communautaire Vases Connect',
      extractedCriteria: parsed.extractedCriteria || {},
      matchedMembers: hydratedMembers,
      matchedProducts: hydratedProducts,
      matchedOpportunities: hydratedOpportunities,
      naturalAnswer: parsed.naturalAnswer || 'Voici les résultats trouvés dans la communauté Vases d\'Honneur.',
      noResultsFound: parsed.noResultsFound || (hydratedMembers.length === 0 && hydratedProducts.length === 0),
      suggestedAction: parsed.suggestedAction,
    };

    res.json(result);
  } catch (error) {
    console.error('Erreur Gemini Assistant:', error);
    // Graceful fallback to the high-precision semantic matcher
    const localResult = fallbackSearch(query);
    res.json(localResult);
  }
});

// Vite middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur Vases Connect opérationnel sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
