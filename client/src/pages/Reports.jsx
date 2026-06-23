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
import { Download, FileText, BarChart3 } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import Loader from "../components/ui/Loader";
import { calcPercentage } from "../utils/format";
import { exportToCSV, exportToExcel, exportToPDF, rowsToTableHtml } from "../utils/export";
import { getOverviewReport, getPerformanceReport } from "../api/reports";
import "../styles/reports.css";

const CHART_COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

const Reports = () => {
  const [overview, setOverview] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, perfRes] = await Promise.all([
        getOverviewReport(),
        getPerformanceReport(),
      ]);
      setOverview(overviewRes.data.report);
      setPerformance(perfRes.data.report ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const attendancePct = useMemo(() => {
    const total = overview?.attendance?.totalAttendance ?? 0;
    const present = overview?.attendance?.presentCount ?? 0;
    return calcPercentage(present, total);
  }, [overview]);

  const taskCompletionPct = useMemo(() => {
    const total = overview?.tasks?.totalTasks ?? 0;
    const completed = overview?.tasks?.completedTasks ?? 0;
    return calcPercentage(completed, total);
  }, [overview]);

  const attendanceChartData = useMemo(
    () => [
      { name: "Present", value: overview?.attendance?.presentCount ?? 0 },
      { name: "Absent", value: overview?.attendance?.absentCount ?? 0 },
      { name: "Leave", value: overview?.attendance?.leaveCount ?? 0 },
    ],
    [overview]
  );

  const taskChartData = useMemo(
    () => [
      { name: "Completed", value: overview?.tasks?.completedTasks ?? 0 },
      { name: "In Progress", value: overview?.tasks?.inProgressTasks ?? 0 },
      { name: "Pending", value: overview?.tasks?.pendingPractice ?? 0 },
    ],
    [overview]
  );

  const gradeDistribution = useMemo(() => {
    const grades = { A: 0, B: 0, C: 0 };
    performance.forEach((p) => {
      if (grades[p.grade] !== undefined) grades[p.grade]++;
    });
    return Object.entries(grades).map(([name, value]) => ({ name: `Grade ${name}`, value }));
  }, [performance]);

  const exportRows = performance.map((p) => ({
    "Student ID": p.studentId,
    Name: p.name,
    Course: p.course,
    "Attendance %": p.attendancePercentage,
    "Task Completion %": p.taskPercentage,
    Grade: p.grade,
  }));

  const handleExport = (type) => {
    if (!exportRows.length) return;
    if (type === "csv") exportToCSV(exportRows, "performance-report.csv");
    else if (type === "excel") exportToExcel(exportRows, "performance-report.xls");
    else exportToPDF("Student Performance Report", rowsToTableHtml(exportRows));
  };

  if (loading) return <Loader text="Loading reports..." />;

  if (error) {
    return (
      <div className="reports-page">
        <div className="alert-banner alert-error">{error}</div>
        <button type="button" className="btn btn-primary" onClick={fetchReports}>Retry</button>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <PageHeader title="Reports" subtitle="Analytics, performance metrics, and exports.">
        <div className="export-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleExport("csv")}>
            <Download size={16} /> CSV
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleExport("excel")}>
            <Download size={16} /> Excel
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleExport("pdf")}>
            <FileText size={16} /> PDF
          </button>
        </div>
      </PageHeader>

      <div className="report-kpi-row">
        <div className="report-kpi">
          <span className="report-kpi-label">Attendance Rate</span>
          <span className="report-kpi-value">{attendancePct}%</span>
          <div className="report-kpi-bar">
            <div className="report-kpi-fill" style={{ width: `${attendancePct}%`, background: "#2563EB" }} />
          </div>
        </div>
        <div className="report-kpi">
          <span className="report-kpi-label">Task Completion</span>
          <span className="report-kpi-value">{taskCompletionPct}%</span>
          <div className="report-kpi-bar">
            <div className="report-kpi-fill" style={{ width: `${taskCompletionPct}%`, background: "#22C55E" }} />
          </div>
        </div>
        <div className="report-kpi">
          <span className="report-kpi-label">Total Students</span>
          <span className="report-kpi-value">{overview?.students?.totalStudents ?? 0}</span>
        </div>
        <div className="report-kpi">
          <span className="report-kpi-label">Active Students</span>
          <span className="report-kpi-value">{overview?.students?.activeStudents ?? 0}</span>
        </div>
      </div>

      <div className="reports-charts-grid">
        <div className="page-card chart-card-report">
          <h2>Attendance Breakdown</h2>
          <div className="chart-wrapper-report">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {attendanceChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="page-card chart-card-report">
          <h2>Task Status</h2>
          <div className="chart-wrapper-report">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                  {taskChartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                <Legend formatter={(v) => <span style={{ color: "#64748B", fontSize: 13 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="page-card chart-card-report">
          <h2>Grade Distribution</h2>
          <div className="chart-wrapper-report">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="performance-header">
          <h2><BarChart3 size={20} /> Student Performance</h2>
          <span>{performance.length} students</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Attendance %</th>
                <th>Task %</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((row, i) => (
                <tr key={i}>
                  <td className="cell-mono">{row.studentId}</td>
                  <td className="cell-bold">{row.name}</td>
                  <td>{row.course}</td>
                  <td>{row.attendancePercentage}%</td>
                  <td>{row.taskPercentage}%</td>
                  <td>
                    <span className={`grade-badge grade-${row.grade}`}>{row.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
