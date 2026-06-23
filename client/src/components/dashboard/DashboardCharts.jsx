import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import api from "../../api/axios";

const CHART_COLORS = {
  present: "#2563EB",
  absent: "#EF4444",
  leave: "#F59E0B",
  completed: "#22C55E",
  inProgress: "#2563EB",
  pending: "#94A3B8",
};

const DashboardCharts = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/reports/overview");
      setOverview(res.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chart data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const attendanceData = useMemo(
    () => [
      {
        name: "Present",
        count: overview?.attendance?.presentCount ?? 0,
        fill: CHART_COLORS.present,
      },
      {
        name: "Absent",
        count: overview?.attendance?.absentCount ?? 0,
        fill: CHART_COLORS.absent,
      },
      {
        name: "Leave",
        count: overview?.attendance?.leaveCount ?? 0,
        fill: CHART_COLORS.leave,
      },
    ],
    [overview]
  );

  const taskData = useMemo(
    () => [
      {
        name: "Completed",
        value: overview?.tasks?.completedTasks ?? 0,
        fill: CHART_COLORS.completed,
      },
      {
        name: "In Progress",
        value: overview?.tasks?.inProgressTasks ?? 0,
        fill: CHART_COLORS.inProgress,
      },
      {
        name: "Pending",
        value: overview?.tasks?.pendingPractice ?? 0,
        fill: CHART_COLORS.pending,
      },
    ],
    [overview]
  );

  const totalAttendance = overview?.attendance?.totalAttendance ?? 0;
  const totalTasks = overview?.tasks?.totalTasks ?? 0;

  if (loading) {
    return (
      <div className="dashboard-charts">
        <div className="skeleton-block chart-card" style={{ minHeight: 360 }} />
        <div className="skeleton-block chart-card" style={{ minHeight: 360 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button type="button" className="dashboard-retry-btn" onClick={fetchOverview}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-charts">
      <div className="chart-card">
        <div className="chart-card-header">
          <h2>Attendance Overview</h2>
          <span className="chart-card-badge">{totalAttendance} records</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 13 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(37, 99, 235, 0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {attendanceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <h2>Task Status</h2>
          <span className="chart-card-badge">{totalTasks} tasks</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {taskData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "#64748B", fontSize: 13 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
