import { useContext } from 'react'
import { ShopContext } from '../context/shop'

const CartTotal = () => {
    const { delivery_fee, getCartAmount, formatPrice } = useContext(ShopContext)
    const subtotal = getCartAmount()
    const shipping = subtotal === 0 ? 0 : delivery_fee

    return (
        <div className="w-full">
            <h3 className="text-xl font-medium">Order summary</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Delivery</span><span>{formatPrice(shipping)}</span></div>
                <div className="mt-2 flex justify-between border-t border-line pt-4 text-base font-semibold">
                    <span>Total</span><span>{formatPrice(subtotal + shipping)}</span>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
