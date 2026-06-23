import api from "./axios";

export const getAttendance = () => api.get("/attendance");
export const getStudentAttendance = (studentId) => api.get(`/attendance/${studentId}`);
export const createAttendance = (data) => api.post("/attendance", data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
