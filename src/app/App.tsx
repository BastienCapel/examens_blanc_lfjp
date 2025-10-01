import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const ExamDashboardPage = lazy(
  () => import("../features/exam-dashboard/pages/ExamDashboardPage"),
);
const MathExamDashboardPage = lazy(
  () => import("../features/math-exam-dashboard/pages/MathExamDashboardPage"),
);

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Chargement…</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/examens-blancs" element={<ExamDashboardPage />} />
        <Route
          path="/examens-blancs/mathematiques-2026-02-13"
          element={<MathExamDashboardPage />}
        />
      </Routes>
    </Suspense>
  );
}
