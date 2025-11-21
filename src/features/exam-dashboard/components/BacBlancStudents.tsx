import { createPortal } from "react-dom";
import { Users2 } from "lucide-react";

import { bacBlanc1Students } from "../data";
import { useDashboardContext } from "../context";

export default function BacBlancStudents() {
  const { activeView, container } = useDashboardContext();

  if (!container) {
    return null;
  }

  return createPortal(
    <section
      id="students-view"
      data-view-section="students"
      role="tabpanel"
      aria-labelledby="students-tab"
      tabIndex={activeView === "students" ? 0 : -1}
      aria-hidden={activeView === "students" ? "false" : "true"}
      className={`${activeView === "students" ? "" : "hidden"} space-y-6`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-slate-900">
            Bac blanc 1 — élèves et spécialités
          </h3>
          <p className="text-sm text-slate-500">
            Liste des élèves convoqués avec leurs spécialités 1 et 2 issues du
            parcours de Terminale et leur salle de composition par épreuve.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-700">
          <span className="rounded-full bg-blue-100 p-2 text-blue-600">
            <Users2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{bacBlanc1Students.length} élèves</p>
            <p className="text-xs text-blue-600/80">Spécialité N°1 et N°2</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h4 className="text-base font-semibold text-slate-900">Répartition par élève</h4>
            <p className="text-sm text-slate-500">
              Utilisez cette vue pour préparer les convocations et la répartition des salles par spécialité.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm font-medium text-slate-600">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3">
                  Prénom
                </th>
                <th scope="col" className="px-6 py-3">
                  Spécialité 1
                </th>
                <th scope="col" className="px-6 py-3">
                  Spécialité 2
                </th>
                <th scope="col" className="px-6 py-3">
                  Classe
                </th>
                <th scope="col" className="px-6 py-3">
                  Philosophie (Mer. 10 déc. 08h00)
                </th>
                <th scope="col" className="px-6 py-3">
                  Spécialité 1 (Jeu. 11 déc. 08h00)
                </th>
                <th scope="col" className="px-6 py-3">
                  Spécialité 2 (Ven. 12 déc. 08h00)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {bacBlanc1Students.map((student) => (
                <tr key={`${student.lastName}-${student.firstName}`} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-3 font-semibold uppercase text-slate-900">
                    {student.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-slate-800">
                    {student.firstName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-blue-700">
                    {student.specialty1}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-blue-700">
                    {student.specialty2}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                    {student.className}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 font-semibold text-slate-800">
                    {student.philosophyRoom}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 font-semibold text-blue-700">
                    {student.specialty1Room}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 font-semibold text-blue-700">
                    {student.specialty2Room}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>,
    container,
  );
}
