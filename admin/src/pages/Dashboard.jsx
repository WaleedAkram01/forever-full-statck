import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl, formatPrice } from '../config.js'

const Stat = ({ label, value, hint }) => (
    <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
)

const Dashboard = ({ token, onAuthError }) => {
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
            axios.get(backendUrl + '/api/product/list'),
        ])
            .then(([o, p]) => {
                setOrders(o.data.orders || [])
                setProducts(p.data.products || [])
            })
            .catch((error) => {
                if (error.response?.status === 401) onAuthError()
                else toast.error('Could not load dashboard data')
            })
            .finally(() => setLoading(false))
    }, [token, onAuthError])

    const stats = useMemo(() => {
        const active = orders.filter((o) => o.status !== 'Cancelled')
        const revenue = active.reduce((sum, o) => sum + o.amount, 0)
        const open = active.filter((o) => o.status !== 'Delivered').length
        const byCategory = ['Men', 'Women', 'Kids'].map((c) => ({ c, n: products.filter((p) => p.category === c).length }))
        return { revenue, open, count: active.length, avg: active.length ? Math.round(revenue / active.length) : 0, byCategory }
    }, [orders, products])

    if (loading) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="card h-28 animate-pulse bg-sand" />)}</div>

    return (
        <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted">An overview of your store.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Revenue" value={formatPrice(stats.revenue)} hint="All non-cancelled orders" />
                <Stat label="Orders" value={stats.count} hint={`${stats.open} still in progress`} />
                <Stat label="Average order" value={formatPrice(stats.avg)} />
                <Stat label="Products" value={products.length} hint={stats.byCategory.map((b) => `${b.c} ${b.n}`).join(' · ')} />
            </div>

            <div className="mt-8 card">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <h2 className="text-lg font-semibold">Recent orders</h2>
                    <Link to="/orders" className="text-sm text-rust hover:underline">View all</Link>
                </div>
                {orders.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-muted">No orders yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wider text-muted">
                                <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Total</th></tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {orders.slice(0, 6).map((o) => (
                                    <tr key={o._id}>
                                        <td className="px-5 py-3 font-medium">#{o._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-5 py-3">{o.address.firstName} {o.address.lastName}</td>
                                        <td className="px-5 py-3 text-muted">{new Date(o.date).toLocaleDateString('en-GB')}</td>
                                        <td className="px-5 py-3">{o.paymentMethod} · {o.payment ? 'Paid' : 'Due'}</td>
                                        <td className="px-5 py-3"><span className="rounded bg-sand px-2 py-1 text-xs">{o.status}</span></td>
                                        <td className="px-5 py-3 text-right font-medium">{formatPrice(o.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
