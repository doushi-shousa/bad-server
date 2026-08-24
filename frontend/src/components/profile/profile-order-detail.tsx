import Button from '@components/button'
import DetailInfo from '@components/detail-info'
import { OrderData } from '@slices/orders/type'
import clsx from 'clsx'
import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from '../../services/hooks'
import { selectOrderByNumber } from '../../services/selector'
import { getCurrentUserOrderByNumber } from '../../services/slice/profile-orders/thunk'
import { adapterOrderFromServer } from '../../utils/adapterOrderFromServer'
import { Preloader } from '../preloader'
import styles from './profile.module.scss'

const CloseButton = () => {
    const navigate = useNavigate()
    return <Button onClick={() => navigate(-1)}>Р СџР С•Р Р…РЎРЏРЎвЂљР Р…Р С•!</Button>
}

export default function ProfileOrderDetail() {
    const number = useParams().number || ''
    const dispatch = useDispatch()
    const orderData = useSelector(selectOrderByNumber(+number))
    console.log(orderData)

    useEffect(() => {
        if (!orderData) {
            dispatch(getCurrentUserOrderByNumber(number))
        }
    }, [dispatch, orderData, number])

    const orderHeaders = useMemo(
        () => [
            {
                key: 'productNames',
                label: 'Р СћР С•Р Р†Р В°РЎР‚РЎвЂ№',
                render: (dataInfo: OrderData) => (
                    <ul className={styles.profile__dataList}>
                        {dataInfo.productNames.map(
                            (element: string, idx: number) => (
                                <li key={idx}>{element}</li>
                            )
                        )}
                    </ul>
                ),
            },
            { key: 'totalAmount', label: 'Р РЋРЎвЂљР С•Р С‘Р СР С•РЎРѓРЎвЂљРЎРЉ' },
            {
                key: 'status',
                label: 'Р РЋРЎвЂљР В°РЎвЂљРЎС“РЎРѓ Р В·Р В°Р С”Р В°Р В·Р В°',
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
            { key: 'payment', label: 'Р РЋР С—Р С•РЎРѓР С•Р В± Р С•Р С—Р В»Р В°РЎвЂљРЎвЂ№' },
            {
                key: 'deliveryAddress',
                label: 'Р С’Р Т‘РЎР‚Р ВµРЎРѓ Р Т‘Р С•РЎРѓРЎвЂљР В°Р Р†Р С”Р С‘',
                extraClass: styles.profile__gridRowFullWidth,
            },
            {
                key: 'comment',
                label: 'Р вЂ™Р В°РЎв‚¬ Р С”Р С•Р СР СР ВµР Р…РЎвЂљР В°РЎР‚Р С‘Р в„– Р С” Р В·Р В°Р С”Р В°Р В·РЎС“',
                extraClass: styles.profile__gridRowFullWidth,
                render: (dataInfo: OrderData) => (
                    <>
                        {dataInfo.comment ? (
                            <div>{dataInfo.comment}</div>
                        ) : (
                            'Р С™Р С•Р СР СР ВµР Р…РЎвЂљР В°РЎР‚Р С‘Р ВµР Р† Р Р…Р ВµРЎвЂљ'
                        )}
                    </>
                ),
            },
        ],
        [orderData]
    )

    if (!orderData) {
        return <Preloader />
    }

    return (
        <DetailInfo
            header={`Р вЂ”Р В°Р С”Р В°Р В· РІвЂћвЂ“ ${orderData.orderNumber}`}
            subheader={`Р С•РЎвЂљ ${format(new Date(orderData.createdAt), 'dd.MM.yyyy')}`}
            data={adapterOrderFromServer(orderData)}
            headers={orderHeaders}
            actions={[CloseButton]}
        />
    )
}
