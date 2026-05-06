import apiClient from "./client";

export const authAPI = {
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  health: () => apiClient.get("/health"),
};

export const requestAPI = {
  create: (data) => apiClient.post("/requests", data),
  getMyRequests: () => apiClient.get("/requests/my"),
  getPendingRequests: () => apiClient.get("/requests/pending"),
  approve: (id, managerNote) =>
    apiClient.put(`/requests/${id}/approve`, { managerNote }),
  reject: (id, managerNote) =>
    apiClient.put(`/requests/${id}/reject`, { managerNote }),
};
