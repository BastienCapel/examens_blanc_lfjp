import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import type { BacBlancStudentEntry, PremiereBacBlancStudentEntry } from "../data";

type StudentExamSession = {
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  subject: string;
  memo: string;
};

const sanitizeFilename = (value: string): string => {
  const trimmed = value.trim().replace(/\s+/g, "-");
  return trimmed.length ? trimmed.toLowerCase() : "convocation";
};

const getExamSessionsForStudent = (student: BacBlancStudentEntry): StudentExamSession[] => [
  {
    date: "Mercredi 10 décembre 2025",
    startTime: "08h00",
    endTime: "12h00",
    room: student.philosophyRoom,
    subject: "Philosophie",
    memo: "Arrivez 30 minutes avant le début de l'épreuve et présentez votre pièce d'identité.",
  },
  {
    date: "Jeudi 11 décembre 2025",
    startTime: "08h00",
    endTime: "12h00",
    room: student.specialty1Room,
    subject: `${student.specialty1} (Spécialité N°1)`,
    memo: "Vérifiez que vous disposez du matériel spécifique demandé pour cette spécialité.",
  },
  {
    date: "Vendredi 12 décembre 2025",
    startTime: "08h00",
    endTime: "12h00",
    room: student.specialty2Room,
    subject: `${student.specialty2} (Spécialité N°2)`,
    memo: "Respectez les consignes d'installation communiquées par les surveillants de salle.",
  },
];

const createParagraph = (text: string): HTMLParagraphElement => {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  paragraph.style.margin = "0";
  paragraph.style.color = "#0f172a";
  paragraph.style.fontSize = "14px";
  paragraph.style.lineHeight = "1.6";
  return paragraph;
};

const createListItem = (session: StudentExamSession): HTMLLIElement => {
  const item = document.createElement("li");
  item.style.marginBottom = "10px";

  const headline = document.createElement("p");
  headline.textContent = `${session.date} de ${session.startTime} à ${session.endTime} en salle ${session.room}`;
  headline.style.margin = "0";
  headline.style.fontWeight = "600";
  headline.style.color = "#0f172a";

  const subject = document.createElement("p");
  subject.textContent = session.subject;
  subject.style.margin = "2px 0";
  subject.style.color = "#1d4ed8";
  subject.style.fontWeight = "600";

  const memo = document.createElement("p");
  memo.textContent = session.memo;
  memo.style.margin = "2px 0 0";
  memo.style.color = "#334155";
  memo.style.fontSize = "13px";

  item.append(headline, subject, memo);
  return item;
};

const getPremiereExamSession = (
  student: PremiereBacBlancStudentEntry,
): StudentExamSession => ({
  date: "Jeudi 11 décembre 2025",
  startTime: "14h05",
  endTime: "18h05",
  room: student.room,
  subject: "Épreuve anticipée de français (EAF)",
  memo: "Présentez-vous 30 minutes avant le début de l'épreuve avec votre pièce d'identité.",
});

