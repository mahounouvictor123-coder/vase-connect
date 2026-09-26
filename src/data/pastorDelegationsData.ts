import { PastorDelegation } from '../types';

export const INITIAL_PASTOR_DELEGATIONS: PastorDelegation[] = [
  {
    id: 'del-membre-officiel',
    nomBeneficiaire: 'Tout Nouveau Membre / Fidèle Vases d’Honneur',
    telephoneBeneficiaire: '',
    titreRole: 'Membre de l’Assemblée (Espace Fidèle)',
    typePortion: 'MEMBRE',
    ongletsAutorises: ['accueil', 'coeur_honneur', 'familles_honneur', 'tribus', 'portes', 'market', 'opportunites', 'evenements', 'mon_profil'],
    portionsPastoralesAutorisees: [],
    entiteAssociee: 'Communauté Vases d’Honneur',
    actif: true,
    dateCreation: '2026-09-01T08:00:00Z',
    codeAccesCourt: 'VC-MBR-2026',
    notesPastorales: 'Portion réservée aux fidèles : accès aux activités fraternelles, annonces, requêtes d’aide et familles d’honneur. Accès pastoral strictement verrouillé.',
  },
  {
    id: 'del-resp-presences',
    nomBeneficiaire: 'Diacre Jean-Paul AHOUANSE (Protocole & Accueil)',
    telephoneBeneficiaire: '+229 97 12 34 56',
    titreRole: 'Responsable du Pointage des Présences au Culte',
    typePortion: 'RESPONSABLE_PRESENCES',
    ongletsAutorises: ['presence_culte', 'pastor'],
    portionsPastoralesAutorisees: ['presences', 'cultes'],
    entiteAssociee: 'Département Accueil, Ordre & Protocole Royal',
    actif: true,
    dateCreation: '2026-09-05T10:00:00Z',
    codeAccesCourt: 'VC-PRES-7721',
    notesPastorales: 'Portion dédiée au pointage dominical en direct (1er culte 7h30 & 2nd culte 10h30), décompte de l’assistance et transmission des bilans de présences.',
  },
  {
    id: 'del-berger-famille',
    nomBeneficiaire: 'Berger David KOUADIO',
    telephoneBeneficiaire: '+229 96 44 55 66',
    titreRole: 'Berger de Famille d’Honneur (Cellule de Maison)',
    typePortion: 'BERGER_FAMILLE',
    ongletsAutorises: ['familles_honneur', 'coeur_honneur'],
    portionsPastoralesAutorisees: ['templates'],
    entiteAssociee: 'Famille Grâce & Vie (Fidjrossè)',
    actif: true,
    dateCreation: '2026-09-10T14:30:00Z',
    codeAccesCourt: 'VC-FAM-4109',
    notesPastorales: 'Portion de gestion de la cellule de maison : liste des brebis du quartier, recueil des requêtes de prière et transmission des rapports de réunion.',
  },
  {
    id: 'del-patriarche-tribu',
    nomBeneficiaire: 'Patriarche Paulin DOSSOU',
    telephoneBeneficiaire: '+229 95 88 99 00',
    titreRole: 'Patriarche de la Tribu de Juda',
    typePortion: 'RESPONSABLE_TRIBU',
    ongletsAutorises: ['tribus', 'presence_culte'],
    portionsPastoralesAutorisees: ['membres'],
    entiteAssociee: 'Tribu de Juda — La Louange et la Royauté',
    actif: true,
    dateCreation: '2026-09-12T09:15:00Z',
    codeAccesCourt: 'VC-TRB-8832',
    notesPastorales: 'Portion de gestion de la tribu : cohésion fraternelle, enrôlement des nouveaux membres de Juda et mobilisation spirituelle.',
  },
  {
    id: 'del-resp-coeur',
    nomBeneficiaire: 'Diaconesse Marie-Esther DOSSOU',
    telephoneBeneficiaire: '+229 97 45 67 89',
    titreRole: 'Responsable du Cœur d’Honneur (Bienfaisance & Secours)',
    typePortion: 'RESPONSABLE_COEUR_HONNEUR',
    ongletsAutorises: ['coeur_honneur', 'pastor'],
    portionsPastoralesAutorisees: ['templates', 'speciaux'],
    entiteAssociee: 'Diaconie — Cœur d’Honneur',
    actif: true,
    dateCreation: '2026-09-15T11:00:00Z',
    codeAccesCourt: 'VC-COEUR-5544',
    notesPastorales: 'Portion dédiée à la supervision des campagnes de charité, examen confidentiel des demandes de secours d’urgence et distribution des vivres.',
  },
  {
    id: 'del-resp-dept-com',
    nomBeneficiaire: 'Frère Samuel KOFFI',
    telephoneBeneficiaire: '+229 96 33 22 11',
    titreRole: 'Responsable Département Communication & Médias',
    typePortion: 'RESPONSABLE_DEPARTEMENT',
    ongletsAutorises: ['accueil', 'opportunites', 'evenements'],
    portionsPastoralesAutorisees: ['templates'],
    entiteAssociee: 'Département Médias, Diffusion & Réseaux Sociaux',
    actif: true,
    dateCreation: '2026-09-18T16:00:00Z',
    codeAccesCourt: 'VC-DEPT-9012',
    notesPastorales: 'Portion réservée au responsable départemental pour la gestion de ses équipes de serviteurs et la transmission des comptes-rendus de service.',
  },
];

