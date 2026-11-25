import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/shop'

const STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']

const Orders = () => {
    const { backendUrl, token, formatPrice, navigate, logout } = useContext(ShopContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // Returns a promise so it can be used both from the effect and the Refresh button
    const fetchOrders = useCallback(() => {
        return axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
            .then(({ data }) => { if (data.success) setOrders(data.orders) })
            .catch((error) => { if (error.response?.status === 401) logout('Your session expired. Please sign in again.') })
            .finally(() => setLoading(false))
    }, [backendUrl, token, logout])

    const loadOrders = () => {
        setLoading(true)
        fetchOrders()
    }

    useEffect(() => {
        if (!token) {
            navigate('/login?next=/orders')
            return
        }
        fetchOrders()
    }, [token, navigate, fetchOrders])

    return (
        <div className="container-page pt-10">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="eyebrow">Account</p>
                    <h1 className="mt-2 text-4xl font-medium">My orders</h1>
                </div>
                <button onClick={loadOrders} className="text-sm underline underline-offset-4">Refresh</button>
            </div>

            {loading ? (
                <div className="mt-10 space-y-4">{[0, 1].map((i) => <div key={i} className="skeleton h-40" />)}</div>
            ) : orders.length === 0 ? (
                <div className="mt-10 border border-dashed border-line px-6 py-20 text-center">
                    <p className="font-display text-2xl">No orders yet</p>
                    <p className="mt-2 text-sm text-muted">When you place an order, you can track it here.</p>
                    <Link to="/collection" className="btn-primary mt-6">Start shopping</Link>
                </div>
            ) : (
                <div className="mt-10 space-y-6">
                    {orders.map((order) => {
                        const step = STEPS.indexOf(order.status)
                        return (
                            <article key={order._id} className="card">
                                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 text-sm">
                                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                                        <span><span className="text-muted">Order</span> #{order._id.slice(-6).toUpperCase()}</span>
                                        <span><span className="text-muted">Placed</span> {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span><span className="text-muted">Total</span> {formatPrice(order.amount)}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-medium ${order.payment ? 'bg-sage/15 text-sage' : 'bg-rust-light text-rust'}`}>
                                        {order.paymentMethod === 'COD' ? 'Cash on delivery' : 'Card'} · {order.payment ? 'Paid' : 'Payment due'}
                                    </span>
                                </header>

                                <ul className="divide-y divide-line px-5">
                                    {order.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 py-4">
                                            <img src={item.image?.[0]} alt={item.name} className="aspect-[4/5] w-16 bg-sand object-cover" />
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-muted">Size {item.size} · Qty {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                                        </li>
                                    ))}
                                </ul>

                                <footer className="border-t border-line px-5 py-5">
                                    {order.status === 'Cancelled' ? (
                                        <p className="text-sm font-medium text-rust">This order was cancelled</p>
                                    ) : (
                                        <ol className="grid grid-cols-5 gap-2">
                                            {STEPS.map((s, i) => (
                                                <li key={s} className="text-[11px] sm:text-xs">
                                                    <div className={`h-1.5 ${i <= step ? 'bg-rust' : 'bg-line'}`} />
                                                    <p className={`mt-2 ${i <= step ? 'font-medium text-ink' : 'text-muted'}`}>{s}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </footer>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Orders
