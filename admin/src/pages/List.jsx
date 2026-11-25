import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl, formatPrice } from '../config.js'

const List = ({ token, isDemo, onAuthError }) => {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All')

    const fetchList = () =>
        axios.get(backendUrl + '/api/product/list')
            .then(({ data }) => setList(data.products || []))
            .catch(() => toast.error('Could not load products'))
            .finally(() => setLoading(false))

    useEffect(() => { fetchList() }, [])

    const removeProduct = async (item) => {
        if (!window.confirm(`Delete “${item.name}”? This also removes its images.`)) return
        try {
            const { data } = await axios.post(backendUrl + '/api/product/remove', { id: item._id }, { headers: { token } })
            toast.success(data.message)
            setList((prev) => prev.filter((p) => p._id !== item._id))
        } catch (error) {
            if (error.response?.status === 401) onAuthError()
            else toast.error(error.response?.data?.message || 'Could not delete product')
        }
    }

    const filtered = useMemo(() => list.filter((p) =>
        (category === 'All' || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase()),
    ), [list, query, category])

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold">Products</h1>
                    <p className="mt-1 text-sm text-muted">{list.length} products in the store</p>
                </div>
                <Link to="/add" className="btn-primary">+ Add product</Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input className="input sm:max-w-xs" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="input sm:w-40" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {['All', 'Men', 'Women', 'Kids'].map((c) => <option key={c}>{c}</option>)}
                </select>
            </div>

            <div className="card mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-muted">
                        <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Sizes</th><th className="px-4 py-3">Price</th><th className="px-4 py-3 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {loading && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">Loading…</td></tr>}
                        {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No products match your search.</td></tr>}
                        {filtered.map((item) => (
                            <tr key={item._id} className="hover:bg-cream">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img className="h-14 w-11 rounded object-cover" src={item.image[0]} alt="" />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.bestseller && <span className="text-xs text-rust">Bestseller</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-muted">{item.category} · {item.subCategory}</td>
                                <td className="px-4 py-3 text-muted">{item.sizes.join(', ')}</td>
                                <td className="px-4 py-3 font-medium">{formatPrice(item.price)}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => removeProduct(item)} disabled={isDemo} title={isDemo ? 'Disabled in demo mode' : 'Delete product'} className="rounded-md px-3 py-1.5 text-sm text-rust hover:bg-rust-light disabled:cursor-not-allowed disabled:opacity-40">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default List
