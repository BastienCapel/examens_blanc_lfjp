import { CalendarDays, Film, GraduationCap } from "lucide-react";

import HomeCallToActionCard from "../components/HomeCallToActionCard";
import HomeEventMeta from "../components/HomeEventMeta";
import HomeHero from "../components/HomeHero";
import HomeLayout from "../components/HomeLayout";
import {
  HOME_DASHBOARD_ENTRY,
  HOME_ORIENTATION_FILM_ENTRY,
  HOME_PAGE_CONTENT,
} from "../constants";

export default function HomePage() {
  return (
    <HomeLayout>
      <HomeHero
        logos={HOME_PAGE_CONTENT.logos}
        subtitle={HOME_PAGE_CONTENT.subtitle}
        title={HOME_PAGE_CONTENT.title}
        description={HOME_PAGE_CONTENT.description}
      />

      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <HomeCallToActionCard
          to={HOME_DASHBOARD_ENTRY.to}
          icon={GraduationCap}
          iconLabel={HOME_DASHBOARD_ENTRY.iconLabel}
          subtitle={HOME_DASHBOARD_ENTRY.subtitle}
          title={HOME_DASHBOARD_ENTRY.title}
          description={HOME_DASHBOARD_ENTRY.description}
          footerLabel={HOME_DASHBOARD_ENTRY.footerLabel}
          meta={
            <HomeEventMeta
              icon={CalendarDays}
              label={HOME_DASHBOARD_ENTRY.dateLabel}
              description=""
            />
          }
        />

        <HomeCallToActionCard
          to={HOME_ORIENTATION_FILM_ENTRY.to}
          icon={Film}
          iconLabel={HOME_ORIENTATION_FILM_ENTRY.iconLabel}
          subtitle={HOME_ORIENTATION_FILM_ENTRY.subtitle}
          title={HOME_ORIENTATION_FILM_ENTRY.title}
          description={HOME_ORIENTATION_FILM_ENTRY.description}
          footerLabel={HOME_ORIENTATION_FILM_ENTRY.footerLabel}
          meta={
            <HomeEventMeta
              icon={CalendarDays}
              label={HOME_ORIENTATION_FILM_ENTRY.dateLabel}
              description="Film annuel orientation 3e"
            />
          }
        />
      </div>
    </HomeLayout>
  );
}
