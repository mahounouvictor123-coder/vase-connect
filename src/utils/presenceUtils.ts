import { CultePresenceRecord, CulteServiceType, TribeId, TribeInfo, TribeMember } from '../types';

export const KNOWN_SUNDAYS = ['2026-09-20', '2026-09-13', '2026-09-06'];

/**
 * Get all available distinct Sunday dates from records and defaults, sorted descending (most recent first)
 */
export function getAllSundayDates(presences: CultePresenceRecord[] = []): string[] {
  const datesSet = new Set<string>(KNOWN_SUNDAYS);
  presences.forEach((p) => {
    if (p.dateDimanche) datesSet.add(p.dateDimanche);
  });
  return Array.from(datesSet).sort((a, b) => b.localeCompare(a));
}

/**
 * Normalise string for safe name comparison
 */
export function normalizeText(text: string = ''): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Checks if a presence record matches a given tribe member
 */
export function doesPresenceMatchMember(
  presence: CultePresenceRecord,
  member: TribeMember
): boolean {
  if (presence.memberId && presence.memberId === member.id) return true;
  if (presence.telephone && member.numero) {
    const cleanPresPhone = presence.telephone.replace(/[^0-9]/g, '');
    const cleanMemPhone = member.numero.replace(/[^0-9]/g, '');
    if (cleanPresPhone && cleanMemPhone && cleanPresPhone === cleanMemPhone) {
      return true;
    }
  }
  const matchNom =
    normalizeText(presence.nom) === normalizeText(member.nom) &&
    normalizeText(presence.prenom) === normalizeText(member.prenom);
  return matchNom;
}

/**
 * Get all attendance records for a specific member
 */
export function getMemberPresenceRecords(
  member: TribeMember,
  presences: CultePresenceRecord[] = []
): CultePresenceRecord[] {
  return presences.filter((p) => doesPresenceMatchMember(p, member));
}

/**
 * Check if a member is confirmed present on a given date (and optionally specific service)
 */
export function isMemberPresentOnSunday(
  member: TribeMember,
  dateDimanche: string,
  presences: CultePresenceRecord[] = [],
  culteFilter?: 'TOUS' | CulteServiceType
): boolean {
  return presences.some((p) => {
    if (p.dateDimanche !== dateDimanche) return false;
    if (culteFilter && culteFilter !== 'TOUS' && p.culte !== culteFilter) return false;
    return doesPresenceMatchMember(p, member);
  });
}

/**
 * Get the specific record for a member on a date
 */
export function getMemberRecordOnSunday(
  member: TribeMember,
  dateDimanche: string,
  presences: CultePresenceRecord[] = []
): CultePresenceRecord | undefined {
  return presences.find(
    (p) => p.dateDimanche === dateDimanche && doesPresenceMatchMember(p, member)
  );
}

/**
 * Find the most recent date a member attended church
 */
export function getMemberLastAttendance(
  member: TribeMember,
  presences: CultePresenceRecord[] = []
): CultePresenceRecord | null {
  const memberRecords = getMemberPresenceRecords(member, presences);
  if (memberRecords.length === 0) return null;
  const sorted = [...memberRecords].sort((a, b) => b.dateDimanche.localeCompare(a.dateDimanche));
  return sorted[0];
}

export type MemberAssiduityStatus =
  | 'REGULIER' // Présent au culte récent
  | 'ABSENT_1_DIMANCHE' // Absent seulement au dernier culte
  | 'ABSENT_2_DIMANCHES' // Absent depuis 2 dimanches consécutifs
  | 'ABSENT_PROLONGE' // Absent depuis 3 dimanches consécutifs ou plus
  | 'JAMAIS_POINTE'; // Jamais pointé aux cultes enregistrés

export interface MemberAssiduityProfile {
  member: TribeMember;
  status: MemberAssiduityStatus;
  consecutiveAbsencesCount: number;
  lastPresence: CultePresenceRecord | null;
  totalPresencesCount: number;
  isChronicAbsent: boolean; // Absent depuis un moment (2 dimanches ou plus, ou jamais venu)
  statusLabel: string;
  badgeBg: string;
  badgeTextColor: string;
}

/**
 * Compute the complete assiduity profile for a member across all Sundays
 */
export function computeMemberAssiduity(
  member: TribeMember,
  presences: CultePresenceRecord[] = [],
  referenceSundays: string[] = KNOWN_SUNDAYS
): MemberAssiduityProfile {
  const memberRecords = getMemberPresenceRecords(member, presences);
  const totalPresencesCount = memberRecords.length;
  const lastPresence = getMemberLastAttendance(member, presences);

  // Count consecutive absences from the most recent Sunday backwards
  let consecutiveAbsencesCount = 0;
  for (const sunday of referenceSundays) {
    const isPresent = isMemberPresentOnSunday(member, sunday, presences);
    if (!isPresent) {
      consecutiveAbsencesCount++;
    } else {
      // Once we find a Sunday where they were present, stop counting consecutive absences
      break;
    }
  }

  let status: MemberAssiduityStatus = 'REGULIER';
  let statusLabel = 'Fidèle & Présent';
  let badgeBg = 'bg-emerald-100';
  let badgeTextColor = 'text-emerald-900';
  let isChronicAbsent = false;

  if (totalPresencesCount === 0) {
    status = 'JAMAIS_POINTE';
    statusLabel = 'Aucun pointage récent';
    badgeBg = 'bg-rose-100';
    badgeTextColor = 'text-rose-900';
    isChronicAbsent = true;
  } else if (consecutiveAbsencesCount === 0) {
    status = 'REGULIER';
    statusLabel = 'Présent au dernier culte';
    badgeBg = 'bg-emerald-100';
    badgeTextColor = 'text-emerald-900';
    isChronicAbsent = false;
  } else if (consecutiveAbsencesCount === 1) {
    status = 'ABSENT_1_DIMANCHE';
    statusLabel = 'Absent ce dimanche';
    badgeBg = 'bg-amber-100';
    badgeTextColor = 'text-amber-900';
    isChronicAbsent = false;
  } else if (consecutiveAbsencesCount === 2) {
    status = 'ABSENT_2_DIMANCHES';
    statusLabel = 'Absent depuis 2 dimanches';
    badgeBg = 'bg-orange-100';
    badgeTextColor = 'text-orange-900';
    isChronicAbsent = true;
  } else {
    status = 'ABSENT_PROLONGE';
    statusLabel = `Absent depuis ${consecutiveAbsencesCount} dimanches`;
    badgeBg = 'bg-red-100';
    badgeTextColor = 'text-red-900';
    isChronicAbsent = true;
  }

  return {
    member,
    status,
    consecutiveAbsencesCount,
    lastPresence,
    totalPresencesCount,
    isChronicAbsent,
    statusLabel,
    badgeBg,
    badgeTextColor,
  };
}

