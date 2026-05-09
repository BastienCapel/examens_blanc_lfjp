import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";

type TabKey = "candidats" | "jures" | "convocationsJures" | "grille";
type SortDirection = "asc" | "desc";

const EXAM_DATE = "2026-05-20";
const OFFICIAL_GRID_URL =
  "https://drive.google.com/file/d/1EvPaUjTP5f8rT0Rbb5wbYU-pK0JPLgLc/view?usp=drive_link";
const LOGO_URL = "https://i.imgur.com/0YmGlXO.png";
const SIGNATURE_URL = "https://i.imgur.com/77DP4od.png";

const CANDIDATE_COLUMNS = [
  "Élève",
  "Classe",
  "Parcours",
  "Problématique",
  "Discipline_1",
  "Discipline_2",
  "Anglais",
  "Espagnol",
  "Juré_1",
  "Juré_2",
  "Heure de convocation",
] as const;
type CandidateColumn = (typeof CANDIDATE_COLUMNS)[number];

const JURY_COLUMNS = [
  "Juré",
  "Heure",
  "Candidat",
  "Classe",
  "Problématique",
  "Discipline_1",
  "Discipline_2",
  "Langue",
] as const;
type JuryColumn = (typeof JURY_COLUMNS)[number];

type Candidate = {
  id: string;
  student: string;
  className: string;
  pathway: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  english: boolean;
  spanish: boolean;
  juror1: string;
  juror2: string;
  time: string;
  date: string;
  room: string;
};

type JuryViewRow = {
  id: string;
  juror: string;
  time: string;
  student: string;
  className: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  language: string;
  date: string;
  room: string;
};

type FilterState = {
  search: string;
  date: string;
  room: string;
  jury: string;
  className: string;
  discipline1: string;
  discipline2: string;
  timeFrom: string;
  timeTo: string;
};

type SortRule = { column: string; direction: SortDirection };



type JuryConvocationLine = {
  id: string;
  time: string;
  room: string;
  student: string;
  problematic: string;
  coJuror: string;
  language: string;
};

type RawRow = {
  student: string;
  className: string;
  pathway: string;
  problematic: string;
  discipline1: string;
  discipline2: string;
  english: boolean;
  spanish: boolean;
  juror1: string;
  juror2: string;
  time: string;
  room: string;
};

