// Production backend base URL
export const PRODUCTION_API_URL = "https://hostelfix-1-kbrx.onrender.com";

// Determine the base API URL
export function getApiBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim();

  // If in production mode or running in browser on a remote host (e.g. deployed frontend)
  const isProduction = import.meta.env.PROD;
  const isRemoteHost =
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  if (isProduction || isRemoteHost) {
    // If a custom external absolute HTTP/HTTPS API URL is explicitly configured (and is not localhost), use it; otherwise use production backend
    if (
      envUrl &&
      (envUrl.startsWith("http://") || envUrl.startsWith("https://")) &&
      !envUrl.includes("localhost") &&
      !envUrl.includes("127.0.0.1")
    ) {
      return envUrl.replace(/\/+$/, "");
    }
    return PRODUCTION_API_URL;
  }

  // In local development
  if (
    envUrl &&
    (envUrl.startsWith("http://") || envUrl.startsWith("https://") || envUrl.startsWith("/"))
  ) {
    return envUrl.replace(/\/+$/, "");
  }

  // Default to relative /api (forwarded to backend by Vite dev proxy)
  return "/api";
}

export const API = getApiBaseUrl();

export async function api(path, options = {}) {
  const token = localStorage.getItem("hostelfix_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  let url;
  if (API.startsWith("http://") || API.startsWith("https://")) {
    const baseWithoutApi = API.replace(/\/api$/, "").replace(/\/+$/, "");
    const normalizedPath = cleanPath.startsWith("/api/")
      ? cleanPath
      : `/api${cleanPath}`;
    url = `${baseWithoutApi}${normalizedPath}`;
  } else {
    // Relative path for local dev proxy (e.g. /api)
    url = cleanPath.startsWith("/api/")
      ? `${API.replace(/\/api$/, "")}${cleanPath}`
      : `${API}${cleanPath}`;
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    console.error(`Fetch failed for URL [${url}]:`, err);
    throw new Error("Unable to connect to the server. Please ensure the backend is running.");
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    localStorage.removeItem("hostelfix_token");
    localStorage.removeItem("hostelfix_user");
  }

  if (!res.ok) {
    const message =
      data.message ||
      data.error ||
      `Server returned error ${res.status}: ${res.statusText || "Request failed"}`;
    throw new Error(message);
  }

  return data;
}