/**
 * Generate a personalized pastoral WhatsApp follow-up link
 */
export function generatePastoralWhatsAppLink(
  member: TribeMember,
  tribeName: string,
  type: 'DIMANCHE_ABSENT' | 'ABSENT_PROLONGE' | 'ENCOURAGEMENT',
  selectedDate?: string
): string {
  const cleanPhone = member.numero.replace(/[^0-9]/g, '');
  let dateFr = '';
  if (selectedDate) {
    try {
      dateFr = new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
      });
    } catch {
      dateFr = selectedDate;
    }
  }

  let text = '';
  if (type === 'ABSENT_PROLONGE') {
    text =
      `🕊️ *Shalom bien-aimé(e) ${member.prenom} !*\n\n` +
      `C'est le Bureau Pastoral de l'Église Vases d'Honneur (Tribu de ${tribeName}).\n\n` +
      `Cela fait quelques dimanches que nous n'avons pas eu la joie de vous voir au milieu du peuple de Dieu. Vous êtes une pierre précieuse pour le Corps de Christ et toute la communauté a pensé à vous avec amour.\n\n` +
      `Nous prions que la paix et la santé de Dieu reposent sur vous et votre famille. Y a-t-il un sujet de prière particulier, une difficulté ou un besoin d'accompagnement pastoral pour lequel nous pouvons nous tenir avec vous ?\n\n` +
      `Donnez-nous de vos nouvelles, le Seigneur vous aime et veille sur vous ! 🙏`;
  } else if (type === 'DIMANCHE_ABSENT') {
    text =
      `🕊️ *Shalom bien-aimé(e) ${member.prenom} !*\n\n` +
      `C'est votre église Vases d'Honneur (Tribu de ${tribeName}).\n\n` +
      `Nous avons remarqué votre absence au culte ${dateFr ? `du dimanche ${dateFr}` : 'de ce dimanche'}. Votre place était vide et vous nous avez beaucoup manqué !\n\n` +
      `Nous espérons de tout cœur que tout va bien pour vous. Que la grâce du Seigneur Jésus-Christ vous comble en cette nouvelle semaine. À très bientôt dans la maison de Dieu ! ❤️`;
  } else {
    text =
      `🕊️ *Shalom bien-aimé(e) ${member.prenom} !*\n\n` +
      `Une pensée fraternelle et une prière de bénédiction pour vous depuis votre Tribu de ${tribeName} (Vases d'Honneur).\n` +
      `« Que l'Éternel te bénisse et te garde ! » Passez une excellente semaine dans la paix du Christ.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate a fraternal Tribe Leader WhatsApp link
 */
export function generateTribeLeaderWhatsAppLink(
  member: TribeMember,
  tribe: TribeInfo,
  type: 'ABSENT_DIMANCHE' | 'ABSENT_PROLONGE'
): string {
  const cleanPhone = member.numero.replace(/[^0-9]/g, '');
  const leaderTitle = tribe.leader?.title || 'Patriarche / Matriarche';
  const leaderName = tribe.leader ? `${tribe.leader.prenom} ${tribe.leader.nom}` : '';

  let text = '';
  if (type === 'ABSENT_PROLONGE') {
    text =
      `👑 *Shalom frère / sœur ${member.prenom} !*\n\n` +
      `C'est votre famille de la *Tribu de ${tribe.name}* (${leaderTitle} ${leaderName}).\n\n` +
      `Nous remarquons que cela fait plusieurs dimanches que vous n'avez pas pu vous joindre à nous pour célébrer le Seigneur au temple.\n\n` +
      `Dans notre tribu, aucun membre n'est oublié ni délaissé. Nous souhaitons prendre de vos nouvelles et savoir comment vous vous portez. Seriez-vous disponible pour une visite fraternelle ou un appel de prière ?\n\n` +
      `Nous vous embrassons dans l'amour du Seigneur Jésus !`;
  } else {
    text =
      `👑 *Shalom cher(e) ${member.prenom} !*\n\n` +
      `C'est votre famille de la *Tribu de ${tribe.name}*.\n\n` +
      `Tu n'as pas pu être avec nous au culte ce dimanche et tu as beaucoup manqué à la tribu ! On espère que tout va bien chez toi.\n\n` +
      `Prends soin de toi et excellente semaine sous la protection divine !`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
