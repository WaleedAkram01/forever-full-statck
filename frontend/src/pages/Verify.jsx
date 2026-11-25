import { useContext, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/shop'

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const ran = useRef(false)

    useEffect(() => {
        if (!token || ran.current) return
        ran.current = true
        const verifyPayment = async () => {
            try {
                const { data } = await axios.post(
                    backendUrl + '/api/order/verifyStripe',
                    { success: searchParams.get('success'), orderId: searchParams.get('orderId') },
                    { headers: { token } },
                )
                if (data.success) {
                    setCartItems({})
                    toast.success('Payment received. Thank you!')
                    navigate('/orders')
                } else {
                    toast.info('Payment was cancelled. Your bag is still here.')
                    navigate('/cart')
                }
            } catch {
                toast.error('We could not confirm your payment. Please check your orders.')
                navigate('/orders')
            }
        }
        verifyPayment()
    }, [token, backendUrl, navigate, searchParams, setCartItems])

    return (
        <div className="container-page flex flex-col items-center py-32 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-rust" />
            <p className="mt-6 font-display text-2xl">Confirming your payment…</p>
            <p className="mt-2 text-sm text-muted">Please don’t close this page.</p>
        </div>
    )
}

export default Verify
