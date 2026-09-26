const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  
  let res;
  try {
    res = await fetch(`${API}${cleanPath}`, { ...options, headers });
  } catch (err) {
    throw new Error("Unable to connect to the server. Please ensure the backend is running.");
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    localStorage.removeItem("hostelfix_token");
    localStorage.removeItem("hostelfix_user");
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}
