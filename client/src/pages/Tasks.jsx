import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressBar from "../components/ui/ProgressBar";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate, toInputDate } from "../utils/format";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { getStudents } from "../api/students";
import { getCourses } from "../api/courses";
import "../styles/tasks.css";

const TASK_STATUSES = [
  "In Progress",
  "Pending Practice",
  "Practice Completed",
  "Completed",
];

const EMPTY_FORM = {
  studentId: "",
  courseId: "",
  moduleName: "",
  topicName: "",
  startDate: "",
  endDate: "",
  duration: "",
  durationType: "Days",
  totalQuestions: "",
  completedQuestions: 0,
  status: "In Progress",
  remarks: "",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, studentsRes, coursesRes] = await Promise.all([
        getTasks(),
        getStudents(),
        getCourses(),
      ]);
      setTasks(tasksRes.data.tasks ?? []);
      setStudents(studentsRes.data.students ?? []);
      setCourses(coursesRes.data.courses ?? []);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load tasks." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.moduleName?.toLowerCase().includes(q) ||
      t.topicName?.toLowerCase().includes(q) ||
      t.studentId?.name?.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({
      studentId: task.studentId?._id || task.studentId || "",
      courseId: task.courseId?._id || task.courseId || "",
      moduleName: task.moduleName || "",
      topicName: task.topicName || "",
      startDate: toInputDate(task.startDate),
      endDate: toInputDate(task.endDate),
      duration: task.duration || "",
      durationType: task.durationType || "Days",
      totalQuestions: task.totalQuestions || "",
      completedQuestions: task.completedQuestions || 0,
      status: task.status || "In Progress",
      remarks: task.remarks || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      ...form,
      duration: Number(form.duration),
      totalQuestions: Number(form.totalQuestions),
      completedQuestions: Number(form.completedQuestions),
    };
    try {
      if (editing) {
        await updateTask(editing._id, payload);
        setMessage({ type: "success", text: "Task updated." });
      } else {
        await createTask(payload);
        setMessage({ type: "success", text: "Task assigned." });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(task._id);
      setMessage({ type: "success", text: "Task deleted." });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Delete failed." });
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="tasks-page">
      <PageHeader title="Tasks" subtitle="Assign and track student learning tasks.">
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Assign Task
        </button>
      </PageHeader>

      {message && (
        <div className={`alert-banner alert-${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="page-card">
        <div className="page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        </div>

        {loading ? (
          <Loader text="Loading tasks..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No tasks found" message="Assign a task to get started." />
        ) : (
          <div className="tasks-grid">
            {filtered.map((task) => {
              const total = task.totalQuestions || 0;
              const completed = task.completedQuestions || 0;
              const remaining = task.remainingQuestions ?? total - completed;

              return (
                <div className="task-card" key={task._id}>
                  <div className="task-card-header">
                    <div>
                      <h3>{task.topicName}</h3>
                      <p>{task.moduleName}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  <p className="task-student">{task.studentId?.name || "—"}</p>
                  <p className="task-course">{task.courseId?.courseName || "—"}</p>

                  <ProgressBar value={completed} max={total} label="Progress" />

                  <div className="task-stats">
                    <div className="task-stat">
                      <span className="task-stat-val">{total}</span>
                      <span className="task-stat-label">Questions</span>
                    </div>
                    <div className="task-stat">
                      <span className="task-stat-val">{completed}</span>
                      <span className="task-stat-label">Completed</span>
                    </div>
                    <div className="task-stat">
                      <span className="task-stat-val">{remaining}</span>
                      <span className="task-stat-label">Remaining</span>
                    </div>
                  </div>

                  <div className="task-dates">
                    <span>{formatDate(task.startDate)} → {formatDate(task.endDate)}</span>
                  </div>

                  <div className="task-card-actions">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(task)}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(task)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Task" : "Assign Task"} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student *</label>
              <select value={form.studentId} onChange={(e) => updateField("studentId", e.target.value)} required>
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Course *</label>
              <select value={form.courseId} onChange={(e) => updateField("courseId", e.target.value)} required>
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Module *</label>
              <input value={form.moduleName} onChange={(e) => updateField("moduleName", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Topic *</label>
              <input value={form.topicName} onChange={(e) => updateField("topicName", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input type="number" min="1" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Duration Type</label>
              <select value={form.durationType} onChange={(e) => updateField("durationType", e.target.value)}>
                <option value="Minutes">Minutes</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Questions *</label>
              <input type="number" min="1" value={form.totalQuestions} onChange={(e) => updateField("totalQuestions", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Completed Questions</label>
              <input type="number" min="0" value={form.completedQuestions} onChange={(e) => updateField("completedQuestions", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group full-width">
              <label>Remarks</label>
              <input value={form.remarks} onChange={(e) => updateField("remarks", e.target.value)} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Task" : "Assign Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
