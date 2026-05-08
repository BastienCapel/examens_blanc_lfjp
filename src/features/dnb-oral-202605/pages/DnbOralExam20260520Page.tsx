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
  ["AUBRY Albert Akoi Agamemnon","3EME1","Parcours santé","En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?","SVT","Anglais","TRUE","FALSE","Vincent David","François Faye","11:00"] ,
  ["BA Abygaëlle Bilel","3EME2","Parcours citoyen","Comment les auteurs africains ont-ils utilisé l'écriture pour afirmeer leur identité?","Français","Anglais","TRUE","FALSE","Olivier Baritou","Layla Jaït","11:00"] ,
  ["BERGOT Mathieu Yohan","3EME2","Parcours citoyen","Comment le basket est-il devenu bien plus qu'un sport et s'est-il imposé comme une culture à part entière ?","EPS","Aucune","TRUE","FALSE","Alassane Ndiaye","Claire Drame","11:00"] ,
  ["BODELOT Julien Achille","3EME2","Parcours santé","Quels sont les bienfaits de l'activité physique sur la santé ?","SVT","EPS","TRUE","FALSE","Nathalie Mboup","Claire Drame","11:00"] ,
  ["BOUYER Louis Marie","3EME1","Parcours santé","En quoi une mauvaise alimentation  influence négativement l'organisme et que faire pour y remédier ?","SVT","EPS","TRUE","FALSE","Vincent David","Alassane Ndiaye","11:00"] ,
  ["CHARAT Joséphine Awa Michele","3EME2","Parcours santé","Qu'est-ce que  la maladie de l'Alzheimer et en quoi mon expérience personnelle m'a-t-elle donné envie de devenir médecin?","SVT","HGEMC","TRUE","FALSE","Nathalie Mboup","Mathilde Michon Guillaume","11:30"] ,
  ["D'ALMEIDA Asha","3EME2","Parcours citoyen","En quoi Petit Pays de Gaël FAYE montre que la guerre vole bien plus que des vies mais qu'elle vole aussi l'enfance ?","Français","Anglais","TRUE","FALSE","Nafissatou Fall","Elizabeth Porter","11:30"] ,
  ["DE GAIGNERON JOLLIMON DEMAROLLES Pétronille Agnès Louis Marie","3EME1","Parcours santé","En quoi le stress influence-t-il nos résultats scolaires et notre santé ? ","SVT","Aucune","TRUE","FALSE","Vincent David","Roselyne D’Aquino","11:30"] ,
  ["DEMANGE Laura Sokhna","3EME2","Parcours citoyen","Nelson Mandela est-il devenu un symbole mondial de la lutte contre l'injustice et le racisme ?","HGEMC","Français","TRUE","FALSE","Claire Bossu","Fanelly Mourain Diop","11:30"] ,
  ["DIAGNE Ndeye Awa","3EME2","Parcours citoyen","En quoi la traite négrière à durablement marquée l'histoire des populations noires et le monde actuel ?","HGEMC","Aucune","TRUE","FALSE","Yvon Thomas","Alain Gomis","11:30"] ,
];

const JURY_COLUMNS = ["Juré", "Heure", "Candidat", "Classe", "Problématique", "Discipline_1", "Discipline_2", "Langue"] as const;

type TabKey = "candidats" | "jures";
type SortDirection = "asc" | "desc";

