import { useCallback, useEffect, useState } from "react";
import { Clock3, UserPlus, CheckCircle2, ClipboardList, BookOpen } from "lucide-react";

import api from "../../api/axios";

const ACTION_ICONS = {
  "Student Added": UserPlus,
  "Attendance Marked": CheckCircle2,
  "Task Assigned": ClipboardList,
  "Course Updated": BookOpen,
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RecentActivities = () => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimelines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/timelines");
      setTimelines(res.data.timelines ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recent activities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  const recentItems = timelines.slice(0, 8);

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <h2>Recent Activities</h2>
        {!loading && !error && (
          <span className="panel-card-count">{recentItems.length} items</span>
        )}
      </div>

      {loading && (
        <div className="dashboard-loading">
          <Clock3 size={24} />
          <p>Loading activities...</p>
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          <p>{error}</p>
          <button type="button" className="dashboard-retry-btn" onClick={fetchTimelines}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && recentItems.length === 0 && (
        <div className="dashboard-empty">
          <Clock3 size={24} />
          <p>No recent activities yet.</p>
        </div>
      )}

      {!loading && !error && recentItems.length > 0 && (
        <div className="activity-list">
          {recentItems.map((item) => {
            const Icon = ACTION_ICONS[item.action] || Clock3;
            const studentName =
              item.studentId?.name || item.studentId?.studentId || "Unknown student";

            return (
              <div className="activity-item" key={item._id}>
                <div className="activity-icon">
                  <Icon size={18} />
                </div>
                <div className="activity-body">
                  <p className="activity-title">{item.action}</p>
                  <p className="activity-desc">{item.description}</p>
                  <p className="activity-meta">
                    {studentName} · {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
