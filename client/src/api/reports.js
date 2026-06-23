import api from "./axios";

export const getDashboardStats = () => api.get("/dashboard");
export const getOverviewReport = () => api.get("/reports/overview");
export const getPerformanceReport = () => api.get("/reports/performance");
export const getCoursewiseReport = () => api.get("/reports/coursewise");
