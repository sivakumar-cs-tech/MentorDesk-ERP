import { useCallback, useEffect, useState } from "react";
import {
  Clock3,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  BookOpen,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatRelativeTime } from "../utils/format";
import { getTimelines } from "../api/timelines";
import "../styles/timeline.css";

const ACTION_CONFIG = {
  "Student Created": { icon: UserPlus, color: "#2563EB" },
  "Student Added": { icon: UserPlus, color: "#2563EB" },
  "Task Assigned": { icon: ClipboardList, color: "#F59E0B" },
  "Attendance Marked": { icon: CalendarCheck, color: "#22C55E" },
  "Course Assigned": { icon: BookOpen, color: "#8B5CF6" },
};

const getConfig = (action) =>
  ACTION_CONFIG[action] || { icon: Clock3, color: "#64748B" };

const Timeline = () => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchTimelines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTimelines();
      setTimelines(res.data.timelines ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load timeline.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelines();
  }, [fetchTimelines]);

  const filtered = timelines.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.action?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.studentId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="timeline-page">
      <PageHeader title="Timeline" subtitle="Track all student and system activities.">
        <span className="timeline-count">{filtered.length} activities</span>
      </PageHeader>

      <div className="page-card">
        <div className="page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search activities..." />
        </div>

        {loading ? (
          <Loader text="Loading timeline..." />
        ) : error ? (
          <div className="alert-banner alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Clock3} title="No activities" message="Timeline events will appear here." />
        ) : (
          <div className="vertical-timeline">
            {filtered.map((item, index) => {
              const { icon: Icon, color } = getConfig(item.action);
              const studentName = item.studentId?.name || "Unknown";

              return (
                <div className="timeline-item" key={item._id}>
                  <div className="timeline-line-wrap">
                    <div className="timeline-dot" style={{ background: color }}>
                      <Icon size={16} color="white" />
                    </div>
                    {index < filtered.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-content-header">
                      <h3>{item.action}</h3>
                      <span className="timeline-time">{formatRelativeTime(item.createdAt)}</span>
                    </div>
                    <p className="timeline-desc">{item.description}</p>
                    <div className="timeline-meta">
                      <span className="timeline-student">{studentName}</span>
                      <span className="timeline-by">by {item.createdBy || "Admin"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
