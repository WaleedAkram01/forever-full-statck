import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/shop'

function ProductItem({ id, image, name, price, bestseller, category }) {
    const { formatPrice } = useContext(ShopContext)
    return (
        <Link to={`/product/${id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <img src={image[0]} alt={name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                {image[1] && (
                    <img src={image[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
                )}
                {bestseller && <span className="absolute left-3 top-3 bg-cream px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest2 text-rust">Bestseller</span>}
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium leading-snug">{name}</p>
                    {category && <p className="mt-0.5 text-xs text-muted">{category}</p>}
                </div>
                <p className="whitespace-nowrap text-sm font-semibold">{formatPrice(price)}</p>
            </div>
        </Link>
    )
}

export function ProductSkeleton() {
    return (
        <div>
            <div className="skeleton aspect-[4/5]" />
            <div className="skeleton mt-3 h-4 w-3/4" />
            <div className="skeleton mt-2 h-3 w-1/3" />
        </div>
    )
}

export function ProductGrid({ items, loading, count = 8, className = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }) {
    return (
        <div className={`grid gap-x-4 gap-y-10 sm:gap-x-6 ${className}`}>
            {loading
                ? Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)
                : items.map((item) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} bestseller={item.bestseller} category={item.category} />
                ))}
        </div>
    )
}

export default ProductItem
