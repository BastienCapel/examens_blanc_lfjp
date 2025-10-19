import { ShieldCheck } from "lucide-react";

interface CulturalProgram {
  id: string;
  title: string;
  description: string;
  items: string[];
  ctaLabel: string;
  ctaHref?: string;
}

const culturalPrograms: CulturalProgram[] = [
  {
    id: "intercultural-education",
    title: "Éducation interculturelle",
    description:
      "Dispositifs et événements favorisant la compréhension des cultures au sein de la communauté scolaire.",
    items: ["Médiation interculturelle", "Semaine des cultures"],
    ctaLabel: "En savoir plus",
  },
  {
    id: "peac",
    title: "Parcours d'éducation artistique et culturelle (PEAC)",
    description:
      "Suivi des projets artistiques et culturels pour accompagner les élèves dans la construction de leur parcours individuel.",
    items: [
      "Suivi des parcours artistiques individuels",
      "Agenda des sorties et ateliers culturels",
      "Ressources pédagogiques partagées",
    ],
    ctaLabel: "En savoir plus",
  },
  {
    id: "international-and-local",
    title: "Ouverture internationale et locale",
    description:
      "Actions partenariales pour valoriser les échanges avec les établissements locaux et internationaux.",
    items: ["Projets d'échanges scolaires", "Partenariats associatifs et culturels"],
    ctaLabel: "En savoir plus",
  },
];

export default function CulturalPrograms() {
  return (
    <section aria-labelledby="cultural-programs-title" className="space-y-6">
      <div className="space-y-2">
        <h2 id="cultural-programs-title" className="text-2xl font-semibold text-slate-900">
          Programmes culturels et éducatifs
        </h2>
        <p className="text-sm text-slate-500">
          Centralisez les initiatives menées au lycée : coordination des projets, ressources partagées et suivi des
          actions.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {culturalPrograms.map((program) => (
          <article
            key={program.id}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="space-y-3">
              <header className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                <p className="text-sm text-slate-500">{program.description}</p>
              </header>
              <ul className="space-y-2 text-sm text-slate-600">
                {program.items.map((item) => (
                  <li key={`${program.id}-${item}`} className="flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <a
                href={program.ctaHref ?? "#"}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors duration-200 hover:bg-blue-100"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {program.ctaLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
