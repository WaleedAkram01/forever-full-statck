import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import Title from './Title'
import { ProductGrid } from './ProductItem'

function LatestCollection() {
    const { products, productsLoading } = useContext(ShopContext)
    const latest = useMemo(() => [...products].sort((a, b) => b.date - a.date).slice(0, 8), [products])

    return (
        <section className="container-page mt-24">
            <Title eyebrow="Just landed" title="New arrivals" subtitle="Fresh pieces added this season, from crisp shirts to warm outerwear." />
            <ProductGrid items={latest} loading={productsLoading} />
            <div className="mt-12 text-center">
                <Link to="/collection" className="btn-outline">View all products</Link>
            </div>
        </section>
    )
}

export default LatestCollection
