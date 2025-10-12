export const HOME_PAGE_CONTENT = {
  logos: [
    {
      src: "https://i.imgur.com/0YmGlXO.png",
      alt: "Logo de l'AEFE",
    },
  ],
  subtitle: "Espace examens blancs LFJP",
  title:
    "Toute l'organisation des examens blancs centralisée pour les enseignants du LFJP",
  description:
    "Cet espace réunit l'ensemble des informations pratiques nécessaires pour préparer, coordonner et faire vivre les épreuves. Vous y trouverez les documents, convocations, affectations de salles et les consignes indispensables pour guider sereinement chaque étape du déroulement des examens blancs.",
};

export type HomeCalloutCategory = "general" | "math";

export interface HomeCalloutEntry {
  to: string;
  iconLabel: string;
  subtitle: string;
  title: string;
  dateLabel: string;
  date: string;
  footerLabel: string;
  category: HomeCalloutCategory;
}

export const HOME_DASHBOARD_ENTRY: HomeCalloutEntry = {
  to: "/examens-blancs",
  iconLabel: "Accéder à l'organisation des examens blancs",
  subtitle: "",
  title: "Baccalauréat blanc 1ère et Terminale",
  dateLabel: "10, 11 et 12 décembre 2025",
  date: "2025-12-10",
  footerLabel: "Accéder à l'organisation complète",
  category: "general",
};

export const HOME_MATH_EXAM_20260213_ENTRY: HomeCalloutEntry = {
  to: "/examens-blancs/mathematiques-2026-02-13",
  iconLabel: "Consulter l'organisation du bac blanc de maths 1ère",
  subtitle: "",
  title: "Bac blanc de maths 1ère",
  dateLabel: "13 février 2026",
  date: "2026-02-13",
  footerLabel: "Accéder à l'organisation complète",
  category: "math",
};

export const HOME_MATH_EXAM_20260523_ENTRY: HomeCalloutEntry = {
  to: "/examens-blancs/mathematiques-2026-05-23",
  iconLabel: "Consulter l'organisation du bac blanc de maths 1ère",
  subtitle: "",
  title: "Bac blanc de maths 1ère",
  dateLabel: "23 mai 2026",
  date: "2026-05-23",
  footerLabel: "Accéder à l'organisation complète",
  category: "math",
};

export const HOME_EAF_EXAM_20260407_ENTRY: HomeCalloutEntry = {
  to: "/examens-blancs/eaf-2026-04-07",
  iconLabel: "Accéder à l'organisation du baccalauréat blanc 1ère et Terminale",
  subtitle: "",
  title: "Baccalauréat blanc 1ère et Terminale",
  dateLabel: "7 au 10 avril 2026",
  date: "2026-04-07",
  footerLabel: "Accéder à l'organisation complète",
  category: "general",
};

export const HOME_CALLOUT_ENTRIES: HomeCalloutEntry[] = [
  HOME_DASHBOARD_ENTRY,
  HOME_MATH_EXAM_20260213_ENTRY,
  HOME_EAF_EXAM_20260407_ENTRY,
  HOME_MATH_EXAM_20260523_ENTRY,
];

