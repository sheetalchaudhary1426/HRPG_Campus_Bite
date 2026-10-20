const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://hrpg-campus-bite.onrender.com"
).replace(/\/+$/, "");
const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("campusbite_token");
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message ||
        data?.error?.message ||
        `Request failed (${response.status})`,
      response.status
    );
  }

  return data;
}

function queryString(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const authAPI = {
  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getMe: () => request("/auth/me"),
};

export const menuAPI = {
  getAll: (filters) => request(`/menu${queryString(filters)}`),
  getById: (id) => request(`/menu/${id}`),
  create: (itemData) =>
    request("/menu", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),
  update: (id, itemData) =>
    request(`/menu/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),
  remove: (id) =>
    request(`/menu/${id}`, {
      method: "DELETE",
    }),
};

export const orderAPI = {
  create: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  getMyOrders: () => request("/orders/my"),
  getAll: () => request("/orders"),
  updateStatus: (orderId, status) =>
    request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const adminAPI = {
  getStats: () => request("/admin/stats"),
};