const buildStudentConvocationContent = (
  student: BacBlancStudentEntry,
): HTMLDivElement => {
  const container = document.createElement("div");
  container.style.width = "794px";
  container.style.minHeight = "1123px";
  container.style.margin = "0 auto";
  container.style.padding = "48px";
  container.style.background = "#ffffff";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  container.style.color = "#0f172a";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "18px";

  const header = document.createElement("header");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const heading = document.createElement("h1");
  heading.textContent = "Convocation aux examens blancs – Décembre 2025";
  heading.style.margin = "0";
  heading.style.fontSize = "22px";
  heading.style.fontWeight = "700";
  heading.style.color = "#1d4ed8";

  const badge = document.createElement("span");
  badge.textContent = student.className;
  badge.style.padding = "8px 12px";
  badge.style.borderRadius = "9999px";
  badge.style.backgroundColor = "#eff6ff";
  badge.style.color = "#1d4ed8";
  badge.style.fontWeight = "600";
  badge.style.fontSize = "13px";

  header.append(heading, badge);

  const greeting = createParagraph(
    `Nous avons le plaisir de convoquer ${student.firstName} ${student.lastName} (${student.className}) pour les examens blancs qui se tiendront selon le calendrier suivant :`,
  );

  const list = document.createElement("ul");
  list.style.margin = "0";
  list.style.paddingLeft = "18px";
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "8px";

  getExamSessionsForStudent(student).forEach((session) => {
    list.append(createListItem(session));
  });

  const reminder = createParagraph(
    "Cette série d'évaluations est un élément crucial de votre parcours scolaire et votre présence est indispensable.",
  );

  const requirements = document.createElement("div");
  requirements.style.padding = "16px";
  requirements.style.borderRadius = "12px";
  requirements.style.backgroundColor = "#f8fafc";
  requirements.style.border = "1px solid #e2e8f0";
  requirements.style.display = "flex";
  requirements.style.flexDirection = "column";
  requirements.style.gap = "8px";

  requirements.append(
    createParagraph("Pour cet examen, vous devrez vous munir des éléments suivants :"),
  );

  const requirementsList = document.createElement("ul");
  requirementsList.style.margin = "0";
  requirementsList.style.paddingLeft = "18px";

  const requirementItems = [
    "Cette convocation.",
    "Une pièce d'identité valide.",
  ];

  requirementItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.style.marginBottom = "4px";
    requirementsList.append(li);
  });

  requirements.append(requirementsList);

  const integrity = createParagraph(
    "Nous vous rappelons également l'importance d'arriver à l'heure, d'éviter toute forme de tentative de fraude et du respect strict du règlement intérieur. Des mesures pourront être prises en cas de non-respect de ces directives.",
  );

  const closing = document.createElement("div");
  closing.style.marginTop = "12px";
  closing.style.display = "flex";
  closing.style.flexDirection = "column";
  closing.style.gap = "4px";

  closing.append(
    createParagraph("Nous comptons sur votre présence et vous souhaitons une excellente préparation."),
    createParagraph("Cordialement,"),
    createParagraph("Le proviseur"),
  );

  container.append(header, greeting, list, reminder, requirements, integrity, closing);

  return container;
};

const buildPremiereConvocationContent = (
  student: PremiereBacBlancStudentEntry,
): HTMLDivElement => {
  const container = document.createElement("div");
  container.style.width = "794px";
  container.style.minHeight = "1123px";
  container.style.margin = "0 auto";
  container.style.padding = "48px";
  container.style.background = "#ffffff";
  container.style.boxSizing = "border-box";
  container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  container.style.color = "#0f172a";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "18px";

  const header = document.createElement("header");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const heading = document.createElement("h1");
  heading.textContent = "Convocation aux examens blancs – Première";
  heading.style.margin = "0";
  heading.style.fontSize = "22px";
  heading.style.fontWeight = "700";
  heading.style.color = "#1d4ed8";

  const badge = document.createElement("span");
  badge.textContent = student.className;
  badge.style.padding = "8px 12px";
  badge.style.borderRadius = "9999px";
  badge.style.backgroundColor = "#eff6ff";
  badge.style.color = "#1d4ed8";
  badge.style.fontWeight = "600";
  badge.style.fontSize = "13px";

  header.append(heading, badge);

  const greeting = createParagraph(
    `Nous avons le plaisir de convoquer ${student.firstName} ${student.lastName} (${student.className}) pour l'épreuve anticipée de français qui se tiendra selon le calendrier suivant :`,
  );

  const session = getPremiereExamSession(student);
  const list = document.createElement("ul");
  list.style.margin = "0";
  list.style.paddingLeft = "18px";
  list.style.display = "flex";
  list.style.flexDirection = "column";
  list.style.gap = "8px";

  list.append(createListItem(session));

  const reminder = createParagraph(
    "Votre présence est indispensable pour valider cette épreuve. Pensez à vérifier votre salle et votre heure d'arrivée.",
  );

  const requirements = document.createElement("div");
  requirements.style.padding = "16px";
  requirements.style.borderRadius = "12px";
  requirements.style.backgroundColor = "#f8fafc";
  requirements.style.border = "1px solid #e2e8f0";
  requirements.style.display = "flex";
  requirements.style.flexDirection = "column";
  requirements.style.gap = "8px";

  requirements.append(createParagraph("Pour cet examen, vous devrez vous munir des éléments suivants :"));

  const requirementsList = document.createElement("ul");
  requirementsList.style.margin = "0";
  requirementsList.style.paddingLeft = "18px";

  const requirementItems = [
    "Cette convocation.",
    "Une pièce d'identité valide.",
    "Le matériel nécessaire pour l'épreuve écrite.",
  ];

  requirementItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.style.marginBottom = "4px";
    requirementsList.append(li);
  });

  requirements.append(requirementsList);

  const integrity = createParagraph(
    "Merci de respecter le règlement intérieur et les consignes de surveillance pendant toute la durée de l'épreuve.",
  );

  const closing = document.createElement("div");
  closing.style.marginTop = "12px";
  closing.style.display = "flex";
  closing.style.flexDirection = "column";
  closing.style.gap = "4px";

  closing.append(
    createParagraph("Nous vous souhaitons une excellente préparation."),
    createParagraph("Cordialement,"),
    createParagraph("Le proviseur"),
  );

  container.append(header, greeting, list, reminder, requirements, integrity, closing);

  return container;
};

