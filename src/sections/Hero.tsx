import {
  accommodationGroups,
  alertTriangleIcon,
  infoIcon,
  keyFigures,
} from "../lib/dashboard-data";
import type {
  AccommodationGroup,
  KeyFigure,
} from "../lib/dashboard-utils";

const InfoIcon = infoIcon;
const AlertTriangleIcon = alertTriangleIcon;

function KeyFigureItem({ figure }: { figure: KeyFigure }) {
  return (
    <div>
      <p className="text-4xl font-bold text-blue-600">
        {figure.value}
        {figure.unit ? <span className="text-2xl">{figure.unit}</span> : null}
      </p>
      <p className="mt-1 text-sm text-slate-500">{figure.label}</p>
      {figure.extra ? (
        <p className="mt-1 text-xs text-slate-400">{figure.extra}</p>
      ) : null}
    </div>
  );
}

function KeyFiguresCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-full bg-blue-100 p-3">
          <InfoIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold">Informations Clés</h3>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-4 text-center">
        {keyFigures.map((figure) => (
          <KeyFigureItem key={`${figure.label}-${figure.value}`} figure={figure} />
        ))}
      </div>
    </div>
  );
}

function AccommodationCard({ group }: { group: AccommodationGroup }) {
  const { Icon, bg, color } = group.icon;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center gap-4">
        <div className={`${bg} rounded-full p-3`}>
          <Icon className={`${color} h-6 w-6`} />
        </div>
        <h3 className="text-xl font-semibold">{group.title}</h3>
      </div>
      <div className="text-slate-700">
        <p className="mb-2 font-medium">{group.description}</p>
        <p className="mb-4 text-sm">{group.students.join(", ")}</p>
        <p className="mb-2">
          <span className="font-semibold">Salles :</span> {group.rooms}
        </p>
        {group.note ? (
          <div
            className={`mt-4 flex items-center rounded-lg p-3 text-sm ${
              group.noteClasses ?? ""
            }`}
          >
            <AlertTriangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span>{group.note}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-labelledby="overview-title" className="space-y-4">
      <h2 id="overview-title" className="sr-only">
        Informations générales
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KeyFiguresCard />
        {accommodationGroups.map((group) => (
          <AccommodationCard key={group.title} group={group} />
        ))}
      </div>
    </section>
  );
}
