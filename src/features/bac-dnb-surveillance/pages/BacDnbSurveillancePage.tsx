import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  FileBadge,
  FileText,
  Printer,
  Search,
  User,
  UserX,
} from "lucide-react";

import type { ExamColumn } from "../data/scheduleData";
import { scheduleData } from "../data/scheduleData";

type ExamType = "bac" | "dnb";
interface ShiftAssignment {
  room: string;
  col: ExamColumn;
}

function getArrivalTime(timeStr: string) {
  const start = timeStr.split("-")[0]?.trim();
  if (start === "7h30") return "7h00";
  if (start === "14h") return "13h30";

  const match = start?.match(/(\d+)h(\d*)/);
  if (match) {
    const hours = Number.parseInt(match[1], 10);
    const minutes = match[2] ? Number.parseInt(match[2], 10) : 0;
    const totalMinutes = hours * 60 + minutes - 30;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours}h${newMinutes === 0 ? "00" : newMinutes.toString().padStart(2, "0")}`;
  }

  return "30 min avant";
}

function getUniqueSupervisors() {
  const supervisors = new Set<string>();
  ["bac", "dnb"].forEach((exam) => {
    scheduleData[exam as ExamType].rows.forEach((row) => {
      row.shifts.forEach((shift) => {
        shift.forEach((person) => {
          if (person) supervisors.add(person);
        });
      });
    });
  });

  return [...supervisors].sort();
}

function buildSupervisorShifts(supervisor: string, exam: ExamType): ShiftAssignment[] {
  const shifts: ShiftAssignment[] = [];
  const dataset = scheduleData[exam];

  dataset.rows.forEach((row) => {
    row.shifts.forEach((shift, index) => {
      if (shift.includes(supervisor)) {
        shifts.push({ room: row.room, col: dataset.columns[index] });
      }
    });
  });

  shifts.sort((a, b) => dataset.columns.indexOf(a.col) - dataset.columns.indexOf(b.col));
  return shifts;
}

function getShiftRowsHTML(shifts: ShiftAssignment[]) {
  return shifts
    .map(
      (shift) => `
      <tr>
        <td>${shift.col.date}</td>
        <td>${shift.col.subject}</td>
        <td>${shift.room}</td>
        <td>${shift.col.time}</td>
        <td class="presence">${getArrivalTime(shift.col.time)}</td>
      </tr>
    `,
    )
    .join("");
}

function buildConvocationContent(supervisor: string) {
  const bacShifts = buildSupervisorShifts(supervisor, "bac");
  const dnbShifts = buildSupervisorShifts(supervisor, "dnb");

  const renderTable = (title: string, shifts: ShiftAssignment[]) => {
    if (shifts.length === 0) return "";

    return `
      <h3>${title}</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Épreuve</th>
            <th>Salle</th>
            <th>Horaires</th>
            <th>Heure de présence</th>
          </tr>
        </thead>
        <tbody>
          ${getShiftRowsHTML(shifts)}
        </tbody>
      </table>
    `;
  };

  return `
    <div class="sheet">
      <div class="sheet-header">
        <h1>Convocation - Surveillance des épreuves</h1>
        <p>Session de Juin 2026</p>
      </div>
      <p class="name">Surveillant(e) : <strong>${supervisor}</strong></p>
      <p class="notice">
        Vous êtes convoqué(e) pour assurer la surveillance des épreuves selon le(s) calendrier(s) ci-dessous.<br>
        <strong>RAPPEL IMPORTANT :</strong> Il est impératif de vous présenter au secrétariat des examens <span>30 minutes avant le début de l'épreuve</span>.
      </p>
      ${renderTable("Épreuves du Baccalauréat", bacShifts)}
      ${renderTable("Épreuves du DNB", dnbShifts)}
      <div class="signatures">
        <div>
          <p>Le Chef d'Établissement</p>
          <img src="https://i.imgur.com/77DP4od.png" alt="Cachet du Proviseur" />
        </div>
        <div>
          <p>Signature du Surveillant(e)<br>(Précédée de la mention \"Lu et approuvé\")</p>
          <div class="line"></div>
        </div>
      </div>
    </div>
  `;
}

function buildPrintDocument(title: string, content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body { font-family: Inter, Arial, sans-serif; background: white; color: #1f2937; padding: 24px; }
  .sheet { border: 2px solid #1f2937; padding: 20px; margin: 8px 0 20px; page-break-after: always; }
  .sheet:last-child { page-break-after: auto; }
  .sheet-header { border-bottom: 2px solid #1f2937; margin-bottom: 16px; padding-bottom: 12px; text-align: center; }
  .sheet-header h1 { font-size: 20px; text-transform: uppercase; margin: 0; }
  .sheet-header p { margin: 8px 0 0; color: #475569; }
  .name { margin: 10px 0; }
  .name strong { color: #4338ca; text-transform: uppercase; }
  .notice { background: #fef9c3; border-left: 4px solid #facc15; padding: 10px; font-size: 14px; line-height: 1.45; }
  .notice span { color: #dc2626; text-decoration: underline; font-weight: 700; }
  h3 { margin: 18px 0 10px; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px; font-size: 14px; text-transform: uppercase; color: #1e3a8a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 13px; text-align: left; }
  .presence { background: #fef2f2; color: #dc2626; font-weight: 700; }
  .signatures { margin-top: 22px; padding-top: 12px; display: flex; justify-content: space-between; gap: 20px; }
  .signatures p { font-size: 12px; color: #64748b; text-align: center; }
  .signatures img { height: 72px; max-width: 160px; object-fit: contain; }
  .line { width: 230px; border-bottom: 1px solid #9ca3af; margin: 50px auto 0; }
  @media print { @page { margin: 1.5cm; } body { padding: 0; } }
</style>
</head>
<body>
${content}
<script>
setTimeout(() => { window.print(); window.close(); }, 500);
</script>
</body>
</html>`;
}

export default function BacDnbSurveillancePage() {
  const [currentExam, setCurrentExam] = useState<ExamType>("bac");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const supervisors = useMemo(() => getUniqueSupervisors(), []);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const allCards = scheduleData[currentExam].rows.flatMap((row) => row.shifts.flatMap((shift) => shift));
  const searchMatches = normalizedSearch
    ? allCards.filter((name) => name.toLowerCase().includes(normalizedSearch)).length
    : allCards.length;

  const openConvocationMenu = (preselectedSupervisor?: string) => {
    setIsModalOpen(true);
    if (preselectedSupervisor) {
      setSelectedSupervisor(preselectedSupervisor);
    }
  };

  const closeConvocationMenu = () => {
    setIsModalOpen(false);
    setSelectedSupervisor("");
  };

  const executePrint = (title: string, content: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.alert(
        "Votre navigateur bloque l'ouverture de la fenêtre d'impression. Veuillez autoriser les fenêtres contextuelles (pop-ups) pour ce site.",
      );
      return;
    }

    printWindow.document.write(buildPrintDocument(title, content));
    printWindow.document.close();
  };

  const printMainPlanning = () => {
    const title = currentExam === "bac" ? "Baccalauréat" : "DNB";
    const planningNode = document.getElementById("surveillance-planning-table");
    if (!planningNode) return;

    executePrint(
      `Planning des Surveillances - ${title}`,
      `<h1>Planning des Surveillances - ${title}</h1><p>Session Juin 2026</p>${planningNode.outerHTML}`,
    );
  };

  const printConvocation = () => {
    if (!selectedSupervisor) {
      window.alert("Veuillez sélectionner un surveillant(e) avant impression.");
      return;
    }

    executePrint(`Convocation - ${selectedSupervisor}`, buildConvocationContent(selectedSupervisor));
  };

  const downloadAllConvocations = () => {
    const allConvocations = supervisors.map((supervisor) => buildConvocationContent(supervisor)).join("\n");
    const html = buildPrintDocument("Convocations - Tous les surveillants", allConvocations).replace(
      /<script>[\s\S]*<\/script>/,
      "",
    );
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "convocations-surveillants-juin-2026.html";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-800 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
              <CalendarDays className="text-indigo-600" />
              Planning des Surveillances
            </h1>
            <p className="mt-1 text-gray-500">Session Juin 2026</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Chercher un surveillant(e)..."
              />
            </div>
            <button
              onClick={printMainPlanning}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
            <button
              onClick={() => openConvocationMenu()}
              className="flex items-center justify-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <FileText className="h-4 w-4" />
              Convocations
            </button>
          </div>
        </div>

        <div className="mb-6 flex w-fit space-x-1 rounded-lg bg-gray-200/50 p-1">
          <button
            onClick={() => setCurrentExam("bac")}
            className={`rounded-md px-6 py-2.5 text-sm transition-all ${
              currentExam === "bac"
                ? "bg-white font-semibold text-indigo-700 shadow shadow-gray-200"
                : "font-medium text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
            }`}
          >
            Baccalauréat
          </button>
          <button
            onClick={() => setCurrentExam("dnb")}
            className={`rounded-md px-6 py-2.5 text-sm transition-all ${
              currentExam === "dnb"
                ? "bg-white font-semibold text-indigo-700 shadow shadow-gray-200"
                : "font-medium text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
            }`}
          >
            DNB
          </button>
        </div>

        <div id="surveillance-planning-table" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
                <tr>
                  <th className="sticky left-0 z-10 w-44 border-r border-gray-200 bg-white p-4" />
                  {scheduleData[currentExam].columns.map((col) => (
                    <th key={`${col.date}-${col.subject}`} className="min-w-[180px] border-r border-gray-100 p-4 align-top last:border-0">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <span className="text-xs font-semibold text-gray-500">{col.date}</span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-bold ring-1 ring-inset ${col.bg} ${col.color} ${col.ring}`}
                        >
                          {col.subject}
                        </span>
                        <div className="mt-1 flex flex-col text-xs font-medium text-gray-600">
                          <span>{col.time}</span>
                          {col.endExtra ? <span className="text-gray-400">({col.endExtra})</span> : null}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scheduleData[currentExam].rows.map((row) => (
                  <tr key={row.room} className="group transition-colors hover:bg-gray-50/50">
                    <td className="sticky left-0 z-10 border-r border-gray-200 bg-white p-4 align-middle transition-colors group-hover:bg-gray-50/80">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{row.room}</span>
                        {row.note ? <span className="text-xs font-medium text-gray-500">{row.note}</span> : null}
                      </div>
                    </td>
                    {row.shifts.map((shift, shiftIndex) => (
                      <td key={`${row.room}-${shiftIndex}`} className="align-top border-r border-gray-100 p-3 last:border-0">
                        <div className="flex flex-col gap-1.5">
                          {shift.map((person) => {
                            const isMatch =
                              !normalizedSearch || person.toLowerCase().includes(normalizedSearch);

                            return (
                              <button
                                key={`${row.room}-${person}-${shiftIndex}`}
                                onClick={() => openConvocationMenu(person)}
                                className={`flex w-full cursor-pointer items-center gap-2 rounded border p-2 text-left text-gray-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  isMatch
                                    ? normalizedSearch
                                      ? "scale-105 border-yellow-400 bg-yellow-100 ring-2 ring-yellow-400"
                                      : "border-gray-200 bg-white hover:border-indigo-300 hover:ring-1 hover:ring-indigo-200"
                                    : "border-gray-200 bg-white opacity-20 grayscale"
                                }`}
                              >
                                <User className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                <span className="truncate text-xs font-medium">{person}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {normalizedSearch && searchMatches === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <UserX className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-lg">Aucun surveillant(e) trouvé avec ce nom.</p>
          </div>
        ) : null}

        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex h-full w-full items-start justify-center overflow-y-auto bg-gray-900/50 pb-10 pt-10 backdrop-blur-sm">
            <div className="relative mx-4 flex w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl">
              <div className="flex flex-col items-center justify-between gap-4 rounded-t-xl border-b border-gray-100 bg-gray-50 p-6 sm:flex-row">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <FileBadge className="text-indigo-600" />
                  Édition des convocations
                </h2>
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                  <select
                    value={selectedSupervisor}
                    onChange={(event) => setSelectedSupervisor(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-auto"
                  >
                    <option value="">Sélectionner un surveillant(e)...</option>
                    {supervisors.map((supervisor) => (
                      <option key={supervisor} value={supervisor}>
                        {supervisor}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={printConvocation}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    <Printer className="h-4 w-4" /> Imprimer
                  </button>
                  <button
                    onClick={downloadAllConvocations}
                    className="flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <FileText className="h-4 w-4" /> Télécharger tout
                  </button>
                  <button
                    onClick={closeConvocationMenu}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
                  >
                    Fermer
                  </button>
                </div>
              </div>

              <div className="min-h-[500px] rounded-b-xl bg-white p-8">
                {!selectedSupervisor ? (
                  <div className="mt-20 flex flex-col items-center text-center text-gray-400">
                    <AlertTriangle className="mb-3 h-12 w-12 text-gray-300" />
                    <p>Veuillez sélectionner un(e) surveillant(e) pour afficher sa convocation.</p>
                  </div>
                ) : (
                  <div className="prose max-w-none text-sm prose-table:w-full prose-th:border prose-td:border">
                    <div
                      className="rounded border-2 border-gray-800 bg-white p-6"
                      dangerouslySetInnerHTML={{ __html: buildConvocationContent(selectedSupervisor) }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
