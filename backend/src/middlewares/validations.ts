import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^(\+\d+)?(?:\s|-?|\(?\d+\)?)+$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// РІР°Р»РёРґР°С†РёСЏ id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'РќРµРІР°Р»РёРґРЅС‹Р№ id' })
                })
            )
            .messages({
                'array.empty': 'РќРµ СѓРєР°Р·Р°РЅС‹ С‚РѕРІР°СЂС‹',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'РЈРєР°Р·Р°РЅРѕ РЅРµ РІР°Р»РёРґРЅРѕРµ Р·РЅР°С‡РµРЅРёРµ РґР»СЏ СЃРїРѕСЃРѕР±Р° РѕРїР»Р°С‚С‹, РІРѕР·РјРѕР¶РЅС‹Рµ Р·РЅР°С‡РµРЅРёСЏ - "card", "online"',
                'string.empty': 'РќРµ СѓРєР°Р·Р°РЅ СЃРїРѕСЃРѕР± РѕРїР»Р°С‚С‹',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'РќРµ СѓРєР°Р·Р°РЅ email',
        }),
        phone: Joi.string().required().pattern(phoneRegExp).messages({
            'string.empty': 'РќРµ СѓРєР°Р·Р°РЅ С‚РµР»РµС„РѕРЅ',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'РќРµ СѓРєР°Р·Р°РЅ Р°РґСЂРµСЃ',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'РќРµ СѓРєР°Р·Р°РЅР° СЃСѓРјРјР° Р·Р°РєР°Р·Р°',
        }),
        comment: Joi.string().max(2000).optional().allow(''),
    }),
})

// РІР°Р»РёРґР°С†РёСЏ С‚РѕРІР°СЂР°.
// name Рё link - РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ, name - РѕС‚ 2 РґРѕ 30 СЃРёРјРІРѕР»РѕРІ, link - РІР°Р»РёРґРЅС‹Р№ url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'РњРёРЅРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 2',
            'string.max': 'РњР°РєСЃРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 30',
            'string.empty': 'РџРѕР»Рµ "title" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'РџРѕР»Рµ "category" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'РџРѕР»Рµ "description" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
        }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'РњРёРЅРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 2',
            'string.max': 'РњР°РєСЃРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 30',
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
                return helpers.message({ any: 'РќРµРІР°Р»РёРґРЅС‹Р№ id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'РњРёРЅРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 2',
            'string.max': 'РњР°РєСЃРёРјР°Р»СЊРЅР°СЏ РґР»РёРЅР° РїРѕР»СЏ "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'РџРѕР»Рµ "password" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('РџРѕР»Рµ "email" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РІР°Р»РёРґРЅС‹Рј email-Р°РґСЂРµСЃРѕРј')
            .messages({
                'string.empty': 'РџРѕР»Рµ "email" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('РџРѕР»Рµ "email" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РІР°Р»РёРґРЅС‹Рј email-Р°РґСЂРµСЃРѕРј')
            .messages({
                'string.required': 'РџРѕР»Рµ "email" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'РџРѕР»Рµ "password" РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅРѕ',
        }),
    }),
})