const RAW_ROWS: RawRow[] = [
  { student: "AUBRY Albert Akoi Agamemnon", className: "", pathway: "Parcours santé", problematic: "En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?", discipline1: "SVT", discipline2: "Anglais", english: true, spanish: false, juror1: "Vincent David", juror2: "François Faye", time: "11:00", room: "Salle 1" },
  { student: "BA Abygaëlle Bilel", className: "", pathway: "Parcours citoyen", problematic: "Comment les auteurs africains ont-ils utilisé l’écriture pour affirmer leur identité ?", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Olivier Baritou", juror2: "Layla Jaït", time: "11:00", room: "Salle 2" },
  { student: "BERGOT Mathieu Yohan", className: "", pathway: "Parcours citoyen", problematic: "Comment le basket est-il devenu bien plus qu’un sport et s’est-il imposé comme une culture à part entière ?", discipline1: "EPS", discipline2: "Aucune", english: false, spanish: false, juror1: "Alassane Ndiaye", juror2: "Claire Drame", time: "11:00", room: "Salle 3" },
  { student: "BODELOT Julien Achille", className: "", pathway: "Parcours santé", problematic: "Quels sont les bienfaits de l’activité physique sur la santé ?", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "11:00", room: "Salle 4" },
  { student: "BOUYER Louis Marie", className: "", pathway: "Parcours santé", problematic: "En quoi une mauvaise alimentation influence négativement l’organisme et que faire pour y remédier ?", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Vincent David", juror2: "Alassane Ndiaye", time: "11:00", room: "Salle 5" },
  { student: "CHARAT Joséphine Awa Michele", className: "", pathway: "Parcours santé", problematic: "Qu’est-ce que la maladie d’Alzheimer et en quoi mon expérience personnelle m’a-t-elle donné envie de devenir médecin ?", discipline1: "SVT", discipline2: "HGEMC", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Mathilde Michon Guillaume", time: "11:30", room: "Salle 4" },
  { student: "D’ALMEIDA Asha", className: "", pathway: "Parcours citoyen", problematic: "En quoi Petit Pays de Gaël Faye montre que la guerre vole bien plus que des vies mais qu’elle vole aussi l’enfance ?", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Nafissatou Fall", juror2: "Elizabeth Porter", time: "11:30", room: "Salle 1" },
  { student: "DEMANGE Laura Sokhna", className: "", pathway: "Parcours citoyen", problematic: "Nelson Mandela est-il devenu un symbole mondial de la lutte contre l’injustice et le racisme ?", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Claire Bossu", juror2: "Fanelly Mourain Diop", time: "11:30", room: "Salle 2" },
  { student: "DIAGNE Ndeye Awa", className: "", pathway: "Parcours citoyen", problematic: "En quoi la traite négrière a-t-elle durablement marqué l’histoire des populations noires et le monde actuel ?", discipline1: "HGEMC", discipline2: "Aucune", english: false, spanish: false, juror1: "Yvon Thomas", juror2: "Alain Gomis", time: "11:30", room: "Salle 3" },
  { student: "DIALLO Djibril", className: "", pathway: "Parcours avenir", problematic: "Comment bien comprendre à quoi sert la gestion du patrimoine ?", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "François Faye", time: "12:00", room: "Salle 1" },
  { student: "DE GAIGNERON JOLLIMON DEMAROLLES Pétronille Agnès Louis Marie", className: "", pathway: "Parcours santé", problematic: "En quoi le stress influence-t-il nos résultats scolaires et notre santé ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Roselyne D’Aquino", time: "11:30", room: "Salle 2" },
  { student: "DIALLO Ibrahima Sory", className: "", pathway: "Parcours citoyen", problematic: "Comment le sport peut-il favoriser l’intégration sociale et lutter contre les inégalités ?", discipline1: "EPS", discipline2: "HGEMC", english: false, spanish: false, juror1: "Claire Drame", juror2: "Claire Bossu", time: "12:00", room: "Salle 3" },
  { student: "DIENG Aïssatou", className: "", pathway: "Parcours citoyen", problematic: "En quoi le témoignage d’Anne Frank permet-il de comprendre l’horreur de la Shoah et de la Seconde Guerre mondiale ?", discipline1: "HGEMC", discipline2: "Espagnol", english: false, spanish: true, juror1: "Yvon Thomas", juror2: "Fernando Piaggio", time: "12:00", room: "Salle 5" },
  { student: "DIOUF Moussa", className: "", pathway: "Parcours avenir", problematic: "En quoi mon stage d’immersion chez BAAMTU TECHNOLOGIES m’a-t-il ouvert les yeux sur les nouvelles manières de concevoir l’informatique ?", discipline1: "Technologie", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Frayon", juror2: "Elizabeth Porter", time: "12:00", room: "Salle 4" },
  { student: "FROUART Mia Tiara", className: "", pathway: "Parcours citoyen", problematic: "Comment le musée MAHICAO participe-t-il à la conservation, à la transmission et à la valorisation des cultures africaines ?", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "Layla Jaït", time: "12:00", room: "Salle 2" },
  { student: "DIEYE Awa Cheikh", className: "", pathway: "Histoire des arts", problematic: "Comment l’oeuvre d’Otto Dix montre-t-elle les horreurs de la Première Guerre mondiale ?", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Claire Bossu", juror2: "Layla Jaït", time: "12:30", room: "Salle 3" },
  { student: "DIOP Oumou", className: "", pathway: "Histoire des arts", problematic: "Pourquoi les artistes font-ils le choix de se représenter eux-mêmes dans leurs propres oeuvres ?", discipline1: "Arts Plastiques", discipline2: "HGEMC", english: false, spanish: false, juror1: "Eve Capel", juror2: "Yvon Thomas", time: "12:30", room: "Salle 2" },
  { student: "FALL Adji Magatte", className: "", pathway: "Parcours citoyen", problematic: "L’IA peut-elle améliorer l’apprentissage sans remplacer les efforts des élèves ?", discipline1: "Technologie", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Frayon", juror2: "François Faye", time: "12:30", room: "Salle 4" },
  { student: "GAFFARI Sofia", className: "", pathway: "Parcours avenir", problematic: "Pourquoi mon stage chez un vétérinaire m’a-t-il amené à reconsidérer mon choix de métier ?", discipline1: "Orientation", discipline2: "Anglais", english: true, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Elizabeth Porter", time: "12:30", room: "Salle 5" },
  { student: "GALAND Margaux Suzette", className: "", pathway: "Parcours santé", problematic: "En quoi la reprise de la pratique sportive peut-elle améliorer la récupération physique et mentale après une leucémie ?", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Vincent David", juror2: "Alassane Ndiaye", time: "12:30", room: "Salle 1" },
  { student: "GILLEN Mathieu Louis Pierre", className: "", pathway: "Parcours avenir", problematic: "En quoi le tourisme pourrait-il être un levier pour une carrière internationale afin de découvrir le monde et les gens ?", discipline1: "HGEMC", discipline2: "Aucune", english: false, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "Alain Gomis", time: "13:00", room: "Salle 3" },
  { student: "GLAUDE Manon", className: "", pathway: "Parcours santé", problematic: "En quoi le sommeil est-il important dans la vie des adolescents ?", discipline1: "SVT", discipline2: "HGEMC", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Yvon Thomas", time: "13:00", room: "Salle 4" },
  { student: "GRASSAGLIATA Milena", className: "", pathway: "Parcours santé", problematic: "En quoi une mauvaise nutrition impacte-t-elle la santé physique et mentale chez les jeunes ?", discipline1: "SVT", discipline2: "Français", english: false, spanish: false, juror1: "Vincent David", juror2: "Fanelly Mourain Diop", time: "13:00", room: "Salle 1" },
  { student: "HOUGNON Alexandre Georges", className: "", pathway: "Parcours avenir", problematic: "Comment vais-je faire pour réussir mon rêve d’architecte ?", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "François Faye", time: "13:00", room: "Salle 2" },
  { student: "MARCHESE Howard Giovanni Sédar", className: "", pathway: "Parcours avenir", problematic: "Pourquoi le métier de pilote fait-il encore rêver aujourd’hui ?", discipline1: "Orientation", discipline2: "Mathématiques", english: false, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Karine Chabert", time: "13:00", room: "Salle 5" },
  { student: "GROS-DUBOIS Daniella Fatoumata", className: "", pathway: "Parcours santé", problematic: "En quoi la compréhension du cancer du sein et les différentes stratégies mises en œuvre pour lutter contre cette maladie améliorent-elles l’espérance de vie ?", discipline1: "SVT", discipline2: "Espagnol", english: false, spanish: true, juror1: "Nathalie Mboup", juror2: "Amandine Gibus", time: "13:30", room: "Salle 4" },
  { student: "JABER Ali", className: "", pathway: "Parcours avenir", problematic: "Comment mon stage à l’hôtel Royam m’a-t-il aidé à mieux comprendre le monde du travail et mon futur métier ?", discipline1: "Français", discipline2: "Aucune", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Alain Gomis", time: "13:30", room: "Salle 2" },
  { student: "KOUROUMA Marguerite", className: "", pathway: "Parcours santé", problematic: "Quels sont les risques d’une grossesse précoce pour un élève ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Claire Drame", time: "13:30", room: "Salle 1" },
  { student: "MBOUP Adam Fallou", className: "", pathway: "Parcours santé", problematic: "En quoi les progrès scientifiques et technologiques aident-ils les sportifs ?", discipline1: "Technologie", discipline2: "EPS", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Alassane Ndiaye", time: "13:30", room: "Salle 5" },
  { student: "MBOW Aïssatou", className: "", pathway: "Parcours avenir", problematic: "En quoi l’environnement des jeunes d’aujourd’hui influence-t-il leur orientation vers la médecine ?", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "Elizabeth Porter", time: "13:30", room: "Salle 3" },
  { student: "KANE Souleymane", className: "", pathway: "Parcours santé", problematic: "En quoi le canal carpien peut-il affecter la vie scolaire d’un élève ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Roselyne D’Aquino", time: "14:00", room: "Salle 4" },
  { student: "MARTINEZ Gabriel-Omar Régis", className: "", pathway: "Parcours santé", problematic: "Selon vous, pourquoi les drogues ont-elles un effet néfaste sur la santé et le comportement des adolescents ?", discipline1: "SVT", discipline2: "Français", english: false, spanish: false, juror1: "Vincent David", juror2: "Nafissatou Fall", time: "14:00", room: "Salle 1" },
  { student: "MENCIERE Théophane Sedar", className: "", pathway: "Parcours avenir", problematic: "Comment le parcours avenir peut-il nous aider à réfléchir à notre orientation ?", discipline1: "Français", discipline2: "Aucune", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Alain Gomis", time: "14:00", room: "Salle 2" },
  { student: "MLIK Omar", className: "", pathway: "Parcours avenir", problematic: "En quoi le parcours scolaire influence-t-il notre futur et quelle est son importance ?", discipline1: "Français", discipline2: "Anglais", english: true, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "François Faye", time: "14:00", room: "Salle 3" },
  { student: "MOCNIK Léa Absa", className: "", pathway: "Parcours citoyen", problematic: "Et si le harcèlement scolaire n’était pas seulement l’histoire d’un bourreau et d’une victime mais le symptôme d’une société qui ferme les yeux ?", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Claire Bossu", juror2: "Elizabeth Porter", time: "14:00", room: "Salle 5" },
  { student: "LE COM Solen", className: "", pathway: "Parcours santé", problematic: "Comment des cigarettes électroniques jetables peuvent-elles impacter le quotidien scolaire et habituel des adolescents ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Alain Gomis", time: "14:30", room: "Salle 4" },
  { student: "LESAINT Samy Amet", className: "", pathway: "Parcours santé", problematic: "Quelles sont les conséquences de la drépanocytose et comment affecte-t-elle la vie des patients ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Roselyne D’Aquino", time: "14:30", room: "Salle 1" },
  { student: "MENDY BOSSU Mia Caroline Michele", className: "", pathway: "Parcours citoyen", problematic: "En quoi le journal d’Anne Frank est-il un acte de résistance et un symbole du devoir de mémoire ?", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "Nafissatou Fall", time: "14:30", room: "Salle 3" },
  { student: "NDIAYE Anna Florence", className: "", pathway: "Parcours citoyen", problematic: "En quoi l’esclavage a-t-il marqué l’histoire ?", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Yvon Thomas", juror2: "Layla Jaït", time: "14:30", room: "Salle 5" },
  { student: "NOUHANDO ROD Ezechiel Gildas", className: "", pathway: "Parcours avenir", problematic: "Comment le montage vidéo peut-il devenir un moyen de gagner de l’argent grâce aux réseaux sociaux et à internet ?", discipline1: "Technologie", discipline2: "Français", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Olivier Baritou", time: "14:30", room: "Salle 2" },
  { student: "LOZES Raphaël André Dominique", className: "", pathway: "Parcours avenir", problematic: "Comment devenir agriculteur aujourd’hui et pourquoi choisir ce métier ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "15:00", room: "Salle 4" },
  { student: "MONTALBANO Nathalie Marie Olga", className: "", pathway: "Parcours avenir", problematic: "Comment mon stage m’a-t-il orientée pour mon projet futur ?", discipline1: "Orientation", discipline2: "Espagnol", english: false, spanish: true, juror1: "Roselyne D’Aquino", juror2: "Amandine Gibus", time: "15:00", room: "Salle 2" },
  { student: "NGOM Khady Meissa", className: "", pathway: "Parcours citoyen", problematic: "En quoi les réseaux sociaux influencent-ils le quotidien des adolescents ?", discipline1: "HGEMC", discipline2: "Anglais", english: true, spanish: false, juror1: "Mathilde Michon Guillaume", juror2: "François Faye", time: "15:00", room: "Salle 5" },
  { student: "NUSS Paulette Thiaba", className: "", pathway: "Parcours citoyen", problematic: "Pourquoi les femmes continuent-elles de subir les inégalités malgré l’existence de lois qui protègent leurs droits ?", discipline1: "HGEMC", discipline2: "Français", english: false, spanish: false, juror1: "Claire Bossu", juror2: "Fanelly Mourain Diop", time: "15:00", room: "Salle 3" },
  { student: "PHILIPPE Paloma Clémence", className: "", pathway: "Histoire des arts / Citoyen", problematic: "Avoir un style vestimentaire particulier affecte-t-il la vision que la société porte sur nous ?", discipline1: "Arts Plastiques", discipline2: "Anglais", english: true, spanish: false, juror1: "Eve Capel", juror2: "Elizabeth Porter", time: "15:00", room: "Salle 1" },
  { student: "NDIAYE Soukaïna Dibor", className: "", pathway: "Parcours avenir", problematic: "En quoi la médecine permet-elle de prévenir les risques et d’améliorer les performances des sportifs ?", discipline1: "SVT", discipline2: "EPS", english: false, spanish: false, juror1: "Nathalie Mboup", juror2: "Claire Drame", time: "15:30", room: "Salle 4" },
  { student: "PEREZ NGOLI Micah Bruno Jean-Jacques", className: "", pathway: "Parcours avenir", problematic: "Comment le stage m’a aidé à trouver mon futur métier et comment pourrais-je répondre aux besoins des consommateurs ?", discipline1: "Français", discipline2: "Orientation", english: false, spanish: false, juror1: "Nafissatou Fall", juror2: "Roselyne D’Aquino", time: "15:30", room: "Salle 2" },
  { student: "PORQUET Yaniss", className: "", pathway: "Parcours avenir", problematic: "En quoi mon stage m’a-t-il permis de mieux comprendre les métiers de l’énergie ?", discipline1: "Orientation", discipline2: "Physique-Chimie", english: false, spanish: false, juror1: "Roselyne D’Aquino", juror2: "Adama Ndaw", time: "15:30", room: "Salle 5" },
  { student: "REZGANI Yasmine", className: "", pathway: "Parcours santé", problematic: "Comment le manque de sommeil influence-t-il nos capacités d’apprentissage et notre santé mentale ?", discipline1: "SVT", discipline2: "Aucune", english: false, spanish: false, juror1: "Vincent David", juror2: "Alain Gomis", time: "15:30", room: "Salle 1" },
  { student: "SALL Arona Ababacar Alpha", className: "", pathway: "Parcours santé", problematic: "En quoi la pratique régulière d’une activité physique est-elle essentielle à la santé globale du collégien ?", discipline1: "EPS", discipline2: "Anglais", english: true, spanish: false, juror1: "Alassane Ndiaye", juror2: "François Faye", time: "15:30", room: "Salle 3" },
  { student: "SAMB Abdou Aziz", className: "", pathway: "Parcours avenir", problematic: "Comment mon stage de 3ème et le parcours avenir m’ont-ils permis d’amorcer une réflexion autour du métier de psychologue ?", discipline1: "Français", discipline2: "Orientation", english: false, spanish: false, juror1: "Olivier Baritou", juror2: "Roselyne D’Aquino", time: "16:00", room: "Salle 2" },
  { student: "SARR Fatou Bintou", className: "", pathway: "Histoire des arts", problematic: "Comment la chanson Stand Up rend-elle hommage à la lutte de Harriet Tubman et comment nous incite-t-elle à nous défendre contre les injustices d’aujourd’hui ?", discipline1: "Éducation musicale", discipline2: "Anglais", english: true, spanish: false, juror1: "Antoine Diandy", juror2: "Layla Jaït", time: "16:00", room: "Salle 5" },
  { student: "TEBER Nehir", className: "", pathway: "Parcours citoyen", problematic: "En quoi les réseaux sociaux ont-ils un impact sur le quotidien des jeunes aujourd’hui ?", discipline1: "Technologie", discipline2: "HGEMC", english: false, spanish: false, juror1: "Antoine Frayon", juror2: "Yvon Thomas", time: "16:00", room: "Salle 4" },
  { student: "TUNA Melisa", className: "", pathway: "PEAC", problematic: "En quoi la mythologie grecque reste-t-elle influente sur le monde moderne ?", discipline1: "Français", discipline2: "HGEMC", english: false, spanish: false, juror1: "Fanelly Mourain Diop", juror2: "Claire Bossu", time: "16:00", room: "Salle 3" },
  { student: "VILLAIN Candice Noa", className: "", pathway: "Parcours santé", problematic: "Quels sont les troubles DYS, quelles sont leurs difficultés et quelles sont les aides mises en place à l’école afin de pallier ces difficultés ?", discipline1: "SVT", discipline2: "Anglais", english: true, spanish: false, juror1: "Nathalie Mboup", juror2: "Elizabeth Porter", time: "16:00", room: "Salle 1" },
  { student: "WONE Aissatou Rahmatoulahi", className: "", pathway: "Parcours santé", problematic: "En quoi mon stage au district sanitaire de Mbour m’a-t-il permis de comprendre le système de santé sénégalais et de confirmer mon projet professionnel dans le domaine médical ?", discipline1: "Orientation", discipline2: "Anglais", english: true, spanish: false, juror1: "Roselyne D’Aquino", juror2: "François Faye", time: "16:30", room: "Salle 2" },
  { student: "YEROCHEWSKI Yelen Sophie Marie", className: "", pathway: "Parcours citoyen", problematic: "Comment la propagande d’Adolf Hitler a-t-elle influencé la population allemande ?", discipline1: "HGEMC", discipline2: "Espagnol", english: false, spanish: true, juror1: "Yvon Thomas", juror2: "Fernando Piaggio", time: "16:30", room: "Salle 5" },
];

const normalize = (v: string) => v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return Number.isNaN(h) || Number.isNaN(m) ? -1 : h * 60 + m;
};
const isPresentValue = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const languageFromCandidate = (c: Candidate) => (c.english ? "Anglais" : c.spanish ? "Espagnol" : "");

const candidateToRow = (c: Candidate): Record<CandidateColumn, string> => ({
  Élève: c.student, Classe: c.className, Parcours: c.pathway, Problématique: c.problematic, Discipline_1: c.discipline1, Discipline_2: c.discipline2,
  Anglais: c.english ? "☑" : "", Espagnol: c.spanish ? "☑" : "", Juré_1: c.juror1, Juré_2: c.juror2, "Heure de convocation": c.time,
});
const juryToRow = (j: JuryViewRow): Record<JuryColumn, string> => ({ Juré: j.juror, Heure: j.time, Candidat: j.student, Classe: j.className, Problématique: j.problematic, Discipline_1: j.discipline1, Discipline_2: j.discipline2, Langue: j.language });

const matches = (v: string, q: string) => !q || normalize(v).includes(normalize(q));
const formatExamDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const generateJuryConvocationPdf = (juror: string, lines: JuryConvocationLine[]) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Convocation jury - DNB oral", 40, 52);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Session du ${formatExamDate(EXAM_DATE)}`, 40, 74);
  doc.text(`Juré: ${juror}`, 40, 92);

  let y = 140;
  lines.forEach((line, index) => {
    if (y > 700) {
      doc.addPage();
      y = 60;
    }

    doc.setFillColor(index % 2 === 0 ? 241 : 248, 245, 249);
    doc.roundedRect(36, y, pageWidth - 72, 86, 10, 10, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${line.time}  •  ${line.room}`, 52, y + 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Candidat: ${line.student}`, 52, y + 42);
    doc.text(`Problématique: ${line.problematic || "Non renseignée"}`, 52, y + 58);
    doc.text(`Co-juré: ${line.coJuror}`, 52, y + 74);
    if (line.language) doc.text(`Langue: ${line.language}`, pageWidth - 190, y + 74);

    y += 96;
  });

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Merci de vous présenter 15 minutes avant la première convocation.", 40, 760);
  doc.text("Signature de la direction", 40, 778);
  doc.save(`convocation-jure-${juror.replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

const csvExport = (filename: string, headers: string[], rows: string[][]) => {
  const content = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([content], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
};

export default function DnbOralExam20260520Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("candidats");
  const [filters, setFilters] = useState<FilterState>({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });
  const [candidateSortRules, setCandidateSortRules] = useState<SortRule[]>([{ column: "Heure de convocation", direction: "asc" }]);
  const [jurySortRules, setJurySortRules] = useState<SortRule[]>([{ column: "Heure", direction: "asc" }]);

  const candidates = useMemo<Candidate[]>(() => RAW_ROWS.map((row, i) => ({ id: `candidate-${i + 1}`, ...row, date: EXAM_DATE })), []);

  const juryRows = useMemo<JuryViewRow[]>(() => candidates.flatMap((c) => [c.juror1, c.juror2]
    .filter(isPresentValue)
    .map((juror, i) => ({ id: `${c.id}-${i}`, juror, time: c.time, student: c.student, className: c.className, problematic: c.problematic, discipline1: c.discipline1, discipline2: c.discipline2, language: languageFromCandidate(c), date: c.date, room: c.room }))), [candidates]);

  const applyFilters = <T extends { time: string; date: string; room: string }>(items: T[], values: (item: T) => string[], jurors: (item: T) => string[], cls: (item: T) => string, d1: (item: T) => string, d2: (item: T) => string) =>
    items.filter((item) => {
      const globalOk = !filters.search || values(item).some((v) => matches(v, filters.search));
      const juryOk = !filters.jury || jurors(item).some((j) => matches(j, filters.jury));
      const dateOk = !filters.date || item.date === filters.date;
      const roomOk = matches(item.room, filters.room);
      const classOk = matches(cls(item), filters.className);
      const d1Ok = matches(d1(item), filters.discipline1);
      const d2Ok = matches(d2(item), filters.discipline2);
      const t = timeToMinutes(item.time);
      const fromOk = !filters.timeFrom || t >= timeToMinutes(filters.timeFrom);
      const toOk = !filters.timeTo || t <= timeToMinutes(filters.timeTo);
      return globalOk && juryOk && dateOk && roomOk && classOk && d1Ok && d2Ok && fromOk && toOk;
    });

  const sortByRules = <T extends Candidate | JuryViewRow>(items: T[], rules: SortRule[], mapper: (item: T) => Record<string, string>) => [...items].sort((a, b) => {
    for (const rule of rules) {
      const av = mapper(a)[rule.column] ?? ""; const bv = mapper(b)[rule.column] ?? "";
      const cmp = rule.column.toLowerCase().includes("heure") ? timeToMinutes(av) - timeToMinutes(bv) : normalize(av).localeCompare(normalize(bv));
      if (cmp !== 0) return rule.direction === "asc" ? cmp : -cmp;
    }
    return 0;
  });

  const filteredCandidates = useMemo(() => applyFilters(candidates, (c) => Object.values(candidateToRow(c)), (c) => [c.juror1, c.juror2], (c) => c.className, (c) => c.discipline1, (c) => c.discipline2), [candidates, filters]);
  const filteredJuryRows = useMemo(() => applyFilters(juryRows, (j) => Object.values(juryToRow(j)), (j) => [j.juror], (j) => j.className, (j) => j.discipline1, (j) => j.discipline2), [juryRows, filters]);
  const sortedCandidates = useMemo(() => sortByRules(filteredCandidates, candidateSortRules, candidateToRow), [filteredCandidates, candidateSortRules]);
  const sortedJuryRows = useMemo(() => sortByRules(filteredJuryRows, jurySortRules, juryToRow), [filteredJuryRows, jurySortRules]);
  const juryConvocations = useMemo(() => {
    const jurors = Array.from(new Set(sortedJuryRows.map((j) => j.juror)));
    return jurors.map((juror) => ({
      juror,
      lines: sortedJuryRows
        .filter((j) => j.juror === juror)
        .map((j) => {
          const candidate = candidates.find((c) => c.student === j.student && c.time === j.time && c.room === j.room);
          const coJuror = candidate ? [candidate.juror1, candidate.juror2].find((name) => name && name !== juror) ?? "" : "";
          return {
            id: j.id,
            time: j.time,
            room: j.room,
            student: j.student,
            problematic: j.problematic,
            coJuror,
            language: j.language,
          };
        }),
    }));
  }, [sortedJuryRows, candidates]);


  const resetFilters = () => setFilters({ search: "", date: EXAM_DATE, room: "", jury: "", className: "", discipline1: "", discipline2: "", timeFrom: "", timeTo: "" });
  const addSortRule = (column: string) => activeTab === "candidats"
    ? setCandidateSortRules((r) => [...r, { column, direction: "asc" }])
    : setJurySortRules((r) => [...r, { column, direction: "asc" }]);

  const tableRows =
    activeTab === "candidats"
      ? sortedCandidates.map((c) =>
          CANDIDATE_COLUMNS.map((col) => candidateToRow(c)[col]),
        )
      : sortedJuryRows.map((j) =>
          JURY_COLUMNS.map((col) => juryToRow(j)[col]),
        );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold">Oraux du DNB — 20 mai 2026</h1>
        <section className="rounded-lg border bg-white p-4 text-sm"><h2 className="mb-2 text-base font-semibold">Présentation de l'épreuve</h2><p>Conformément aux textes officiels du Diplôme national du brevet, l'épreuve orale évalue la maîtrise de l'expression orale.</p></section>

        <div className="flex flex-wrap gap-2">{(["candidats", "jures", "convocationsJures", "grille"] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-blue-600 text-white" : "border bg-white"}`}>{tab === "jures" ? "Jurés" : tab === "convocationsJures" ? "Convocations jurés" : tab === "grille" ? "Grille d'évaluation" : "Candidats"}</button>)}</div>

        {activeTab !== "grille" && activeTab !== "convocationsJures" && <section className="rounded-lg border bg-white p-4 space-y-3"><div className="grid gap-2 md:grid-cols-4"> <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Recherche globale" className="rounded border px-2 py-1" /> <input type="date" value={filters.date} onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))} className="rounded border px-2 py-1" /> <input value={filters.room} onChange={(e) => setFilters((p) => ({ ...p, room: e.target.value }))} placeholder="Salle" className="rounded border px-2 py-1" /> <input value={filters.jury} onChange={(e) => setFilters((p) => ({ ...p, jury: e.target.value }))} placeholder="Jury" className="rounded border px-2 py-1" /> <input value={filters.className} onChange={(e) => setFilters((p) => ({ ...p, className: e.target.value }))} placeholder="Classe" className="rounded border px-2 py-1" /> <input value={filters.discipline1} onChange={(e) => setFilters((p) => ({ ...p, discipline1: e.target.value }))} placeholder="Discipline 1" className="rounded border px-2 py-1" /> <input value={filters.discipline2} onChange={(e) => setFilters((p) => ({ ...p, discipline2: e.target.value }))} placeholder="Discipline 2" className="rounded border px-2 py-1" /> <div className="flex gap-2"><input type="time" value={filters.timeFrom} onChange={(e) => setFilters((p) => ({ ...p, timeFrom: e.target.value }))} className="rounded border px-2 py-1" /><input type="time" value={filters.timeTo} onChange={(e) => setFilters((p) => ({ ...p, timeTo: e.target.value }))} className="rounded border px-2 py-1" /></div></div>
          <div className="flex flex-wrap gap-2 items-center"><button onClick={resetFilters} className="rounded border px-3 py-1">Réinitialiser filtres</button><span className="text-sm text-slate-600">Résultats: {activeTab === "candidats" ? sortedCandidates.length : sortedJuryRows.length}</span></div>
          <div className="flex flex-wrap gap-2 items-center"><select className="rounded border px-2 py-1" onChange={(e) => e.target.value && addSortRule(e.target.value)} defaultValue=""><option value="">Ajouter règle de tri</option>{(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((c) => <option key={c} value={c}>{c}</option>)}</select>{(activeTab === "candidats" ? candidateSortRules : jurySortRules).map((rule, idx) => <div key={`${rule.column}-${idx}`} className="rounded border px-2 py-1 text-sm flex items-center gap-1"><span>{rule.column}</span><button onClick={() => (activeTab === "candidats" ? setCandidateSortRules((r) => r.map((it, i) => i === idx ? { ...it, direction: it.direction === "asc" ? "desc" : "asc" } : it)) : setJurySortRules((r) => r.map((it, i) => i === idx ? { ...it, direction: it.direction === "asc" ? "desc" : "asc" } : it)))}>{rule.direction === "asc" ? "↑" : "↓"}</button><button onClick={() => (activeTab === "candidats" ? setCandidateSortRules((r) => r.filter((_, i) => i !== idx)) : setJurySortRules((r) => r.filter((_, i) => i !== idx)))}>✕</button></div>)}</div>
        </section>}

        {activeTab === "grille" ? (<section className="rounded-lg border bg-white p-4"><a href={OFFICIAL_GRID_URL} target="_blank" rel="noreferrer" className="text-blue-700 underline">Consulter la grille officielle</a></section>) : activeTab === "convocationsJures" ? (<section className="space-y-3 rounded-lg border bg-white p-4"><h3 className="text-lg font-semibold">Téléchargement PDF des convocations jurés</h3><p className="text-sm text-slate-600">Un PDF est généré par juré avec heure, salle, candidat, problématique, co-juré et langue si renseignée.</p><div className="grid gap-3 md:grid-cols-2">{juryConvocations.map((convocation) => <article key={convocation.juror} className="rounded-xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-sky-50 p-4 shadow-sm"><h4 className="text-base font-semibold text-slate-900">{convocation.juror}</h4><p className="text-sm text-slate-600">{convocation.lines.length} passage(s)</p><button onClick={() => generateJuryConvocationPdf(convocation.juror, convocation.lines)} className="mt-3 rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white">Télécharger PDF</button></article>)}</div></section>) : (<section className="space-y-2"><div className="flex flex-wrap gap-2"><button onClick={() => csvExport(`dnb-${activeTab}-${EXAM_DATE}.xls`, activeTab === "candidats" ? [...CANDIDATE_COLUMNS] : [...JURY_COLUMNS], tableRows)} className="rounded bg-emerald-600 px-3 py-1 text-white">Exporter (.xls)</button><button onClick={() => window.print()} className="rounded bg-indigo-600 px-3 py-1 text-white">Imprimer convocations (lot)</button></div><div className="overflow-x-auto rounded-lg border bg-white"><table className="min-w-full text-left text-sm"><thead className="bg-slate-100"><tr>{(activeTab === "candidats" ? CANDIDATE_COLUMNS : JURY_COLUMNS).map((column) => <th key={column} className="border-b px-3 py-2">{column}</th>)}</tr></thead><tbody>{tableRows.map((row, idx) => <tr key={idx} className="odd:bg-white even:bg-slate-50">{row.map((cell, cidx) => <td key={cidx} className="border-b px-3 py-2 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
          <div className="hidden print:block">
            {sortedCandidates.map((c) => <article key={`conv-c-${c.id}`} className="break-after-page p-8"><img src={LOGO_URL} alt="LFJP" className="h-12" /><h2 className="mt-2 text-xl font-bold">Convocation candidat</h2><p>{c.student} — {c.className}</p><p>Date: {c.date} | Heure: {c.time} | Salle: {c.room}</p><p>Problématique: {c.problematic}</p><p className="mt-4">Consignes: présence 15 min avant l'horaire. Pièce d'identité obligatoire.</p><img src={SIGNATURE_URL} alt="Signature" className="mt-6 h-12" /></article>)}
            {Array.from(new Set(sortedJuryRows.map((j) => j.juror))).map((juror) => <article key={`conv-j-${juror}`} className="break-after-page p-8"><img src={LOGO_URL} alt="LFJP" className="h-12" /><h2 className="mt-2 text-xl font-bold">Convocation juré</h2><p>{juror}</p><p>Date: {EXAM_DATE}</p><table className="mt-3 w-full text-sm"><thead><tr><th>Heure</th><th>Candidat</th><th>Salle</th><th>Disciplines</th></tr></thead><tbody>{sortedJuryRows.filter((r) => r.juror === juror).map((r) => <tr key={r.id}><td>{r.time}</td><td>{r.student}</td><td>{r.room}</td><td>{r.discipline1} / {r.discipline2}</td></tr>)}</tbody></table><p className="mt-4">Consignes: merci de vous référer à la grille officielle: {OFFICIAL_GRID_URL}</p><img src={SIGNATURE_URL} alt="Signature" className="mt-6 h-12" /></article>)}
          </div>
        </section>)}
      </div>
    </main>
  );
}
