import { jsPDF } from "jspdf";

import {
  teacherDirectoryByShortName,
  typeVariants,
} from "./dashboard-data";
import {
  formatDuration,
  parseDuration,
  type TeacherScheduleGroup,
} from "./dashboard-utils";

const PAGE_MARGIN_X = 20;
const PAGE_MARGIN_Y = 20;
const SUMMARY_BOX_HEIGHT = 20;

function getTeacherDetails(group: TeacherScheduleGroup) {
  const teacherEntry = teacherDirectoryByShortName[group.teacher];
  const salutation = teacherEntry?.civility ?? "Madame, Monsieur";
  const teacherDisplayName = teacherEntry
    ? `${teacherEntry.firstName} ${teacherEntry.lastName}`
    : group.teacher;
  const invitationSentence = teacherEntry
    ? teacherEntry.gender === "female"
      ? "Vous êtes conviée"
      : "Vous êtes convié"
    : "Vous êtes convié(e)";

  return {
    salutation,
    teacherDisplayName,
    invitationSentence,
  };
}

function addHeader(pdf: jsPDF) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Convocation de surveillance", PAGE_MARGIN_X, PAGE_MARGIN_Y);
}

function addIntro(
  pdf: jsPDF,
  group: TeacherScheduleGroup,
  startY: number,
): number {
  const { salutation, teacherDisplayName, invitationSentence } =
    getTeacherDetails(group);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);

  const introLines = pdf.splitTextToSize(
    `${salutation} ${teacherDisplayName},\n${invitationSentence} à assurer les surveillances suivantes dans le cadre du baccalauréat blanc. Retrouvez ci-dessous les horaires, salles, épreuves et fonctions associées à chaque mission.`,
    pdf.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2,
  );
  pdf.text(introLines, PAGE_MARGIN_X, startY + 8);

  return startY + 8 + introLines.length * 6 + 4;
}

function measureMissionHeight(
  pdf: jsPDF,
  mission: TeacherScheduleGroup["missions"][number],
): number {
  const availableWidth = pdf.internal.pageSize.getWidth() - PAGE_MARGIN_X * 2;
  const missionLabelLines = pdf.splitTextToSize(`Épreuve / fonction : ${mission.mission}`, availableWidth);
  const roomLabel = mission.room && mission.room.trim() !== "-" ? mission.room : "Salle à confirmer";
  const roomLines = pdf.splitTextToSize(`Salle : ${roomLabel}`, availableWidth);

  return 6 + missionLabelLines.length * 5 + roomLines.length * 5 + 5 + 5 + 8 + 8;
}

function addMission(
  pdf: jsPDF,
  mission: TeacherScheduleGroup["missions"][number],
  cursorY: number,
): number {
  const width = pdf.internal.pageSize.getWidth();
  const availableWidth = width - PAGE_MARGIN_X * 2;
  const roomLabel = mission.room && mission.room.trim() !== "-" ? mission.room : "Salle à confirmer";
  const typeLabel = typeVariants[mission.type ?? ""]?.label ?? typeVariants.default.label;
  const duration = mission.duration ? formatDuration(parseDuration(mission.duration)) : "Durée à préciser";

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(mission.datetime, PAGE_MARGIN_X, cursorY);
  cursorY += 6;

  pdf.setFont("helvetica", "normal");
  const missionLabelLines = pdf.splitTextToSize(`Épreuve / fonction : ${mission.mission}`, availableWidth);
  missionLabelLines.forEach((line) => {
    pdf.text(line, PAGE_MARGIN_X + 2, cursorY);
    cursorY += 5;
  });

  const roomLines = pdf.splitTextToSize(`Salle : ${roomLabel}`, availableWidth);
  roomLines.forEach((line) => {
    pdf.text(line, PAGE_MARGIN_X + 2, cursorY);
    cursorY += 5;
  });

  pdf.text(`Fonction : ${typeLabel}`, PAGE_MARGIN_X + 2, cursorY);
  cursorY += 5;
  pdf.text(`Durée : ${duration}`, PAGE_MARGIN_X + 2, cursorY);
  cursorY += 8;

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.4);
  pdf.line(PAGE_MARGIN_X, cursorY, width - PAGE_MARGIN_X, cursorY);
  cursorY += 8;

  return cursorY;
}

