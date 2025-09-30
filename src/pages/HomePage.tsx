import { Link } from "react-router-dom";
import { CalendarDays, GraduationCap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-12 p-6 text-center sm:p-10">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Espace examens blancs LFJP
          </p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Toute l'organisation des examens blancs centralisée pour les
            enseignants du LFJP
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
            Cet espace réunit l'ensemble des informations pratiques nécessaires
            pour préparer, coordonner et faire vivre les épreuves. Vous y
            trouverez les documents, convocations, affectations de salles et les
            consignes indispensables pour guider sereinement chaque étape du
            déroulement des examens blancs.
          </p>
        </div>

        <Link
          to="/examens-blancs"
          className="group relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-sky-200/60 blur-3xl transition-opacity duration-300 group-hover:opacity-60" />
          <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-indigo-200/70 blur-3xl transition-opacity duration-300 group-hover:opacity-60" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg">
              <GraduationCap className="h-12 w-12" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dessin interactif
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {"Baccalauréat blanc 1"}
                <sup>ère</sup>
                {" et Terminale"}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-slate-600">
                <CalendarDays className="h-5 w-5 text-sky-600" aria-hidden="true" />
                <span className="text-base font-medium sm:text-lg">
                  10, 11 et 12 décembre 2025
                </span>
              </div>
              <p className="text-sm text-slate-500 sm:text-base">
                Cliquez pour accéder à la préparation détaillée des épreuves,
                aux répartitions des salles et aux outils pédagogiques.
              </p>
            </div>
          </div>

          <div className="relative mt-6 flex items-center gap-3 text-sky-700">
            <span className="text-sm font-semibold uppercase tracking-wide">
              Découvrir l'organisation
            </span>
            <span className="text-lg">→</span>
          </div>
        </Link>
      </main>
    </div>
  );
}
