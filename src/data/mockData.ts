

export const STUDENT = {
  name: 'Awa Ndiaye',
  first: 'Awa',
  id: 'ETU-5821',
  promo: 'Master 1 · 2026',
  balance: 24500,
  num: '5821 04XX 7799 01',
};

export interface Transaction {
  id: number;
  cat: string;
  icon: string;
  label: string;
  amount: number;
  when: string;
  day: string;
}

export const TXNS: Transaction[] = [
  { id: 1, cat: 'Cafétéria', icon: 'fork', label: 'Déjeuner — Menu campus', amount: -1250, when: "Aujourd'hui · 12:42", day: "Aujourd'hui" },
  { id: 2, cat: 'Transport', icon: 'bus', label: 'Navette — Campus → Centre', amount: -150, when: "Aujourd'hui · 08:05", day: "Aujourd'hui" },
  { id: 3, cat: 'Rechargement', icon: 'plus', label: 'Orange Money', amount: 10000, when: 'Hier · 19:20', day: 'Hier' },
  { id: 4, cat: 'Cafétéria', icon: 'fork', label: 'Café + viennoiserie', amount: -600, when: 'Hier · 10:14', day: 'Hier' },
  { id: 5, cat: 'Bibliothèque', icon: 'book', label: 'Prêt — 2 ouvrages', amount: 0, when: 'Hier · 15:30', day: 'Hier' },
  { id: 6, cat: 'Transport', icon: 'bus', label: 'Navette — retour', amount: -150, when: 'Hier · 18:40', day: 'Hier' },
  { id: 7, cat: 'Cafétéria', icon: 'fork', label: 'Déjeuner — Menu campus', amount: -1250, when: 'Lun. 26 · 12:30', day: 'Cette semaine' },
  { id: 8, cat: 'Rechargement', icon: 'plus', label: 'Wave', amount: 5000, when: 'Lun. 26 · 09:00', day: 'Cette semaine' },
];

export interface ScheduleItem {
  time: string;
  course: string;
  room: string;
  status: 'present' | 'upcoming';
}

export const SCHEDULE: ScheduleItem[] = [
  { time: '08:00', course: 'Algorithmique avancée', room: 'Amphi A', status: 'present' },
  { time: '10:00', course: 'Bases de données', room: 'Salle 204', status: 'present' },
  { time: '14:00', course: 'Réseaux & IoT', room: 'Labo 3', status: 'upcoming' },
  { time: '16:00', course: 'Anglais technique', room: 'Salle 110', status: 'upcoming' },
];

export interface AccessEntry {
  place: string;
  when: string;
  ok: boolean;
}

export const ACCESS_LOG: AccessEntry[] = [
  { place: 'Bâtiment B — Entrée', when: "Aujourd'hui · 09:02", ok: true },
  { place: 'Bibliothèque centrale', when: 'Hier · 15:30', ok: true },
  { place: 'Labo 3 — Réseaux', when: 'Hier · 14:05', ok: true },
  { place: 'Parking étudiant', when: 'Lun. 26 · 08:40', ok: true },
];

export const CAT_TINT: Record<string, string> = {
  Cafétéria: 'brown',
  Transport: 'olive',
  Bibliothèque: 'blue',
  Rechargement: 'ok',
};

// ── Admin data ────────────────────────────────────────────

export interface Alert {
  sev: 'Critique' | 'Élevée' | 'Moyenne' | 'Faible';
  type: string;
  who: string;
  id: string;
  loc: string;
  when: string;
  note: string;
}

export const ALERTS: Alert[] = [
  { sev: 'Critique', type: 'Clonage de carte suspecté', who: 'Moussa Sow', id: 'ETU-4471', loc: 'Terminal cafétéria #3', when: 'il y a 4 min', note: "Deux usages de la même carte à 2 km d'écart en 90 s." },
  { sev: 'Élevée', type: 'Accès simultané anormal', who: 'Fatou Ba', id: 'ETU-2208', loc: 'Bât. B & Labo 3', when: 'il y a 22 min', note: 'Badge détecté dans deux zones en même temps.' },
  { sev: 'Moyenne', type: 'Double paiement détecté', who: 'Awa Ndiaye', id: 'ETU-5821', loc: 'Navette campus', when: 'il y a 1 h', note: 'Deux débits identiques en 3 s — remboursement auto.' },
  { sev: 'Faible', type: 'Tentative hors plafond', who: 'Ibrahima Diop', id: 'ETU-3390', loc: 'Cafétéria', when: 'il y a 2 h', note: 'Paiement refusé : plafond journalier atteint.' },
];

export interface StudentRecord {
  name: string;
  id: string;
  cls: string;
  status: 'Active' | 'Bloquée' | 'En attente';
  bal: number;
  last: string;
}

export const STUDENTS_DATA: StudentRecord[] = [
  { name: 'Awa Ndiaye', id: 'ETU-5821', cls: 'Master 1', status: 'Active', bal: 24500, last: 'il y a 5 min' },
  { name: 'Moussa Sow', id: 'ETU-4471', cls: 'Licence 3', status: 'Bloquée', bal: 1200, last: 'il y a 4 min' },
  { name: 'Fatou Ba', id: 'ETU-2208', cls: 'Master 2', status: 'Active', bal: 8750, last: 'il y a 22 min' },
  { name: 'Ibrahima Diop', id: 'ETU-3390', cls: 'Licence 2', status: 'Active', bal: 540, last: 'il y a 2 h' },
  { name: 'Aïcha Fall', id: 'ETU-6012', cls: 'Master 1', status: 'Active', bal: 33100, last: 'hier' },
  { name: 'Cheikh Diallo', id: 'ETU-1187', cls: 'Licence 1', status: 'En attente', bal: 0, last: '—' },
];

export interface FeedItem {
  svc: string;
  icon: string;
  label: string;
  who: string;
  amount: number;
  when: string;
  tint: string;
  bad?: boolean;
}

export const FEED: FeedItem[] = [
  { svc: 'Cafétéria', icon: 'fork', label: 'Paiement — Menu campus', who: 'A. Ndiaye', amount: -1250, when: '12:42:18', tint: 'brown' },
  { svc: 'Accès', icon: 'home', label: 'Bât. B — Entrée autorisée', who: 'F. Ba', amount: 0, when: '12:41:55', tint: 'olive' },
  { svc: 'Transport', icon: 'bus', label: 'Navette — Validation', who: 'I. Diop', amount: -150, when: '12:41:30', tint: 'blue' },
  { svc: 'Bibliothèque', icon: 'book', label: 'Prêt — 1 ouvrage', who: 'A. Fall', amount: 0, when: '12:40:12', tint: 'gold' },
  { svc: 'Cafétéria', icon: 'fork', label: 'Paiement refusé — plafond', who: 'I. Diop', amount: 0, when: '12:39:48', tint: 'danger', bad: true },
  { svc: 'Rechargement', icon: 'plus', label: 'Wave — Crédit', who: 'A. Ndiaye', amount: 5000, when: '12:38:05', tint: 'ok' },
];

export interface Zone {
  name: string;
  now: number;
  cap: number;
}

export const ZONES: Zone[] = [
  { name: 'Bâtiment B', now: 142, cap: 200 },
  { name: 'Bibliothèque', now: 88, cap: 120 },
  { name: 'Cafétéria', now: 210, cap: 250 },
  { name: 'Labo 3 — Réseaux', now: 24, cap: 40 },
];
