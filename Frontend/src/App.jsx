import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgetPassword';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import TasksList from './pages/TasksList';
import TaskEdit from './pages/TaskEdit';
import TaskCreate from './pages/TaskCreation';
import TaskDetails from './pages/TaskDetails';
import { Toaster } from 'sonner';
import './App.css';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import NotificationsPage from "./pages/Notification"
import EditProject from './pages/EditProject';
import { useToast, ToastContainer } from "./components/Toast"
function App() {
  const [count, setCount] = useState(0);
  const { toasts, removeToast } = useToast()

  return (
    <>
      <div>
        <Routes>
          {/* Protected Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to='/dashboard' />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TasksList /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><TaskCreate /></ProtectedRoute>}/>
            <Route path="/edit/:id" element={<ProtectedRoute><TaskEdit /></ProtectedRoute>} />
            <Route path="/task/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>

        <Toaster richColors position="top-right" />
      </div>
    </>
  );
}

export default App;
