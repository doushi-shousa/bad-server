import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^(\+\d+)?(?:\s|-?|\(?\d+\)?)+$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// Р Р†Р В°Р В»Р С‘Р Т‘Р В°РЎвЂ Р С‘РЎРЏ id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Р СњР ВµР Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р в„– id' })
                })
            )
            .messages({
                'array.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р…РЎвЂ№ РЎвЂљР С•Р Р†Р В°РЎР‚РЎвЂ№',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Р Р€Р С”Р В°Р В·Р В°Р Р…Р С• Р Р…Р Вµ Р Р†Р В°Р В»Р С‘Р Т‘Р Р…Р С•Р Вµ Р В·Р Р…Р В°РЎвЂЎР ВµР Р…Р С‘Р Вµ Р Т‘Р В»РЎРЏ РЎРѓР С—Р С•РЎРѓР С•Р В±Р В° Р С•Р С—Р В»Р В°РЎвЂљРЎвЂ№, Р Р†Р С•Р В·Р СР С•Р В¶Р Р…РЎвЂ№Р Вµ Р В·Р Р…Р В°РЎвЂЎР ВµР Р…Р С‘РЎРЏ - "card", "online"',
                'string.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р… РЎРѓР С—Р С•РЎРѓР С•Р В± Р С•Р С—Р В»Р В°РЎвЂљРЎвЂ№',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р… email',
        }),
        phone: Joi.string().required().pattern(phoneRegExp).messages({
            'string.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р… РЎвЂљР ВµР В»Р ВµРЎвЂћР С•Р Р…',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р… Р В°Р Т‘РЎР‚Р ВµРЎРѓ',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р…Р В° РЎРѓРЎС“Р СР СР В° Р В·Р В°Р С”Р В°Р В·Р В°',
        }),
        comment: Joi.string().max(2000).optional().allow(''),
    }),
})

// Р Р†Р В°Р В»Р С‘Р Т‘Р В°РЎвЂ Р С‘РЎРЏ РЎвЂљР С•Р Р†Р В°РЎР‚Р В°.
// name Р С‘ link - Р С•Р В±РЎРЏР В·Р В°РЎвЂљР ВµР В»РЎРЉР Р…РЎвЂ№Р Вµ Р С—Р С•Р В»РЎРЏ, name - Р С•РЎвЂљ 2 Р Т‘Р С• 30 РЎРѓР С‘Р СР Р†Р С•Р В»Р С•Р Р†, link - Р Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р в„– url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Р СљР С‘Р Р…Р С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 2',
            'string.max': 'Р СљР В°Р С”РЎРѓР С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 30',
            'string.empty': 'Р СџР С•Р В»Р Вµ "title" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Р СџР С•Р В»Р Вµ "category" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Р СџР С•Р В»Р Вµ "description" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
        }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Р СљР С‘Р Р…Р С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 2',
            'string.max': 'Р СљР В°Р С”РЎРѓР С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Р СњР ВµР Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р в„– id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Р СљР С‘Р Р…Р С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 2',
            'string.max': 'Р СљР В°Р С”РЎРѓР С‘Р СР В°Р В»РЎРЉР Р…Р В°РЎРЏ Р Т‘Р В»Р С‘Р Р…Р В° Р С—Р С•Р В»РЎРЏ "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Р СџР С•Р В»Р Вµ "password" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Р СџР С•Р В»Р Вµ "email" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р С email-Р В°Р Т‘РЎР‚Р ВµРЎРѓР С•Р С')
            .messages({
                'string.empty': 'Р СџР С•Р В»Р Вµ "email" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('Р СџР С•Р В»Р Вµ "email" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р Р†Р В°Р В»Р С‘Р Т‘Р Р…РЎвЂ№Р С email-Р В°Р Т‘РЎР‚Р ВµРЎРѓР С•Р С')
            .messages({
                'string.required': 'Р СџР С•Р В»Р Вµ "email" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'Р СџР С•Р В»Р Вµ "password" Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ Р В·Р В°Р С—Р С•Р В»Р Р…Р ВµР Р…Р С•',
        }),
    }),
})
const objectId = Joi.string().custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
        return value
    }
    return helpers.message({ custom: 'Невалидный id' })
})

export const validateUserUpdateBody = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(30),
            email: Joi.string().email(),
            phone: Joi.string().max(30),
        })
        .min(1)
        .unknown(false),
})

export const validateCustomerUpdateBody = celebrate({
    body: Joi.object()
        .keys({
            name: Joi.string().min(2).max(30),
            email: Joi.string().email(),
            phone: Joi.string().max(30),
        })
        .min(1)
        .unknown(false),
})

export const validateCustomerId = celebrate({
    params: Joi.object()
        .keys({
            id: objectId.required(),
        })
        .unknown(false),
})

export const validateOrderFilters = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1).max(100),
            sortField: Joi.string().valid(
                'createdAt',
                'orderNumber',
                'status',
                'totalAmount'
            ),
            sortOrder: Joi.string().valid('asc', 'desc'),
            status: Joi.string(),
            totalAmountFrom: Joi.number().min(0),
            totalAmountTo: Joi.number().min(0),
            orderDateFrom: Joi.date().iso(),
            orderDateTo: Joi.date().iso(),
            search: Joi.string().max(100),
        })
        .unknown(false),
})

export const validateCustomerFilters = celebrate({
    query: Joi.object()
        .keys({
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1).max(100),
            sortField: Joi.string().valid(
                'createdAt',
                'lastOrderDate',
                'totalAmount',
                'orderCount'
            ),
            sortOrder: Joi.string().valid('asc', 'desc'),
            registrationDateFrom: Joi.date().iso(),
            registrationDateTo: Joi.date().iso(),
            lastOrderDateFrom: Joi.date().iso(),
            lastOrderDateTo: Joi.date().iso(),
            totalAmountFrom: Joi.number().min(0),
            totalAmountTo: Joi.number().min(0),
            orderCountFrom: Joi.number().integer().min(0),
            orderCountTo: Joi.number().integer().min(0),
            search: Joi.string().max(100),
        })
        .unknown(false),
})
