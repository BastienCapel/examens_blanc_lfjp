import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  Calculator,
  Calendar,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Clock,
  Clock3,
  Info,
  LayoutGrid,
  MapPin,
  Settings,
  Sun,
  UserCheck,
  Users,
  Users2,
} from "lucide-react";

export type TeacherCivility = "Madame" | "Monsieur";
export type TeacherGender = "female" | "male";

export interface TeacherDirectoryEntry {
  civility: TeacherCivility;
  gender: TeacherGender;
  lastName: string;
  firstName: string;
  shortName: string;
}

type TeacherDirectorySourceEntry = {
  civility: TeacherCivility;
  lastName: string;
  firstName: string;
};

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const createShortName = (lastName: string, firstName: string): string => {
  const normalizedLastName = normalizeWhitespace(lastName).toUpperCase();
  const normalizedFirstName = normalizeWhitespace(firstName);
  if (!normalizedFirstName) {
    return normalizedLastName;
  }
  const initial = normalizedFirstName.charAt(0).toUpperCase();
  return `${normalizedLastName} ${initial}.`;
};

const teacherDirectorySource: TeacherDirectorySourceEntry[] = [
  { civility: "Madame", lastName: "MICHON GUILLAUME", firstName: "Mathilde" },
  { civility: "Madame", lastName: "MOURAIN DIOP", firstName: "Fanelly" },
  { civility: "Monsieur", lastName: "NDOYE", firstName: "Abdoulaye" },
  { civility: "Monsieur", lastName: "SERVATE", firstName: "Samuel" },
];

export const teacherDirectory: TeacherDirectoryEntry[] = teacherDirectorySource.map((entry) => {
  const civility = entry.civility;
  const gender: TeacherGender = civility === "Madame" ? "female" : "male";
  const lastName = normalizeWhitespace(entry.lastName).toUpperCase();
  const firstName = normalizeWhitespace(entry.firstName);
  return {
    civility,
    gender,
    lastName,
    firstName,
    shortName: createShortName(lastName, firstName),
  };
});

export const teacherDirectoryByShortName: Record<string, TeacherDirectoryEntry> =
  teacherDirectory.reduce((acc, entry) => {
    acc[entry.shortName] = entry;
    return acc;
  }, {} as Record<string, TeacherDirectoryEntry>);

export type SurveillanceType = "mathematiques" | "support";

export interface TypeVariant {
  label: string;
  icon: LucideIcon;
  badgeClasses: string;
  iconColor: string;
  cardBorder: string;
  cardBackground: string;
  textColor: string;
}

export const typeVariants: Record<string, TypeVariant> = {
  mathematiques: {
    label: "Mathématiques",
    icon: Calculator,
    badgeClasses: "bg-sky-100 text-sky-800",
    iconColor: "text-sky-600",
    cardBorder: "border-sky-200",
    cardBackground: "bg-white",
    textColor: "text-sky-900",
  },
  support: {
    label: "Renfort",
    icon: Users2,
    badgeClasses: "bg-amber-100 text-amber-800",
    iconColor: "text-amber-600",
    cardBorder: "border-amber-200",
    cardBackground: "bg-amber-50",
    textColor: "text-amber-800",
  },
  default: {
    label: "Épreuve",
    icon: CalendarDays,
    badgeClasses: "bg-slate-100 text-slate-700",
    iconColor: "text-slate-600",
    cardBorder: "border-slate-200",
    cardBackground: "bg-white",
    textColor: "text-slate-700",
  },
};

export interface KeyFigure {
  value: string;
  label: string;
  unit?: string;
  extra?: string;
}

export const keyFigures: KeyFigure[] = [
  { value: "4", label: "Salles mobilisées" },
  { value: "52", label: "Candidats inscrits" },
  { value: "09h00", label: "Heure de début", extra: "Accueil des élèves dès 8h30" },
  { value: "4", unit: "h", label: "Durée de l'épreuve", extra: "Épreuve écrite de mathématiques" },
];

export interface AccommodationGroup {
  icon: { Icon: LucideIcon; bg: string; color: string };
  title: string;
  description: string;
  students: string[];
  note?: string;
  noteClasses?: string;
}

