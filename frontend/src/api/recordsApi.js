import { request, getAuthHeaders } from "./userApi";

export async function getRecords() {
    return request("/records/", {
        method: "GET",
    });
}

export async function getRecordById(recordId) {
    return request(`/records/${recordId}`, {
        method: "GET",
    });
}

export async function createRecord(recordData) {
    return request("/records/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(recordData),
    });
}

export async function updateRecord(recordId, recordData) {
    return request(`/records/${recordId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(recordData),
    });
}

export async function deleteRecord(recordId) {
    return request(`/records/${recordId}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    });
}

export async function uploadRecordImage(recordId, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    return request(`/records/${recordId}/upload-image`, {
        method: "PATCH",
        headers: {
            ...getAuthHeaders(),
        },
        body: formData,
    });
}