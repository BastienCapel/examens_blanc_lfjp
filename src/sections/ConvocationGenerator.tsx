import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import TypeBadge from "../components/TypeBadge";
import {
  alertCircleIcon,
  calendarClockIcon,
  clipboardListIcon,
  mapPinIcon,
  surveillanceSchedule,
  typeVariants,
  teacherDirectoryByShortName,
} from "../lib/dashboard-data";
import {
  buildTeacherSchedule,
  formatDuration,
  parseDuration,
  type TeacherScheduleGroup,
} from "../lib/dashboard-utils";
import { useDashboardContext } from "../lib/dashboard-context";
import { downloadConvocationPdf } from "../lib/convocation-pdf";

const CalendarClockIcon = calendarClockIcon;
const MapPinIcon = mapPinIcon;
const ClipboardListIcon = clipboardListIcon;
const AlertCircleIcon = alertCircleIcon;

type TeacherOption = {
  value: string;
  label: string;
};

function ConvocationMission({ mission }: { mission: TeacherScheduleGroup["missions"][number] }) {
  const roomLabel = mission.room && mission.room.trim() !== "-" ? mission.room : "Salle à confirmer";
  const typeLabel = typeVariants[mission.type ?? ""]?.label ?? typeVariants.default.label;
  const duration = mission.duration ? formatDuration(parseDuration(mission.duration)) : "Durée à préciser";

  return (
    <li className="rounded-lg border border-slate-200 bg-white/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-800">
        <span className="inline-flex items-center gap-2">
          <CalendarClockIcon className="h-4 w-4 text-slate-500" />
          {mission.datetime}
        </span>
        <TypeBadge type={mission.type} compact />
      </div>
      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <MapPinIcon className="mt-0.5 h-4 w-4 text-slate-400" />
          <span>
            <span className="font-semibold text-slate-700">Salle :</span> {roomLabel}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <ClipboardListIcon className="mt-0.5 h-4 w-4 text-slate-400" />
          <span>
            <span className="font-semibold text-slate-700">Épreuve / fonction :</span> {mission.mission}
          </span>
        </div>
        <div className="pl-6 text-xs uppercase tracking-wide text-slate-500">Fonction : {typeLabel}</div>
        <div className="pl-6 text-xs uppercase tracking-wide text-slate-500">Durée : {duration}</div>
      </div>
    </li>
  );
}

