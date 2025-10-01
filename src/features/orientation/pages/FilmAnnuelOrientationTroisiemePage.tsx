import { useMemo, useState } from "react";
import type { PropsWithChildren, ReactNode } from "react";

const DATA = [
  // Mieux se connaître
  {
    id: "enjeux-3e",
    phase: "Mieux se connaître",
    titre: "Présentation des enjeux de la 3e",
    details:
      "Objectifs de l'année, calendrier de l'orientation, attentes et livrables.",
    periode: "Septembre",
    ordre: 20250910,
    acteurs: ["PP", "PRIO", "Élèves"],
    lieu: "LFJP — Vie de classe",
  },
  {
    id: "bilan-competences",
    phase: "Mieux se connaître",
    titre: "Bilans de compétences (entretiens individuels)",
    details:
      "Identifier compétences scolaires et extra-scolaires. Aider à amorcer le projet.",
    periode: "Toute l'année",
    ordre: 20250915,
    acteurs: ["PRIO", "Élèves"],
    lieu: "Bureau orientation S9 / AP",
  },
  {
    id: "tests-interets",
    phase: "Mieux se connaître",
    titre: "Goûts et intérêts (tests ONISEP, Kledou)",
    details:
      "Exploration des intérêts et qualités. Restitution et pistes de métiers.",
    periode: "Septembre–Novembre",
    ordre: 20250920,
    acteurs: ["PRIO", "Élèves"],
    lieu: "Bureau orientation / AP",
  },
  {
    id: "autoportrait-slam",
    phase: "Mieux se connaître",
    titre: "Ateliers autoportrait — projet ‘Échos slamés de nos Avenirs’",
    details:
      "Production artistique avec Français/Arts/Musique et artistes locaux.",
    periode: "Septembre–Novembre",
    ordre: 20250925,
    acteurs: ["Français", "Arts", "Musique", "Artistes locaux"],
    lieu: "LFJP",
  },
  {
    id: "definition-parcours",
    phase: "Mieux se connaître",
    titre: "Définir le Parcours Avenir (brainstorming + oraux)",
    details: "Construction partagée des attendus et jalons de l'année.",
    periode: "Septembre–Octobre",
    ordre: 20250926,
    acteurs: ["Élèves", "PP", "PRIO"],
    lieu: "Heure de vie de classe",
  },
  {
    id: "prepa-stage",
    phase: "Mieux se connaître",
    titre: "Préparation et recherche du stage découverte",
    details:
      "Lettre de motivation, ciblage des entreprises, candidatures, simulation d'entretiens.",
    periode: "Septembre–Novembre",
    ordre: 20250927,
    acteurs: ["PRIO", "Élèves"],
    lieu: "Bureau orientation / AP",
  },
  {
    id: "forum-metiers",
    phase: "Mieux se connaître",
    titre: "Forum des Métiers (obligatoire) + restitution Slam",
    details: "Rencontres avec professionnels. Valorisation des productions.",
    periode: "29 novembre",
    ordre: 20251129,
    acteurs: ["Professionnels", "PP", "PRIO"],
    lieu: "LFJP",
  },
  {
    id: "info-parents",
    phase: "Mieux se connaître",
    titre: "Info parents — voies post‑3e, calendrier, procédure",
    details:
      "Présentation Bac général / Bac pro / CAP. Calendrier et affectation.",
    periode: "11 novembre",
    ordre: 20251111,
    acteurs: ["PP", "PRIO"],
    lieu: "LFJP",
  },
  {
    id: "info-eleves",
    phase: "Mieux se connaître",
    titre: "Info élèves — cap sur l'orientation",
    details: "Questions/réponses. Organisation Forum et stage.",
    periode: "Novembre",
    ordre: 20251120,
    acteurs: ["PRIO", "Élèves"],
    lieu: "Vie de classe",
  },

  // Plonger dans le monde professionnel
  {
    id: "stage-decouverte",
    phase: "Plonger dans le monde professionnel",
    titre: "Stage de découverte en entreprise",
    details:
      "Découverte d'un milieu professionnel. Observation et prise de notes.",
    periode: "15–19 décembre",
    ordre: 20251215,
    acteurs: ["Élèves"],
    lieu: "Entreprise",
  },
  {
    id: "suivi-stage",
    phase: "Plonger dans le monde professionnel",
    titre: "Suivi de stage et accompagnement",
    details: "Point d'étape individuel pendant le stage si nécessaire.",
    periode: "Décembre (à la demande)",
    ordre: 20251217,
    acteurs: ["PP", "Équipe pédagogique", "PRIO"],
    lieu: "LFJP / Entreprise",
  },
  {
    id: "rapport-stage",
    phase: "Plonger dans le monde professionnel",
    titre: "Rédaction du rapport de stage",
    details: "Structuration, analyse d'expérience, mise en forme.",
    periode: "Dès décembre",
    ordre: 20251220,
    acteurs: ["PP", "PRIO"],
    lieu: "Bureau orientation / AP",
  },
  {
    id: "soutenance-stage",
    phase: "Plonger dans le monde professionnel",
    titre: "Aide à la soutenance orale",
    details: "Préparation diaporama, posture, grille d'évaluation.",
    periode: "Dès décembre",
    ordre: 20251222,
    acteurs: ["PRIO"],
    lieu: "Bureau orientation",
  },
  {
    id: "mini-stages",
    phase: "Plonger dans le monde professionnel",
    titre: "Mini‑stages CAP/Bac Pro pour profils ciblés",
    details:
      "Immersions courtes dans des lycées pro pour affiner le projet.",
    periode: "À la demande (dès décembre)",
    ordre: 20251223,
    acteurs: ["PP", "PRIO", "CPE"],
    lieu: "Établissements partenaires",
  },
  {
    id: "ouverture-pro",
    phase: "Plonger dans le monde professionnel",
    titre: "Découverte d'entreprises locales et écoles",
    details: "Visites, interventions, témoignages de professionnels.",
    periode: "Toute l'année",
    ordre: 20260110,
    acteurs: ["Équipe pédagogique", "PP", "PRIO"],
    lieu: "LFJP / Extérieurs",
  },

  // Finaliser les projets
  {
    id: "suivi-affectation",
    phase: "Finaliser les projets",
    titre: "Suivi individuel et procédures d'affectation",
    details: "Consolider le projet des élèves vers voies techno/pro ou générale.",
    periode: "Mars–Juin",
    ordre: 20260310,
    acteurs: ["PP", "PRIO", "CPE", "Parents"],
    lieu: "LFJP",
  },
  {
    id: "affelnet",
    phase: "Finaliser les projets",
    titre: "AFFELNET — finalisation et saisie",
    details: "Accompagnement à la saisie et vérifications finales.",
    periode: "Mai–fin juin",
    ordre: 20260520,
    acteurs: ["PRIO"],
    lieu: "LFJP",
  },
] as const;

