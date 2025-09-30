import { createPortal } from "react-dom";
import { Settings } from "lucide-react";

import { useDashboardContext } from "../lib/dashboard-context";

const SettingsIcon = Settings;

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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <SettingsIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-slate-900">
          Section en construction
        </h4>
        <p className="mt-2 text-sm text-slate-500">
          Le paramétrage des salles d’examen sera bientôt disponible. En attendant, continuez à consulter les autres vues du tableau de bord.
        </p>
      </div>
    </section>,
    container,
  );
}
