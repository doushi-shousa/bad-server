import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { authRateLimiter } from '../middlewares/rate-limit'
import { validateUserUpdateBody } from '../middlewares/validations'
import { issueCsrfToken } from '../middlewares/csrf'

const authRouter = Router()

authRouter.get('/csrf', issueCsrfToken)
authRouter.get('/csrf-token', issueCsrfToken)

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', auth, validateUserUpdateBody, updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.post('/login', authRateLimiter, login)
authRouter.post('/token', authRateLimiter, refreshAccessToken)
authRouter.post('/logout', logout)
authRouter.post('/register', authRateLimiter, register)

export default authRouter
