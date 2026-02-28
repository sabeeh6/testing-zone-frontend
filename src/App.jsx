import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import ProjectsDashboard from "./pages/ProjectDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Features } from "./pages/Features";
import { FeatureDetail } from "./pages/FeatureDetail";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Routes with Persistent Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ProjectsDashboard />} />
          <Route path="/project-features" element={<Features />} />
          <Route path="/features/:id" element={<FeatureDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
