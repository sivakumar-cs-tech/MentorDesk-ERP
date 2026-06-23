import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import SidebarRouterBridge from "./components/SidebarRouterBridge";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Timeline from "./pages/Timeline";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <SidebarRouterBridge />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
