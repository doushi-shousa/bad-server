import { ordersActions, ordersSelector } from '@slices/orders'
import { useActionCreators, useDispatch, useSelector } from '@store/hooks'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchOrdersWithFilters } from '../../services/slice/orders/thunk'
import { FiltersOrder } from '../../services/slice/orders/type'
import { AppRoute } from '../../utils/constants'
import Filter from '../filter'
import styles from './admin.module.scss'
import { ordersFilterFields } from './helpers/ordersFilterFields'

export default function AdminFilterOrders() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [_, setSearchParams] = useSearchParams()

    const { updateFilter, clearFilters } = useActionCreators(ordersActions)
    const filterOrderOption = useSelector(ordersSelector.selectFilterOption)

    const handleFilter = (filters: Record<string, unknown>) => {
        const rawStatus = filters.status
        const status =
            typeof rawStatus === 'object' &&
            rawStatus !== null &&
            'value' in rawStatus
                ? rawStatus.value
                : rawStatus

        dispatch(
            updateFilter({
                ...filters,
                status,
            } as unknown as FiltersOrder)
        )

        const queryParams: Record<string, string> = {}
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (
                    typeof value === 'object' &&
                    'value' in value &&
                    value.value !== undefined
                ) {
                    queryParams[key] = String(value.value)
                } else {
                    queryParams[key] = String(value)
                }
            }
        })
        setSearchParams(queryParams)
        navigate(
            `${AppRoute.AdminOrders}?${new URLSearchParams(queryParams).toString()}`
        )
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
        setSearchParams({})
        dispatch(fetchOrdersWithFilters({}))
        navigate(AppRoute.AdminOrders)
    }

    return (
        <>
            <h2 className={styles.admin__title}>Р¤РёР»СЊС‚СЂС‹</h2>
            <Filter
                fields={ordersFilterFields}
                onFilter={handleFilter}
                onClear={handleClearFilters}
                defaultValue={filterOrderOption}
            />
        </>
    )
}
