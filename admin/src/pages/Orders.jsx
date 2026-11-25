import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl, formatPrice, ORDER_STATUSES } from '../config.js'

const statusColor = {
    'Order Placed': 'bg-sand text-ink',
    Packing: 'bg-amber-100 text-amber-800',
    Shipped: 'bg-blue-100 text-blue-800',
    'Out for delivery': 'bg-indigo-100 text-indigo-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-rust-light text-rust',
}

const Orders = ({ token, isDemo, onAuthError }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
            .then(({ data }) => setOrders(data.orders || []))
            .catch((error) => {
                if (error.response?.status === 401) onAuthError()
                else toast.error('Could not load orders')
            })
            .finally(() => setLoading(false))
    }, [token, onAuthError])

    const statusHandler = async (orderId, status) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/order/status', { orderId, status }, { headers: { token } })
            setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)))
            toast.success(data.message)
        } catch (error) {
            if (error.response?.status === 401) onAuthError()
            else toast.error(error.response?.data?.message || 'Could not update status')
        }
    }

    const visible = useMemo(() => (filter === 'All' ? orders : orders.filter((o) => o.status === filter)), [orders, filter])

    return (
        <div>
            <h1 className="text-3xl font-semibold">Orders</h1>
            <p className="mt-1 text-sm text-muted">{orders.length} orders in total</p>

            <div className="mt-6 flex flex-wrap gap-2">
                {['All', ...ORDER_STATUSES].map((s) => (
                    <button key={s} onClick={() => setFilter(s)} className={`rounded-full border px-3 py-1.5 text-xs transition ${filter === s ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`}>
                        {s} {s !== 'All' && <span className="opacity-60">({orders.filter((o) => o.status === s).length})</span>}
                    </button>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                {loading && <div className="card h-32 animate-pulse bg-sand" />}
                {!loading && visible.length === 0 && <div className="card px-5 py-12 text-center text-sm text-muted">No orders here.</div>}
                {visible.map((order) => (
                    <article key={order._id} className="card grid gap-5 p-5 lg:grid-cols-[2fr_1.3fr_1fr]">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                                <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor[order.status] || 'bg-sand'}`}>{order.status}</span>
                                <span className="text-xs text-muted">{new Date(order.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {order.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        {item.image?.[0] && <img src={item.image[0]} alt="" className="h-12 w-10 rounded object-cover" />}
                                        <span className="flex-1">{item.name} <span className="text-muted">· {item.size} × {item.quantity}</span></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="text-sm">
                            <p className="label">Ship to</p>
                            <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                            <p className="text-muted">{order.address.street}</p>
                            <p className="text-muted">{order.address.city}, {order.address.state}, {order.address.country}</p>
                            <p className="text-muted">{order.address.phone}</p>
                        </div>
                        <div className="flex flex-col gap-3 text-sm">
                            <div>
                                <p className="label">Total</p>
                                <p className="text-lg font-semibold">{formatPrice(order.amount)}</p>
                                <p className="text-muted">{order.paymentMethod} · {order.payment ? 'Paid' : 'Payment due'}</p>
                            </div>
                            <select disabled={isDemo} value={order.status} onChange={(e) => statusHandler(order._id, e.target.value)} className="input disabled:opacity-60" title={isDemo ? 'Disabled in demo mode' : 'Update status'}>
                                {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Orders