const PHASES = [
  { key: "Mieux se connaître", color: "bg-sky-100 border-sky-300" },
  {
    key: "Plonger dans le monde professionnel",
    color: "bg-emerald-100 border-emerald-300",
  },
  { key: "Finaliser les projets", color: "bg-amber-100 border-amber-300" },
] as const;

type OrientationItem = (typeof DATA)[number];

type TimelineGroup = readonly [OrientationItem["phase"], OrientationItem[]];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function normalize(str: string | undefined) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function FilmAnnuelOrientationTroisiemePage() {
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState<OrientationItem["phase"] | "all">("all");
  const [view, setView] = useState<"timeline" | "table">("timeline");

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return DATA.filter(
      (d) =>
        (phase === "all" || d.phase === phase) &&
        (nq === "" ||
          normalize(d.titre).includes(nq) ||
          normalize(d.details).includes(nq) ||
          normalize(d.periode).includes(nq) ||
          normalize(d.acteurs.join(" ")).includes(nq)),
    ).sort((a, b) => a.ordre - b.ordre);
  }, [q, phase]);

  const grouped = useMemo(() => {
    const map = new Map<OrientationItem["phase"], OrientationItem[]>();
    for (const item of filtered) {
      if (!map.has(item.phase)) map.set(item.phase, []);
      map.get(item.phase)!.push(item);
    }
    return Array.from(map.entries()).sort(
      (a, b) =>
        PHASES.findIndex((p) => p.key === a[0]) -
        PHASES.findIndex((p) => p.key === b[0]),
    ) as TimelineGroup[];
  }, [filtered]);

  const printPage = () => window.print();

  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Film annuel de l'orientation — 3e
          </h1>
          <p className="text-sm text-slate-600">
            LFJP · Parcours Avenir · Année scolaire 2025‑2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600" htmlFor="view">
              Vue
            </label>
            <select
              id="view"
              value={view}
              onChange={(e) => setView(e.target.value as typeof view)}
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="timeline">Timeline</option>
              <option value="table">Tableau</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600" htmlFor="phase">
              Phase
            </label>
            <select
              id="phase"
              value={phase}
              onChange={(e) =>
                setPhase(
                  e.target.value === "all"
                    ? "all"
                    : (e.target.value as OrientationItem["phase"]),
                )
              }
              className="rounded-xl border px-3 py-2 text-sm"
            >
              <option value="all">Toutes</option>
              {PHASES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.key}
                </option>
              ))}
            </select>
          </div>
          <input
            type="search"
            placeholder="Rechercher titre, période, acteurs..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64 rounded-xl border px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={printPage}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
          >
            Imprimer / PDF
          </button>
        </div>
      </header>

      {view === "timeline" ? <Timeline grouped={grouped} /> : <TableView rows={filtered} />}

      <footer className="mt-8 border-t pt-4 text-xs text-slate-500">
        Données issues du canevas Parcours Avenir 3e. Dernière mise à jour: {" "}
        {new Date().toISOString().slice(0, 10)}.
      </footer>
    </div>
  );
}

