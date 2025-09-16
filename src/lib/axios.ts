import axios from "axios";

export type APIResponse<T, M = unknown> = {
  data: T;
  message: string;
  code: string;
  meta?: M;
}

export type APIError = APIResponse<null> & {error: string};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true, // if your API uses cookies too
});

api.interceptors.request.use(
  (config) => {
    // Logging interceptor
    if (process.env.NODE_ENV === "development") {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    // Auth interceptor (attach token)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Logging interceptor (response)
    if (process.env.NODE_ENV === "development") {
      console.log(`[API RESPONSE]`, response);
      if (Array.isArray(response.data.data)) {
        console.table(response.data.data)
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/api/v1/public")) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const { data: {data: {access_token, refresh_token}} } = await axios.post<APIResponse<{access_token: string, refresh_token: string}>>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/auth/refresh`, {
          refresh_token: localStorage.getItem("refreshToken"),
        });

        localStorage.setItem("token", access_token);

        // Update default headers
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);

        // Retry the failed request
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