const appendConvocationPage = async (
  pdf: jsPDF,
  student: BacBlancStudentEntry,
  isFirstPage: boolean,
): Promise<void> => {
  const content = buildStudentConvocationContent(student);
  document.body.appendChild(content);

  try {
    const canvas = await html2canvas(content, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const renderWidth = canvas.width;
    const renderHeight = canvas.height;
    const ratio = Math.min(pageWidth / renderWidth, pageHeight / renderHeight);
    const width = renderWidth * ratio;
    const height = renderHeight * ratio;
    const offsetX = (pageWidth - width) / 2;
    const offsetY = (pageHeight - height) / 2;

    if (!isFirstPage) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "PNG", offsetX, offsetY, width, height);
  } finally {
    content.remove();
  }
};

const appendPremiereConvocationPage = async (
  pdf: jsPDF,
  student: PremiereBacBlancStudentEntry,
  isFirstPage: boolean,
): Promise<void> => {
  const content = buildPremiereConvocationContent(student);
  document.body.appendChild(content);

  try {
    if (!isFirstPage) {
      pdf.addPage();
    }

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgRatio = imgProps.width / imgProps.height;
    const pdfRatio = pdfWidth / pdfHeight;
    let width = pdfWidth;
    let height = pdfHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > pdfRatio) {
      height = width / imgRatio;
      offsetY = (pdfHeight - height) / 2;
    } else {
      width = height * imgRatio;
      offsetX = (pdfWidth - width) / 2;
    }

    pdf.addImage(imgData, "PNG", offsetX, offsetY, width, height);
  } finally {
    content.remove();
  }
};

export async function downloadStudentConvocation(
  student: BacBlancStudentEntry,
): Promise<void> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  await appendConvocationPage(pdf, student, true);
  pdf.save(`convocation-${sanitizeFilename(student.lastName)}-${sanitizeFilename(student.firstName)}.pdf`);
}

export async function downloadStudentConvocationsForClass(
  students: BacBlancStudentEntry[],
  className: string,
): Promise<void> {
  if (!students.length) {
    throw new Error("Aucun élève pour cette classe");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  for (const [index, student] of students.entries()) {
    // eslint-disable-next-line no-await-in-loop
    await appendConvocationPage(pdf, student, index === 0);
  }
  pdf.save(`convocations-${sanitizeFilename(className)}.pdf`);
}

export async function downloadAllStudentConvocations(
  students: BacBlancStudentEntry[],
): Promise<void> {
  if (!students.length) {
    throw new Error("Aucun élève disponible");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  for (const [index, student] of students.entries()) {
    // eslint-disable-next-line no-await-in-loop
    await appendConvocationPage(pdf, student, index === 0);
  }
  pdf.save("convocations-bac-blanc-decembre.pdf");
}

export async function downloadPremiereStudentConvocationsForClass(
  students: PremiereBacBlancStudentEntry[],
  className: string,
): Promise<void> {
  if (!students.length) {
    throw new Error("Aucun élève pour cette classe");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  for (const [index, student] of students.entries()) {
    // eslint-disable-next-line no-await-in-loop
    await appendPremiereConvocationPage(pdf, student, index === 0);
  }
  pdf.save(`convocations-premiere-${sanitizeFilename(className)}.pdf`);
}

export async function downloadAllPremiereStudentConvocations(
  students: PremiereBacBlancStudentEntry[],
): Promise<void> {
  if (!students.length) {
    throw new Error("Aucun élève disponible");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  for (const [index, student] of students.entries()) {
    // eslint-disable-next-line no-await-in-loop
    await appendPremiereConvocationPage(pdf, student, index === 0);
  }
  pdf.save("convocations-premiere-eaf.pdf");
}