interface TimelineProps {
  grouped: TimelineGroup[];
}

function Timeline({ grouped }: TimelineProps) {
  return (
    <div className="flex flex-col gap-8">
      {grouped.map(([title, items]) => {
        const phaseMeta = PHASES.find((p) => p.key === title);
        return (
          <section key={title}>
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>
            <div className="relative pl-6">
              <div
                className="absolute left-2 top-0 h-full w-px bg-slate-200"
                aria-hidden
              />
              <ul className="space-y-4">
                {items.map((it) => (
                  <li key={it.id} className="relative">
                    <div
                      className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-white ring-2 ring-slate-300"
                      aria-hidden
                    />
                    <article
                      className={classNames(
                        "rounded-2xl border p-4",
                        phaseMeta?.color,
                      )}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-medium">{it.titre}</h3>
                        <span className="text-xs text-slate-700">{it.periode}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">{it.details}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        <Badge icon="users" label={it.acteurs.join(", ")} />
                        <Badge icon="map-pin" label={it.lieu} />
                        <Badge icon="flag" label={it.phase} />
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}

interface TableViewProps {
  rows: OrientationItem[];
}

function TableView({ rows }: TableViewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <Th>Phase</Th>
            <Th>Période</Th>
            <Th>Titre</Th>
            <Th>Détails</Th>
            <Th>Acteurs</Th>
            <Th>Lieu</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50">
              <Td className="whitespace-nowrap text-slate-700">{r.phase}</Td>
              <Td className="whitespace-nowrap text-slate-700">{r.periode}</Td>
              <Td className="font-medium">{r.titre}</Td>
              <Td className="text-slate-700">{r.details}</Td>
              <Td className="text-slate-700">{r.acteurs.join(", ")}</Td>
              <Td className="text-slate-700">{r.lieu}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CellProps extends PropsWithChildren {
  className?: string;
}

function Th({ children }: PropsWithChildren) {
  return (
    <th
      scope="col"
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
    >
      {children}
    </th>
  );
}

function Td({ children, className }: CellProps) {
  return <td className={"px-4 py-3 text-sm " + (className || "")}>{children}</td>;
}

interface BadgeProps {
  icon: keyof typeof ICON_PATHS;
  label: ReactNode;
}

function Badge({ icon, label }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] ring-1 ring-slate-300">
      <Icon name={icon} className="h-3 w-3" />
      <span>{label}</span>
    </span>
  );
}

const ICON_PATHS = {
  users:
    "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M7 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "map-pin":
    "M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  flag: "M4 15V3a1 1 0 0 1 1-1h10l-1 3 4 .5V15l-4-.5-1 3H5a1 1 0 0 1-1-1Z",
} as const;

interface IconProps {
  name: keyof typeof ICON_PATHS;
  className?: string;
}

function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
