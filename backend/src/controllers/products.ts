import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { Error as MongooseError } from 'mongoose'
import { join } from 'path'
import BadRequestError from '../errors/bad-request-error'
import ConflictError from '../errors/conflict-error'
import NotFoundError from '../errors/not-found-error'
import Product from '../models/product'
import movingFile from '../utils/movingFile'

// GET /product
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 5 } = req.query
        const options = {
            skip: (Number(page) - 1) * Number(limit),
            limit: Number(limit),
        }
        const products = await Product.find({}, null, options)
        const totalProducts = await Product.countDocuments({})
        const totalPages = Math.ceil(totalProducts / Number(limit))
        return res.send({
            items: products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                pageSize: Number(limit),
            },
        })
    } catch (err) {
        return next(err)
    }
}

// POST /product
const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { description, category, price, title, image } = req.body

        // Р СџР ВµРЎР‚Р ВµР Р…Р С•РЎРѓР С‘Р С Р С”Р В°РЎР‚РЎвЂљР С‘Р Р…Р С”РЎС“ Р С‘Р В· Р Р†РЎР‚Р ВµР СР ВµР Р…Р Р…Р С•Р в„– Р С—Р В°Р С—Р С”Р С‘
        if (image) {
            movingFile(
                image.fileName,
                join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`),
                join(__dirname, `../public/${process.env.UPLOAD_PATH}`)
            )
        }

        const product = await Product.create({
            description,
            image,
            category,
            price,
            title,
        })
        return res.status(constants.HTTP_STATUS_CREATED).send(product)
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(error.message))
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(
                new ConflictError('Р СћР С•Р Р†Р В°РЎР‚ РЎРѓ РЎвЂљР В°Р С”Р С‘Р С Р В·Р В°Р С–Р С•Р В»Р С•Р Р†Р С”Р С•Р С РЎС“Р В¶Р Вµ РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†РЎС“Р ВµРЎвЂљ')
            )
        }
        return next(error)
    }
}

// TODO: Р вЂќР С•Р В±Р В°Р Р†Р С‘РЎвЂљРЎРЉ guard admin
// PUT /product
const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { productId } = req.params
        const { description, category, price, title, image } = req.body

        // Р СџР ВµРЎР‚Р ВµР Р…Р С•РЎРѓР С‘Р С Р С”Р В°РЎР‚РЎвЂљР С‘Р Р…Р С”РЎС“ Р С‘Р В· Р Р†РЎР‚Р ВµР СР ВµР Р…Р Р…Р С•Р в„– Р С—Р В°Р С—Р С”Р С‘
        if (image) {
            movingFile(
                image.fileName,
                join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`),
                join(__dirname, `../public/${process.env.UPLOAD_PATH}`)
            )
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    description,
                    category,
                    title,
                    price: price ?? null,
                    image: image || undefined,
                },
            },
            { runValidators: true, new: true }
        ).orFail(() => new NotFoundError('Р СњР ВµРЎвЂљ РЎвЂљР С•Р Р†Р В°РЎР‚Р В° Р С—Р С• Р В·Р В°Р Т‘Р В°Р Р…Р Р…Р С•Р СРЎС“ id'))
        return res.send(product)
    } catch (error) {
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(error.message))
        }
        if (error instanceof MongooseError.CastError) {
            return next(new BadRequestError('Р СџР ВµРЎР‚Р ВµР Т‘Р В°Р Р… Р Р…Р Вµ Р Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р в„– ID РЎвЂљР С•Р Р†Р В°РЎР‚Р В°'))
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(
                new ConflictError('Р СћР С•Р Р†Р В°РЎР‚ РЎРѓ РЎвЂљР В°Р С”Р С‘Р С Р В·Р В°Р С–Р С•Р В»Р С•Р Р†Р С”Р С•Р С РЎС“Р В¶Р Вµ РЎРѓРЎС“РЎвЂ°Р ВµРЎРѓРЎвЂљР Р†РЎС“Р ВµРЎвЂљ')
            )
        }
        return next(error)
    }
}

// TODO: Р вЂќР С•Р В±Р В°Р Р†Р С‘РЎвЂљРЎРЉ guard admin
// DELETE /product
const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { productId } = req.params
        const product = await Product.findByIdAndDelete(productId).orFail(
            () => new NotFoundError('Р СњР ВµРЎвЂљ РЎвЂљР С•Р Р†Р В°РЎР‚Р В° Р С—Р С• Р В·Р В°Р Т‘Р В°Р Р…Р Р…Р С•Р СРЎС“ id')
        )
        return res.send(product)
    } catch (error) {
        if (error instanceof MongooseError.CastError) {
            return next(new BadRequestError('Р СџР ВµРЎР‚Р ВµР Т‘Р В°Р Р… Р Р…Р Вµ Р Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р в„– ID РЎвЂљР С•Р Р†Р В°РЎР‚Р В°'))
        }
        return next(error)
    }
}

export { createProduct, deleteProduct, getProducts, updateProduct }
