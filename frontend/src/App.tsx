import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./providers/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/landing/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Curriculum from "./pages/curriculum/Curriculum";
import Practice from "./pages/practice/Practice";
import Results from "./pages/practice/Results";
import TheoryPractice from "./pages/practice/TheoryPractice";
import AITutor from "./pages/tutor/AITutor";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import Library from "./pages/library/Library";
import TextbookReader from "./pages/library/TextbookReader";
import Progress from "./pages/progress/Progress";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import Settings from "./pages/settings/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student — redirects to /login if there's no session */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/curriculum" element={<ProtectedRoute><Curriculum /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/theory-practice" element={<ProtectedRoute><TheoryPractice /></ProtectedRoute>} />
          <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
          <Route path="/textbooks" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/textbooks/read" element={<ProtectedRoute><TextbookReader /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Teacher */}
          {/* TODO: also gate this behind a role check (role === "teacher") — ProtectedRoute
              only checks that *someone* is logged in, not which role they have. */}
          <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
