import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/login';
import ResetPass from '@/pages/auth/resetPass';
import Home from '@/pages/home';

import SidebarLayout from '@/pages/layouts';
import Dashboard from '@/pages/dashboard';
import Feed from '@/pages/feed';
import Questions from '@/pages/question';
import Panels from '@/pages/panels';
import Groups from '@/pages/all-teams';
import People from '@/pages/people';
import Integrations from '@/pages/integrations';
import CompanyProfile from '@/pages/company-profile';
import Posts from '@/pages/posts';
import CreatePost from '@/pages/create-post';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPass />} />
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/ask-new-question" element={<Questions />} />
        <Route path="/panels" element={<Panels />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/people" element={<People />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
