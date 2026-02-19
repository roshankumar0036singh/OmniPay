import { Request, Response } from 'express'
import { AuthService } from '../services/authService'

export const login = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const user = await AuthService.findUserByEmail(email)
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({ token: 'mock-jwt-token', user })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await AuthService.createUser(email, password)
        res.json({ user })
    } catch (error) {
        res.status(500).json({ error: 'Could not create user' })
    }
}

export const me = async (req: Request, res: Response) => {
    res.json({ user: { id: 1, email: 'test@example.com' } }) // Mock for now
}
