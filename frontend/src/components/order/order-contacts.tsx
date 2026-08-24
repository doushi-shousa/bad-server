import InputMask from '@mona-health/react-input-mask'
import { SyntheticEvent, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppRoute } from '../../utils/constants'
import Button from '../button/button'
import { Input } from '../form'
import Form from '../form/form'
import useFormWithValidation from '../form/hooks/useFormWithValidation'
import { ContactsFormValues } from './helpers/types'

import { useActionCreators, useSelector } from '../../services/hooks'
import { basketActions } from '../../services/slice/basket'
import {
    orderFormActions,
    orderFormSelector,
} from '../../services/slice/orderForm'
import EditorInput from '../editor-text/editor-input'
import styles from './order.module.scss'

export function OrderContacts() {
    const location = useLocation()
    const navigate = useNavigate()
    const { selectOrderInfo } = orderFormSelector
    const orderPersistData = useSelector(selectOrderInfo)
    const formRef = useRef<HTMLFormElement | null>(null)
    const { setInfo, createOrder } = useActionCreators(orderFormActions)
    const { resetBasket } = useActionCreators(basketActions)

    const { values, handleChange, errors, isValid, setValuesForm } =
        useFormWithValidation<ContactsFormValues>(
            { email: '', phone: '', comment: '' },
            formRef.current
        )

    useEffect(() => {
        // РІРѕСЃСЃС‚Р°РЅР°РІР»РёРІР°РµРј Р·РЅР°С‡РµРЅРёРµ С„РѕСЂРјС‹ РёР· СЃС‚РѕСЂР°
        setValuesForm({
            email: orderPersistData.email,
            phone: orderPersistData.phone,
        })
    }, [orderPersistData, setValuesForm])

    const handleEditInputChange = (value: string) => {
        setValuesForm({ ...values, comment: value })
    }

    const handleFormSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setInfo(values)
        // С‚.Рє. РЅР° РјРѕРјРµРЅС‚ РѕС‚РїСЂР°РІРєРё Р·Р°РїСЂРѕСЃР° РґР°РЅРЅС‹Рµ РІРІРµРґРµРЅРЅС‹Рµ РІ РїРѕР»СЏ РµС‰Рµ РЅРµ Р·Р°РїРёСЃР°РЅС‹ РІ store, РґРѕР±Р°РІР»СЏРµРј РІ Р·Р°РїСЂРѕСЃ РёС… РІСЂСѓС‡РЅСѓСЋ
        createOrder({ ...orderPersistData, ...values })
            .unwrap()
            .then((dataResponse) => {
                resetBasket()
                navigate(
                    { pathname: AppRoute.OrderSuccess },
                    {
                        state: {
                            orderResponse: dataResponse,
                            background: {
                                ...location,
                                pathname: '/',
                                state: null,
                            },
                        },
                        replace: true,
                    }
                )
            })
    }

    return (
        <Form handleFormSubmit={handleFormSubmit} formRef={formRef}>
            <Input
                value={values.email || ''}
                onChange={handleChange}
                name='email'
                type='email'
                placeholder='Р’РІРµРґРёС‚Рµ Email'
                label='Email'
                required
                error={errors.email}
            />
            <Input
                value={values.phone || ''}
                onChange={handleChange}
                name='phone'
                type='tel'
                placeholder='+7 (999) 999-99-99'
                mask='+7 (999) 999 99 99'
                label='РўРµР»РµС„РѕРЅ'
                required
                error={errors.phone}
                component={InputMask}
            />

            <EditorInput
                onChange={handleEditInputChange}
                value={values.comment}
            />

            <div className={styles.order__buttons}>
                <Button
                    type='button'
                    extraClass={styles.order__button_secondary}
                    component={Link}
                    to={{ pathname: AppRoute.OrderAddress }}
                    state={{
                        background: { ...location, pathname: '/', state: null },
                    }}
                    replace
                >
                    РќР°Р·Р°Рґ
                </Button>
                <Button type='submit' disabled={!isValid}>
                    РћРїР»Р°С‚РёС‚СЊ
                </Button>
            </div>
        </Form>
    )
}
