import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/pages/auth/login';
import ResetPass from '@/pages/auth/resetPass';
import Home from '@/pages/home';

import SidebarLayout from '@/pages/layouts';
import Dashboard from '@/pages/dashboard';
import Feed from '@/pages/feed';
import Questions from '@/pages/question';
import Panels from '@/pages/panels';
import People from '@/pages/people';
import AddNewPerson from '@/pages/people/add-new-person';
import Groups from '@/pages/groups';
import CompanyProfile from '@/pages/company-profile';
import Posts from '@/pages/posts';
import CreatePost from '@/pages/create-post';
import AddMembersPanel from '@/pages/panels/add-members';
import AddMembersGroup from '@/pages/groups/add-members';
import DecisionProfileReport from '@/pages/dashboard/decision-profile-report';
import Integrations from '@/pages/integrations';
import Profile from '@/pages/profile';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPass />} />
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/decision-profile-report" element={<DecisionProfileReport />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/ask-new-question" element={<Questions />} />
        <Route path="/panels" element={<Panels />} />
        <Route path="/panels/add-members" element={<AddMembersPanel />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/add-members" element={<AddMembersGroup />} />
        <Route path="/people" element={<People />} />
        <Route path="/people/add-new-person" element={<AddNewPerson />} />
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
