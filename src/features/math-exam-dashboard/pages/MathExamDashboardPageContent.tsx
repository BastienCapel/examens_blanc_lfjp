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
  StudentRoomList,
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
        <StudentRoomList />
        <RoomsStatus />
        <Announcements />
      </ExamDashboard>
    </ExamDashboardPageLayout>
  );
}
