import { API_BASE_URL } from "@omnipay/shared"

type RequestConfig = {
    method?: string
    headers?: Record<string, string>
    body?: any
}

export async function apiClient<T>(endpoint: string, { method = "GET", headers, body }: RequestConfig = {}): Promise<T> {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
}