function addSummary(
  pdf: jsPDF,
  group: TeacherScheduleGroup,
  cursorY: number,
): number {
  const width = pdf.internal.pageSize.getWidth();
  const boxTop = cursorY;
  const boxHeight = SUMMARY_BOX_HEIGHT;

  pdf.setDrawColor(59, 130, 246);
  pdf.setFillColor(219, 234, 254);
  pdf.setLineWidth(0.6);
  pdf.rect(PAGE_MARGIN_X, boxTop, width - PAGE_MARGIN_X * 2, boxHeight, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(37, 99, 235);
  pdf.text("Récapitulatif", PAGE_MARGIN_X + 4, boxTop + 8);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  const totalDuration = group.missions.reduce(
    (sum, mission) => sum + parseDuration(mission.duration),
    0,
  );
  const summaryText = `${group.missions.length} mission${group.missions.length > 1 ? "s" : ""} – Charge totale estimée : ${formatDuration(totalDuration)}.`;
  pdf.text(summaryText, PAGE_MARGIN_X + 4, boxTop + 16);

  pdf.setTextColor(15, 23, 42);
  return boxTop + boxHeight + 12;
}

function addClosing(pdf: jsPDF, cursorY: number): number {
  const width = pdf.internal.pageSize.getWidth();
  const closingLines = pdf.splitTextToSize(
    "Nous vous remercions pour votre disponibilité et restons à votre disposition pour toute question relative à cette convocation.",
    width - PAGE_MARGIN_X * 2,
  );
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(closingLines, PAGE_MARGIN_X, cursorY);
  return cursorY + closingLines.length * 5 + 10;
}

function drawSignature(pdf: jsPDF, cursorY: number) {
  const signatureX = PAGE_MARGIN_X;
  const signatureY = cursorY + 12;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Le Proviseur", signatureX, cursorY + 4);

  pdf.setDrawColor(71, 85, 105);
  pdf.setLineWidth(1);
  const signatureStroke = [
    [15, -14],
    [20, 18],
    [18, -10],
    [16, 8],
    [18, -6],
    [20, 10],
  ];
  pdf.lines(signatureStroke, signatureX, signatureY, [1, 1], "S", false);
  pdf.line(signatureX, signatureY + 6, signatureX + 55, signatureY + 6);

  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text("Signature", signatureX, signatureY + 12);

  return signatureY + 18;
}

function addConvocationPage(pdf: jsPDF, group: TeacherScheduleGroup) {
  addHeader(pdf);
  let cursorY = addIntro(pdf, group, PAGE_MARGIN_Y + 10);

  for (const mission of group.missions) {
    if (!mission) continue;
    const availableHeight =
      pdf.internal.pageSize.getHeight() - PAGE_MARGIN_Y - SUMMARY_BOX_HEIGHT - 40;
    const missionHeight = measureMissionHeight(pdf, mission);
    if (cursorY + missionHeight > availableHeight) {
      pdf.addPage();
      addHeader(pdf);
      cursorY = addIntro(pdf, group, PAGE_MARGIN_Y + 10);
    }
    cursorY = addMission(pdf, mission, cursorY);
  }

  cursorY = addSummary(pdf, group, cursorY);
  cursorY = addClosing(pdf, cursorY);
  drawSignature(pdf, cursorY);
}

function normalizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function downloadConvocationPdf(group: TeacherScheduleGroup) {
  if (!group.missions.length) {
    return;
  }
  const pdf = new jsPDF();
  addConvocationPage(pdf, group);
  const fileName = normalizeFileName(group.teacher || "convocation");
  pdf.save(`convocation-${fileName || "surveillant"}.pdf`);
}

export function downloadAllConvocationsPdf(groups: TeacherScheduleGroup[]) {
  const exportableGroups = groups.filter((group) => group.teacher && group.missions.length);
  if (!exportableGroups.length) {
    return;
  }
  const pdf = new jsPDF();
  exportableGroups.forEach((group, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    addConvocationPage(pdf, group);
  });
  pdf.save("convocations-surveillants.pdf");
}
