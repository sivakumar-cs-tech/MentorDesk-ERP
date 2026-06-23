import "../styles/dashboard.css";

import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import RecentActivities from "../components/dashboard/RecentActivities";
import RecentAlerts from "../components/dashboard/RecentAlerts";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor students, courses, attendance, and tasks at a glance.</p>
      </div>

      <DashboardCards />

      <DashboardCharts />

      <div className="dashboard-bottom-grid">
        <RecentActivities />
        <RecentAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
