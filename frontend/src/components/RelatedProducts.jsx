import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/shop'
import Title from './Title'
import { ProductGrid } from './ProductItem'

const RelatedProducts = ({ productId, category, subCategory }) => {
    const { products } = useContext(ShopContext)

    // Same category first, then same sub-category, never the product itself
    const related = useMemo(() => {
        const others = products.filter((p) => p._id !== productId)
        const exact = others.filter((p) => p.category === category && p.subCategory === subCategory)
        const similar = others.filter((p) => p.category === category && p.subCategory !== subCategory)
        return [...exact, ...similar].slice(0, 4)
    }, [products, productId, category, subCategory])

    if (related.length === 0) return null
    return (
        <section className="mt-24">
            <Title eyebrow="Complete the look" title="You may also like" />
            <ProductGrid items={related} />
        </section>
    )
}

export default RelatedProducts
