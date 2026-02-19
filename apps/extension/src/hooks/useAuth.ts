import { useState, useEffect } from "react"
// import { checkAuth } from "../services/authClient"

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check auth status
        setLoading(false)
    }, [])

    return { user, loading }
}
