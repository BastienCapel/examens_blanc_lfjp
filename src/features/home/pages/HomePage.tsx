import { CalendarDays, Calculator, GraduationCap } from "lucide-react";

import HomeCallToActionCard from "../components/HomeCallToActionCard";
import HomeEventMeta from "../components/HomeEventMeta";
import HomeHero from "../components/HomeHero";
import HomeLayout from "../components/HomeLayout";
import type { HomeCalloutEntry } from "../constants";
import { HOME_CALLOUT_ENTRIES, HOME_PAGE_CONTENT } from "../constants";

export default function HomePage() {
  const calloutEntries = [...HOME_CALLOUT_ENTRIES].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const iconByCategory: Record<HomeCalloutEntry["category"], typeof GraduationCap> = {
    general: GraduationCap,
    math: Calculator,
  };

  return (
    <HomeLayout>
      <HomeHero
        logos={HOME_PAGE_CONTENT.logos}
        subtitle={HOME_PAGE_CONTENT.subtitle}
        title={HOME_PAGE_CONTENT.title}
        description={HOME_PAGE_CONTENT.description}
      />

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        {calloutEntries.map((entry) => {
          const Icon = iconByCategory[entry.category];
          return (
            <HomeCallToActionCard
              key={entry.to}
              to={entry.to}
              icon={Icon}
              iconLabel={entry.iconLabel}
              subtitle={entry.subtitle}
              title={entry.title}
              footerLabel={entry.footerLabel}
              meta={<HomeEventMeta icon={CalendarDays} label={entry.dateLabel} description="" />}
            />
          );
        })}
      </div>
    </HomeLayout>
  );
}
