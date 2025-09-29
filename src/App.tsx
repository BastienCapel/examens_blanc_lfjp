import Announcements from "./sections/Announcements";
import ExamDashboard from "./sections/ExamDashboard";
import Footer from "./sections/Footer";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import RoomsStatus from "./sections/RoomsStatus";
import SurveillanceTable from "./sections/SurveillanceTable";

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <div className="container mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        <Header />
        <Hero />
        <ExamDashboard />
        <SurveillanceTable />
        <RoomsStatus />
        <Announcements />
        <Footer />
      </div>
    </div>
  );
}
