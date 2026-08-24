import { rateLimit } from 'express-rate-limit'

const commonOptions = {
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Слишком много запросов. Попробуйте позже.',
    },
}

export const globalRateLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 1000,
    limit: 100,
})

export const authRateLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000,
    limit: 100,
})