import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { CSRF_SECRET } from '../config'
import ForbiddenError from '../errors/forbidden-error'

const CSRF_COOKIE = 'csrfToken'
const TEST_CSRF_COOKIE = '_csrf'
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

    const cookieOptions = {
        httpOnly: false,
        sameSite: 'strict' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    }

    res.cookie(CSRF_COOKIE, token, cookieOptions)
    res.cookie(TEST_CSRF_COOKIE, token, cookieOptions)

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

    const cookieToken =
        req.cookies?.[TEST_CSRF_COOKIE] ?? req.cookies?.[CSRF_COOKIE]
    const headerToken = req.header(CSRF_HEADER)

    if (
        typeof cookieToken !== 'string' ||
        typeof headerToken !== 'string' ||
        !isValidSignedToken(cookieToken) ||
        cookieToken.length !== headerToken.length
    ) {
        return next(new ForbiddenError('РќРµРІР°Р»РёРґРЅС‹Р№ CSRF-С‚РѕРєРµРЅ'))
    }

    const cookieBuffer = Buffer.from(cookieToken)
    const headerBuffer = Buffer.from(headerToken)

    if (!crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
        return next(new ForbiddenError('РќРµРІР°Р»РёРґРЅС‹Р№ CSRF-С‚РѕРєРµРЅ'))
    }

    return next()
}

export { CSRF_COOKIE, csrfProtection, issueCsrfToken }