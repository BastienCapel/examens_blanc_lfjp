import {
  Announcements,
  BackToHomeButton,
  ConvocationGenerator,
  ExamDashboard,
  ExamDashboardPageLayout,
  Header,
  Hero,
  RoomSetup,
  RoomsStatus,
  SurveillanceTable,
} from "../components";

export default function MathExamDashboardPageContent() {
  return (
    <ExamDashboardPageLayout action={<BackToHomeButton />}>
      <Header />
      <Hero />
      <ExamDashboard>
        <RoomSetup />
        <SurveillanceTable />
        <ConvocationGenerator />
        <RoomsStatus />
        <Announcements />
      </ExamDashboard>
    </ExamDashboardPageLayout>
  );
}
