import OpenInNewIcon from '@assets/open_in_new.svg?react'
import Button from '@components/button'
import DetailInfo from '@components/detail-info'
import { OrderData } from '@slices/orders/type'
import { useActionCreators, useDispatch, useSelector } from '@store/hooks'
import { StatusType } from '@types'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { selectOrderByNumber } from '../../services/selector'
import { ordersActions } from '../../services/slice/orders'
import { getOrderByNumber } from '../../services/slice/orders/thunk'
import { adapterOrderFromServer } from '../../utils/adapterOrderFromServer'
import { Preloader } from '../preloader'
import styles from './admin.module.scss'

const ActionsButton = () => {
    const number = useParams().number || ''
    const navigate = useNavigate()
    const { updateOrderById } = useActionCreators(ordersActions)
    const handleUpdateOrder = (status: StatusType) => {
        updateOrderById({ status, orderNumber: number })
        navigate(-1)
    }
    return (
        <>
            <Button
                extraClass={styles.admin__button_secondary}
                onClick={() => handleUpdateOrder(StatusType.Cancelled)}
            >
                Р В РЎвЂєР РЋРІР‚С™Р В РЎВР В Р’ВµР В Р вЂ¦Р В РЎвЂР РЋРІР‚С™Р РЋР Р‰
            </Button>
            <Button
                extraClass={styles.admin__button_secondary}
                onClick={() => handleUpdateOrder(StatusType.Delivering)}
            >
                Р В РІР‚СњР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В Р’В°Р В Р вЂ Р В РЎвЂР РЋРІР‚С™Р РЋР Р‰
            </Button>
            <Button
                extraClass={styles.admin__button_secondary}
                onClick={() => handleUpdateOrder(StatusType.Completed)}
            >
                Р В РІР‚вЂќР В Р’В°Р В Р вЂ Р В Р’ВµР РЋР вЂљР РЋРІвЂљВ¬Р В РЎвЂР РЋРІР‚С™Р РЋР Р‰
            </Button>
        </>
    )
}

export default function AdminOrderDetail() {
    const navigate = useNavigate()
    const number = useParams().number || ''
    const dispatch = useDispatch()
    const orderData = useSelector(selectOrderByNumber(+number))

    useEffect(() => {
        if (!orderData) {
            dispatch(getOrderByNumber(number))
        }
    }, [dispatch, orderData, number])

    const orderHeaders = useMemo(
        () => [
            {
                key: 'customer',
                label: 'Р В РЎСџР В РЎвЂўР В РЎвЂќР РЋРЎвЂњР В РЎвЂ”Р В Р’В°Р РЋРІР‚С™Р В Р’ВµР В Р’В»Р РЋР Р‰',
                render: (dataInfo: OrderData) => (
                    <div className={styles.admin__gridCell}>
                        <span>{dataInfo.customer}</span>
                        <OpenInNewIcon
                            onClick={() =>
                                navigate(`/admin/customer/${dataInfo.key}`)
                            }
                        />
                    </div>
                ),
            },
            { key: 'payment', label: 'Р В Р Р‹Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р В РЎвЂўР В Р’В± Р В РЎвЂўР В РЎвЂ”Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р РЋРІР‚в„–' },
            {
                key: 'deliveryAddress',
                label: 'Р В РЎвЂ™Р В РўвЂР РЋР вЂљР В Р’ВµР РЋР С“ Р В РўвЂР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В Р’В°Р В Р вЂ Р В РЎвЂќР В РЎвЂ',
                extraClass: styles.admin__gridRowFullWidth,
            },
            {
                key: 'status',
                label: 'Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В·Р В Р’В°',
                render: (dataInfo: OrderData) => (
                    <span
                        className={clsx({
                            [styles[orderData!.status]]: dataInfo.status,
                        })}
                    >
                        {dataInfo.status}
                    </span>
                ),
            },
            { key: 'totalAmount', label: 'Р В Р Р‹Р РЋРЎвЂњР В РЎВР В РЎВР В Р’В° Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В·Р В Р’В°' },
            {
                key: 'comment',
                label: 'Р В РЎв„ўР В РЎвЂўР В РЎВР В РЎВР В Р’ВµР В Р вЂ¦Р РЋРІР‚С™Р В Р’В°Р РЋР вЂљР В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂќ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В·Р РЋРЎвЂњ',
                extraClass: styles.profile__gridRowFullWidth,
                render: (dataInfo: OrderData) => (
                    <>
                        <div>{dataInfo.comment}</div>
                    </>
                ),
            },
            {
                key: 'productNames',
                label: 'Р В РЎС›Р В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР вЂљР РЋРІР‚в„–',
                render: (dataInfo: OrderData) => (
                    <ul className={styles.admin__dataList}>
                        {dataInfo.productNames.map(
                            (element: string, idx: number) => (
                                <li key={idx}>{element}</li>
                            )
                        )}
                    </ul>
                ),
                extraClass: styles.admin__gridRowFullWidth,
            },
        ],
        [navigate, orderData]
    )

    if (!orderData) {
        return <Preloader />
    }

    return (
        <DetailInfo
            header={`Р В РІР‚вЂќР В Р’В°Р В РЎвЂќР В Р’В°Р В Р’В· Р Р†РІР‚С›РІР‚вЂњ ${orderData.orderNumber}`}
            subheader={`Р В РЎвЂўР РЋРІР‚С™ ${format(new Date(orderData.createdAt), 'dd.MM.yyyy')}`}
            data={adapterOrderFromServer(orderData)}
            headers={orderHeaders}
            actions={[ActionsButton]}
        />
    )
}
