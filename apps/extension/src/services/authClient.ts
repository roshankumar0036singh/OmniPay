const API_URL = "http://localhost:3000/api"

export const AuthClient = {
    async login(email: string) {
        // Call backend
        return { token: "fake-jwt" }
    },

    async logout() {
        // Clear token
    }
}
