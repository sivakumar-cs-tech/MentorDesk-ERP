import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarCheck,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate, calcDuration, formatDuration } from "../utils/format";
import { getAttendance, createAttendance, updateAttendance } from "../api/attendance";
import { getStudents } from "../api/students";
import "../styles/attendance.css";

const STATUS_OPTIONS = ["Present", "Absent", "Leave", "Late"];

const getMonthDays = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const Attendance = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    studentId: "",
    status: "Present",
    inTime: "",
    outTime: "",
    leaveReason: "",
    remarks: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attRes, stuRes] = await Promise.all([getAttendance(), getStudents()]);
      setRecords(attRes.data.attendance ?? []);
      setStudents(stuRes.data.students ?? []);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load attendance." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthDays = useMemo(
    () => getMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const monthRecords = useMemo(
    () =>
      records.filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [records, currentMonth, currentYear]
  );

  const dayRecords = useMemo(
    () =>
      records.filter((r) => sameDay(new Date(r.date), selectedDate)),
    [records, selectedDate]
  );

  const filteredDayRecords = dayRecords.filter((r) => {
    const name = r.studentId?.name || "";
    const id = r.studentId?.studentId || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const monthlySummary = useMemo(() => {
    const summary = { Present: 0, Absent: 0, Leave: 0, Late: 0 };
    monthRecords.forEach((r) => {
      const status = r.remarks?.includes("Late") && r.status === "Present" ? "Late" : r.status;
      if (summary[status] !== undefined) summary[status]++;
    });
    return summary;
  }, [monthRecords]);

  const recordsByDate = useMemo(() => {
    const map = {};
    monthRecords.forEach((r) => {
      const key = new Date(r.date).toDateString();
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [monthRecords]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const openMark = (record = null) => {
    if (record) {
      setEditing(record);
      const isLate = record.remarks?.includes("Late");
      setForm({
        studentId: record.studentId?._id || record.studentId,
        status: isLate ? "Late" : record.status,
        inTime: record.inTime || "",
        outTime: record.outTime || "",
        leaveReason: record.leaveReason || "",
        remarks: record.remarks || "",
      });
    } else {
      setEditing(null);
      setForm({
        studentId: "",
        status: "Present",
        inTime: "",
        outTime: "",
        leaveReason: "",
        remarks: "",
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const isLate = form.status === "Late";
    const payload = {
      studentId: form.studentId,
      date: selectedDate,
      status: isLate ? "Present" : form.status,
      inTime: form.inTime,
      outTime: form.outTime,
      duration: calcDuration(form.inTime, form.outTime),
      leaveReason: form.leaveReason,
      remarks: isLate ? `Late${form.remarks ? ` — ${form.remarks}` : ""}` : form.remarks,
    };

    try {
      if (editing) {
        await updateAttendance(editing._id, payload);
        setMessage({ type: "success", text: "Attendance updated." });
      } else {
        await createAttendance(payload);
        setMessage({ type: "success", text: "Attendance marked." });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const displayStatus = (record) => {
    if (record.remarks?.includes("Late") && record.status === "Present") return "Late";
    return record.status;
  };

  return (
    <div className="attendance-page">
      <PageHeader title="Attendance" subtitle="Mark and track daily student attendance.">
        <button type="button" className="btn btn-primary" onClick={() => openMark()}>
          <Plus size={18} /> Mark Attendance
        </button>
      </PageHeader>

      {message && (
        <div className={`alert-banner alert-${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="attendance-grid">
        <div className="page-card calendar-card">
          <div className="calendar-header">
            <button type="button" className="btn btn-secondary btn-icon" onClick={prevMonth}>
              <ChevronLeft size={18} />
            </button>
            <h2>{monthLabel}</h2>
            <button type="button" className="btn btn-secondary btn-icon" onClick={nextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar-days">
            {monthDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="calendar-day empty" />;
              const count = recordsByDate[day.toDateString()] || 0;
              const isSelected = sameDay(day, selectedDate);
              const isToday = sameDay(day, today);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="day-num">{day.getDate()}</span>
                  {count > 0 && <span className="day-dot">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="attendance-side">
          <div className="summary-cards">
            {STATUS_OPTIONS.map((status) => (
              <div className="summary-card" key={status}>
                <StatusBadge status={status} />
                <span className="summary-count">{monthlySummary[status]}</span>
                <span className="summary-label">This month</span>
              </div>
            ))}
          </div>

          <div className="page-card">
            <div className="day-panel-header">
              <h3>{formatDate(selectedDate)}</h3>
              <SearchBar value={search} onChange={setSearch} placeholder="Search student..." />
            </div>

            {loading ? (
              <Loader text="Loading records..." />
            ) : filteredDayRecords.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="No records"
                message="No attendance for this date. Click Mark Attendance to add."
              />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Status</th>
                      <th>In</th>
                      <th>Out</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDayRecords.map((record) => (
                      <tr key={record._id} onClick={() => openMark(record)} style={{ cursor: "pointer" }}>
                        <td className="cell-bold">{record.studentId?.name || "—"}</td>
                        <td><StatusBadge status={displayStatus(record)} /></td>
                        <td>{record.inTime || "—"}</td>
                        <td>{record.outTime || "—"}</td>
                        <td>{formatDuration(record.duration)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => { e.stopPropagation(); openMark(record); }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Attendance" : "Mark Attendance"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave}>
          <p className="modal-date-label">Date: {formatDate(selectedDate)}</p>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Student *</label>
              <select
                value={form.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                required
                disabled={!!editing}
              >
                <option value="">Select student</option>
                {students.filter((s) => s.status === "Active").map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.studentId})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Time In</label>
              <input type="time" value={form.inTime} onChange={(e) => updateField("inTime", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time Out</label>
              <input type="time" value={form.outTime} onChange={(e) => updateField("outTime", e.target.value)} />
            </div>
            {form.status === "Leave" && (
              <div className="form-group full-width">
                <label>Leave Reason</label>
                <input value={form.leaveReason} onChange={(e) => updateField("leaveReason", e.target.value)} />
              </div>
            )}
            <div className="form-group full-width">
              <label>Remarks</label>
              <input value={form.remarks} onChange={(e) => updateField("remarks", e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
