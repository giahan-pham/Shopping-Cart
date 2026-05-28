/*
Shared API helpers utils
*/

const API_BASE_URL = "http://localhost:8000";

//retrieve token after login
export function getToken() {
    return localStorage.getItem("token");
}

//generate auth headers for protected routes
export function getAuthHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

//parse backend responses
async function handleResponse(response) {
    if (response.status === 204) {
        return null; // No content to return
    }

    const text = await response.text();

    if (!text) {
        return null; // No content to parse
    }

    try {
        return JSON.parse(text);
    } catch  {
        return text; // Return raw text if not JSON
    }
}

//generic API request function with error handling
export async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    const data = await handleResponse(response);

    if (!response.ok) {
        const message = data?.detail || response.statusText || "An error occurred";
        throw new Error(message);
    }
    return data;
}

export {API_BASE_URL}