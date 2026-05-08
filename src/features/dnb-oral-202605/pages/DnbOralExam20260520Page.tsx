import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

const ROWS: string[][] = [
  ["AUBRY Albert Akoi Agamemnon", "3EME1", "Parcours santé", "En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?", "SVT", "Anglais", "TRUE", "FALSE", "Vincent David", "François Faye", "11:00"],
  ["BA Abygaëlle Bilel", "3EME2", "Parcours citoyen", "Comment les auteurs africains ont-ils utilisé l'écriture pour afirmeer leur identité?", "Français", "Anglais", "TRUE", "FALSE", "Olivier Baritou", "Layla Jaït", "11:00"],
  ["BERGOT Mathieu Yohan", "3EME2", "Parcours citoyen", "Comment le basket est-il devenu bien plus qu'un sport et s'est-il imposé comme une culture à part entière ?", "EPS", "Aucune", "TRUE", "FALSE", "Alassane Ndiaye", "Claire Drame", "11:00"],
  ["BODELOT Julien Achille", "3EME2", "Parcours santé", "Quels sont les bienfaits de l'activité physique sur la santé ?", "SVT", "EPS", "TRUE", "FALSE", "Nathalie Mboup", "Claire Drame", "11:00"],
];

const JURY_COLUMNS = ["Juré", "Heure", "Candidat", "Classe", "Problématique", "Discipline_1", "Discipline_2", "Langue"] as const;

type TabKey = "candidats" | "jures" | "grille";
type SortDirection = "asc" | "desc";
type SortRule = { key: string; direction: SortDirection };

const normalizeText = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const mapCandidate = (row: string[]) => ({
  eleve: row[0], classe: row[1], parcours: row[2], problematique: row[3], discipline1: row[4], discipline2: row[5], anglais: row[6] === "TRUE", espagnol: row[7] === "TRUE", jure1: row[8], jure2: row[9], heure: row[10], date: "2026-05-20", salle: "À préciser",
});

