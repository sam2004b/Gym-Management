import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import MemberDashboard from "../pages/member/MemberDashboard";
import MemberProfile from "../pages/member/MemberProfile";
import MemberMembership from "../pages/member/MemberMembership";
import MemberClasses from "../pages/member/MemberClasses";

import MemberLayout from "../layouts/MemberLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/member" element={<MemberLayout />}>

          <Route index element={<MemberDashboard />} />

          <Route path="profile" element={<MemberProfile />} />

          <Route path="membership" element={<MemberMembership />} />

          <Route path="classes" element={<MemberClasses />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;