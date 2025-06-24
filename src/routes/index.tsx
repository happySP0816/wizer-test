import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/login';
import ResetPass from '@/pages/auth/resetPass';

// Placeholder Dashboard component (since not found in codebase)
const Dashboard = () => <div>Dashboard Page</div>;

// Placeholder Home component for '/'
const Home = () => <div>Home Page</div>;

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPass />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
