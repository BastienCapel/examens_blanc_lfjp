import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type TabKey = "candidats" | "jures" | "grille";
type SortDirection = "asc" | "desc";

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

type CandidateColumn = (typeof CANDIDATE_COLUMNS)[number];
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

type SortRule<T extends string> = {
  column: T;
  direction: SortDirection;
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

const RAW_ROWS: string[][] = [
  ["AUBRY Albert Akoi Agamemnon", "3EME1", "Parcours santé", "En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?", "SVT", "Anglais", "TRUE", "FALSE", "TRUE", "FALSE", "Vincent David", "François Faye", "11:00"],
  ["BA Abygaëlle Bilel", "3EME2", "Parcours citoyen", "Comment les auteurs africains ont-ils utilisé l'écriture pour affirmer leur identité ?", "Français", "Anglais", "TRUE", "FALSE", "TRUE", "FALSE", "Olivier Baritou", "Layla Jaït", "11:00"],
  ["BERGOT Mathieu Yohan", "3EME2", "Parcours citoyen", "Comment le basket est-il devenu une culture à part entière ?", "EPS", "Aucune", "TRUE", "FALSE", "FALSE", "FALSE", "Alassane Ndiaye", "Claire Drame", "11:00"],
  ["BODELOT Julien Achille", "3EME2", "Parcours santé", "Quels sont les bienfaits de l'activité physique sur la santé ?", "SVT", "EPS", "TRUE", "FALSE", "FALSE", "FALSE", "Nathalie Mboup", "Claire Drame", "11:30"],
  ["BOUYER Louis Marie", "3EME1", "Parcours santé", "En quoi une mauvaise alimentation influence l'organisme ?", "SVT", "EPS", "TRUE", "FALSE", "FALSE", "FALSE", "Vincent David", "Alassane Ndiaye", "11:30"],
];

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return -1;
  return hours * 60 + minutes;
};

const asBool = (value: string): boolean => value === "TRUE";

