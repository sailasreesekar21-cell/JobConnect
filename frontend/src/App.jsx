import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import RegisterSeeker from './pages/RegisterSeeker';
import RegisterRecruiter from './pages/RegisterRecruiter';
import Login from './pages/Login';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import MyApplications from './pages/MyApplications';
import ApplicantManagement from './pages/ApplicantManagement';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { ROLES } from './constants';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/jobs" element={<BrowseJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/register/seeker" element={<RegisterSeeker />} />
            <Route path="/register/recruiter" element={<RegisterRecruiter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route
            element={
              <ProtectedRoute roles={[ROLES.JOB_SEEKER, ROLES.RECRUITER, ROLES.ADMIN]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={[ROLES.JOB_SEEKER]}>
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute roles={[ROLES.JOB_SEEKER]}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute roles={[ROLES.RECRUITER]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute roles={[ROLES.RECRUITER]}>
                  <ManageJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/new"
              element={
                <ProtectedRoute roles={[ROLES.RECRUITER]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/edit"
              element={
                <ProtectedRoute roles={[ROLES.RECRUITER]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:jobId/applicants"
              element={
                <ProtectedRoute roles={[ROLES.RECRUITER]}>
                  <ApplicantManagement />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/register" element={<Navigate to="/register/seeker" replace />} />
          <Route path="*" element={<MainLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
