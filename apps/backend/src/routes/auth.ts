import { Router } from 'express'
// import { login, register, me } from '../controllers/authController'

const router = Router()

router.post('/login', (req, res) => { res.send('login') })
router.post('/register', (req, res) => { res.send('register') })
router.get('/me', (req, res) => { res.send('me') })

export default router