const candidateRowMap = (candidate: Candidate): Record<CandidateColumn, string> => ({
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

const juryRowMap = (juryRow: JuryViewRow): Record<JuryColumn, string> => ({
  Juré: juryRow.juror,
  Heure: juryRow.time,
  Candidat: juryRow.student,
  Classe: juryRow.className,
  Problématique: juryRow.problematic,
  Discipline_1: juryRow.discipline1,
  Discipline_2: juryRow.discipline2,
  Langue: juryRow.language,
});

const compareValues = (left: string, right: string, direction: SortDirection): number => {
  const leftTime = timeToMinutes(left);
  const rightTime = timeToMinutes(right);
  const base = leftTime >= 0 && rightTime >= 0 ? leftTime - rightTime : left.localeCompare(right, "fr");
  return direction === "asc" ? base : -base;
};

function applyMultiSort<T>(
  rows: T[],
  rules: SortRule<string>[],
  getComparable: (row: T, column: string) => string,
): T[] {
  if (!rules.length) return rows;
  return [...rows].sort((a, b) => {
    for (const rule of rules) {
      const cmp = compareValues(getComparable(a, rule.column), getComparable(b, rule.column), rule.direction);
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
}

const toSpreadsheet = (filename: string, headers: string[], rows: string[][]): void => {
  const content = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const renderConvocationsHtml = (candidates: Candidate[], juryRows: JuryViewRow[]): string => {
  const jurors = Array.from(new Set(juryRows.map((j) => j.juror))).sort((a, b) => a.localeCompare(b, "fr"));
  const candidatePages = candidates
    .map(
      (c) => `
      <section class="page">
        <img src="${LOGO_URL}" class="logo" />
        <h2>Convocation candidat</h2>
        <p><strong>Nom :</strong> ${c.student}</p>
        <p><strong>Classe :</strong> ${c.className}</p>
        <p><strong>Date :</strong> ${c.date}</p>
        <p><strong>Heure :</strong> ${c.time}</p>
        <p><strong>Salle :</strong> ${c.room}</p>
        <p><strong>Problématique :</strong> ${c.problematic}</p>
        <p><strong>Consignes :</strong> Présence 15 minutes avant, pièce d'identité et support préparé.</p>
        <img src="${SIGNATURE_URL}" class="signature" />
      </section>`,
    )
    .join("");

  const juryPages = jurors
    .map((juror) => {
      const planning = juryRows
        .filter((row) => row.juror === juror)
        .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
        .map(
          (row) => `<tr><td>${row.time}</td><td>${row.student}</td><td>${row.room}</td><td>${row.discipline1} / ${row.discipline2}</td></tr>`,
        )
        .join("");
      return `
      <section class="page">
        <img src="${LOGO_URL}" class="logo" />
        <h2>Convocation juré</h2>
        <p><strong>Juré :</strong> ${juror}</p>
        <p><strong>Date :</strong> ${EXAM_DATE}</p>
        <p><strong>Consignes :</strong> Merci de respecter les horaires. Grille officielle : <a href="${OFFICIAL_GRID_URL}">${OFFICIAL_GRID_URL}</a></p>
        <table><thead><tr><th>Heure</th><th>Candidat</th><th>Salle</th><th>Disciplines</th></tr></thead><tbody>${planning}</tbody></table>
        <img src="${SIGNATURE_URL}" class="signature" />
      </section>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8" /><style>
    body{font-family:Arial,sans-serif;margin:0}
    .page{page-break-after:always;padding:24px}
    .logo{height:56px}
    .signature{height:48px;margin-top:12px}
    table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px}
  </style></head><body>${candidatePages}${juryPages}</body></html>`;
};

export default function DnbOralExam20260520Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidats");
  const [candidateSortRules, setCandidateSortRules] = useState<SortRule<CandidateColumn>[]>([]);
  const [jurySortRules, setJurySortRules] = useState<SortRule<JuryColumn>[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    date: EXAM_DATE,
    room: "",
    jury: "",
    className: "",
    discipline1: "",
    discipline2: "",
    timeFrom: "",
    timeTo: "",
  });

  const candidates = useMemo<Candidate[]>(
    () =>
      RAW_ROWS.map((row, index) => ({
        id: `candidate-${index + 1}`,
        student: row[0],
        className: row[1],
        pathway: row[2],
        problematic: row[3],
        discipline1: row[4],
        discipline2: row[5],
        english: asBool(row[6]),
        spanish: asBool(row[7]),
        juror1: row[10],
        juror2: row[11],
        time: row[12],
        date: EXAM_DATE,
        room: DEFAULT_ROOM,
      })),
    [],
  );

  const juryRows = useMemo<JuryViewRow[]>(
    () =>
      candidates.flatMap((candidate) =>
        [candidate.juror1, candidate.juror2].map((juror, idx) => ({
          id: `${candidate.id}-jury-${idx}`,
          juror,
          time: candidate.time,
          student: candidate.student,
          className: candidate.className,
          problematic: candidate.problematic,
          discipline1: candidate.discipline1,
          discipline2: candidate.discipline2,
          language: candidate.english ? "Anglais" : candidate.spanish ? "Espagnol" : "",
          date: candidate.date,
          room: candidate.room,
        })),
      ),
    [candidates],
  );

  const filterCandidate = (candidate: Candidate): boolean => {
    const searchPool = Object.values(candidateRowMap(candidate));
    const query = normalize(filters.search);
    const searchOk = !query || searchPool.some((value) => normalize(value).includes(query));
    const dateOk = !filters.date || candidate.date === filters.date;
    const roomOk = !filters.room || normalize(candidate.room).includes(normalize(filters.room));
    const juryOk =
      !filters.jury ||
      normalize(candidate.juror1).includes(normalize(filters.jury)) ||
      normalize(candidate.juror2).includes(normalize(filters.jury));
    const classOk = !filters.className || normalize(candidate.className).includes(normalize(filters.className));
    const d1Ok = !filters.discipline1 || normalize(candidate.discipline1).includes(normalize(filters.discipline1));
    const d2Ok = !filters.discipline2 || normalize(candidate.discipline2).includes(normalize(filters.discipline2));
    const timeValue = timeToMinutes(candidate.time);
    const timeFromOk = !filters.timeFrom || timeValue >= timeToMinutes(filters.timeFrom);
    const timeToOk = !filters.timeTo || timeValue <= timeToMinutes(filters.timeTo);
    return searchOk && dateOk && roomOk && juryOk && classOk && d1Ok && d2Ok && timeFromOk && timeToOk;
  };

  const filterJury = (jury: JuryViewRow): boolean => {
    const searchPool = Object.values(juryRowMap(jury));
    const query = normalize(filters.search);
    const searchOk = !query || searchPool.some((value) => normalize(value).includes(query));
    const dateOk = !filters.date || jury.date === filters.date;
    const roomOk = !filters.room || normalize(jury.room).includes(normalize(filters.room));
    const juryOk = !filters.jury || normalize(jury.juror).includes(normalize(filters.jury));
    const classOk = !filters.className || normalize(jury.className).includes(normalize(filters.className));
    const d1Ok = !filters.discipline1 || normalize(jury.discipline1).includes(normalize(filters.discipline1));
    const d2Ok = !filters.discipline2 || normalize(jury.discipline2).includes(normalize(filters.discipline2));
    const timeValue = timeToMinutes(jury.time);
    const timeFromOk = !filters.timeFrom || timeValue >= timeToMinutes(filters.timeFrom);
    const timeToOk = !filters.timeTo || timeValue <= timeToMinutes(filters.timeTo);
    return searchOk && dateOk && roomOk && juryOk && classOk && d1Ok && d2Ok && timeFromOk && timeToOk;
  };

  const filteredCandidates = useMemo(() => candidates.filter(filterCandidate), [candidates, filters]);
  const filteredJuryRows = useMemo(() => juryRows.filter(filterJury), [juryRows, filters]);

  const sortedCandidates = useMemo(
    () =>
      applyMultiSort(filteredCandidates, candidateSortRules, (row, column) => candidateRowMap(row)[column as CandidateColumn]),
    [filteredCandidates, candidateSortRules],
  );

  const sortedJuryRows = useMemo(
    () => applyMultiSort(filteredJuryRows, jurySortRules, (row, column) => juryRowMap(row)[column as JuryColumn]),
    [filteredJuryRows, jurySortRules],
  );

  const resetFilters = (): void => {
    setFilters({
      search: "",
      date: EXAM_DATE,
      room: "",
      jury: "",
      className: "",
      discipline1: "",
      discipline2: "",
      timeFrom: "",
      timeTo: "",
    });
  };

  const toggleSortRule = <T extends string,>(
    column: T,
    rules: SortRule<T>[],
    setRules: (rules: SortRule<T>[]) => void,
  ): void => {
    const existing = rules.find((rule) => rule.column === column);
    if (!existing) {
      setRules([...rules, { column, direction: "asc" }]);
      return;
    }
    if (existing.direction === "asc") {
      setRules(rules.map((rule) => (rule.column === column ? { ...rule, direction: "desc" } : rule)));
      return;
    }
    setRules(rules.filter((rule) => rule.column !== column));
  };

  const currentCandidateRows = sortedCandidates.map((candidate) =>
    CANDIDATE_COLUMNS.map((col) => candidateRowMap(candidate)[col]),
  );
  const currentJuryRows = sortedJuryRows.map((jury) => JURY_COLUMNS.map((col) => juryRowMap(jury)[col]));

  const printConvocations = (): void => {
    const popup = window.open("", "_blank");
    if (!popup) return;
    popup.document.write(renderConvocationsHtml(sortedCandidates, sortedJuryRows));
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link to="/" className="text-sm text-blue-700 hover:underline">
          ← Retour à l'accueil
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Oraux du DNB — 20 mai 2026</h1>

        <section className="rounded-lg border bg-white p-4 text-sm text-slate-700 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-slate-900">Présentation de l'épreuve</h2>
          <p>
            Conformément aux textes officiels du DNB, l'épreuve orale évalue l'expression orale, la qualité de
            l'argumentation et la capacité à présenter un projet.
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          {([
            ["candidats", "Candidats"],
            ["jures", "Jurés"],
            ["grille", "Grille d'évaluation"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                activeTab === key ? "bg-blue-600 text-white" : "bg-white text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "grille" ? (
          <section className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-700">
              Version officielle :{" "}
              <a href={OFFICIAL_GRID_URL} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                consulter la grille d'évaluation
              </a>
              .
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="grid gap-2 md:grid-cols-4">
                <input className="rounded border px-2 py-1" placeholder="Recherche globale" value={filters.search} onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))} />
                <input className="rounded border px-2 py-1" type="date" value={filters.date} onChange={(e) => setFilters((s) => ({ ...s, date: e.target.value }))} />
                <input className="rounded border px-2 py-1" placeholder="Salle" value={filters.room} onChange={(e) => setFilters((s) => ({ ...s, room: e.target.value }))} />
                <input className="rounded border px-2 py-1" placeholder="Jury" value={filters.jury} onChange={(e) => setFilters((s) => ({ ...s, jury: e.target.value }))} />
                <input className="rounded border px-2 py-1" placeholder="Classe" value={filters.className} onChange={(e) => setFilters((s) => ({ ...s, className: e.target.value }))} />
                <input className="rounded border px-2 py-1" placeholder="Discipline_1" value={filters.discipline1} onChange={(e) => setFilters((s) => ({ ...s, discipline1: e.target.value }))} />
                <input className="rounded border px-2 py-1" placeholder="Discipline_2" value={filters.discipline2} onChange={(e) => setFilters((s) => ({ ...s, discipline2: e.target.value }))} />
                <div className="flex gap-2">
                  <input className="w-full rounded border px-2 py-1" type="time" value={filters.timeFrom} onChange={(e) => setFilters((s) => ({ ...s, timeFrom: e.target.value }))} />
                  <input className="w-full rounded border px-2 py-1" type="time" value={filters.timeTo} onChange={(e) => setFilters((s) => ({ ...s, timeTo: e.target.value }))} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={resetFilters} className="rounded border px-3 py-1">Réinitialiser filtres</button>
                <span className="text-sm text-slate-600">Résultats : {activeTab === "candidats" ? sortedCandidates.length : sortedJuryRows.length}</span>
                <button type="button" onClick={printConvocations} className="rounded bg-indigo-600 px-3 py-1 text-white">Imprimer convocations (lot)</button>
                <button
                  type="button"
                  onClick={() =>
                    toSpreadsheet(
                      `dnb-oral-${activeTab}-${EXAM_DATE}.xls`,
                      activeTab === "candidats" ? [...CANDIDATE_COLUMNS] : [...JURY_COLUMNS],
                      activeTab === "candidats" ? currentCandidateRows : currentJuryRows,
                    )
                  }
                  className="rounded bg-emerald-600 px-3 py-1 text-white"
                >
                  Exporter (.xls)
                </button>
              </div>
            </section>

            <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    {(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((column) => (
                      <th key={column} className="whitespace-nowrap border-b px-3 py-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1"
                          onClick={() =>
                            activeTab === "candidats"
                              ? toggleSortRule(column as CandidateColumn, candidateSortRules, setCandidateSortRules)
                              : toggleSortRule(column as JuryColumn, jurySortRules, setJurySortRules)
                          }
                        >
                          {column}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "candidats" ? currentCandidateRows : currentJuryRows).map((row, index) => (
                    <tr key={`${row[0]}-${index}`} className="odd:bg-white even:bg-slate-50">
                      {row.map((cell, cellIndex) => (
                        <td key={`${index}-${cellIndex}`} className="align-top border-b px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
