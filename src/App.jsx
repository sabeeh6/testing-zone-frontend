import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/auth/signIn";
import SignUp from "./pages/auth/signUp";
import ProjectsDashboard from "./pages/ProjectDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Features } from "./pages/Features";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute><ProjectsDashboard /></ProtectedRoute>} />
        <Route path="/project-features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