const LOCAL_STORAGE_KEY = 'vases_pastor_delegations';

export function getPastorDelegations(): PastorDelegation[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erreur lecture delegations pastorales:', err);
  }
  return INITIAL_PASTOR_DELEGATIONS;
}

export function savePastorDelegations(delegations: PastorDelegation[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(delegations));
  } catch (err) {
    console.error('Erreur sauvegarde delegations pastorales:', err);
  }
}

export function generateRandomAccessCode(prefix = 'VC'): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export function generateDelegationUrl(delegation: PastorDelegation): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}?delegation=${delegation.id}`;
}

export function generateWhatsAppDelegationMessage(delegation: PastorDelegation): string {
  const url = generateDelegationUrl(delegation);
  const portionName = delegation.titreRole;
  const recipientName = delegation.nomBeneficiaire || 'Bien-aimé(e)';

  return (
    `🕊️ *ÉGLISE VASES D'HONNEUR — CHAIRE PASTORALE DU PASTEUR MOHAMMED SANOGO*\n\n` +
    `Shalom ${recipientName},\n\n` +
    `Par la présente directive pastorale, le Pasteur Principal vous a délégué un *accès officiel et sécurisé* sur la plateforme Vases Connect avec l'attribution suivante :\n\n` +
    `🎖️ *Rôle Délégué :* ${portionName}\n` +
    `🏛️ *Entité :* ${delegation.entiteAssociee || 'Église Locale'}\n` +
    `🔑 *Code d'Accès Sécurisé :* ${delegation.codeAccesCourt}\n\n` +
    `📲 *VOTRE LIEN D'ACCÈS CLOISONNÉ OFFICIEL :*\n` +
    `👉 ${url}\n\n` +
    `📌 *Instructions d'Installation sur votre Smartphone :*\n` +
    `1. Cliquez sur le lien ci-dessus pour accéder directement à votre portion autorisée.\n` +
    `2. Appuyez sur le bouton *« 📲 Ajouter à l'écran d'accueil »* pour installer l'application avec le logo officiel Vases Connect sur votre téléphone !\n` +
    `3. Vous y accéderez ensuite en 1 clic comme une application native.\n\n` +
    `_« Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes » (Colossiens 3:23)_\n\n` +
    `Que le Seigneur Jésus déverse Sa grâce et Son onction sur votre service !`
  );
}
