import { request, getAuthHeaders } from "./userApi";

//auth related API calls

export async function registerUser(userData) {
    return request("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
}

export async function loginUser(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    return request("/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
    });
}

export async function getCurrentUser() {
    return request("/auth/me", {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    });
}

export function saveAuthData(authData) {
    localStorage.setItem("token", authData.access_token);
    localStorage.setItem("userId", authData.user_id);
    localStorage.setItem("username", authData.username);
    localStorage.setItem("role", authData.role);
}

export function clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
}

export function getUserData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    return token ? { token, userId, username, role } : null;
}

export function isLoggedIn() {
    return Boolean(localStorage.getItem("token"));
}

export function isAdmin() {
    return localStorage.getItem("role") === "admin";
}