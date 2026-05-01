import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import EventsPage from "../pages/Events/EventsPage";
import CalendarPage from "../pages/Events/CalendarPage";
import MyLettersPage from "../pages/Events/MyLettersPage";
import ToApprovePage from "../pages/Events/ToApprovePage";
import ApprovedByMePage from "../pages/Events/ApprovedByMePage";
import RejectedByMePage from "../pages/Events/RejectedByMePage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard / Main */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="my-letters" element={<MyLettersPage />} />
          <Route path="to-approve" element={<ToApprovePage />} />
          <Route path="approved-by-me" element={<ApprovedByMePage />} />
          <Route path="rejected-by-me" element={<RejectedByMePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;