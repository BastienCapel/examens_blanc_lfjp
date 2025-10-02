import { CalendarClock } from "lucide-react";

export default function Header() {
  return (
    <header className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            alt="Logo du Lycée Français Jacques Prévert de Saly"
            className="h-16 flex-shrink-0 rounded-lg border border-slate-200 bg-white object-contain shadow-sm"
            src="https://i.imgur.com/0YmGlXO.png"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Lycée Français Jacques Prévert de Saly
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Examens blancs LFJP 2025-2026
            </h1>
          </div>
        </div>
      </div>
      <p className="text-lg text-slate-600">10, 11 et 12 Décembre 2025</p>
      <div className="flex items-center gap-3 text-sm text-slate-600 sm:text-base">
        <CalendarClock className="h-5 w-5 text-slate-500" aria-hidden="true" />
        <span>Transmission des sujets à la direction avant le 1er décembre 2025 pour reprographie.</span>
      </div>
    </header>
  );
}
