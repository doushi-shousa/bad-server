import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { CSRF_SECRET } from '../config'
import ForbiddenError from '../errors/forbidden-error'

const CSRF_COOKIE = 'csrfToken'
const CSRF_HEADER = 'x-csrf-token'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const signToken = (nonce: string) =>
    crypto.createHmac('sha256', CSRF_SECRET).update(nonce).digest('hex')

const createToken = () => {
    const nonce = crypto.randomBytes(32).toString('hex')
    return `${nonce}.${signToken(nonce)}`
}

const isValidSignedToken = (token: string) => {
    const [nonce, signature, ...rest] = token.split('.')

    if (!nonce || !signature || rest.length > 0) {
        return false
    }

    const expected = signToken(nonce)
    const actualBuffer = Buffer.from(signature, 'hex')
    const expectedBuffer = Buffer.from(expected, 'hex')

    return (
        actualBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    )
}

const issueCsrfToken = (_req: Request, res: Response) => {
    const token = createToken()

    res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })

    return res.status(200).json({ csrfToken: token })
}

const csrfProtection = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (SAFE_METHODS.has(req.method)) {
        return next()
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE]
    const headerToken = req.header(CSRF_HEADER)

    if (
        typeof cookieToken !== 'string' ||
        typeof headerToken !== 'string' ||
        !isValidSignedToken(cookieToken) ||
        cookieToken.length !== headerToken.length
    ) {
        return next(new ForbiddenError('Невалидный CSRF-токен'))
    }

    const cookieBuffer = Buffer.from(cookieToken)
    const headerBuffer = Buffer.from(headerToken)

    if (!crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
        return next(new ForbiddenError('Невалидный CSRF-токен'))
    }

    return next()
}

export { CSRF_COOKIE, csrfProtection, issueCsrfToken }