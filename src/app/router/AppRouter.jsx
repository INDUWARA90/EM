import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { LoginPage, RegisterPage } from "../../features/auth/pages";
import { DashboardPage } from "../../features/dashboard/pages";
import {
  EventsPage,
  CalendarPage,
  MyLettersPage,
  ToApprovePage,
  ApprovedByMePage,
  RejectedByMePage,
} from "../../features/events/pages";
import { PlacesPage } from "../../features/places/pages";
import { NotFoundPage } from "../../features/not-found/pages";
import ClubCreate from "../../features/club/clubCreate";
import LandingPage from "../../features/landingPage/landingPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard / Main */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="places" element={<PlacesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="my-letters" element={<MyLettersPage />} />
          <Route path="to-approve" element={<ToApprovePage />} />
          <Route path="approved-by-me" element={<ApprovedByMePage />} />
          <Route path="rejected-by-me" element={<RejectedByMePage />} />
          <Route path="club-create" element={<ClubCreate />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
