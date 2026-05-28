import {request, getAuthHeaders} from "./userApi";

//admin related API calls

export async function getAllUsersCarts() {
    return request("/admin/carts", {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    });
}