import api from "./axios";

export const getTimelines = () => api.get("/timelines");
export const getStudentTimelines = (studentId) => api.get(`/timelines/${studentId}`);
export const createTimeline = (data) => api.post("/timelines", data);