export const accommodationGroups: AccommodationGroup[] = [
  {
    icon: { Icon: Users2, bg: "bg-emerald-100", color: "text-emerald-600" },
    title: "Terminale – Aménagements prévus",
    description: "Élèves bénéficiant d'un tiers temps ou de dispositions particulières :",
    students: [
      "À compléter si nécessaire",
    ],
    note: "Informer la vie scolaire de tout besoin complémentaire au plus tard le 6 février.",
    noteClasses: "bg-amber-100/80 text-amber-900",
  },
];

export interface SurveillanceMission {
  teacher: string;
  datetime: string;
  room: string;
  mission: string;
  duration: string;
  type: SurveillanceType;
}

export const surveillanceSchedule: SurveillanceMission[] = [
  {
    teacher: "MICHON GUILLAUME M.",
    datetime: "vendredi 13/02 à 09h00",
    room: "S14",
    mission: "Bac blanc de mathématiques",
    duration: "4:00:00",
    type: "mathematiques",
  },
  {
    teacher: "MOURAIN DIOP F.",
    datetime: "vendredi 13/02 à 09h00",
    room: "S10",
    mission: "Bac blanc de mathématiques",
    duration: "4:00:00",
    type: "mathematiques",
  },
  {
    teacher: "NDOYE A.",
    datetime: "vendredi 13/02 à 09h00",
    room: "S12",
    mission: "Bac blanc de mathématiques",
    duration: "4:00:00",
    type: "mathematiques",
  },
  {
    teacher: "SERVATE S.",
    datetime: "vendredi 13/02 à 09h00",
    room: "S11 COOP",
    mission: "Bac blanc de mathématiques",
    duration: "4:00:00",
    type: "mathematiques",
  },
];

export const roomColumns = ["S10", "S12", "S11 COOP", "S14"] as const;

export type RoomColumn = (typeof roomColumns)[number];

export interface RoomSession {
  time?: string;
  teacher?: string;
  detail?: string;
  type?: SurveillanceType;
  label?: string;
  highlight?: boolean;
}

export interface RoomScheduleDay {
  day: string;
  rooms: Record<RoomColumn, RoomSession[]>;
}

export const roomSchedule: RoomScheduleDay[] = [
  {
    day: "Vendredi 13/02",
    rooms: {
      S10: [
        {
          time: "09h00 - 13h00",
          teacher: "MOURAIN DIOP F.",
          detail: "Mathématiques",
          type: "mathematiques",
          highlight: true,
        },
      ],
      S12: [
        {
          time: "09h00 - 13h00",
          teacher: "NDOYE A.",
          detail: "Mathématiques",
          type: "mathematiques",
          highlight: true,
        },
      ],
      "S11 COOP": [
        {
          time: "09h00 - 13h00",
          teacher: "SERVATE S.",
          detail: "Mathématiques",
          type: "mathematiques",
          highlight: true,
        },
      ],
      S14: [
        {
          time: "09h00 - 13h00",
          teacher: "MICHON G. M.",
          detail: "Mathématiques",
          type: "mathematiques",
          highlight: true,
        },
      ],
    },
  },
];

export interface DashboardTab {
  id: "setup" | "teacher" | "convocation" | "room" | "day";
  label: string;
  Icon: LucideIcon;
}

export const dashboardTabs: DashboardTab[] = [
  { id: "setup", label: "Paramétrage des salles", Icon: Settings },
  { id: "teacher", label: "Vue par enseignant", Icon: Users },
  { id: "convocation", label: "Convocations", Icon: ClipboardList },
  { id: "room", label: "Vue par salle", Icon: LayoutGrid },
  { id: "day", label: "Vue par jour", Icon: Calendar },
];

export const infoIcon = Info;
export const alertTriangleIcon = AlertTriangle;
export const todayIcon = Sun;
export const calendarClockIcon = CalendarClock;
export const mapPinIcon = MapPin;
export const clock3Icon = Clock3;
export const clipboardListIcon = ClipboardList;
export const alertCircleIcon = AlertCircle;
export const clockIcon = Clock;
