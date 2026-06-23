import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

import api from "../../api/axios";

const DashboardCards = () => {
  const [dashboard, setDashboard] = useState(null);
  const [overview, setOverview] = useState(null);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboardRes, overviewRes, coursesRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/reports/overview"),
        api.get("/courses"),
      ]);

      setDashboard(dashboardRes.data.dashboard);
      setOverview(overviewRes.data.report);
      setCourseCount(coursesRes.data.count ?? coursesRes.data.courses?.length ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const attendancePercentage = useMemo(() => {
    const total = overview?.attendance?.totalAttendance ?? 0;
    const present = overview?.attendance?.presentCount ?? 0;

    if (total === 0) return "0%";
    return `${Math.round((present / total) * 100)}%`;
  }, [overview]);

  const cards = useMemo(
    () => [
      {
        title: "Total Students",
        count: dashboard?.totalStudents ?? overview?.students?.totalStudents ?? 0,
        icon: <Users size={28} />,
      },
      {
        title: "Total Courses",
        count: courseCount,
        icon: <BookOpen size={28} />,
      },
      {
        title: "Total Tasks",
        count: overview?.tasks?.totalTasks ?? 0,
        icon: <ClipboardList size={28} />,
      },
      {
        title: "Attendance %",
        count: attendancePercentage,
        icon: <CalendarCheck size={28} />,
      },
    ],
    [dashboard, overview, courseCount, attendancePercentage]
  );

  if (loading) {
    return (
      <div className="cards-skeleton">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="skeleton-block skeleton-card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button type="button" className="dashboard-retry-btn" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div className="stat-card" key={card.title}>
          <div className="stat-card-content">
            <div>
              <p className="stat-card-label">{card.title}</p>
              <p className="stat-card-value">{card.count}</p>
            </div>
            <div className="stat-card-icon">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
