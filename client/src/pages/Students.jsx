import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Download, Users } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SearchBar from "../components/ui/SearchBar";
import Pagination from "../components/ui/Pagination";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { usePagination } from "../hooks/usePagination";
import { formatDate, toInputDate } from "../utils/format";
import { exportToCSV, exportToExcel } from "../utils/export";
import {
  getStudents,
  createStudent,
  updateStudent,
  inactiveStudent,
} from "../api/students";
import { getCourses } from "../api/courses";
import "../styles/students.css";

const EMPTY_FORM = {
  name: "",
  phone: "",
  parentPhone: "",
  courseId: "",
  joinDate: "",
  courseEndDate: "",
  extraMonths: 0,
  status: "Active",
  notes: "",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        getStudents(),
        getCourses(),
      ]);
      setStudents(studentsRes.data.students ?? []);
      setCourses(coursesRes.data.courses ?? []);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load students." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search);
    const matchStatus = showInactive ? s.status === "Inactive" : s.status !== "Inactive";
    return matchSearch && matchStatus;
  });

  const { page, totalPages, paginatedItems, goToPage, resetPage } = usePagination(filtered, 10);

  useEffect(() => {
    resetPage();
  }, [search, showInactive, resetPage]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      name: student.name || "",
      phone: student.phone || "",
      parentPhone: student.parentPhone || "",
      courseId: student.courseId?._id || student.courseId || "",
      joinDate: toInputDate(student.joinDate),
      courseEndDate: toInputDate(student.courseEndDate),
      extraMonths: student.extraMonths || 0,
      status: student.status || "Active",
      notes: student.notes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editing) {
        await updateStudent(editing._id, form);
        setMessage({ type: "success", text: "Student updated successfully." });
      } else {
        await createStudent(form);
        setMessage({ type: "success", text: "Student added successfully." });
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Deactivate ${student.name}?`)) return;
    try {
      await inactiveStudent(student._id);
      setMessage({ type: "success", text: "Student deactivated." });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Delete failed." });
    }
  };

  const handleExport = (type) => {
    const rows = filtered.map((s) => ({
      "Student ID": s.studentId,
      Name: s.name,
      Phone: s.phone,
      Course: s.courseId?.courseName || "—",
      "Join Date": formatDate(s.joinDate),
      Status: s.status,
    }));
    if (type === "csv") exportToCSV(rows, "students.csv");
    else exportToExcel(rows, "students.xls");
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="students-page">
      <PageHeader title="Students" subtitle="Manage student records, enrollment, and status.">
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Student
        </button>
      </PageHeader>

      {message && (
        <div className={`alert-banner alert-${message.type === "error" ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      <div className="page-card">
        <div className="page-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, phone..." />
          <div className="toolbar-actions">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              Show inactive
            </label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleExport("csv")}>
              <Download size={16} /> CSV
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleExport("excel")}>
              <Download size={16} /> Excel
            </button>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading students..." />
        ) : paginatedItems.length === 0 ? (
          <EmptyState icon={Users} title="No students found" message="Add a student or adjust your search." />
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((student) => (
                    <tr key={student._id}>
                      <td className="cell-mono">{student.studentId}</td>
                      <td className="cell-bold">{student.name}</td>
                      <td>{student.phone}</td>
                      <td>{student.courseId?.courseName || "—"}</td>
                      <td>{formatDate(student.joinDate)}</td>
                      <td><StatusBadge status={student.status} /></td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="btn btn-secondary btn-icon" onClick={() => openEdit(student)} title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="btn btn-danger btn-icon" onClick={() => handleDelete(student)} title="Deactivate">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Student" : "Add Student"} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Parent Phone</label>
              <input value={form.parentPhone} onChange={(e) => updateField("parentPhone", e.target.value)} />
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
              <label>Join Date *</label>
              <input type="date" value={form.joinDate} onChange={(e) => updateField("joinDate", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Course End Date *</label>
              <input type="date" value={form.courseEndDate} onChange={(e) => updateField("courseEndDate", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Extra Months</label>
              <input type="number" min="0" value={form.extraMonths} onChange={(e) => updateField("extraMonths", Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} style={{ height: "auto", padding: "12px 14px" }} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
