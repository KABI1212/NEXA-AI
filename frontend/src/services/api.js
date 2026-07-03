import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

function readCookie(name) {
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=") || "";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexa_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const csrfToken = readCookie("nexa_csrf");
  if (csrfToken) config.headers["X-CSRF-Token"] = decodeURIComponent(csrfToken);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original?._retry || original?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      await api.get("/auth/csrf");
      const { data } = await api.post("/auth/refresh");
      if (data.token) localStorage.setItem("nexa_token", data.token);
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem("nexa_token");
      localStorage.removeItem("nexa_user");
      return Promise.reject(refreshError);
    }
  }
);

export function apiError(error) {
  return error?.response?.data?.message || error.message || "Something went wrong";
}
