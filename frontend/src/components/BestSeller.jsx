import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/shop'
import Title from './Title'
import { ProductGrid } from './ProductItem'

function BestSeller() {
    const { products, productsLoading } = useContext(ShopContext)
    const best = useMemo(() => products.filter((p) => p.bestseller).slice(0, 4), [products])

    return (
        <section className="container-page mt-24">
            <Title eyebrow="Customer favourites" title="Bestsellers" subtitle="The pieces our customers keep coming back for." />
            <ProductGrid items={best} loading={productsLoading} count={4} />
        </section>
    )
}

export default BestSeller
