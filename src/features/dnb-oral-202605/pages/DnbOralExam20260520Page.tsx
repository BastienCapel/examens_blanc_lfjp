import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type TabKey = "candidats" | "jures" | "grille";
type SortDirection = "asc" | "desc";

const EXAM_DATE = "2026-05-20";
const OFFICIAL_GRID_URL =
  "https://drive.google.com/file/d/1EvPaUjTP5f8rT0Rbb5wbYU-pK0JPLgLc/view?usp=drive_link";
const LOGO_URL = "https://i.imgur.com/0YmGlXO.png";
const SIGNATURE_URL = "https://i.imgur.com/77DP4od.png";

const CANDIDATE_COLUMNS = [
  "Élève",
  "Classe",
  "Parcours",
  "Problématique",
  "Discipline_1",
  "Discipline_2",
  "Anglais",
  "Espagnol",
  "Juré_1",
  "Juré_2",
  "Heure de convocation",
] as const;
type CandidateColumn = (typeof CANDIDATE_COLUMNS)[number];

const JURY_COLUMNS = [
  "Juré",
  "Heure",
  "Candidat",
  "Classe",
  "Problématique",
  "Discipline_1",
  "Discipline_2",
  "Langue",
] as const;
type JuryColumn = (typeof JURY_COLUMNS)[number];

type Candidate = {
  id: string;
  student: string;
  className: string;
  pathway: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  english: boolean;
  spanish: boolean;
  juror1: string;
  juror2: string;
  time: string;
  date: string;
  room: string;
};

type JuryViewRow = {
  id: string;
  juror: string;
  time: string;
  student: string;
  className: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  language: string;
  date: string;
  room: string;
};

type FilterState = {
  search: string;
  date: string;
  room: string;
  jury: string;
  className: string;
  discipline1: string;
  discipline2: string;
  timeFrom: string;
  timeTo: string;
};

type SortRule = { column: string; direction: SortDirection };

type RawRow = {
  student: string;
  className: string;
  pathway: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  english: boolean;
  spanish: boolean;
  juror1: string;
  juror2: string;
  time: string;
  room: string;
};

