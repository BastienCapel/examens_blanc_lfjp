import { useMemo } from "react";
import { createPortal } from "react-dom";

import TypeBadge from "../components/TypeBadge";
import TodayBadge from "../components/TodayBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../components/Table";
import { roomColumns, roomSchedule } from "../lib/dashboard-data";
import {
  getBlockHighlight,
  getTypeVariant,
  isDayLabelToday,
  type RoomScheduleDay,
  type RoomSession,
} from "../lib/dashboard-utils";
import { cn } from "../lib/cn";
import { useDashboardContext } from "../lib/dashboard-context";

function BlockLabel({ session }: { session: RoomSession }) {
  const highlight = getBlockHighlight(session);
  if (!session.label) {
    return null;
  }
  const classes = [
    "inline-flex",
    "items-center",
    "gap-1",
    "rounded-full",
    "px-2",
    "py-0.5",
    "text-[10px]",
    "font-semibold",
    "uppercase",
    "tracking-wide",
  ];
  if (highlight) {
    classes.push(highlight.badgeBackground, highlight.badgeText);
  } else {
    classes.push("bg-slate-200", "text-slate-600");
  }
  return <span className={classes.join(" ")}>{session.label}</span>;
}

function SessionCard({ session }: { session: RoomSession }) {
  const highlight = getBlockHighlight(session);
  const variant = getTypeVariant(session.type);
  const classes = [
    "flex",
    "flex-col",
    "items-center",
    "gap-2",
    "rounded-lg",
    "border",
    "p-3",
    variant.cardBorder,
    variant.cardBackground,
  ];

  if (highlight) {
    classes.push(highlight.background, highlight.border);
  }
  if (session.highlight) {
    classes.push("ring-2", "ring-amber-300", "shadow-sm");
  }

  const showLabel = Boolean(session.label);
  const showBadge = Boolean(session.type);
  const headerNeeded = showLabel || showBadge;

  return (
    <div className={classes.join(" ")}>
      {headerNeeded ? (
        <div
          className={`flex w-full items-center ${
            showLabel && showBadge ? "justify-between" : "justify-start"
          } gap-2`}
        >
          {showLabel ? <BlockLabel session={session} /> : null}
          {showBadge ? <div>{session.type ? <TypeBadge type={session.type} compact /> : null}</div> : null}
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-1 text-center">
        {session.time ? (
          <div className="text-xs font-semibold text-slate-700">{session.time}</div>
        ) : (
          <div className="text-xs italic text-slate-400">Horaire à confirmer</div>
        )}
        {session.teacher ? (
          <div className={`text-sm font-semibold ${variant.textColor}`}>{session.teacher}</div>
        ) : (
          <div className="text-xs italic text-slate-400">Surveillant à confirmer</div>
        )}
        {session.detail ? <div className="text-xs text-slate-600">{session.detail}</div> : null}
      </div>
    </div>
  );
}

function RoomCell({ sessions }: { sessions: RoomSession[] }) {
  if (!sessions.length) {
    return <TableCell className="text-center" />;
  }
  const containerClasses = ["flex", "flex-col", "gap-3", "justify-start"];
  if (sessions.length > 1) {
    containerClasses.push("items-stretch");
  } else {
    containerClasses.push("items-center");
  }
  return (
    <TableCell className="text-center align-top">
      <div className={containerClasses.join(" ")}>
        {sessions.map((session, index) => (
          <SessionCard key={index} session={session} />
        ))}
      </div>
    </TableCell>
  );
}

function RoomRow({ day }: { day: RoomScheduleDay }) {
  const isToday = isDayLabelToday(day.day);
  return (
    <TableRow className={cn(isToday && "bg-amber-50/70")}>
      <TableCell className="font-medium text-slate-900">
        {isToday ? (
          <div className="flex items-center gap-2">
            {day.day}
            <TodayBadge />
          </div>
        ) : (
          day.day
        )}
      </TableCell>
      {roomColumns.map((column) => (
        <RoomCell key={column} sessions={day.rooms[column] ?? []} />
      ))}
    </TableRow>
  );
}

export default function RoomsStatus() {
  const { activeView, container } = useDashboardContext();
  const rows = useMemo(() => roomSchedule, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <section
      id="room-view"
      data-view-section="room"
      role="tabpanel"
      aria-labelledby="room-tab"
      tabIndex={activeView === "room" ? 0 : -1}
      aria-hidden={activeView === "room" ? "false" : "true"}
      className={`${activeView === "room" ? "" : "hidden"} space-y-6`}
    >
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Planning par salle</h3>
        <p className="text-sm text-slate-500">
          Chaque créneau est surligné selon le bloc horaire (matin, après-midi, etc.) pour faciliter la lecture.
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell scope="col" className="rounded-l-lg">
                Jour
              </TableHeaderCell>
              {roomColumns.map((column, index) => (
                <TableHeaderCell
                  key={column}
                  scope="col"
                  className={cn(
                    "text-center",
                    index === roomColumns.length - 1 && "rounded-r-lg",
                  )}
                >
                  {column}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((day) => (
              <RoomRow key={day.day} day={day} />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>,
    container,
  );
}
