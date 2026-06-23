import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../api/courses";
import "../styles/courses.css";

const EMPTY_FORM = {
  courseName: "",
  courseCode: "",
  duration: "",
  durationType: "Months",
  description: "",
  status: true,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data.courses ?? []);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load courses." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = courses.filter(
    (c) =>
      c.status !== false &&
      (c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
        c.courseCode?.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      courseName: course.courseName || "",
      courseCode: course.courseCode || "",
      duration: course.duration || "",
      durationType: course.durationType || "Months",
      description: course.description || "",
      status: course.status !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = { ...form, duration: Number(form.duration) };
    try {
      if (editing) {
        await updateCourse(editing._id, payload);
        setMessage({ type: "success", text: "Course updated successfully." });
      } else {
        await createCourse(payload);
        setMessage({ type: "success", text: "Course added successfully." });
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Save failed. Update/delete routes may need backend support.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Soft delete ${course.courseName}?`)) return;
    try {
      await deleteCourse(course._id);
      setMessage({ type: "success", text: "Course deleted." });
      fetchCourses();
    } catch {
      try {
        await updateCourse(course._id, { ...course, status: false });
        setCourses((prev) => prev.map((c) => (c._id === course._id ? { ...c, status: false } : c)));
        setMessage({ type: "success", text: "Course marked inactive." });
      } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.message || "Delete failed." });
      }
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="courses-page">
      <PageHeader title="Courses" subtitle="Manage training courses and curriculum.">
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Course
        </button>
      </PageHeader>

      {message && (
        <div className={`alert-banner alert-${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="page-card">
        <div className="page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>

        {loading ? (
          <Loader text="Loading courses..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses found" message="Add a course to get started." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course._id}>
                    <td className="cell-bold">{course.courseName}</td>
                    <td className="cell-mono">{course.courseCode}</td>
                    <td>{course.duration} {course.durationType}</td>
                    <td className="cell-desc">{course.description || "—"}</td>
                    <td>
                      <StatusBadge status={course.status !== false ? "Active" : "Inactive"} />
                    </td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="btn btn-secondary btn-icon" onClick={() => openEdit(course)}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="btn btn-danger btn-icon" onClick={() => handleDelete(course)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Course" : "Add Course"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label>Course Name *</label>
              <input value={form.courseName} onChange={(e) => updateField("courseName", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Course Code *</label>
              <input value={form.courseCode} onChange={(e) => updateField("courseCode", e.target.value.toUpperCase())} required />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input type="number" min="1" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Duration Type</label>
              <select value={form.durationType} onChange={(e) => updateField("durationType", e.target.value)}>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} style={{ height: "auto", padding: "12px 14px" }} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Course" : "Add Course"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;
