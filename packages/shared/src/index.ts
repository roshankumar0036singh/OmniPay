export const APP_NAME = "OmniPay";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const API_BASE_URL = "http://localhost:3000";