type SortRule = { key: string; direction: SortDirection };

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const mapCandidate = (row: string[]) => ({
  eleve: row[0],
  classe: row[1],
  parcours: row[2],
  problematique: row[3],
  discipline1: row[4],
  discipline2: row[5],
  anglais: row[6] === "TRUE",
  espagnol: row[7] === "TRUE",
  jure1: row[8],
  jure2: row[9],
  heure: row[10],
  date: "2026-05-20",
  salle: "À préciser",
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

  const juryObjects = useMemo(
    () =>
      candidateObjects.flatMap((row) => {
        const language = row.anglais ? "Anglais" : row.espagnol ? "Espagnol" : "";
        return [row.jure1, row.jure2].map((jury) => ({
          jure: jury,
          heure: row.heure,
          candidat: row.eleve,
          classe: row.classe,
          problematique: row.problematique,
          discipline1: row.discipline1,
          discipline2: row.discipline2,
          langue: language,
          date: row.date,
          salle: row.salle,
        }));
      }),
    [candidateObjects],
  );

  const selectable = useMemo(() => {
    const rooms = Array.from(new Set(candidateObjects.map((r) => r.salle))).sort();
    const juries = Array.from(new Set(candidateObjects.flatMap((r) => [r.jure1, r.jure2]))).sort((a, b) => a.localeCompare(b, "fr"));
    const classes = Array.from(new Set(candidateObjects.map((r) => r.classe))).sort();
    const disciplines1 = Array.from(new Set(candidateObjects.map((r) => r.discipline1))).sort();
    const disciplines2 = Array.from(new Set(candidateObjects.map((r) => r.discipline2))).sort();

    return { rooms, juries, classes, disciplines1, disciplines2 };
  }, [candidateObjects]);

  const filteredCandidates = useMemo(() => {
    const nq = normalizeText(search);
    return candidateObjects.filter((row) => {
      if (dateFilter && row.date !== dateFilter) return false;
      if (roomFilter !== "all" && row.salle !== roomFilter) return false;
      if (juryFilter !== "all" && row.jure1 !== juryFilter && row.jure2 !== juryFilter) return false;
      if (classFilter !== "all" && row.classe !== classFilter) return false;
      if (discipline1Filter !== "all" && row.discipline1 !== discipline1Filter) return false;
      if (discipline2Filter !== "all" && row.discipline2 !== discipline2Filter) return false;
      if (hourFrom && row.heure < hourFrom) return false;
      if (hourTo && row.heure > hourTo) return false;

      if (!nq) return true;
      const haystack = normalizeText(Object.values(row).join(" "));
      return haystack.includes(nq);
    });
  }, [candidateObjects, classFilter, dateFilter, discipline1Filter, discipline2Filter, hourFrom, hourTo, juryFilter, roomFilter, search]);

  const filteredJuryRows = useMemo(() => {
    const nq = normalizeText(search);
    return juryObjects.filter((row) => {
      if (dateFilter && row.date !== dateFilter) return false;
      if (roomFilter !== "all" && row.salle !== roomFilter) return false;
      if (juryFilter !== "all" && row.jure !== juryFilter) return false;
      if (classFilter !== "all" && row.classe !== classFilter) return false;
      if (discipline1Filter !== "all" && row.discipline1 !== discipline1Filter) return false;
      if (discipline2Filter !== "all" && row.discipline2 !== discipline2Filter) return false;
      if (hourFrom && row.heure < hourFrom) return false;
      if (hourTo && row.heure > hourTo) return false;

      if (!nq) return true;
      const haystack = normalizeText(Object.values(row).join(" "));
      return haystack.includes(nq);
    });
  }, [classFilter, dateFilter, discipline1Filter, discipline2Filter, hourFrom, hourTo, juryFilter, juryObjects, roomFilter, search]);

  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      for (const rule of sortRules) {
        const av = String((a as Record<string, string>)[rule.key] ?? "");
        const bv = String((b as Record<string, string>)[rule.key] ?? "");
        const comparison = av.localeCompare(bv, "fr", { numeric: true });
        if (comparison !== 0) return rule.direction === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }, [filteredCandidates, sortRules]);

  const sortedJuryRows = useMemo(() => {
    return [...filteredJuryRows].sort((a, b) => {
      for (const rule of sortRules) {
        const av = String((a as Record<string, string>)[rule.key] ?? "");
        const bv = String((b as Record<string, string>)[rule.key] ?? "");
        const comparison = av.localeCompare(bv, "fr", { numeric: true });
        if (comparison !== 0) return rule.direction === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }, [filteredJuryRows, sortRules]);

  const updateSort = (index: number, patch: Partial<SortRule>) => {
    setSortRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)));
  };

  const addSortRule = () => setSortRules((prev) => [...prev, { key: "eleve", direction: "asc" }]);

  const removeSortRule = (index: number) => setSortRules((prev) => prev.filter((_, i) => i !== index));

  const resetFilters = () => {
    setSearch("");
    setRoomFilter("all");
    setJuryFilter("all");
    setClassFilter("all");
    setDiscipline1Filter("all");
    setDiscipline2Filter("all");
    setHourFrom("");
    setHourTo("");
  };

  const exportAsXls = () => {
    const dataset = activeTab === "candidats" ? sortedCandidates : sortedJuryRows;
    const headers = activeTab === "candidats"
      ? ["Élève", "Classe", "Parcours", "Problématique", "Discipline_1", "Discipline_2", "Anglais", "Espagnol", "Juré_1", "Juré_2", "Heure", "Date", "Salle"]
      : ["Juré", "Heure", "Candidat", "Classe", "Problématique", "Discipline_1", "Discipline_2", "Langue", "Date", "Salle"];

    const rows = dataset.map((row) =>
      activeTab === "candidats"
        ? [(row as typeof candidateObjects[number]).eleve, (row as typeof candidateObjects[number]).classe, (row as typeof candidateObjects[number]).parcours, (row as typeof candidateObjects[number]).problematique, (row as typeof candidateObjects[number]).discipline1, (row as typeof candidateObjects[number]).discipline2, (row as typeof candidateObjects[number]).anglais ? "Oui" : "", (row as typeof candidateObjects[number]).espagnol ? "Oui" : "", (row as typeof candidateObjects[number]).jure1, (row as typeof candidateObjects[number]).jure2, (row as typeof candidateObjects[number]).heure, (row as typeof candidateObjects[number]).date, (row as typeof candidateObjects[number]).salle]
        : [(row as typeof juryObjects[number]).jure, (row as typeof juryObjects[number]).heure, (row as typeof juryObjects[number]).candidat, (row as typeof juryObjects[number]).classe, (row as typeof juryObjects[number]).problematique, (row as typeof juryObjects[number]).discipline1, (row as typeof juryObjects[number]).discipline2, (row as typeof juryObjects[number]).langue, (row as typeof juryObjects[number]).date, (row as typeof juryObjects[number]).salle],
    );

    const table = [headers, ...rows].map((r) => `<tr>${r.map((cell) => `<td>${String(cell ?? "")}</td>`).join("")}</tr>`).join("");
    const html = `<table>${table}</table>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oraux-dnb-${activeTab}-2026-05-20.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printConvocations = () => {
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) return;

    const pages = activeTab === "candidats"
      ? sortedCandidates.map((s) => `
          <section class="page">
            <img class="logo" src="https://i.imgur.com/0YmGlXO.png" alt="logo" />
            <h1>Convocation – Oral DNB</h1>
            <p><strong>Date :</strong> ${s.date}</p>
            <p><strong>Élève :</strong> ${s.eleve}</p>
            <p><strong>Classe :</strong> ${s.classe}</p>
            <p><strong>Heure :</strong> ${s.heure}</p>
            <p><strong>Salle :</strong> ${s.salle}</p>
            <p><strong>Problématique :</strong> ${s.problematique}</p>
            <p><strong>Consignes :</strong> Merci de vous présenter 15 minutes en avance avec une pièce d'identité.</p>
            <div class="signature-wrap"><img class="signature" src="https://i.imgur.com/77DP4od.png" alt="signature" /></div>
          </section>
        `)
      : Array.from(new Set(sortedJuryRows.map((r) => r.jure))).map((jure) => {
          const planning = sortedJuryRows.filter((r) => r.jure === jure);
          const rows = planning.map((p) => `<tr><td>${p.heure}</td><td>${p.candidat}</td><td>${p.classe}</td><td>${p.salle}</td><td>${p.discipline1}${p.discipline2 ? ` / ${p.discipline2}` : ""}</td></tr>`).join("");
          return `
            <section class="page">
              <img class="logo" src="https://i.imgur.com/0YmGlXO.png" alt="logo" />
              <h1>Convocation – Juré Oral DNB</h1>
              <p><strong>Juré :</strong> ${jure}</p>
              <p><strong>Date :</strong> 2026-05-20</p>
              <table><thead><tr><th>Heure</th><th>Candidat</th><th>Classe</th><th>Salle</th><th>Disciplines</th></tr></thead><tbody>${rows}</tbody></table>
              <p><strong>Consignes :</strong> Merci d'utiliser la grille d'évaluation officielle.</p>
              <div class="signature-wrap"><img class="signature" src="https://i.imgur.com/77DP4od.png" alt="signature" /></div>
            </section>
          `;
        });

    w.document.write(`
      <html><head><title>Convocations</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        .page { padding: 24px; page-break-after: always; }
        .logo { width: 120px; }
        .signature-wrap { margin-top: 32px; text-align: right; }
        .signature { width: 180px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #ddd; padding: 6px; font-size: 13px; }
      </style></head><body>${pages.join("")}</body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  const currentRows = activeTab === "candidats" ? sortedCandidates : sortedJuryRows;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold text-slate-900">Oraux du DNB — 20 mai 2026</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setActiveTab("candidats")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "candidats" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"}`}>Candidats</button>
          <button type="button" onClick={() => setActiveTab("jures")} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "jures" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border"}`}>Jurés</button>
          <div className="ml-auto flex flex-wrap gap-2">
            <button type="button" onClick={exportAsXls} className="rounded-md border bg-white px-3 py-2 text-sm">Exporter .xls</button>
            <button type="button" onClick={printConvocations} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Convocations PDF / Impression</button>
          </div>
        </div>

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

          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">Tri multi-colonnes :</span>
              <button type="button" onClick={addSortRule} className="rounded border px-2 py-1 text-xs">+ Ajouter un tri</button>
              <button type="button" onClick={resetFilters} className="rounded border px-2 py-1 text-xs">Réinitialiser filtres</button>
              <span className="text-xs text-slate-500">{currentRows.length} résultat(s)</span>
            </div>
            {sortRules.map((rule, index) => (
              <div key={`${rule.key}-${index}`} className="flex flex-wrap items-center gap-2">
                <select value={rule.key} onChange={(e) => updateSort(index, { key: e.target.value })} className="rounded border px-2 py-1 text-xs">
                  <option value="heure">Heure</option>
                  <option value="eleve">Élève</option>
                  <option value="classe">Classe</option>
                  <option value="jure">Juré</option>
                  <option value="discipline1">Discipline_1</option>
                </select>
                <select value={rule.direction} onChange={(e) => updateSort(index, { direction: e.target.value as SortDirection })} className="rounded border px-2 py-1 text-xs">
                  <option value="asc">Ascendant</option>
                  <option value="desc">Descendant</option>
                </select>
                {sortRules.length > 1 && (
                  <button type="button" onClick={() => removeSortRule(index)} className="rounded border px-2 py-1 text-xs">Supprimer</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((column) => (
                  <th key={column} className="whitespace-nowrap border-b px-3 py-2 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === "candidats"
                ? sortedCandidates.map((row, index) => (
                    <tr key={`${row.eleve}-${index}`} className="odd:bg-white even:bg-slate-50">
                      <td className="align-top border-b px-3 py-2">{row.eleve}</td>
                      <td className="align-top border-b px-3 py-2">{row.classe}</td>
                      <td className="align-top border-b px-3 py-2">{row.parcours}</td>
                      <td className="align-top border-b px-3 py-2">{row.problematique}</td>
                      <td className="align-top border-b px-3 py-2">{row.discipline1}</td>
                      <td className="align-top border-b px-3 py-2">{row.discipline2}</td>
                      <td className="align-top border-b px-3 py-2">{row.anglais ? "☑" : ""}</td>
                      <td className="align-top border-b px-3 py-2">{row.espagnol ? "☑" : ""}</td>
                      <td className="align-top border-b px-3 py-2">{row.jure1}</td>
                      <td className="align-top border-b px-3 py-2">{row.jure2}</td>
                      <td className="align-top border-b px-3 py-2">{row.heure}</td>
                    </tr>
                  ))
                : sortedJuryRows.map((row, index) => (
                    <tr key={`${row.jure}-${row.candidat}-${index}`} className="odd:bg-white even:bg-slate-50">
                      <td className="align-top border-b px-3 py-2">{row.jure}</td>
                      <td className="align-top border-b px-3 py-2">{row.heure}</td>
                      <td className="align-top border-b px-3 py-2">{row.candidat}</td>
                      <td className="align-top border-b px-3 py-2">{row.classe}</td>
                      <td className="align-top border-b px-3 py-2">{row.problematique}</td>
                      <td className="align-top border-b px-3 py-2">{row.discipline1}</td>
                      <td className="align-top border-b px-3 py-2">{row.discipline2}</td>
                      <td className="align-top border-b px-3 py-2">{row.langue}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
