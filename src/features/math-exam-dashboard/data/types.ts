import type { LucideIcon } from "lucide-react";

export type TeacherCivility = "Madame" | "Monsieur";
export type TeacherGender = "female" | "male";

export interface TeacherDirectoryEntry {
  civility: TeacherCivility;
  gender: TeacherGender;
  lastName: string;
  firstName: string;
  shortName: string;
}

export interface TeacherDirectorySourceEntry {
  civility: TeacherCivility;
  lastName: string;
  firstName: string;
}

export type SurveillanceType =
  | "mathematiques"
  | "support"
  | "eaf"
  | "specialite"
  | "philosophie";

export interface TypeVariant {
  label: string;
  icon: LucideIcon;
  badgeClasses: string;
  iconColor: string;
  cardBorder: string;
  cardBackground: string;
  textColor: string;
}

export interface KeyFigure {
  value: string;
  label: string;
  unit?: string;
  extra?: string;
}

export interface AccommodationGroup {
  icon: { Icon: LucideIcon; bg: string; color: string };
  title: string;
  description: string;
  students: string[];
  note?: string;
  noteClasses?: string;
}

export interface SurveillanceMission {
  teacher: string;
  datetime: string;
  room: string;
  mission: string;
  duration: string;
  type: SurveillanceType;
}

export type RoomColumn = string;

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

export interface DashboardTab {
  id: "setup" | "teacher" | "convocation" | "room" | "day";
  label: string;
  Icon: LucideIcon;
}

export interface ExamRoom {
  name: string;
  examCapacity: number;
}

export interface MathExamDashboardData {
  header: {
    title: string;
    date: string;
    subtitle?: string;
    reprographyDeadline?: {
      date: string;
      label: string;
    };
  };
  keyFigures: KeyFigure[];
  accommodationGroups: AccommodationGroup[];
  teacherDirectory: TeacherDirectoryEntry[];
  teacherDirectoryByShortName: Record<string, TeacherDirectoryEntry>;
  surveillanceSchedule: SurveillanceMission[];
  roomColumns: RoomColumn[];
  roomSchedule: RoomScheduleDay[];
  examRooms: ExamRoom[];
  defaultStudentCount: number;
  typeVariants: Record<string, TypeVariant>;
  dashboardTabs: DashboardTab[];
}
