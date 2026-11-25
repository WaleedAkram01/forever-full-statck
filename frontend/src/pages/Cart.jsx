import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import CartTotal from '../components/CartTotal'
import { BagIcon, TrashIcon } from '../components/Icons'

const Cart = () => {
    const { products, cartItems, updateQuantity, navigate, formatPrice, token } = useContext(ShopContext)

    const lines = useMemo(() => {
        const result = []
        for (const id in cartItems) {
            const product = products.find((p) => p._id === id)
            if (!product) continue
            for (const size in cartItems[id]) {
                if (cartItems[id][size] > 0) result.push({ product, size, quantity: cartItems[id][size] })
            }
        }
        return result
    }, [cartItems, products])

    if (lines.length === 0) {
        return (
            <div className="container-page py-24 text-center">
                <BagIcon size={40} className="mx-auto text-muted" />
                <h1 className="mt-6 text-3xl font-medium">Your bag is empty</h1>
                <p className="mt-2 text-muted">Find something you love and it will show up here.</p>
                <Link to="/collection" className="btn-primary mt-8">Start shopping</Link>
            </div>
        )
    }

    return (
        <div className="container-page pt-10">
            <h1 className="text-4xl font-medium">Your bag</h1>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
                <ul className="divide-y divide-line border-y border-line">
                    {lines.map(({ product, size, quantity }) => (
                        <li key={product._id + size} className="flex gap-5 py-6">
                            <Link to={`/product/${product._id}`} className="w-24 flex-shrink-0 bg-sand sm:w-28">
                                <img src={product.image[0]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
                            </Link>
                            <div className="flex flex-1 flex-col">
                                <div className="flex justify-between gap-4">
                                    <div>
                                        <Link to={`/product/${product._id}`} className="font-medium hover:text-rust">{product.name}</Link>
                                        <p className="mt-1 text-sm text-muted">Size {size} · {formatPrice(product.price)}</p>
                                    </div>
                                    <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-4">
                                    <div className="flex items-center border border-line bg-white">
                                        <button onClick={() => updateQuantity(product._id, size, quantity - 1)} className="h-9 w-9 text-lg hover:bg-sand" aria-label="Decrease">−</button>
                                        <span className="w-8 text-center text-sm">{quantity}</span>
                                        <button onClick={() => updateQuantity(product._id, size, Math.min(quantity + 1, 20))} className="h-9 w-9 text-lg hover:bg-sand" aria-label="Increase">+</button>
                                    </div>
                                    <button onClick={() => updateQuantity(product._id, size, 0)} className="flex items-center gap-1.5 text-sm text-muted hover:text-rust">
                                        <TrashIcon size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <aside className="card h-fit p-6">
                    <CartTotal />
                    <button onClick={() => navigate(token ? '/place-order' : '/login?next=/place-order')} className="btn-primary mt-6 w-full">
                        {token ? 'Checkout' : 'Sign in to checkout'}
                    </button>
                    <p className="mt-4 text-center text-xs text-muted">Cash on delivery and card payments accepted</p>
                </aside>
            </div>
        </div>
    )
}

export default Cart
