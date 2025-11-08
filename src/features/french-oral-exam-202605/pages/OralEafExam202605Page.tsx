import { Fragment, useMemo, useState } from "react";

import { ExamDashboardPageLayout, BackToHomeButton } from "../../exam-dashboard/components";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../../../shared/components";
import { cn } from "../../../shared/lib";
import type { OralCandidate } from "../data/candidates";
import { oralCandidates202605 } from "../data/candidates";

const tabs = [
  { id: "overview", label: "Organisation complète" },
  { id: "jury", label: "Planning par jury" },
  { id: "room", label: "Planning par salle" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const fullDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`);
}

function formatFullDate(isoDate: string): string {
  return fullDateFormatter.format(toDate(isoDate));
}

function formatShortDate(isoDate: string): string {
  return shortDateFormatter.format(toDate(isoDate));
}

function formatRoomLabel(room: string): string {
  return `Salle ${room}`;
}

function getGroupedCandidates(
  candidates: OralCandidate[],
  keyGetter: (candidate: OralCandidate) => string,
): Array<{ key: string; candidates: OralCandidate[] }> {
  const map = new Map<string, OralCandidate[]>();

  candidates.forEach((candidate) => {
    const key = keyGetter(candidate);
    const existing = map.get(key);

    if (existing) {
      existing.push(candidate);
    } else {
      map.set(key, [candidate]);
    }
  });

  return Array.from(map.entries()).map(([key, groupedCandidates]) => ({
    key,
    candidates: groupedCandidates,
  }));
}

function sortCandidates(candidates: OralCandidate[]): OralCandidate[] {
  return [...candidates].sort((a, b) => {
    const dateDiff = toDate(a.date).getTime() - toDate(b.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    const convocationDiff = a.convocationTime.localeCompare(b.convocationTime);
    if (convocationDiff !== 0) {
      return convocationDiff;
    }

    return a.candidate.localeCompare(b.candidate);
  });
}

interface CandidateTableProps {
  candidates: OralCandidate[];
  showJury?: boolean;
  showRoom?: boolean;
}

function CandidateTable({ candidates, showJury = false, showRoom = false }: CandidateTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table className="min-w-full divide-y divide-slate-200">
        <TableHead>
          <TableRow className="bg-slate-100">
            <TableHeaderCell>Nom du candidat</TableHeaderCell>
            <TableHeaderCell>Classe</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Convocation</TableHeaderCell>
            <TableHeaderCell>Passage</TableHeaderCell>
            {showJury ? <TableHeaderCell>Jury</TableHeaderCell> : null}
            {showRoom ? <TableHeaderCell>Salle</TableHeaderCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={`${candidate.candidate}-${candidate.date}-${candidate.convocationTime}`}>
              <TableCell className="font-medium text-slate-900">{candidate.candidate}</TableCell>
              <TableCell>{candidate.className}</TableCell>
              <TableCell>{formatShortDate(candidate.date)}</TableCell>
              <TableCell>{candidate.convocationTime}</TableCell>
              <TableCell>{candidate.examTime}</TableCell>
              {showJury ? <TableCell>{candidate.jury}</TableCell> : null}
              {showRoom ? <TableCell>{formatRoomLabel(candidate.room)}</TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function OralEafExam202605Page() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const sortedCandidates = useMemo(() => sortCandidates(oralCandidates202605), []);

  const candidatesByJury = useMemo(
    () =>
      getGroupedCandidates(sortedCandidates, (candidate) => candidate.jury).map((group) => ({
        ...group,
        candidates: sortCandidates(group.candidates),
      })),
    [sortedCandidates],
  );

  const candidatesByRoom = useMemo(
    () =>
      getGroupedCandidates(sortedCandidates, (candidate) => candidate.room).map((group) => ({
        ...group,
        candidates: sortCandidates(group.candidates),
      })),
    [sortedCandidates],
  );

  const candidatesByDate = useMemo(
    () =>
      getGroupedCandidates(sortedCandidates, (candidate) => candidate.date).map((group) => ({
        ...group,
        candidates: sortCandidates(group.candidates),
      })),
    [sortedCandidates],
  );

  const uniqueJuries = useMemo(
    () => Array.from(new Set(sortedCandidates.map((candidate) => candidate.jury))),
    [sortedCandidates],
  );

  const uniqueRooms = useMemo(
    () => Array.from(new Set(sortedCandidates.map((candidate) => candidate.room))),
    [sortedCandidates],
  );

  const uniqueDates = useMemo(
    () => Array.from(new Set(sortedCandidates.map((candidate) => candidate.date))),
    [sortedCandidates],
  );

  const totalCandidates = sortedCandidates.length;

  const jurySummaries = useMemo(
    () =>
      candidatesByJury.map(({ key, candidates }) => ({
        jury: key,
        room: candidates[0]?.room ?? "",
        dates: Array.from(new Set(candidates.map((candidate) => candidate.date))).map((date) => formatFullDate(date)),
        count: candidates.length,
      })),
    [candidatesByJury],
  );

  return (
    <ExamDashboardPageLayout action={<BackToHomeButton />}>
      <div className="space-y-10">
        <header className="space-y-4 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Oraux blancs EAF 1<sup>re</sup>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Organisation des oraux blancs EAF – 11, 12 et 13 mai 2026
            </h1>
            <p className="max-w-3xl text-lg text-slate-600">
              Retrouvez ici l'ensemble des informations pour coordonner les jurys, accueillir les candidats et suivre le
              déroulé des oraux blancs de français 1<sup>re</sup> sur les trois journées d'épreuve.
            </p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Candidats convoqués</dt>
              <dd className="mt-2 text-2xl font-bold text-slate-900">{totalCandidates}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jury mobilisés</dt>
              <dd className="mt-2 text-2xl font-bold text-slate-900">{uniqueJuries.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Salles ouvertes</dt>
              <dd className="mt-2 text-2xl font-bold text-slate-900">{uniqueRooms.length}</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jours d'épreuve</dt>
              <dd className="mt-2 text-2xl font-bold text-slate-900">{uniqueDates.length}</dd>
            </div>
          </dl>
        </header>

        <nav className="flex justify-center">
          <div className="inline-flex gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {activeTab === "overview" ? (
          <section className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Organisation générale</h2>
                <p className="text-slate-600">
                  Les oraux se déroulent sur trois journées consécutives avec un premier passage dès 8&nbsp;h. Chaque
                  candidat est attendu 30 minutes avant son passage pour l'accueil, l'installation et la préparation de la
                  salle. Merci de respecter scrupuleusement les horaires de convocation afin de garantir la fluidité de la
                  journée.
                </p>
                <ul className="list-disc space-y-2 pl-5 text-slate-600">
                  <li>Accueil des candidats au rez-de-chaussée du bâtiment des Humanités 15 minutes avant leur convocation.</li>
                  <li>Dossiers individuels et textes vus en classe à remettre au jury dès l'installation du candidat.</li>
                  <li>Un responsable de niveau est présent chaque matin pour fluidifier l'installation et gérer les imprévus.</li>
                </ul>
              </div>

              <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Points de coordination</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>
                    <span className="font-semibold text-slate-900">Référente organisation :</span> Mme S. Dupont (poste 221)
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Surveillance des couloirs :</span> Vie scolaire (planning
                    dédié affiché à l'accueil).
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Documents d'évaluation :</span> disponibles dans le
                    classeur partagé « EAF Oraux 2026 ».
                  </li>
                </ul>
              </aside>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {jurySummaries.map((summary) => (
                <div key={summary.jury} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Jury</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{summary.jury}</h3>
                  <p className="mt-2 text-sm text-slate-600">{formatRoomLabel(summary.room)} – {summary.count} candidats</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {summary.dates.map((date) => (
                      <li key={date}>{date}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Flux journalier</h2>
              <p className="text-slate-600">
                Utilisez ce découpage par journée pour organiser les pauses des jurys, vérifier les documents des candidats et
                anticiper les temps de rotation entre les salles.
              </p>
              <div className="space-y-6">
                {candidatesByDate.map(({ key, candidates }) => (
                  <div key={key} className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900">{formatFullDate(key)}</h3>
                    <CandidateTable candidates={candidates} showJury showRoom />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "jury" ? (
          <section className="space-y-8">
            {candidatesByJury.map(({ key, candidates }) => (
              <div key={key} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Jury</p>
                  <h2 className="text-2xl font-bold text-slate-900">{key}</h2>
                  <p className="text-sm text-slate-600">
                    {formatRoomLabel(candidates[0]?.room ?? "")} – {candidates.length} candidats
                  </p>
                </header>
                <div className="space-y-6">
                  {getGroupedCandidates(candidates, (candidate) => candidate.date).map(({ key: date, candidates: perDate }) => (
                    <Fragment key={date}>
                      <h3 className="text-lg font-semibold text-slate-900">{formatFullDate(date)}</h3>
                      <CandidateTable candidates={perDate} showRoom />
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {activeTab === "room" ? (
          <section className="space-y-8">
            {candidatesByRoom.map(({ key, candidates }) => (
              <div key={key} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Salle</p>
                  <h2 className="text-2xl font-bold text-slate-900">{formatRoomLabel(key)}</h2>
                  <p className="text-sm text-slate-600">
                    Jury {candidates[0]?.jury ?? ""} – {candidates.length} candidats
                  </p>
                </header>
                <div className="space-y-6">
                  {getGroupedCandidates(candidates, (candidate) => candidate.date).map(({ key: date, candidates: perDate }) => (
                    <Fragment key={date}>
                      <h3 className="text-lg font-semibold text-slate-900">{formatFullDate(date)}</h3>
                      <CandidateTable candidates={perDate} showJury />
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </ExamDashboardPageLayout>
  );
}
