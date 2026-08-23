import { NextFunction, Request, Response } from 'express'

const publicCache = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.method === 'GET') {
        res.setHeader(
            'Cache-Control',
            'public, max-age=60, stale-while-revalidate=30'
        )
    }

    next()
}

export default publicCache