export default function DnbOralExam20260520Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidats");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("2026-05-20");
  const [roomFilter, setRoomFilter] = useState("all");
  const [juryFilter, setJuryFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [discipline1Filter, setDiscipline1Filter] = useState("all");
  const [discipline2Filter, setDiscipline2Filter] = useState("all");
  const [hourFrom, setHourFrom] = useState("");
  const [hourTo, setHourTo] = useState("");
  const [sortRules, setSortRules] = useState<SortRule[]>([{ key: "heure", direction: "asc" }]);

  const candidateObjects = useMemo(() => ROWS.map(mapCandidate), []);
  const juryObjects = useMemo(() => candidateObjects.flatMap((row) => {
    const language = row.anglais ? "Anglais" : row.espagnol ? "Espagnol" : "";
    return [row.jure1, row.jure2].map((jury) => ({ jure: jury, heure: row.heure, candidat: row.eleve, classe: row.classe, problematique: row.problematique, discipline1: row.discipline1, discipline2: row.discipline2, langue: language, date: row.date, salle: row.salle }));
  }), [candidateObjects]);

  const selectable = useMemo(() => ({
    rooms: Array.from(new Set(candidateObjects.map((r) => r.salle))).sort(),
    juries: Array.from(new Set(candidateObjects.flatMap((r) => [r.jure1, r.jure2]))).sort((a, b) => a.localeCompare(b, "fr")),
    classes: Array.from(new Set(candidateObjects.map((r) => r.classe))).sort(),
    disciplines1: Array.from(new Set(candidateObjects.map((r) => r.discipline1))).sort(),
    disciplines2: Array.from(new Set(candidateObjects.map((r) => r.discipline2))).sort(),
  }), [candidateObjects]);

  const filteredCandidates = useMemo(() => candidateObjects.filter((row) => {
    const nq = normalizeText(search);
    if (dateFilter && row.date !== dateFilter) return false;
    if (roomFilter !== "all" && row.salle !== roomFilter) return false;
    if (juryFilter !== "all" && row.jure1 !== juryFilter && row.jure2 !== juryFilter) return false;
    if (classFilter !== "all" && row.classe !== classFilter) return false;
    if (discipline1Filter !== "all" && row.discipline1 !== discipline1Filter) return false;
    if (discipline2Filter !== "all" && row.discipline2 !== discipline2Filter) return false;
    if (hourFrom && row.heure < hourFrom) return false;
    if (hourTo && row.heure > hourTo) return false;
    if (!nq) return true;
    return normalizeText(Object.values(row).join(" ")).includes(nq);
  }), [candidateObjects, classFilter, dateFilter, discipline1Filter, discipline2Filter, hourFrom, hourTo, juryFilter, roomFilter, search]);

  const filteredJuryRows = useMemo(() => juryObjects.filter((row) => {
    const nq = normalizeText(search);
    if (dateFilter && row.date !== dateFilter) return false;
    if (roomFilter !== "all" && row.salle !== roomFilter) return false;
    if (juryFilter !== "all" && row.jure !== juryFilter) return false;
    if (classFilter !== "all" && row.classe !== classFilter) return false;
    if (discipline1Filter !== "all" && row.discipline1 !== discipline1Filter) return false;
    if (discipline2Filter !== "all" && row.discipline2 !== discipline2Filter) return false;
    if (hourFrom && row.heure < hourFrom) return false;
    if (hourTo && row.heure > hourTo) return false;
    if (!nq) return true;
    return normalizeText(Object.values(row).join(" ")).includes(nq);
  }), [classFilter, dateFilter, discipline1Filter, discipline2Filter, hourFrom, hourTo, juryFilter, juryObjects, roomFilter, search]);

  const sortRows = <T extends Record<string, unknown>>(rows: T[]) => [...rows].sort((a, b) => {
    for (const rule of sortRules) {
      const av = String(a[rule.key] ?? "");
      const bv = String(b[rule.key] ?? "");
      const cmp = av.localeCompare(bv, "fr", { numeric: true });
      if (cmp) return rule.direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  const sortedCandidates = useMemo(() => sortRows(filteredCandidates), [filteredCandidates, sortRules]);
  const sortedJuryRows = useMemo(() => sortRows(filteredJuryRows), [filteredJuryRows, sortRules]);

  const currentRows = activeTab === "candidats" ? sortedCandidates : sortedJuryRows;

  return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-7xl space-y-4">
    <Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link>
    <h1 className="text-2xl font-bold text-slate-900">Oraux du DNB — 20 mai 2026</h1>

    <section className="rounded-lg border bg-white p-4 text-sm text-slate-700 shadow-sm">
      <h2 className="mb-2 text-base font-semibold text-slate-900">Présentation de l'épreuve</h2>
      <p>Conformément aux textes officiels du Diplôme national du brevet, l'épreuve orale évalue la maîtrise de l'expression orale.</p>
    </section>

    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => setActiveTab("candidats")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "candidats" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"}`}>Candidats</button>
      <button type="button" onClick={() => setActiveTab("jures")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "jures" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"}`}>Jurés</button>
      <button type="button" onClick={() => setActiveTab("grille")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "grille" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"}`}>Grille d'évaluation</button>
      {activeTab !== "grille" && <span className="ml-auto text-xs text-slate-500">{currentRows.length} résultat(s)</span>}
    </div>

    {activeTab === "grille" ? <section className="rounded-lg border bg-white p-4 shadow-sm">Grille d'évaluation: <a href="https://drive.google.com/file/d/1EvPaUjTP5f8rT0Rbb5wbYU-pK0JPLgLc/view?usp=drive_link" className="text-blue-700 underline" target="_blank" rel="noreferrer">consulter le document officiel</a>.</section> : <>
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="grid gap-2 md:grid-cols-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recherche globale" className="rounded border px-3 py-2 text-sm" />
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded border px-3 py-2 text-sm" />
          <select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="all">Toutes les salles</option>{selectable.rooms.map((room) => <option key={room} value={room}>{room}</option>)}</select>
          <select value={juryFilter} onChange={(e) => setJuryFilter(e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="all">Tous les jurys</option>{selectable.juries.map((jury) => <option key={jury} value={jury}>{jury}</option>)}</select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="all">Toutes les classes</option>{selectable.classes.map((classe) => <option key={classe} value={classe}>{classe}</option>)}</select>
          <select value={discipline1Filter} onChange={(e) => setDiscipline1Filter(e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="all">Toutes discipline_1</option>{selectable.disciplines1.map((d) => <option key={d} value={d}>{d}</option>)}</select>
          <select value={discipline2Filter} onChange={(e) => setDiscipline2Filter(e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="all">Toutes discipline_2</option>{selectable.disciplines2.map((d) => <option key={d} value={d}>{d}</option>)}</select>
          <div className="flex gap-2"><input type="time" value={hourFrom} onChange={(e) => setHourFrom(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" /><input type="time" value={hourTo} onChange={(e) => setHourTo(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" /></div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100 text-slate-700"><tr>{(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((column) => <th key={column} className="whitespace-nowrap border-b px-3 py-2 font-semibold">{column}</th>)}</tr></thead><tbody>{activeTab === "candidats" ? sortedCandidates.map((row, index) => <tr key={`${row.eleve}-${index}`} className="odd:bg-white even:bg-slate-50"><td className="align-top border-b px-3 py-2">{row.eleve}</td><td className="align-top border-b px-3 py-2">{row.classe}</td><td className="align-top border-b px-3 py-2">{row.parcours}</td><td className="align-top border-b px-3 py-2">{row.problematique}</td><td className="align-top border-b px-3 py-2">{row.discipline1}</td><td className="align-top border-b px-3 py-2">{row.discipline2}</td><td className="align-top border-b px-3 py-2">{row.anglais ? "☑" : ""}</td><td className="align-top border-b px-3 py-2">{row.espagnol ? "☑" : ""}</td><td className="align-top border-b px-3 py-2">{row.jure1}</td><td className="align-top border-b px-3 py-2">{row.jure2}</td><td className="align-top border-b px-3 py-2">{row.heure}</td></tr>) : sortedJuryRows.map((row, index) => <tr key={`${row.jure}-${row.candidat}-${index}`} className="odd:bg-white even:bg-slate-50"><td className="align-top border-b px-3 py-2">{row.jure}</td><td className="align-top border-b px-3 py-2">{row.heure}</td><td className="align-top border-b px-3 py-2">{row.candidat}</td><td className="align-top border-b px-3 py-2">{row.classe}</td><td className="align-top border-b px-3 py-2">{row.problematique}</td><td className="align-top border-b px-3 py-2">{row.discipline1}</td><td className="align-top border-b px-3 py-2">{row.discipline2}</td><td className="align-top border-b px-3 py-2">{row.langue}</td></tr>)}</tbody></table></div>
    </>}
  </div></main>;
}
