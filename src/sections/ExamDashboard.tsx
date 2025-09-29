import { useCallback, useMemo, useState } from "react";

import { dashboardTabs } from "../lib/dashboard-data";
import { DashboardContext } from "../lib/dashboard-context";
import type { DashboardView } from "../lib/dashboard-utils";

export default function ExamDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>("teacher");
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const handleTabClick = (view: DashboardView) => {
    setActiveView(view);
  };

  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const contextValue = useMemo(
    () => ({ activeView, setActiveView, container, setContainer: setContainerRef }),
    [activeView, container, setContainerRef],
  );

  return (
    <section aria-labelledby="views-title" className="space-y-6">
      <h2 id="views-title" className="sr-only">
        Affichage des plannings
      </h2>
      <DashboardContext.Provider value={contextValue}>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
          <div
            className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4"
            role="tablist"
            aria-label="Affichage des plannings"
          >
            {dashboardTabs.map(({ id, label, Icon }) => {
              const isActive = activeView === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  aria-controls={`${id}-view`}
                  id={`${id}-tab`}
                  onClick={() => handleTabClick(id)}
                  className={`view-tab inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 space-y-10" ref={setContainerRef} />
        </div>
      </DashboardContext.Provider>
    </section>
  );
}
