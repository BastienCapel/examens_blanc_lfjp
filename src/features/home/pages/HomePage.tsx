import { CalendarDays, GraduationCap } from "lucide-react";

import HomeCallToActionCard from "../components/HomeCallToActionCard";
import HomeEventMeta from "../components/HomeEventMeta";
import HomeHero from "../components/HomeHero";
import HomeLayout from "../components/HomeLayout";
import { HOME_CALLOUT_ENTRIES, HOME_PAGE_CONTENT } from "../constants";

export default function HomePage() {
  return (
    <HomeLayout>
      <HomeHero
        logos={HOME_PAGE_CONTENT.logos}
        subtitle={HOME_PAGE_CONTENT.subtitle}
        title={HOME_PAGE_CONTENT.title}
        description={HOME_PAGE_CONTENT.description}
      />

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        {HOME_CALLOUT_ENTRIES.map((entry) => (
          <HomeCallToActionCard
            key={entry.to}
            to={entry.to}
            icon={GraduationCap}
            iconLabel={entry.iconLabel}
            subtitle={entry.subtitle}
            title={entry.title}
            description={entry.description}
            footerLabel={entry.footerLabel}
            meta={<HomeEventMeta icon={CalendarDays} label={entry.dateLabel} description="" />}
          />
        ))}
      </div>
    </HomeLayout>
  );
}
