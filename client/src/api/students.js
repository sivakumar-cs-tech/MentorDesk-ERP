import api from "./axios";

export const getStudents = () => api.get("/students");
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const inactiveStudent = (id) => api.patch(`/students/${id}/inactive`);
export const restoreStudent = (id) => api.patch(`/students/${id}/restore`);
