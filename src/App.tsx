import { Route, Routes } from "react-router-dom";

import ExamDashboardPage from "./pages/ExamDashboardPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/examens-blancs" element={<ExamDashboardPage />} />
    </Routes>
  );
}
