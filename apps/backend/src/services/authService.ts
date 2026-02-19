import { prisma } from './db'

export const AuthService = {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
    },

    async createUser(email: string, passwordHash: string) {
        return prisma.user.create({
            data: { email, passwordHash }
        })
    }
}
