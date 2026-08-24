import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const resolvedBaseDir = path.resolve(baseDir)

    return (req: Request, res: Response, next: NextFunction) => {
        const relativePath = req.path.replace(/^[/\\]+/, '')
        const filePath = path.resolve(resolvedBaseDir, relativePath)
        const relativeToBase = path.relative(resolvedBaseDir, filePath)

        if (relativeToBase.startsWith('..') || path.isAbsolute(relativeToBase)) {
            return next()
        }

        fs.access(filePath, fs.constants.F_OK, (accessError) => {
            if (accessError) {
                return next()
            }

            return res.sendFile(filePath, (sendError) => {
                if (sendError) {
                    next(sendError)
                }
            })
        })
    }
}