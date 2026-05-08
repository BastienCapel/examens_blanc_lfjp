import { Link } from "react-router-dom";

const COLUMNS = [
  "Élève",
  "Classe",
  "Parcours",
  "Problématique",
  "Discipline_1",
  "Discipline_2",
  "Confirmé PP",
  "Groupe",
  "Anglais",
  "Espagnol",
  "Juré_1",
  "Juré_2",
  "Heure de convocation",
] as const;

const ROWS: string[][] = [
  ["DIALLO Hassimiou Djélani Gérard","3EME2","Histoire des arts","Comment l'architecture a-t-elle évoluée et que nous apprend t-elle sur les sociétés ?","Arts Plastiques","HGEMC","FALSE","FALSE","FALSE","FALSE","","",""] ,
  ["DIOUF Yanis","3EME1","Parcours santé","","","","FALSE","FALSE","FALSE","FALSE","","",""] ,
  ["SCHNEIDER Louna","3EME2","Parcours citoyen","Les résaux sociaux sont-ils utiles ou dangereux pour les jeunes ?","HGEMC","Aucune","FALSE","FALSE","FALSE","FALSE","","",""] ,
  ["AUBRY Albert Akoi Agamemnon","3EME1","Parcours santé","En quoi les jeux vidéos influencent-ils le développement scolaire des adolescents ?","SVT","Anglais","TRUE","FALSE","TRUE","FALSE","Vincent David","François Faye","11:00"] ,
  ["BA Abygaëlle Bilel","3EME2","Parcours citoyen","Comment les auteurs africains ont-ils utilisé l'écriture pour afirmeer leur identité?","Français","Anglais","TRUE","FALSE","TRUE","FALSE","Olivier Baritou","Layla Jaït","11:00"] ,
  ["BERGOT Mathieu Yohan","3EME2","Parcours citoyen","Comment le basket est-il devenu bien plus qu'un sport et s'est-il imposé comme une culture à part entière ?","EPS","Aucune","TRUE","FALSE","FALSE","FALSE","Alassane Ndiaye","Claire Drame","11:00"] ,
  ["BODELOT Julien Achille","3EME2","Parcours santé","Quels sont les bienfaits de l'activité physique sur la santé ?","SVT","EPS","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Claire Drame","11:00"] ,
  ["BOUYER Louis Marie","3EME1","Parcours santé","En quoi une mauvaise alimentation  influence négativement l'organisme et que faire pour y remédier ?","SVT","EPS","TRUE","FALSE","FALSE","FALSE","Vincent David","Alassane Ndiaye","11:00"] ,
  ["CHARAT Joséphine Awa Michele","3EME2","Parcours santé","Qu'est-ce que  la maladie de l'Alzheimer et en quoi mon expérience personnelle m'a-t-elle donné envie de devenir médecin?","SVT","HGEMC","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Mathilde Michon Guillaume","11:30"] ,
  ["D'ALMEIDA Asha","3EME2","Parcours citoyen","En quoi Petit Pays de Gaël FAYE montre que la guerre vole bien plus que des vies mais qu'elle vole aussi l'enfance ?","Français","Anglais","TRUE","FALSE","TRUE","FALSE","Nafissatou Fall","Elizabeth Porter","11:30"] ,
  ["DE GAIGNERON JOLLIMON DEMAROLLES Pétronille Agnès Louis Marie","3EME1","Parcours santé","En quoi le stress influence-t-il nos résultats scolaires et notre santé ? ","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Vincent David","Roselyne D’Aquino","11:30"] ,
  ["DEMANGE Laura Sokhna","3EME2","Parcours citoyen","Nelson Mandela est-il devenu un symbole mondial de la lutte contre l'injustice et le racisme ?","HGEMC","Français","TRUE","FALSE","FALSE","FALSE","Claire Bossu","Fanelly Mourain Diop","11:30"] ,
  ["DIAGNE Ndeye Awa","3EME2","Parcours citoyen","En quoi la traite négrière à durablement marquée l'histoire des populations noires et le monde actuel ?","HGEMC","Aucune","TRUE","FALSE","FALSE","FALSE","Yvon Thomas","Alain Gomis","11:30"] ,
  ["DIALLO Djibril","3EME2","Parcours avenir","Comment bien comprendre à quoi sert la gestion du patrimoine?","HGEMC","Anglais","TRUE","FALSE","TRUE","FALSE","Mathilde Michon Guillaume","François Faye","12:00"] ,
  ["DIALLO Ibrahima Sory","3EME2","Parcours citoyen","Comment le sport peut-il favoriser l'intégration sociale et lutter contre les inégalités ?","EPS","HGEMC","TRUE","FALSE","FALSE","FALSE","Claire Drame","Claire Bossu","12:00"] ,
  ["DIENG Aïssatou","3EME1","Parcours citoyen","En quoi le témoignage d'Anne Frank permet-il de comprendre l'horreur de la Shoah et de la seconde guerre mondiale ?","HGEMC","Espagnol","TRUE","FALSE","FALSE","TRUE","Yvon Thomas","Fernando Piaggio","12:00"] ,
  ["DIEYE Awa Cheikh","3EME1","Histoire des arts","Comment l'oeuvre d'Otto Dix montre -t-elle les horreurs de la première guerre mondiale?","HGEMC","Anglais","TRUE","FALSE","TRUE","FALSE","Claire Bossu","Layla Jaït","12:00"] ,
  ["DIOP Oumou","3EME1","Histoire des arts","Pourquoi les artistes font-ils le choix de se représenter eux-mêmes dans leurs propres oeuvres? ","Arts Plastiques","HGEMC","TRUE","FALSE","FALSE","FALSE","Eve Capel","Yvon Thomas","12:00"] ,
  ["DIOUF Moussa","3EME1","Parcours avenir","En quoi mon stage d'immersion chez BAAMTU TECHNOLOGIES m'a-t-il ouvert les yeux sur les nouvelles manières de concevoir l'informatique ?","Technologie","Anglais","TRUE","FALSE","TRUE","FALSE","Antoine Frayon","Elizabeth Porter","12:30"] ,
  ["FALL Adji Magatte","3EME2","Parcours citoyen","L'IA peut-elle améliorer l'apprentissage sans remplacer les efforts des élèves ?","Technologie","Anglais","TRUE","FALSE","TRUE","FALSE","Antoine Frayon","François Faye","12:30"] ,
  ["FROUART Mia Tiara","3EME1","Parcours citoyen","Comment le musée MAHICAO participe-t-il à la conservation, à la transmission et à la valorisation des cultures africaines ?","Arts Plastiques","Anglais","TRUE","FALSE","TRUE","FALSE","Eve Capel","Layla Jaït","12:30"] ,
  ["GAFFARI Sofia","3EME2","Parcours avenir","Pourquoi mon stage chez un vétérinaire m'a-t-il amené à reconsidérer mon choix de métier ?","Orientation","Anglais","TRUE","FALSE","TRUE","FALSE","Roselyne D’Aquino","Elizabeth Porter","12:30"] ,
  ["GALAND Margaux Suzette T","3EME1","Parcours santé","En quoi la reprise de la pratique sportive peut-elle améliroer la récupération physique et mentale après une leucémie ?","SVT","EPS","TRUE","FALSE","FALSE","FALSE","Vincent David","Alassane Ndiaye","12:30"] ,
  ["GILLEN Mathieu Louis Pierre","3EME2","Parcours avenir","En quoi le tourisme pourrait-il être un levier pour une carrière internationale afin de découvrir lee monde et les gens?","HGEMC","Aucune","TRUE","FALSE","FALSE","FALSE","Mathilde Michon Guillaume","Alain Gomis","13:00"] ,
  ["GLAUDE Manon","3EME1","Parcours santé","En quoi le sommeil est-il important dans la vie des adolescents ?","SVT","HGEMC","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Yvon Thomas","13:00"] ,
  ["GRASSAGLIATA Milena","3EME1","Parcours santé","En quoi une mauvaise nutrition impacte-t-elle la santé physique et mentale chez les jeunes ?","SVT","Français","TRUE","FALSE","FALSE","FALSE","Vincent David","Fanelly Mourain Diop","13:00"] ,
  ["GROS-DUBOIS Daniella Fatoumata","3EME1","Parcours santé","En quoi la compréhension du cancer du sein et les différentes stratégies mises en oeuvre pour lutter contre cette maladie améliorent-elles l'espérance de vie ?","SVT","Espagnol","TRUE","FALSE","FALSE","TRUE","Nathalie Mboup","Amandine Gibus","13:00"] ,
  ["HOUGNON Alexandre Georges","3EME2","Parcours avenir","Comment vais-je faire pour réussir mon rêve d'architecte ?","Arts Plastiques","Anglais","TRUE","FALSE","TRUE","FALSE","Eve Capel","François Faye","13:00"] ,
  ["JABER Ali","3EME1","Parcours avenir","Comment mon stage à l'hôtel Royam m'a-t-il aider à mieux comprendre le monde du travail et mon futur métier ?","Français","Aucune","TRUE","FALSE","FALSE","FALSE","Olivier Baritou","Alain Gomis","13:30"] ,
  ["KANE Souleymane","3EME2","Parcours santé","En quoi le canal carpien peut-il affecter la vie scolaire d'un élève ?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Roselyne D’Aquino","13:30"] ,
  ["KOUROUMA Marguerite","3EME2","Parcours santé","Quels sont les risques d'une grossesse précoce pour un élève ?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Vincent David","Claire Drame","13:30"] ,
  ["LE COM Solen","3EME2","Parcours santé","Comment des cigarettes éléctronqiues jetables peuvent-elles impacter le quotidien scolaire et habituel des adolescents ?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Alain Gomis","13:30"] ,
  ["LESAINT Samy Amet","3EME2","Parcours santé","Quelles sont les conséquences de la drépanocitose et comment affecte-t-elle la vie des patients?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Vincent David","Roselyne D’Aquino","13:30"] ,
  ["LOZES Raphaël André Dominique","3EME2","Parcours avenir","Comment devenir agriculteur aujourd'hui et pourquoi choisir ce métier?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Claire Drame","14:00"] ,
  ["MARCHESE Howard Giovanni Sédar","3EME1","Parcours avenir","Pourquoi le métier de pilote fait-il encore réver aujourd'hui?","Physique-chimie","Mathématiques","TRUE","FALSE","FALSE","FALSE","Baba Fall","Karine Chabert","14:00"] ,
  ["MARTINEZ Gabriel-Omar Régis","3EME1","Parcours santé","Selon vous, pourquoi les drogues ont-elles un effet néfaste sur la santé et le comportement des adolescents?","SVT","Français","TRUE","FALSE","FALSE","FALSE","Vincent David","Nafissatou Fall","14:00"] ,
  ["MBOUP Adam Fallou","3EME1","Parcours santé","En quoi les progrès scientifiques et technologiques aident-ils les sportifs ?","Technologie","EPS","TRUE","FALSE","FALSE","FALSE","Antoine Frayon","Alassane Ndiaye","14:00"] ,
  ["MBOW Aïssatou","3EME2","Parcours avenir","En quoi l'environnement des jeunes d'aujourd'hui influence-t-il leur orientation pour la médecine ?","Français","Anglais","TRUE","FALSE","TRUE","FALSE","Fanelly Mourain Diop","Elizabeth Porter","14:00"] ,
  ["MENCIERE Théophane Sedar","3EME2","Parcours avenir","Comment le parcours avenir peut-il nous aider à réfléchir à notre orientation ?","Français","Aucune","TRUE","FALSE","FALSE","FALSE","Olivier Baritou","Alain Gomis","14:30"] ,
  ["MENDY BOSSU Mia Caroline Michele","3EME1","Parcours citoyen","En quoi le journal d'Anne Frank  est-il un acte de résistance et un symbole du devoir de mémoire?","HGEMC","Français","TRUE","FALSE","FALSE","FALSE","Mathilde Michon Guillaume","Nafissatou Fall","14:30"] ,
  ["MLIK Omar","3EME1","Parcours avenir","En quoi le parcours scolaire influence-t-il notre futur et quelle est son importance ?","Français","Anglais","TRUE","FALSE","TRUE","FALSE","Fanelly Mourain Diop","François Faye","14:30"] ,
  ["MOCNIK Léa Absa","3EME2","Parcours citoyen","Et si le harcèlemeent scolaire n'était pas seulement l'histoire d'un bourreau et d'une victime mais le symptôme d'une société qui ferme les yeux?","HGEMC","Anglais","TRUE","FALSE","TRUE","FALSE","Claire Bossu","Elizabeth Porter","14:30"] ,
  ["MONTALBANO Nathalie Marie Olga","3EME1","Parcours avenir","Comment mon stage m'a t-il orienté pour mon projet futur ?","Orientation","Espagnol","TRUE","FALSE","FALSE","TRUE","Roselyne D’Aquino","Amandine Gibus","14:30"] ,
  ["NDIAYE Anna Florence","3EME1","Parcours citoyen","En quoi l'esclavage a-t-il marqué l'histoire ?","HGEMC","Anglais","TRUE","FALSE","TRUE","FALSE","Yvon Thomas","Layla Jaït","15:00"] ,
  ["NDIAYE Soukaïna  Dibor","3EME2","Parcours avenir","En quoi la médecine de permet de prévenir les risques et d'améliorer les performances des sportifs ?","SVT","EPS","TRUE","FALSE","FALSE","FALSE","Nathalie Mboup","Claire Drame","15:00"] ,
  ["NGOM Khady Meissa","3EME1","Parcours citoyen","En quoi les réseaux sociaux influencent-ils le quotidien des adolescents? ","HGEMC","Anglais","TRUE","FALSE","TRUE","FALSE","Mathilde Michon Guillaume","François Faye","15:00"] ,
  ["NOUHANDO ROD Ezechiel Gildas","3EME1","Parcours avenir","Comment le montage vidéo peut-il devenir un moyen de gagner de l'argent grâce aux réseaux sociaux et à internet ? ","Technologie","Français","TRUE","FALSE","FALSE","FALSE","Antoine Frayon","Olivier Baritou","15:00"] ,
  ["NUSS Paulette Thiaba","3EME1","Parcours citoyen","Pourquoi les femmes continuent-elles de subir les inégalités malgré l'existence de lois qui protègent leurs droits ?","HGEMC","Français","TRUE","FALSE","FALSE","FALSE","Claire Bossu","Fanelly Mourain Diop","15:00"] ,
  ["PEREZ NGOLI Micah Bruno Jean-Jacques","3EME1","Parcours avenir","Comment le stage m'a aidé à trouver mon futur métier et comment pourrais-je répondre aux besoins des consommateurs ?","Français","orientation","TRUE","FALSE","FALSE","FALSE","Nafissatou Fall","Roselyne D’Aquino","15:30"] ,
  ["PHILIPPE Paloma Clémence","3EME2","Histoire des arts / Citoyen","Avoir un style vestimentaire particulier, affecte-t-il la vision que la société porte envers nous ?","Arts Plastiques","Anglais","TRUE","FALSE","TRUE","FALSE","Eve Capel","Elizabeth Porter","15:30"] ,
  ["PORQUET Yaniss","3EME1","Parcours avenir","En quoi mon stage m'a-t-il permis de mieux comprendre les métiers de l'énergie ?","Mathématiques","Physique-chimie","TRUE","FALSE","FALSE","FALSE","Samuel Servate","Adama Ndaw","15:30"] ,
  ["REZGANI Yasmine","3EME2","Parcours santé","Comment le manque de sommeil influence-t-il sur nos capacités d'apprentissage et notre santé mentale ?","SVT","Aucune","TRUE","FALSE","FALSE","FALSE","Vincent David","Alain Gomis","15:30"] ,
  ["SALL Arona Ababacar Alpha","3EME2","Parcours santé","En quoi la pratique régulière d'une activité physique régulière est-elle essentielle à la santé globale du collégien ?","EPS","Anglais","TRUE","FALSE","TRUE","FALSE","Alassane Ndiaye","François Faye","15:30"] ,
  ["SAMB Abdou Aziz","3EME1","Parcours avenir","Comment mon stage de 3ème et le parcours avenir m'ont permis d'amorcer une réflexion autour du métier de psychologue? ","Français","Orientation","TRUE","FALSE","FALSE","FALSE","Olivier Baritou","Roselyne D’Aquino","16:00"] ,
  ["SARR Fatou Bintou","3EME2","Histoire des arts","Comment la chanson stand up rend-elle hommage à la lutee de Harriet Tubman et comment nous incite-t-elle à nous défendre contre les injustices d'aujourd'hui?","Éducation musicale","Anglais","TRUE","FALSE","TRUE","FALSE","Antoine Diandy","Layla Jaït","16:00"] ,
  ["TEBER Nehir","3EME1","Parcours citoyen","En quoi les réseaux sociaux ont-ils un impact sur le quotidien des jeunes aujourd'hui ? ","Technologie","HGEMC","TRUE","FALSE","FALSE","FALSE","Antoine Frayon","Yvon Thomas","16:00"] ,
  ["TUNA Melisa","3EME2","PEAC","En quoi la mythologie grecque reste-t-elle influente sur le monde moderne ?","Français","HGEMC","TRUE","FALSE","FALSE","FALSE","Fanelly Mourain Diop","Claire Bossu","16:00"] ,
  ["VILLAIN Candice Noa","3EME2","Parcours santé","Quels sont les troubles DYS, quelles sont leurs difficultés et quelles sont les aides mises en place à  l'école afin dee palier à ces difficultés?","SVT","Anglais","TRUE","FALSE","TRUE","FALSE","Nathalie Mboup","Elizabeth Porter","16:00"] ,
  ["WONE Aissatou Rahmatoulahi","3EME2","Parcours santé","En quoi mon stage au district sanitaire de Mbour m'a-t-il permis de comprendre le système de santé Sénégalais et de confirmer mon projet professionnel dans le domaine médical ?","Orientation","Anglais","TRUE","FALSE","TRUE","FALSE","Roselyne D’Aquino","François Faye","16:30"] ,
  ["YEROCHEWSKI Yelen Sophie Marie","3EME1","Parcours citoyen","Comment la propagande de Adolf Hitler a-t-elle influencé la population Allemande ?","HGEMC","Espagnol","TRUE","FALSE","FALSE","TRUE","Yvon Thomas","Fernando Piaggio","16:30"] ,
];

export default function DnbOralExam20260520Page() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <Link to="/" className="text-sm text-blue-700 hover:underline">← Retour à l'accueil</Link>
        <h1 className="text-2xl font-bold text-slate-900">Oraux du DNB — 20 mai 2026</h1>
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column} className="whitespace-nowrap border-b px-3 py-2 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, index) => (
                <tr key={`${row[0]}-${index}`} className="odd:bg-white even:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td key={`${index}-${cellIndex}`} className="align-top border-b px-3 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
