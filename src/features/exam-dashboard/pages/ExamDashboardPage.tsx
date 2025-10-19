import {
  Announcements,
  BackToHomeButton,
  CulturalPrograms,
  ConvocationGenerator,
  ExamDashboard,
  ExamDashboardPageLayout,
  Header,
  Hero,
  RoomSetup,
  RoomsStatus,
  SurveillanceTable,
} from "../components";

export default function ExamDashboardPage() {
  return (
    <ExamDashboardPageLayout action={<BackToHomeButton />}>
      <Header />
      <Hero />
      <CulturalPrograms />
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
