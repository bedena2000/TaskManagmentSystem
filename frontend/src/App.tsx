import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegistrationPage from "./pages/auth/registration";
import LoginPage from "./pages/auth/login";
import Dashboard from "./pages/dashboard/dashboard";
import DashboardMain from "./pages/dashboard/dashboard_main";
import Projects from "./pages/dashboard/projects";
import Tasks from "./pages/dashboard/tasks";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import GuestRoute from "./components/authentication/GuestRoute";
import ErrorPage from "./pages/error/Error404";

// Initialize the Query Client
const queryClient = new QueryClient();

/**
 * Helper component to handle the root path (/) logic.
 * It checks for a token and redirects accordingly.
 */
const RootRedirect = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 1. ROOT ROUTE 
          Handles the behavior when someone visits the base domain (e.g., yoursite.com/)
        */}
        <Route path="/" element={<RootRedirect />} />

        {/* 2. GUEST ROUTES 
          Accessible only if the user is NOT logged in.
          If they try to visit /login while logged in, GuestRoute redirects them to dashboard.
        */}
        <Route element={<GuestRoute />}>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 3. PROTECTED ROUTES 
          Accessible only if the user IS logged in.
          If they try to visit these while not logged in, ProtectedRoute redirects them to login.
        */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* The index route for /dashboard */}
            <Route index element={<DashboardMain />} />

            {/* Nested dashboard paths */}
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId/tasks" element={<Tasks />} />
          </Route>
        </Route>

        {/* 4. 404 FALLBACK 
          Catches any URLs that don't match the paths above.
        */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
