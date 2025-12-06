import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
            <Route path="/" element={<Navigate to='/landing' />} />
            <Route path="/landing" element={<Landing />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/create" element={<TaskCreate />}/>
            <Route path="/edit/:id" element={<TaskEdit />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<NotificationsPage />} />
      
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