export default function ConvocationGenerator() {
  const { activeView, container } = useDashboardContext();

  const scheduleByTeacher = useMemo(
    () => buildTeacherSchedule(surveillanceSchedule),
    [],
  );

  const assignedTeacherGroups = useMemo(() => {
    return scheduleByTeacher.filter(
      (group) => group.teacher && group.teacher !== "À assigner" && group.missions.length > 0,
    );
  }, [scheduleByTeacher]);

  const teacherOptions = useMemo<TeacherOption[]>(() => {
    return assignedTeacherGroups.map((group) => {
      const entry = teacherDirectoryByShortName[group.teacher];
      const label = entry ? `${entry.firstName} ${entry.lastName}` : group.teacher;
      return { value: group.teacher, label };
    });
  }, [assignedTeacherGroups]);

  const defaultTeacher = teacherOptions[0]?.value ?? "";
  const [selectedTeacher, setSelectedTeacher] = useState<string>(defaultTeacher);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  useEffect(() => {
    if (!teacherOptions.length) {
      setSelectedTeacher("");
      return;
    }
    const exists = teacherOptions.some((option) => option.value === selectedTeacher);
    if (!exists) {
      setSelectedTeacher(defaultTeacher);
    }
  }, [defaultTeacher, selectedTeacher, teacherOptions]);

  const selectedGroup = useMemo(() => {
    return scheduleByTeacher.find((group) => group.teacher === selectedTeacher) ?? null;
  }, [scheduleByTeacher, selectedTeacher]);

  const totalDuration = useMemo(() => {
    if (!selectedGroup) {
      return 0;
    }
    return selectedGroup.missions.reduce(
      (sum, mission) => sum + parseDuration(mission.duration),
      0,
    );
  }, [selectedGroup]);

  if (!container) {
    return null;
  }

  const hasMissions = Boolean(selectedGroup && selectedGroup.missions.length);
  const teacherEntry = selectedGroup
    ? teacherDirectoryByShortName[selectedGroup.teacher]
    : undefined;
  const salutation = teacherEntry?.civility ?? "Madame, Monsieur";
  const teacherDisplayName = teacherEntry
    ? `${teacherEntry.firstName} ${teacherEntry.lastName}`
    : selectedGroup?.teacher ?? "";
  const invitationSentence = teacherEntry
    ? teacherEntry.gender === "female"
      ? "Vous êtes conviée"
      : "Vous êtes convié"
    : "Vous êtes convié(e)";

  const handleDownload = async () => {
    if (!selectedGroup || !hasMissions || isGeneratingPdf || isGeneratingAll) {
      return;
    }
    try {
      setIsGeneratingPdf(true);
      await downloadConvocationPdf(selectedGroup, teacherEntry);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Impossible de générer la convocation. Veuillez réessayer.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadAll = async () => {
    if (isGeneratingAll || isGeneratingPdf) {
      return;
    }
    if (!assignedTeacherGroups.length) {
      alert("Aucune convocation disponible pour le téléchargement.");
      return;
    }
    try {
      setIsGeneratingAll(true);
      for (const group of assignedTeacherGroups) {
        const entry = teacherDirectoryByShortName[group.teacher];
        await downloadConvocationPdf(group, entry);
      }
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Impossible de générer la convocation. Veuillez réessayer.");
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return createPortal(
    <section
      id="convocation-view"
      data-view-section="convocation"
      role="tabpanel"
      aria-labelledby="convocation-tab"
      tabIndex={activeView === "convocation" ? 0 : -1}
      aria-hidden={activeView === "convocation" ? "false" : "true"}
      className={`${activeView === "convocation" ? "" : "hidden"} space-y-6`}
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">Générateur de convocation</h3>
        <p className="text-sm text-slate-500">
          Sélectionnez un surveillant pour obtenir une convocation prête à être envoyée avec toutes les informations clés.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="convocation-teacher" className="text-sm font-medium text-slate-700">
          Surveillant
        </label>
        <select
          id="convocation-teacher"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={selectedTeacher}
          onChange={(event) => setSelectedTeacher(event.target.value)}
        >
          {teacherOptions.length === 0 ? (
            <option value="">Aucun surveillant disponible</option>
          ) : null}
          {teacherOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        {hasMissions && selectedGroup ? (
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <div className="space-y-1 text-slate-600">
              <p>
                {salutation} <span className="font-semibold text-slate-900">{teacherDisplayName}</span>,
              </p>
              <p>
                {invitationSentence} à assurer les surveillances suivantes dans le cadre du baccalauréat blanc. Retrouvez ci-dessous les horaires, salles, épreuves et fonctions associées à chaque mission.
              </p>
            </div>
            <ul className="space-y-3">
              {selectedGroup.missions.map((mission, index) => (
                <ConvocationMission key={`${selectedGroup.teacher}-${index}`} mission={mission} />
              ))}
            </ul>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold">Récapitulatif</p>
              <p>
                {selectedGroup.missions.length} mission{selectedGroup.missions.length > 1 ? "s" : ""} – Charge totale estimée : {formatDuration(totalDuration)}.
              </p>
            </div>
            <p>
              Nous vous remercions pour votre disponibilité et restons à votre disposition pour toute question relative à cette convocation.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!hasMissions || isGeneratingPdf || isGeneratingAll}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isGeneratingPdf ? "Génération en cours..." : "Télécharger la convocation (PDF)"}
              </button>
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isGeneratingPdf || isGeneratingAll}
                className="inline-flex items-center justify-center rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isGeneratingAll
                  ? "Téléchargement de toutes les convocations..."
                  : "Télécharger toutes les convocations (PDF)"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500">
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
            Sélectionnez un surveillant pour générer automatiquement sa convocation.
          </div>
        )}
      </div>
    </section>,
    container,
  );
}
