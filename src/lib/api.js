// Helper fetch terpusat untuk sisi client: headers JSON, cookies same-origin,
// parsing respons, dan format error yang konsisten.
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export async function apiFetch(url, options = {}) {
    let res;
    try {
        res = await fetch(url, {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch {
        throw new ApiError("Tidak dapat terhubung ke server", 0);
    }

    let body = null;
    try {
        body = await res.json();
    } catch {
        // respons non-JSON dibiarkan null
    }

    if (!res.ok) {
        const message =
            (body && (body.error || body.message)) ||
            `Request gagal (${res.status})`;
        throw new ApiError(message, res.status);
    }

    return body;
}
