import { createPortal } from "react-dom";
import { LayoutGrid, Users } from "lucide-react";

import { useDashboardContext } from "../lib/dashboard-context";

const examRooms: { name: string; examCapacity: number }[] = [
  { name: "S10", examCapacity: 15 },
  { name: "S12", examCapacity: 13 },
  { name: "S13", examCapacity: 12 },
  { name: "S14", examCapacity: 12 },
  { name: "S9 PRIO / EPS", examCapacity: 5 },
];

const totalExamCapacity = examRooms.reduce(
  (accumulator, room) => accumulator + room.examCapacity,
  0,
);

export default function RoomSetup() {
  const { activeView, container } = useDashboardContext();

  if (!container) {
    return null;
  }

  return createPortal(
    <section
      id="setup-view"
      data-view-section="setup"
      role="tabpanel"
      aria-labelledby="setup-tab"
      tabIndex={activeView === "setup" ? 0 : -1}
      aria-hidden={activeView === "setup" ? "false" : "true"}
      className={`${activeView === "setup" ? "" : "hidden"} space-y-6`}
    >
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          Paramétrage des salles d’examen
        </h3>
        <p className="text-sm text-slate-500">
          Centralisez ici la configuration des salles, des capacités et des besoins matériels pour les sessions d’examen.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                Capacité des salles au format examen
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Liste des salles disponibles avec la capacité maximale configurée pour les épreuves écrites.
              </p>
            </div>
            <span className="hidden rounded-full bg-blue-100 p-3 text-blue-600 sm:inline-flex">
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-sm font-medium text-slate-600">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Salle
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Capacité (format examen)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {examRooms.map((room) => (
                  <tr key={room.name}>
                    <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                      {room.name}
                    </th>
                    <td className="px-6 py-4">{room.examCapacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 p-3 text-emerald-600">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">Capacité totale</p>
              <p className="text-2xl font-semibold text-slate-900">{totalExamCapacity} candidats</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Les capacités ci-dessus correspondent à la configuration des salles en mode examen (tables individuelles, distanciation, matériel nécessaire). Utilisez ces données pour planifier la répartition des candidats.
          </p>
        </aside>
      </div>
    </section>,
    container,
  );
}
