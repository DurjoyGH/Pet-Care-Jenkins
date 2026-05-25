import axios from "axios";
import { createAuth } from "@smart-auth/core";
import { createSmartAxios } from "@smart-auth/axios";

const API_BASE = "http://backend:5000/api/v1";

// Initialize @smart-auth/core auth engine
export const auth = createAuth({
  apiBaseUrl: API_BASE,
  storage: "local",
  refresh: {
    endpoint: "/auth/refresh",
  },
  autoRefresh: true,
  multiTabSync: true,
});

// Create axios instance
const api = axios.create({ baseURL: API_BASE });

// Attach @smart-auth/axios interceptors — auto token injection + 401 retry
createSmartAxios({ auth, axios: api });

export default api;
