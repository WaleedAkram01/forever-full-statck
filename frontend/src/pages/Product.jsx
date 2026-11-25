import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import RelatedProducts from '../components/RelatedProducts'
import { ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'

export default function Product() {
    const { productId } = useParams()
    const { products, productsLoading, addToCart, formatPrice } = useContext(ShopContext)
    const product = useMemo(() => products.find((p) => p._id === productId), [products, productId])
    const [selection, setSelection] = useState({ id: null, image: '', size: '' })
    const [tab, setTab] = useState('details')
    const current = selection.id === productId ? selection : { id: productId, image: '', size: '' }
    const image = current.image || product?.image[0] || ''
    const size = current.size
    const setImage = (img) => setSelection({ ...current, image: img })
    const setSize = (s) => setSelection({ ...current, size: s })

    useEffect(() => {
        if (product) document.title = `${product.name} | Kapra`
        return () => { document.title = 'Kapra | Everyday Clothing, Made to Last' }
    }, [product])

    if (productsLoading) {
        return (
            <div className="container-page grid gap-10 pt-10 md:grid-cols-2">
                <div className="skeleton aspect-[4/5]" />
                <div className="space-y-4"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-6 w-1/4" /><div className="skeleton h-24" /></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container-page py-24 text-center">
                <p className="font-display text-3xl">Product not found</p>
                <p className="mt-2 text-muted">It may have sold out or been removed.</p>
                <Link to="/collection" className="btn-primary mt-8">Back to shop</Link>
            </div>
        )
    }

    return (
        <div className="container-page pt-8">
            <nav className="mb-6 text-xs text-muted">
                <Link to="/" className="hover:text-ink">Home</Link> / <Link to={`/collection?category=${product.category}`} className="hover:text-ink">{product.category}</Link> / <span className="text-ink">{product.name}</span>
            </nav>

            <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
                {/* Gallery */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <div className="no-scrollbar flex gap-3 overflow-x-auto sm:w-20 sm:flex-col">
                        {product.image.map((src) => (
                            <button key={src} onClick={() => setImage(src)} className={`aspect-[4/5] w-20 flex-shrink-0 overflow-hidden border-2 ${src === image ? 'border-ink' : 'border-transparent'}`}>
                                <img src={src} alt="" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 bg-sand">
                        <img src={image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
                    </div>
                </div>

                {/* Details */}
                <div className="md:pt-4">
                    <p className="eyebrow">{product.category} · {product.subCategory}</p>
                    <h1 className="mt-3 text-4xl font-medium leading-tight">{product.name}</h1>
                    <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
                    <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

                    <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between text-sm">
                            <span className="font-medium">Size{size && `: ${size}`}</span>
                            <span className="text-muted">Regular fit, true to size</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((s) => (
                                <button key={s} onClick={() => setSize(s)} className={`h-12 min-w-12 border px-4 text-sm transition ${s === size ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => addToCart(product._id, size)} className="btn-primary mt-8 w-full py-4">
                        {size ? 'Add to bag' : 'Select a size'}
                    </button>

                    <ul className="mt-8 grid gap-4 border-y border-line py-6 text-sm sm:grid-cols-3">
                        <li className="flex items-center gap-3"><TruckIcon size={20} className="text-rust" /> Delivery in 2–4 days</li>
                        <li className="flex items-center gap-3"><ReturnIcon size={20} className="text-rust" /> 7-day exchanges</li>
                        <li className="flex items-center gap-3"><ShieldIcon size={20} className="text-rust" /> COD or card</li>
                    </ul>

                    <div className="mt-6">
                        <div className="flex gap-6 border-b border-line text-sm">
                            {['details', 'care', 'delivery'].map((t) => (
                                <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 capitalize ${tab === t ? 'border-ink font-medium' : 'border-transparent text-muted'}`}>{t}</button>
                            ))}
                        </div>
                        <div className="pt-4 text-sm leading-relaxed text-muted">
                            {tab === 'details' && <p>{product.description} Designed in Lahore and cut for an easy, everyday fit.</p>}
                            {tab === 'care' && <p>Machine wash cold with similar colours. Do not bleach. Tumble dry low or dry flat. Warm iron if needed.</p>}
                            {tab === 'delivery' && <p>Flat Rs. 250 delivery across Pakistan, 2 to 4 working days. Pay by card or cash on delivery. Exchanges accepted within 7 days of delivery.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <RelatedProducts productId={product._id} category={product.category} subCategory={product.subCategory} />
        </div>
    )
}
