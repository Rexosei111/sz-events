import { WindowRounded } from "@mui/icons-material";
import axios from "axios";

export const APIClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

APIClient.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("szevent_token");
      if (item !== null) {
        const data = JSON.parse(item);
        token = data ? data?.access_token : null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

APIClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPathname = window.location.pathname;
        if (currentPathname.startsWith("/admin")) {
          window.location.href = `/auth/admins?callbackUrl=${currentPathname}`;
        }
        if (currentPathname.startsWith("/user")) {
          window.location.href = `/auth/users?callbackUrl=${currentPathname}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export const UserAPIClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

UserAPIClient.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem("szevent_token");
      if (item !== null) {
        const data = JSON.parse(item);
        token = data ? data?.access_token : null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

UserAPIClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const currentPathname = window.location.pathname;
        if (currentPathname.startsWith("/admin")) {
          window.location.href = `/auth/admins?callbackUrl=${currentPathname}`;
        }
        if (currentPathname.startsWith("/user")) {
          window.location.href = `/auth/users?callbackUrl=${currentPathname}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
