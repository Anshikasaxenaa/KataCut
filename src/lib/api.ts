const BASE_URL = "http://localhost:5000/api";

export const api = {
  get: async (endpoint: string) => {
    return request(endpoint, { method: "GET" });
  },
  post: async (endpoint: string, data: any) => {
    return request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  put: async (endpoint: string, data: any) => {
    return request(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  delete: async (endpoint: string) => {
    return request(endpoint, { method: "DELETE" });
  },
};

async function request(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = text;
  }

  if (!response.ok) {
    const error = data?.error || response.statusText;
    throw new Error(error);
  }

  return data;
}
