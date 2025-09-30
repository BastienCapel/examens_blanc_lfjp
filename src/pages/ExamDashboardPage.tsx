import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import Announcements from "../sections/Announcements";
import ConvocationGenerator from "../sections/ConvocationGenerator";
import ExamDashboard from "../sections/ExamDashboard";
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import RoomSetup from "../sections/RoomSetup";
import RoomsStatus from "../sections/RoomsStatus";
import SurveillanceTable from "../sections/SurveillanceTable";

export default function ExamDashboardPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <div className="container mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-100"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Accueil
          </Link>
        </div>
        <Header />
        <Hero />
        <ExamDashboard>
          <RoomSetup />
          <SurveillanceTable />
          <ConvocationGenerator />
          <RoomsStatus />
          <Announcements />
        </ExamDashboard>
      </div>
    </div>
  );
}