const RAW_ROWS: RawRow[] = [
  { student: "AUBRY Albert Akoi Agamemnon", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Anglais", english: true, spanish: false, juror1: "Vincent David", juror2: "François Faye", time: "11:00", room: "Salle 1" },
  { student: "BA Abygaëlle Bilel", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Olivier Baritou", juror2: "Layla Jaït", time: "11:00", room: "Salle 2" },
  { student: "BERGOT Mathieu Yohan", className: "", pathway: "", problematic: "", discipline1: "EPS", discipline2: "Aucune", english: false, spanish: false, juror1: "Alassane Ndiaye", juror2: "Claire Drame", time: "11:00", room: "Salle 3" },
  { student: "CHARAT Joséphine Awa Michele", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "HGEMC", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Mathilde Michon Guillaume", time: "11:00", room: "Salle 4" },
  { student: "D’ALMEIDA Asha", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Nafissatou Fall", juror2: "Elizabeth Porter", time: "11:00", room: "Salle 5" },
  { student: "BODELOT Julien Achille", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "11:30", room: "Salle 4" },
  { student: "BOUYER Louis Marie", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Vincent David", juror2: "Alassane Ndiaye", time: "11:30", room: "Salle 1" },
  { student: "DEMANGE Laura Sokhna", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Claire Bossu", juror2: "Fanelly Mourain Diop", time: "11:30", room: "Salle 2" },
  { student: "DIAGNE Ndeye Awa", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Aucune", english: false, spanish: false, juror1: "Yvon Thomas", juror2: "Alain Gomis", time: "11:30", room: "Salle 3" },
  { student: "DIALLO Djibril", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "François Faye", time: "11:30", room: "Salle 5" },
  { student: "DE GAIGNERON JOLLIMON DEMAROLLES Pétronille", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Roselyne D’Aquino", time: "12:00", room: "Salle 1" },
  { student: "DIALLO Ibrahima Sory", className: "", pathway: "", problematic: "", discipline1: "EPS", discipline2: "HGEMC", english: false, spanish: false, juror1: "Claire Drame", juror2: "Claire Bossu", time: "12:00", room: "Salle 3" },
  { student: "DIENG Aïssatou", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Espagnol", english: false, spanish: true, juror1: "Yvon Thomas", juror2: "Fernando Piaggio", time: "12:00", room: "Salle 5" },
  { student: "DIOUF Moussa", className: "", pathway: "", problematic: "", discipline1: "Technologie", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Frayon", juror2: "Elizabeth Porter", time: "12:00", room: "Salle 4" },
  { student: "FROUART Mia Tiara", className: "", pathway: "", problematic: "", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "Layla Jaït", time: "12:00", room: "Salle 2" },
  { student: "DIEYE Awa Cheikh", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Claire Bossu", juror2: "Layla Jaït", time: "12:30", room: "Salle 3" },
  { student: "DIOP Oumou", className: "", pathway: "", problematic: "", discipline1: "Arts Plastiques", discipline2: "HGEMC", english: false, spanish: false, juror1: "Eve Capel", juror2: "Yvon Thomas", time: "12:30", room: "Salle 2" },
  { student: "FALL Adji Magatte", className: "", pathway: "", problematic: "", discipline1: "Technologie", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Frayon", juror2: "François Faye", time: "12:30", room: "Salle 4" },
  { student: "GAFFARI Sofia", className: "", pathway: "", problematic: "", discipline1: "Orientation", discipline2: "Anglais", english: true, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Elizabeth Porter", time: "12:30", room: "Salle 5" },
  { student: "GALAND Margaux Suzette", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Vincent David", juror2: "Alassane Ndiaye", time: "12:30", room: "Salle 1" },
  { student: "GILLEN Mathieu Louis Pierre", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Aucune", english: false, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "Alain Gomis", time: "13:00", room: "Salle 3" },
  { student: "GLAUDE Manon", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "HGEMC", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Yvon Thomas", time: "13:00", room: "Salle 4" },
  { student: "GRASSAGLIATA Milena", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Français", english: false, spanish: false, juror1: "Vincent David", juror2: "Fanelly Mourain Diop", time: "13:00", room: "Salle 1" },
  { student: "HOUGNON Alexandre Georges", className: "", pathway: "", problematic: "", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "François Faye", time: "13:00", room: "Salle 2" },
  { student: "MARCHESE Howard Giovanni Sédar", className: "", pathway: "", problematic: "", discipline1: "Orientation", discipline2: "Mathématiques", english: false, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Karine Chabert", time: "13:00", room: "Salle 5" },
  { student: "GROS-DUBOIS Daniella Fatoumata", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Espagnol", english: false, spanish: true, juror1: "Nathalie Mboup", juror2: "Amandine Gibus", time: "13:30", room: "Salle 4" },
  { student: "JABER Ali", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Aucune", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Alain Gomis", time: "13:30", room: "Salle 2" },
  { student: "KOUROUMA Marguerite", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Claire Drame", time: "13:30", room: "Salle 1" },
  { student: "MBOUP Adam Fallou", className: "", pathway: "", problematic: "", discipline1: "Technologie", discipline2: "EPS", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Alassane Ndiaye", time: "13:30", room: "Salle 5" },
  { student: "MBOW Aïssatou", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "Elizabeth Porter", time: "13:30", room: "Salle 3" },
  { student: "KANE Souleymane", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Roselyne D’Aquino", time: "14:00", room: "Salle 4" },
  { student: "MARTINEZ Gabriel-Omar Régis", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Français", english: false, spanish: false, juror1: "Vincent David", juror2: "Nafissatou Fall", time: "14:00", room: "Salle 1" },
  { student: "MENCIERE Théophane Sedar", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Aucune", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Alain Gomis", time: "14:00", room: "Salle 2" },
  { student: "MLIK Omar", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "François Faye", time: "14:00", room: "Salle 3" },
  { student: "MOCNIK Léa Absa", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Claire Bossu", juror2: "Elizabeth Porter", time: "14:00", room: "Salle 5" },
  { student: "LE COM Solen", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Alain Gomis", time: "14:30", room: "Salle 4" },
  { student: "LESAINT Samy Amet", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Roselyne D’Aquino", time: "14:30", room: "Salle 1" },
  { student: "MENDY BOSSU Mia Caroline Michele", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "Nafissatou Fall", time: "14:30", room: "Salle 3" },
  { student: "NDIAYE Anna Florence", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Yvon Thomas", juror2: "Layla Jaït", time: "14:30", room: "Salle 5" },
  { student: "NOUHANDO ROD Ezechiel Gildas", className: "", pathway: "", problematic: "", discipline1: "Technologie", discipline2: "Français", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Olivier Baritou", time: "14:30", room: "Salle 2" },
  { student: "LOZES Raphaël André Dominique", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "15:00", room: "Salle 4" },
  { student: "MONTALBANO Nathalie Marie Olga", className: "", pathway: "", problematic: "", discipline1: "Orientation", discipline2: "Espagnol", english: false, spanish: true, juror1: "Roselyne D’Aquino", juror2: "Amandine Gibus", time: "15:00", room: "Salle 2" },
  { student: "NGOM Khady Meissa", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "François Faye", time: "15:00", room: "Salle 5" },
  { student: "NUSS Paulette Thiaba", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Claire Bossu", juror2: "Fanelly Mourain Diop", time: "15:00", room: "Salle 3" },
  { student: "PHILIPPE Paloma Clémence", className: "", pathway: "", problematic: "", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "Elizabeth Porter", time: "15:00", room: "Salle 1" },
  { student: "NDIAYE Soukaïna Dibor", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "15:30", room: "Salle 4" },
  { student: "PEREZ NGOLI Micah Bruno Jean-Jacques", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Orientation", english: false, spanish: false, juror1: "Nafissatou Fall", juror2: "Roselyne D’Aquino", time: "15:30", room: "Salle 2" },
  { student: "PORQUET Yaniss", className: "", pathway: "", problematic: "", discipline1: "Orientation", discipline2: "Physique-Chimie", english: false, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Adama Ndaw", time: "15:30", room: "Salle 5" },
  { student: "REZGANI Yasmine", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Alain Gomis", time: "15:30", room: "Salle 1" },
  { student: "SALL Arona Ababacar Alpha", className: "", pathway: "", problematic: "", discipline1: "EPS", discipline2: "Anglais", english: true, spanish: false, juror1: "Alassane Ndiaye", juror2: "François Faye", time: "15:30", room: "Salle 3" },
  { student: "SAMB Abdou Aziz", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "Orientation", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Roselyne D’Aquino", time: "16:00", room: "Salle 2" },
  { student: "SARR Fatou Bintou", className: "", pathway: "", problematic: "", discipline1: "Éducation musicale", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Diandy", juror2: "Layla Jaït", time: "16:00", room: "Salle 5" },
  { student: "TEBER Nehir", className: "", pathway: "", problematic: "", discipline1: "Technologie", discipline2: "HGEMC", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Yvon Thomas", time: "16:00", room: "Salle 4" },
  { student: "TUNA Melisa", className: "", pathway: "", problematic: "", discipline1: "Français", discipline2: "HGEMC", english: false, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "Claire Bossu", time: "16:00", room: "Salle 3" },
  { student: "VILLAIN Candice Noa", className: "", pathway: "", problematic: "", discipline1: "SVT", discipline2: "Anglais", english: true, spanish: false, juror1: "Nathalie Mboup", juror2: "Elizabeth Porter", time: "16:00", room: "Salle 1" },
  { student: "WONE Aissatou Rahmatoulahi", className: "", pathway: "", problematic: "", discipline1: "Orientation", discipline2: "Anglais", english: true, spanish: false, juror1: "Roselyne D’Aquino", juror2: "François Faye", time: "16:30", room: "Salle 2" },
  { student: "YEROCHEWSKI Yelen Sophie Marie", className: "", pathway: "", problematic: "", discipline1: "HGEMC", discipline2: "Espagnol", english: false, spanish: true, juror1: "Yvon Thomas", juror2: "Fernando Piaggio", time: "16:30", room: "Salle 5" },
];

const normalize = (v: string) => v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return Number.isNaN(h) || Number.isNaN(m) ? -1 : h * 60 + m;
};
const isPresentValue = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const languageFromCandidate = (c: Candidate) => (c.english ? "Anglais" : c.spanish ? "Espagnol" : "");

const candidateToRow = (c: Candidate): Record<CandidateColumn, string> => ({
  Élève: c.student, Classe: c.className, Parcours: c.pathway, Problématique: c.problematic, Discipline_1: c.discipline1, Discipline_2: c.discipline2,
  Anglais: c.english ? "☑" : "", Espagnol: c.spanish ? "☑" : "", Juré_1: c.juror1, Juré_2: c.juror2, "Heure de convocation": c.time,
});
const juryToRow = (j: JuryViewRow): Record<JuryColumn, string> => ({ Juré: j.juror, Heure: j.time, Candidat: j.student, Classe: j.className, Problématique: j.problematic, Discipline_1: j.discipline1, Discipline_2: j.discipline2, Langue: j.language });

const matches = (v: string, q: string) => !q || normalize(v).includes(normalize(q));
const csvExport = (filename: string, headers: string[], rows: string[][]) => {
  const content = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
};

export default function DnbOralExam20260520Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidats");
  const [filters, setFilters] = useState<FilterState>({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });
  const [candidateSortRules, setCandidateSortRules] = useState<SortRule[]>([{ column: "Heure de convocation", direction: "asc" }]);
  const [jurySortRules, setJurySortRules] = useState<SortRule[]>([{ column: "Heure", direction: "asc" }]);

  const candidates = useMemo<Candidate[]>(() => RAW_ROWS.map((row, i) => ({ id: `candidate-${i + 1}`, ...row, date: EXAM_DATE })), []);

  const juryRows = useMemo<JuryViewRow[]>(() => candidates.flatMap((c) => [c.juror1, c.juror2]
    .filter(isPresentValue)
    .map((juror, i) => ({ id: `${c.id}-${i}`, juror, time: c.time, student: c.student, className: c.className, problematic: c.problematic, discipline1: c.discipline1, discipline2: c.discipline2, language: languageFromCandidate(c), date: c.date, room: c.room }))), [candidates]);

  const applyFilters = <T extends { time: string; date: string; room: string }>(items: T[], values: (item: T) => string[], jurors: (item: T) => string[], cls: (item: T) => string, d1: (item: T) => string, d2: (item: T) => string) =>
    items.filter((item) => {
      const globalOk = !filters.search || values(item).some((v) => matches(v, filters.search));
      const juryOk = !filters.jury || jurors(item).some((j) => matches(j, filters.jury));
      const dateOk = !filters.date || item.date === filters.date;
      const roomOk = matches(item.room, filters.room);
      const classOk = matches(cls(item), filters.className);
      const d1Ok = matches(d1(item), filters.discipline1);
      const d2Ok = matches(d2(item), filters.discipline2);
      const t = timeToMinutes(item.time);
      const fromOk = !filters.timeFrom || t >= timeToMinutes(filters.timeFrom);
      const toOk = !filters.timeTo || t <= timeToMinutes(filters.timeTo);
      return globalOk && juryOk && dateOk && roomOk && classOk && d1Ok && d2Ok && fromOk && toOk;
    });

  const sortByRules = <T extends Candidate | JuryViewRow>(items: T[], rules: SortRule[], mapper: (item: T) => Record<string, string>) => [...items].sort((a, b) => {
    for (const rule of rules) {
      const av = mapper(a)[rule.column] ?? ""; const bv = mapper(b)[rule.column] ?? "";
      const cmp = rule.column.toLowerCase().includes("heure") ? timeToMinutes(av) - timeToMinutes(bv) : normalize(av).localeCompare(normalize(bv));
      if (cmp !== 0) return rule.direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  const filteredCandidates = useMemo(() => applyFilters(candidates, (c) => Object.values(candidateToRow(c)), (c) => [c.juror1, c.juror2], (c) => c.className, (c) => c.discipline1, (c) => c.discipline2), [candidates, filters]);
  const filteredJuryRows = useMemo(() => applyFilters(juryRows, (j) => Object.values(juryToRow(j)), (j) => [j.juror], (j) => j.className, (j) => j.discipline1, (j) => j.discipline2), [juryRows, filters]);
  const sortedCandidates = useMemo(() => sortByRules(filteredCandidates, candidateSortRules, candidateToRow), [filteredCandidates, candidateSortRules]);
  const sortedJuryRows = useMemo(() => sortByRules(filteredJuryRows, jurySortRules, juryToRow), [filteredJuryRows, jurySortRules]);

  const resetFilters = () => setFilters({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });
  const addSortRule = (column: string) => activeTab === "candidats"
    ? setCandidateSortRules((r) => [...r, { column, direction: "asc" }])
    : setJurySortRules((r) => [...r, { column, direction: "asc" }]);

  const tableRows =
    activeTab === "candidats"
      ? sortedCandidates.map((c) =>
          CANDIDATE_COLUMNS.map((col) => candidateToRow(c)[col]),
        )
      : sortedJuryRows.map((j) =>
          JURY_COLUMNS.map((col) => juryToRow(j)[col]),
        );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold">Oraux du DNB — 20 mai 2026</h1>
        <section className="rounded-lg border bg-white p-4 text-sm"><h2 className="mb-2 text-base font-semibold">Présentation de l'épreuve</h2><p>Conformément aux textes officiels du Diplôme national du brevet, l'épreuve orale évalue la maîtrise de l'expression orale.</p></section>

        <div className="flex flex-wrap gap-2">{(["candidats", "jures", "grille"] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-blue-600 text-white" : "border bg-white"}`}>{tab === "jures" ? "Jurés" : tab === "grille" ? "Grille d'évaluation" : "Candidats"}</button>)}</div>

        {activeTab !== "grille" && <section className="rounded-lg border bg-white p-4 space-y-3"><div className="grid gap-2 md:grid-cols-4"> <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Recherche globale" className="rounded border px-2 py-1" /> <input type="date" value={filters.date} onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))} className="rounded border px-2 py-1" /> <input value={filters.room} onChange={(e) => setFilters((p) => ({ ...p, room: e.target.value }))} placeholder="Salle" className="rounded border px-2 py-1" /> <input value={filters.jury} onChange={(e) => setFilters((p) => ({ ...p, jury: e.target.value }))} placeholder="Jury" className="rounded border px-2 py-1" /> <input value={filters.className} onChange={(e) => setFilters((p) => ({ ...p, className: e.target.value }))} placeholder="Classe" className="rounded border px-2 py-1" /> <input value={filters.discipline1} onChange={(e) => setFilters((p) => ({ ...p, discipline1: e.target.value }))} placeholder="Discipline 1" className="rounded border px-2 py-1" /> <input value={filters.discipline2} onChange={(e) => setFilters((p) => ({ ...p, discipline2: e.target.value }))} placeholder="Discipline 2" className="rounded border px-2 py-1" /> <div className="flex gap-2"><input type="time" value={filters.timeFrom} onChange={(e) => setFilters((p) => ({ ...p, timeFrom: e.target.value }))} className="rounded border px-2 py-1" /><input type="time" value={filters.timeTo} onChange={(e) => setFilters((p) => ({ ...p, timeTo: e.target.value }))} className="rounded border px-2 py-1" /></div></div>
          <div className="flex flex-wrap gap-2 items-center"><button onClick={resetFilters} className="rounded border px-3 py-1">Réinitialiser filtres</button><span className="text-sm text-slate-600">Résultats: {activeTab === "candidats" ? sortedCandidates.length : sortedJuryRows.length}</span></div>
          <div className="flex flex-wrap gap-2 items-center"><select className="rounded border px-2 py-1" onChange={(e) => e.target.value && addSortRule(e.target.value)} defaultValue=""><option value="">Ajouter règle de tri</option>{(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((c) => <option key={c} value={c}>{c}</option>)}</select>{(activeTab === "candidats" ? candidateSortRules : jurySortRules).map((rule, idx) => <div key={`${rule.column}-${idx}`} className="rounded border px-2 py-1 text-sm flex items-center gap-1"><span>{rule.column}</span><button onClick={() => (activeTab === "candidats" ? setCandidateSortRules((r) => r.map((it, i) => i === idx ? { ...it, direction: it.direction === "asc" ? "desc" : "asc" } : it)) : setJurySortRules((r) => r.map((it, i) => i === idx ? { ...it, direction: it.direction === "asc" ? "desc" : "asc" } : it)))}>{rule.direction === "asc" ? "↑" : "↓"}</button><button onClick={() => (activeTab === "candidats" ? setCandidateSortRules((r) => r.filter((_, i) => i !== idx)) : setJurySortRules((r) => r.filter((_, i) => i !== idx)))}>✕</button></div>)}</div>
        </section>}

        {activeTab === "grille" ? (<section className="rounded-lg border bg-white p-4"><a href={OFFICIAL_GRID_URL} target="_blank" rel="noreferrer" className="text-blue-700 underline">Consulter la grille officielle</a></section>) : (<section className="space-y-2"><div className="flex flex-wrap gap-2"><button onClick={() => csvExport(`dnb-${activeTab}-${EXAM_DATE}.xls`, activeTab === "candidats" ? [...CANDIDATE_COLUMNS] : [...JURY_COLUMNS], tableRows)} className="rounded bg-emerald-600 px-3 py-1 text-white">Exporter (.xls)</button><button onClick={() => window.print()} className="rounded bg-indigo-600 px-3 py-1 text-white">Imprimer convocations (lot)</button></div><div className="overflow-x-auto rounded-lg border bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100"><tr>{(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((column) => <th key={column} className="border-b px-3 py-2">{column}</th>)}</tr></thead><tbody>{tableRows.map((row, idx) => <tr key={idx} className="odd:bg-white even:bg-slate-50">{row.map((cell, cidx) => <td key={cidx} className="border-b px-3 py-2 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
          <div className="hidden print:block">
            {sortedCandidates.map((c) => <article key={`conv-c-${c.id}`} className="break-after-page p-8"><img src={LOGO_URL} alt="LFJP" className="h-12" /><h2 className="mt-2 text-xl font-bold">Convocation candidat</h2><p>{c.student} — {c.className}</p><p>Date: {c.date} | Heure: {c.time} | Salle: {c.room}</p><p>Problématique: {c.problematic}</p><p className="mt-4">Consignes: présence 15 min avant l'horaire. Pièce d'identité obligatoire.</p><img src={SIGNATURE_URL} alt="Signature" className="mt-6 h-12" /></article>)}
            {Array.from(new Set(sortedJuryRows.map((j) => j.juror))).map((juror) => <article key={`conv-j-${juror}`} className="break-after-page p-8"><img src={LOGO_URL} alt="LFJP" className="h-12" /><h2 className="mt-2 text-xl font-bold">Convocation juré</h2><p>{juror}</p><p>Date: {EXAM_DATE}</p><table className="mt-3 w-full text-sm"><thead><tr><th>Heure</th><th>Candidat</th><th>Salle</th><th>Disciplines</th></tr></thead><tbody>{sortedJuryRows.filter((r) => r.juror === juror).map((r) => <tr key={r.id}><td>{r.time}</td><td>{r.student}</td><td>{r.room}</td><td>{r.discipline1} / {r.discipline2}</td></tr>)}</tbody></table><p className="mt-4">Consignes: merci de vous référer à la grille officielle: {OFFICIAL_GRID_URL}</p><img src={SIGNATURE_URL} alt="Signature" className="mt-6 h-12" /></article>)}
          </div>
        </section>)}
      </div>
    </main>
  );
}
