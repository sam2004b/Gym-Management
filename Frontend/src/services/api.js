const BASE_URL = "http://localhost:5136/api/auth";

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Login failed");
  }

  return result;
}

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Registration failed");
  }

  return result;
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
  });

  const result = await response.json().catch(() => null);

  return result;
}

export async function getProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch profile");
  }

  return result;
}

export async function updateProfile(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Failed to update profile");
  }

  return result;
}