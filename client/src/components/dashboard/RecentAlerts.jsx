import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  UserX,
  ClipboardList,
  LogOut,
  Users,
} from "lucide-react";

import api from "../../api/axios";

const RecentAlerts = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/dashboard");
      setDashboard(res.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const alerts = useMemo(() => {
    if (!dashboard) return [];

    const items = [];

    if (dashboard.absentToday > 0) {
      items.push({
        id: "absent",
        type: "danger",
        icon: UserX,
        title: `${dashboard.absentToday} Student${dashboard.absentToday > 1 ? "s" : ""} Absent Today`,
        message: "Follow up on absent students for today's session.",
      });
    }

    if (dashboard.pendingPractice > 0) {
      items.push({
        id: "pending-tasks",
        type: "warning",
        icon: ClipboardList,
        title: `${dashboard.pendingPractice} Task${dashboard.pendingPractice > 1 ? "s" : ""} Pending Practice`,
        message: "Review and assign practice tasks to students.",
      });
    }

    if (dashboard.missingCheckout > 0) {
      items.push({
        id: "checkout",
        type: "warning",
        icon: LogOut,
        title: `${dashboard.missingCheckout} Missing Checkout`,
        message: "Students marked present without checkout time.",
      });
    }

    if (dashboard.inactiveStudents > 0) {
      items.push({
        id: "inactive",
        type: "info",
        icon: Users,
        title: `${dashboard.inactiveStudents} Inactive Student${dashboard.inactiveStudents > 1 ? "s" : ""}`,
        message: "Consider re-engaging or updating student status.",
      });
    }

    if (dashboard.leaveToday > 0) {
      items.push({
        id: "leave",
        type: "info",
        icon: AlertTriangle,
        title: `${dashboard.leaveToday} On Leave Today`,
        message: "Students on approved leave for today.",
      });
    }

    if (items.length === 0) {
      items.push({
        id: "all-clear",
        type: "success",
        icon: AlertTriangle,
        title: "All Clear",
        message: "No critical alerts at the moment. Everything looks good!",
      });
    }

    return items;
  }, [dashboard]);

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2>Recent Alerts</h2>
        {!loading && !error && (
          <span className="panel-card-count">{alerts.length} alerts</span>
        )}
      </div>

      {loading && (
        <div className="dashboard-loading">
          <AlertTriangle size={24} />
          <p>Loading alerts...</p>
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          <p>{error}</p>
          <button type="button" className="dashboard-retry-btn" onClick={fetchDashboard}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="alert-list">
          {alerts.map((alert) => {
            const Icon = alert.icon;

            return (
              <div className={`alert-item ${alert.type}`} key={alert.id}>
                <div className="alert-icon">
                  <Icon size={18} />
                </div>
                <div className="alert-body">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
