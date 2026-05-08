import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type TabKey = "candidats" | "jures" | "grille";

const EXAM_DATE = "2026-05-20";
const DEFAULT_ROOM = "Salle à confirmer";
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


const ROWS: string[][] = [
  ["AUBRY Albert Akoi Agamemnon", "3EME1", "Parcours santé", "En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?", "SVT", "Anglais", "TRUE", "FALSE", "TRUE", "FALSE", "Vincent David", "François Faye", "11:00"],
  ["BA Abygaëlle Bilel", "3EME2", "Parcours citoyen", "Comment les auteurs africains ont-ils utilisé l'écriture pour afirmeer leur identité?", "Français", "Anglais", "TRUE", "FALSE", "TRUE", "FALSE", "Olivier Baritou", "Layla Jaït", "11:00"],
  ["BERGOT Mathieu Yohan", "3EME2", "Parcours citoyen", "Comment le basket est-il devenu bien plus qu'un sport et s'est-il imposé comme une culture à part entière ?", "EPS", "Aucune", "TRUE", "FALSE", "FALSE", "FALSE", "Alassane Ndiaye", "Claire Drame", "11:00"],
  ["BODELOT Julien Achille", "3EME2", "Parcours santé", "Quels sont les bienfaits de l'activité physique sur la santé ?", "SVT", "EPS", "TRUE", "FALSE", "FALSE", "FALSE", "Nathalie Mboup", "Claire Drame", "11:30"],
  ["BOUYER Louis Marie", "3EME1", "Parcours santé", "En quoi une mauvaise alimentation  influence négativement l'organisme et que faire pour y remédier ?", "SVT", "EPS", "TRUE", "FALSE", "FALSE", "FALSE", "Vincent David", "Alassane Ndiaye", "11:30"],
];

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return Number.isNaN(hours) || Number.isNaN(minutes) ? -1 : hours * 60 + minutes;
};

const asBool = (value: string): boolean => value === "TRUE";

const candidateToRow = (candidate: Candidate): Record<CandidateColumn, string> => ({
  Élève: candidate.student,
  Classe: candidate.className,
  Parcours: candidate.pathway,
  Problématique: candidate.problematic,
  Discipline_1: candidate.discipline1,
  Discipline_2: candidate.discipline2,
  Anglais: candidate.english ? "☑" : "",
  Espagnol: candidate.spanish ? "☑" : "",
  Juré_1: candidate.juror1,
  Juré_2: candidate.juror2,
  "Heure de convocation": candidate.time,
});

const juryToRow = (row: JuryViewRow): Record<JuryColumn, string> => ({
  Juré: row.juror,
  Heure: row.time,
  Candidat: row.student,
  Classe: row.className,
  Problématique: row.problematic,
  Discipline_1: row.discipline1,
  Discipline_2: row.discipline2,
  Langue: row.language,
});

