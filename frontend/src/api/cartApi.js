import {request, getAuthHeaders} from "./userApi";


export async function getCart() {
    return request("/cart/", {
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    });
}

export async function addItemToCart(recordId, quantity) {
    return request("/cart/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ record_id: recordId, quantity }),
    });
}

export async function updateCartItem(cartItemId, recordId, quantity) {
    return request(`/cart/items/${cartItemId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ record_id: recordId, quantity }),
    });
}

export async function deleteCartItem(cartItemId) {
    return request(`/cart/items/${cartItemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ record_id: cartItemId }),
    });
}

export async function clearCart() {
    return request("/cart/items", {
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    });
}