const downloadSpreadsheet = (filename: string, headers: string[], rows: string[][]): void => {
  const content = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function DnbOralExam20260520Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidats");
  const [filters, setFilters] = useState<FilterState>({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });

  const candidates = useMemo<Candidate[]>(() => ROWS.map((row, index) => ({
    id: `candidate-${index + 1}`,
    student: row[0], className: row[1], pathway: row[2], problematic: row[3], discipline1: row[4], discipline2: row[5],
    english: asBool(row[6]), spanish: asBool(row[7]), juror1: row[10], juror2: row[11], time: row[12], date: EXAM_DATE, room: DEFAULT_ROOM,
  })), []);

  const juryRows = useMemo<JuryViewRow[]>(() => candidates.flatMap((c) => [c.juror1, c.juror2].filter(Boolean).map((juror, i) => ({
    id: `${c.id}-${i}`,
    juror,
    time: c.time,
    student: c.student,
    className: c.className,
    problematic: c.problematic,
    discipline1: c.discipline1,
    discipline2: c.discipline2,
    language: c.english ? "Anglais" : c.spanish ? "Espagnol" : "",
    date: c.date,
    room: c.room,
  }))), [candidates]);

  const matchesFilters = (values: string[], date: string, room: string, className: string, discipline1: string, discipline2: string, jurors: string[], time: string): boolean => {
    const searchOk = !filters.search || values.some((v) => normalize(v).includes(normalize(filters.search)));
    const dateOk = !filters.date || date === filters.date;
    const roomOk = !filters.room || normalize(room).includes(normalize(filters.room));
    const classOk = !filters.className || normalize(className).includes(normalize(filters.className));
    const d1Ok = !filters.discipline1 || normalize(discipline1).includes(normalize(filters.discipline1));
    const d2Ok = !filters.discipline2 || normalize(discipline2).includes(normalize(filters.discipline2));
    const juryOk = !filters.jury || jurors.some((j) => normalize(j).includes(normalize(filters.jury)));
    const timeValue = timeToMinutes(time);
    const fromOk = !filters.timeFrom || timeValue >= timeToMinutes(filters.timeFrom);
    const toOk = !filters.timeTo || timeValue <= timeToMinutes(filters.timeTo);
    return searchOk && dateOk && roomOk && classOk && d1Ok && d2Ok && juryOk && fromOk && toOk;
  };

  const filteredCandidates = useMemo(() => candidates.filter((c) => matchesFilters(Object.values(candidateToRow(c)), c.date, c.room, c.className, c.discipline1, c.discipline2, [c.juror1, c.juror2], c.time)), [candidates, filters]);
  const filteredJuryRows = useMemo(() => juryRows.filter((j) => matchesFilters(Object.values(juryToRow(j)), j.date, j.room, j.className, j.discipline1, j.discipline2, [j.juror], j.time)), [juryRows, filters]);

  const resetFilters = () => setFilters({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });

  return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-7xl space-y-4"><Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link><h1 className="text-2xl font-bold">Oraux du DNB — 20 mai 2026</h1><section className="rounded-lg border bg-white p-4 text-sm"><h2 className="mb-2 text-base font-semibold">Présentation de l'épreuve</h2><p>Conformément aux textes officiels du Diplôme national du brevet, l'épreuve orale évalue la maîtrise de l'expression orale.</p></section><div className="flex flex-wrap gap-2">{(["candidats", "jures", "grille"] as const).map((tab)=><button key={tab} type="button" onClick={()=>setActiveTab(tab)} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab===tab?"bg-blue-600 text-white":"border bg-white"}`}>{tab==="jures"?"Jurés":tab==="grille"?"Grille d'évaluation":"Candidats"}</button>)}</div><section className="rounded-lg border bg-white p-4"><div className="grid gap-2 md:grid-cols-4"><input value={filters.search} onChange={(e)=>setFilters((p)=>({...p,search:e.target.value}))} placeholder="Recherche globale" className="rounded border px-2 py-1"/><input type="date" value={filters.date} onChange={(e)=>setFilters((p)=>({...p,date:e.target.value}))} className="rounded border px-2 py-1"/><input value={filters.room} onChange={(e)=>setFilters((p)=>({...p,room:e.target.value}))} placeholder="Salle" className="rounded border px-2 py-1"/><input value={filters.jury} onChange={(e)=>setFilters((p)=>({...p,jury:e.target.value}))} placeholder="Jury" className="rounded border px-2 py-1"/><input value={filters.className} onChange={(e)=>setFilters((p)=>({...p,className:e.target.value}))} placeholder="Classe" className="rounded border px-2 py-1"/><input value={filters.discipline1} onChange={(e)=>setFilters((p)=>({...p,discipline1:e.target.value}))} placeholder="Discipline 1" className="rounded border px-2 py-1"/><input value={filters.discipline2} onChange={(e)=>setFilters((p)=>({...p,discipline2:e.target.value}))} placeholder="Discipline 2" className="rounded border px-2 py-1"/><div className="flex gap-2"><input type="time" value={filters.timeFrom} onChange={(e)=>setFilters((p)=>({...p,timeFrom:e.target.value}))} className="rounded border px-2 py-1"/><input type="time" value={filters.timeTo} onChange={(e)=>setFilters((p)=>({...p,timeTo:e.target.value}))} className="rounded border px-2 py-1"/></div></div><div className="mt-2 flex flex-wrap items-center gap-2"><button type="button" onClick={resetFilters} className="rounded border px-3 py-1">Réinitialiser filtres</button><span className="text-sm text-slate-600">Résultats: {activeTab==="jures"?filteredJuryRows.length:filteredCandidates.length}</span></div></section>{activeTab==="grille"?<section className="rounded-lg border bg-white p-4"><a href={OFFICIAL_GRID_URL} target="_blank" rel="noreferrer" className="text-blue-700 underline">Consulter la grille officielle</a></section>:<section className="space-y-2"><div className="flex gap-2"><button type="button" onClick={()=>downloadSpreadsheet(`dnb-${activeTab}-${EXAM_DATE}.xls`, activeTab==="candidats"?[...CANDIDATE_COLUMNS]:[...JURY_COLUMNS], (activeTab==="candidats"?filteredCandidates.map((c)=>CANDIDATE_COLUMNS.map((col)=>candidateToRow(c)[col])):filteredJuryRows.map((j)=>JURY_COLUMNS.map((col)=>juryToRow(j)[col]))))} className="rounded bg-emerald-600 px-3 py-1 text-white">Exporter (.xls)</button><button type="button" onClick={()=>window.print()} className="rounded bg-indigo-600 px-3 py-1 text-white">Imprimer convocations (lot)</button></div><div className="overflow-x-auto rounded-lg border bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100"><tr>{(activeTab==="candidats"?CANDIDATE_COLUMNS:JURY_COLUMNS).map((column)=><th key={column} className="border-b px-3 py-2">{column}</th>)}</tr></thead><tbody>{(activeTab==="candidats"?filteredCandidates.map((c)=>CANDIDATE_COLUMNS.map((col)=>candidateToRow(c)[col])):filteredJuryRows.map((j)=>JURY_COLUMNS.map((col)=>juryToRow(j)[col]))).map((row,idx)=><tr key={idx} className="odd:bg-white even:bg-slate-50">{row.map((cell,cellIdx)=><td key={cellIdx} className="border-b px-3 py-2 align-top">{cell}</td>)}</tr>)}</tbody></table></div></section>}</div></main>;
}
